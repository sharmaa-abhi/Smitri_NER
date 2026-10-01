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
    // 1-Touch instant loving regional voice greeting
    setTimeout(() => {
      playVoicePrompt("welcome");
    }, 200);
  };

  const handlePreviewVoice = (e: React.MouseEvent, code: SupportedLanguage) => {
    e.stopPropagation();
    setLanguage(code);
    playVoicePrompt("welcome");
  };

  return (
    <>
      {/* 1-Touch High-Contrast Senior Navbar Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black text-slate-900 bg-amber-300 hover:bg-amber-400 border-2 border-amber-500 shadow-sm transition-all hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-amber-200"
        aria-label="Change Language / ভাষা সলনি কৰক / भाषा बदलें"
      >
        <Globe className="w-4 h-4 text-slate-900 flex-shrink-0" />
        <span className="tracking-tight text-slate-950 font-black">
          {currentLangInfo.nativeName}
        </span>
        <span className="hidden sm:inline text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-400/80 text-slate-900 border border-amber-600/30">
          NER Voice
        </span>
      </button>

      {/* High-Contrast Accessible Language Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-modal-title"
        >
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-xl w-full shadow-2xl border-4 border-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-4 border-b-2 border-slate-200 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow-sm flex-shrink-0">
                  <Globe className="w-7 h-7" />
                </div>
                <div>
                  <h3 id="lang-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    বাছনি কৰক / Choose Language
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-bold mt-0.5">
                    1-Touch Native Voice & Dialect / আপোনাৰ ভাষা স্পৰ্শ কৰক
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300 font-bold transition-colors"
                aria-label="Close / বন্ধ কৰক"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Language Grid with High Contrast & Senior Large Typography */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <div
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`cursor-pointer rounded-2xl p-4 border-3 transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-teal-700 bg-teal-50 shadow-md ring-2 ring-teal-500 scale-[1.01]"
                        : "border-slate-300 hover:border-slate-900 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      {/* Native Script - Large for senior eyes */}
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                        {lang.nativeName}
                      </div>
                      <div className="text-xs font-bold text-slate-500 mt-0.5">
                        {lang.name} • <span className="text-teal-800">{lang.region}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 mt-1 truncate italic">
                        &quot;{lang.greetingVoice}&quot;
                      </div>
                    </div>

                    {/* Action & Voice Preview Icon */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handlePreviewVoice(e, lang.code)}
                        title="Listen to Native Voice / মাত শুনক"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-amber-300 hover:text-slate-900 border border-slate-300 text-slate-700 transition-colors"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      {isSelected && (
                        <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reassurance Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-900 text-xs sm:text-sm font-bold flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <span>
                All games, spoken instructions, and medication reminders will automatically talk in your chosen language.
              </span>
            </div>

            {/* Bottom 1-Touch Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base text-center transition-colors shadow-md"
            >
              Continue / আগবাঢ়ক
            </button>
          </div>
        </div>
      )}
    </>
  );
}
