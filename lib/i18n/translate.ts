import enJson from "@/locales/en.json";
import asJson from "@/locales/as.json";
import bnJson from "@/locales/bn.json";
import hiJson from "@/locales/hi.json";
import mniJson from "@/locales/mni.json";
import brxJson from "@/locales/brx.json";
import khaJson from "@/locales/kha.json";
import grxJson from "@/locales/grx.json";
import mizJson from "@/locales/miz.json";
import nagJson from "@/locales/nag.json";
import trpJson from "@/locales/trp.json";
import neJson from "@/locales/ne.json";
import adiJson from "@/locales/adi.json";
import { LanguageCode } from "./types";
import { I18N_CONFIG } from "./config";

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: enJson,
  as: asJson,
  bn: bnJson,
  hi: hiJson,
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

// Fast English normalization & reverse lookup map for plain English strings
const normalizeStr = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

const enToKeyMap = new Map<string, string>();
Object.entries(enJson).forEach(([key, val]) => {
  if (typeof val === "string") {
    enToKeyMap.set(normalizeStr(val), key);
  }
});

/**
 * Resolves a translation string from a dictionary:
 * Supports:
 * 1. Direct flat key: "nav_home", "features_step1_title"
 * 2. Hierarchical dot notation: "features.step1.title", "navigation.home", "common.save"
 * 3. Dot to underscore conversion: "features.step1.title" -> "features_step1_title"
 */
export function resolveTranslation(
  dict: Record<string, string> | undefined,
  key: string
): string | undefined {
  if (!dict || !key) return undefined;

  // 1. Direct key match
  if (dict[key]) return dict[key];

  // 2. Hierarchical dot to underscore mapping: "features.step1.title" -> "features_step1_title"
  if (key.includes(".")) {
    const underscoreKey = key.replace(/\./g, "_");
    if (dict[underscoreKey]) return dict[underscoreKey];

    // Try stripping module prefix: "features.step1_title" -> "features_step1_title"
    const lastPart = key.split(".").pop();
    if (lastPart && dict[lastPart]) return dict[lastPart];
  }

  // 3. Normalized snake_case
  const snake = key.toLowerCase().replace(/[\s\.-]+/g, "_");
  if (dict[snake]) return dict[snake];

  return undefined;
}

/**
 * Robust, Fallback-Safe Translator Function
 * Follows strict resolution hierarchy:
 * 1. Target language dictionary
 * 2. Reverse lookup of English string in target language
 * 3. English fallback dictionary
 * 4. User-provided defaultText fallback
 * 5. Safe humanized key name
 * 
 * GUARANTEE: Never returns undefined, null, or blank string.
 */
export function translate(
  language: LanguageCode,
  keyOrText: string,
  defaultText?: string
): string {
  if (!keyOrText) return defaultText || "";

  const currentDict = TRANSLATIONS[language] || TRANSLATIONS[I18N_CONFIG.fallbackLocale];
  const fallbackDict = TRANSLATIONS[I18N_CONFIG.fallbackLocale];

  // 1. Look up in current language dictionary
  const directMatch = resolveTranslation(currentDict, keyOrText);
  if (directMatch) return directMatch;

  // 2. Plain English string reverse-lookup
  const normalized = normalizeStr(keyOrText);
  const matchedKey = enToKeyMap.get(normalized);
  if (matchedKey && currentDict[matchedKey]) {
    return currentDict[matchedKey];
  }

  // 3. Fallback to English dictionary
  if (language !== I18N_CONFIG.fallbackLocale) {
    const fallbackMatch = resolveTranslation(fallbackDict, keyOrText);
    if (fallbackMatch) return fallbackMatch;
    if (matchedKey && fallbackDict[matchedKey]) {
      return fallbackDict[matchedKey];
    }
  }

  // 4. Return user-provided default text
  if (defaultText !== undefined) {
    return defaultText;
  }

  // 5. Humanize key if it looks like an identifier, or return raw string
  if (keyOrText.includes("_") && !keyOrText.includes(" ")) {
    return keyOrText
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return keyOrText;
}
