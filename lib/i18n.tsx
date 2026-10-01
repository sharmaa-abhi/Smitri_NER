"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLanguage = "en" | "as" | "bn" | "hi" | "mni" | "brx";

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  region: string;
  bcp47: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", region: "Global / India", bcp47: "en-IN" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", region: "Assam", bcp47: "as-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "Tripura / Assam / WB", bcp47: "bn-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "National", bcp47: "hi-IN" },
  { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্", region: "Manipur", bcp47: "mni-IN" },
  { code: "brx", name: "Bodo", nativeName: "बर'", region: "Bodoland / Assam", bcp47: "hi-IN" },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    app_title: "Smitri_NER",
    tagline: "AI-Based Cognitive Gaming & Memory Assistance for Seniors",
    home: "Home",
    games: "Games",
    dashboard: "Dashboard",
    reminders: "Reminders",
    progress: "Progress",
    caregiver: "Caregiver",
    emergency: "SOS Emergency",
    get_started: "Get Started",
    today_score: "Today's Score",
    completed_exercises: "Completed Games",
    next_reminder: "Next Reminder",
    play_now: "Play Now",
    instructions: "Instructions",
    listen_instructions: "Listen Aloud",
    score: "Score",
    accuracy: "Accuracy",
    time_taken: "Time Taken",
    mistakes: "Mistakes",
    level: "Level",
    well_done: "Well Done! Keep it up!",
    offline_badge: "Offline Mode Active (Data saved locally)",
    back_online: "Back Online! Syncing data...",
    call_caregiver: "Call Caregiver",
    national_helpline: "National Helpline 112",
    welcome_greeting: "Good day! Ready for your daily memory workout?",
  },
  as: {
    app_title: "স্মৃতি_NER",
    tagline: "বয়োজ্যেষ্ঠসকলৰ বাবে স্মৃতিশক্তি আৰু বৌদ্ধিক সুস্থতাৰ মঞ্চ",
    home: "গৃহ",
    games: "খেলসমূহ",
    dashboard: "ডেশ্ববৰ্ড",
    reminders: "সোঁৱৰণি",
    progress: "উন্নতি",
    caregiver: "সেৱক / সহায়ক",
    emergency: "জৰুৰীকালীন SOS",
    get_started: "আৰম্ভ কৰক",
    today_score: "আজিৰ নম্বৰ",
    completed_exercises: "সম্পূৰ্ণ কৰা খেল",
    next_reminder: "পৰৱৰ্তী সোঁৱৰণি",
    play_now: "এতিয়াই খেলক",
    instructions: "নিয়মাৱলী",
    listen_instructions: "শুনি লওক",
    score: "নম্বৰ",
    accuracy: "সঠিকতা",
    time_taken: "লোৱা সময়",
    mistakes: "ভুলৰ সংখ্যা",
    level: "স্তৰ",
    well_done: "বহুত ভাল হৈছে! এনেদৰে আগবাঢ়ক!",
    offline_badge: "অফলাইন ম'ড সক্ৰিয় (তথ্য সংৰক্ষিত)",
    back_online: "অনলাইন হৈছে! তথ্য সংলগ্ন হৈছে...",
    call_caregiver: "সহায়কক ফোন কৰক",
    national_helpline: "ৰাষ্ট্ৰীয় হেল্পলাইন ১১২",
    welcome_greeting: "নমস্কাৰ! আজিৰ স্মৃতি খেলৰ বাবে সাজুনে?",
  },
  bn: {
    app_title: "স্মৃতি_NER",
    tagline: "প্রবীণদের জন্য স্মৃতিশক্তি ও মানসিক সুস্থতা অনুশীলন",
    home: "মূলপাতা",
    games: "খেলাসমূহ",
    dashboard: "ড্যাশবোর্ড",
    reminders: "অনুস্মারক",
    progress: "অগ্রগতি",
    caregiver: "তত্ত্বাবধায়ক",
    emergency: "জরুরী SOS",
    get_started: "শুরু করুন",
    today_score: "আজকের স্কোর",
    completed_exercises: "সম্পূর্ণ খেলা",
    next_reminder: "পরবর্তী অনুস্মারক",
    play_now: "এখনই খেলুন",
    instructions: "নিয়মাবলী",
    listen_instructions: "শুনে নিন",
    score: "স্কোর",
    accuracy: "নির্ভুলতা",
    time_taken: "ব্যয়িত সময়",
    mistakes: "ভুল",
    level: "স্তর",
    well_done: "চমৎকার হয়েছে! এভাবেই এগিয়ে যান!",
    offline_badge: "অফলাইন মোড চালু (তথ্য সুরক্ষিত)",
    back_online: "পুনরায় সংযোগ হয়েছে! সিঙ্ক হচ্ছে...",
    call_caregiver: "পরিচর্যাকারীকে কল করুন",
    national_helpline: "জাতীয় হেল্পলাইন ১১২",
    welcome_greeting: "নমস্কার! আজকের মেমোরি গেমের জন্য আপনি প্রস্তুত?",
  },
  hi: {
    app_title: "स्मृति_NER",
    tagline: "बुजुर्गों के लिए स्मृति और मानसिक सक्रियता का मंच",
    home: "होम",
    games: "खेल",
    dashboard: "डैशबोर्ड",
    reminders: "दवा व यादें",
    progress: "प्रगति",
    caregiver: "देखभालकर्ता",
    emergency: "आपातकालीन SOS",
    get_started: "शुरू करें",
    today_score: "आज का स्कोर",
    completed_exercises: "पूरे किए गए खेल",
    next_reminder: "अगली दवा / याद",
    play_now: "अभी खेलें",
    instructions: "निर्देश",
    listen_instructions: "सुनें",
    score: "स्कोर",
    accuracy: "सटीकता",
    time_taken: "समय",
    mistakes: "गलतियां",
    level: "स्तर",
    well_done: "बहुत बढ़िया! ऐसे ही प्रयास करते रहें!",
    offline_badge: "ऑफलाइन मोड सक्रिय (डेटा डिवाइस पर सुरक्षित है)",
    back_online: "इंटरनेट वापस आ गया! डेटा सिंक हो रहा है...",
    call_caregiver: "देखभालकर्ता को कॉल करें",
    national_helpline: "राष्ट्रीय हेल्पलाइन 112",
    welcome_greeting: "नमस्ते! क्या आप आज के स्मृति अभ्यास के लिए तैयार हैं?",
  },
  mni: {
    app_title: "স্মৃতি_NER",
    tagline: "অহল ওইরবা মীওইশিংগী ৱাখল অমসুং নীংশিংবা পাঙ্গল কনখৎহনবা",
    home: "য়ুম",
    games: "শান্নবা",
    dashboard: "দ্যাশবোর্দ",
    reminders: "নীংশিংবা",
    progress: "চাউখৎলকপা",
    caregiver: "য়েন্থোকপীবা",
    emergency: "জরুরী SOS",
    get_started: "হৌদোকউ",
    today_score: "ঙসিগী স্কোর",
    completed_exercises: "লোইশিনখ্রবা শান্নবা",
    next_reminder: "মথংগী নীংশিংবা",
    play_now: "হৌজিক শান্নউ",
    instructions: "নিয়ম",
    listen_instructions: "তাবিউ",
    score: "স্কোর",
    accuracy: "চুম্বা",
    time_taken: "মতম",
    mistakes: "অশোয়বা",
    level: "থাক",
    well_done: "য়াম্না ফৈ! মখা চত্থবীরো!",
    offline_badge: "ওফলাইন মোদ চৎনরি (চেকশিন্না থম্লি)",
    back_online: "ইন্তর্নেত ফংলে! সিঙ্ক তৌরি...",
    call_caregiver: "কেয়ারগিভরদা কোল তৌবীয়ু",
    national_helpline: "লৈবাক্কী হেল্পলাইন ১১২",
    welcome_greeting: "খুরুমজরি! ঙসিগী নীংশিং শান্নবগীদমক শেম-শাবা ওইরব್ರಾ?",
  },
  brx: {
    app_title: "स्मृति_NER",
    tagline: "बैसो गोलावफोरनि गोसो आरो गोसोखां गोहो मोजां खालामनाय",
    home: "न'",
    games: "गेलेनाय",
    dashboard: "डेशबर्ड",
    reminders: "गोसोखां होनाय",
    progress: "दावगानाय",
    caregiver: "सामलायगिरि",
    emergency: "गोनांथार SOS",
    get_started: "जागाय",
    today_score: "दिनैनि स्कोर",
    completed_exercises: "जोबनाय गेलेनाय",
    next_reminder: "उननि गोसोखांथि",
    play_now: "दा गेले",
    instructions: "नेमफोर",
    listen_instructions: "खनासं",
    score: "स्कोर",
    accuracy: "गेबेंथि",
    time_taken: "सम",
    mistakes: "गोरोन्थि",
    level: "थाखो",
    well_done: "जोबोर मोजां जादों! एखे बादिनो गेलेबाय था!",
    offline_badge: "अफलाइन मद सालायबाय दं (डेटा रैखाथि)",
    back_online: "अनलाइन जाफिनबाय! डेटा सिंक जादों...",
    call_caregiver: "सामलायगिरिनो कल खालाम",
    national_helpline: "हादरनि हेल्पलाइन 112",
    welcome_greeting: "खुलुमबाय! दिनैनि गोसोखां गेलेनायनि थाखाय थियारि ना?",
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  speak: (textOrKey: string) => void;
  currentLangInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  speak: () => {},
  currentLangInfo: LANGUAGES[0],
});

const STORAGE_KEY = "smitri_preferred_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

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
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  const speak = (textOrKey: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const textToSpeak = t(textOrKey) || textOrKey;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langInfo = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
    utterance.lang = langInfo.bcp47;
    utterance.rate = 0.85; // Slightly slower pace for seniors
    utterance.pitch = 1.0;

    // Try finding best matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(langInfo.code) || v.lang === langInfo.bcp47);
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const currentLangInfo = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, speak, currentLangInfo }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
