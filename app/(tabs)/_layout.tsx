import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppTheme } from "@/context/ThemeContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDark, colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle:
          Platform.OS === "ios"
            ? {
                position: "absolute",
                backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
                height: 80,
                paddingBottom: 20,
              }
            : {
                backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                borderTopWidth: 0,
                elevation: 0,
                height: 60,
              },
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Медитация",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="leaf.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
