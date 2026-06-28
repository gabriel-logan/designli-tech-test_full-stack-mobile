import type { Theme as NavigationTheme } from "@react-navigation/native";

export type ThemeMode = "light" | "dark";

export interface AppTheme {
  colors: {
    background: string;
    border: string;
    card: string;
    notification: string;
    primary: string;
    text: string;
    mutedText: string;
  };
  dark: boolean;
}

export const lightTheme: AppTheme = {
  colors: {
    background: "#fff",
    border: "#e5e7eb",
    card: "#fff",
    notification: "#ef4444",
    primary: "#2563eb",
    text: "#111827",
    mutedText: "#4b5563",
  },
  dark: false,
};

export const darkTheme: AppTheme = {
  colors: {
    background: "#111827",
    border: "#374151",
    card: "#1f2937",
    notification: "#f87171",
    primary: "#60a5fa",
    text: "#f9fafb",
    mutedText: "#d1d5db",
  },
  dark: true,
};

export function getAppTheme(themeMode: ThemeMode): AppTheme {
  return themeMode === "dark" ? darkTheme : lightTheme;
}

export function getNavigationTheme(theme: AppTheme): NavigationTheme {
  return {
    dark: theme.dark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.notification,
    },
    fonts: {
      regular: {
        fontFamily: "System",
        fontWeight: "400",
      },
      medium: {
        fontFamily: "System",
        fontWeight: "500",
      },
      bold: {
        fontFamily: "System",
        fontWeight: "700",
      },
      heavy: {
        fontFamily: "System",
        fontWeight: "700",
      },
    },
  };
}
