"use client";

import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

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
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.85; // Slightly slower, clear speech for seniors
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
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
      recognition.lang = 'en-US';

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

  return (
    <div className="inline-flex flex-col gap-1 items-start">
      <div className="flex flex-wrap items-center gap-2">
        {textToRead && (
          <button
            type="button"
            onClick={speakText}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-base transition-all border-2 ${
              isSpeaking
                ? "bg-amber-100 text-amber-700 border-amber-400"
                : "bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-300"
            } ${className}`}
            title="Listen to instruction in audio"
            aria-label="Read Instructions aloud"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-5 h-5 text-amber-700" />
                <span>Stop Reading</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-teal-700" />
                <span>{buttonLabel}</span>
              </>
            )}
          </button>
        )}

        {onSpeechResult && (
          <button
            type="button"
            onClick={toggleListening}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-base transition-all border-2 ${
              isListening
                ? "bg-rose-100 text-rose-700 border-rose-400 animate-pulse"
                : "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-300"
            }`}
            title="Click and speak command"
            aria-label="Speak command"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 text-rose-700" />
                <span>Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-sky-700" />
                <span>Voice Command</span>
              </>
            )}
          </button>
        )}
      </div>

      {statusMessage && (
        <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 animate-fade-in">
          {statusMessage}
        </span>
      )}
    </div>
  );
}
