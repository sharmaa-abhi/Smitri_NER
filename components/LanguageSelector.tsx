"use client";

import { useState } from "react";
import { Globe, Check, Volume2, X, Sparkles } from "lucide-react";
import { LANGUAGES, useLanguage, SupportedLanguage } from "@/lib/i18n";

export default function LanguageSelector() {
  const { language, setLanguage, currentLangInfo, playVoicePrompt } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
    // Instant gentle regional voice greeting
    setTimeout(() => {
      playVoicePrompt("welcome");
    }, 180);
  };

  const handlePreviewVoice = (e: React.MouseEvent, code: SupportedLanguage) => {
    e.stopPropagation();
    setLanguage(code);
    playVoicePrompt("welcome");
  };

  return (
    <>
      {/* Sleek, Compact 1-Touch Language Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300/90 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
        aria-label="Change Language / ভাষা সলনি কৰক / भाषा बदलें"
        title="Change Language & Voice Dialect"
      >
        <Globe className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
        <span className="tracking-tight font-black text-slate-900">
          {currentLangInfo.nativeName}
        </span>
      </button>

      {/* Accessible, Well-proportioned Language Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-modal-title"
        >
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-2xl border-2 border-slate-300 max-h-[88vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 flex-shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="lang-modal-title" className="text-base font-black text-slate-900 tracking-tight leading-tight">
                    বাছনি কৰক / Choose Language
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Native Voice & Dialect / আপোনাৰ ভাষা স্পৰ্শ কৰক
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Grid - Compact & Senior Legible */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <div
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`cursor-pointer rounded-xl p-2.5 sm:p-3 border transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? "border-teal-600 bg-teal-50/90 shadow-xs ring-1 ring-teal-500"
                        : "border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                        {lang.nativeName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {lang.name} • <span className="text-teal-700 font-bold">{lang.region}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handlePreviewVoice(e, lang.code)}
                        title="Listen / শুনক"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-200 text-slate-700 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reassurance note */}
            <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-slate-800 text-[11px] font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Voice instructions adapt automatically to your chosen regional language.</span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm text-center transition-colors"
            >
              Continue / আগবাঢ়ক
            </button>
          </div>
        </div>
      )}
    </>
  );
}
