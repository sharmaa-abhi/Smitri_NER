"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Play,
  Brain,
  Shapes,
  Eye,
  ShoppingBag,
  Hash,
  Grid3X3,
  Volume2,
  Clock,
  BookOpen,
  Award,
  Activity,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Check,
  Flame,
  RotateCcw,
  Sparkles,
  X,
  Coffee,
  HelpCircle,
  Users,
  Music,
  MapPin,
  ChevronRight,
  Plus
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { useLanguage } from '@/lib/i18n';
import { getAllGamesProgress, AllGamesProgress, completeLevel } from '@/lib/gameProgress';
import { DifficultyLevel, GameId } from '@/types/games';
import { useAuth } from '@/lib/auth';
import { playChime, stopVoicePrompt } from '@/lib/audioPrompts';

type GameCategory = 'all' | 'bazaar' | 'family' | 'melodies' | 'walk';

interface SeniorExercise {
  id: string;
  gameId: GameId;
  level: number;
  category: GameCategory;
  categoryBadge: string;
  tag: string;
  title: string;
  description: string;
  stepProgress: string;
  statusBadge: string;
  scenario: string;
  icon: any;
  items: Array<{
    id: string;
    name: string;
    subtitle: string;
    emoji: string;
    isCorrect: boolean;
  }>;
  hintText: string;
}

const SENIOR_EXERCISES: SeniorExercise[] = [
  {
    id: 'grocery-basket',
    gameId: 'grocery-basket',
    level: 1,
    category: 'bazaar',
    categoryBadge: 'LEVEL 1 • ROUTINE FOCUS',
    tag: 'Everyday Routine',
    title: 'Grocery Basket Recall',
    description: 'Practice remembering familiar staples from the Indian local bazaar. Helps sustain daily independence.',
    stepProgress: 'Step 2 of 3',
    statusBadge: 'Active on Right',
    scenario: 'Weekly Local Bazaar & Vegetable Shopping List',
    icon: ShoppingBag,
    items: [
      { id: 'mango', name: 'Ripe Mangoes', subtitle: 'Sweet Alphonso', emoji: '🥭', isCorrect: true },
      { id: 'elaichi', name: 'Fresh Elaichi', subtitle: 'Aromatic Pods', emoji: '🌿', isCorrect: true },
      { id: 'milk', name: "Cow's Milk", subtitle: 'Morning Dairy', emoji: '🥛', isCorrect: true },
      { id: 'tomato', name: 'Red Tomatoes', subtitle: 'Bazaar Vegetable', emoji: '🍅', isCorrect: false },
      { id: 'tea', name: 'Assam Tea Leaves', subtitle: 'Fragrant CTC Blend', emoji: '🍵', isCorrect: false },
      { id: 'turmeric', name: 'Golden Turmeric', subtitle: 'Pure Haldi Root', emoji: '✨', isCorrect: false },
    ],
    hintText: 'Remember the morning bazaar list: You picked ripe sweet fruits, aromatic cardamom spices, and fresh morning dairy.',
  },
  {
    id: 'family-album',
    gameId: 'memory-match',
    level: 2,
    category: 'family',
    categoryBadge: 'VISUAL RECOGNITION',
    tag: 'Family & Faces',
    title: 'Family Memory Album',
    description: 'Identify cherished relatives and memorable holidays with calming prompts and audio hints.',
    stepProgress: 'Step 1 of 3',
    statusBadge: 'Level 2 Ready',
    scenario: 'Old Family Albums, Ancestral Home in Guwahati & Grandchildren Visits',
    icon: Users,
    items: [
      { id: 'grad', name: "Granddaughter's Graduation", subtitle: 'Joyful Family Milestone', emoji: '🎓', isCorrect: true },
      { id: 'garden', name: 'Morning Garden Tea', subtitle: 'Sunlit Verandah in Assam', emoji: '🌺', isCorrect: true },
      { id: 'puja', name: 'Durga Puja Celebrations', subtitle: 'Traditional Family Reunion', emoji: '🪔', isCorrect: true },
      { id: 'holiday', name: 'Shillong Hill Vacation', subtitle: 'Pine Forest Panorama', emoji: '🌲', isCorrect: false },
    ],
    hintText: 'Look for the graduation ceremony photograph and the family morning tea on the verandah.',
  },
  {
    id: 'devotional-melody',
    gameId: 'sound-word-match',
    level: 1,
    category: 'melodies',
    categoryBadge: 'AUDITORY MEMORY',
    tag: 'Gentle Audio',
    title: 'Devotional Melody Recall',
    description: 'Listen to peaceful harmonium and flute phrases and identify the corresponding evening tune.',
    stepProgress: 'Step 2 of 3',
    statusBadge: 'Gentle Audio',
    scenario: 'Evening Prayer Chants, Flute Ragas & Temple Bells',
    icon: Music,
    items: [
      { id: 'flute', name: 'Bansuri Flute Melody', subtitle: 'Peaceful Evening Raga', emoji: '🎵', isCorrect: true },
      { id: 'harmonium', name: 'Harmonium Chime', subtitle: 'Traditional Borgeet Cadence', emoji: '🎹', isCorrect: true },
      { id: 'bell', name: 'Brass Temple Bell', subtitle: 'Morning Aarti Resonance', emoji: '🔔', isCorrect: true },
      { id: 'rain', name: 'Monsoon Rain Drops', subtitle: 'Natural Ambient Sound', emoji: '🌧️', isCorrect: false },
    ],
    hintText: 'Listen closely to the gentle harmonium chord and the devotional flute phrase.',
  },
  {
    id: 'garden-path',
    gameId: 'number-trail',
    level: 1,
    category: 'walk',
    categoryBadge: 'SPATIAL ORIENTATION',
    tag: 'Motor & Focus',
    title: 'Garden Path Tracing',
    description: 'Guide a peaceful swan through tranquil lotus ponds without rush. Calms hand tremors.',
    stepProgress: 'Step 3 of 3',
    statusBadge: 'Motor & Focus',
    scenario: 'Stepping Stones in Botanical Park & Daily Morning Stroll',
    icon: MapPin,
    items: [
      { id: 'stone1', name: 'White Lotus Stone 1', subtitle: 'Gentle Stepping Point', emoji: '🪷', isCorrect: true },
      { id: 'stone2', name: 'River Pebble Stone 2', subtitle: 'Smooth Marble Balance', emoji: '🪨', isCorrect: true },
      { id: 'stone3', name: 'Bamboo Bridge Stone 3', subtitle: 'Shaded Garden Corner', emoji: '🎋', isCorrect: true },
      { id: 'stone4', name: 'Deep Water Ripple', subtitle: 'Bypassed Deep Pond', emoji: '🌊', isCorrect: false },
    ],
    hintText: 'Follow the river stones gently in sequence: Stone 1, Stone 2, then Stone 3.',
  },
];

