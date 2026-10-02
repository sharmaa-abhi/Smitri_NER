"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Brain, 
  Bell, 
  Languages, 
  Users, 
  ShieldAlert, 
  Check, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  RefreshCw, 
  Play, 
  PhoneCall, 
  Wifi, 
  WifiOff, 
  Heart, 
  Trophy,
  Flame,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import VoiceButton from "@/components/VoiceButton";
import { playRegionalVoicePrompt, playChime, stopVoicePrompt } from "@/lib/audioPrompts";

interface StepItem {
  id: number;
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  icon: typeof Brain;
  color: {
    bg: string;
    border: string;
    text: string;
    gradient: string;
    ring: string;
  };
}

const STEPS: StepItem[] = [
  {
    id: 1,
    slug: "step-1",
    number: "01",
    title: "Adaptive Cognitive Training & Memory Games",
    shortTitle: "Cognitive Games",
    category: "Mental Stimulation",
    icon: Brain,
    color: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      text: "text-sky-700",
      gradient: "from-sky-500 to-teal-500",
      ring: "ring-sky-400"
    }
  },
  {
    id: 2,
    slug: "step-2",
    number: "02",
    title: "Daily Senior Routine & Voice Reminders",
    shortTitle: "Daily Reminders",
    category: "Daily Independence",
    icon: Bell,
    color: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-700",
      gradient: "from-teal-500 to-emerald-500",
      ring: "ring-teal-400"
    }
  },
  {
    id: 3,
    slug: "step-3",
    number: "03",
    title: "Multilingual Voice Guidance & Regional Dialects",
    shortTitle: "Regional Voices",
    category: "Accessibility & Inclusivity",
    icon: Languages,
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
      gradient: "from-indigo-500 to-sky-500",
      ring: "ring-indigo-400"
    }
  },
  {
    id: 4,
    slug: "step-4",
    number: "04",
    title: "Proactive Caregiver Intelligence & Peace of Mind",
    shortTitle: "Caregiver Monitoring",
    category: "Family Connection",
    icon: Users,
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      gradient: "from-amber-500 to-rose-500",
      ring: "ring-amber-400"
    }
  },
  {
    id: 5,
    slug: "step-5",
    number: "05",
    title: "Offline Resilience & One-Touch Emergency SOS",
    shortTitle: "Offline & SOS",
    category: "Safety & Reliability",
    icon: ShieldAlert,
    color: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
      gradient: "from-rose-500 to-red-600",
      ring: "ring-rose-400"
    }
  }
];

