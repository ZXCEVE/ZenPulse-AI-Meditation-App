import { PREMIUM_BENEFITS } from "@/constants/meditations";
import {
  SubscriptionTier,
  useSubscription,
} from "@/context/SubscriptionContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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

type PlanType = "monthly" | "yearly";

interface PricingCardProps {
  plan: PlanType;
  price: string;
  period: string;
  discount?: string;
  isSelected: boolean;
  onSelect: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function PricingCard({
  plan,
  price,
  period,
  discount,
  isSelected,
  onSelect,
}: PricingCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      style={[
        styles.pricingCard,
        isSelected && styles.pricingCardSelected,
        animatedStyle,
      ]}
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      {plan === "yearly" && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}</Text>
        </View>
      )}
      <View style={styles.planHeader}>
        <Text style={styles.planName}>
          {plan === "monthly" ? "Месячный" : "Годовой"}
        </Text>
        {plan === "yearly" && <Text style={styles.bestValue}>Выгодно</Text>}
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.period}>{period}</Text>
      </View>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color="#8B5CF6" />
        </View>
      )}
    </AnimatedTouchable>
  );
}

function BenefitItem({
  icon,
  title,
  description,
  index,
}: {
  icon: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(300 + index * 100).duration(500)}
      style={styles.benefitItem}
    >
      <View style={styles.benefitIconContainer}>
        <Ionicons name={icon as any} size={24} color="#34D399" />
      </View>
      <View style={styles.benefitContent}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
}

export default function PaywallScreen() {
  const router = useRouter();
  const { purchaseSubscription, isPremium, resetSubscription, isLoading } =
    useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    const tier: SubscriptionTier =
      selectedPlan === "monthly" ? "monthly" : "yearly";

    // Имитация задержки покупки 1.5 секунды
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      await purchaseSubscription(tier);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      "Отмена подписки",
      "Вы уверены, что хотите отменить подписку?",
      [
        { text: "Нет", style: "cancel" },
        {
          text: "Да, отменить",
          style: "destructive",
          onPress: async () => {
            await resetSubscription();
            router.replace("/(tabs)");
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#10B981", "#059669", "#047857"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
            <Text style={styles.logo}>✨ ZenPulse</Text>
            <Text style={styles.title}>Премиум</Text>
            <Text style={styles.subtitle}>
              Откройте полный потенциал медитации
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={styles.benefitsContainer}
          >
            {PREMIUM_BENEFITS.map((benefit, index) => (
              <BenefitItem
                key={benefit.id}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                index={index}
              />
            ))}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(500)}
            style={styles.pricingContainer}
          >
            <Text style={styles.pricingTitle}>Выберите тариф</Text>
            <View style={styles.pricingCards}>
              <PricingCard
                plan="monthly"
                price="299₽"
                period="/месяц"
                isSelected={selectedPlan === "monthly"}
                onSelect={() => setSelectedPlan("monthly")}
              />
              <PricingCard
                plan="yearly"
                price="1990₽"
                period="/год"
                discount="-40%"
                isSelected={selectedPlan === "yearly"}
                onSelect={() => setSelectedPlan("yearly")}
              />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(1000).duration(500)}
            style={styles.buttonContainer}
          >
            {isPremium ? (
              <>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelSubscription}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Отменить подписку</Text>
                </TouchableOpacity>
                <Text style={styles.premiumActiveText}>
                  Ваша подписка активна
                </Text>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.subscribeButton}
                  onPress={handlePurchase}
                  disabled={isPurchasing}
                  activeOpacity={0.8}
                >
                  {isPurchasing ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.subscribeButtonText}>
                      Попробовать бесплатно
                    </Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.trialText}>
                  7 дней бесплатно, затем{" "}
                  {selectedPlan === "monthly" ? "299₽/мес" : "1990₽/год"}
                </Text>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(167, 139, 250, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
  },
  pricingContainer: {
    marginBottom: 32,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },
  pricingCards: {
    flexDirection: "row",
    gap: 12,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
    overflow: "hidden",
  },
  pricingCardSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderColor: "#34D399",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: -30,
    backgroundColor: "#10B981",
    paddingHorizontal: 30,
    paddingVertical: 4,
    transform: [{ rotate: "45deg" }],
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  planName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bestValue: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  period: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 4,
  },
  selectedIndicator: {
    position: "absolute",
    top: 2,
    left: 2,
    zIndex: 1000,
  },
  buttonContainer: {
    alignItems: "center",
  },
  subscribeButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  subscribeButtonText: {
    color: "#10B981",
    fontSize: 18,
    fontWeight: "700",
  },
  trialText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  premiumActiveText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
});
