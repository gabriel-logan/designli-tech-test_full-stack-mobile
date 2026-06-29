import { FRONTEND_BACKEND_URL } from "@env";

import en from "./utils/locales/en.json";

export const userStorageKey = "user-storage";

export const resources = {
  en: {
    translation: en,
  },
} as const;

export const apiBaseUrl = `${FRONTEND_BACKEND_URL}/api`;

export const socketBaseUrl = FRONTEND_BACKEND_URL;

export const defaultStockSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];
