import { LanguageCode } from "./types";

/**
 * i18n System Configuration
 */
export const I18N_CONFIG = {
  defaultLocale: "as" as LanguageCode,
  fallbackLocale: "en" as LanguageCode,
  storageKey: "smitri_preferred_language",
  cookieName: "smitri_lang",
  profileStorageKey: "smitri_user_profile",
  supportedLocales: ["en", "as", "bn", "hi"] as LanguageCode[],
};
