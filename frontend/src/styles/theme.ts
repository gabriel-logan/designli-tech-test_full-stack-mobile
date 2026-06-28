import type { Theme as NavigationTheme } from "@react-navigation/native";

export type ThemeMode = "light" | "dark";

export interface AppTheme {
  colors: {
    background: string;
    border: string;
    card: string;
    danger: string;
    field: string;
    negative: string;
    notification: string;
    positive: string;
    primary: string;
    primarySoft: string;
    shadow: string;
    surface: string;
    surfaceMuted: string;
    text: string;
    mutedText: string;
    negativeSoft: string;
    positiveSoft: string;
    warning: string;
  };
  dark: boolean;
}

export const lightTheme: AppTheme = {
  colors: {
    background: "#f6f7f9",
    border: "#d7dce3",
    card: "#ffffff",
    danger: "#dc2626",
    field: "#ffffff",
    negative: "#dc2626",
    notification: "#ef4444",
    positive: "#16803c",
    primary: "#155eef",
    primarySoft: "#e8efff",
    shadow: "#0f172a",
    surface: "#ffffff",
    surfaceMuted: "#eef2f7",
    text: "#111827",
    mutedText: "#4b5563",
    negativeSoft: "#fee2e2",
    positiveSoft: "#dcfce7",
    warning: "#b45309",
  },
  dark: false,
};

export const darkTheme: AppTheme = {
  colors: {
    background: "#101418",
    border: "#303946",
    card: "#171d24",
    danger: "#fb7185",
    field: "#1d2630",
    negative: "#fb7185",
    notification: "#f87171",
    positive: "#4ade80",
    primary: "#7aa7ff",
    primarySoft: "#1d2f55",
    shadow: "#000000",
    surface: "#171d24",
    surfaceMuted: "#202a35",
    text: "#f9fafb",
    mutedText: "#aeb8c4",
    negativeSoft: "#3f1723",
    positiveSoft: "#14351f",
    warning: "#fbbf24",
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
