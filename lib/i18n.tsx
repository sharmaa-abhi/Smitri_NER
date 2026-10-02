"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enJson from "@/locales/en.json";
import asJson from "@/locales/as.json";
import hiJson from "@/locales/hi.json";
import bnJson from "@/locales/bn.json";
import mniJson from "@/locales/mni.json";
import brxJson from "@/locales/brx.json";
import khaJson from "@/locales/kha.json";
import grxJson from "@/locales/grx.json";
import mizJson from "@/locales/miz.json";
import nagJson from "@/locales/nag.json";
import trpJson from "@/locales/trp.json";
import neJson from "@/locales/ne.json";
import adiJson from "@/locales/adi.json";
import { playRegionalVoicePrompt, stopVoicePrompt } from "@/lib/audioPrompts";

export type SupportedLanguage = 
  | "en" 
  | "as" 
  | "hi" 
  | "bn" 
  | "mni" 
  | "brx" 
  | "kha" 
  | "grx" 
  | "miz" 
  | "nag" 
  | "trp" 
  | "ne" 
  | "adi";

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  region: string;
  bcp47: string;
  greetingVoice: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", region: "অসম (Assam)", bcp47: "as-IN", greetingVoice: "নমস্কাৰ, আজিৰ খেল আৰম্ভ কৰক" },
  { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্", region: "মণিপুর (Manipur)", bcp47: "mni-IN", greetingVoice: "খুরুমজরি, ঙসিগী শান্নবা হৌদোকসি" },
  { code: "brx", name: "Bodo", nativeName: "बर'", region: "बर'लेण्ड (Bodoland, Assam)", bcp47: "hi-IN", greetingVoice: "खुलुमबाय, दिनैनि गेलेनायखौ जागायनि" },
  { code: "kha", name: "Khasi", nativeName: "Ka Ktien Khasi", region: "Meghalaya", bcp47: "en-IN", greetingVoice: "Khublei, to ngin sdang ia ki jingialehkai mynta" },
  { code: "grx", name: "Garo", nativeName: "A·chik Kutta", region: "Meghalaya / Assam", bcp47: "en-IN", greetingVoice: "Mittela, da·alni kal·aniko a·bachengna" },
  { code: "miz", name: "Mizo", nativeName: "Mizo ṭawng", region: "Mizoram", bcp47: "lus-IN", greetingVoice: "Chibai, vawiin chu thluak chakna infiamna i tan ang le!" },
  { code: "nag", name: "Nagamese", nativeName: "Nagamese", region: "Nagaland", bcp47: "as-IN", greetingVoice: "Bhal asey, aji laga dimag laga khel shuru koribo" },
  { code: "trp", name: "Kokborok", nativeName: "Kokborok", region: "Tripura", bcp47: "bn-IN", greetingVoice: "Khulumkha, tini-ni swngmung-o phainai jora" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", region: "सिक्किम (Sikkim)", bcp47: "ne-NP", greetingVoice: "नमस्ते, आजको स्मरण खेल सुरु गरौँ" },
  { code: "adi", name: "Adi / Nyishi", nativeName: "Adi / Nyishi", region: "Arunachal Pradesh", bcp47: "en-IN", greetingVoice: "Kaling, siilodeng kankan mibo aaipe langka" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "ত্রিপুরা ও অসম (Tripura / Assam)", bcp47: "bn-IN", greetingVoice: "নমস্কার, আজকের খেলা শুরু করা যাক" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "राष्ट्रीय (National)", bcp47: "hi-IN", greetingVoice: "नमस्ते, आज का खेल शुरू करें" },
  { code: "en", name: "English", nativeName: "English", region: "National / Global", bcp47: "en-IN", greetingVoice: "Hello, let us begin today's memory games!" },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: enJson,
  as: asJson,
  hi: hiJson,
  bn: bnJson,
  mni: mniJson,
  brx: brxJson,
  kha: khaJson,
  grx: grxJson,
  miz: mizJson,
  nag: nagJson,
  trp: trpJson,
  ne: neJson,
  adi: adiJson,
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  speak: (textOrKey: string) => void;
  playVoicePrompt: (promptKey: "welcome" | "start" | "well_done" | "reminder_alert") => void;
  currentLangInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "as",
  setLanguage: () => {},
  t: (key) => key,
  speak: () => {},
  playVoicePrompt: () => {},
  currentLangInfo: LANGUAGES[0],
});

const STORAGE_KEY = "smitri_preferred_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Assamese for NER community focus, or check localStorage
  const [language, setLanguageState] = useState<SupportedLanguage>("as");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const t = (key: string): string => {
    const dict = (TRANSLATIONS[language] || TRANSLATIONS.en) as Record<string, string>;
    const enDict = TRANSLATIONS.en as Record<string, string>;
    if (dict[key]) return dict[key];
    if (dict[`nav_${key}`]) return dict[`nav_${key}`];
    if (dict[`game_${key}`]) return dict[`game_${key}`];
    if (enDict[key]) return enDict[key];
    if (enDict[`nav_${key}`]) return enDict[`nav_${key}`];
    if (enDict[`game_${key}`]) return enDict[`game_${key}`];
    if (key.includes('_')) {
      return key
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const playVoicePrompt = (promptKey: "welcome" | "start" | "well_done" | "reminder_alert") => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    const textKey = `voice_${promptKey}`;
    const spokenText = dict[textKey] || dict.voice_welcome || "";
    playRegionalVoicePrompt(language, promptKey, spokenText);
  };

  const speak = (textOrKey: string) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    const textToSpeak = dict[textOrKey] || textOrKey;
    playRegionalVoicePrompt(language, "welcome", textToSpeak);
  };

  const currentLangInfo = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speak,
        playVoicePrompt,
        currentLangInfo,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
