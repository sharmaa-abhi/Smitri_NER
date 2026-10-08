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
  LogIn,
  X 
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';
import MiniMemoryTeaser from '@/components/MiniMemoryTeaser';
import CaregiverAlertSimulator from '@/components/CaregiverAlertSimulator';
import MindfulBreathingOrb from '@/components/MindfulBreathingOrb';
import NeuralSynapseCanvas from '@/components/NeuralSynapseCanvas';
import RegionalCareMap from '@/components/RegionalCareMap';
import TiltCard from '@/components/TiltCard';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

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
  const { t } = useLanguage();
  const { isLoggedIn, isLoaded } = useAuth();

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
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#E6F4F1]/30 to-[#ECFDF5]/20 border border-[#D5DFDC] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Interactive Mouse-Tracking Neural Synapse Canvas */}
        <NeuralSynapseCanvas />

        {/* Subtle decorative background gradient glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-r from-[#E6F4F1] via-[#10B981]/10 to-[#E6F4F1]/50 blur-3xl pointer-events-none -z-10 rounded-full" />

        {/* Animated Background Neural Synapses SVG */}
        <svg className="absolute -top-8 -right-8 w-80 h-80 opacity-20 pointer-events-none animate-neural-glow -z-10" viewBox="0 0 200 200">
          <circle cx="40" cy="40" r="4" fill="#0B534B" />
          <circle cx="160" cy="50" r="5" fill="#10B981" />
          <circle cx="100" cy="110" r="6" fill="#08433C" />
          <circle cx="60" cy="160" r="4" fill="#D97706" />
          <circle cx="150" cy="150" r="5" fill="#059669" />
          <line x1="40" y1="40" x2="100" y2="110" stroke="#0B534B" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="160" y1="50" x2="100" y2="110" stroke="#10B981" strokeWidth="1.2" />
          <line x1="100" y1="110" x2="60" y2="160" stroke="#08433C" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="100" y1="110" x2="150" y2="150" stroke="#D97706" strokeWidth="1.2" />
          <line x1="160" y1="50" x2="150" y2="150" stroke="#059669" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT SIDE: Headline, Badge, Supporting Text, Action Buttons */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Badges & Live Community Ticker */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F4F1] border border-[#0B534B]/20 text-[#0B534B] text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0B534B]" />
                <span>{t("hero_badge_ai") || "AI-powered cognitive care"}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#10B981]/30 text-[#065F46] text-[11px] font-bold shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                </span>
                <span>{t("hero_badge_live") || "Live: 1,420+ Sessions in NER"}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111615] tracking-tight leading-snug">
              {t("hero_title_1") || "Stronger Memories,"} <br />
              <span className="text-gradient">{t("hero_title_2") || "Brighter Days"}</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-[#5A6A66] font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t("hero_desc") || "Smitri_NER is an AI-powered cognitive care platform designed to support elderly users through memory games, cognitive activities, personalized assistance, and caregiver support."}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              {isLoaded && isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-bold text-white bg-[#0B534B] hover:bg-[#08433C] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{t("nav_dashboard") || "Go to Dashboard"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-bold text-white bg-[#0B534B] hover:bg-[#08433C] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t("nav_login") || "Log In"}</span>
                  </Link>

                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold text-[#0B534B] bg-[#E6F4F1] hover:bg-[#d5ece7] border border-[#0B534B]/30 shadow-xs hover:shadow transition-all"
                  >
                    <span>{t("hero_btn_start") || "Get Started"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={() => setShowDemoVideoModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold text-[#5A6A66] hover:text-[#0B534B] bg-white hover:bg-[#E6F4F1]/40 border border-[#D5DFDC] shadow-xs hover:shadow transition-all"
              >
                <span className="text-[#0B534B] text-xs">▶</span>
                <span>{t("hero_btn_demo") || "Watch Demo"}</span>
              </button>
            </div>

            {/* Senior Audio Voice Assistance with Animated Equalizer */}
            <div className="pt-1 flex items-center justify-center lg:justify-start gap-3">
              <VoiceButton 
                textToRead={t("voice_welcome") || "Welcome to Smitri N E R. An AI-powered cognitive care and memory assistance platform designed for elderly users. Tap Get Started to enter your personalized dashboard."}
                buttonLabel={t("hero_voice_intro") || "Listen to Introduction"}
              />
              <div className="hidden sm:flex items-center gap-1 h-5 px-2.5 py-1 rounded-lg bg-[#E6F4F1] border border-[#0B534B]/20" title="Audio voice active">
                <span className="w-1 bg-[#10B981] rounded-full animate-sound-1" />
                <span className="w-1 bg-[#0B534B] rounded-full animate-sound-2" />
                <span className="w-1 bg-[#10B981] rounded-full animate-sound-3" />
                <span className="w-1 bg-[#0B534B] rounded-full animate-sound-4" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Elderly Care Hero Visual with Floating Feature Badges */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* 3D Glassmorphism Tilt Card Frame */}
            <TiltCard className="rounded-3xl shadow-xl w-full max-w-[390px]" maxTilt={6}>
              <div className="group relative w-full aspect-square rounded-3xl overflow-hidden border-4 border-white bg-gradient-to-tr from-[#E6F4F1] via-white to-[#ECFDF5]">
                <Image
                  src={HERO_IMAGES[currentImageIndex].src}
                  alt={HERO_IMAGES[currentImageIndex].alt}
                  fill
                  priority
                  className="object-cover object-center transform group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 390px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042420]/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Category & Caption overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-start pointer-events-none">
                  <div className="bg-[#042420]/85 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                    {t(HERO_IMAGES[currentImageIndex].caption)}
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Floating Feature Badge 1: Top Left - Play Cognitive Games */}
            <div className="absolute -top-3 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#D5DFDC] shadow-md flex items-center gap-2 animate-float-gentle">
              <div className="w-7 h-7 rounded-full bg-[#E6F4F1] text-[#0B534B] flex items-center justify-center">
                <Gamepad2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#111615]">{t("hero_badge_games") || "Play Cognitive Games"}</span>
            </div>

            {/* Floating Feature Badge 2: Top Right - Boost Memory */}
            <div className="absolute -top-3 -right-3 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#D5DFDC] shadow-md flex items-center gap-2 animate-float-gentle-alt">
              <div className="w-7 h-7 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#111615]">{t("hero_badge_boost") || "Boost Memory"}</span>
            </div>

            {/* Floating Feature Badge 3: Bottom Left - Better Wellbeing */}
            <div className="absolute bottom-6 -left-3 sm:-left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#D5DFDC] shadow-md flex items-center gap-2 animate-float-gentle-alt">
              <div className="w-7 h-7 rounded-full bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#111615]">{t("hero_badge_wellbeing") || "Better Wellbeing"}</span>
            </div>

            {/* Floating Feature Badge 4: Bottom Right - Caregiver Support */}
            <div className="absolute bottom-6 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#D5DFDC] shadow-md flex items-center gap-2 animate-float-gentle">
              <div className="w-7 h-7 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#111615]">{t("hero_badge_caregiver") || "Caregiver Support"}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM BENEFIT STRIP (Horizontal on Desktop with Dividers, Stacked Mobile) */}
        {/* ========================================================================= */}
        <div className="mt-14 pt-10 border-t border-[#D5DFDC] grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center text-left">
          {/* BLOCK 1: Memory Games */}
          <div className="flex items-center gap-4 bg-white/80 md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-[#D5DFDC] shadow-sm md:shadow-none">
            <div className="w-14 h-14 rounded-full bg-[#E6F4F1] text-[#0B534B] flex items-center justify-center flex-shrink-0">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#111615]">{t("benefit_games_title") || "Memory Games"}</h2>
              <p className="text-sm font-semibold text-[#5A6A66]">{t("benefit_games_desc") || "Train & Improve"}</p>
            </div>
          </div>

          {/* BLOCK 2: Better Wellbeing (with subtle vertical divider on desktop) */}
          <div className="flex items-center gap-4 bg-white/80 md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-[#D5DFDC] shadow-sm md:shadow-none md:border-l md:border-[#D5DFDC] md:pl-8">
            <div className="w-14 h-14 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center flex-shrink-0">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#111615]">{t("benefit_wellbeing_title") || "Better Wellbeing"}</h2>
              <p className="text-sm font-semibold text-[#5A6A66]">{t("benefit_wellbeing_desc") || "Stay Engaged"}</p>
            </div>
          </div>

          {/* BLOCK 3: For a Brighter Future (with subtle vertical divider on desktop) */}
          <div className="flex items-center gap-4 bg-white/80 md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-[#D5DFDC] shadow-sm md:shadow-none md:border-l md:border-[#D5DFDC] md:pl-8">
            <div className="w-14 h-14 rounded-full bg-[#FFFBEB] text-[#D97706] flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#111615]">{t("benefit_future_title") || "For a Brighter Future"}</h2>
              <p className="text-sm font-semibold text-[#5A6A66]">{t("benefit_future_desc") || "Support Our Elders"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE TEASER: 15-SECOND MEMORY SPARK                                */}
      {/* ========================================================================= */}
      <ScrollReveal direction="up">
        <MiniMemoryTeaser />
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* MINDFUL BREATHING ORB (Senior Relaxation & Concentration)                 */}
      {/* ========================================================================= */}
      <ScrollReveal direction="up">
        <MindfulBreathingOrb />
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* SECTION: FEATURES                                                         */}
      {/* ========================================================================= */}
      <ScrollReveal direction="up">
        <section id="features" className="space-y-7 scroll-mt-24">
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] text-[#0B534B] text-xs font-bold tracking-wider border border-[#0B534B]/20">
              {t("section_features_badge") || "Platform Capabilities"}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111615] tracking-tight">
              {t("section_features_title") || "Thoughtfully Crafted for Seniors"}
            </h2>
            <p className="text-sm sm:text-base text-[#5A6A66] font-medium">
              {t("section_features_subtitle") || "Designed specifically for elderly ease of use, with large touch targets, voice guidance, and non-intrusive caregiver monitoring."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <ScrollReveal direction="up" delay={100}>
              <TiltCard className="h-full rounded-3xl" maxTilt={7}>
                <div className="h-full bg-white rounded-3xl p-6 sm:p-7 border border-[#D5DFDC] shadow-sm hover:shadow-md transition-all space-y-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#E6F4F1] text-[#0B534B] flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111615]">{t("feature_games_title") || "Adaptive Cognitive Games"}</h3>
                  <p className="text-sm text-[#5A6A66] font-medium leading-relaxed">
                    {t("feature_games_desc") || "Three interactive games (Memory Match, Sequence Memory, and Find the Different One) that tune difficulty automatically to keep tasks calm and rewarding."}
                  </p>
                  <Link href="/games" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B534B] hover:text-[#08433C]">
                    <span>{t("feature_games_action") || "Explore games"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Feature 2 */}
            <ScrollReveal direction="up" delay={200}>
              <TiltCard className="h-full rounded-3xl" maxTilt={7}>
                <div className="h-full bg-white rounded-3xl p-6 sm:p-7 border border-[#D5DFDC] shadow-sm hover:shadow-md transition-all space-y-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111615]">{t("feature_reminders_title") || "Daily Routine & Reminders"}</h3>
                  <p className="text-sm text-[#5A6A66] font-medium leading-relaxed">
                    {t("feature_reminders_desc") || "Large, high-contrast checklists for medication, hydration, and doctor visits, readable aloud via Web Speech API with a single tap."}
                  </p>
                  <Link href="/reminders" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B534B] hover:text-[#08433C]">
                    <span>{t("feature_reminders_action") || "View daily routines"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Feature 3 */}
            <ScrollReveal direction="up" delay={300}>
              <TiltCard className="h-full rounded-3xl" maxTilt={7}>
                <div className="h-full bg-white rounded-3xl p-6 sm:p-7 border border-[#D5DFDC] shadow-sm hover:shadow-md transition-all space-y-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111615]">{t("feature_caregiver_title") || "Caregiver Observation"}</h3>
                  <p className="text-sm text-[#5A6A66] font-medium leading-relaxed">
                    {t("feature_caregiver_desc") || "Family members and healthcare companions receive proactive alerts if a 3-day sustained performance shift or missed routine is detected."}
                  </p>
                  <Link href="/caregiver" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B534B] hover:text-[#08433C]">
                    <span>{t("feature_caregiver_action") || "Open caregiver portal"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* SECTION: HOW IT WORKS                                                     */}
      {/* ========================================================================= */}
      <ScrollReveal direction="up">
        <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-br from-[#042420] via-[#0B534B] to-[#042420] border border-[#10B981]/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl space-y-8 scroll-mt-24 text-white">
          {/* Ambient background glow effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center space-y-2.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#10B981]/20 text-[#ECFDF5] text-xs font-bold tracking-wider border border-[#10B981]/40">
              {t("how_it_works_badge") || "Workflow Overview"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t("how_it_works_title") || "How Smitri_NER Works"}
            </h2>
            <p className="text-sm sm:text-base text-[#D5DFDC] font-medium">
              {t("how_it_works_subtitle") || "A continuous loop of gentle interaction, objective rhythm tracking, and caring support."}
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal direction="up" delay={100}>
              <div className="h-full space-y-2.5 p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-[#10B981]/50 hover:-translate-y-1 transition-all">
                <div className="w-9 h-9 rounded-full bg-[#10B981] text-[#042420] flex items-center justify-center font-black text-xs shadow-md">
                  01
                </div>
                <h3 className="text-lg font-bold text-white">{t("step1_title") || "Easy Senior Input"}</h3>
                <p className="text-xs sm:text-sm text-[#D5DFDC] font-medium leading-relaxed">
                  {t("step1_desc") || "Elderly users interact through high-contrast buttons, touch-friendly grids, and voice prompts."}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="h-full space-y-2.5 p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-[#10B981]/50 hover:-translate-y-1 transition-all">
                <div className="w-9 h-9 rounded-full bg-[#10B981] text-[#042420] flex items-center justify-center font-black text-xs shadow-md">
                  02
                </div>
                <h3 className="text-lg font-bold text-white">{t("step2_title") || "Cognitive Stimulation"}</h3>
                <p className="text-xs sm:text-sm text-[#D5DFDC] font-medium leading-relaxed">
                  {t("step2_desc") || "Short, 2-minute memory challenges measure response speed, accuracy, and mistake recovery."}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <div className="h-full space-y-2.5 p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-[#10B981]/50 hover:-translate-y-1 transition-all">
                <div className="w-9 h-9 rounded-full bg-[#10B981] text-[#042420] flex items-center justify-center font-black text-xs shadow-md">
                  03
                </div>
                <h3 className="text-lg font-bold text-white">{t("step3_title") || "Adaptive Difficulty"}</h3>
                <p className="text-xs sm:text-sm text-[#D5DFDC] font-medium leading-relaxed">
                  {t("step3_desc") || "Our rule-based engine dynamically scales grid size and speed so users never feel pressured."}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className="h-full space-y-2.5 p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-[#10B981]/50 hover:-translate-y-1 transition-all">
                <div className="w-9 h-9 rounded-full bg-[#10B981] text-[#042420] flex items-center justify-center font-black text-xs shadow-md">
                  04
                </div>
                <h3 className="text-lg font-bold text-white">{t("step4_title") || "Caregiver Connection"}</h3>
                <p className="text-xs sm:text-sm text-[#D5DFDC] font-medium leading-relaxed">
                  {t("step4_desc") || "Caregivers see real-time trends and receive gentle notifications if check-ins are needed."}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* INTERACTIVE SIMULATOR: CAREGIVER PEACE OF MIND                            */}
      {/* ========================================================================= */}
      <ScrollReveal direction="up">
        <CaregiverAlertSimulator />
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* NORTHEAST REGIONAL CARE MAP: 8 SISTER STATES RADAR HUBS                   */}
      {/* ========================================================================= */}
      <ScrollReveal direction="up">
        <RegionalCareMap />
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* SECTION: ABOUT & NORTH EASTERN REGION (NER) FOCUS                         */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION: ABOUT & NORTH EASTERN REGION (NER) FOCUS                         */}
      {/* ========================================================================= */}
      <ScrollReveal direction="up">
        <section id="about" className="bg-gradient-to-br from-[#042420] via-[#0B534B] to-[#042420] border border-[#10B981]/25 text-white rounded-3xl p-6 sm:p-10 lg:p-12 space-y-7 scroll-mt-24 shadow-xl">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10B981]/20 text-[#ECFDF5] text-xs font-bold tracking-wider border border-[#10B981]/40">
              <Compass className="w-4 h-4 text-[#10B981]" />
              <span>{t("about_badge") || "North Eastern Region (NER) Focus"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
              {t("about_title") || "Bridging Care Across Remote & Rural Communities"}
            </h2>
            <p className="text-base sm:text-lg text-[#D5DFDC] font-medium leading-relaxed">
              {t("about_desc") || "Smitri_NER is tailored to bridge the geographical challenges of the North Eastern Region. By supporting lightweight offline-friendly execution and multi-dialect voice assistance, families stay closely connected regardless of distance."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#10B981]/20">
            <div className="flex items-start gap-3">
              <WifiOff className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-white text-base">{t("about_pillar1_title") || "Offline-First Design"}</h3>
                <p className="text-sm text-[#D5DFDC]">{t("about_pillar1_desc") || "Works reliably on local device storage even during intermittent connectivity."}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <PhoneCall className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-white text-base">{t("about_pillar2_title") || "Direct SOS Link"}</h3>
                <p className="text-sm text-[#D5DFDC]">{t("about_pillar2_desc") || "Single-click native cellular dial to local family or ambulance dispatch."}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Stethoscope className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-white text-base">{t("about_pillar3_title") || "Healthcare Readiness"}</h3>
                <p className="text-sm text-[#D5DFDC]">{t("about_pillar3_desc") || "Structured data models mapped for upcoming ABDM & HL7 FHIR telehealth exchange."}</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* SECTION: BLOG & HEALTHCARE TIPS                                           */}
      {/* ========================================================================= */}
      <ScrollReveal direction="up">
        <section id="blog" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] text-[#0B534B] text-xs font-bold tracking-wider mb-2 border border-[#0B534B]/20">
                {t("blog_badge") || "Wellness Resources"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111615]">
                {t("blog_title") || "Cognitive Wellness Articles"}
              </h2>
            </div>
            <Link href="/dashboard" className="text-xs sm:text-sm font-bold text-[#0B534B] hover:text-[#08433C] inline-flex items-center gap-1">
              <span>{t("blog_explore") || "Explore all insights"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal direction="up" delay={100}>
              <div className="h-full bg-white p-6 rounded-3xl border border-[#D5DFDC] space-y-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <span className="text-xs font-bold text-[#0B534B] bg-[#E6F4F1] px-2.5 py-1 rounded-md border border-[#0B534B]/20">{t("blog_article1_tag") || "Memory & Sleep"}</span>
                <h3 className="text-lg font-bold text-[#111615]">{t("blog_article1_title") || "How 7 Hours of Sleep Protects Neural Recall in Seniors"}</h3>
                <p className="text-xs sm:text-sm text-[#5A6A66] font-medium leading-relaxed">{t("blog_article1_desc") || "Simple evening routines to promote deeper, memory-consolidating sleep cycles."}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="h-full bg-white p-6 rounded-3xl border border-[#D5DFDC] space-y-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <span className="text-xs font-bold text-[#065F46] bg-[#ECFDF5] px-2.5 py-1 rounded-md border border-[#10B981]/30">{t("blog_article2_tag") || "Hydration Tips"}</span>
                <h3 className="text-lg font-bold text-[#111615]">{t("blog_article2_title") || "Why Water Intake Directly Affects Attention & Reaction Time"}</h3>
                <p className="text-xs sm:text-sm text-[#5A6A66] font-medium leading-relaxed">{t("blog_article2_desc") || "Mild dehydration is one of the most common causes of morning cognitive fog."}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <div className="h-full bg-white p-6 rounded-3xl border border-[#D5DFDC] space-y-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <span className="text-xs font-bold text-[#92400E] bg-[#FFFBEB] px-2.5 py-1 rounded-md border border-[#D97706]/30">{t("blog_article3_tag") || "Caregiver Guidance"}</span>
                <h3 className="text-lg font-bold text-[#111615]">{t("blog_article3_title") || "Comforting Communication: Encouraging Daily Mental Games"}</h3>
                <p className="text-xs sm:text-sm text-[#5A6A66] font-medium leading-relaxed">{t("blog_article3_desc") || "How family members can make daily cognitive check-ins playful and stress-free."}</p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* FOOTER & CONTACT                                                          */}
      {/* ========================================================================= */}
      <footer id="contact" className="border-t border-[#D5DFDC] pt-12 pb-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0B534B] text-white flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-[#111615] block">Smitri_NER</span>
              <span className="text-xs font-semibold text-[#5A6A66]">{t("footer_tagline") || "Cognitive Wellness & Memory Assistance"}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-[#5A6A66]">
            <Link href="/dashboard" className="hover:text-[#0B534B] transition-colors">{t("nav_dashboard") || "Dashboard"}</Link>
            <Link href="/games" className="hover:text-[#0B534B] transition-colors">{t("nav_games") || "Games"}</Link>
            <Link href="/reminders" className="hover:text-[#0B534B] transition-colors">{t("nav_reminders") || "Reminders"}</Link>
            <Link href="/progress" className="hover:text-[#0B534B] transition-colors">{t("nav_progress") || "Progress"}</Link>
            <Link href="/caregiver" className="hover:text-[#0B534B] transition-colors">{t("nav_caregiver") || "Caregiver"}</Link>
            <Link href="/emergency" className="text-[#DC2626] hover:text-[#B91C1C] font-bold transition-colors">{t("nav_emergency") || "Emergency Help"}</Link>
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl p-4 text-xs font-medium text-[#5A6A66] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-[#D5DFDC]">
          <p>{t("footer_copyright") || "© 2026 Smitri_NER Platform. Prototype cognitive wellness system. Not intended for clinical or medical diagnosis."}</p>
          <p className="font-semibold text-[#111615]">{t("footer_contact") || "Contact: support@smitriner.care"}</p>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* INTERACTIVE DEMO VIDEO / WALKTHROUGH MODAL                                */}
      {/* ========================================================================= */}
      {showDemoVideoModal && (
        <div className="fixed inset-0 bg-[#042420]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-[#D5DFDC] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#0B534B] font-bold text-sm tracking-wider">{t("modal_demo_badge") || "Interactive Walkthrough"}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoVideoModal(false)}
                className="p-2 rounded-full hover:bg-[#E6F4F1] text-[#5A6A66] transition-colors"
                aria-label={t("modal_demo_close") || "Close"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black text-[#111615]">{t("modal_demo_title") || "Smitri_NER Platform Demo"}</h3>
              <p className="text-[#5A6A66] text-sm font-medium leading-relaxed">
                {t("modal_demo_subtitle") || "Experience the complete live workflow designed for seniors:"}
              </p>
              <ul className="space-y-2 text-sm text-[#5A6A66] font-medium">
                <li className="flex items-center gap-2">✓ <strong className="text-[#111615]">{t("step1_title") || "Easy Input"}:</strong> {t("Large cards, voice assistance, high contrast")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-[#111615]">{t("feature_games_title") || "Cognitive Games"}:</strong> {t("Memory Match, Sequence & Odd-one-out")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-[#111615]">{t("step3_title") || "Adaptive Engine"}:</strong> {t("Calibrated difficulty recommendation")}</li>
                <li className="flex items-center gap-2">✓ <strong className="text-[#111615]">{t("feature_caregiver_title") || "Caregiver View"}:</strong> {t("7-day trend & sustained decline detection")}</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Link
                href="/dashboard"
                onClick={() => setShowDemoVideoModal(false)}
                className="flex-1 py-3 px-4 bg-[#0B534B] hover:bg-[#08433C] text-white rounded-xl font-bold text-center shadow-md transition-colors"
              >
                {t("modal_demo_launch") || "Launch Working Prototype →"}
              </Link>
              <button
                type="button"
                onClick={() => setShowDemoVideoModal(false)}
                className="px-4 py-3 bg-[#E6F4F1] hover:bg-[#E6F4F1]/80 text-[#0B534B] rounded-xl font-bold transition-colors"
              >
                {t("modal_demo_close") || "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
