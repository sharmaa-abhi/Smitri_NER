"use client";

import React, { useState, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import {
  Globe,
  Check,
  Volume2,
  X,
  Play,
  MapPin,
  Leaf,
  ArrowRight,
  ChevronDown,
  Navigation,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import {
  REGIONAL_PROFILES,
  QUICK_STATES,
  DEFAULT_ENGLISH_DIALECT,
  DialectOption,
  RegionProfile,
} from "@/lib/i18n/regionalDialects";
import { playWebSpeechDialect, playChime } from "@/lib/audioPrompts";

interface LanguageSwitcherProps {
  className?: string;
  buttonVariant?: "sm" | "md" | "translucent";
}

export default function LanguageSwitcher({
  className = "",
  buttonVariant = "sm",
}: LanguageSwitcherProps) {
  const { language, changeLanguage, currentLangInfo, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeRegionId, setActiveRegionId] = useState<string>("national_english");
  const [activeStateId, setActiveStateId] = useState<string>("english");
  const [stagedDialect, setStagedDialect] = useState<DialectOption>(DEFAULT_ENGLISH_DIALECT);
  const [playingDialectId, setPlayingDialectId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const modalTitleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find active region profile
  const currentRegion: RegionProfile =
    REGIONAL_PROFILES.find((r) => r.id === activeRegionId) || REGIONAL_PROFILES[0];

  // Initialize staged dialect when modal opens
  useEffect(() => {
    if (isOpen) {
      if (language === "en") {
        setActiveRegionId("national_english");
        setActiveStateId("english");
        setStagedDialect(DEFAULT_ENGLISH_DIALECT);
      } else if (
        language === "bn" ||
        language === "as" ||
        language === "brx" ||
        language === "trp"
      ) {
        setActiveRegionId("assam_tripura");
        setActiveStateId("assam");
        const found =
          REGIONAL_PROFILES[0].dialects.find((d) => d.langCode === language) ||
          REGIONAL_PROFILES[0].dialects[0];
        setStagedDialect(found);
      } else {
        let foundDialect: DialectOption | undefined;
        let foundProfile: RegionProfile | undefined;

        for (const profile of REGIONAL_PROFILES) {
          const match = profile.dialects.find((d) => d.langCode === language);
          if (match) {
            foundDialect = match;
            foundProfile = profile;
            break;
          }
        }

        if (foundDialect && foundProfile) {
          setActiveRegionId(foundProfile.id);
          setActiveStateId(foundProfile.stateIds[0] || "assam");
          setStagedDialect(foundDialect);
        } else {
          setActiveRegionId("national_english");
          setActiveStateId("english");
          setStagedDialect(DEFAULT_ENGLISH_DIALECT);
        }
      }
    }
  }, [isOpen, language]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Quick switch directly to English default
  const handleSelectDefaultEnglish = () => {
    setActiveStateId("english");
    setActiveRegionId("national_english");
    setStagedDialect(DEFAULT_ENGLISH_DIALECT);
    playChime("start");
  };

  // Select state from quick button or map
  const handleSelectState = (stateId: string) => {
    setActiveStateId(stateId);
    playChime("start");

    const quick = QUICK_STATES.find((s) => s.id === stateId);
    if (quick) {
      setActiveRegionId(quick.regionId);
      const profile = REGIONAL_PROFILES.find((r) => r.id === quick.regionId);
      if (profile && profile.dialects.length > 0) {
        setStagedDialect(profile.dialects[0]);
      }
    } else {
      const profile = REGIONAL_PROFILES.find((r) => r.stateIds.includes(stateId));
      if (profile) {
        setActiveRegionId(profile.id);
        if (profile.dialects.length > 0) {
          setStagedDialect(profile.dialects[0]);
        }
      }
    }
  };

  // Preview voice greeting
  const handlePlayVoicePreview = (e: React.MouseEvent, dialect: DialectOption) => {
    e.stopPropagation();
    setPlayingDialectId(dialect.id);
    playChime("start");
    playWebSpeechDialect(dialect.voicePrompt, dialect.bcp47);

    setTimeout(() => {
      setPlayingDialectId(null);
    }, 2400);
  };

  // Confirm dialect selection
  const handleConfirmDialect = async () => {
    if (isApplying) return;
    setIsApplying(true);
    playChime("success");

    try {
      await changeLanguage(stagedDialect.langCode);
      setIsOpen(false);
      setTimeout(() => {
        playWebSpeechDialect(stagedDialect.voicePrompt, stagedDialect.bcp47);
      }, 250);
    } catch (err) {
      console.error("Error setting regional dialect:", err);
    } finally {
      setIsApplying(false);
    }
  };

  // State active check: both Assam and Tripura highlighted if assam_tripura is active
  const isStateActive = (stateId: string) => {
    if (activeRegionId === "assam_tripura") {
      return stateId === "assam" || stateId === "tripura";
    }
    return activeStateId === stateId || currentRegion.stateIds.includes(stateId);
  };

  // Dialects to display (limiting to 3 if in assam_tripura to match reference design)
  const visibleDialects =
    activeRegionId === "assam_tripura"
      ? currentRegion.dialects.slice(0, 3)
      : currentRegion.dialects;

  // Modal Dialog JSX rendered via Portal to document.body
  const modalDialog = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-[#042420]/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div
        className="relative bg-white rounded-[24px] sm:rounded-[28px] max-w-4xl w-full shadow-[0_25px_60px_rgba(4,36,32,0.4)] border border-[#93CEC5]/40 flex flex-col overflow-hidden my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="bg-[#0B3B36] px-5 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between text-white flex-shrink-0 border-b border-[#0E4B43]">
          <div className="flex items-center gap-3">
            {/* Navigation Icon Squircle */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#084D44] border border-[#166B5F] flex items-center justify-center text-[#5EEAD4] flex-shrink-0 shadow-xs">
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5 fill-[#5EEAD4]/20 stroke-[2.5]" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#A7F3D0] uppercase">
                  REGIONAL DIALECT NAVIGATOR
                </span>
                <span className="bg-[#F59E0B] text-[#111615] font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-2xs">
                  8 States • North East India
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5 flex-wrap">
                <h3
                  id={modalTitleId}
                  className="text-base sm:text-lg font-black text-white tracking-tight leading-tight"
                >
                  Choose Your Region &amp; Dialect
                </h3>
                <span className="text-xs sm:text-sm font-semibold text-[#93CEC5]">
                  / আপনার ভাষা আৰু অঞ্চল বাছনি কৰক
                </span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/90 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Two-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-[#D5DFDC]">
          
          {/* LEFT COLUMN: Interactive Map & Quick State Switch */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-[#EDF3F1] flex flex-col justify-between space-y-3">
            <div>
              {/* Left Column Header with English Default Action */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-black tracking-wider text-[#4E615D] uppercase">
                  INTERACTIVE MAP
                </span>
                <span className="bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  Click State or Pin
                </span>
              </div>
              <p className="text-xs text-[#5A6A66] font-medium leading-relaxed">
                Select an elder&apos;s native home state to automatically adapt audio accent and spoken memory prompts.
              </p>

              {/* Stylized Interactive Map of Northeast India */}
              <div className="relative aspect-[16/11] w-full max-w-[310px] mx-auto my-2.5 bg-[#E2ECE9]/70 rounded-2xl p-2 border border-[#C6DDD7]">
                <svg
                  viewBox="0 0 340 250"
                  className="w-full h-full select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="mapShadow" x="-5%" y="-5%" width="110%" height="110%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#042420" floodOpacity="0.1" />
                    </filter>
                  </defs>

                  {/* 1. SIKKIM (Top-West detached) */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleSelectState("sikkim")}
                  >
                    <path
                      d="M 22,82 L 44,78 L 48,110 L 22,106 Z"
                      fill={isStateActive("sikkim") ? "#0B534B" : "#C2E5DF"}
                      stroke={isStateActive("sikkim") ? "#042420" : "#8CC7BD"}
                      strokeWidth="1.5"
                      filter="url(#mapShadow)"
                      className="hover:fill-[#94DDD2] transition-colors"
                    />
                    <text
                      x="33"
                      y="97"
                      fill={isStateActive("sikkim") ? "#FFFFFF" : "#1B4D45"}
                      fontSize="8.5"
                      fontWeight="700"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      Sikkim
                    </text>
                  </g>

                  {/* 2. ARUNACHAL PRADESH (Top northern curving crest) */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleSelectState("arunachal")}
                  >
                    <path
                      d="M 88,96 C 110,68 155,56 205,58 C 245,60 280,72 298,92 C 288,116 260,118 245,112 C 220,105 180,95 140,100 C 115,103 98,102 88,96 Z"
                      fill={isStateActive("arunachal") ? "#0B534B" : "#C2E5DF"}
                      stroke={isStateActive("arunachal") ? "#042420" : "#8CC7BD"}
                      strokeWidth="1.5"
                      filter="url(#mapShadow)"
                      className="hover:fill-[#94DDD2] transition-colors"
                    />
                    <text
                      x="195"
                      y="85"
                      fill={isStateActive("arunachal") ? "#FFFFFF" : "#1B4D45"}
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      Arunachal Pradesh
                    </text>
                  </g>

                  {/* 3. ASSAM (Central Brahmaputra Valley) */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleSelectState("assam")}
                  >
                    <path
                      d="M 74,112 L 115,105 L 165,96 L 215,96 L 255,108 L 244,128 L 220,132 L 205,155 L 180,145 L 155,140 L 140,140 L 135,160 L 95,160 L 75,138 Z"
                      fill={isStateActive("assam") ? "#0B534B" : "#C2E5DF"}
                      stroke={isStateActive("assam") ? "#042420" : "#8CC7BD"}
                      strokeWidth="1.8"
                      filter="url(#mapShadow)"
                      className="hover:fill-[#94DDD2] transition-colors"
                    />
                    <text
                      x="166"
                      y="126"
                      fill={isStateActive("assam") ? "#FFFFFF" : "#1B4D45"}
                      fontSize="10"
                      fontWeight="800"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      Assam (অসম)
                    </text>
                  </g>

                  {/* Brahmaputra River dotted line */}
                  <path
                    d="M 80,126 Q 160,113 245,106"
                    stroke="#38BDF8"
                    strokeWidth="1.8"
                    strokeDasharray="3 3"
                    fill="none"
                    opacity="0.85"
                  />
                  <text
                    x="132"
                    y="136"
                    fill="#0284C7"
                    fontSize="6.5"
                    fontWeight="700"
                    letterSpacing="0.2"
                  >
                    Brahmaputra Basin
                  </text>

                  {/* 4. MEGHALAYA (South of western Assam) */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleSelectState("meghalaya")}
                  >
                    <path
                      d="M 76,144 L 136,144 L 130,168 L 72,168 Z"
                      fill={isStateActive("meghalaya") ? "#0B534B" : "#C2E5DF"}
                      stroke={isStateActive("meghalaya") ? "#042420" : "#8CC7BD"}
                      strokeWidth="1.5"
                      filter="url(#mapShadow)"
                      className="hover:fill-[#94DDD2] transition-colors"
                    />
                    <text
                      x="104"
                      y="158"
                      fill={isStateActive("meghalaya") ? "#FFFFFF" : "#1B4D45"}
                      fontSize="8.5"
                      fontWeight="700"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      Meghalaya
                    </text>
                  </g>

                  {/* 5. NAGALAND (East of Assam) */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleSelectState("nagaland")}
                  >
                    <path
                      d="M 248,110 L 282,118 L 276,150 L 242,138 Z"
                      fill={isStateActive("nagaland") ? "#0B534B" : "#C2E5DF"}
                      stroke={isStateActive("nagaland") ? "#042420" : "#8CC7BD"}
                      strokeWidth="1.5"
                      filter="url(#mapShadow)"
                      className="hover:fill-[#94DDD2] transition-colors"
                    />
                    <text
                      x="262"
                      y="134"
                      fill={isStateActive("nagaland") ? "#FFFFFF" : "#1B4D45"}
                      fontSize="8.5"
                      fontWeight="700"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      Nagaland
                    </text>
                  </g>

                  {/* 6. MANIPUR (South of Nagaland) */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleSelectState("manipur")}
                  >
                    <path
                      d="M 242,142 L 274,152 L 266,192 L 235,182 Z"
                      fill={isStateActive("manipur") ? "#0B534B" : "#C2E5DF"}
                      stroke={isStateActive("manipur") ? "#042420" : "#8CC7BD"}
                      strokeWidth="1.5"
                      filter="url(#mapShadow)"
                      className="hover:fill-[#94DDD2] transition-colors"
                    />
                    <text
                      x="254"
                      y="172"
                      fill={isStateActive("manipur") ? "#FFFFFF" : "#1B4D45"}
                      fontSize="8.5"
                      fontWeight="700"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      Manipur
                    </text>
                  </g>

                  {/* 7. MIZORAM (Southern hanging wedge) */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleSelectState("mizoram")}
                  >
                    <path
                      d="M 198,185 L 230,185 L 222,238 L 194,232 Z"
                      fill={isStateActive("mizoram") ? "#0B534B" : "#C2E5DF"}
                      stroke={isStateActive("mizoram") ? "#042420" : "#8CC7BD"}
                      strokeWidth="1.5"
                      filter="url(#mapShadow)"
                      className="hover:fill-[#94DDD2] transition-colors"
                    />
                    <text
                      x="212"
                      y="214"
                      fill={isStateActive("mizoram") ? "#FFFFFF" : "#1B4D45"}
                      fontSize="8.5"
                      fontWeight="700"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      Mizoram
                    </text>
                  </g>

                  {/* 8. TRIPURA (Southwest enclave) */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleSelectState("tripura")}
                  >
                    <path
                      d="M 142,175 L 174,175 L 168,216 L 138,210 Z"
                      fill={isStateActive("tripura") ? "#0B534B" : "#C2E5DF"}
                      stroke={isStateActive("tripura") ? "#042420" : "#8CC7BD"}
                      strokeWidth="1.5"
                      filter="url(#mapShadow)"
                      className="hover:fill-[#94DDD2] transition-colors"
                    />
                    <text
                      x="156"
                      y="196"
                      fill={isStateActive("tripura") ? "#FFFFFF" : "#1B4D45"}
                      fontSize="8.5"
                      fontWeight="700"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      Tripura
                    </text>
                  </g>

                  {/* Active Pin Indicators */}
                  {isStateActive("tripura") && (
                    <g transform="translate(148, 185)" className="animate-pulse">
                      <circle cx="5" cy="5" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>
                  )}
                  {isStateActive("assam") && (
                    <g transform="translate(160, 110)" className="animate-pulse">
                      <circle cx="5" cy="5" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Quick State Switch Buttons Card with English Default button */}
            <div className="bg-white rounded-2xl p-3 border border-[#D5DFDC] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-[#5A6A66] tracking-wider block uppercase">
                  QUICK STATE SWITCH:
                </span>
                <button
                  type="button"
                  onClick={handleSelectDefaultEnglish}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-black border transition-all flex items-center gap-1 cursor-pointer ${
                    activeStateId === "english"
                      ? "bg-[#0B534B] text-white border-[#0B534B] shadow-xs"
                      : "bg-[#E6F4F1] text-[#0B534B] border-[#93CEC5] hover:bg-[#C2E5DF]"
                  }`}
                  title="Switch directly to English (Default)"
                >
                  <Globe className="w-3 h-3 text-current" />
                  <span>English (Default)</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {QUICK_STATES.map((st) => {
                  const isActive =
                    activeStateId === st.id ||
                    (activeRegionId === "assam_tripura" &&
                      (st.id === "assam" || st.id === "tripura"));
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSelectState(st.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-[#0B534B] text-white shadow-xs border border-[#0B534B]"
                          : "bg-white text-[#0B534B] border border-[#D5DFDC] hover:border-[#93CEC5] hover:bg-[#E6F4F1]"
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Active Region Profile & Dialect Options */}
          <div className="lg:col-span-7 p-4 sm:p-5 bg-white flex flex-col justify-between space-y-2.5">
            <div>
              {/* Region Profile Heading Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-[#EBF0EE] pb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D97706] inline-block" />
                    <span className="text-[10px] sm:text-[11px] font-black text-[#D97706] tracking-wider uppercase">
                      ACTIVE REGION PROFILE
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-[#111615] tracking-tight mt-0.5">
                    {currentRegion.name}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {activeRegionId !== "national_english" && (
                    <button
                      type="button"
                      onClick={handleSelectDefaultEnglish}
                      className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#0B534B] bg-[#E6F4F1] hover:bg-[#C2E5DF] border border-[#93CEC5] px-2.5 py-1 rounded-full transition-all cursor-pointer"
                      title="Quick select English as Default"
                    >
                      <RotateCcw className="w-3 h-3 text-[#0B534B]" />
                      <span>Use English</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                    <span>🎙 High-Clarity Voice Available</span>
                  </div>
                </div>
              </div>

              {/* Dialect Selection Cards List */}
              <div className="space-y-2 my-2.5">
                {visibleDialects.map((dialect) => {
                  const isSelected = stagedDialect.id === dialect.id;
                  const isPlaying = playingDialectId === dialect.id;

                  return (
                    <div
                      key={dialect.id}
                      role="button"
                      tabIndex={0}
                      aria-selected={isSelected}
                      onClick={() => setStagedDialect(dialect)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setStagedDialect(dialect);
                        }
                      }}
                      className={`rounded-2xl p-3 border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                        isSelected
                          ? "border-2 border-[#0B534B] bg-[#E6F4F1]/60 shadow-xs ring-1 ring-[#0B534B]/60"
                          : "border border-[#D5DFDC] bg-white hover:border-[#93CEC5] hover:bg-[#F8FAFA]"
                      }`}
                    >
                      {/* Left: Radio Button Circle */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? "border-[#0B534B] bg-white"
                              : "border-[#93CEC5] bg-white"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-[#0B534B]" />
                          )}
                        </div>

                        {/* Middle: Title, Badge, Location, Speakers */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm sm:text-base font-black text-[#111615] tracking-tight">
                              {dialect.title}
                            </span>
                            <span
                              className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                                dialect.badgeColor === "amber"
                                  ? "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]"
                                  : dialect.badgeColor === "emerald"
                                  ? "bg-[#DCFCE7] text-[#166534] border-[#86EFAC]"
                                  : "bg-[#E6F4F1] text-[#0B534B] border-[#93CEC5]"
                              }`}
                            >
                              {dialect.badge}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-[#5A6A66] font-medium mt-0.5 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#DC2626]" />
                              {dialect.location}
                            </span>
                            <span>•</span>
                            <span>{dialect.speakerCount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Audio Play Button + Checkmark */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handlePlayVoicePreview(e, dialect)}
                          className={`border border-[#93CEC5] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                            isPlaying
                              ? "bg-[#0B534B] text-white border-[#0B534B] animate-pulse"
                              : "bg-white hover:bg-[#E6F4F1] text-[#0B534B]"
                          }`}
                          title={`Listen to sample greeting in ${dialect.title}`}
                          aria-label={`Listen to sample greeting in ${dialect.title}`}
                        >
                          {isPlaying ? (
                            <Volume2 className="w-3 h-3 stroke-[2.5]" />
                          ) : (
                            <Play className="w-3 h-3 fill-[#0B534B] stroke-none" />
                          )}
                          <span>{dialect.playButtonText}</span>
                        </button>

                        {/* Checkmark icon for selected card */}
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#0B534B] text-white flex items-center justify-center font-bold shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Elder Comfort Informational Notice Box */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-2.5 sm:p-3 rounded-2xl flex items-start gap-2.5 shadow-2xs">
              <Leaf className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-[#92400E] leading-snug">
                  Voice exercises &amp; memory tests adapt instantly to your chosen dialect.
                </p>
                <p className="text-[11px] text-[#A16207] leading-relaxed mt-0.5">
                  Large buttons, slow pacing, and familiar local vocabulary ensure a comfortable cognitive training experience for elders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Modal Footer */}
        <div className="bg-white border-t border-[#E5EBE8] px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          {/* Selected Summary Pill */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-xs sm:text-sm font-bold text-[#111615]">
              Selected:{" "}
              <span className="font-black text-[#0B534B]">
                {stagedDialect.langCode === "en"
                  ? "English (Default / National Standard)"
                  : `${stagedDialect.title} + English`}
              </span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-[#93CEC5] text-[#0B534B] hover:bg-[#E6F4F1] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmDialect}
              disabled={isApplying}
              className="rounded-full bg-[#0B534B] hover:bg-[#072F2B] text-white font-black text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {isApplying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                  <span>Applying Dialect...</span>
                </>
              ) : (
                <>
                  <span>Confirm &amp; Set Dialect</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <>
      {/* 1-Touch Trigger Button matching floating pill */}
      {buttonVariant === "translucent" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`bg-white/80 hover:bg-[#E6F4F1] text-[#0B534B] hover:text-[#083D37] border border-[#93CEC5]/60 hover:border-[#10B981] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold shadow-2xs backdrop-blur-md transition-all cursor-pointer hover:-translate-y-0.5 min-h-[40px] ${className}`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={t("nav_select_language", "Change Language & Dialect")}
          title={t("nav_select_language", "Regional Dialect Navigator")}
        >
          <Globe className="w-3.5 h-3.5 text-[#0B534B] flex-shrink-0" />
          <span className="tracking-tight font-black text-[#0B534B]">
            {currentLangInfo.code === "en"
              ? "NE/IN • English"
              : `NE/IN • ${currentLangInfo.nativeName}`}
          </span>
          <ChevronDown className="w-3 h-3 text-[#0B534B]/70" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`bg-[#0B3B36] hover:bg-[#072F2B] text-white border border-[#166258] rounded-full px-3.5 py-1.5 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer ${
            buttonVariant === "sm" ? "btn-sm text-xs sm:text-sm" : "btn-md"
          } ${className}`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={t("nav_select_language", "Change Language & Dialect")}
          title={t("nav_select_language", "Regional Dialect Navigator")}
        >
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A7F3D0] flex-shrink-0" />
          <span className="tracking-tight font-black text-white">
            {currentLangInfo.code === "en"
              ? "NE/IN • English"
              : `NE/IN • ${currentLangInfo.nativeName}`}
          </span>
          <ChevronDown className="w-3 h-3 text-[#A7F3D0] opacity-80" />
        </button>
      )}

      {/* Render Modal via Portal directly into document.body */}
      {isOpen && mounted && createPortal(modalDialog, document.body)}
    </>
  );
}
