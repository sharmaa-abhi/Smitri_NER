"use client";

import { useState } from "react";
import { Globe, Check, Volume2, X } from "lucide-react";
import { LANGUAGES, useLanguage, SupportedLanguage } from "@/lib/i18n";

export default function LanguageSelector() {
  const { language, setLanguage, currentLangInfo, speak } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
    // Greet user in new language
    setTimeout(() => {
      speak("welcome_greeting");
    }, 150);
  };

  return (
    <>
      {/* Navbar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
        aria-label="Select Language / भाषा चुनें"
      >
        <Globe className="w-3.5 h-3.5 text-teal-600" />
        <span className="font-medium text-slate-900">{currentLangInfo.nativeName}</span>
      </button>

      {/* Language Selection Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-modal-title"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="lang-modal-title" className="text-lg font-black text-slate-900">
                    Choose Language / ভাষা নিৰ্বাচন
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select your preferred regional dialect / আপোনাৰ ভাষা বাছনি কৰক
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-teal-600 bg-teal-50/60 text-teal-900 font-bold shadow-sm"
                        : "border-slate-200 hover:border-teal-300 hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div>
                      <div className="text-base font-black tracking-tight">{lang.nativeName}</div>
                      <div className="text-xs text-slate-500">{lang.name} • {lang.region}</div>
                    </div>
                    {isSelected ? (
                      <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-slate-400 opacity-60 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Audio reassurance note */}
            <div className="text-xs text-slate-500 text-center bg-slate-50 rounded-xl p-3">
              🗣️ Audio instructions and text will automatically adapt to your selected language.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
