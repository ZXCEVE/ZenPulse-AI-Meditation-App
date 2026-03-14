import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => Promise<void>;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
    card: string;
  };
}

const THEME_KEY = "@zenpulse_theme";

const lightColors = {
  background: "#F3F4F6",
  surface: "#FFFFFF",
  text: "#1F2937",
  textSecondary: "#6B7280",
  primary: "#10B981",
  border: "#E5E7EB",
  card: "#FFFFFF",
};

const darkColors = {
  background: "#111827",
  surface: "#1F2937",
  text: "#F9FAFB",
  textSecondary: "#9CA3AF",
  primary: "#34D399",
  border: "#374151",
  card: "#1F2937",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useRNColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored) {
        setThemeState(stored as ThemeMode);
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
      throw error;
    }
  };

  const isDark =
    theme === "dark" || (theme === "system" && systemColorScheme === "dark");
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        setTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
}
