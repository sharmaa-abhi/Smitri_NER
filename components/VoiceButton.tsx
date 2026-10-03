"use client";

import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { playChime } from '@/lib/audioPrompts';

interface VoiceButtonProps {
  textToRead?: string;
  onSpeechResult?: (transcript: string) => void;
  className?: string;
  buttonLabel?: string;
}

export default function VoiceButton({
  textToRead,
  onSpeechResult,
  className = "",
  buttonLabel = "Read Instructions"
}: VoiceButtonProps) {
  const { currentLangInfo, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Text to Speech
  const speakText = () => {
    if (!textToRead) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setStatusMessage("Voice audio not supported in this browser.");
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Play subtle chime for elder focus
    playChime('start');

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.82; // Gentle, comforting pace for seniors
    utterance.pitch = 1.05;
    utterance.lang = currentLangInfo.bcp47 || 'en-IN';

    // Find best matching voice for the regional dialect
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang === currentLangInfo.bcp47 || v.lang.startsWith(currentLangInfo.code)
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 200);
  };

  // Speech to Text (Voice Commands)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    // Standard or Webkit SpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage("Microphone input not supported in this browser.");
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLangInfo.bcp47 || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage("Listening... Speak now");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setStatusMessage(`Heard: "${transcript}"`);
        setTimeout(() => setStatusMessage(null), 3000);
        if (onSpeechResult) {
          onSpeechResult(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setStatusMessage("Could not hear clearly. Please try again.");
        setTimeout(() => setStatusMessage(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const localizedButtonLabel = buttonLabel === "Read Instructions" ? (t("game_listen") || buttonLabel) : buttonLabel;

  return (
    <div className="inline-flex flex-col gap-1 items-start">
      <div className="flex flex-wrap items-center gap-2">
        {textToRead && (
          <button
            type="button"
            onClick={speakText}
            className={`btn-secondary btn-md rounded-full ${
              isSpeaking
                ? "!bg-amber-100 !text-amber-800 !border-amber-300 ring-2 ring-amber-400"
                : ""
            } ${className}`}
            title="Listen to instruction in audio"
            aria-label="Read Instructions aloud"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-700" />
                <span>Stop Reading</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-teal-700" />
                <span>{localizedButtonLabel}</span>
              </>
            )}
          </button>
        )}

        {onSpeechResult && (
          <button
            type="button"
            onClick={toggleListening}
            className={`btn-secondary btn-md rounded-full ${
              isListening
                ? "!bg-rose-100 !text-rose-700 !border-rose-400 animate-pulse ring-2 ring-rose-400"
                : ""
            }`}
            title="Click and speak command"
            aria-label="Speak command"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 text-rose-700" />
                <span>Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-teal-700" />
                <span>Voice Command</span>
              </>
            )}
          </button>
        )}
      </div>

      {statusMessage && (
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 animate-fade-in">
          {statusMessage}
        </span>
      )}
    </div>
  );
}
