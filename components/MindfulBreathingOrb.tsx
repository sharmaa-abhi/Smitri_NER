"use client";

import React, { useState, useEffect } from "react";
import { Wind, Play, Pause, RotateCcw, Heart, Sparkles } from "lucide-react";
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
    <div className="bg-gradient-to-br from-teal-50/70 via-sky-50/50 to-white rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-sm relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200">
          <Wind className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
          <span>Mindful Breathing • Neuro-Calm</span>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            2-Minute Senior Mindful Calm
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto mt-1">
            Gentle rhythmic breathing relaxes blood pressure and sharpens recall before playing memory games.
          </p>
        </div>

        {/* The Animated Breathing Orb */}
        <div className="py-4 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
            {/* Outer Pulsing Wave Rings */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-teal-300/40 to-sky-300/30 transition-all duration-1000 ${
                isActive
                  ? phase === "INHALE"
                    ? "scale-110 opacity-70"
                    : phase === "HOLD"
                    ? "scale-105 opacity-50"
                    : "scale-90 opacity-30"
                  : "scale-95 opacity-20"
              }`}
            />
            <div
              className={`absolute inset-3 rounded-full bg-gradient-to-tr from-teal-400/30 to-sky-400/20 transition-all duration-1000 ${
                isActive && phase === "INHALE" ? "scale-105" : "scale-95"
              }`}
            />

            {/* Core Orb */}
            <div
              className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-1000 select-none ${
                phase === "INHALE"
                  ? "bg-gradient-to-tr from-teal-600 to-sky-500 scale-105 shadow-teal-500/30"
                  : phase === "HOLD"
                  ? "bg-gradient-to-tr from-sky-600 to-indigo-600 scale-100 shadow-sky-500/30"
                  : "bg-gradient-to-tr from-teal-700 to-emerald-600 scale-95 shadow-emerald-500/30"
              }`}
            >
              <span className="text-2xl sm:text-3xl font-black font-mono">
                {isActive ? counter : "●"}
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase mt-0.5">
                {isActive ? (phase === "INHALE" ? "Breathe In" : phase === "HOLD" ? "Hold" : "Breathe Out") : "Ready"}
              </span>
            </div>
          </div>

          {/* Regional Guideline Text */}
          <div className="mt-2 text-xs font-bold text-teal-800">
            {phase === "INHALE" && "উশাহ লওক (Deep Inhale) • नाक से सांस लें"}
            {phase === "HOLD" && "ধৰি ৰাখক (Hold Gently) • रोकें"}
            {phase === "EXHALE" && "নিশাহ এৰক (Slow Exhale) • धीरे छोड़ें"}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleToggle}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all shadow-md ${
              isActive
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                : "bg-teal-600 hover:bg-teal-700 text-white hover:scale-102"
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Calm Breathing</span>
              </>
            )}
          </button>

          {completedCycles > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors shadow-2xs"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {completedCycles > 0 && (
          <div className="text-[11px] font-bold text-teal-700 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{completedCycles} Mindful Cycles Completed! Mind is relaxed & primed for recall.</span>
          </div>
        )}
      </div>
    </div>
  );
}
