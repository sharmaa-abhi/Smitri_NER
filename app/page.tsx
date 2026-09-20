"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Play, 
  Brain, 
  Heart, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Bell, 
  Compass, 
  ChevronRight, 
  ChevronLeft,
  PhoneCall, 
  WifiOff, 
  Stethoscope, 
  Gamepad2,
  Smile,
  X 
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';

const HERO_IMAGES = [
  {
    src: "/hero_elderly_care.jpg",
    alt: "Active elderly senior smiling warmly in a serene, supportive home wellness environment",
    caption: "1. Holistic Cognitive Care",
    category: "Wellness"
  },
  {
    src: "/hero_elderly_activity.jpg",
    alt: "Smiling senior solving cognitive brain puzzles happily with tea",
    caption: "2. Brain & Puzzle Stimulation",
    category: "Cognitive Training"
  },
  {
    src: "/hero_elderly_joy.jpg",
    alt: "Happy Indian grandfather and granddaughter playing interactive memory games together on tablet",
    caption: "3. Family & Memory Connection",
    category: "Family Bond"
  },
  {
    src: "/hero_elderly_yoga.jpg",
    alt: "Serene elderly woman practicing morning meditation and mindfulness yoga in sunlit garden",
    caption: "4. Mindful Breathing & Yoga",
    category: "Mindfulness"
  },
  {
    src: "/hero_pic_5_reading.jpg",
    alt: "Elderly person enjoying peaceful book reading and continuous mental learning",
    caption: "5. Lifelong Reading & Focus",
    category: "Focus & Reading"
  },
  {
    src: "/hero_pic_6_grandparents.jpg",
    alt: "Affectionate grandparents smiling happily and sharing warm nostalgic moments",
    caption: "6. Loving Companion Care",
    category: "Companionship"
  },
  {
    src: "/hero_pic_7_naturewalk.jpg",
    alt: "Seniors enjoying fresh morning air and revitalizing outdoor nature walk",
    caption: "7. Outdoor Nature Mobility",
    category: "Physical Vitality"
  },
  {
    src: "/hero_pic_8_gardening.jpg",
    alt: "Elderly person caring for potted plants and green gardening therapy",
    caption: "8. Therapeutic Gardening",
    category: "Sensory Therapy"
  },
  {
    src: "/hero_pic_9_art_craft.jpg",
    alt: "Senior citizen engaging creative fine motor skills with colors and craft",
    caption: "9. Creative Expression & Art",
    category: "Creative Arts"
  },
  {
    src: "/hero_pic_10_social_tea.jpg",
    alt: "Senior cheerful social conversation over morning tea and hearty laughter",
    caption: "10. Social Connection & Laughter",
    category: "Social Engagement"
  }
];

