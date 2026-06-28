import { getCurrencies, getLocales } from "react-native-localize";

import type { Locale } from "../types/locale";

export function getDeviceLocale() {
  return getLocales()[0]?.languageTag ?? "en";
}

export function formatLocaleCode(locale: string): Locale {
  return locale.split("-")[0] as Locale;
}

export function getDeviceLanguageCode() {
  return getLocales()[0]?.languageCode ?? "en";
}

function getDeviceCurrency() {
  return getCurrencies()[0] ?? "USD";
}

export function formatCurrency(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "--";
  }

  return new Intl.NumberFormat(getDeviceLocale(), {
    style: "currency",
    currency: getDeviceCurrency(),
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "--";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatCompactNumber(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "--";
  }

  return new Intl.NumberFormat(getDeviceLocale(), {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat(getDeviceLocale(), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
