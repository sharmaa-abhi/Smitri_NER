"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
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
import { playRegionalVoicePrompt } from "@/lib/audioPrompts";

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
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "राष्ट्रीय (National)", bcp47: "hi-IN", greetingVoice: "नमस्ते, आज का खेल शुरू करें" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "ত্রিপুরা ও অসম (Tripura / Assam)", bcp47: "bn-IN", greetingVoice: "নমস্কার, আজকের খেলা শুরু করা যাক" },
  { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্", region: "মণিপুর (Manipur)", bcp47: "mni-IN", greetingVoice: "খুরুমজরি, ঙসিগী শান্নবা হৌদোকসি" },
  { code: "brx", name: "Bodo", nativeName: "बर'", region: "बर'लेण्ड (Bodoland, Assam)", bcp47: "hi-IN", greetingVoice: "खुलुमबाय, दिनैनि गेलेनायखौ जागायनि" },
  { code: "kha", name: "Khasi", nativeName: "Ka Ktien Khasi", region: "Meghalaya", bcp47: "en-IN", greetingVoice: "Khublei, to ngin sdang ia ki jingialehkai mynta" },
  { code: "grx", name: "Garo", nativeName: "A·chik Kutta", region: "Meghalaya / Assam", bcp47: "en-IN", greetingVoice: "Mittela, da·alni kal·aniko a·bachengna" },
  { code: "miz", name: "Mizo", nativeName: "Mizo ṭawng", region: "Mizoram", bcp47: "lus-IN", greetingVoice: "Chibai, vawiin chu thluak chakna infiamna i tan ang le!" },
  { code: "nag", name: "Nagamese", nativeName: "Nagamese", region: "Nagaland", bcp47: "as-IN", greetingVoice: "Bhal asey, aji laga dimag laga khel shuru koribo" },
  { code: "trp", name: "Kokborok", nativeName: "Kokborok", region: "Tripura", bcp47: "bn-IN", greetingVoice: "Khulumkha, tini-ni swngmung-o phainai jora" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", region: "सिक्किम (Sikkim)", bcp47: "ne-NP", greetingVoice: "नमस्ते, आजको स्मरण खेल सुरु गरौँ" },
  { code: "adi", name: "Adi / Nyishi", nativeName: "Adi / Nyishi", region: "Arunachal Pradesh", bcp47: "en-IN", greetingVoice: "Kaling, siilodeng kankan mibo aaipe langka" },
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

// Common supplementary phrases for widgets and components
export const EXTRA_PHRASES: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    "Quick Senior Brain Spark": "Quick Senior Brain Spark",
    "15-Second Mini Memory Challenge": "15-Second Mini Memory Challenge",
    "Tap 2 matching cards to awaken recall": "Tap 2 matching cards to awaken recall",
    "Moves": "Moves",
    "Time": "Time",
    "Seconds": "Seconds",
    "Sec": "Sec",
    "Try Again": "Try Again",
    "Play Full Games": "Play Full Games",
    "Congratulations! Recall Sparked!": "Congratulations! Recall Sparked!",
    "Mindful Breathing Orb": "Mindful Breathing Orb",
    "Senior Relaxation & Focus": "Senior Relaxation & Focus",
    "Inhale": "Inhale",
    "Exhale": "Exhale",
    "Hold": "Hold",
    "Breathe In": "Breathe In",
    "Breathe Out": "Breathe Out",
    "Hold Breath": "Hold Breath",
    "Start Breathing": "Start Breathing",
    "Pause": "Pause",
    "Reset": "Reset",
    "Cycles Completed": "Cycles Completed",
    "Caregiver Peace of Mind Simulator": "Caregiver Peace of Mind Simulator",
    "Live Alert Preview": "Live Alert Preview",
    "Healthy Routine": "Healthy Routine",
    "Missed Medication": "Missed Medication",
    "Cognitive Decline": "Cognitive Decline",
    "All Normal": "All Normal",
    "Urgent Attention": "Urgent Attention",
    "Clinical Alert": "Clinical Alert",
    "No Action Needed": "No Action Needed",
    "1-Tap Call Patient": "1-Tap Call Patient",
    "Open Doctor Telehealth": "Open Doctor Telehealth",
    "North East Regional Care Map": "North East Regional Care Map",
    "8 Sister States Health Coverage": "8 Sister States Health Coverage",
    "Active Senior Hubs & Languages": "Active Senior Hubs & Languages",
    "Active Users": "Active Users",
    "Community Centers": "Community Centers",
    "Emergency Support": "Emergency Support",
    "Call Caregiver": "Call Caregiver",
    "Call Emergency Services": "Call Emergency Services",
    "Immediate Assistance": "Immediate Assistance",
    "Primary Contact": "Primary Contact",
    "Back to Dashboard": "Back to Dashboard",
    "Read Instructions": "Read Instructions",
    "Who would you like to contact?": "Who would you like to contact?",
    "Daily Health Reminders": "Daily Health Reminders",
    "Add Reminder": "Add Reminder",
    "Good day! Welcome back": "Good day! Welcome back",
    "Explore games": "Explore games",
    "View daily routines": "View daily routines",
    "Open caregiver portal": "Open caregiver portal",
    "Explore all insights": "Explore all insights",
    "Listen to Introduction": "Listen to Introduction",
    "Change Language": "Change Language",
    "Profile": "Profile",
    "Emergency Help": "Emergency Help",
  },
  hi: {
    "Quick Senior Brain Spark": "त्वरित मस्तिष्क अभ्यास",
    "15-Second Mini Memory Challenge": "१५-सेकंड मिनी मेमोरी चुनौती",
    "Tap 2 matching cards to awaken recall": "याददाश्त जगाने के लिए २ मिलते-जुलते कार्ड्स पर टैप करें",
    "Moves": "चालें (Moves)",
    "Time": "समय (Time)",
    "Seconds": "सेकंड",
    "Sec": "सेकंड",
    "Try Again": "पुनः प्रयास करें",
    "Play Full Games": "पूरा खेल खेलें",
    "Congratulations! Recall Sparked!": "बधाई हो! याददाश्त सक्रिय हुई!",
    "Mindful Breathing Orb": "शांत श्वास अभ्यास (Mindful Breathing)",
    "Senior Relaxation & Focus": "वरिष्ठ नागरिकों के लिए शांति व एकाग्रता",
    "Inhale": "सांस अंदर लें (Inhale)",
    "Exhale": "सांस छोड़ें (Exhale)",
    "Hold": "सांस रोकें (Hold)",
    "Breathe In": "सांस अंदर लें",
    "Breathe Out": "सांस छोड़ें",
    "Hold Breath": "सांस रोक कर रखें",
    "Start Breathing": "श्वास अभ्यास शुरू करें",
    "Pause": "रोकें (Pause)",
    "Reset": "रीसेट करें (Reset)",
    "Cycles Completed": "पूरे किए गए चक्र",
    "Caregiver Peace of Mind Simulator": "देखभालकर्ता शांति सिम्युलेटर",
    "Live Alert Preview": "लाइव अलर्ट पूर्वावलोकन",
    "Healthy Routine": "स्वस्थ दिनचर्या",
    "Missed Medication": "दवा छूट गई",
    "Cognitive Decline": "संज्ञानात्मक बदलाव",
    "All Normal": "सब सामान्य है",
    "Urgent Attention": "तत्काल ध्यान दें",
    "Clinical Alert": "चिकित्सीय अलर्ट",
    "No Action Needed": "किसी कार्रवाई की जरूरत नहीं",
    "1-Tap Call Patient": "एक टैप में मरीज को कॉल करें",
    "Open Doctor Telehealth": "टेलीहेल्थ डॉक्टर परामर्श",
    "North East Regional Care Map": "उत्तर-पूर्व क्षेत्रीय स्वास्थ्य मानचित्र",
    "8 Sister States Health Coverage": "८ पूर्वोत्तर राज्यों में स्वास्थ्य सेवा",
    "Active Senior Hubs & Languages": "सक्रिय वरिष्ठ केंद्र व भाषाएं",
    "Active Users": "सक्रिय उपयोगकर्ता",
    "Community Centers": "सामुदायिक केंद्र",
    "Emergency Support": "आपातकालीन सहायता",
    "Call Caregiver": "देखभालकर्ता को कॉल करें",
    "Call Emergency Services": "आपातकालीन सेवा (112) को कॉल करें",
    "Immediate Assistance": "त्वरित सहायता",
    "Primary Contact": "मुख्य संपर्क",
    "Back to Dashboard": "डैशबोर्ड पर वापस जाएं",
    "Read Instructions": "निर्देश सुनें",
    "Who would you like to contact?": "आप किससे संपर्क करना चाहते हैं?",
    "Daily Health Reminders": "दैनिक स्वास्थ्य अनुस्मारक",
    "Add Reminder": "अनुस्मारक जोड़ें",
    "Good day! Welcome back": "नमस्ते! आपका स्वागत है",
    "Explore games": "खेल देखें",
    "View daily routines": "दिनचर्या देखें",
    "Open caregiver portal": "देखभाल पोर्टल खोलें",
    "Explore all insights": "सभी लेख देखें",
    "Listen to Introduction": "परिचय सुनें",
    "Change Language": "भाषा बदलें",
    "Profile": "प्रोफ़ाइल",
    "Emergency Help": "आपातकालीन सहायता",
  },
  as: {
    "Quick Senior Brain Spark": "ক্ষিপ্ৰ মগজুৰ অনুশীলন",
    "15-Second Mini Memory Challenge": "১৫-ছেকেণ্ডৰ ক্ষুদ্ৰ স্মৃতি খেল",
    "Tap 2 matching cards to awaken recall": "স্মৃতিশক্তি জাগ্ৰত কৰিবলৈ ২ খন একে কাৰ্ডত টিপক",
    "Moves": "চেষ্টা (Moves)",
    "Time": "সময় (Time)",
    "Seconds": "ছেকেণ্ড",
    "Sec": "ছেকেণ্ড",
    "Try Again": "পুনৰ চেষ্টা কৰক",
    "Play Full Games": "সম্পূৰ্ণ খেল খেলক",
    "Congratulations! Recall Sparked!": "অভিনন্দন! স্মৃতি সজীৱ হৈ উঠিল!",
    "Mindful Breathing Orb": "শান্ত শ্বাস-প্ৰশ্বাস অনুশীলন",
    "Senior Relaxation & Focus": "বয়োজ্যেষ্ঠসকলৰ মনৰ শান্তি আৰু একাগ্ৰতা",
    "Inhale": "উশাহ লওক (Inhale)",
    "Exhale": "নিশাহ এৰক (Exhale)",
    "Hold": "ধৰি ৰাখক (Hold)",
    "Breathe In": "উশাহ লওক",
    "Breathe Out": "নিশাহ এৰক",
    "Hold Breath": "উশাহ ধৰি ৰাখক",
    "Start Breathing": "অনুশীলন আৰম্ভ কৰক",
    "Pause": "ৰখাওক (Pause)",
    "Reset": "নতুনকৈ আৰম্ভ কৰক",
    "Cycles Completed": "সম্পূৰ্ণ হোৱা চক্ৰ",
    "Caregiver Peace of Mind Simulator": "পৰিয়ালৰ সুৰক্ষা নিৰীক্ষণ",
    "Live Alert Preview": "লাইভ সতর্কবার্তা পূৰ্বদৰ্শন",
    "Healthy Routine": "স্বাস্থ্যকৰ দিনচৰ্যা",
    "Missed Medication": "ঔষধ খোৱা পাহৰিছে",
    "Cognitive Decline": "মানসিক সতর্কবাৰ্তা",
    "All Normal": "সকলো স্বাভাৱিক",
    "Urgent Attention": "জৰুৰী দৃষ্টি প্ৰয়োজন",
    "Clinical Alert": "চিকিৎসাজনিত সতৰ্কবাণী",
    "No Action Needed": "কোনো ব্যৱস্থা লোৱাৰ প্ৰয়োজন নাই",
    "1-Tap Call Patient": "একে টিপাতে ফোন কৰক",
    "Open Doctor Telehealth": "টেলিহেল্থ চিকিৎসক সেৱা",
    "North East Regional Care Map": "উত্তৰ-পূব আঞ্চলিক যত্ন মেপ",
    "8 Sister States Health Coverage": "৮ ভগ্নী ৰাজ্যৰ স্বাস্থ্য সেৱা",
    "Active Senior Hubs & Languages": "সক্ৰিয় কেন্দ্ৰ আৰু ভাষাসমূহ",
    "Active Users": "সক্ৰিয় ব্যৱহাৰকাৰী",
    "Community Centers": "সমাজ কেন্দ্ৰসমূহ",
    "Emergency Support": "জৰুৰীকালীন সাহায্য",
    "Call Caregiver": "যত্নলোৱা ব্যক্তিক ফোন কৰক",
    "Call Emergency Services": "জৰুৰীকালীন সেৱাত (112) ফোন কৰক",
    "Immediate Assistance": "তাৎক্ষণিক সাহায্য",
    "Primary Contact": "প্ৰাথমিক যোগাযোগ",
    "Back to Dashboard": "ডেশ্ববৰ্ডলৈ উভতি যাওক",
    "Read Instructions": "নিৰ্দেশনা শুনক",
    "Who would you like to contact?": "আপুনি কাৰ লগত যোগাযোগ কৰিব বিচাৰে?",
    "Daily Health Reminders": "দৈনন্দিন স্বাস্থ্য সোঁৱৰণী",
    "Add Reminder": "সোঁৱৰণী যোগ কৰক",
    "Good day! Welcome back": "শুভ দিন! আপোনাক স্বাগতম",
    "Explore games": "খেলসমূহ চাওক",
    "View daily routines": "ৰুটিন চাওক",
    "Open caregiver portal": "যত্ন প'ৰ্টেল খোলক",
    "Explore all insights": "সকলো লিখনি পঢ়ক",
    "Listen to Introduction": "বিৱৰণ শুনক",
    "Change Language": "ভাষা সলনি কৰক",
    "Profile": "প্রফাইল",
    "Emergency Help": "জৰুৰীকালীন সাহায্য",
  },
  bn: {
    "Quick Senior Brain Spark": "দ্রুত স্মৃতি ব্যায়াম",
    "15-Second Mini Memory Challenge": "১৫-সেকেন্ডের মিনি মেমোরি চ্যালেঞ্জ",
    "Tap 2 matching cards to awaken recall": "স্মৃতি জাগ্রত করতে ২টি একই কার্ডে চাপ দিন",
    "Moves": "চাল (Moves)",
    "Time": "সময় (Time)",
    "Seconds": "সেকেন্ড",
    "Sec": "সেকেন্ড",
    "Try Again": "আবার চেষ্টা করুন",
    "Play Full Games": "পুরো খেলা খেলুন",
    "Congratulations! Recall Sparked!": "অভিনন্দন! স্মৃতিশক্তি জাগ্রত হলো!",
    "Mindful Breathing Orb": "শান্ত শ্বাস-প্রশ্বাস অনুশীলন",
    "Senior Relaxation & Focus": "মনোযোগ ও মানসিক প্রশান্তি",
    "Inhale": "শ্বাস নিন (Inhale)",
    "Exhale": "শ্বাস ছাড়ুন (Exhale)",
    "Hold": "শ্বাস ধরে রাখুন (Hold)",
    "Breathe In": "শ্বাস নিন",
    "Breathe Out": "শ্বাস ছাড়ুন",
    "Hold Breath": "শ্বাস ধরে রাখুন",
    "Start Breathing": "অনুশীলন শুরু করুন",
    "Pause": "থামুন",
    "Reset": "রিসেট করুন",
    "Cycles Completed": "সম্পন্ন চক্র",
    "Caregiver Peace of Mind Simulator": "পরিবারের শান্তি সিমুলেটর",
    "Live Alert Preview": "লাইভ সতর্কবার্তা প্রিভিউ",
    "Healthy Routine": "স্বাস্থ্যকর রুটিন",
    "Missed Medication": "ওষুধ ভুলে গেছেন",
    "Cognitive Decline": "স্মৃতি পরিবর্তন",
    "All Normal": "সব স্বাভাবিক",
    "Urgent Attention": "জরুরি দৃষ্টি প্রয়োজন",
    "Clinical Alert": "চিকিৎসা সতর্কতা",
    "No Action Needed": "পদক্ষেপের প্রয়োজন নেই",
    "1-Tap Call Patient": "এক ক্লিকে রোগীকে কল করুন",
    "Open Doctor Telehealth": "টেলিহেলথ ডাক্তার পরামর্শ",
    "North East Regional Care Map": "উত্তর-পূর্ব আঞ্চলিক পরিচর্যা মানচিত্র",
    "8 Sister States Health Coverage": "৮ উত্তর-পূর্ব রাজ্যের সেবা",
    "Active Senior Hubs & Languages": "সক্রিয় কেন্দ্র ও ভাষাসমূহ",
    "Active Users": "সক্রিয় সদস্য",
    "Community Centers": "কমিউনিটি সেন্টার",
    "Emergency Support": "জরুরি সাহায্য",
    "Call Caregiver": "পরিচর্যাকারীকে কল করুন",
    "Call Emergency Services": "জরুরি সেবায় (১১২) কল করুন",
    "Immediate Assistance": "তাত্ক্ষণিক সাহায্য",
    "Primary Contact": "প্রধান যোগাযোগ",
    "Back to Dashboard": "ড্যাশবোর্ডে ফিরুন",
    "Read Instructions": "নির্দেশনা শুনুন",
    "Who would you like to contact?": "কার সাথে যোগাযোগ করতে চান?",
    "Daily Health Reminders": "দৈনন্দিন স্বাস্থ্য রিমাইন্ডার",
    "Add Reminder": "রিমাইন্ডার যোগ করুন",
    "Good day! Welcome back": "নমস্কার! আপনাকে স্বাগতম",
    "Explore games": "খেলা দেখুন",
    "View daily routines": "রুটিন দেখুন",
    "Open caregiver portal": "কেয়ারগিভার পোর্টাল খুলুন",
    "Explore all insights": "সব তথ্য দেখুন",
    "Listen to Introduction": "পরিচিতি শুনুন",
    "Change Language": "ভাষা পরিবর্তন",
    "Profile": "প্রোফাইল",
    "Emergency Help": "জরুরি সাহায্য",
  },
  mni: {
    "Quick Senior Brain Spark": "য়াম্না থুনা ৱাখল পোকহনবা",
    "15-Second Mini Memory Challenge": "সেকেন্ড ১৫গী অপিকপা নিংশিং শান্নবা",
    "Tap 2 matching cards to awaken recall": "নিংশিংহনবগীদমক মান্নবা কার্দ ২দা নাম্বিয়ু",
    "Moves": "খোঙথাং (Moves)",
    "Time": "মতং (Time)",
    "Seconds": "সেকেন্ড",
    "Sec": "সেকেন্ড",
    "Try Again": "অমুক হন্না হোৎনবিয়ু",
    "Play Full Games": "মপুংফাবা শান্নবিয়ু",
    "Congratulations! Recall Sparked!": "নুংঙাইবা ফোঙদোকচরি! নিংশিংবা ফগৎলে!",
    "Mindful Breathing Orb": "নুংশিৎ শেংহনবা শান্নবা",
    "Senior Relaxation & Focus": "অহল ওইরবা মীওইশিংগী নুংঙাইবা",
    "Inhale": "নুংশিৎ চিংশিনবিয়ু",
    "Exhale": "নুংশিৎ থাদোকপিয়ু",
    "Hold": "থম্বিয়ু",
    "Breathe In": "নুংশিৎ চিংশিনবিয়ু",
    "Breathe Out": "নুংশিৎ থাদোকপিয়ু",
    "Hold Breath": "নুংশিৎ থম্বিয়ু",
    "Start Breathing": "শুরু তৌবিয়ু",
    "Pause": "লেপপিয়ু",
    "Reset": "অমুক হন্না তৌবিয়ু",
    "Cycles Completed": "লোইশিল্পা",
    "Caregiver Peace of Mind Simulator": "য়ুমগী মীওইশিংগী অপেনবা",
    "Live Alert Preview": "লাইভ ৱার্নিং",
    "Healthy Routine": "অনা-অয়েক য়াওদবা রুটিন",
    "Missed Medication": "হিদাক থকপা কাওবা",
    "Cognitive Decline": "ৱাখল কাওবা",
    "All Normal": "পুম্নমক ফরে",
    "Urgent Attention": "য়াম্না মরুওইবা",
    "Clinical Alert": "দোক্তরগী ৱার্নিং",
    "No Action Needed": "অতোপ্পা তৌবা মথৌ তাদে",
    "1-Tap Call Patient": "এক-টাপ কোল",
    "Open Doctor Telehealth": "দোক্তর কোল তৌবা",
    "North East Regional Care Map": "নোংপোক ভারতকী মেপ",
    "8 Sister States Health Coverage": "ষ্টেট ৮ গী সেবা",
    "Active Senior Hubs & Languages": "লোলশিং অমসুং সেন্তরশিং",
    "Active Users": "শান্নরিবা মীশিং",
    "Community Centers": "কম্যুনিটি সেন্তরশিং",
    "Emergency Support": "খুদোংচাদবা মতমদা মতেং",
    "Call Caregiver": "য়ুমগী মীওইদা কোল তৌবিয়ু",
    "Call Emergency Services": "ইমার্জেন্সীদা কোল তৌবিয়ু (112)",
    "Immediate Assistance": "খুদক্তা মতেং",
    "Primary Contact": "মরুওইবা কন্তেক্ত",
    "Back to Dashboard": "ড্যাশবোর্ডতা হঞ্জিনবিয়ু",
    "Read Instructions": "ইন্সত্রক্সন তানবিয়ু",
    "Who would you like to contact?": "কনাবু কোল তৌনিংবগে?",
    "Daily Health Reminders": "নোংমগী নিংশিংবা",
    "Add Reminder": "নিংশিংবা হাপচিনবিয়ু",
    "Good day! Welcome back": "খুরুমজরি! তরাম্না ওকচরি",
    "Explore games": "শান্নবা য়েংবিয়ু",
    "View daily routines": "রুটিন য়েংবিয়ু",
    "Open caregiver portal": "কেয়ারগিভার পোর্তেল",
    "Explore all insights": "আর্টিকেলশিং য়েংবিয়ু",
    "Listen to Introduction": "তানবিয়ু",
    "Change Language": "লোল হোংদোকপা",
    "Profile": "প্রোফাইল",
    "Emergency Help": "খুদোংচাদবগী মতেং",
  },
  brx: {
    "Quick Senior Brain Spark": "गोरलै मेमरी गेलेनाय",
    "15-Second Mini Memory Challenge": "१५-सेकेण्ड मेमरी गेलेनाय",
    "Tap 2 matching cards to awaken recall": "गोसोखां फिननो २ खन कार्डाव थु",
    "Moves": "गेलेनाय (Moves)",
    "Time": "सम (Time)",
    "Seconds": "सेकेण्ड",
    "Sec": "सेकेण्ड",
    "Try Again": "फिन नाजा",
    "Play Full Games": "आबुं गेले",
    "Congratulations! Recall Sparked!": "गोजोननाय! मेमरी मोजां जाबाय!",
    "Mindful Breathing Orb": "हां लानाय-गारनाय",
    "Senior Relaxation & Focus": "सुख आरो गोसो थि खालामनाय",
    "Inhale": "हां ला (Inhale)",
    "Exhale": "हां गार (Exhale)",
    "Hold": "हां लाखि (Hold)",
    "Breathe In": "हां ला",
    "Breathe Out": "हां गार",
    "Hold Breath": "हां लाखि",
    "Start Breathing": "जागाय",
    "Pause": "थादो",
    "Reset": "फिन जागाय",
    "Cycles Completed": "जोबबाय",
    "Caregiver Peace of Mind Simulator": "फारसे नायगिरिनि सुख",
    "Live Alert Preview": "अलार्ट",
    "Healthy Routine": "मोजां नेम",
    "Missed Medication": "मुलि बावबाय",
    "Cognitive Decline": "मेमरी खम जादों",
    "All Normal": "गासै मोजां",
    "Urgent Attention": "गोनांथार",
    "Clinical Alert": "डक्टर अलार्ट",
    "No Action Needed": "जेबो नाङा",
    "1-Tap Call Patient": "कल खालाम",
    "Open Doctor Telehealth": "डक्टर फोन",
    "North East Regional Care Map": "उत्तर-पूर्वाञ्चल मानसावगारि",
    "8 Sister States Health Coverage": "८ राज्यो",
    "Active Senior Hubs & Languages": "राव आरो जायगा",
    "Active Users": "गेलेग्राफोर",
    "Community Centers": "थावनि",
    "Emergency Support": "गोनांथार मदद",
    "Call Caregiver": "नायगिरिनो कल खालाम",
    "Call Emergency Services": "इमर्जेन्सी कल (112)",
    "Immediate Assistance": "मदद",
    "Primary Contact": "कन्टेक्ट",
    "Back to Dashboard": "डेशबोर्डआव थांफिन",
    "Read Instructions": "खोनासंस",
    "Who would you like to contact?": "सोरनो फोन खालामनो?",
    "Daily Health Reminders": "सानफ्रोमबोनि गोसोखां",
    "Add Reminder": "दाजाब",
    "Good day! Welcome back": "खुलुमबाय! बरायबाय",
    "Explore games": "गेलेनाय नाय",
    "View daily routines": "नेम नाय",
    "Open caregiver portal": "नायगिरि पोर्टल",
    "Explore all insights": "गासै नाय",
    "Listen to Introduction": "खोनासंस",
    "Change Language": "राव सोलाय",
    "Profile": "प्रोफाइल",
    "Emergency Help": "इमर्जेन्सी मदद",
  },
  kha: {
    "Quick Senior Brain Spark": "Jingpynkynmaw Kaba Kloi",
    "15-Second Mini Memory Challenge": "15-Sekon Jingialehkai Kynmaw",
    "Tap 2 matching cards to awaken recall": "Shon 2 tylli ki kot kiba iah ban kynmaw",
    "Moves": "Ki Jingkhih (Moves)",
    "Time": "Por (Time)",
    "Seconds": "Sekon",
    "Sec": "Sekon",
    "Try Again": "Pyrshang biang",
    "Play Full Games": "Ialehkai Lut",
    "Congratulations! Recall Sparked!": "Khublei! Jingkynmaw ka lah khie biang!",
    "Mindful Breathing Orb": "Jingring Mynsiem Suk",
    "Senior Relaxation & Focus": "Jingsuk na ka bynta ki Tymmen",
    "Inhale": "Ring Mynsiem (Inhale)",
    "Exhale": "Pynhiar Mynsiem (Exhale)",
    "Hold": "Bat Por (Hold)",
    "Breathe In": "Ring Mynsiem",
    "Breathe Out": "Pynhiar Mynsiem",
    "Hold Breath": "Bat Mynsiem",
    "Start Breathing": "Sdang",
    "Pause": "Sangeh shipor",
    "Reset": "Sdang biang",
    "Cycles Completed": "La Dep",
    "Caregiver Peace of Mind Simulator": "Jingsuk ki Bah-khala",
    "Live Alert Preview": "Jingpyntip Shisien Ring",
    "Healthy Routine": "Ka Rukom Kaba Koit",
    "Missed Medication": "Klet Dawai",
    "Cognitive Decline": "Hiari Jingkynmaw",
    "All Normal": "Bha Lut Baroh",
    "Urgent Attention": "Donkam Jingiada Manta",
    "Clinical Alert": "Jingpyntip Doktar",
    "No Action Needed": "Ym donkam Leh eiei",
    "1-Tap Call Patient": "Phone ha u tymmen",
    "Open Doctor Telehealth": "Wad Doktar Telehealth",
    "North East Regional Care Map": "Ka Map North East",
    "8 Sister States Health Coverage": "8 Tylli ki Jylla",
    "Active Senior Hubs & Languages": "Ktien bad ki jaka",
    "Active Users": "Ki Nongpyndonkam",
    "Community Centers": "Ki Jaka Shnong",
    "Emergency Support": "Jingiarap ba Kloi",
    "Call Caregiver": "Phone sha u Bah-khala",
    "Call Emergency Services": "Phone sha Emergency (112)",
    "Immediate Assistance": "Jingiarap ba kyrkieh",
    "Primary Contact": "Nongiatrehkam ba kongsan",
    "Back to Dashboard": "Leh biang sha Dashboard",
    "Read Instructions": "Sngap ki jingbthah",
    "Who would you like to contact?": "Kumno phin kwah ban phone?",
    "Daily Health Reminders": "Jingpynkynmaw Man ka Sngi",
    "Add Reminder": "Buh Jingpynkynmaw",
    "Good day! Welcome back": "Khublei! Pdiang sngewbha",
    "Explore games": "Peit ia ki jingialehkai",
    "View daily routines": "Peit rukom man ka sngi",
    "Open caregiver portal": "Plie Caregiver Portal",
    "Explore all insights": "Pule ki jingtip",
    "Listen to Introduction": "Sngap jingbthah",
    "Change Language": "Kylla Ktien",
    "Profile": "Profile",
    "Emergency Help": "Jingiarap ba Kloi",
  },
  grx: {
    "Quick Senior Brain Spark": "Chanchibani Kal·ani",
    "15-Second Mini Memory Challenge": "15-Sekon Gisimatani Kal·ani",
    "Tap 2 matching cards to awaken recall": "Kard gipin baksa apsan ong·ako dokbo",
    "Moves": "Dakchakani (Moves)",
    "Time": "Somoy (Time)",
    "Seconds": "Sekon",
    "Sec": "Sekon",
    "Try Again": "Daktaibo",
    "Play Full Games": "Chu·gimik Kal·bo",
    "Congratulations! Recall Sparked!": "Mittela! Gisik nambatai-jok!",
    "Mindful Breathing Orb": "Rang·sitani Kal·ani",
    "Senior Relaxation & Focus": "Bredelgiparangna Tom·tomani",
    "Inhale": "Rang·sit Salopbo",
    "Exhale": "Rang·sit Watbo",
    "Hold": "Rikbo",
    "Breathe In": "Rang·sit Salopbo",
    "Breathe Out": "Rang·sit Watbo",
    "Hold Breath": "Rang·sit Rikbo",
    "Start Breathing": "A·bachenggimbo",
    "Pause": "Dingtangbo",
    "Reset": "Gital A·bachenggimbo",
    "Cycles Completed": "Matchotaha",
    "Caregiver Peace of Mind Simulator": "Nidilgipani Suk",
    "Live Alert Preview": "Simsakani Preview",
    "Healthy Routine": "Kakket Somoy",
    "Missed Medication": "Sam Gualaha",
    "Cognitive Decline": "Chanchiani Gimaaha",
    "All Normal": "Pilak Namaha",
    "Urgent Attention": "Nangchongmota",
    "Clinical Alert": "Daktarni Uiatani",
    "No Action Needed": "Nangja",
    "1-Tap Call Patient": "Phone Dokbo",
    "Open Doctor Telehealth": "Daktarna Phone Dokbo",
    "North East Regional Care Map": "North East Map",
    "8 Sister States Health Coverage": "State 8",
    "Active Senior Hubs & Languages": "Ku·sikrang aro Songrang",
    "Active Users": "Kal·giparang",
    "Community Centers": "Songni biaprang",
    "Emergency Support": "Duktangni Dakchakani",
    "Call Caregiver": "Nidilgipana Phone Dokbo",
    "Call Emergency Services": "Emergency (112) na Dokbo",
    "Immediate Assistance": "Ta·rake Dakchakani",
    "Primary Contact": "Mongsonggipa Contact",
    "Back to Dashboard": "Dashboardona Re·bapilbo",
    "Read Instructions": "Knathimbo",
    "Who would you like to contact?": "Sanasa Phone dokna ska?",
    "Daily Health Reminders": "Salanti Gisik Ra·atani",
    "Add Reminder": "On·dape Gisik Ra·atbo",
    "Good day! Welcome back": "Mittela! Rimnapbeaha",
    "Explore games": "Kal·anirangko Nibo",
    "View daily routines": "Salantiko Nibo",
    "Open caregiver portal": "Portal Kulibo",
    "Explore all insights": "Poraibo",
    "Listen to Introduction": "Knathimbo",
    "Change Language": "Ku·sik Dingtangata",
    "Profile": "Profile",
    "Emergency Help": "Duktang Dakchakani",
  },
  miz: {
    "Quick Senior Brain Spark": "Thluak Sawizawina Rang",
    "15-Second Mini Memory Challenge": "Sekan 15 Hriatna Fiahna",
    "Tap 2 matching cards to awaken recall": "Inang card pahnih hmet la i thluak tihar rawh",
    "Moves": "Tih zat (Moves)",
    "Time": "Hun (Time)",
    "Seconds": "Sekan",
    "Sec": "Sekan",
    "Try Again": "Ti nawn leh rawh",
    "Play Full Games": "A pum pui khel rawh",
    "Congratulations! Recall Sparked!": "Tahnemngai thlak takin i zo ta!",
    "Mindful Breathing Orb": "Thawlak Dam Diai Sawizawina",
    "Senior Relaxation & Focus": "Kum upate tan thlamuanna leh rilru zawmna",
    "Inhale": "Hip lut rawh (Inhale)",
    "Exhale": "Thaw chhuak rawh (Exhale)",
    "Hold": "Chelh rawh (Hold)",
    "Breathe In": "Hip lut rawh",
    "Breathe Out": "Thaw chhuak rawh",
    "Hold Breath": "Thaw chelh rawh",
    "Start Breathing": "Tan rawh le",
    "Pause": "Chawl rih rawh",
    "Reset": "Tan thar leh rawh",
    "Cycles Completed": "Zo fel zat",
    "Caregiver Peace of Mind Simulator": "Enkawltu rilru hahdamna",
    "Live Alert Preview": "Hriattirna Live Enchhinna",
    "Healthy Routine": "Nitin Nunphung Tha",
    "Missed Medication": "Damdawi theihnghilh",
    "Cognitive Decline": "Hriatna tlahniam",
    "All Normal": "A tha vek e",
    "Urgent Attention": "Hmanhmawh ngai",
    "Clinical Alert": "Damdawi In Hriattirna",
    "No Action Needed": "Tih ngai a awm lo",
    "1-Tap Call Patient": "Phone nghal rawh",
    "Open Doctor Telehealth": "Doctor be rawh",
    "North East Regional Care Map": "North East Enkawlna Hmun",
    "8 Sister States Health Coverage": "State 8 awp chin",
    "Active Senior Hubs & Languages": "Tawng leh Hmunte",
    "Active Users": "Hmantute",
    "Community Centers": "Vantlang Hmunte",
    "Emergency Support": "Hmanhmawh Thlamuanna",
    "Call Caregiver": "Enkawltu be rawh",
    "Call Emergency Services": "Emergency (112) be rawh",
    "Immediate Assistance": "Chhanpuina hmanhmawh",
    "Primary Contact": "Biak hmasak ber",
    "Back to Dashboard": "Dashboard-ah kir leh rawh",
    "Read Instructions": "Inkaihhruaina ngaithla rawh",
    "Who would you like to contact?": "Tunge i biak duh le?",
    "Daily Health Reminders": "Nitin Hriselna Hriattirna",
    "Add Reminder": "Hriattirna thar dah rawh",
    "Good day! Welcome back": "Chibai! Kan lo lawm a che",
    "Explore games": "Infiamna en rawh",
    "View daily routines": "Nitin hun en rawh",
    "Open caregiver portal": "Enkawltu portal hawng rawh",
    "Explore all insights": "Zirbingna chhiar rawh",
    "Listen to Introduction": "Hriattirna ngaithla rawh",
    "Change Language": "Tawng thlak rawh",
    "Profile": "Profile",
    "Emergency Help": "Hmanhmawh Tih Tur",
  },
  nag: {
    "Quick Senior Brain Spark": "Dimag laga joldi practice",
    "15-Second Mini Memory Challenge": "15-Second Mini Memory Khel",
    "Tap 2 matching cards to awaken recall": "Milua laga 2 ta card tap koribo",
    "Moves": "Khelise (Moves)",
    "Time": "Time",
    "Seconds": "Seconds",
    "Sec": "Sec",
    "Try Again": "Aro ekbar koro",
    "Play Full Games": "Bishi khel kela",
    "Congratulations! Recall Sparked!": "Bhal kotha! Dimag khuli jaise!",
    "Mindful Breathing Orb": "Saas luwa shanti exercise",
    "Senior Relaxation & Focus": "Bura manu khan laga shanti",
    "Inhale": "Saas bitor lo (Inhale)",
    "Exhale": "Saas bahir koro (Exhale)",
    "Hold": "Roki thako (Hold)",
    "Breathe In": "Saas bitor lo",
    "Breathe Out": "Saas bahir koro",
    "Hold Breath": "Saas roki thako",
    "Start Breathing": "Shuru koro",
    "Pause": "Roko",
    "Reset": "Phin shuru koro",
    "Cycles Completed": "Khatam hua",
    "Caregiver Peace of Mind Simulator": "Ghar manu laga shanti",
    "Live Alert Preview": "Live Alert",
    "Healthy Routine": "Bhal Routine",
    "Missed Medication": "Dawai paborise",
    "Cognitive Decline": "Dimag komti hoise",
    "All Normal": "Sob thik asey",
    "Urgent Attention": "Joldi chaw",
    "Clinical Alert": "Doctor Alert",
    "No Action Needed": "Kiba kora na lagibo",
    "1-Tap Call Patient": "Phone koro",
    "Open Doctor Telehealth": "Doctor Telehealth",
    "North East Regional Care Map": "North East Map",
    "8 Sister States Health Coverage": "8 States Coverage",
    "Active Senior Hubs & Languages": "Languages and Hubs",
    "Active Users": "Active Manu",
    "Community Centers": "Community Centers",
    "Emergency Support": "Emergency Help",
    "Call Caregiver": "Caregiver ke Call koro",
    "Call Emergency Services": "Emergency (112) ke Call koro",
    "Immediate Assistance": "Joldi Help",
    "Primary Contact": "Asol Contact",
    "Back to Dashboard": "Dashboard te wapas jao",
    "Read Instructions": "Kotha sunibo",
    "Who would you like to contact?": "Kake call koribo?",
    "Daily Health Reminders": "Daily Health Reminders",
    "Add Reminder": "Reminder Dalo",
    "Good day! Welcome back": "Namaste! Welcome back",
    "Explore games": "Khel chaw",
    "View daily routines": "Routine chaw",
    "Open caregiver portal": "Caregiver portal khulo",
    "Explore all insights": "Bishi kotha chaw",
    "Listen to Introduction": "Sunibo",
    "Change Language": "Language Badli Koro",
    "Profile": "Profile",
    "Emergency Help": "Emergency Help",
  },
  trp: {
    "Quick Senior Brain Spark": "Khorok Hamari Khel",
    "15-Second Mini Memory Challenge": "15-Second Khel",
    "Tap 2 matching cards to awaken recall": "Phaimani card 2 ta tap kholubu",
    "Moves": "Tangmung (Moves)",
    "Time": "Jora (Time)",
    "Seconds": "Seconds",
    "Sec": "Sec",
    "Try Again": "Phin kholubu",
    "Play Full Games": "Botor Khel",
    "Congratulations! Recall Sparked!": "Hambai! Khorok kotor!",
    "Mindful Breathing Orb": "Rongkhol Breathing",
    "Senior Relaxation & Focus": "Khorok Tongmung",
    "Inhale": "Rongkhol Tubu",
    "Exhale": "Rongkhol Hor",
    "Hold": "Ton",
    "Breathe In": "Rongkhol Tubu",
    "Breathe Out": "Rongkhol Hor",
    "Hold Breath": "Rongkhol Ton",
    "Start Breathing": "Chengbu",
    "Pause": "Donbu",
    "Reset": "Phin Chengbu",
    "Cycles Completed": "Paijakha",
    "Caregiver Peace of Mind Simulator": "Caregiver Tongmung",
    "Live Alert Preview": "Alert Preview",
    "Healthy Routine": "Hamari Routine",
    "Missed Medication": "Bwsao Bawikha",
    "Cognitive Decline": "Khorok Komaikha",
    "All Normal": "Kahamba",
    "Urgent Attention": "Jora Nang",
    "Clinical Alert": "Doctor Alert",
    "No Action Needed": "Khurumkha",
    "1-Tap Call Patient": "Phone Khola",
    "Open Doctor Telehealth": "Doctor Telehealth",
    "North East Regional Care Map": "North East Map",
    "8 Sister States Health Coverage": "8 Haste",
    "Active Senior Hubs & Languages": "Kokrok Hubs",
    "Active Users": "Borokrok",
    "Community Centers": "Community Centers",
    "Emergency Support": "SOS Help",
    "Call Caregiver": "Caregiver-no Phone Khola",
    "Call Emergency Services": "Emergency (112) Phone Khola",
    "Immediate Assistance": "Kutung Help",
    "Primary Contact": "Asol Contact",
    "Back to Dashboard": "Dashboard-o Phin Thaibu",
    "Read Instructions": "Khwnabu",
    "Who would you like to contact?": "Sabo-no phone kholunai?",
    "Daily Health Reminders": "Sal-ni Reminders",
    "Add Reminder": "Reminder Phato",
    "Good day! Welcome back": "Khulumkha! Phaimani hamkrai",
    "Explore games": "Khel nai",
    "View daily routines": "Routine nai",
    "Open caregiver portal": "Portal kholubu",
    "Explore all insights": "Swrwngmung nai",
    "Listen to Introduction": "Khwnabu",
    "Change Language": "Kok Salai",
    "Profile": "Profile",
    "Emergency Help": "SOS Help",
  },
  ne: {
    "Quick Senior Brain Spark": "द्रुत मस्तिष्क स्मरण अभ्यास",
    "15-Second Mini Memory Challenge": "१५-सेकेन्ड मिनी मेमोरी चुनौती",
    "Tap 2 matching cards to awaken recall": "स्मरण शक्ति जगाउन २ मिल्ने कार्डहरू थिच्नुहोस्",
    "Moves": "चाल (Moves)",
    "Time": "समय (Time)",
    "Seconds": "सेकेन्ड",
    "Sec": "सेकेन्ड",
    "Try Again": "पुनः प्रयास गर्नुहोस्",
    "Play Full Games": "पूरा खेल खेल्नुहोस्",
    "Congratulations! Recall Sparked!": "बधाई छ! स्मरण शक्ति सक्रिय भयो!",
    "Mindful Breathing Orb": "शान्त श्वास-प्रश्वास अभ्यास",
    "Senior Relaxation & Focus": "ज्येष्ठ नागरिकहरूको मानसिक शान्ति",
    "Inhale": "सास भित्र तान्नुहोस् (Inhale)",
    "Exhale": "सास बाहिर छोड्नुहोस् (Exhale)",
    "Hold": "सास रोक्नुहोस् (Hold)",
    "Breathe In": "सास भित्र तान्नुहोस्",
    "Breathe Out": "सास बाहिर छोड्नुहोस्",
    "Hold Breath": "सास रोक्नुहोस्",
    "Start Breathing": "अभ्यास सुरु गर्नुहोस्",
    "Pause": "रोक्नुहोस्",
    "Reset": "रिसेट गर्नुहोस्",
    "Cycles Completed": "सम्पन्न चक्रहरू",
    "Caregiver Peace of Mind Simulator": "हेरचाहकर्ता मानसिक शान्ति सिम्युलेटर",
    "Live Alert Preview": "प्रत्यक्ष अलर्ट पूर्वावलोकन",
    "Healthy Routine": "स्वस्थ दिनचर्या",
    "Missed Medication": "औषधि लिन छुटेको",
    "Cognitive Decline": "स्मरण शक्तिमा परिवर्तन",
    "All Normal": "सबै सामान्य छ",
    "Urgent Attention": "तत्काल ध्यान दिनुहोस्",
    "Clinical Alert": "चिकित्सकीय चेतावनी",
    "No Action Needed": "कुनै कार्य आवश्यक छैन",
    "1-Tap Call Patient": "एक क्लिकमा फोन गर्नुहोस्",
    "Open Doctor Telehealth": "डाक्टर टेलिहेल्थ परामर्श",
    "North East Regional Care Map": "उत्तर-पूर्वीय क्षेत्रीय हेरचाह नक्सा",
    "8 Sister States Health Coverage": "८ दिदीबहिनी राज्यहरू",
    "Active Senior Hubs & Languages": "सक्रिय केन्द्र र भाषाहरू",
    "Active Users": "सक्रिय प्रयोगकर्ताहरू",
    "Community Centers": "सामुदायिक केन्द्रहरू",
    "Emergency Support": "आपतकालीन सहयोग",
    "Call Caregiver": "हेरचाहकर्तालाई फोन गर्नुहोस्",
    "Call Emergency Services": "आपतकालीन सेवा (११२) मा फोन गर्नुहोस्",
    "Immediate Assistance": "तत्काल सहायता",
    "Primary Contact": "मुख्य सम्पर्क",
    "Back to Dashboard": "ड्यासबोर्डमा फर्कनुहोस्",
    "Read Instructions": "निर्देशन सुन्नुहोस्",
    "Who would you like to contact?": "कसलाई सम्पर्क गर्न चाहनुहुन्छ?",
    "Daily Health Reminders": "दैनिक स्वास्थ्य सम्झौताहरू",
    "Add Reminder": "रिमाइन्डर थप्नुहोस्",
    "Good day! Welcome back": "नमस्ते! स्वागत छ",
    "Explore games": "खेलहरू हेर्नुहोस्",
    "View daily routines": "दिनचर्या हेर्नुहोस्",
    "Open caregiver portal": "हेरचाहकर्ता पोर्टल खोल्नुहोस्",
    "Explore all insights": "सबै लेखहरू पढ्नुहोस्",
    "Listen to Introduction": "परिचय सुन्नुहोस्",
    "Change Language": "भाषा बदल्नुहोस्",
    "Profile": "प्रोफाइल",
    "Emergency Help": "आपतकालीन सहयोग",
  },
  adi: {
    "Quick Senior Brain Spark": "Mishingnam Gerdungka",
    "15-Second Mini Memory Challenge": "15-Second Mini Memory Challenge",
    "Tap 2 matching cards to awaken recall": "Mishingnam aaipe 2 cards em tap langka",
    "Moves": "Moves",
    "Time": "Time",
    "Seconds": "Seconds",
    "Sec": "Sec",
    "Try Again": "Phin Gerdungka",
    "Play Full Games": "Botor Ger-nam",
    "Congratulations! Recall Sparked!": "Aitu-dung! Nok aaipe inam!",
    "Mindful Breathing Orb": "Sinyi Inam Breathing",
    "Senior Relaxation & Focus": "Mishingnam Aaipe",
    "Inhale": "Sinyi Inam (Inhale)",
    "Exhale": "Sinyi Tinnam (Exhale)",
    "Hold": "Daklangka (Hold)",
    "Breathe In": "Sinyi Inam",
    "Breathe Out": "Sinyi Tinnam",
    "Hold Breath": "Daklangka",
    "Start Breathing": "Soodang",
    "Pause": "Daklangka",
    "Reset": "Phin Soodang",
    "Cycles Completed": "Completed",
    "Caregiver Peace of Mind Simulator": "Kaa-mibo Simulator",
    "Live Alert Preview": "Live Alert Preview",
    "Healthy Routine": "Aaipe Routine",
    "Missed Medication": "Medicine Komaikha",
    "Cognitive Decline": "Mishingnam Komaikha",
    "All Normal": "Aaipe dung",
    "Urgent Attention": "Urgent",
    "Clinical Alert": "Doctor Alert",
    "No Action Needed": "Aaipe",
    "1-Tap Call Patient": "Phone Call",
    "Open Doctor Telehealth": "Doctor Telehealth",
    "North East Regional Care Map": "North East Care Map",
    "8 Sister States Health Coverage": "8 States",
    "Active Senior Hubs & Languages": "Agom & Hubs",
    "Active Users": "Active Ami",
    "Community Centers": "Community Centers",
    "Emergency Support": "Aro-Dumnam SOS",
    "Call Caregiver": "Kaa-mibo Call",
    "Call Emergency Services": "Emergency (112) Call",
    "Immediate Assistance": "Aro-Dumnam",
    "Primary Contact": "Asol Contact",
    "Back to Dashboard": "Dashboard-lo Kir",
    "Read Instructions": "Kaling instructions",
    "Who would you like to contact?": "Sim phone inam?",
    "Daily Health Reminders": "Mishingnam Reminders",
    "Add Reminder": "Mishingnam Phato",
    "Good day! Welcome back": "Kaling! Soodang aaipe",
    "Explore games": "Ger-nam Kangkan",
    "View daily routines": "Routine Kangkan",
    "Open caregiver portal": "Portal Kangkan",
    "Explore all insights": "Insights Kangkan",
    "Listen to Introduction": "Kaling audio",
    "Change Language": "Agom Alenam",
    "Profile": "Profile",
    "Emergency Help": "Aro-Dumnam",
  },
};

