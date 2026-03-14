import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import "./global.css";

import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { ThemeProvider, useAppTheme } from "@/context/ThemeContext";
import tamaguiConfig from "@/tamagui.config";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppContent() {
  const { isDark } = useAppTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="paywall"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <ThemeProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
