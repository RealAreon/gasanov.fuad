import { defineRouting } from "next-intl/routing";

export const locales = ["en", "uk", "ru", "fr", "de", "es", "it", "pt"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  uk: "Українська",
  ru: "Русский",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  pt: "Português",
};

export const localeFlags: Record<Locale, string> = {
  en: "EN",
  uk: "UA",
  ru: "RU",
  fr: "FR",
  de: "DE",
  es: "ES",
  it: "IT",
  pt: "PT",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});