export default function FeaturesPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Step 1 Interactive Demo State (Mini Memory Match)
  const [demoCards, setDemoCards] = useState([
    { id: 1, icon: "🌸", name: "Flower", flipped: false, matched: false },
    { id: 2, icon: "☀️", name: "Sun", flipped: false, matched: false },
    { id: 3, icon: "🌸", name: "Flower", flipped: false, matched: false },
    { id: 4, icon: "☀️", name: "Sun", flipped: false, matched: false }
  ]);
  const [demoFlippedIds, setDemoFlippedIds] = useState<number[]>([]);
  const [demoScore, setDemoScore] = useState(0);
  const [demoDifficulty, setDemoDifficulty] = useState("Calibrated: Gentle");

  // Step 2 Interactive Demo State (Daily Routines Checklist)
  const [routineTasks, setRoutineTasks] = useState([
    { id: 1, title: "Morning Blood Pressure Check", time: "8:00 AM", done: true },
    { id: 2, title: "Heart Wellness Medication", time: "8:30 AM", done: false },
    { id: 3, title: "Hydration Drink (Warm Water)", time: "11:00 AM", done: false }
  ]);
  const [streakCount, setStreakCount] = useState(4);

  // Step 3 Interactive Demo State (Regional Audio Test)
  const [playingDialect, setPlayingDialect] = useState<string | null>(null);

  // Step 4 Interactive Demo State (Caregiver Alert Scenario)
  const [caregiverScenario, setCaregiverScenario] = useState<"normal" | "alert">("normal");

  // Step 5 Interactive Demo State (Offline & SOS Simulation)
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [sosActivated, setSosActivated] = useState(false);

  // Scroll detection to update active step
  useEffect(() => {
    const handleScroll = () => {
      const stepElements = STEPS.map((s) => document.getElementById(s.slug));
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = stepElements.length - 1; i >= 0; i--) {
        const el = stepElements[i];
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveStep(i + 1);
            break;
          }
        }
      }

      // Calculate progress between step 1 and step 5
      const firstEl = stepElements[0];
      const lastEl = stepElements[stepElements.length - 1];
      if (firstEl && lastEl) {
        const totalHeight = lastEl.offsetTop + lastEl.offsetHeight - firstEl.offsetTop;
        const currentProgress = Math.max(0, Math.min(1, (window.scrollY - firstEl.offsetTop + 200) / totalHeight));
        setScrollProgress(currentProgress * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Step 1: Memory Match Card Click Handler
  const handleCardClick = (id: number) => {
    const card = demoCards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched || demoFlippedIds.length >= 2) return;

    const newCards = demoCards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setDemoCards(newCards);
    const newFlipped = [...demoFlippedIds, id];
    setDemoFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const c1 = newCards.find((c) => c.id === firstId);
      const c2 = newCards.find((c) => c.id === secondId);

      if (c1 && c2 && c1.icon === c2.icon) {
        playChime("success");
        setTimeout(() => {
          setDemoCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, matched: true } : c))
          );
          setDemoFlippedIds([]);
          setDemoScore((s) => s + 10);
          setDemoDifficulty("Auto-Scaled: Moderate");
        }, 500);
      } else {
        setTimeout(() => {
          setDemoCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c))
          );
          setDemoFlippedIds([]);
        }, 900);
      }
    }
  };

  const resetMemoryDemo = () => {
    setDemoCards([
      { id: 1, icon: "🌸", name: "Flower", flipped: false, matched: false },
      { id: 2, icon: "☀️", name: "Sun", flipped: false, matched: false },
      { id: 3, icon: "🌸", name: "Flower", flipped: false, matched: false },
      { id: 4, icon: "☀️", name: "Sun", flipped: false, matched: false }
    ]);
    setDemoFlippedIds([]);
    setDemoScore(0);
    setDemoDifficulty("Calibrated: Gentle");
  };

  // Step 2: Toggle Routine Task
  const toggleRoutineTask = (id: number) => {
    setRoutineTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      const allDone = updated.every((t) => t.done);
      if (allDone) {
        setStreakCount((c) => c + 1);
        playChime("success");
      }
      return updated;
    });
  };

  // Step 3: Play Dialect Audio
  const handleDialectPlay = (code: string, text: string) => {
    setPlayingDialect(code);
    playRegionalVoicePrompt(code, "welcome", text);
    setTimeout(() => {
      setPlayingDialect(null);
    }, 3500);
  };

  const scrollToStep = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-12 py-2 pb-24 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/50 to-teal-50/30 border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/90 text-teal-800 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Interactive Platform Walkthrough</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How Smitri_NER Works, <br />
            <span className="text-gradient">Step-by-Step</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Scroll down to explore how our adaptive cognitive games, high-contrast routines, North Eastern voice dialects, and non-intrusive caregiver alerts function together seamlessly.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <VoiceButton 
              textToRead="Welcome to the Smitri N E R Features walkthrough. Scroll down or select any step to explore how each feature helps senior citizens retain cognitive vitality, stay independent, and remain connected with loved ones."
              buttonLabel="Listen to Feature Guide"
            />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 shadow-sm transition-all"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">Pillar 1</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">Adaptive Games</span>
            <span className="text-xs text-slate-500 font-medium">Difficulty tuning</span>
          </div>
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">Pillar 2</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">Voice Routines</span>
            <span className="text-xs text-slate-500 font-medium">No missed meds</span>
          </div>
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">Pillar 3</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">NER Dialects</span>
            <span className="text-xs text-slate-500 font-medium">Native tongues</span>
          </div>
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Pillar 4 & 5</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">Caregiver & SOS</span>
            <span className="text-xs text-slate-500 font-medium">Offline resilience</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MOBILE STICKY STEPPER (Visible only on small screens)                     */}
      {/* ========================================================================= */}
      <div className="lg:hidden sticky top-20 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 shadow-md flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          const isPassed = activeStep > step.id;
          return (
            <button
              key={step.id}
              onClick={() => scrollToStep(step.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : isPassed
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                isActive ? "bg-white text-slate-900" : isPassed ? "bg-teal-600 text-white" : "bg-slate-300 text-slate-700"
              }`}>
                {isPassed ? "✓" : step.number}
              </span>
              <span>{step.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN SPLIT CONTAINER                                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: STICKY PROGRESS STEPPER (Desktop)                         */}
        {/* ======================================================================= */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
            
            {/* Stepper Header with dynamic counter */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Step Navigation</span>
                <h3 className="text-lg font-black text-slate-900">Feature Journey</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-black shadow-xs">
                Step 0{activeStep} of 0{STEPS.length}
              </div>
            </div>

            {/* Stepper Vertical Timeline with active progress track */}
            <div className="relative pl-2 space-y-1">
              {/* Background vertical line */}
              <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-slate-200 rounded-full" />
              {/* Animated fill vertical line */}
              <div 
                className="absolute left-[23px] top-4 w-1 bg-gradient-to-b from-sky-500 via-teal-500 to-indigo-600 rounded-full transition-all duration-300"
                style={{ height: `${Math.min(100, Math.max(0, ((activeStep - 1) / (STEPS.length - 1)) * 100))}%` }}
              />

              {STEPS.map((step) => {
                const isActive = activeStep === step.id;
                const isPassed = activeStep > step.id;
                const StepIcon = step.icon;

                return (
                  <button
                    key={step.id}
                    onClick={() => scrollToStep(step.slug)}
                    className={`w-full relative flex items-start gap-4 p-3 rounded-2xl transition-all text-left group ${
                      isActive 
                        ? "bg-slate-50 border border-slate-200 shadow-sm translate-x-1" 
                        : "hover:bg-slate-50/60 border border-transparent"
                    }`}
                  >
                    {/* Step Number Circle */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all flex-shrink-0 ${
                      isActive
                        ? "bg-gradient-to-tr from-sky-600 to-teal-600 text-white shadow-md ring-4 ring-teal-100 scale-110"
                        : isPassed
                        ? "bg-teal-600 text-white shadow-xs"
                        : "bg-white border-2 border-slate-300 text-slate-500 group-hover:border-slate-400"
                    }`}>
                      {isPassed ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>

                    {/* Step Title & Details */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isActive ? "text-teal-700" : "text-slate-400"
                      }`}>
                        {step.category}
                      </span>
                      <h4 className={`text-sm font-bold truncate transition-colors ${
                        isActive ? "text-slate-900 font-black" : "text-slate-700 group-hover:text-slate-900"
                      }`}>
                        {step.shortTitle}
                      </h4>
                    </div>

                    {/* Active pulse chevron */}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-teal-600 flex-shrink-0 mt-1 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Interactive Helper Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-teal-300">Live Demonstrations</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Interact with the live cards on the right. Try flipping cards, checking off daily routines, and testing regional voices!
              </p>
              <Link 
                href="/games"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-teal-300 underline underline-offset-2 pt-1"
              >
                <span>Play Live Games Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE STEP CARDS & ANIMATIONS                       */}
        {/* ======================================================================= */}
        <main className="lg:col-span-8 space-y-14 lg:space-y-20">

          {/* ===================================================================== */}
          {/* STEP 01: ADAPTIVE COGNITIVE TRAINING                                  */}
          {/* ===================================================================== */}
          <section 
            id="step-1"
            className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative overflow-hidden transition-all hover:shadow-md"
          >
            {/* Top Step Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-lg shadow-2xs">
                  01
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700 block">Pillar 01 • Cognitive Stimulation</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Adaptive Cognitive Games</h2>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
                <Brain className="w-3.5 h-3.5" />
                <span>3 Engaging Mini-Games</span>
              </div>
            </div>

            {/* Explanation & Key Value */}
            <div className="space-y-4">
              <p className="text-slate-600 font-medium leading-relaxed text-sm sm:text-base">
                Traditional brain training apps can cause elder frustration by imposing rigid timers and confusing penalties. <strong className="text-slate-900">Smitri_NER</strong> utilizes an intelligent difficulty calibrator that dynamically adjusts grid sizes, color contrasts, and response windows to match each user's unique cognitive rhythm.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-sky-700 block">1. Memory Match</span>
                  <p className="text-xs text-slate-600">Visual memory recall with gentle flora, nature, and cultural symbols.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-teal-700 block">2. Sequence Memory</span>
                  <p className="text-xs text-slate-600">Audio-visual musical tone sequences for working memory training.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-indigo-700 block">3. Odd One Out</span>
                  <p className="text-xs text-slate-600">Attention and pattern recognition exercises designed without pressure.</p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE DEMO: MINI CARD MATCHING SIMULATOR */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-sky-50/70 via-white to-teal-50/50 border border-sky-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-slate-900">Live Memory Match Preview: Tap any 2 cards</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                    Score: <strong className="text-sky-600">{demoScore}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-teal-100 text-teal-800">
                    {demoDifficulty}
                  </span>
                  <button 
                    onClick={resetMemoryDemo}
                    className="p-1 rounded-md hover:bg-slate-200 text-slate-500"
                    title="Reset Preview"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Demo Cards Grid */}
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {demoCards.map((card) => {
                  const isVisible = card.flipped || card.matched;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      disabled={card.matched}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-2xl font-bold transition-all transform duration-300 shadow-xs ${
                        isVisible
                          ? "bg-white border-2 border-teal-500 shadow-md scale-105"
                          : "bg-gradient-to-tr from-sky-600 to-teal-600 text-white hover:scale-102 cursor-pointer"
                      }`}
                    >
                      {isVisible ? (
                        <span>{card.icon}</span>
                      ) : (
                        <Brain className="w-6 h-6 text-white/80" />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-xs text-slate-500 font-medium">
                {demoScore === 20 ? "🎉 Outstanding! Both pairs matched. Ready for full games!" : "Tap cards to find matching pairs and experience the adaptive feedback."}
              </p>
            </div>

            {/* Step Action Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <VoiceButton 
                textToRead="Step 1: Adaptive Cognitive Training. Three games calibrated to senior comfort with adaptive pacing and zero stress."
                buttonLabel="Hear Step 1 Audio"
              />
              <Link 
                href="/games"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all"
              >
                <span>Play Full Games</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* STEP 02: DAILY SENIOR ROUTINES & REMINDERS                            */}
          {/* ===================================================================== */}
          <section 
            id="step-2"
            className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative overflow-hidden transition-all hover:shadow-md"
          >
            {/* Top Step Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-lg shadow-2xs">
                  02
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">Pillar 02 • Daily Independence</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Daily Routines & Voice Reminders</h2>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                <Bell className="w-3.5 h-3.5" />
                <span>Audio Assisted</span>
              </div>
            </div>

            {/* Explanation & Key Value */}
            <div className="space-y-4">
              <p className="text-slate-600 font-medium leading-relaxed text-sm sm:text-base">
                Maintaining a steady daily rhythm is vital for memory consolidation and mental clarity. Our senior-friendly routine hub features high-contrast cards, bold time stamps, and instant one-tap voice reading so elders never miss a dose, meal, or hydration target.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Medication Timetable</span>
                  <p className="text-xs text-slate-600">Prescription slots with visual pill badges and audio confirmations.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Hydration Reminders</span>
                  <p className="text-xs text-slate-600">Gentle prompts throughout morning and afternoon to maintain neural health.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Habit Streaks</span>
                  <p className="text-xs text-slate-600">Celebrates daily adherence with empowering positive reinforcement.</p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE DEMO: DAILY ROUTINE INTERACTIVE CHECKLIST */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/40 border border-teal-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900">Today's Schedule: Tap circles to mark complete</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
                  <span>🔥 {streakCount} Day Streak</span>
                </div>
              </div>

              {/* Interactive checklist rows */}
              <div className="space-y-2.5">
                {routineTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleRoutineTask(task.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      task.done
                        ? "bg-emerald-50/60 border-emerald-200 text-slate-500"
                        : "bg-white border-slate-200 text-slate-900 shadow-2xs hover:border-teal-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        task.done
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "border-2 border-slate-300 bg-white"
                      }`}>
                        {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className={`text-sm font-bold block ${task.done ? "line-through text-slate-500" : "text-slate-900"}`}>
                          {task.title}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{task.time}</span>
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      task.done ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                    }`}>
                      {task.done ? "Completed" : "Tap to complete"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Action Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <VoiceButton 
                textToRead="Step 2: Daily Senior Routine. Never miss heart medications or hydration with our audio-assisted checklist."
                buttonLabel="Hear Step 2 Audio"
              />
              <Link 
                href="/reminders"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all"
              >
                <span>View Full Routines Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* STEP 03: MULTILINGUAL VOICE GUIDANCE & REGIONAL DIALECTS              */}
          {/* ===================================================================== */}
          <section 
            id="step-3"
            className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative overflow-hidden transition-all hover:shadow-md"
          >
            {/* Top Step Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg shadow-2xs">
                  03
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block">Pillar 03 • Accessibility & Inclusivity</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Multilingual North Eastern Dialects</h2>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                <Languages className="w-3.5 h-3.5" />
                <span>8 Regional Dialects</span>
              </div>
            </div>

            {/* Explanation & Key Value */}
            <div className="space-y-4">
              <p className="text-slate-600 font-medium leading-relaxed text-sm sm:text-base">
                Elderly individuals in Assam, Meghalaya, Manipur, Mizoram, Nagaland, Arunachal, Tripura, and Sikkim often feel isolated by English-only digital apps. <strong className="text-slate-900">Smitri_NER</strong> provides native voice guidance tuned at a relaxed 0.82x speed with warm harmonic chimes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Acoustic Harmonics</span>
                  <p className="text-xs text-slate-600">Soft chime cues alert the ear before voice begins to ease comprehension.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Elderly Cadence (0.82x)</span>
                  <p className="text-xs text-slate-600">Paced intentionally slower than commercial voice assistants to prevent overwhelm.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Instant 1-Touch Switching</span>
                  <p className="text-xs text-slate-600">Switch any screen between Assamese, Bengali, Manipuri, Hindi, and English in 1 tap.</p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE DEMO: REGIONAL DIALECT SOUNDBOARD */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/40 border border-indigo-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">Interactive Dialect Soundboard: Tap to hear native audio</span>
                </div>
                {playingDialect && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                    Speaking {playingDialect.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Dialect Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleDialectPlay("en", "Welcome to Smitri N E R. Your personal memory and cognitive companion.")}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all text-left space-y-0.5"
                >
                  <span className="text-xs font-bold text-indigo-700 block">English</span>
                  <span className="text-xs text-slate-500 font-medium">Indian English</span>
                </button>

                <button
                  onClick={() => handleDialectPlay("as", "স্মৃতি এন ই আৰলৈ স্বাগতম। আপোনাৰ স্মৃতি আৰু যত্নৰ সংগী।")}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all text-left space-y-0.5"
                >
                  <span className="text-xs font-bold text-indigo-700 block">অসমীয়া (Assamese)</span>
                  <span className="text-xs text-slate-500 font-medium">Guwahati & Brahmaputra</span>
                </button>

                <button
                  onClick={() => handleDialectPlay("bn", "স্মৃতি এন ই আর-এ স্বাগতম। আপনার স্মৃতি ও যত্নের সাথী।")}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all text-left space-y-0.5"
                >
                  <span className="text-xs font-bold text-indigo-700 block">বাংলা (Bengali)</span>
                  <span className="text-xs text-slate-500 font-medium">Barak Valley & Tripura</span>
                </button>

                <button
                  onClick={() => handleDialectPlay("hi", "स्मृति एन ई आर में आपका स्वागत है। आपकी याददाश्त और देखभाल का साथी।")}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all text-left space-y-0.5"
                >
                  <span className="text-xs font-bold text-indigo-700 block">हिंदी (Hindi)</span>
                  <span className="text-xs text-slate-500 font-medium">National Dialect</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Supports Web Speech API + pre-rendered lightweight acoustic clips</span>
                <button
                  onClick={() => stopVoicePrompt()}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
                >
                  Stop Audio
                </button>
              </div>
            </div>

            {/* Step Action Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <VoiceButton 
                textToRead="Step 3: Multilingual Voice Guidance. Supporting North Eastern regional dialects with slow elder-paced speech."
                buttonLabel="Hear Step 3 Audio"
              />
              <span className="text-xs text-slate-500 font-semibold">Available on every page via header language pill</span>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* STEP 04: PROACTIVE CAREGIVER INTELLIGENCE                             */}
          {/* ===================================================================== */}
          <section 
            id="step-4"
            className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative overflow-hidden transition-all hover:shadow-md"
          >
            {/* Top Step Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg shadow-2xs">
                  04
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">Pillar 04 • Family Connection</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Caregiver Observation & Early Alerts</h2>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                <Users className="w-3.5 h-3.5" />
                <span>Non-Intrusive Portal</span>
              </div>
            </div>

            {/* Explanation & Key Value */}
            <div className="space-y-4">
              <p className="text-slate-600 font-medium leading-relaxed text-sm sm:text-base">
                Family members and healthcare companions need reassurance without infringing upon senior dignity. Smitri_NER tracks objective 7-day rhythms (speed, accuracy, mistake recovery, routine completion) and alerts caregivers only when a sustained 3-day shift requires loving attention.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Zero Video Surveillance</span>
                  <p className="text-xs text-slate-600">Purely behavioral metrics. Full senior privacy is preserved 100% of the time.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">3-Day Filter</span>
                  <p className="text-xs text-slate-600">A single bad morning won't trigger panic. Only sustained trends notify family.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Actionable Insights</span>
                  <p className="text-xs text-slate-600">Clear advice: "Call grandfather warmly today" rather than frightening medical jargon.</p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE DEMO: CAREGIVER ALERT SIMULATOR */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-rose-50/40 border border-amber-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">Interactive Caregiver Alert Preview: Toggle Scenarios</span>
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    onClick={() => setCaregiverScenario("normal")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      caregiverScenario === "normal"
                        ? "bg-white text-teal-800 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Normal Routine
                  </button>
                  <button
                    onClick={() => setCaregiverScenario("alert")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      caregiverScenario === "alert"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    3-Day Decline Flag
                  </button>
                </div>
              </div>

              {/* Scenario Output Card */}
              {caregiverScenario === "normal" ? (
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-teal-900 block text-sm">Status: All Calm & Stable (92% Rhythm Score)</span>
                    <p className="text-teal-800">
                      Ramesh Sharma completed 2 memory games this morning and checked off all 3 routine items on schedule. No caregiver intervention needed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 animate-pulse">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-rose-900 block text-sm">Proactive Caregiver Notice (WhatsApp / SMS)</span>
                    <p className="text-rose-800">
                      "Gentle check-in suggested for Ramesh: Memory game response time slowed by 28% across 3 consecutive days, and evening hydration was missed twice. Consider a warm phone call."
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step Action Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <VoiceButton 
                textToRead="Step 4: Caregiver Intelligence. Discrete observation alerts loved ones only when sustained assistance is recommended."
                buttonLabel="Hear Step 4 Audio"
              />
              <Link 
                href="/caregiver"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all"
              >
                <span>Open Caregiver Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* STEP 05: OFFLINE RESILIENCE & EMERGENCY SOS                          */}
          {/* ===================================================================== */}
          <section 
            id="step-5"
            className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative overflow-hidden transition-all hover:shadow-md"
          >
            {/* Top Step Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-lg shadow-2xs">
                  05
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">Pillar 05 • Critical Safety</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Offline Resilience & Emergency SOS</h2>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>1-Tap GSM Cellular SOS</span>
              </div>
            </div>

            {/* Explanation & Key Value */}
            <div className="space-y-4">
              <p className="text-slate-600 font-medium leading-relaxed text-sm sm:text-base">
                In hilly terrains and remote valleys across the North East, mobile data often fluctuates or drops. Smitri_NER is engineered as a Progressive Web App (PWA) with full local offline caching. Games, checklists, and vital contacts work without internet, and the emergency SOS button triggers a direct native cellular call to family or local emergency dispatch.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">100% Offline Caching</span>
                  <p className="text-xs text-slate-600">Game scores and reminder checks store safely in IndexedDB and sync when back online.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Direct Cellular GSM</span>
                  <p className="text-xs text-slate-600">Single-click native `tel:` dialer bypasses internet routing during sudden distress.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">High Contrast Red Alert</span>
                  <p className="text-xs text-slate-600">Prominent, large touch target designed specifically for trembling or panicked fingers.</p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE DEMO: OFFLINE TOGGLE & SOS SIMULATOR */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50/70 via-white to-red-50/40 border border-rose-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">Safety & Connectivity Simulator</span>
                
                {/* Offline toggle */}
                <button
                  onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSimulatedOffline
                      ? "bg-slate-900 text-white border-slate-800"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5 text-rose-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{isSimulatedOffline ? "Mode: Simulated Offline" : "Mode: Connected Online"}</span>
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                isSimulatedOffline ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}>
                <div className="text-xs font-medium space-y-0.5">
                  <span className="font-bold block text-sm">
                    {isSimulatedOffline ? "⚡ Offline Mode Active" : "✅ Real-Time Cloud Sync Active"}
                  </span>
                  <span>
                    {isSimulatedOffline 
                      ? "All games and checklists continue working flawlessly on local device storage."
                      : "Telemetry encrypted and backed up for caregiver review."
                    }
                  </span>
                </div>
                <ShieldCheck className="w-6 h-6 text-teal-600 flex-shrink-0" />
              </div>

              {/* SOS Button Simulator */}
              <div className="pt-2 text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setSosActivated(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-base shadow-lg shadow-red-500/25 hover:scale-102 active:scale-98 transition-all"
                >
                  <PhoneCall className="w-5 h-5 animate-bounce" />
                  <span>Test Emergency SOS Button</span>
                </button>

                {sosActivated && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-900 font-bold animate-fadeIn">
                    🚨 SOS Activated: Native telephone dialer will trigger: `tel:112` or primary caregiver contact: +91 98765 43210.
                    <button 
                      onClick={() => setSosActivated(false)} 
                      className="ml-2 underline text-red-700"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Step Action Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <VoiceButton 
                textToRead="Step 5: Offline Resilience and Emergency SOS. Designed for remote hills with zero internet lag and single-tap emergency speed dial."
                buttonLabel="Hear Step 5 Audio"
              />
              <Link 
                href="/emergency"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all"
              >
                <span>View Emergency Help Page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* FINAL BOTTOM CALL TO ACTION BANNER                                    */}
          {/* ===================================================================== */}
          <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Complete Care Ecosystem</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Ready to Experience Smitri_NER?
              </h3>
              <p className="text-sm sm:text-base text-slate-300 font-medium">
                Start with a gentle 2-minute memory exercise or configure daily medicine reminders for your loved one.
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-lg hover:scale-102 transition-all"
              >
                <span>Open User Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/games"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all"
              >
                <span>Play Memory Match</span>
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
