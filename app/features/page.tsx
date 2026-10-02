"use client";

import { useState, useEffect } from "react";
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
  ShieldCheck,
  CheckCircle2,
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
  icon: typeof Brain;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    slug: "step-1",
    number: "01",
    title: "Brain & Memory Games",
    shortTitle: "Memory Games",
    icon: Brain,
  },
  {
    id: 2,
    slug: "step-2",
    number: "02",
    title: "Medicine & Routine Reminders",
    shortTitle: "Daily Reminders",
    icon: Bell,
  },
  {
    id: 3,
    slug: "step-3",
    number: "03",
    title: "Voice in Your Own Language",
    shortTitle: "Regional Voice",
    icon: Languages,
  },
  {
    id: 4,
    slug: "step-4",
    number: "04",
    title: "Caregiver & Family Updates",
    shortTitle: "Family Updates",
    icon: Users,
  },
  {
    id: 5,
    slug: "step-5",
    number: "05",
    title: "Offline Ready & Emergency SOS",
    shortTitle: "Offline & SOS",
    icon: ShieldAlert,
  }
];

export default function FeaturesPage() {
  const [activeStep, setActiveStep] = useState(1);

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
    { id: 1, text: "Morning Blood Pressure", done: true },
    { id: 2, text: "Heart Medicine (After Breakfast)", done: false },
    { id: 3, text: "Drink 1 Glass of Water", done: false }
  ]);

  // Step 3: Regional Audio Preview
  const [playingDialect, setPlayingDialect] = useState<string | null>(null);

  // Step 4: Caregiver Scenario Toggle
  const [caregiverView, setCaregiverView] = useState<"normal" | "alert">("normal");

  // Step 5: Offline & SOS Simulator
  const [isOffline, setIsOffline] = useState(false);
  const [sosTested, setSosTested] = useState(false);

  // Track active step on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      for (let i = STEPS.length - 1; i >= 0; i--) {
        const el = document.getElementById(STEPS[i].slug);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveStep(i + 1);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Smooth scroll
  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-10 py-2 pb-20 max-w-6xl mx-auto">
      {/* ========================================================================= */}
      {/* SIMPLE CLEAN HEADER                                                       */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-white via-sky-50/50 to-teal-50/30 border border-slate-200/90 rounded-3xl p-6 sm:p-10 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Smitri_NER Guide</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How Features Work, <span className="text-gradient">Step by Step</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
          Scroll down step by step to see how Smitri_NER keeps senior minds sharp, daily medicines on track, and families peacefully connected.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <VoiceButton 
            textToRead="Welcome to the features guide. Scroll down to see 5 simple steps: memory games, medicine reminders, regional voices, family updates, and emergency SOS."
            buttonLabel="Listen"
          />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 shadow-sm transition-all"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MOBILE STICKY STEPPER                                                     */}
      {/* ========================================================================= */}
      <div className="lg:hidden sticky top-20 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2 shadow-sm flex items-center justify-between gap-1 overflow-x-auto">
        {STEPS.map((s) => {
          const isActive = activeStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.slug)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{s.number}.</span>
              <span>{s.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SPLIT LAYOUT: LEFT STICKY STEPPER + RIGHT STEP CARDS                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: STICKY STEPPER (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Steps</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-black">
                {activeStep} of 5
              </span>
            </div>

            {/* Step list */}
            <div className="space-y-1.5 relative">
              {STEPS.map((step) => {
                const isActive = activeStep === step.id;
                const isPassed = activeStep > step.id;

                return (
                  <button
                    key={step.id}
                    onClick={() => scrollTo(step.slug)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                      isActive
                        ? "bg-teal-50/80 border border-teal-200 text-teal-900 font-bold shadow-2xs translate-x-1"
                        : "hover:bg-slate-50 text-slate-600 border border-transparent"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all flex-shrink-0 ${
                      isActive
                        ? "bg-teal-600 text-white shadow-xs"
                        : isPassed
                        ? "bg-teal-100 text-teal-800"
                        : "bg-slate-200 text-slate-600"
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.number}
                    </div>

                    <span className="text-xs font-bold truncate flex-1">
                      {step.title}
                    </span>

                    {isActive && <ChevronRight className="w-4 h-4 text-teal-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">Need help?</p>
              <p>Each card on the right has an interactive preview you can test directly.</p>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: SIMPLE STEP CARDS */}
        <main className="lg:col-span-8 space-y-8 sm:space-y-12">

          {/* =================================================================== */}
          {/* STEP 1: BRAIN & MEMORY GAMES                                        */}
          {/* =================================================================== */}
          <section id="step-1" className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm">
                01
              </span>
              <div>
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">Step 01</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Brain & Memory Games</h2>
              </div>
            </div>

            {/* Simple explanation */}
            <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                Easy 2-minute daily brain exercises that adapt to your speed.
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">No time pressure:</strong> Play calmly without timer stress.</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">Auto-adjusts difficulty:</strong> Gets easier or harder based on your comfort.</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">3 simple games:</strong> Match the cards, remember the sequence, find odd one out.</li>
              </ul>
            </div>

            {/* Interactive mini preview */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Try it: Tap 2 cards to find matching pair</span>
                <button onClick={resetCards} className="text-slate-500 hover:text-slate-800 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
                {demoCards.map((card) => {
                  const visible = card.flipped || card.matched;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      disabled={card.matched}
                      className={`aspect-square rounded-xl flex items-center justify-center text-xl font-bold transition-all ${
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
                <p className="text-center text-xs font-bold text-teal-700">
                  🎉 Matched! That's how simple and fun the games are.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <VoiceButton 
                textToRead="Step 1: Brain and memory games. Calm 2-minute puzzles that train recall without any stress or countdowns."
                buttonLabel="Listen"
              />
              <Link href="/games" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-700 hover:underline">
                <span>Play games</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* =================================================================== */}
          {/* STEP 2: MEDICINE & ROUTINE REMINDERS                                */}
          {/* =================================================================== */}
          <section id="step-2" className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-sm">
                02
              </span>
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">Step 02</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Medicine & Daily Routine</h2>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                A large, clear daily checklist so you never miss medicine, water, or walking.
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">Big easy buttons:</strong> Tap to check off in one touch.</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">Speaks out loud:</strong> Read your routine aloud with the voice button.</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">Daily habit streak:</strong> Encourages steady healthy routines every day.</li>
              </ul>
            </div>

            {/* Interactive mini preview */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 block">Try it: Tap circles to mark routine items done</span>
              <div className="space-y-2">
                {routineTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleRoutine(task.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      task.done ? "bg-emerald-50/70 border-emerald-200 text-slate-500" : "bg-white border-slate-200 text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        task.done ? "bg-emerald-600 text-white" : "border-2 border-slate-300 bg-white"
                      }`}>
                        {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-bold ${task.done ? "line-through text-slate-400" : ""}`}>
                        {task.text}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {task.done ? "Done" : "Tap"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <VoiceButton 
                textToRead="Step 2: Medicine and daily routine. A simple checklist that reminds you to take medicines on time."
                buttonLabel="Listen"
              />
              <Link href="/reminders" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:underline">
                <span>View reminders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* =================================================================== */}
          {/* STEP 3: REGIONAL VOICE GUIDANCE                                     */}
          {/* =================================================================== */}
          <section id="step-3" className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                03
              </span>
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">Step 03</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Voice in Your Own Language</h2>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                Speaks slowly and clearly in local North Eastern languages so elders feel right at home.
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">Calm slow pace:</strong> Specifically paced slower for elderly hearing comfort.</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">Languages supported:</strong> Assamese, Bengali, Hindi, English, and more.</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">1-tap switch:</strong> Change language anytime from the top bar.</li>
              </ul>
            </div>

            {/* Interactive mini preview */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 block">Try it: Tap a language to hear sample voice</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => playDialect("en", "Welcome to Smitri N E R. Your personal memory companion.")}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-left text-xs font-bold text-slate-800"
                >
                  English
                </button>
                <button
                  onClick={() => playDialect("as", "স্মৃতি এন ই আৰলৈ স্বাগতম।")}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-left text-xs font-bold text-slate-800"
                >
                  অসমীয়া (Assamese)
                </button>
                <button
                  onClick={() => playDialect("bn", "স্মৃতি এন ই আর-এ স্বাগতম।")}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-left text-xs font-bold text-slate-800"
                >
                  বাংলা (Bengali)
                </button>
                <button
                  onClick={() => playDialect("hi", "स्मृति एन ई आर में आपका स्वागत है।")}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-left text-xs font-bold text-slate-800"
                >
                  हिंदी (Hindi)
                </button>
              </div>

              {playingDialect && (
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>Playing audio sample...</span>
                  <button onClick={() => stopVoicePrompt()} className="underline ml-auto text-slate-500">Stop</button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <VoiceButton 
                textToRead="Step 3: Voice in your own language. Hear everything spoken softly in your native mother tongue."
                buttonLabel="Listen"
              />
              <span className="text-xs text-slate-500">Change language anytime in top bar</span>
            </div>
          </section>

          {/* =================================================================== */}
          {/* STEP 4: CAREGIVER & FAMILY UPDATES                                  */}
          {/* =================================================================== */}
          <section id="step-4" className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
                04
              </span>
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Step 04</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Family & Caregiver Updates</h2>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                Keeps family informed gently, without disturbing the senior or invading privacy.
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">No cameras or spying:</strong> 100% private, only tracks game scores & routine checks.</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">3-Day trend filter:</strong> Family is alerted only if routine is missed 3 days continuously.</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">Gentle suggestions:</strong> Recommends a caring phone call rather than alarming family.</li>
              </ul>
            </div>

            {/* Interactive mini preview */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Try it: See how family gets notified</span>
                <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setCaregiverView("normal")}
                    className={`px-2 py-0.5 rounded-md ${caregiverView === "normal" ? "bg-teal-600 text-white" : "text-slate-600"}`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setCaregiverView("alert")}
                    className={`px-2 py-0.5 rounded-md ${caregiverView === "alert" ? "bg-rose-600 text-white" : "text-slate-600"}`}
                  >
                    3-Day Alert
                  </button>
                </div>
              </div>

              {caregiverView === "normal" ? (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Routine Normal: All medicines taken on time today. Family sees peaceful green status.</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Gentle Alert: "3-day missed routine detected. Consider giving a warm call to check in."</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <VoiceButton 
                textToRead="Step 4: Family updates. Discrete notifications sent to loved ones only if daily routine changes for 3 days."
                buttonLabel="Listen"
              />
              <Link href="/caregiver" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:underline">
                <span>Caregiver view</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* =================================================================== */}
          {/* STEP 5: OFFLINE READY & EMERGENCY SOS                               */}
          {/* =================================================================== */}
          <section id="step-5" className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-sm">
                05
              </span>
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">Step 05</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Offline Ready & Emergency SOS</h2>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                Built for remote hills and villages where internet drops frequently.
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">Works 100% offline:</strong> Memory games and reminders work without Wi-Fi or data.</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">One-touch SOS call:</strong> Big red button dials family or ambulance directly on mobile phone.</li>
                <li className="flex items-center gap-2">✓ <strong className="text-slate-900">Saves locally:</strong> Automatically syncs when internet comes back.</li>
              </ul>
            </div>

            {/* Interactive mini preview */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Try it: Test offline switch & SOS button</span>
                <button
                  onClick={() => setIsOffline(!isOffline)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    isOffline ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                  <span>{isOffline ? "Offline Mode" : "Online Mode"}</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={() => setSosTested(true)}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md inline-flex items-center gap-2 transition-all active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Test Emergency SOS Button</span>
                </button>

                {sosTested && (
                  <p className="mt-2 text-xs font-bold text-red-800 bg-red-100 p-2 rounded-lg">
                    🚨 SOS Demo: Instantly opens phone dialer with 112 & primary family contact.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <VoiceButton 
                textToRead="Step 5: Offline ready and emergency SOS. Works without internet and gives seniors a direct red button for emergency help."
                buttonLabel="Listen"
              />
              <Link href="/emergency" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-700 hover:underline">
                <span>Emergency Help page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* =================================================================== */}
          {/* BOTTOM SUMMARY                                                      */}
          {/* =================================================================== */}
          <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-3">
            <h3 className="text-lg sm:text-xl font-black">All Features in One Simple App</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Ready to start? Play a memory game or check your daily dashboard now.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-full bg-white text-slate-900 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-all"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/games"
                className="px-5 py-2.5 rounded-full bg-teal-600 text-white text-xs sm:text-sm font-bold hover:bg-teal-700 transition-all"
              >
                Start Memory Games
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
