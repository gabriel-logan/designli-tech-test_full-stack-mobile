import en from "./utils/locales/en.json";

export const userStorageKey = "user-storage";

export const resources = {
  en: {
    translation: en,
  },
} as const;

const localBackendUrl = "http://192.168.100.3:3000";

export const apiBaseUrl = `${localBackendUrl}/api`;

export const socketBaseUrl = localBackendUrl;

export const defaultStockSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];
