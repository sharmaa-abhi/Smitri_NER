"use client";

import React, { useState, useMemo, useEffect, useRef, useId } from "react";
import { Globe, Check, Volume2, X, Search, Sparkles, AlertCircle, Clock } from "lucide-react";
import { useLanguage, SupportedLanguage, LanguageCode, isLanguageSupported } from "@/lib/i18n";
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
    changeLanguage,
    currentLangInfo,
    activeLanguages,
    plannedLanguages,
    playVoicePrompt,
    t,
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [stagedLanguage, setStagedLanguage] = useState<LanguageCode>(language);
  const [isApplying, setIsApplying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalTitleId = useId();

  // Synchronize staged language when modal opens or active language changes
  useEffect(() => {
    if (isOpen) {
      setStagedLanguage(language);
      setNotification(null);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setNotification(null);
    }
  }, [isOpen, language]);

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

  // User taps an active language card: stage selection
  const handleSelectActiveLanguage = (code: LanguageCode) => {
    setStagedLanguage(code);
    setNotification(null);
  };

  // User taps audio preview icon: ONLY plays voice sample, NEVER changes language
  const handlePreviewVoice = (e: React.MouseEvent, lang: SupportedLanguage) => {
    e.stopPropagation();
    playVoicePrompt("welcome", lang.code);
    setNotification(
      lang.enabled
        ? `Playing ${lang.name} (${lang.nativeName}) audio greeting sample.`
        : `${lang.name} voice preview playing. Full UI text translation in review for ${lang.region}.`
    );
  };

  // User taps a planned / Coming Soon language card
  const handleSelectPlannedLanguage = (lang: SupportedLanguage) => {
    // Reassure user without changing language
    setNotification(
      `${lang.name} (${lang.nativeName}) dialect is currently in review with regional linguists for ${lang.region}. Please select an available language to proceed, or tap the speaker icon to hear the audio preview.`
    );
  };

  // Confirm and apply the staged language selection
  const canContinue = isLanguageSupported(stagedLanguage);

  const handleConfirmLanguage = async () => {
    if (!canContinue || isApplying) return;

    // If staged language is already the active language, just close modal
    if (stagedLanguage === language) {
      setIsOpen(false);
      return;
    }

    setIsApplying(true);
    try {
      const success = await changeLanguage(stagedLanguage);
      if (success) {
        setIsOpen(false);
        // Trigger gentle native greeting audio
        setTimeout(() => {
          playVoicePrompt("welcome", stagedLanguage);
        }, 150);
      } else {
        setNotification("Could not switch language. Please try again.");
      }
    } catch {
      setNotification("An error occurred while switching language.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      {/* Sleek, Accessible 1-Touch Language Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`btn-secondary rounded-full !bg-[#E6F4F1] hover:!bg-[#C2E5DF] !border-[#93CEC5] !text-[#0B534B] gap-2 ${
          buttonVariant === "sm" ? "btn-sm text-xs sm:text-sm" : "btn-md"
        } ${className}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={t("nav_select_language", "Change Language")}
        title={t("nav_select_language", "Change Language & Regional Dialect")}
      >
        <Globe className="w-4 h-4 text-[#0B534B] flex-shrink-0" />
        <span className="tracking-tight font-black text-[#0B534B]">
          {currentLangInfo.nativeName}
        </span>
      </button>

      {/* Senior-Friendly Multilingual Selection Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-[#042420]/70 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
        >
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-xl w-full shadow-2xl border border-[#D5DFDC] flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[#EBF0EE] gap-2 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#E6F4F1] border border-[#93CEC5] flex items-center justify-center text-[#0B534B] flex-shrink-0 shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id={modalTitleId}
                    className="text-base sm:text-lg font-black text-[#111615] tracking-tight leading-tight"
                  >
                    {t("select_language_title", "Select Language & Dialect")}
                  </h3>
                  <p className="text-xs text-[#5A6A66] font-semibold">
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
              <Search className="w-4 h-4 text-[#5A6A66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language / ভাষা বিচাৰক..."
                className="w-full pl-9 pr-9 py-2.5 rounded-full border border-[#D5DFDC] bg-[#F6F8F7] text-sm font-semibold text-[#111615] placeholder:text-[#5A6A66] focus:outline-none focus:ring-2 focus:ring-[#0B534B] focus:bg-white transition-all min-h-[44px]"
                aria-label="Search languages"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6A66] hover:text-[#111615] p-1 rounded-full"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Notification alert banner if user tapped preview or info */}
            {notification && (
              <div className="mb-3 p-3 rounded-2xl bg-[#E6F4F1] border border-[#93CEC5] text-[#0B534B] text-xs font-semibold flex items-center gap-2 flex-shrink-0 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-[#0B534B] flex-shrink-0" />
                <span className="flex-1">{notification}</span>
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  className="text-[#0B534B] hover:text-[#042420] p-0.5"
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
                  <span className="text-xs font-black tracking-wider text-[#111615] uppercase">
                    Available Languages • পূৰ্ণ সমৰ্থন ({filteredActive.length})
                  </span>
                  <span className="text-[11px] font-bold text-[#0B534B] bg-[#E6F4F1] px-2 py-0.5 rounded-full border border-[#93CEC5]">
                    100% Translated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredActive.map((lang) => {
                    const isSelected = lang.code === stagedLanguage;
                    const isCurrent = lang.code === language;
                    return (
                      <div
                        key={lang.code}
                        role="button"
                        tabIndex={0}
                        aria-selected={isSelected}
                        onClick={() => handleSelectActiveLanguage(lang.code)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectActiveLanguage(lang.code);
                          }
                        }}
                        className={`cursor-pointer text-left rounded-2xl p-3 border transition-all flex items-center justify-between gap-2.5 min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B534B] ${
                          isSelected
                            ? "border-[#0B534B] bg-[#E6F4F1] shadow-sm ring-2 ring-[#0B534B]/80"
                            : "border-[#D5DFDC] hover:border-[#0B534B] bg-white hover:bg-[#F6F8F7]"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base sm:text-[17px] font-black text-[#111615] tracking-tight leading-tight">
                              {lang.nativeName}
                            </span>
                            <span className="text-xs font-semibold text-[#5A6A66]">
                              ({lang.name})
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-[#0B534B] font-bold truncate">
                              📍 {lang.region}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold text-[#0B534B] bg-[#C2E5DF] px-1.5 py-0.5 rounded-md">
                                Current
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={(e) => handlePreviewVoice(e, lang)}
                            title={`Listen voice sample in ${lang.name}`}
                            className="btn-icon !min-h-[38px] !min-w-[38px] !p-2 hover:!bg-[#E6F4F1] hover:!text-[#0B534B]"
                            aria-label={`Listen voice sample in ${lang.name}`}
                          >
                            <Volume2 className="w-4 h-4 text-[#5A6A66]" />
                          </button>

                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-[#0B534B] text-white flex items-center justify-center font-bold shadow-sm">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: Planned North East Dialects (In Review / Coming Soon) */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1 pt-1 border-t border-[#EBF0EE]">
                  <span className="text-xs font-black tracking-wider text-[#111615] uppercase flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                    North East Regional Dialects • প্ৰস্তুতি চলি আছে ({filteredPlanned.length})
                  </span>
                  <span className="text-[11px] font-bold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                    Audio Preview
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredPlanned.map((lang) => {
                    return (
                      <div
                        key={lang.code}
                        role="button"
                        tabIndex={0}
                        aria-disabled="true"
                        onClick={() => handleSelectPlannedLanguage(lang)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectPlannedLanguage(lang);
                          }
                        }}
                        className="cursor-pointer text-left rounded-2xl p-3 border border-[#D5DFDC] bg-[#F6F8F7] hover:bg-[#EBF0EE] transition-all flex items-center justify-between gap-2.5 min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] opacity-90"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base sm:text-[17px] font-black text-[#111615] tracking-tight leading-tight">
                              {lang.nativeName}
                            </span>
                            <span className="text-xs font-semibold text-[#5A6A66]">
                              ({lang.name})
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-[#5A6A66] font-semibold truncate">
                              📍 {lang.region}
                            </span>
                            <span className="text-[9px] font-black text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A] px-1.5 py-0.5 rounded-md">
                              Coming Soon
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handlePreviewVoice(e, lang)}
                          title={`Listen to ${lang.name} greeting audio`}
                          className="btn-icon !min-h-[38px] !min-w-[38px] !p-2 hover:!bg-[#FEF3C7] text-[#D97706] flex-shrink-0"
                          aria-label={`Listen to ${lang.name} voice greeting`}
                        >
                          <Volume2 className="w-4 h-4 text-[#D97706]" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reassurance Footer Banner */}
            <div className="mt-3 p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#78350F] text-xs font-semibold flex items-center gap-2.5 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#D97706] flex-shrink-0" />
              <span>
                Voice prompts, memory exercises, and caregiver alerts adapt smoothly to your chosen language.
              </span>
            </div>

            {/* Close / Continue Button */}
            <Button
              onClick={handleConfirmLanguage}
              disabled={!canContinue || isApplying}
              variant="primary"
              size="md"
              className="w-full mt-3 !min-h-[48px] text-sm sm:text-base font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                  {t("common_loading", "Applying...")}
                </span>
              ) : (
                t("common_continue", "Continue / আগবাঢ়ক")
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
