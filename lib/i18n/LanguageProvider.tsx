"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { LanguageCode, LanguageContextType } from "./types";
import {
  LANGUAGES,
  ACTIVE_LANGUAGES,
  PLANNED_LANGUAGES,
  getLanguageInfo,
  isLanguageSupported,
} from "./languages";
import { I18N_CONFIG } from "./config";
import { translate, TRANSLATIONS } from "./translate";
import { playRegionalVoicePrompt } from "@/lib/audioPrompts";

export const LanguageContext = createContext<LanguageContextType>({
  language: I18N_CONFIG.defaultLocale,
  setLanguage: () => {},
  changeLanguage: async () => false,
  t: (key, defaultText) => defaultText || key,
  speak: () => {},
  playVoicePrompt: () => {},
  currentLangInfo: LANGUAGES[0],
  languages: LANGUAGES,
  activeLanguages: ACTIVE_LANGUAGES,
  plannedLanguages: PLANNED_LANGUAGES,
  isLoading: false,
  error: null,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(I18N_CONFIG.defaultLocale);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref to the latest language to avoid stale state in async operations
  const currentLangRef = useRef<LanguageCode>(language);
  useEffect(() => {
    currentLangRef.current = language;
  }, [language]);

  // 1. Initial Language Resolution Priority (Validated against ACTIVE_LANGUAGES):
  // Saved Preference -> User Profile Preference -> Browser Language -> Default ("as")
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Step A: Local storage manual preference
      const savedLang = localStorage.getItem(I18N_CONFIG.storageKey);
      if (savedLang && isLanguageSupported(savedLang)) {
        setLanguageState(savedLang as LanguageCode);
        return;
      } else if (savedLang) {
        // Saved language code is invalid or not yet enabled (Coming Soon)
        console.warn(`[i18n] Stored language "${savedLang}" is not enabled. Resetting to default.`);
        try {
          localStorage.removeItem(I18N_CONFIG.storageKey);
        } catch {}
      }

      // Step B: User profile preference if authenticated/stored
      const userProfileRaw = localStorage.getItem(I18N_CONFIG.profileStorageKey);
      if (userProfileRaw) {
        try {
          const profile = JSON.parse(userProfileRaw);
          if (profile.preferredLanguage && isLanguageSupported(profile.preferredLanguage)) {
            setLanguageState(profile.preferredLanguage as LanguageCode);
            localStorage.setItem(I18N_CONFIG.storageKey, profile.preferredLanguage);
            return;
          }
        } catch {}
      }

      // Step C: Browser language detection (matched strictly against ACTIVE_LANGUAGES)
      const browserLang = (navigator.language || "").toLowerCase().trim();
      const matched = ACTIVE_LANGUAGES.find(
        (l) => browserLang === l.code || browserLang.startsWith(`${l.code}-`)
      );
      if (matched && isLanguageSupported(matched.code)) {
        setLanguageState(matched.code);
        return;
      }

      // Step D: Default to "as" (Assamese - Smitri_NER regional North East priority)
      setLanguageState(I18N_CONFIG.defaultLocale);
    } catch {
      setLanguageState(I18N_CONFIG.defaultLocale);
    }
  }, []);

  // 2. Synchronize DOM HTML Attributes (lang & dir) upon language change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const langInfo = getLanguageInfo(language);
    document.documentElement.lang = language;
    document.documentElement.dir = langInfo.direction || "ltr";
    document.documentElement.setAttribute("data-lang", language);
    document.documentElement.setAttribute("data-bcp47", langInfo.bcp47);
  }, [language]);

  // 3. Central, Atomic, Safe Language Change Function
  // Flow: Validate -> Confirm Translations -> Update State -> Persist Preference
  const changeLanguage = useCallback(
    async (targetCode: string): Promise<boolean> => {
      // Step A: Validate language code is an active, enabled production language
      if (!targetCode || !isLanguageSupported(targetCode)) {
        console.warn(
          `[i18n] Language "${targetCode}" is not an enabled production language. Active language unchanged.`
        );
        return false;
      }

      const validCode = targetCode as LanguageCode;

      // If already active, return success immediately
      if (validCode === currentLangRef.current) {
        return true;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Step B: Verify translations dictionary exists and has keys
        const dict = TRANSLATIONS[validCode];
        if (!dict || typeof dict !== "object" || Object.keys(dict).length === 0) {
          throw new Error(`Translations not found for language: ${validCode}`);
        }

        // Step C: Atomically commit state
        setLanguageState(validCode);
        currentLangRef.current = validCode;

        // Step D: Persist to storage & cookies
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(I18N_CONFIG.storageKey, validCode);
            document.cookie = `${I18N_CONFIG.cookieName}=${validCode}; path=/; max-age=31536000; SameSite=Lax`;

            // Sync with local user profile record if present
            const userProfileRaw = localStorage.getItem(I18N_CONFIG.profileStorageKey);
            if (userProfileRaw) {
              try {
                const profile = JSON.parse(userProfileRaw);
                profile.preferredLanguage = validCode;
                localStorage.setItem(I18N_CONFIG.profileStorageKey, JSON.stringify(profile));
              } catch {}
            }
          } catch (storageErr) {
            console.warn("[i18n] Could not persist language to storage:", storageErr);
          }
        }

        return true;
      } catch (err: any) {
        console.error(`[i18n] Failed to switch language to ${validCode}:`, err);
        setError(err?.message || "Failed to switch language");
        // State remains safe and unchanged
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Backwards-compatible setLanguage wrapper
  const setLanguage = useCallback(
    (newLang: LanguageCode) => {
      void changeLanguage(newLang);
    },
    [changeLanguage]
  );

  // 4. Stable Translation Callback
  const t = useCallback(
    (keyOrText: string, defaultText?: string): string => {
      return translate(language, keyOrText, defaultText);
    },
    [language]
  );

  // 5. Audio Prompts for Elderly Accessibility
  // Supports previewing ANY registered dialect without modifying global active language
  const playVoicePrompt = useCallback(
    (
      promptKey: "welcome" | "start" | "well_done" | "reminder_alert",
      targetLang?: LanguageCode
    ) => {
      const effectiveLang =
        targetLang && LANGUAGES.some((l) => l.code === targetLang)
          ? targetLang
          : language;

      const dict = TRANSLATIONS[effectiveLang] || TRANSLATIONS.en;
      const textKey = `voice_${promptKey}`;
      const langMeta = getLanguageInfo(effectiveLang);
      const spokenText =
        dict[textKey] || langMeta.greetingVoice || dict.voice_welcome || "";

      playRegionalVoicePrompt(effectiveLang, promptKey, spokenText);
    },
    [language]
  );

  const speak = useCallback(
    (textOrKey: string) => {
      const translated = t(textOrKey);
      playRegionalVoicePrompt(language, "welcome", translated);
    },
    [language, t]
  );

  const currentLangInfo = useMemo(() => getLanguageInfo(language), [language]);

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      changeLanguage,
      t,
      speak,
      playVoicePrompt,
      currentLangInfo,
      languages: LANGUAGES,
      activeLanguages: ACTIVE_LANGUAGES,
      plannedLanguages: PLANNED_LANGUAGES,
      isLoading,
      error,
    }),
    [
      language,
      setLanguage,
      changeLanguage,
      t,
      speak,
      playVoicePrompt,
      currentLangInfo,
      isLoading,
      error,
    ]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
