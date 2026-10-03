/**
 * Smitri_NER Internationalization (i18n) Type Definitions
 * Source of truth for language metadata, directions, and translation interfaces.
 */

export type LanguageCode =
  | "en"
  | "as"
  | "bn"
  | "hi"
  | "mni"
  | "brx"
  | "kha"
  | "grx"
  | "miz"
  | "nag"
  | "trp"
  | "ne"
  | "adi";

export type LanguageStatus = "active" | "coming_soon";

export interface SupportedLanguage {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: string;
  script: string;
  direction: "ltr" | "rtl";
  bcp47: string;
  enabled: boolean;
  status: LanguageStatus;
  statusLabel?: {
    en: string;
    as: string;
  };
  greetingVoice: string;
}

export type TranslationDictionary = Record<string, any>;

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  changeLanguage: (code: string) => Promise<boolean>;
  t: (keyOrText: string, defaultText?: string) => string;
  speak: (textOrKey: string) => void;
  playVoicePrompt: (
    promptKey: "welcome" | "start" | "well_done" | "reminder_alert",
    targetLang?: LanguageCode
  ) => void;
  currentLangInfo: SupportedLanguage;
  languages: SupportedLanguage[];
  activeLanguages: SupportedLanguage[];
  plannedLanguages: SupportedLanguage[];
  isLoading: boolean;
  error: string | null;
}
