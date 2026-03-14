import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

export type SubscriptionTier = "free" | "monthly" | "yearly";

interface SubscriptionContextType {
  subscriptionTier: SubscriptionTier;
  isPremium: boolean;
  isLoading: boolean;
  purchaseSubscription: (tier: SubscriptionTier) => Promise<void>;
  resetSubscription: () => Promise<void>;
}

const SUBSCRIPTION_KEY = "@zenpulse_subscription";

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscriptionTier, setSubscriptionTier] =
    useState<SubscriptionTier>("free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const stored = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      if (stored) {
        const tier = stored as SubscriptionTier;
        setSubscriptionTier(tier);
      }
    } catch (error) {
      console.error("Failed to load subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseSubscription = async (tier: SubscriptionTier) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, tier);
      setSubscriptionTier(tier);
    } catch (error) {
      console.error("Failed to save subscription:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSubscription = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
      setSubscriptionTier("free");
    } catch (error) {
      console.error("Failed to reset subscription:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isPremium = subscriptionTier !== "free";

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionTier,
        isPremium,
        isLoading,
        purchaseSubscription,
        resetSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
}
