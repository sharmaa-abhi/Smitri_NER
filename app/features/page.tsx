"use client";

import { useState, useEffect, useMemo } from "react";
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
  Volume2, 
  RefreshCw, 
  PhoneCall, 
  Wifi, 
  WifiOff, 
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import VoiceButton from "@/components/VoiceButton";
import Button from "@/components/Button";
import { playRegionalVoicePrompt, playChime, stopVoicePrompt } from "@/lib/audioPrompts";
import { useLanguage } from "@/lib/i18n";

export default function FeaturesPage() {
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);

  // Dynamic translated steps array
  const STEPS = useMemo(() => [
    {
      id: 1,
      slug: "step-1",
      number: "01",
      title: t("features_step1_title", "Brain & Memory Games"),
      shortTitle: t("features_step1_title", "Brain & Memory Games"),
      tag: t("features_step1_badge", "Step 01 • Memory games"),
      icon: Brain,
    },
    {
      id: 2,
      slug: "step-2",
      number: "02",
      title: t("features_step2_title", "Medicine & Daily Routine"),
      shortTitle: t("features_step2_title", "Medicine & Daily Routine"),
      tag: t("features_step2_badge", "Step 02 • Daily habit"),
      icon: Bell,
    },
    {
      id: 3,
      slug: "step-3",
      number: "03",
      title: t("features_step3_title", "Voice in Your Own Language"),
      shortTitle: t("features_step3_title", "Voice in Your Own Language"),
      tag: t("features_step3_badge", "Step 03 • Inclusion"),
      icon: Languages,
    },
    {
      id: 4,
      slug: "step-4",
      number: "04",
      title: t("features_step4_title", "Family & Caregiver Updates"),
      shortTitle: t("features_step4_title", "Family & Caregiver Updates"),
      tag: t("features_step4_badge", "Step 04 • Family"),
      icon: Users,
    },
    {
      id: 5,
      slug: "step-5",
      number: "05",
      title: t("features_step5_title", "Offline Ready & Emergency SOS"),
      shortTitle: t("features_step5_title", "Offline Ready & Emergency SOS"),
      tag: t("features_step5_badge", "Step 05 • SOS Safety"),
      icon: ShieldAlert,
    }
  ], [t]);

  // Step 1: Memory Match Preview
  const [demoCards, setDemoCards] = useState([
    { id: 1, icon: "🌸", flipped: false, matched: false },
    { id: 2, icon: "☀️", flipped: false, matched: false },
    { id: 3, icon: "🌸", flipped: false, matched: false },
    { id: 4, icon: "☀️", flipped: false, matched: false }
  ]);
  const [demoFlippedIds, setDemoFlippedIds] = useState<number[]>([]);
  const [matchDone, setMatchDone] = useState(false);

  // Step 2: Daily Routine Checklist
  const [routineTasks, setRoutineTasks] = useState([
    { id: 1, textKey: "reminders_medicine", defaultText: "Morning Blood Pressure", done: true },
    { id: 2, textKey: "reminders_medicine", defaultText: "Heart Medicine (After Breakfast)", done: false },
    { id: 3, textKey: "reminders_water", defaultText: "Drink 1 Glass of Water", done: false }
  ]);

  // Step 3: Regional Audio Preview
  const [playingDialect, setPlayingDialect] = useState<string | null>(null);

  // Step 4: Caregiver Scenario Toggle
  const [caregiverView, setCaregiverView] = useState<"normal" | "alert">("normal");

  // Step 5: Offline & SOS Simulator
  const [isOffline, setIsOffline] = useState(false);
  const [sosTested, setSosTested] = useState(false);

  // Viewport BoundingClientRect Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollPosition >= documentHeight - 120) {
        setActiveStep(5);
        return;
      }

      const triggerY = window.innerHeight * 0.38;
      let calculatedStep = 1;

      for (let i = 0; i < STEPS.length; i++) {
        const section = document.getElementById(STEPS[i].slug);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= triggerY) {
            calculatedStep = i + 1;
          }
        }
      }

      setActiveStep(calculatedStep);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [STEPS]);

  // Step 1 Match Handler
  const handleCardClick = (id: number) => {
    const card = demoCards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched || demoFlippedIds.length >= 2) return;

    const nextCards = demoCards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setDemoCards(nextCards);
    const nextFlipped = [...demoFlippedIds, id];
    setDemoFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      const [c1, c2] = nextFlipped.map((fid) => nextCards.find((c) => c.id === fid));
      if (c1 && c2 && c1.icon === c2.icon) {
        playChime("success");
        setTimeout(() => {
          setDemoCards((prev) =>
            prev.map((c) => (c.id === c1.id || c.id === c2.id ? { ...c, matched: true } : c))
          );
          setDemoFlippedIds([]);
          setMatchDone(true);
        }, 400);
      } else {
        setTimeout(() => {
          setDemoCards((prev) =>
            prev.map((c) => (c.id === c1?.id || c.id === c2?.id ? { ...c, flipped: false } : c))
          );
          setDemoFlippedIds([]);
        }, 800);
      }
    }
  };

  const resetCards = () => {
    setDemoCards([
      { id: 1, icon: "🌸", flipped: false, matched: false },
      { id: 2, icon: "☀️", flipped: false, matched: false },
      { id: 3, icon: "🌸", flipped: false, matched: false },
      { id: 4, icon: "☀️", flipped: false, matched: false }
    ]);
    setDemoFlippedIds([]);
    setMatchDone(false);
  };

  // Step 2 Routine Toggle
  const toggleRoutine = (id: number) => {
    setRoutineTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    playChime("success");
  };

  // Step 3 Dialect Play
  const playDialect = (code: string, text: string) => {
    setPlayingDialect(code);
    playRegionalVoicePrompt(code, "welcome", text);
    setTimeout(() => setPlayingDialect(null), 3000);
  };

  // Smooth scroll directly to step
  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-10 py-2 pb-24 max-w-6xl mx-auto">
      {/* ========================================================================= */}
      {/* SIMPLE CLEAN HEADER                                                       */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-white via-sky-50/50 to-teal-50/30 border border-slate-200/90 rounded-3xl p-6 sm:p-10 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-teal-700" />
          <span>{t("features_guide_badge", "Smitri_NER Step Guide")}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t("features_title_prefix", "How Features Work,")}{" "}
          <span className="text-gradient">{t("features_title_gradient", "Step by Step")}</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
          {t("features_desc", "Scroll down through each step. As you scroll, the steps on the left update automatically to guide your journey.")}
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <VoiceButton 
            textToRead={t("features_desc", "Welcome to the step by step feature guide. Scroll down to see 5 easy steps: memory games, medicine reminders, regional voices, family updates, and emergency SOS.")}
            buttonLabel={t("features_listen", "Listen")}
          />
          <Button
            href="/dashboard"
            variant="primary"
            size="md"
          >
            <span>{t("features_open_dashboard", "Open Dashboard")}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MOBILE STICKY STEPPER                                                     */}
      {/* ========================================================================= */}
      <div className="lg:hidden sticky top-20 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2 shadow-sm flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        {STEPS.map((s) => {
          const isActive = activeStep === s.id;
          const isPassed = activeStep > s.id;
          return (
            <Button
              key={s.id}
              onClick={() => scrollTo(s.slug)}
              variant={isActive ? "primary" : isPassed ? "secondary" : "outline"}
              size="sm"
              className="whitespace-nowrap"
            >
              <span>{isPassed ? "✓" : s.number}</span>
              <span>{s.shortTitle}</span>
            </Button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SPLIT LAYOUT: LEFT STICKY STEPPER + RIGHT STEP CARDS                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: STICKY STEPPER (Desktop)                                  */}
        {/* ======================================================================= */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">{t("features_progress", "Progress")}</span>
                <h2 className="text-sm font-black text-slate-900">{t("features_journey", "Feature Journey")}</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold shadow-sm">
                {t("features_step_format", "Step 0{step} of 05").replace("{step}", activeStep.toString())}
              </span>
            </div>

            {/* Vertical timeline connecting track & active line */}
            <div className="space-y-2 relative pl-1">
              {/* Background connecting line */}
              <div className="absolute left-[25px] top-4 bottom-4 w-0.5 bg-slate-200 rounded-full z-0 pointer-events-none" />
              
              {/* Colored active fill bar that animates with activeStep */}
              <div 
                className="absolute left-[25px] top-4 w-0.5 bg-gradient-to-b from-sky-500 via-teal-500 to-indigo-600 rounded-full z-0 transition-all duration-500 ease-out pointer-events-none"
                style={{ 
                  height: `${((activeStep - 1) / (STEPS.length - 1)) * 100}%` 
                }}
              />

              {STEPS.map((step) => {
                const isActive = activeStep === step.id;
                const isPassed = activeStep > step.id;

                return (
                  <button
                    key={step.id}
                    onClick={() => scrollTo(step.slug)}
                    className={`w-full relative z-10 flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 text-left focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none min-h-[44px] ${
                      isActive
                        ? "bg-gradient-to-r from-teal-50 to-sky-50/70 border border-teal-300 text-slate-900 shadow-md translate-x-1.5"
                        : "hover:bg-slate-50 text-slate-600 border border-transparent"
                    }`}
                  >
                    {/* Circle badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                      isActive
                        ? "bg-gradient-to-tr from-sky-600 to-teal-600 text-white shadow-md ring-4 ring-teal-100 scale-110"
                        : isPassed
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-white border-2 border-slate-300 text-slate-500"
                    }`}>
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                    </div>

                    {/* Step Title & Tag */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-semibold block truncate ${
                        isActive ? "text-teal-700" : "text-slate-500"
                      }`}>
                        {step.tag}
                      </span>
                      <span className={`text-xs font-bold truncate block transition-colors ${
                        isActive ? "text-slate-900 font-black text-sm" : "text-slate-600"
                      }`}>
                        {step.title}
                      </span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-teal-700" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">{t("features_auto_updating", "Auto-updating steps")}</span>
              <p>{t("features_auto_updating_desc", "Scroll down or tap any step above to jump directly to it.")}</p>
            </div>
          </div>
        </aside>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: STEP CARDS                                                */}
        {/* ======================================================================= */}
        <main className="lg:col-span-8 space-y-10 sm:space-y-14">

          {/* =================================================================== */}
          {/* STEP 1: BRAIN & MEMORY GAMES                                        */}
          {/* =================================================================== */}
          <section 
            id="step-1" 
            className={`scroll-mt-28 bg-white rounded-3xl p-6 sm:p-8 space-y-5 transition-all duration-500 ${
              activeStep === 1
                ? "border-2 border-teal-500 ring-4 ring-teal-50/80 shadow-xl scale-[1.008]"
                : "border border-slate-200/90 shadow-sm opacity-90 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-colors ${
                  activeStep === 1 ? "bg-teal-600 text-white shadow-sm" : "bg-sky-100 text-sky-700"
                }`}>
                  01
                </span>
                <div>
                  <span className="text-xs font-semibold text-sky-700 block">{t("features_step1_badge", "Step 01 • Memory games")}</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{t("features_step1_title", "Brain & Memory Games")}</h2>
                </div>
              </div>

              {activeStep === 1 && (
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold animate-pulse">
                  {t("features_active_step", "Active step")}
                </span>
              )}
            </div>

            {/* Explanation */}
            <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                {t("features_step1_desc", "Easy 2-minute daily brain exercises that adapt to your speed.")}
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step1_b1_title", "No time pressure")}:</strong> {t("features_step1_b1_desc", "Play calmly without timer stress.")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step1_b2_title", "Auto-adjusts difficulty")}:</strong> {t("features_step1_b2_desc", "Gets easier or harder based on your comfort.")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step1_b3_title", "3 simple games")}:</strong> {t("features_step1_b3_desc", "Match the cards, remember the sequence, find odd one out.")}</li>
              </ul>
            </div>

            {/* Interactive mini preview */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">{t("features_step1_try", "Try it: Tap 2 cards to find matching pair")}</span>
                <Button 
                  onClick={resetCards} 
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t("features_step1_reset", "Reset")}</span>
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
                {demoCards.map((card) => {
                  const visible = card.flipped || card.matched;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleCardClick(card.id)}
                      disabled={card.matched}
                      aria-label={visible ? `Card ${card.icon}` : "Hidden memory card"}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-xl font-bold transition-all focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none min-h-[44px] ${
                        visible
                          ? "bg-white border-2 border-teal-500 shadow-sm"
                          : "bg-sky-600 text-white hover:bg-sky-700"
                      }`}
                    >
                      {visible ? card.icon : <Brain className="w-5 h-5 text-white/80" />}
                    </button>
                  );
                })}
              </div>

              {matchDone && (
                <p className="text-center text-xs font-bold text-teal-800">
                  {t("features_step1_matched", "🎉 Matched! That's how simple and fun the games are.")}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <VoiceButton 
                textToRead={t("features_step1_desc", "Step 1: Brain and memory games. Calm 2-minute puzzles that train recall without any stress or countdowns.")}
                buttonLabel={t("features_listen", "Listen")}
              />
              <Link 
                href="/games" 
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-700 hover:underline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none rounded-lg p-1"
              >
                <span>{t("features_step1_action", "Play games")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* =================================================================== */}
          {/* STEP 2: MEDICINE & ROUTINE REMINDERS                                */}
          {/* =================================================================== */}
          <section 
            id="step-2" 
            className={`scroll-mt-28 bg-white rounded-3xl p-6 sm:p-8 space-y-5 transition-all duration-500 ${
              activeStep === 2
                ? "border-2 border-teal-500 ring-4 ring-teal-50/80 shadow-xl scale-[1.008]"
                : "border border-slate-200/90 shadow-sm opacity-90 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-colors ${
                  activeStep === 2 ? "bg-teal-600 text-white shadow-sm" : "bg-teal-100 text-teal-800"
                }`}>
                  02
                </span>
                <div>
                  <span className="text-xs font-semibold text-teal-700 block">{t("features_step2_badge", "Step 02 • Daily habit")}</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{t("features_step2_title", "Medicine & Daily Routine")}</h2>
                </div>
              </div>

              {activeStep === 2 && (
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold animate-pulse">
                  {t("features_active_step", "Active step")}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                {t("features_step2_desc", "A large, clear daily checklist so you never miss medicine, water, or walking.")}
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step2_b1_title", "Big easy buttons")}:</strong> {t("features_step2_b1_desc", "Tap to check off in one touch.")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step2_b2_title", "Speaks out loud")}:</strong> {t("features_step2_b2_desc", "Read your routine aloud with the voice button.")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step2_b3_title", "Daily habit streak")}:</strong> {t("features_step2_b3_desc", "Encourages steady healthy routines every day.")}</li>
              </ul>
            </div>

            {/* Interactive mini preview */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-600 block">{t("features_step2_try", "Try it: Tap circles to mark routine items done")}</span>
              <div className="space-y-2">
                {routineTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleRoutine(task.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none min-h-[44px] ${
                      task.done ? "bg-emerald-50/70 border-emerald-200 text-slate-500" : "bg-white border-slate-200 text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        task.done ? "bg-emerald-600 text-white" : "border-2 border-slate-300 bg-white"
                      }`}>
                        {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-bold ${task.done ? "line-through text-slate-500" : ""}`}>
                        {task.defaultText}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {task.done ? "✓" : "Tap"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <VoiceButton 
                textToRead={t("features_step2_desc", "Step 2: Medicine and daily routine. A simple checklist that reminds you to take medicines on time.")}
                buttonLabel={t("features_listen", "Listen")}
              />
              <Link 
                href="/reminders" 
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:underline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none rounded-lg p-1"
              >
                <span>{t("features_step2_action", "View reminders")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* =================================================================== */}
          {/* STEP 3: REGIONAL VOICE GUIDANCE                                     */}
          {/* =================================================================== */}
          <section 
            id="step-3" 
            className={`scroll-mt-28 bg-white rounded-3xl p-6 sm:p-8 space-y-5 transition-all duration-500 ${
              activeStep === 3
                ? "border-2 border-teal-500 ring-4 ring-teal-50/80 shadow-xl scale-[1.008]"
                : "border border-slate-200/90 shadow-sm opacity-90 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-colors ${
                  activeStep === 3 ? "bg-teal-600 text-white shadow-sm" : "bg-sky-100 text-sky-700"
                }`}>
                  03
                </span>
                <div>
                  <span className="text-xs font-semibold text-sky-700 block">{t("features_step3_badge", "Step 03 • Inclusion")}</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{t("features_step3_title", "Voice in Your Own Language")}</h2>
                </div>
              </div>

              {activeStep === 3 && (
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold animate-pulse">
                  {t("features_active_step", "Active step")}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                {t("features_step3_desc", "Speaks slowly and clearly in local North Eastern languages so elders feel right at home.")}
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step3_b1_title", "Calm slow pace")}:</strong> {t("features_step3_b1_desc", "Specifically paced slower for elderly hearing comfort.")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step3_b2_title", "Languages supported")}:</strong> {t("features_step3_b2_desc", "Assamese, Bengali, Hindi, English, and more.")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step3_b3_title", "1-tap switch")}:</strong> {t("features_step3_b3_desc", "Change language anytime from the top bar.")}</li>
              </ul>
            </div>

            {/* Interactive mini preview */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-600 block">{t("features_step3_try", "Try it: Tap a language to hear sample voice")}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  onClick={() => playDialect("en", "Welcome to Smitri N E R. Your personal memory companion.")}
                  variant={playingDialect === "en" ? "secondary" : "outline"}
                  size="sm"
                  className="w-full text-center"
                >
                  English
                </Button>
                <Button
                  onClick={() => playDialect("as", "স্মৃতি এন ই আৰলৈ স্বাগতম।")}
                  variant={playingDialect === "as" ? "secondary" : "outline"}
                  size="sm"
                  className="w-full text-center"
                >
                  অসমীয়া (Assamese)
                </Button>
                <Button
                  onClick={() => playDialect("bn", "স্মৃতি এন ই আর-এ স্বাগতম।")}
                  variant={playingDialect === "bn" ? "secondary" : "outline"}
                  size="sm"
                  className="w-full text-center"
                >
                  বাংলা (Bengali)
                </Button>
                <Button
                  onClick={() => playDialect("hi", "स्मृति एन ई आर में आपका स्वागत है।")}
                  variant={playingDialect === "hi" ? "secondary" : "outline"}
                  size="sm"
                  className="w-full text-center"
                >
                  हिंदी (Hindi)
                </Button>
              </div>

              {playingDialect && (
                <div className="flex items-center gap-2 text-xs font-bold text-teal-700 pt-1">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>{t("features_step3_playing", "Playing audio sample...")}</span>
                  <Button 
                    onClick={() => stopVoicePrompt()} 
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    {t("features_step3_stop", "Stop")}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <VoiceButton 
                textToRead={t("features_step3_desc", "Step 3: Voice in your own language. Hear everything spoken softly in your native mother tongue.")}
                buttonLabel={t("features_listen", "Listen")}
              />
              <span className="text-xs text-slate-500 font-medium">{t("features_step3_note", "Change language anytime in top bar")}</span>
            </div>
          </section>

          {/* =================================================================== */}
          {/* STEP 4: CAREGIVER & FAMILY UPDATES                                  */}
          {/* =================================================================== */}
          <section 
            id="step-4" 
            className={`scroll-mt-28 bg-white rounded-3xl p-6 sm:p-8 space-y-5 transition-all duration-500 ${
              activeStep === 4
                ? "border-2 border-teal-500 ring-4 ring-teal-50/80 shadow-xl scale-[1.008]"
                : "border border-slate-200/90 shadow-sm opacity-90 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-colors ${
                  activeStep === 4 ? "bg-teal-600 text-white shadow-sm" : "bg-amber-100 text-amber-800"
                }`}>
                  04
                </span>
                <div>
                  <span className="text-xs font-semibold text-amber-800 block">{t("features_step4_badge", "Step 04 • Family")}</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{t("features_step4_title", "Family & Caregiver Updates")}</h2>
                </div>
              </div>

              {activeStep === 4 && (
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold animate-pulse">
                  {t("features_active_step", "Active step")}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                {t("features_step4_desc", "Keeps family informed gently, without disturbing the senior or invading privacy.")}
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step4_b1_title", "No cameras or spying")}:</strong> {t("features_step4_b1_desc", "100% private, only tracks game scores & routine checks.")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step4_b2_title", "3-Day trend filter")}:</strong> {t("features_step4_b2_desc", "Family is alerted only if routine is missed 3 days continuously.")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step4_b3_title", "Gentle suggestions")}:</strong> {t("features_step4_b3_desc", "Recommends a caring phone call rather than alarming family.")}</li>
              </ul>
            </div>

            {/* Interactive mini preview */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{t("features_step4_try", "Try it: See how family gets notified")}</span>
                <div className="flex gap-1.5 p-1 bg-slate-100 rounded-full">
                  <Button
                    onClick={() => setCaregiverView("normal")}
                    variant={caregiverView === "normal" ? "secondary" : "outline"}
                    size="sm"
                  >
                    {t("features_step4_normal", "Normal")}
                  </Button>
                  <Button
                    onClick={() => setCaregiverView("alert")}
                    variant={caregiverView === "alert" ? "destructive" : "outline"}
                    size="sm"
                  >
                    {t("features_step4_alert", "3-Day Alert")}
                  </Button>
                </div>
              </div>

              {caregiverView === "normal" ? (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0" />
                  <span>{t("features_step4_normal_text", "Routine Normal: All medicines taken on time today. Family sees peaceful green status.")}</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0" />
                  <span>{t("features_step4_alert_text", "Gentle Alert: 3-day missed routine detected. Consider giving a warm call to check in.")}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <VoiceButton 
                textToRead={t("features_step4_desc", "Step 4: Family updates. Discrete notifications sent to loved ones only if daily routine changes for 3 days.")}
                buttonLabel={t("features_listen", "Listen")}
              />
              <Link 
                href="/caregiver" 
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-800 hover:underline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none rounded-lg p-1"
              >
                <span>{t("features_step4_action", "Caregiver view")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* =================================================================== */}
          {/* STEP 5: OFFLINE READY & EMERGENCY SOS                               */}
          {/* =================================================================== */}
          <section 
            id="step-5" 
            className={`scroll-mt-28 bg-white rounded-3xl p-6 sm:p-8 space-y-5 transition-all duration-500 ${
              activeStep === 5
                ? "border-2 border-teal-500 ring-4 ring-teal-50/80 shadow-xl scale-[1.008]"
                : "border border-slate-200/90 shadow-sm opacity-90 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-colors ${
                  activeStep === 5 ? "bg-teal-600 text-white shadow-sm" : "bg-rose-100 text-rose-700"
                }`}>
                  05
                </span>
                <div>
                  <span className="text-xs font-semibold text-rose-700 block">{t("features_step5_badge", "Step 05 • SOS Safety")}</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{t("features_step5_title", "Offline Ready & Emergency SOS")}</h2>
                </div>
              </div>

              {activeStep === 5 && (
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold animate-pulse">
                  {t("features_active_step", "Active step")}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                {t("features_step5_desc", "Built for remote hills and villages where internet drops frequently.")}
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step5_b1_title", "Works 100% offline")}:</strong> {t("features_step5_b1_desc", "Memory games and reminders work without Wi-Fi or data.")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step5_b2_title", "One-touch SOS call")}:</strong> {t("features_step5_b2_desc", "Big red button dials family or ambulance directly on mobile phone.")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">{t("features_step5_b3_title", "Saves locally")}:</strong> {t("features_step5_b3_desc", "Automatically syncs when internet comes back.")}</li>
              </ul>
            </div>

            {/* Interactive mini preview */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{t("features_step5_try", "Try it: Test offline switch & SOS button")}</span>
                <Button
                  onClick={() => setIsOffline(!isOffline)}
                  variant={isOffline ? "outline" : "secondary"}
                  size="sm"
                >
                  {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                  <span>{isOffline ? t("features_step5_offline", "Offline Mode") : t("features_step5_online", "Online Mode")}</span>
                </Button>
              </div>

              <div className="text-center pt-1">
                <Button
                  onClick={() => setSosTested(true)}
                  variant="destructive"
                  size="lg"
                  className="shadow-md hover:shadow-lg"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t("features_step5_sos_btn", "Test Emergency SOS Button")}</span>
                </Button>

                {sosTested && (
                  <p className="mt-2 text-xs font-bold text-rose-700 bg-rose-100 p-2 rounded-lg animate-fadeIn">
                    {t("features_step5_sos_tested", "🚨 SOS Demo: Instantly opens phone dialer with 112 & primary family contact.")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <VoiceButton 
                textToRead={t("features_step5_desc", "Step 5: Offline ready and emergency SOS. Works without internet and gives seniors a direct red button for emergency help.")}
                buttonLabel={t("features_listen", "Listen")}
              />
              <Link 
                href="/emergency" 
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-700 hover:underline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none rounded-lg p-1"
              >
                <span>{t("features_step5_action", "Emergency Help page")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* =================================================================== */}
          {/* BOTTOM SUMMARY                                                      */}
          {/* =================================================================== */}
          <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-white">{t("features_bottom_title", "All Features in One Simple App")}</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-medium">
              {t("features_bottom_desc", "Ready to start? Play a memory game or check your daily dashboard now.")}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                href="/dashboard"
                variant="outline"
                size="md"
              >
                {t("features_bottom_dashboard", "Go to Dashboard")}
              </Button>
              <Button
                href="/games"
                variant="primary"
                size="md"
              >
                {t("features_bottom_games", "Start Memory Games")}
              </Button>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
