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
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { useLanguage } from '@/lib/i18n';
import { getAllGamesProgress, AllGamesProgress } from '@/lib/gameProgress';
import { DifficultyLevel, GameId } from '@/types/games';
import { useAuth } from '@/lib/auth';

type GameCategory = 'all' | 'daily' | 'memory' | 'attention' | 'verbal';

export default function GamesHubPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [progressMap, setProgressMap] = useState<AllGamesProgress>({});
  const [enginePaceSec, setEnginePaceSec] = useState<number | null>(null);

  const refreshProgress = useCallback(() => {
    setProgressMap(getAllGamesProgress(userId));
  }, [userId]);

  useEffect(() => {
    refreshProgress();
    const handleProgressUpdate = () => refreshProgress();
    window.addEventListener('smitri_game_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('smitri_game_progress_updated', handleProgressUpdate);
  }, [refreshProgress]);

  // Connect Engine Pace to actual application session data from experience engine
  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((res) => {
        if (res?.experienceProfile?.averageResponseTimeSec) {
          setEnginePaceSec(res.experienceProfile.averageResponseTimeSec);
        }
      })
      .catch(() => {});
  }, []);

  const games = [
    {
      id: 'grocery-basket' as GameId,
      title: 'Grocery Basket Recall',
      desc: 'Remember items placed in your daily market basket. Stimulates short-term verbal recall and everyday grocery shopping recognition.',
      icon: ShoppingBag,
      color: 'bg-[#10B981]',
      category: 'daily',
      tag: 'Everyday Routine',
      realWorldScenario: 'Weekly Local Bazaar & Vegetable Shopping List',
      audioInstruction: 'Welcome to Grocery Basket Recall. Memorize the items in your basket, then pick them out from the market shelves. Advance sequentially through five progressive levels from 2 to 6 basket items.',
    },
    {
      id: 'clock-reading' as GameId,
      title: 'Clock Face & Timings',
      desc: 'Read gentle analog clock hands and pick the correct daily routine moment. Grounding for time orientation, prayer, and meal timings.',
      icon: Clock,
      color: 'bg-[#0B534B]',
      category: 'daily',
      tag: 'Everyday Routine',
      realWorldScenario: 'Timetable for Morning Puja, Medicine & Doctor Visits',
      audioInstruction: 'Welcome to Clock Face and Timings. Look at the clock hands and select the matching routine time. Advance through 5 sequential levels covering morning, afternoon, and evening milestones.',
    },
    {
      id: 'different-one' as GameId,
      title: 'Spot the Difference',
      desc: 'Spot the single object that looks different from the others. Enhances attention to detail and sharpens eye-for-detail.',
      icon: Eye,
      color: 'bg-[#D97706]',
      category: 'attention',
      tag: 'Focus & Attention',
      realWorldScenario: 'Spotting Expired Medicine vs Safe Medicine Labels',
      audioInstruction: 'Welcome to Spot the Difference. Look carefully at the icons and tap the one that does not match the rest. Complete all 5 sequential stages with increasing card counts and nuanced differences.',
    },
    {
      id: 'memory-match' as GameId,
      title: 'Memory Match',
      desc: 'Flip and match pairs of colorful everyday icons. Gentle exercise for short-term visual recall and object association.',
      icon: Shapes,
      color: 'bg-[#0B534B]',
      category: 'memory',
      tag: 'Visual Memory',
      realWorldScenario: 'Finding Household Items & Kitchen Utensils',
      audioInstruction: 'Welcome to Memory Match. Flip two cards to find matching pairs. Five sequential levels gradually expand the deck from 6 to 16 cards.',
    },
    {
      id: 'number-trail' as GameId,
      title: 'Number Trail',
      desc: 'Follow river stones by tapping numbers in rising order. Strengthens mental sequencing, passbook checks, and motor agility.',
      icon: Hash,
      color: 'bg-[#10B981]',
      category: 'attention',
      tag: 'Focus & Attention',
      realWorldScenario: 'Counting Currency Rupee Notes & Reading Bank Passbooks',
      audioInstruction: 'Welcome to Number Trail. Look at the numbered river stones and tap them in order starting from 1. Advance sequentially through five levels from 4 up to 12 stones.',
    },
    {
      id: 'sound-word-match' as GameId,
      title: 'Daily Word & Sound Match',
      desc: 'Listen to spoken prompts and choose the matching picture. Enhances auditory comprehension and household sound awareness.',
      icon: Volume2,
      color: 'bg-[#D97706]',
      category: 'verbal',
      tag: 'Language & Sound',
      realWorldScenario: 'Household Safety Sounds (Doorbell, Whistle, Phone Ring)',
      audioInstruction: 'Welcome to Daily Word and Sound Match. Listen to the audio cue, then select the matching picture. Five sequential levels present comforting sounds, kitchen cues, and safety tones.',
    },
    {
      id: 'sequence-memory' as GameId,
      title: 'Sequence Memory',
      desc: 'Watch the chime sequence flash and tap them back in order. Stimulates working memory and light perception.',
      icon: Brain,
      color: 'bg-[#0B534B]',
      category: 'memory',
      tag: 'Visual Memory',
      realWorldScenario: 'Remembering Appliance Buttons & Traffic Signals',
      audioInstruction: 'Welcome to Sequence Memory. Watch the chime tiles light up, then repeat the sequence in order. Five sequential stages progress from 3 steps up to 6 musical tones.',
    },
    {
      id: 'pattern-match' as GameId,
      title: 'Matrix Pattern Recall',
      desc: 'Observe illuminated squares on a grid and replicate where they were. Boosts spatial memory and room navigation.',
      icon: Grid3X3,
      color: 'bg-[#10B981]',
      category: 'memory',
      tag: 'Visual Memory',
      realWorldScenario: 'Home Room Layout & Furniture Placement Spatial Awareness',
      audioInstruction: 'Welcome to Matrix Pattern Recall. Watch the glowing squares on the grid, then tap those exact locations. Five sequential levels scale from 3 illuminated cells to 16-cell grids.',
    },
    {
      id: 'rhyme-completion' as GameId,
      title: 'Rhyme & Proverb Complete',
      desc: 'Complete classic comfort proverbs and rhymes with the missing word. Stimulates linguistic recall and conversational confidence.',
      icon: BookOpen,
      color: 'bg-[#0B534B]',
      category: 'verbal',
      tag: 'Language & Sound',
      realWorldScenario: 'Traditional Storytelling & Cultural Proverbs with Grandchildren',
      audioInstruction: 'Welcome to Rhyme and Proverb Complete. Listen to the phrase and choose the missing word. Progress through five sequential levels of folk rhymes, daily proverbs, and comforting wisdom.',
    },
  ];

  const filteredGames = selectedCategory === 'all'
    ? games
    : games.filter(g => g.category === selectedCategory);

  // ── Computed Statistics from Real Progress & Session Data ──
  const progressValues = Object.values(progressMap);

  const totalCompletedLevels = progressValues.reduce(
    (sum, p) => sum + (p.completedLevels?.length || 0), 0
  );

  const allScores: number[] = progressValues.flatMap(
    p => Object.values(p.highestScores || {})
  );
  const overallAccuracy = allScores.length > 0
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0;

  const activityDates = progressValues
    .filter(p => (p.completedLevels?.length || 0) > 0 && p.updatedAt)
    .map(p => new Date(p.updatedAt).toDateString());
  const streakDays = new Set(activityDates).size;

  const categories = [
    { id: 'all' as GameCategory, label: 'All Games', count: games.length },
    { id: 'daily' as GameCategory, label: 'Everyday Routine', icon: '🛒', count: games.filter(g => g.category === 'daily').length },
    { id: 'memory' as GameCategory, label: 'Memory & Recall', icon: '🧠', count: games.filter(g => g.category === 'memory').length },
    { id: 'attention' as GameCategory, label: 'Focus & Attention', icon: '👀', count: games.filter(g => g.category === 'attention').length },
    { id: 'verbal' as GameCategory, label: 'Language & Sound', icon: '🗣️', count: games.filter(g => g.category === 'verbal').length },
  ];

  const voiceSummary = `Welcome to the Senior Cognitive Games Dashboard. There are 9 exercises designed for everyday living, with 5 progressive levels each. Begin at Level 1 and unlock subsequent stages sequentially. Completed levels can be replayed at any time without time pressure.`;

  return (
    <div className="space-y-8 pb-36 sm:pb-44">

      {/* ─── 1. Calm Healthcare Page Header ─── */}
      <header className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              <span>Dignity-First Cognitive Health Program</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111615] tracking-tight">
              {t("games_title") || "Senior Cognitive Games"}
            </h1>
            <p className="text-[17px] sm:text-[18px] text-[#374151] font-normal leading-relaxed max-w-3xl">
              Nine evidence-based memory and focus activities tailored for everyday senior life. Progress sequentially from Level 1 through Level 5 at your own comfortable pace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0 pt-2 lg:pt-0">
            <VoiceButton
              textToRead={voiceSummary}
              buttonLabel={t("Read Instructions") || "Listen Guide"}
              className="min-h-[48px] px-5 text-base font-semibold"
            />
            <Link
              href="/dashboard"
              className="min-h-[48px] py-3 px-5 bg-[#E6F4F1] hover:bg-[#D4EFEA] text-[#0B534B] font-bold text-base rounded-xl border border-[#93CEC5] transition-colors inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2"
            >
              <span>{t("Back to Dashboard") || "Return to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. Refined Statistics Cards (Consistent Heights, Spacing & Real Data) ─── */}
      <section aria-label="Cognitive progress overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          {/* Stat 1: Consistency Streak */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Consistency Streak
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 text-[#D97706]" aria-hidden="true" />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#111615]">
                  {streakDays}
                </span>
                <span className="text-base font-bold text-[#5A6A66]">
                  {streakDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <p className="text-sm font-medium text-[#4B5563] mt-1">
                {streakDays > 0 ? `${streakDays} active practice day${streakDays === 1 ? '' : 's'}` : 'Practice daily to build streak'}
              </p>
            </div>
          </div>

          {/* Stat 2: Overall Accuracy */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Overall Accuracy
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-[#059669]" aria-hidden="true" />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#059669]">
                  {allScores.length > 0 ? `${overallAccuracy}%` : '—'}
                </span>
              </div>
              <p className="text-sm font-medium text-[#4B5563] mt-1">
                {allScores.length > 0 ? `Across ${allScores.length} completed levels` : 'Play Level 1 to start tracking'}
              </p>
            </div>
          </div>

          {/* Stat 3: Levels Completed */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Levels Completed
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#0B534B]" aria-hidden="true" />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#111615]">
                  {totalCompletedLevels}
                </span>
                <span className="text-base font-bold text-[#5A6A66]">/ 45</span>
              </div>
              <p className="text-sm font-medium text-[#4B5563] mt-1">
                {totalCompletedLevels} of 45 sequential levels mastered
              </p>
            </div>
          </div>

          {/* Stat 4: Engine Pace (Connected to application response engine) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Engine Pace
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-[#0B534B]" aria-hidden="true" />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#111615]">
                  {enginePaceSec ? `${enginePaceSec}s` : 'Calm'}
                </span>
                {enginePaceSec && (
                  <span className="text-base font-bold text-[#5A6A66]">avg</span>
                )}
              </div>
              <p className="text-sm font-medium text-[#4B5563] mt-1">
                {enginePaceSec ? 'Adaptive recall pace • Unrushed' : 'Self-paced & relaxed progression'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 3. Accessible Game Filters (Easy Touch Targets & Screen Wrapping) ─── */}
      <section aria-label="Game categories and filter options">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-base font-bold text-[#111615] flex items-center gap-1.5 mr-1 py-1">
            <Filter className="w-4 h-4 text-[#0B534B]" aria-hidden="true" />
            <span>Category:</span>
          </span>
          <div role="tablist" aria-label="Game categories" className="flex flex-wrap items-center gap-2.5">
            {categories.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`min-h-[48px] px-5 py-2.5 rounded-xl font-bold text-base transition-all border cursor-pointer inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'bg-[#0B534B] text-white border-[#08433C] shadow-xs'
                      : 'bg-white text-[#1F2937] border-[#D5DFDC] hover:bg-[#F0FDF4] hover:border-[#93CEC5]'
                  }`}
                >
                  {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F3F4F6] text-[#4B5563]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 4. Redesigned Senior-Friendly Game Cards Grid ─── */}
      <section
        id={`panel-${selectedCategory}`}
        role="tabpanel"
        aria-labelledby={`tab-${selectedCategory}`}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7"
      >
        {filteredGames.map((game) => {
          const Icon = game.icon;
          const gameProg = progressMap[game.id] || {
            gameId: game.id,
            unlockedLevel: 1,
            completedLevels: [],
          };
          const highestUnlocked = (gameProg.unlockedLevel || 1) as DifficultyLevel;
          const completedSet = new Set(gameProg.completedLevels || []);
          const isGameAllCompleted = completedSet.size >= 5;
          const progressPercent = (completedSet.size / 5) * 100;

          // Determine accurate primary action label based on real game state
          let actionLabel = `Play Level ${highestUnlocked}`;
          if (isGameAllCompleted) {
            actionLabel = 'Replay Any Level';
          } else if (completedSet.size > 0) {
            actionLabel = `Continue — Level ${highestUnlocked}`;
          }

          return (
            <article
              key={game.id}
              className="bg-white rounded-2xl border border-[#D5DFDC] hover:border-[#0B534B]/50 transition-all duration-200 flex flex-col h-full shadow-xs hover:shadow-sm"
              aria-label={`${game.title} — ${completedSet.size} of 5 levels completed`}
            >
              {/* Card Body */}
              <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">

                {/* Top: Icon + Title + Category Tag */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl ${game.color} text-white flex items-center justify-center flex-shrink-0 shadow-xs`}
                      aria-hidden="true"
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] tracking-wide">
                      {game.tag}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#111615] tracking-tight leading-snug">
                      {game.title}
                    </h2>
                  </div>

                  {/* Senior-Friendly Readable Description */}
                  <p className="text-[17px] sm:text-[18px] text-[#374151] leading-relaxed font-normal">
                    {game.desc}
                  </p>
                </div>

                {/* Middle: Progress Bar & 5 Sequential Level Indicators */}
                <div className="space-y-4 pt-2">

                  {/* Progress Header & Clean Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-base">
                      <span className="font-bold text-[#111615] flex items-center gap-1.5">
                        {isGameAllCompleted ? (
                          <span className="text-[#059669] flex items-center gap-1">
                            <Check className="w-4 h-4 stroke-[3]" /> All 5 Levels Mastered
                          </span>
                        ) : (
                          <span>Level {highestUnlocked} of 5</span>
                        )}
                      </span>
                      <span className="text-sm font-semibold text-[#4B5563]">
                        {completedSet.size}/5 completed
                      </span>
                    </div>

                    <div
                      className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={completedSet.size}
                      aria-valuemin={0}
                      aria-valuemax={5}
                      aria-label={`${game.title}: ${completedSet.size} of 5 levels completed`}
                    >
                      <div
                        className="h-full bg-[#059669] rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* 5 Distinct Level Indicators (Never Relying on Color Alone) */}
                  <div
                    className="grid grid-cols-5 gap-2 pt-1"
                    role="group"
                    aria-label={`Level progression stages for ${game.title}`}
                  >
                    {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((lvl) => {
                      const isCompleted = completedSet.has(lvl);
                      const isCurrent = lvl === highestUnlocked && !isCompleted;
                      const isLocked = lvl > highestUnlocked;

                      if (isCompleted) {
                        return (
                          <Link
                            key={lvl}
                            href={`/games/${game.id}?level=${lvl}`}
                            className="min-h-[46px] rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border-2 border-[#059669] flex flex-col items-center justify-center p-1 transition-all focus-visible:ring-2 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2"
                            aria-label={`Level ${lvl}: Completed. Click to replay.`}
                            title={`Level ${lvl} — Completed (Tap to replay)`}
                          >
                            <Check className="w-4 h-4 stroke-[3] text-[#059669]" aria-hidden="true" />
                            <span className="text-xs font-bold leading-none mt-0.5">L{lvl}</span>
                          </Link>
                        );
                      }

                      if (isCurrent) {
                        return (
                          <Link
                            key={lvl}
                            href={`/games/${game.id}?level=${lvl}`}
                            className="min-h-[46px] rounded-xl bg-[#0B534B] hover:bg-[#08433C] text-white border-2 border-[#0B534B] shadow-sm flex flex-col items-center justify-center p-1 transition-all ring-2 ring-[#0B534B]/30 ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2"
                            aria-label={`Level ${lvl}: Current active level. Click to play.`}
                            title={`Level ${lvl} — Current Active Level`}
                          >
                            <Play className="w-3.5 h-3.5 fill-white text-white" aria-hidden="true" />
                            <span className="text-xs font-black leading-none mt-0.5">L{lvl}</span>
                          </Link>
                        );
                      }

                      // Locked Level
                      return (
                        <div
                          key={lvl}
                          className="min-h-[46px] rounded-xl bg-[#F9FAFB] text-[#9CA3AF] border border-[#E5E7EB] flex flex-col items-center justify-center p-1 cursor-not-allowed select-none"
                          aria-label={`Level ${lvl}: Locked. Complete Level ${lvl - 1} first.`}
                          title={`Level ${lvl} — Locked`}
                        >
                          <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" aria-hidden="true" />
                          <span className="text-xs font-semibold leading-none mt-0.5">L{lvl}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Real-World Daily Routine Information */}
                  <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3.5 flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0 mt-0.5" aria-hidden="true">🌱</span>
                    <p className="text-sm sm:text-[15px] text-[#374151] leading-snug">
                      <strong className="text-[#065F46] font-bold">Daily Routine: </strong>
                      {game.realWorldScenario}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="p-6 sm:p-7 pt-4 space-y-3 border-t border-[#E5E7EB] bg-[#FAFCFB] rounded-b-2xl">
                <Link
                  href={`/games/${game.id}?level=${highestUnlocked}`}
                  className="w-full min-h-[52px] py-3.5 px-6 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2.5 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2"
                >
                  {isGameAllCompleted ? (
                    <>
                      <RotateCcw className="w-5 h-5 text-white" aria-hidden="true" />
                      <span>{actionLabel}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-white text-white" aria-hidden="true" />
                      <span>{actionLabel}</span>
                    </>
                  )}
                </Link>
                <VoiceButton
                  textToRead={game.audioInstruction}
                  buttonLabel="Listen Instructions"
                  className="w-full min-h-[46px] text-base font-semibold text-center justify-center"
                />
              </div>
            </article>
          );
        })}
      </section>

      {/* ─── 5. Supportive Healthcare Encouragement Footer ─── */}
      <footer className="bg-[#0B534B] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#A7F3D0]">
            <ShieldCheck className="w-4 h-4 text-[#A7F3D0]" />
            <span>Calm & Dignity-First Experience</span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            Cognitive Exercises Designed for Real Senior Life
          </p>
          <p className="text-base text-white/90 max-w-2xl leading-relaxed">
            Scores are never penalized for calm response or minor mistakes. Begin at Level 1 and advance through all five levels at your own relaxed pace.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="min-h-[50px] py-3 px-6 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white rounded-xl font-bold text-base border border-white/30 transition-colors flex items-center gap-2 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B534B]"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </footer>

      {/* ─── 6. Dedicated Clearance Buffer for Floating SOS Control ─── */}
      <div className="h-10 sm:h-14 w-full pointer-events-none" aria-hidden="true" />
    </div>
  );
}
