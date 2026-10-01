"use client";

import React, { useState, useEffect } from "react";
import { Wind, Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { playChime } from "@/lib/audioPrompts";

export default function MindfulBreathingOrb() {
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
    <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-blue-900/60 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 shadow-xs">
          <Wind className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
          <span>Mindful Breathing • Neuro-Calm</span>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            2-Minute Senior Mindful Calm
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto mt-1.5 leading-relaxed">
            Gentle rhythmic breathing relaxes blood pressure and sharpens recall before playing memory games.
          </p>
        </div>

        {/* The Animated Breathing Orb */}
        <div className="py-4 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
            {/* Outer Pulsing Wave Rings */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-teal-400/25 to-sky-400/20 transition-all duration-1000 ${
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
              className={`absolute inset-3 rounded-full bg-gradient-to-tr from-teal-300/30 to-sky-300/20 transition-all duration-1000 ${
                isActive && phase === "INHALE" ? "scale-105 opacity-90" : "scale-95 opacity-50"
              }`}
            />

            {/* Core Orb */}
            <div
              className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-1000 select-none ${
                phase === "INHALE"
                  ? "bg-gradient-to-tr from-teal-500 to-sky-500 scale-105 shadow-[0_0_40px_rgba(20,184,166,0.5)]"
                  : phase === "HOLD"
                  ? "bg-gradient-to-tr from-sky-500 to-indigo-600 scale-100 shadow-[0_0_40px_rgba(14,165,233,0.5)]"
                  : "bg-gradient-to-tr from-teal-600 to-emerald-600 scale-95 shadow-[0_0_35px_rgba(16,185,129,0.45)]"
              }`}
            >
              <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                {isActive ? counter : "●"}
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase mt-0.5 text-teal-100">
                {isActive ? (phase === "INHALE" ? "Breathe In" : phase === "HOLD" ? "Hold" : "Breathe Out") : "Ready"}
              </span>
            </div>
          </div>

          {/* Regional Guideline Text */}
          <div className="mt-3 text-xs sm:text-sm font-bold text-teal-300 tracking-wide">
            {phase === "INHALE" && "উশাহ লওক (Deep Inhale) • नाक से सांस लें"}
            {phase === "HOLD" && "ধৰি ৰাখক (Hold Gently) • रोकें"}
            {phase === "EXHALE" && "নিশাহ এৰক (Slow Exhale) • धीरे छोड़ें"}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleToggle}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-black transition-all shadow-lg active:scale-95 ${
              isActive
                ? "bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/25"
                : "bg-teal-500 hover:bg-teal-400 text-slate-950 hover:scale-102 shadow-teal-500/30"
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Start Calm Breathing</span>
              </>
            )}
          </button>

          {completedCycles > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors shadow-sm"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {completedCycles > 0 && (
          <div className="text-xs font-bold text-teal-300 flex items-center justify-center gap-1.5 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>{completedCycles} Mindful Cycles Completed! Mind is relaxed & primed for recall.</span>
          </div>
        )}
      </div>
    </div>
  );
}