// Build fast normalization & reverse lookup maps
const normalizeStr = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
const cleanPunctuation = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const enToKeyMap = new Map<string, string>();
const cleanEnToKeyMap = new Map<string, string>();

Object.entries(enJson).forEach(([key, val]) => {
  if (typeof val === "string") {
    enToKeyMap.set(normalizeStr(val), key);
    cleanEnToKeyMap.set(cleanPunctuation(val), key);
  }
});

// Build extra reverse lookup maps
const extraEnToKeyMap = new Map<string, string>();
Object.entries(EXTRA_PHRASES.en).forEach(([k, v]) => {
  extraEnToKeyMap.set(normalizeStr(v), k);
});

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (keyOrText: string) => string;
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
  const [language, setLanguageState] = useState<SupportedLanguage>("as");
  const originalTextMap = useRef(new WeakMap<Node, string>());
  const isTranslatingRef = useRef(false);

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
      document.documentElement.lang = lang;
    }
  };

  /**
   * Powerful omni-directional translator:
   * 1. Resolves direct translation keys ('hero_title_1')
   * 2. Resolves prefixed keys ('nav_home', 'game_memory_match_title')
   * 3. Resolves plain English text by reverse-looking up exact or normalized English values
   * 4. Resolves supplementary interactive component phrases
   */
  const t = useCallback((keyOrText: string): string => {
    if (!keyOrText) return "";

    const dict = (TRANSLATIONS[language] || TRANSLATIONS.en) as Record<string, string>;
    const enDict = TRANSLATIONS.en as Record<string, string>;
    const extraDict = EXTRA_PHRASES[language] || EXTRA_PHRASES.en;

    // 1. Direct dictionary match
    if (dict[keyOrText]) return dict[keyOrText];

    // 2. Direct extra phrase match
    if (extraDict[keyOrText]) return extraDict[keyOrText];

    // 3. Prefixed key matches
    const prefixes = ["nav_", "game_", "hero_", "feature_", "section_", "benefit_", "step", "about_", "blog_", "modal_", "dashboard_", "reminders_", "emergency_"];
    for (const prefix of prefixes) {
      if (dict[`${prefix}${keyOrText}`]) return dict[`${prefix}${keyOrText}`];
      if (dict[`${prefix}${keyOrText.toLowerCase()}`]) return dict[`${prefix}${keyOrText.toLowerCase()}`];
    }

    // 4. Case/snake-case variants
    const snakeCase = keyOrText.toLowerCase().replace(/\s+/g, "_");
    if (dict[snakeCase]) return dict[snakeCase];

    // 5. Reverse lookup: match English string to key
    const normalized = normalizeStr(keyOrText);
    const matchedKey = enToKeyMap.get(normalized);
    if (matchedKey && dict[matchedKey]) {
      return dict[matchedKey];
    }

    // 6. Reverse lookup in extra phrases
    const matchedExtraKey = extraEnToKeyMap.get(normalized);
    if (matchedExtraKey && extraDict[matchedExtraKey]) {
      return extraDict[matchedExtraKey];
    }

    // 7. Clean punctuation match
    const cleaned = cleanPunctuation(keyOrText);
    if (cleaned.length > 2) {
      const cleanMatchedKey = cleanEnToKeyMap.get(cleaned);
      if (cleanMatchedKey && dict[cleanMatchedKey]) {
        return dict[cleanMatchedKey];
      }
    }

    // 8. If English fallback exists in enDict
    if (enDict[keyOrText]) return enDict[keyOrText];

    // 9. Format snake_case if looks like a key
    if (keyOrText.includes("_") && !keyOrText.includes(" ")) {
      return keyOrText
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    // Fallback: return raw input string
    return keyOrText;
  }, [language]);

  /**
   * DOM Text-Node Translator & Observer
   * Translates any English text node dynamically rendered across the DOM into the user's chosen language.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    document.documentElement.lang = language;
    const currentLangInfo = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
    document.documentElement.setAttribute("data-lang", language);
    document.documentElement.setAttribute("data-bcp47", currentLangInfo.bcp47);

    const translateTextNodes = (root: Node) => {
      if (isTranslatingRef.current || !root) return;
      isTranslatingRef.current = true;

      try {
        const walker = document.createTreeWalker(
          root,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              const tag = parent.tagName.toLowerCase();
              if (
                tag === "script" ||
                tag === "style" ||
                tag === "noscript" ||
                tag === "textarea" ||
                tag === "input" ||
                tag === "code" ||
                parent.isContentEditable ||
                parent.closest("[data-no-translate]")
              ) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            },
          }
        );

        let node = walker.nextNode();
        while (node) {
          const textNode = node as Text;
          const currentVal = textNode.nodeValue || "";
          const trimmed = currentVal.trim();

          if (trimmed.length > 1) {
            // Keep original English text saved
            if (!originalTextMap.current.has(textNode)) {
              originalTextMap.current.set(textNode, currentVal);
            }

            const originalVal = originalTextMap.current.get(textNode) || currentVal;
            const originalTrimmed = originalVal.trim();

            if (language === "en") {
              // Revert back to original English
              if (textNode.nodeValue !== originalVal) {
                textNode.nodeValue = originalVal;
              }
            } else {
              // Translate using our omni-directional translation function
              const translated = t(originalTrimmed);
              if (translated && translated !== originalTrimmed) {
                const replaced = originalVal.replace(originalTrimmed, translated);
                if (textNode.nodeValue !== replaced) {
                  textNode.nodeValue = replaced;
                }
              }
            }
          }
          node = walker.nextNode();
        }
      } finally {
        isTranslatingRef.current = false;
      }
    };

    // Run initial DOM translation scan
    translateTextNodes(document.body);

    // Observe future DOM updates and mutations
    let timeoutId: any = null;
    const observer = new MutationObserver((mutations) => {
      if (isTranslatingRef.current) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        translateTextNodes(document.body);
      }, 60);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [language, t]);

  const playVoicePrompt = (promptKey: "welcome" | "start" | "well_done" | "reminder_alert") => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    const textKey = `voice_${promptKey}`;
    const spokenText = dict[textKey] || dict.voice_welcome || "";
    playRegionalVoicePrompt(language, promptKey, spokenText);
  };

  const speak = (textOrKey: string) => {
    const translated = t(textOrKey);
    playRegionalVoicePrompt(language, "welcome", translated);
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
