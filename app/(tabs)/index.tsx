import VibeModal from "@/components/VibeModal";
import { MEDITATIONS, Meditation } from "@/constants/meditations";
import { useSubscription } from "@/context/SubscriptionContext";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface MeditationCardProps {
  meditation: Meditation;
  index: number;
  isLocked: boolean;
  onPress: () => void;
}

function MeditationCard({
  meditation,
  index,
  isLocked,
  onPress,
}: MeditationCardProps) {
  const { isDark, colors } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isLocked) {
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "#10B981";
      case "intermediate":
        return "#F59E0B";
      case "advanced":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Начинающий";
      case "intermediate":
        return "Средний";
      case "advanced":
        return "Продвинутый";
      default:
        return difficulty;
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <AnimatedTouchable
        style={[styles.card, animatedStyle, { backgroundColor: colors.card }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: meditation.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          {isLocked && (
            <View style={styles.lockedOverlay}>
              <LinearGradient
                colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]}
                style={styles.lockedGradient}
              >
                <View style={styles.lockIconContainer}>
                  <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
                  <Text style={styles.lockedText}>Премиум</Text>
                </View>
              </LinearGradient>
            </View>
          )}
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={14} color="#FFFFFF" />
            <Text style={styles.durationText}>{meditation.duration} мин</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.cardTitle,
              isLocked && styles.lockedTextContent,
              { color: colors.text },
            ]}
          >
            {meditation.title}
          </Text>
          <Text
            style={[
              styles.cardDescription,
              isLocked && styles.lockedTextContent,
              { color: colors.textSecondary },
            ]}
          >
            {meditation.description}
          </Text>
          <View style={styles.difficultyContainer}>
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor:
                    getDifficultyColor(meditation.difficulty) + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(meditation.difficulty) },
                ]}
              >
                {getDifficultyText(meditation.difficulty)}
              </Text>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
}

export default function MeditateScreen() {
  const router = useRouter();
  const { isPremium, subscriptionTier, resetSubscription } = useSubscription();
  const { isDark, colors } = useAppTheme();
  const [vibeModalVisible, setVibeModalVisible] = useState(false);

  const FREE_MEDITATIONS_COUNT = 3;

  const handleCardPress = (meditation: Meditation) => {
    if (meditation.isPremium && !isPremium) {
      router.push("/paywall");
    } else {
      Alert.alert("Медитация", `Запуск: ${meditation.title}`);
    }
  };

  const handleProfileLongPress = () => {
    if (isPremium) {
      Alert.alert(
        "Сброс подписки",
        "Вы уверены, что хотите сбросить подписку для тестирования?",
        [
          { text: "Отмена", style: "cancel" },
          {
            text: "Сбросить",
            style: "destructive",
            onPress: async () => {
              await resetSubscription();
              Alert.alert("Успешно", "Подписка сброшена");
            },
          },
        ],
      );
    }
  };

  const getSubscriptionBadgeText = () => {
    switch (subscriptionTier) {
      case "monthly":
        return "Премиум";
      case "yearly":
        return "Премиум";
      default:
        return "Бесплатно";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={isDark ? ["#1F2937", "#111827"] : ["#F3F4F6", "#FFFFFF"]}
        style={styles.headerGradient}
      >
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                Добро пожаловать
              </Text>
              <Text style={[styles.title, { color: colors.text }]}>
                Медитации
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.profileButton]}
              onLongPress={handleProfileLongPress}
              delayLongPress={1000}
            >
              <View
                style={[
                  styles.profileIcon,
                  { backgroundColor: isDark ? "#1F2937" : "#FFFFFF" },
                ]}
              >
                <Ionicons name="person" size={20} color={colors.primary} />
              </View>
              <View
                style={[
                  styles.subscriptionBadge,
                  isPremium
                    ? styles.premiumBadge
                    : { backgroundColor: isDark ? "#374151" : "#E5E7EB" },
                ]}
              >
                <Text
                  style={[
                    styles.subscriptionBadgeText,
                    isPremium
                      ? styles.premiumBadgeText
                      : { color: colors.textSecondary },
                  ]}
                >
                  {getSubscriptionBadgeText()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.vibeButton}
            onPress={() => setVibeModalVisible(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.vibeGradient}
            >
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              <Text style={styles.vibeButtonText}>AI Настрой дня</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => router.push("/paywall")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bannerGradient}
            >
              <View style={styles.bannerContent}>
                <View style={styles.bannerIcon}>
                  <Ionicons name="star" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerTitle}>Получите Премиум</Text>
                  <Text style={styles.bannerSubtitle}>
                    Доступ ко всем медитациям
                  </Text>
                </View>
              </View>
              <View style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Открыть</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.cardsContainer}>
          {MEDITATIONS.map((meditation, index) => (
            <MeditationCard
              key={meditation.id}
              meditation={meditation}
              index={index}
              isLocked={
                meditation.isPremium &&
                !isPremium &&
                index >= FREE_MEDITATIONS_COUNT
              }
              onPress={() => handleCardPress(meditation)}
            />
          ))}
        </View>
      </ScrollView>

      <VibeModal
        visible={vibeModalVisible}
        onClose={() => setVibeModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  header: {},
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  profileButton: {
    alignItems: "center",
    padding: 4,
    borderRadius: 16,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  subscriptionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumBadge: {
    backgroundColor: "#10B981",
  },
  subscriptionBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  premiumBadgeText: {
    color: "#FFFFFF",
  },
  premiumBanner: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  bannerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 2,
  },
  bannerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  vibeButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  vibeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  vibeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 100,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  lockedGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lockIconContainer: {
    alignItems: "center",
  },
  lockedText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  durationBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  lockedTextContent: {
    color: "#9CA3AF",
  },
  difficultyContainer: {
    flexDirection: "row",
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
