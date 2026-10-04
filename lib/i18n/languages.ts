import { SupportedLanguage } from "./types";

/**
 * Central Language Registry - Single Source of Truth
 * Maintains language metadata, native names, regional dialects, script direction,
 * and clear production-ready enabled status vs planned coming soon states.
 */
export const LANGUAGES: SupportedLanguage[] = [
  // --- FULLY SUPPORTED / ACTIVE PRODUCTION LANGUAGES ---
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    region: "অসম (Assam)",
    script: "Bengali-Assamese",
    direction: "ltr",
    bcp47: "as-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "নমস্কাৰ, আজিৰ খেল আৰম্ভ কৰক",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    region: "National / Global",
    script: "Latin",
    direction: "ltr",
    bcp47: "en-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "Hello, let us begin today's memory games!",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    region: "ত্রিপুরা ও অসম (Tripura / Assam)",
    script: "Bengali",
    direction: "ltr",
    bcp47: "bn-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "নমস্কার, আজকের খেলা শুরু করা যাক",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    region: "राष्ट्रीय (National)",
    script: "Devanagari",
    direction: "ltr",
    bcp47: "hi-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "नमस्ते, आज का खेल शुरू करें",
  },

  // --- NORTH EASTERN REGIONAL LANGUAGES & DIALECTS ---
  {
    code: "mni",
    name: "Manipuri",
    nativeName: "মৈতৈলোন্",
    region: "মণিপুর (Manipur)",
    script: "Meitei Mayek / Bengali",
    direction: "ltr",
    bcp47: "mni-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "খুরুমজরি, ঙসিগী শান্নবা হৌদোকসি",
  },
  {
    code: "brx",
    name: "Bodo",
    nativeName: "बर'",
    region: "बर'लेण्ड (Bodoland, Assam)",
    script: "Devanagari",
    direction: "ltr",
    bcp47: "hi-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "खुलुमबाय, दिनैनि गेलेनायखौ जागायनि",
  },
  {
    code: "kha",
    name: "Khasi",
    nativeName: "Ka Ktien Khasi",
    region: "Meghalaya",
    script: "Latin",
    direction: "ltr",
    bcp47: "en-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "Khublei, to ngin sdang ia ki jingialehkai mynta",
  },
  {
    code: "grx",
    name: "Garo",
    nativeName: "A·chik Kutta",
    region: "Meghalaya / Assam",
    script: "Latin",
    direction: "ltr",
    bcp47: "en-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "Mittela, da·alni kal·aniko a·bachengna",
  },
  {
    code: "miz",
    name: "Mizo",
    nativeName: "Mizo ṭawng",
    region: "Mizoram",
    script: "Latin",
    direction: "ltr",
    bcp47: "lus-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "Chibai, vawiin chu thluak chakna infiamna i tan ang le!",
  },
  {
    code: "nag",
    name: "Nagamese",
    nativeName: "Nagamese",
    region: "Nagaland",
    script: "Latin / Assamese",
    direction: "ltr",
    bcp47: "as-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "Bhal asey, aji laga dimag laga khel shuru koribo",
  },
  {
    code: "trp",
    name: "Kokborok",
    nativeName: "Kokborok",
    region: "Tripura",
    script: "Latin / Bengali",
    direction: "ltr",
    bcp47: "bn-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "Khulumkha, tini-ni swngmung-o phainai jora",
  },
  {
    code: "ne",
    name: "Nepali",
    nativeName: "नेपाली",
    region: "सिक्किम (Sikkim)",
    script: "Devanagari",
    direction: "ltr",
    bcp47: "ne-NP",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "नमस्ते, आजको स्मरण खेल सुरु गरौँ",
  },
  {
    code: "adi",
    name: "Adi / Nyishi",
    nativeName: "Adi / Nyishi",
    region: "Arunachal Pradesh",
    script: "Latin",
    direction: "ltr",
    bcp47: "en-IN",
    enabled: true,
    status: "active",
    statusLabel: {
      en: "Fully Supported",
      as: "পূৰ্ণ সমৰ্থন",
    },
    greetingVoice: "Kaling, siilodeng kankan mibo aaipe langka",
  },
];

export const ACTIVE_LANGUAGES = LANGUAGES.filter((l) => l.enabled);
export const PLANNED_LANGUAGES = LANGUAGES.filter((l) => !l.enabled);

export function getLanguageInfo(code?: string | null): SupportedLanguage {
  if (!code) return LANGUAGES[0];
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

export function isLanguageSupported(code?: string | null): boolean {
  if (!code) return false;
  return ACTIVE_LANGUAGES.some((l) => l.code === code);
}

export function isLanguagePlanned(code?: string | null): boolean {
  if (!code) return false;
  return PLANNED_LANGUAGES.some((l) => l.code === code);
}