export default function GamesHubPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const seniorName = user?.name || 'Harishji';
  const userId = user?.id || 'guest';

  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [activeExerciseId, setActiveExerciseId] = useState<string>('grocery-basket');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(['mango', 'elaichi', 'milk']);
  const [showCelebration, setShowCelebration] = useState<boolean>(true);
  const [isCompletedModal, setIsCompletedModal] = useState<boolean>(false);
  const [progressMap, setProgressMap] = useState<AllGamesProgress>({});
  const [streakDays, setStreakDays] = useState<number>(6);

  const activeExercise = SENIOR_EXERCISES.find((e) => e.id === activeExerciseId) || SENIOR_EXERCISES[0];

  const refreshProgress = useCallback(() => {
    setProgressMap(getAllGamesProgress(userId));
  }, [userId]);

  useEffect(() => {
    refreshProgress();
    const handleProgressUpdate = () => refreshProgress();
    window.addEventListener('smitri_game_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('smitri_game_progress_updated', handleProgressUpdate);
  }, [refreshProgress]);

  // Handle switching active game
  const handleSwitchGame = (exercise: SeniorExercise) => {
    playChime('start');
    setActiveExerciseId(exercise.id);
    setIsDrawerOpen(true);
    // Pre-select correct items or reset
    const defaultCorrect = exercise.items.filter((i) => i.isCorrect).map((i) => i.id);
    setSelectedItemIds(defaultCorrect);
    setShowCelebration(true);
  };

  // Toggle item selection inside active drawer
  const handleToggleItem = (itemId: string) => {
    playChime('start');
    setSelectedItemIds((prev) => {
      const isAlready = prev.includes(itemId);
      const updated = isAlready ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      
      // Check if all correct items are selected
      const correctIds = activeExercise.items.filter((i) => i.isCorrect).map((i) => i.id);
      const hasAll = correctIds.every((id) => updated.includes(id)) && updated.length === correctIds.length;
      setShowCelebration(hasAll);
      if (hasAll) {
        playChime('success');
      }
      return updated;
    });
  };

  const handleCompleteExercise = () => {
    playChime('success');
    completeLevel(activeExercise.gameId, 1, 100, userId);
    setIsCompletedModal(true);
  };

  const categories = [
    { id: 'all' as GameCategory, label: 'All Exercises', icon: null },
    { id: 'bazaar' as GameCategory, label: 'Everyday Bazaar', icon: '🛒' },
    { id: 'family' as GameCategory, label: 'Family & Faces', icon: '👥' },
    { id: 'melodies' as GameCategory, label: 'Raga Melodies', icon: '🎵' },
    { id: 'walk' as GameCategory, label: 'Neighborhood Walk', icon: '🧭' },
  ];

  const filteredExercises = selectedCategory === 'all'
    ? SENIOR_EXERCISES
    : SENIOR_EXERCISES.filter((e) => e.category === selectedCategory);

  return (
    <div className="space-y-6 pb-36 sm:pb-44 max-w-7xl mx-auto font-sans antialiased">

      {/* ─── 1. MORNING CALM SESSION STATUS BANNER (Matching Screenshot Exactly) ─── */}
      <section 
        aria-label="Morning Calm Session Status"
        className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6ECEB] shadow-[0_2px_12px_rgba(11,83,75,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-base" aria-hidden="true">🌱</span>
            <span className="text-xs sm:text-sm font-black tracking-wider text-[#065F46] uppercase">
              MORNING CALM SESSION
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              Active Focus
            </span>
          </div>
          <p className="text-base sm:text-lg text-[#111615] font-semibold leading-relaxed">
            Welcome back, {seniorName}. Let us gently nurture your recall today.
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 text-xs sm:text-sm font-bold text-[#374151]">
          <div className="flex items-center gap-1.5 text-[#B45309] bg-[#FFFBEB] px-3.5 py-1.5 rounded-xl border border-[#FDE68A]">
            <Flame className="w-4 h-4 text-[#D97706]" />
            <span>{streakDays} Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#065F46] bg-[#ECFDF5] px-3.5 py-1.5 rounded-xl border border-[#A7F3D0]">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>No Timers Ever</span>
          </div>
        </div>
      </section>

      {/* ─── 2. MAIN SPLIT / DRAWER UX (Master-Detail Layout from Screenshot) ─── */}
      <div className={`grid grid-cols-1 ${isDrawerOpen ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-6 items-start`}>

        {/* ─── LEFT COLUMN: EXERCISES GRID (7 Columns when Drawer is Open) ─── */}
        <section 
          aria-label="Available Memory and Recall Exercises"
          className={`${isDrawerOpen ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-5`}
        >
          {/* Header & Category Pills */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#111615] tracking-tight">
                  Memory &amp; Recall Exercises
                </h2>
                <p className="text-sm text-[#5A6A66] font-medium">
                  {isDrawerOpen 
                    ? 'Selected exercise is open on the right panel. Choose any activity whenever ready.' 
                    : 'Choose any gentle cognitive exercise to practice at your own relaxed rhythm.'}
                </p>
              </div>
              <span className="text-xs font-bold text-[#0B534B] bg-[#E6F4F1] px-3 py-1 rounded-full border border-[#93CEC5] self-start sm:self-auto">
                {SENIOR_EXERCISES.length} Gentle Exercises Available
              </span>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1" role="tablist">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#0B534B] ${
                      isSelected
                        ? 'bg-[#0B534B] text-white border-[#08433C] shadow-xs'
                        : 'bg-white text-[#374151] border-[#E6ECEB] hover:bg-[#F0FDF4] hover:border-[#93CEC5]'
                    }`}
                  >
                    {cat.icon && <span aria-hidden="true">{cat.icon}</span>}
                    <span>{cat.label}</span>
                  </button>
                );
              })}

              {!isDrawerOpen && (
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="ml-auto min-h-[40px] px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] hover:bg-[#d4ede7] transition-all inline-flex items-center gap-1.5"
                >
                  <span>▷ Open Active Drawer</span>
                </button>
              )}
            </div>
          </div>

          {/* Exercises Cards Grid (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {filteredExercises.map((exercise) => {
              const isSelected = exercise.id === activeExerciseId && isDrawerOpen;
              const Icon = exercise.icon;

              return (
                <article
                  key={exercise.id}
                  onClick={() => handleSwitchGame(exercise)}
                  className={`rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[260px] relative ${
                    isSelected
                      ? 'bg-white border-2 border-[#3B82F6] shadow-[0_4px_20px_rgba(59,130,246,0.12)] ring-4 ring-[#3B82F6]/10'
                      : 'bg-white border border-[#E6ECEB] hover:border-[#93CEC5] shadow-[0_2px_10px_rgba(11,83,75,0.04)] hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon Capsule + Status Pill */}
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#0B534B] text-white' : 'bg-[#E6F4F1] text-[#0B534B]'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isSelected
                          ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                          : 'bg-[#F9FAFB] text-[#5A6A66] border-[#E5E7EB]'
                      }`}>
                        {isSelected ? 'Active on Right' : exercise.statusBadge}
                      </span>
                    </div>

                    {/* Category Subtitle */}
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#5A6A66] block">
                      {exercise.categoryBadge}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#111615] leading-snug">
                      {exercise.title}
                    </h3>

                    {/* Senior-Friendly Description */}
                    <p className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed line-clamp-3">
                      {exercise.description}
                    </p>
                  </div>

                  {/* Bottom Row: Step Progress / Action */}
                  <div className="pt-4 mt-2 border-t border-[#F3F4F6] flex items-center justify-between">
                    {isSelected ? (
                      <>
                        <div className="text-xs font-bold text-[#5A6A66]">
                          Step Progress: <span className="text-[#111615] font-extrabold">{exercise.stepProgress}</span>
                        </div>
                        <span className="text-xs font-black text-[#2563EB] inline-flex items-center gap-1">
                          <span>Playing in drawer panel</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280]">
                          <span className="text-[#059669]">✓</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                        </div>
                        <span className="text-xs font-extrabold text-[#0B534B] hover:text-[#08433C] inline-flex items-center gap-1">
                          <span>▷ Switch to this Game</span>
                        </span>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* ─── Bottom Warm Pause Reassurance Note (From Screenshot) ─── */}
          <div className="bg-[#F8FAF9] rounded-2xl p-4 sm:p-5 border border-[#E6ECEB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0" aria-hidden="true">☕</span>
              <div className="space-y-0.5">
                <span className="text-xs sm:text-sm font-bold text-[#111615] block">
                  Need a warm pause?
                </span>
                <p className="text-xs text-[#5A6A66]">
                  There is never a penalty for stepping away. Your progress is safeguarded constantly.
                </p>
              </div>
            </div>

            <Link
              href="/caregiver"
              className="text-xs font-extrabold text-[#0B534B] hover:text-[#08433C] whitespace-nowrap bg-white px-3.5 py-1.5 rounded-xl border border-[#D5DFDC] transition-colors self-start sm:self-auto"
            >
              Caregiver Check-in →
            </Link>
          </div>
        </section>

        {/* ─── RIGHT COLUMN: INTERACTIVE DRAWER / GAMEPLAY PANEL (5 Cols) ─── */}
        {isDrawerOpen && (
          <aside 
            aria-label="Active Exercise Interactive Panel"
            className="lg:col-span-5 bg-white rounded-3xl border border-[#D5DFDC] shadow-[0_4px_24px_rgba(11,83,75,0.08)] p-6 sm:p-7 space-y-6 sticky top-20"
          >
            {/* Drawer Header: Minimize button + Audio / Font controls */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-3.5 py-1.5 rounded-full border-2 border-dashed border-[#93CEC5] hover:border-[#0B534B] text-xs font-bold text-[#0B534B] hover:bg-[#E6F4F1] transition-all flex items-center gap-1.5 cursor-pointer"
                title="Minimize active exercise panel"
              >
                <X className="w-3.5 h-3.5" />
                <span>Minimize / Back to Grid</span>
              </button>

              <div className="flex items-center gap-3 text-xs font-bold text-[#5A6A66]">
                <button
                  type="button"
                  onClick={() => {
                    playChime('chime');
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      stopVoicePrompt();
                      const u = new SpeechSynthesisUtterance(activeExercise.hintText);
                      u.rate = 0.85;
                      window.speechSynthesis.speak(u);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#0B534B] transition-colors"
                  title="Listen to audio instructions"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="text-[#9CA3AF]">|</span>
                <span className="cursor-pointer hover:text-[#0B534B]">A-</span>
                <span className="text-[#9CA3AF]">|</span>
                <span className="cursor-pointer hover:text-[#0B534B]">A+</span>
              </div>
            </div>

            {/* Exercise Title & Mode */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5A6A66]">
                <span>Level {activeExercise.level} • Gentle Start</span>
                <span>•</span>
                <span className="text-[#059669] font-black">No Rush Mode</span>
              </div>
              <h3 className="text-2xl font-black text-[#111615] tracking-tight">
                {activeExercise.title}
              </h3>
            </div>

            {/* Calming Reassurance Callout (From Screenshot) */}
            <div className="bg-[#F8FAF9] rounded-2xl p-4 border border-[#E6ECEB] flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">⏳</span>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#111615] block">
                  Take your time, {seniorName}.
                </span>
                <p className="text-xs text-[#5A6A66] leading-relaxed">
                  There are no countdowns or rush timers. Enjoy this exercise at your own relaxed pace.
                </p>
              </div>
            </div>

            {/* Active Step Instructions */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0B534B] text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-extrabold text-[#111615]">
                  Step 2: Recall Morning Items
                </h4>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#374151]">
                Which 3 items did you place in your morning basket?
              </p>
              <p className="text-xs text-[#5A6A66]">
                Tap each familiar staple below that you saw during the bazaar scene.
              </p>
            </div>

            {/* Interactive Senior-Friendly Item Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {activeExercise.items.slice(0, 4).map((item) => {
                const isSelected = selectedItemIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] relative ${
                      isSelected
                        ? 'bg-[#F0FDF4] border-2 border-[#10B981] shadow-xs'
                        : 'bg-white border border-[#E5E7EB] hover:border-[#93CEC5]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected 
                          ? 'bg-[#10B981] text-white' 
                          : 'bg-[#F3F4F6] text-[#9CA3AF]'
                      }`}>
                        {isSelected ? '✓' : '+'}
                      </div>
                    </div>

                    <div className="space-y-0.5 mt-2">
                      <span className="text-xs sm:text-sm font-extrabold text-[#111615] block leading-tight">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#5A6A66] block leading-tight">
                        {item.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Success & Celebration Banner */}
            {showCelebration && (
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4 text-center space-y-1 animate-in fade-in duration-300">
                <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-[#065F46]">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <span>3 of 3 items matched perfectly, {seniorName}!</span>
                </div>
                <p className="text-xs text-[#047857] font-medium">
                  Wonderful attention to detail. You are ready to review your accomplishment.
                </p>
              </div>
            )}

            {/* Audio Hint Button */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  playChime('chime');
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    stopVoicePrompt();
                    const u = new SpeechSynthesisUtterance(activeExercise.hintText);
                    u.rate = 0.82;
                    window.speechSynthesis.speak(u);
                  }
                }}
                className="text-xs font-bold text-[#0B534B] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>🎧</span>
                <span>Listen to Friendly Hint</span>
              </button>
            </div>

            {/* Action Buttons: Complete & View Results / Pause & Sip Tea */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleCompleteExercise}
                className="w-full min-h-[50px] py-3 px-6 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-full font-bold text-base shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B534B]"
              >
                <span>Complete &amp; View Results</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  playChime('start');
                  alert('Progress safely saved. Enjoy your tea break!');
                }}
                className="w-full min-h-[44px] py-2 px-4 bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111615] rounded-full font-semibold text-xs border border-[#E5E7EB] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Pause Game &amp; Sip Tea</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ─── 3. COMPLETION MODAL ─── */}
      {isCompletedModal && (
        <div 
          className="fixed inset-0 bg-[#042420]/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl border-2 border-[#0B534B]">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-black uppercase text-[#0B534B] bg-[#E6F4F1] px-3 py-1 rounded-full border border-[#93CEC5] inline-block">
                Level 1 Completed
              </span>
              <h3 className="text-2xl font-black text-[#111615]">
                Wonderful Accomplishment, {seniorName}!
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                You matched all local bazaar staples with calm precision. Your daily consistency streak has advanced to {streakDays + 1} days!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#F9FAFB] p-3.5 rounded-2xl border border-[#E5E7EB]">
              <div>
                <span className="text-xs font-bold text-[#5A6A66] uppercase block">Accuracy</span>
                <span className="text-2xl font-black text-[#059669]">100%</span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#5A6A66] uppercase block">Pace</span>
                <span className="text-2xl font-black text-[#111615]">Unrushed</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCompletedModal(false)}
                className="w-full min-h-[48px] py-2.5 px-5 bg-[#0B534B] hover:bg-[#08433C] text-white rounded-full font-bold text-sm transition-all shadow-xs"
              >
                Continue Daily Session
              </button>
              <Link
                href="/dashboard"
                className="w-full min-h-[44px] py-2 px-4 bg-[#E6F4F1] hover:bg-[#d4ede7] text-[#0B534B] rounded-full font-bold text-xs inline-flex items-center justify-center"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── 4. FOOTER MATCHING SCREENSHOT ─── */}
      <footer className="pt-8 border-t border-[#E6ECEB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A6A66]">
        <p>© 2025 Smitri NER Memory Care System. Gentle Brain Health for Elders.</p>
        <div className="flex items-center gap-4">
          <span className="cursor-pointer hover:text-[#0B534B] font-bold">Large Print View</span>
        </div>
      </footer>

      {/* ─── 5. Dedicated Clearance Buffer for Floating SOS Control ─── */}
      <div className="h-10 sm:h-14 w-full pointer-events-none" aria-hidden="true" />
    </div>
  );
}
