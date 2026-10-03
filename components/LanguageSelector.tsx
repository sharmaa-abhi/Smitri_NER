"use client";

import { useState } from "react";
import { Globe, Check, Volume2, X, Sparkles } from "lucide-react";
import { LANGUAGES, useLanguage, SupportedLanguage } from "@/lib/i18n";

export default function LanguageSelector() {
  const { language, setLanguage, currentLangInfo, playVoicePrompt, t } = useLanguage();
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
      {/* Sleek, Accessible 1-Touch Language Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-amber-950 bg-amber-100 hover:bg-amber-200/90 border border-amber-300 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
        aria-label={t("nav_select_language") || "Change Language"}
        title={t("nav_select_language") || "Change Language & Regional Dialect"}
      >
        <Globe className="w-4 h-4 text-amber-700 flex-shrink-0" />
        <span className="tracking-tight font-black text-slate-900">
          {currentLangInfo.nativeName}
        </span>
      </button>

      {/* Accessible, Senior-Friendly Language Modal with All North East States */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-modal-title"
        >
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200 gap-2 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 flex-shrink-0 shadow-2xs">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="lang-modal-title" className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                    {t("select_language_title") || "Select Language & Dialect"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {t("select_language_subtitle") || "Covering all 8 North Eastern States & Regional Dialects"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Grid - Senior Legible, 2-Columns */}
            <div className="overflow-y-auto pr-1 py-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 min-h-0">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <div
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`cursor-pointer rounded-2xl p-3 border transition-all flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? "border-teal-600 bg-teal-50/90 shadow-xs ring-2 ring-teal-500/80"
                        : "border-slate-200 hover:border-teal-400 bg-white hover:bg-slate-50/90"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-[17px] font-black text-slate-900 tracking-tight leading-tight">
                          {lang.nativeName}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          ({lang.name})
                        </span>
                      </div>
                      <div className="text-[11px] text-teal-800 font-bold mt-0.5 truncate">
                        📍 {lang.region}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handlePreviewVoice(e, lang.code)}
                        title="Listen to Voice / মাত শুনক"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-amber-200 text-slate-700 hover:text-amber-950 transition-colors"
                        aria-label={`Listen voice in ${lang.name}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reassurance note */}
            <div className="mt-3 p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-slate-800 text-xs font-semibold flex items-center gap-2.5 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Voice prompts, caregiver alerts, and memory exercises automatically adapt to your chosen North East dialect.</span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm text-center transition-colors shadow-sm"
            >
              Continue / আগবাঢ়ক
            </button>
          </div>
        </div>
      )}
    </>
  );
}
