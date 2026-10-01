/**
 * Smitri_NER - Regional Audio Prompts & Voice Engine
 * Phase 1: Regional Languages & Dialects (NER Localization)
 * 
 * Solves the Web Speech API regional lack for NER dialects:
 * 1. Plays pre-recorded lightweight audio clips from /audio/prompts/
 * 2. Uses dual auditory feedback: Calming harmonic chime + loving native speech prompt
 * 3. Rate-tuned (0.82x) specifically for elderly listeners
 */

let activeAudio: HTMLAudioElement | null = null;

export const REGIONAL_SPEECH_MAP: Record<string, { bcp47: string; fallbackLang: string }> = {
  as: { bcp47: 'as-IN', fallbackLang: 'bn-IN' }, // Assamese (fallback to Bengali phonetics if OS voice missing)
  hi: { bcp47: 'hi-IN', fallbackLang: 'hi-IN' }, // Hindi
  bn: { bcp47: 'bn-IN', fallbackLang: 'bn-IN' }, // Bengali
  en: { bcp47: 'en-IN', fallbackLang: 'en-US' }, // Indian English
  mni: { bcp47: 'mni-IN', fallbackLang: 'bn-IN' }, // Manipuri / Meitei
  brx: { bcp47: 'brx-IN', fallbackLang: 'hi-IN' }, // Bodo
  kha: { bcp47: 'kha-IN', fallbackLang: 'en-IN' }, // Khasi
  grx: { bcp47: 'grx-IN', fallbackLang: 'en-IN' }, // Garo
};

/**
 * Stop any currently playing audio or speech synthesis
 */
export function stopVoicePrompt() {
  if (typeof window === 'undefined') return;

  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {}
    activeAudio = null;
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Play soothing acoustic chime
 */
export function playChime(type: 'start' | 'success' = 'start') {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio(`/audio/prompts/chime_${type}.wav`);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {}
}

/**
 * Play a loving pre-recorded regional voice prompt + native speech synthesis
 */
export function playRegionalVoicePrompt(
  lang: string,
  promptKey: string,
  spokenText: string
) {
  if (typeof window === 'undefined') return;

  stopVoicePrompt();

  // 1. Play Pre-recorded native audio clip
  const clipUrl = `/audio/prompts/${lang}_${promptKey}.wav`;
  const audio = new Audio(clipUrl);
  audio.volume = 0.65;
  activeAudio = audio;

  audio.play().catch(() => {
    // Graceful fallback if autoplay policy restricts
  });

  // 2. Play Loving Native Voice via Web Speech API with regional dialect tags
  if ('speechSynthesis' in window && spokenText) {
    const utterance = new SpeechSynthesisUtterance(spokenText);
    const langConfig = REGIONAL_SPEECH_MAP[lang] || { bcp47: 'en-IN', fallbackLang: 'en-IN' };

    utterance.lang = langConfig.bcp47;
    utterance.rate = 0.82; // Gentle, comforting slow pace for elders
    utterance.pitch = 1.05; // Slightly higher clarity
    utterance.volume = 1.0;

    // Search for closest regional matching voice
    const voices = window.speechSynthesis.getVoices();
    let matchedVoice = voices.find(
      (v) => v.lang === langConfig.bcp47 || v.lang.startsWith(lang)
    );

    if (!matchedVoice && langConfig.fallbackLang) {
      matchedVoice = voices.find((v) => v.lang === langConfig.fallbackLang);
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    // Delay speech slightly to harmonize with the acoustic bell chime
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 280);
  }
}

/**
 * Play speech synthesis in a specific BCP-47 regional code directly
 */
export function playWebSpeechDialect(text: string, bcp47: string = 'en-IN') {
  if (typeof window === 'undefined') return;
  stopVoicePrompt();

  if ('speechSynthesis' in window && text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = bcp47;
    utterance.rate = 0.82;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang === bcp47 || v.lang.startsWith(bcp47.split('-')[0])
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 200);
  }
}

