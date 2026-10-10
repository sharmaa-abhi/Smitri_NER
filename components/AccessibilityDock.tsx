"use client";

import React, { useState, useEffect } from "react";
import { 
  Eye, 
  Volume2, 
  PhoneCall, 
  X, 
  Sparkles,
  HeartHandshake,
  MessageCircle,
  RotateCcw
} from "lucide-react";
import { playChime, stopVoicePrompt } from "@/lib/audioPrompts";
import { useLanguage } from "@/lib/i18n";

export default function AccessibilityDock() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<"normal" | "large" | "xlarge">("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Restore saved preferences on mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedZoom = localStorage.getItem("smitri_font_scale") as "normal" | "large" | "xlarge" | null;
      if (savedZoom) setFontSizeLevel(savedZoom);
      const savedContrast = localStorage.getItem("smitri_high_contrast");
      if (savedContrast === "true") setHighContrast(true);
    } catch {}
  }, []);

  // Dynamically apply classes to <html>
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("text-scale-large", "text-scale-xlarge", "high-contrast-mode");

    if (fontSizeLevel === "large") {
      root.classList.add("text-scale-large");
    } else if (fontSizeLevel === "xlarge") {
      root.classList.add("text-scale-xlarge");
    }

    if (highContrast) {
      root.classList.add("high-contrast-mode");
    }

    try {
      localStorage.setItem("smitri_font_scale", fontSizeLevel);
      localStorage.setItem("smitri_high_contrast", highContrast ? "true" : "false");
    } catch {}
  }, [fontSizeLevel, highContrast, mounted]);

  const handleSetFont = (level: "normal" | "large" | "xlarge") => {
    playChime("start");
    setFontSizeLevel(level);
  };

  const handleToggleContrast = () => {
    playChime("start");
    setHighContrast((prev) => !prev);
  };

  const handleVoiceAssistance = () => {
    playChime("start");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      stopVoicePrompt();
      const messages: Record<string, string> = {
        hi: "नमस्ते! स्मृती में आपका स्वागत है। यहाँ आपके लिए याददाश्त खेल, दवाई रिमाइंडर और परिवार की सुरक्षा उपलब्ध है।",
        as: "নমস্কাৰ! স্মৃতিত আপোনাক স্বাগতম। ইয়াত স্মৃতিৰ খেল, ঔষধৰ সোঁৱৰণী আৰু পৰিয়ালৰ সুৰক্ষা আছে।",
        bn: "নমস্কার! স্মৃতিতে আপনাকে স্বাগতম। এখানে স্মৃতিশক্তির খেলা, ওষুধের অনুস্মারক এবং পরিবারের নিরাপত্তা রয়েছে।",
        en: "Welcome to Smitri. We are here to support your memory, daily medicine routines, and family safety.",
      };
      const textToSpeak = messages[language] || messages.hi || messages.en;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.82; // Slower rate for seniors
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!mounted) return null;

  return (
    <aside 
      aria-label="Senior Accessibility and Quick SOS Tools"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto print:hidden"
    >
      {/* Expanded Accessibility Menu */}
      {isOpen && (
        <div 
          role="dialog"
          aria-modal="false"
          aria-label="Senior Visual and Audio Accessibility Settings"
          className="bg-white/95 backdrop-blur-2xl border-2 border-[#0B534B]/30 rounded-3xl p-5 shadow-[0_16px_50px_rgba(11,83,75,0.25)] w-[310px] sm:w-[340px] space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#D5DFDC]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B534B] to-[#10B981] flex items-center justify-center text-white shadow-xs">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#111615] leading-tight">
                  {t("Senior Assist") || "Senior Assist"}
                </h3>
                <p className="text-xs text-[#5A6A66]">
                  {t("Readability & Safety") || "Easy Reading & Safety"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-[#F6F8F7] flex items-center justify-center text-[#5A6A66] hover:text-[#111615] transition-colors cursor-pointer"
              aria-label="Close Assist menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Font Size Scaler */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                {t("Text Size") || "Text Size (Akshar Bada)"}
              </span>
              {fontSizeLevel !== "normal" && (
                <button
                  type="button"
                  onClick={() => handleSetFont("normal")}
                  className="text-xs text-[#0B534B] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSetFont("normal")}
                className={`py-2 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  fontSizeLevel === "normal"
                    ? "bg-[#0B534B] text-white border-[#0B534B] shadow-xs scale-102"
                    : "bg-[#F6F8F7] text-[#111615] border-[#D5DFDC] hover:bg-[#EBF0EE]"
                }`}
              >
                A (100%)
              </button>
              <button
                type="button"
                onClick={() => handleSetFont("large")}
                className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                  fontSizeLevel === "large"
                    ? "bg-[#0B534B] text-white border-[#0B534B] shadow-xs scale-102"
                    : "bg-[#F6F8F7] text-[#111615] border-[#D5DFDC] hover:bg-[#EBF0EE]"
                }`}
              >
                A+ (115%)
              </button>
              <button
                type="button"
                onClick={() => handleSetFont("xlarge")}
                className={`py-2 px-2 rounded-xl text-sm sm:text-base font-black border transition-all cursor-pointer ${
                  fontSizeLevel === "xlarge"
                    ? "bg-[#0B534B] text-white border-[#0B534B] shadow-xs scale-102"
                    : "bg-[#F6F8F7] text-[#111615] border-[#D5DFDC] hover:bg-[#EBF0EE]"
                }`}
              >
                A++ (130%)
              </button>
            </div>
          </div>

          {/* 2. High Contrast View Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F6F8F7] border border-[#D5DFDC]">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[#0B534B]" />
              <div>
                <span className="text-xs font-bold text-[#111615] block">
                  {t("High Contrast View") || "High Contrast View"}
                </span>
                <span className="text-xs text-[#7A8D88] block">
                  {t("Darker text & distinct borders") || "Darker text & borders"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleContrast}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                highContrast ? "bg-[#0B534B]" : "bg-gray-300"
              }`}
              aria-label="Toggle High Contrast View"
              aria-pressed={highContrast}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  highContrast ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 3. Audio Voice Readout Assistant */}
          <button
            type="button"
            onClick={handleVoiceAssistance}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#E6F4F1] hover:bg-[#D4EFEA] text-[#0B534B] border border-[#93CEC5] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#0B534B]" />
            <span>{t("Listen to Audio Guide") || "Voice Assistant Sunayein"}</span>
          </button>

          {/* 4. Emergency Caregiver 1-Tap Dial & WhatsApp */}
          <div className="pt-2 border-t border-[#D5DFDC] space-y-2">
            <a
              href="tel:9876543210"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>1-Tap Call Son (Rahul) • Emergency</span>
            </a>

            <a
              href="https://wa.me/919876543210?text=Hello%20Rahul,%20Kamla%20Devi%20needs%20assistance%20via%20Smitri."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp Family Alert</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Trigger Pill Button */}
      <button
        type="button"
        onClick={() => {
          playChime("start");
          setIsOpen((prev) => !prev);
        }}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0B534B] via-[#0E685E] to-[#10B981] text-white shadow-[0_8px_28px_rgba(11,83,75,0.38)] hover:shadow-[0_10px_36px_rgba(11,83,75,0.48)] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/70 cursor-pointer"
        aria-label="Open Senior Accessibility and Emergency Dial"
        aria-expanded={isOpen}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#A7F3D0] animate-ping" />
        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        <span className="text-xs font-black tracking-wide hidden sm:inline">
          {t("Senior Assist & SOS") || "Senior Assist & SOS"}
        </span>
      </button>
    </aside>
  );
}
