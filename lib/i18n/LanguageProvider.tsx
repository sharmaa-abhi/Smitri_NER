"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { LanguageCode, LanguageContextType } from "./types";
import { LANGUAGES, ACTIVE_LANGUAGES, PLANNED_LANGUAGES, getLanguageInfo } from "./languages";
import { I18N_CONFIG } from "./config";
import { translate, TRANSLATIONS } from "./translate";
import { playRegionalVoicePrompt } from "@/lib/audioPrompts";

export const LanguageContext = createContext<LanguageContextType>({
  language: I18N_CONFIG.defaultLocale,
  setLanguage: () => {},
  t: (key, defaultText) => defaultText || key,
  speak: () => {},
  playVoicePrompt: () => {},
  currentLangInfo: LANGUAGES[0],
  languages: LANGUAGES,
  activeLanguages: ACTIVE_LANGUAGES,
  plannedLanguages: PLANNED_LANGUAGES,
  isLoading: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(I18N_CONFIG.defaultLocale);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Initial Language Resolution Priority:
  // Saved Preference -> User Profile Preference -> Browser Language -> Default ("as")
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Step A: Local storage manual preference
      const savedLang = localStorage.getItem(I18N_CONFIG.storageKey) as LanguageCode | null;
      if (savedLang && LANGUAGES.some((l) => l.code === savedLang)) {
        setLanguageState(savedLang);
        return;
      }

      // Step B: User profile preference if authenticated/stored
      const userProfileRaw = localStorage.getItem(I18N_CONFIG.profileStorageKey);
      if (userProfileRaw) {
        try {
          const profile = JSON.parse(userProfileRaw);
          if (profile.preferredLanguage && LANGUAGES.some((l) => l.code === profile.preferredLanguage)) {
            setLanguageState(profile.preferredLanguage as LanguageCode);
            localStorage.setItem(I18N_CONFIG.storageKey, profile.preferredLanguage);
            return;
          }
        } catch {}
      }

      // Step C: Browser language detection (e.g., 'as-IN' -> 'as', 'bn' -> 'bn', 'hi' -> 'hi')
      const browserLang = navigator.language?.toLowerCase() || "";
      const matched = ACTIVE_LANGUAGES.find(
        (l) => browserLang === l.code || browserLang.startsWith(`${l.code}-`)
      );
      if (matched) {
        setLanguageState(matched.code);
        return;
      }

      // Step D: Default to "as" (Smitri_NER regional North East priority)
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

  // 3. User Language Selection Handler with Persistence
  const setLanguage = useCallback((newLang: LanguageCode) => {
    setLanguageState(newLang);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(I18N_CONFIG.storageKey, newLang);
        document.cookie = `${I18N_CONFIG.cookieName}=${newLang}; path=/; max-age=31536000; SameSite=Lax`;

        // Sync with user profile if saved locally
        const userProfileRaw = localStorage.getItem(I18N_CONFIG.profileStorageKey);
        if (userProfileRaw) {
          try {
            const profile = JSON.parse(userProfileRaw);
            profile.preferredLanguage = newLang;
            localStorage.setItem(I18N_CONFIG.profileStorageKey, JSON.stringify(profile));
          } catch {}
        }
      } catch (err) {
        console.warn("Could not persist language preference:", err);
      }
    }
  }, []);

  // 4. Stable Translation Callback
  const t = useCallback(
    (keyOrText: string, defaultText?: string): string => {
      return translate(language, keyOrText, defaultText);
    },
    [language]
  );

  // 5. Audio Prompts for Elderly Accessibility
  const playVoicePrompt = useCallback(
    (promptKey: "welcome" | "start" | "well_done" | "reminder_alert") => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      const textKey = `voice_${promptKey}`;
      const spokenText = dict[textKey] || dict.voice_welcome || "";
      playRegionalVoicePrompt(language, promptKey, spokenText);
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
      t,
      speak,
      playVoicePrompt,
      currentLangInfo,
      languages: LANGUAGES,
      activeLanguages: ACTIVE_LANGUAGES,
      plannedLanguages: PLANNED_LANGUAGES,
      isLoading,
    }),
    [language, setLanguage, t, speak, playVoicePrompt, currentLangInfo, isLoading]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
