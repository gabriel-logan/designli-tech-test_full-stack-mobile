import en from "./utils/locales/en.json";

export const userStorageKey = "user-storage";

export const resources = {
  en: {
    translation: en,
  },
} as const;

export const apiBaseUrl = "http://localhost:3000/api";

export const socketBaseUrl = "http://localhost:3000";
