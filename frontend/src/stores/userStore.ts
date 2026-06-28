import { getLocales } from "react-native-localize";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { userStorageKey } from "../constants";
import type { ThemeMode } from "../styles/theme";
import type { Locale } from "../types/locale";

function safeLocale(locale: string): Locale {
  return locale.split("-")[0] as Locale;
}

interface UserStore {
  locale: Locale;
  themeMode: ThemeMode | "system";
  isLoading: boolean;

  setLocale: (locale: Locale) => void;
  setThemeMode: (themeMode: ThemeMode | "system") => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      locale: safeLocale(getLocales()[0].languageCode || "en"),
      themeMode: "system",
      isLoading: false,

      setLocale: locale =>
        set(() => ({
          locale,
        })),

      setThemeMode: themeMode =>
        set(() => ({
          themeMode,
        })),

      setIsLoading: isLoading =>
        set(() => ({
          isLoading,
        })),
    }),
    {
      name: userStorageKey,
    },
  ),
);
