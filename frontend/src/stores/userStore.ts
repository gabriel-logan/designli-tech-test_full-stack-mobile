import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "react-native-localize";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { userStorageKey } from "../constants";
import type { ThemeMode } from "../styles/theme";
import type { AuthResponse, AuthUser } from "../types/api";
import type { Locale } from "../types/locale";

function safeLocale(locale: string): Locale {
  return locale.split("-")[0] as Locale;
}

interface UserStore {
  accessToken: string | null;
  authUser: AuthUser | null;
  hasHydrated: boolean;
  locale: Locale;
  themeMode: ThemeMode | "system";
  isLoading: boolean;

  logout: () => void;
  setAuth: (auth: AuthResponse) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setLocale: (locale: Locale) => void;
  setThemeMode: (themeMode: ThemeMode | "system") => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      accessToken: null,
      authUser: null,
      hasHydrated: false,
      locale: safeLocale(getLocales()[0].languageCode || "en"),
      themeMode: "system",
      isLoading: false,

      logout: () =>
        set(() => ({
          accessToken: null,
          authUser: null,
        })),

      setAuth: auth =>
        set(() => ({
          accessToken: auth.accessToken,
          authUser: auth.user,
        })),

      setHasHydrated: hasHydrated =>
        set(() => ({
          hasHydrated,
        })),

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
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        accessToken: state.accessToken,
        authUser: state.authUser,
        locale: state.locale,
        themeMode: state.themeMode,
      }),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
