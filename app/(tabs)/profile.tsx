import { useSubscription } from "@/context/SubscriptionContext";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function ProfileScreen() {
  const router = useRouter();
  const { isPremium, subscriptionTier, resetSubscription } = useSubscription();
  const { isDark, setTheme, theme, colors } = useAppTheme();

  const handleResetSubscription = () => {
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
  };

  const handleUpgrade = () => {
    router.push("/paywall");
  };

  const toggleTheme = async () => {
    const newTheme = isDark ? "light" : "dark";
    await setTheme(newTheme);
  };

  const getSubscriptionText = () => {
    switch (subscriptionTier) {
      case "monthly":
        return "Месячная подписка";
      case "yearly":
        return "Годовая подписка";
      default:
        return "Бесплатный аккаунт";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={isDark ? ["#059669", "#047857"] : ["#10B981", "#059669"]}
        style={styles.headerGradient}
      >
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: isDark ? "#1F2937" : "#FFFFFF" },
              ]}
            >
              <Ionicons name="person" size={40} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.userName}>Пользователь</Text>
          <View style={styles.subscriptionBadge}>
            <Text style={styles.subscriptionText}>{getSubscriptionText()}</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Внешний вид */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Внешний вид
          </Text>
          <View style={[styles.menuItem, { backgroundColor: colors.card }]}>
            <View
              style={[
                styles.menuIconContainer,
                { backgroundColor: isDark ? "#374151" : "#EDE9FE" },
              ]}
            >
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>
                {isDark ? "Тёмная тема" : "Светлая тема"}
              </Text>
              <Text
                style={[styles.menuSubtitle, { color: colors.textSecondary }]}
              >
                Переключить на {isDark ? "светлую" : "тёмную"} тему
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#E5E7EB", true: "#34D399" }}
              thumbColor={isDark ? "#10B981" : "#FFFFFF"}
            />
          </View>
        </Animated.View>

        {/* Подписка */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Подписка
          </Text>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card }]}
            onPress={handleUpgrade}
          >
            <View
              style={[
                styles.menuIconContainer,
                { backgroundColor: isDark ? "#374151" : "#EDE9FE" },
              ]}
            >
              <Ionicons name="sparkles" size={24} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>
                Премиум подписка
              </Text>
              <Text
                style={[styles.menuSubtitle, { color: colors.textSecondary }]}
              >
                {isPremium
                  ? "Спасибо за поддержку!"
                  : "Разблокируйте все медитации"}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* О приложении */}
        <Animated.View entering={FadeInDown.delay(600).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            О приложении
          </Text>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card }]}
          >
            <View
              style={[
                styles.menuIconContainer,
                { backgroundColor: isDark ? "#374151" : "#EDE9FE" },
              ]}
            >
              <Ionicons
                name="information-circle"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>
                О ZenPulse AI
              </Text>
              <Text
                style={[styles.menuSubtitle, { color: colors.textSecondary }]}
              >
                Версия 1.0.0
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Зона для тестирования */}
        {isPremium && (
          <Animated.View
            entering={FadeInDown.delay(700).duration(400)}
            style={[
              styles.dangerZone,
              { backgroundColor: isDark ? "#1F2937" : "#FEF2F2" },
            ]}
          >
            <Text style={styles.dangerZoneTitle}>Тестирование</Text>
            <TouchableOpacity
              style={[
                styles.dangerButton,
                {
                  backgroundColor: colors.card,
                  borderColor: isDark ? "#374151" : "#FECACA",
                },
              ]}
              onPress={handleResetSubscription}
            >
              <Ionicons name="refresh" size={20} color="#EF4444" />
              <Text style={styles.dangerButtonText}>Сбросить подписку</Text>
            </TouchableOpacity>
            <Text style={[styles.dangerHint, { color: colors.textSecondary }]}>
              Долгое нажатие на иконку профиля на главном экране
            </Text>
          </Animated.View>
        )}

        <Text style={[styles.version, { color: colors.textSecondary }]}>
          Версия 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subscriptionBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  subscriptionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
  },
  dangerZone: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  dangerZoneTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
    marginBottom: 12,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
  dangerHint: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  version: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 40,
  },
});
