"use client";

import React, { useState, useEffect } from "react";
import { Wind, Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { playChime } from "@/lib/audioPrompts";
import { useLanguage } from "@/lib/i18n";

export default function MindfulBreathingOrb() {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"INHALE" | "HOLD" | "EXHALE">("INHALE");
  const [counter, setCounter] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isActive) {
      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (phase === "INHALE") {
              setPhase("HOLD");
              return 2;
            } else if (phase === "HOLD") {
              setPhase("EXHALE");
              return 4;
            } else {
              setPhase("INHALE");
              setCompletedCycles((c) => c + 1);
              playChime("start");
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phase]);

  const handleToggle = () => {
    if (!isActive) {
      setIsActive(true);
      setPhase("INHALE");
      setCounter(4);
      playChime("start");
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("INHALE");
    setCounter(4);
    setCompletedCycles(0);
  };

  return (
    <div className="bg-gradient-to-br from-[#042420] via-[#06342E] to-[#0B534B] text-white rounded-3xl p-6 sm:p-8 border border-[#127267]/40 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#0B534B]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#A7F3D0] text-xs font-bold border border-white/20 shadow-xs">
          <Wind className="w-3.5 h-3.5 text-[#A7F3D0] animate-pulse" />
          <span>{t("Mindful Breathing Orb") || "Mindful Breathing • Neuro-Calm"}</span>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("Senior Relaxation & Focus") || "2-Minute Senior Mindful Calm"}
          </h3>
          <p className="text-xs sm:text-sm text-[#D5DFDC] font-medium max-w-md mx-auto mt-1.5 leading-relaxed">
            {t("Gentle 4-2-4 rhythm designed for senior lung calm and cardiac regulation.") || "Gentle rhythmic breathing relaxes blood pressure and sharpens recall before playing memory games."}
          </p>
        </div>

        {/* The Animated Breathing Orb */}
        <div className="py-4 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
            {/* Outer Pulsing Wave Rings */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#0B534B]/30 to-[#10B981]/30 transition-all duration-1000 ${
                isActive
                  ? phase === "INHALE"
                    ? "scale-110 opacity-75"
                    : phase === "HOLD"
                    ? "scale-105 opacity-55"
                    : "scale-90 opacity-30"
                  : "scale-95 opacity-25"
              }`}
            />
            <div
              className={`absolute inset-3 rounded-full bg-gradient-to-tr from-[#10B981]/30 to-[#A7F3D0]/20 transition-all duration-1000 ${
                isActive && phase === "INHALE" ? "scale-105 opacity-90" : "scale-95 opacity-50"
              }`}
            />

            {/* Core Orb */}
            <div
              className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-1000 select-none ${
                phase === "INHALE"
                  ? "bg-gradient-to-tr from-[#0B534B] to-[#10B981] scale-105 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                  : phase === "HOLD"
                  ? "bg-gradient-to-tr from-[#08433C] to-[#D97706] scale-100 shadow-[0_0_40px_rgba(217,119,6,0.35)]"
                  : "bg-gradient-to-tr from-[#059669] to-[#10B981] scale-95 shadow-[0_0_35px_rgba(16,185,129,0.35)]"
              }`}
            >
              <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                {isActive ? counter : "●"}
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase mt-0.5 text-[#A7F3D0]">
                {isActive ? (phase === "INHALE" ? t("Breathe In") : phase === "HOLD" ? t("Hold") : t("Breathe Out")) : t("Start Breathing")}
              </span>
            </div>
          </div>

          {/* Regional Guideline Text */}
          <div className="mt-3 text-xs sm:text-sm font-bold text-[#A7F3D0] tracking-wide">
            {phase === "INHALE" && (t("Inhale") || "Breathe In")}
            {phase === "HOLD" && (t("Hold") || "Hold Breath")}
            {phase === "EXHALE" && (t("Exhale") || "Breathe Out")}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleToggle}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-black transition-all shadow-lg active:scale-95 ${
              isActive
                ? "bg-[#D97706] hover:bg-[#B45309] text-white shadow-[#D97706]/25"
                : "bg-[#10B981] hover:bg-[#059669] text-white hover:scale-102 shadow-[#10B981]/30"
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{t("Pause") || "Pause"}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white text-white" />
                <span>{t("Start Breathing") || "Start Calm Breathing"}</span>
              </>
            )}
          </button>

          {completedCycles > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors shadow-sm"
              title={t("Reset") || "Reset"}
              aria-label={t("Reset") || "Reset"}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {completedCycles > 0 && (
          <div className="text-xs font-bold text-[#A7F3D0] flex items-center justify-center gap-1.5 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-[#A7F3D0]" />
            <span>{completedCycles} {t("Cycles Completed") || "Mindful Cycles Completed!"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
