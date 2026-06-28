import { useColorScheme } from "react-native";

import { useUserStore } from "../stores/userStore";
import { getAppTheme, type ThemeMode } from "../styles/theme";

export function useAppTheme() {
  const colorScheme = useColorScheme();

  const themeMode = useUserStore(state => state.themeMode);

  const systemThemeMode: ThemeMode = colorScheme === "dark" ? "dark" : "light";

  const resolvedThemeMode =
    themeMode === "system" ? systemThemeMode : themeMode;

  return getAppTheme(resolvedThemeMode);
}