export default function HomePage() {
  const [showDemoVideoModal, setShowDemoVideoModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    try {
      const STORAGE_KEY = 'smitri_hero_visit_count';
      const storedCount = localStorage.getItem(STORAGE_KEY);
      const count = storedCount ? parseInt(storedCount, 10) : 0;
      const nextIndex = isNaN(count) ? 0 : count % HERO_IMAGES.length;
      
      setCurrentImageIndex(nextIndex);
      localStorage.setItem(STORAGE_KEY, String(count + 1));
    } catch {
      // Fallback if localStorage is disabled
    }
  }, []);

  return (
    <div className="space-y-14 py-2 pb-20">
      {/* ========================================================================= */}
      {/* HERO CONTAINER (Large Rounded Container, Two-Column Desktop Layout)       */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/40 to-teal-50/30 border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Subtle decorative background gradient glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-r from-sky-200/40 via-teal-200/30 to-sky-100/20 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT SIDE: Headline, Badge, Supporting Text, Action Buttons */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Small Pill / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>AI-POWERED COGNITIVE CARE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              Stronger Memories, <br />
              <span className="text-gradient">Brighter Days</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              <strong className="text-slate-900 font-semibold">Smitri_NER</strong> is an AI-powered cognitive care platform designed to support elderly users through memory games, cognitive activities, personalized assistance, and caregiver support.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-bold text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setShowDemoVideoModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-300/90 shadow-sm hover:shadow transition-all"
              >
                <span className="text-teal-700 text-xs">▶</span>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Senior Audio Voice Assistance */}
            <div className="pt-1 flex justify-center lg:justify-start">
              <VoiceButton 
                textToRead="Welcome to Smitri N E R. An AI-powered cognitive care and memory assistance platform designed for elderly users. Tap Get Started to enter your personalized dashboard."
                buttonLabel="Listen to Introduction"
              />
            </div>
          </div>

          {/* RIGHT SIDE: Elderly Care Hero Visual with Floating Feature Badges */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Visual Frame Container */}
            <div className="group relative w-full max-w-[390px] aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-tr from-sky-100 via-white to-teal-100">
              <Image
                src={HERO_IMAGES[currentImageIndex].src}
                alt={HERO_IMAGES[currentImageIndex].alt}
                fill
                priority
                className="object-cover object-center transform group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 390px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Category & Caption overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-start pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                  {HERO_IMAGES[currentImageIndex].caption}
                </div>
              </div>
            </div>


            {/* Floating Feature Badge 1: Top Left - Play Cognitive Games */}
            <div className="absolute -top-3 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/90 shadow-md flex items-center gap-2 animate-float-gentle">
              <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                <Gamepad2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Play Cognitive Games</span>
            </div>

            {/* Floating Feature Badge 2: Top Right - Boost Memory */}
            <div className="absolute -top-3 -right-3 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/90 shadow-md flex items-center gap-2 animate-float-gentle-alt">
              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Boost Memory</span>
            </div>

            {/* Floating Feature Badge 3: Bottom Left - Better Wellbeing */}
            <div className="absolute bottom-6 -left-3 sm:-left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/90 shadow-md flex items-center gap-2 animate-float-gentle-alt">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Better Wellbeing</span>
            </div>

            {/* Floating Feature Badge 4: Bottom Right - Caregiver Support */}
            <div className="absolute bottom-6 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/90 shadow-md flex items-center gap-2 animate-float-gentle">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Caregiver Support</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM BENEFIT STRIP (Horizontal on Desktop with Dividers, Stacked Mobile) */}
        {/* ========================================================================= */}
        <div className="mt-14 pt-10 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center text-left">
          {/* BLOCK 1: Memory Games */}
          <div className="flex items-center gap-4 bg-white/80 md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-slate-200/60 shadow-sm md:shadow-none">
            <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Memory Games</h2>
              <p className="text-sm font-semibold text-slate-600">Train & Improve</p>
            </div>
          </div>

          {/* BLOCK 2: Better Wellbeing (with subtle vertical divider on desktop) */}
          <div className="flex items-center gap-4 bg-white/80 md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-slate-200/60 shadow-sm md:shadow-none md:border-l md:border-slate-200 md:pl-8">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Better Wellbeing</h2>
              <p className="text-sm font-semibold text-slate-600">Stay Engaged</p>
            </div>
          </div>

          {/* BLOCK 3: For a Brighter Future (with subtle vertical divider on desktop) */}
          <div className="flex items-center gap-4 bg-white/80 md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-slate-200/60 shadow-sm md:shadow-none md:border-l md:border-slate-200 md:pl-8">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">For a Brighter Future</h2>
              <p className="text-sm font-semibold text-slate-600">Support Our Elders</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: FEATURES                                                         */}
      {/* ========================================================================= */}
      <section id="features" className="space-y-7 scroll-mt-24">
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold tracking-wider border border-sky-200">
            Platform Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Thoughtfully Crafted for Seniors
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Designed specifically for elderly ease of use, with large touch targets, voice guidance, and non-intrusive caregiver monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Adaptive Cognitive Games</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Three interactive games (Memory Match, Sequence Memory, and Find the Different One) that tune difficulty automatically to keep tasks calm and rewarding.
            </p>
            <Link href="/games" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-700">
              <span>Explore games</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Daily Routine & Reminders</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Large, high-contrast checklists for medication, hydration, and doctor visits, readable aloud via Web Speech API with a single tap.
            </p>
            <Link href="/reminders" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-700">
              <span>View daily routines</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Caregiver Observation</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Family members and healthcare companions receive proactive alerts if a 3-day sustained performance shift or missed routine is detected.
            </p>
            <Link href="/caregiver" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-700">
              <span>Open caregiver portal</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: HOW IT WORKS                                                     */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-900/60 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl space-y-8 scroll-mt-24 text-white">
        {/* Ambient background glow effect */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center space-y-2.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold tracking-wider border border-blue-500/30">
            Workflow Overview
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            How Smitri_NER Works
          </h2>
          <p className="text-sm sm:text-base text-blue-100/80 font-medium">
            A continuous loop of gentle interaction, objective rhythm tracking, and caring support.
          </p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2.5 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-blue-400/40 transition-colors">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-500/20">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Easy Senior Input</h3>
            <p className="text-xs sm:text-sm text-blue-200/70 font-medium leading-relaxed">
              Elderly users interact through high-contrast buttons, touch-friendly grids, and voice prompts.
            </p>
          </div>

          <div className="space-y-2.5 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-blue-400/40 transition-colors">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-500/20">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Cognitive Stimulation</h3>
            <p className="text-xs sm:text-sm text-blue-200/70 font-medium leading-relaxed">
              Short, 2-minute memory challenges measure response speed, accuracy, and mistake recovery.
            </p>
          </div>

          <div className="space-y-2.5 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-blue-400/40 transition-colors">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-500/20">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Adaptive Difficulty</h3>
            <p className="text-xs sm:text-sm text-blue-200/70 font-medium leading-relaxed">
              Our rule-based engine dynamically scales grid size and speed so users never feel pressured.
            </p>
          </div>

          <div className="space-y-2.5 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-blue-400/40 transition-colors">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-500/20">
              04
            </div>
            <h3 className="text-lg font-bold text-white">Caregiver Connection</h3>
            <p className="text-xs sm:text-sm text-blue-200/70 font-medium leading-relaxed">
              Caregivers see real-time trends and receive gentle notifications if check-ins are needed.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: ABOUT & NORTH EASTERN REGION (NER) FOCUS                         */}
      {/* ========================================================================= */}
      <section id="about" className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 space-y-7 scroll-mt-24">
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold tracking-wider border border-teal-500/30">
            <Compass className="w-4 h-4" />
            <span>North Eastern Region (NER) Focus</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Bridging Care Across Remote & Rural Communities
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            Smitri_NER is tailored to bridge the geographical challenges of the North Eastern Region. By supporting lightweight offline-friendly execution and multi-dialect voice assistance, families stay closely connected regardless of distance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          <div className="flex items-start gap-3">
            <WifiOff className="w-6 h-6 text-teal-300 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white text-base">Offline-First Design</h3>
              <p className="text-sm text-slate-300">Works reliably on local device storage even during intermittent connectivity.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <PhoneCall className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white text-base">Direct SOS Link</h3>
              <p className="text-sm text-slate-300">Single-click native cellular dial to local family or ambulance dispatch.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Stethoscope className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white text-base">Healthcare Readiness</h3>
              <p className="text-sm text-slate-300">Structured data models mapped for upcoming ABDM & HL7 FHIR telehealth exchange.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: BLOG & HEALTHCARE TIPS                                           */}
      {/* ========================================================================= */}
      <section id="blog" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wider mb-2">
              Wellness Resources
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Cognitive Wellness Articles
            </h2>
          </div>
          <Link href="/dashboard" className="text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-700 inline-flex items-center gap-1">
            <span>Explore all insights</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-sm">
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">Memory & Sleep</span>
            <h3 className="text-lg font-bold text-slate-900">How 7 Hours of Sleep Protects Neural Recall in Seniors</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">Simple evening routines to promote deeper, memory-consolidating sleep cycles.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-sm">
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">Hydration Tips</span>
            <h3 className="text-lg font-bold text-slate-900">Why Water Intake Directly Affects Attention & Reaction Time</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">Mild dehydration is one of the most common causes of morning cognitive fog.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-sm">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">Caregiver Guidance</span>
            <h3 className="text-lg font-bold text-slate-900">Comforting Communication: Encouraging Daily Mental Games</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">How family members can make daily cognitive check-ins playful and stress-free.</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER & CONTACT                                                          */}
      {/* ========================================================================= */}
      <footer id="contact" className="border-t border-slate-200 pt-12 pb-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 block">Smitri_NER</span>
              <span className="text-xs font-semibold text-slate-600">Cognitive Wellness & Memory Assistance</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
            <Link href="/games" className="hover:text-slate-900">Games</Link>
            <Link href="/reminders" className="hover:text-slate-900">Reminders</Link>
            <Link href="/progress" className="hover:text-slate-900">Progress</Link>
            <Link href="/caregiver" className="hover:text-slate-900">Caregiver</Link>
            <Link href="/emergency" className="text-rose-700 hover:text-rose-700 font-bold">Emergency Help</Link>
          </div>
        </div>

        <div className="bg-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-slate-200">
          <p>© 2026 Smitri_NER Platform. Prototype cognitive wellness system. Not intended for clinical or medical diagnosis.</p>
          <p className="font-semibold text-slate-900">Contact: support@smitriner.care</p>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* INTERACTIVE DEMO VIDEO / WALKTHROUGH MODAL                                */}
      {/* ========================================================================= */}
      {showDemoVideoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-teal-700 font-bold text-sm tracking-wider">Interactive Walkthrough</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoVideoModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900">Smitri_NER Platform Demo</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Experience the complete live workflow designed for seniors:
              </p>
              <ul className="space-y-2 text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2">✓ <strong>Easy Input:</strong> Large cards, voice assistance, high contrast</li>
                <li className="flex items-center gap-2">✓ <strong>Cognitive Games:</strong> Memory Match, Sequence & Odd-one-out</li>
                <li className="flex items-center gap-2">✓ <strong>Adaptive Engine:</strong> Calibrated difficulty recommendation</li>
                <li className="flex items-center gap-2">✓ <strong>Caregiver View:</strong> 7-day trend & sustained decline detection</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Link
                href="/dashboard"
                onClick={() => setShowDemoVideoModal(false)}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-xl font-bold text-center shadow-md hover:from-sky-700 hover:to-teal-700"
              >
                Launch Working Prototype →
              </Link>
              <button
                type="button"
                onClick={() => setShowDemoVideoModal(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
