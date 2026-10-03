"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Globe, Check, Volume2, X, Search, Sparkles, AlertCircle, Clock } from "lucide-react";
import { useLanguage, SupportedLanguage, LanguageCode } from "@/lib/i18n";
import Button from "@/components/Button";

interface LanguageSwitcherProps {
  className?: string;
  buttonVariant?: "sm" | "md";
}

export default function LanguageSwitcher({
  className = "",
  buttonVariant = "sm",
}: LanguageSwitcherProps) {
  const {
    language,
    setLanguage,
    currentLangInfo,
    activeLanguages,
    plannedLanguages,
    playVoicePrompt,
    t,
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setNotification(null);
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Filter languages based on search query (matches name, native name, or region)
  const filterList = (list: SupportedLanguage[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.region.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  };

  const filteredActive = useMemo(() => filterList(activeLanguages), [activeLanguages, searchQuery]);
  const filteredPlanned = useMemo(() => filterList(plannedLanguages), [plannedLanguages, searchQuery]);

  const handleSelectActiveLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    // Trigger gentle native greeting audio
    setTimeout(() => {
      playVoicePrompt("welcome");
    }, 150);
  };

  const handlePreviewVoice = (e: React.MouseEvent, lang: SupportedLanguage) => {
    e.stopPropagation();
    if (lang.enabled) {
      setLanguage(lang.code);
    }
    playVoicePrompt("welcome");
    setNotification(
      lang.enabled
        ? `Switched to ${lang.name} (${lang.nativeName})`
        : `${lang.name} voice preview playing. Full UI text translation in review for ${lang.region}.`
    );
  };

  const handleSelectPlannedLanguage = (lang: SupportedLanguage) => {
    // Play mother tongue greeting audio preview
    playVoicePrompt("welcome");
    setNotification(
      `Audio preview playing for ${lang.name} (${lang.nativeName}). Full translation set is currently in review with regional linguists from ${lang.region}.`
    );
  };

  return (
    <>
      {/* Sleek, Accessible 1-Touch Language Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`btn-secondary rounded-full !bg-amber-100/90 hover:!bg-amber-200/90 !border-amber-300 !text-amber-950 gap-2 ${
          buttonVariant === "sm" ? "btn-sm text-xs sm:text-sm" : "btn-md"
        } ${className}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={t("nav_select_language", "Change Language")}
        title={t("nav_select_language", "Change Language & Regional Dialect")}
      >
        <Globe className="w-4 h-4 text-amber-800 flex-shrink-0" />
        <span className="tracking-tight font-black text-slate-900">
          {currentLangInfo.nativeName}
        </span>
      </button>

      {/* Senior-Friendly Multilingual Selection Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-modal-title"
        >
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100 gap-2 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 flex-shrink-0 shadow-2xs">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="lang-modal-title"
                    className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight"
                  >
                    {t("select_language_title", "Select Language & Dialect")}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {t("select_language_subtitle", "Covering all 8 North Eastern States, Hindi & English")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-icon !min-h-[38px] !min-w-[38px] !p-2"
                aria-label="Close language selector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Senior Search Bar */}
            <div className="relative mb-3 flex-shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language / ভাষা বিচাৰক..."
                className="w-full pl-9 pr-9 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all min-h-[44px]"
                aria-label="Search languages"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Notification alert banner if user tapped preview or info */}
            {notification && (
              <div className="mb-3 p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center gap-2 flex-shrink-0 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-teal-700 flex-shrink-0" />
                <span className="flex-1">{notification}</span>
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  className="text-teal-700 hover:text-teal-900 p-0.5"
                  aria-label="Dismiss message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Scrollable Language Container */}
            <div className="overflow-y-auto pr-1 space-y-4 flex-1 min-h-0">
              {/* Group 1: Available & Fully Supported Languages */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-black tracking-wider text-slate-700 uppercase">
                    Available Languages • পূৰ্ণ সমৰ্থন ({filteredActive.length})
                  </span>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    100% Translated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredActive.map((lang) => {
                    const isSelected = lang.code === language;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectActiveLanguage(lang.code)}
                        className={`text-left rounded-2xl p-3 border transition-all flex items-center justify-between gap-2.5 min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                          isSelected
                            ? "border-teal-600 bg-teal-50/90 shadow-sm ring-2 ring-teal-500/80"
                            : "border-slate-200 hover:border-teal-400 bg-white hover:bg-slate-50/90"
                        }`}
                        aria-selected={isSelected}
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
                            onClick={(e) => handlePreviewVoice(e, lang)}
                            title={`Listen voice sample in ${lang.name}`}
                            className="btn-icon !min-h-[38px] !min-w-[38px] !p-2 hover:!bg-amber-100"
                            aria-label={`Listen voice sample in ${lang.name}`}
                          >
                            <Volume2 className="w-4 h-4 text-slate-700" />
                          </button>

                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold shadow-2xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: Planned North East Dialects (In Review / Coming Soon) */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1 pt-1 border-t border-slate-100">
                  <span className="text-xs font-black tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    North East Regional Dialects • প্ৰস্তুতি চলি আছে ({filteredPlanned.length})
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Audio Preview
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredPlanned.map((lang) => {
                    return (
                      <div
                        key={lang.code}
                        onClick={() => handleSelectPlannedLanguage(lang)}
                        className="cursor-pointer text-left rounded-2xl p-3 border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition-all flex items-center justify-between gap-2.5 min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleSelectPlannedLanguage(lang);
                          }
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base sm:text-[17px] font-black text-slate-800 tracking-tight leading-tight">
                              {lang.nativeName}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              ({lang.name})
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-slate-600 font-semibold truncate">
                              📍 {lang.region}
                            </span>
                            <span className="text-[9px] font-black text-amber-700 bg-amber-100/90 px-1.5 py-0.2 rounded-md">
                              Coming Soon
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handlePreviewVoice(e, lang)}
                          title={`Listen to ${lang.name} greeting audio`}
                          className="btn-icon !min-h-[38px] !min-w-[38px] !p-2 hover:!bg-amber-200/80 flex-shrink-0"
                          aria-label={`Listen to ${lang.name} voice greeting`}
                        >
                          <Volume2 className="w-4 h-4 text-amber-900" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reassurance Footer Banner */}
            <div className="mt-3 p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-slate-800 text-xs font-semibold flex items-center gap-2.5 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Voice prompts, memory exercises, and caregiver alerts adapt smoothly to your chosen language.
              </span>
            </div>

            {/* Close / Continue Button */}
            <Button
              onClick={() => setIsOpen(false)}
              variant="primary"
              size="md"
              className="w-full mt-3"
            >
              Continue / আগবাঢ়ক
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
