import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { userStorageKey } from "../constants";
import type { ThemeMode } from "../styles/theme";
import type { Locale } from "../types/locale";
import { formatLocaleCode, getDeviceLanguageCode } from "../utils/formatters";

interface UserStore {
  locale: Locale;
  stockAlertSoundEnabled: boolean;
  themeMode: ThemeMode | "system";

  setLocale: (locale: Locale) => void;
  setStockAlertSoundEnabled: (enabled: boolean) => void;
  setThemeMode: (themeMode: ThemeMode | "system") => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      locale: formatLocaleCode(getDeviceLanguageCode()),
      stockAlertSoundEnabled: true,
      themeMode: "system",

      setLocale: locale =>
        set(() => ({
          locale,
        })),

      setStockAlertSoundEnabled: stockAlertSoundEnabled =>
        set(() => ({
          stockAlertSoundEnabled,
        })),

      setThemeMode: themeMode =>
        set(() => ({
          themeMode,
        })),
    }),
    {
      name: userStorageKey,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
