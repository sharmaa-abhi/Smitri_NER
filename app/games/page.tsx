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
  Zap,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Check,
  Flame,
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { useLanguage } from '@/lib/i18n';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';
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

  const refreshProgress = useCallback(() => {
    setProgressMap(getAllGamesProgress(userId));
  }, [userId]);

  useEffect(() => {
    refreshProgress();
    const handleProgressUpdate = () => refreshProgress();
    window.addEventListener('smitri_game_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('smitri_game_progress_updated', handleProgressUpdate);
  }, [refreshProgress]);

  const games = [
    {
      id: 'grocery-basket' as GameId,
      title: 'Grocery Basket Recall',
      desc: 'Remember items placed in your daily market basket. Stimulates short-term verbal recall and everyday grocery shopping recognition.',
      icon: ShoppingBag,
      color: 'bg-[#10B981]',
      category: 'daily',
      tag: 'Everyday Market Recall',
      realWorldScenario: 'Weekly Local Bazaar & Vegetable Shopping List',
      audioInstruction: 'Welcome to Grocery Basket Recall. Memorize the items in your basket, then pick them out from the market shelves. Advance sequentially through five progressive levels from 2 to 6 basket items.',
    },
    {
      id: 'clock-reading' as GameId,
      title: 'Clock Face Match',
      desc: 'Read gentle analog clock hands and pick the correct daily routine moment. Grounding for time orientation, prayer, and meal timings.',
      icon: Clock,
      color: 'bg-[#0B534B]',
      category: 'daily',
      tag: 'Daily Routine & Time',
      realWorldScenario: 'Timetable for Morning Puja, Medicine & Doctor Visits',
      audioInstruction: 'Welcome to Clock Face Match. Look at the clock hands and select the matching routine time. Advance through 5 sequential levels covering morning, afternoon, and evening milestones.',
    },
    {
      id: 'different-one' as GameId,
      title: 'Find the Different One',
      desc: 'Spot the single object that looks different from the others. Enhances attention to detail and sharpens eye-for-detail.',
      icon: Eye,
      color: 'bg-[#D97706]',
      category: 'attention',
      tag: 'Visual Attention',
      realWorldScenario: 'Spotting Expired Medicine vs Safe Medicine Labels',
      audioInstruction: 'Welcome to Find the Different One. Look carefully at the icons and tap the one that does not match the rest. Complete all 5 sequential stages with increasing card counts and nuanced differences.',
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
      tag: 'Numerical Order',
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
      tag: 'Auditory & Semantic',
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
      tag: 'Pattern Recall',
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
      tag: 'Spatial Memory',
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
      tag: 'Verbal Fluency',
      realWorldScenario: 'Traditional Storytelling & Cultural Proverbs with Grandchildren',
      audioInstruction: 'Welcome to Rhyme and Proverb Complete. Listen to the phrase and choose the missing word. Progress through five sequential levels of folk rhymes, daily proverbs, and comforting wisdom.',
    },
  ];

  const filteredGames = selectedCategory === 'all'
    ? games
    : games.filter(g => g.category === selectedCategory);

  // ── Computed Statistics from Real Progress Data ──
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

  const maxUnlockedLevel = progressValues.length > 0
    ? Math.max(...progressValues.map(p => p.unlockedLevel || 1))
    : 1;

  const categories = [
    { id: 'all' as GameCategory, label: 'All Games' },
    { id: 'daily' as GameCategory, label: '🛒 Everyday Routine' },
    { id: 'memory' as GameCategory, label: '🧠 Memory & Recall' },
    { id: 'attention' as GameCategory, label: '👀 Focus & Attention' },
    { id: 'verbal' as GameCategory, label: '🗣️ Language & Sound' },
  ];

  const voiceSummary = `Welcome to the Cognitive Games Hub. There are 9 games, each with 5 sequential levels. Level 1 is unlocked to begin. Completing each level unlocks the next stage up to Level 5. Completed levels can be replayed anytime.`;

  return (
    <div className="space-y-6 pb-28">

      {/* ─── Page Header ─── */}
      <header className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111615] tracking-tight">
              {t("games_title") || "Games Dashboard"}
            </h1>
            <p className="text-base sm:text-lg text-[#5A6A66] font-medium leading-relaxed max-w-2xl">
              9 cognitive exercises with 5 progressive levels each. Complete each level to unlock the next.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <VoiceButton
              textToRead={voiceSummary}
              buttonLabel={t("Read Instructions") || "Read Guide"}
            />
            <Link
              href="/dashboard"
              className="min-h-[44px] py-2.5 px-5 bg-[#E6F4F1] hover:bg-[#C2E5DF] text-[#0B534B] font-bold text-sm sm:text-base rounded-xl border border-[#93CEC5] transition-colors inline-flex items-center"
            >
              {t("Back to Dashboard") || "Back to Dashboard"}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Statistics Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Your game statistics">

        {/* Stat 1: Consistency Streak */}
        <div className="bg-[#0B534B] text-white rounded-2xl p-5 flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#A7F3D0] uppercase tracking-wider">Consistency</span>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#FCD34D]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black">{streakDays}</span>
              <span className="text-base font-bold text-white/80">Days</span>
            </div>
            <p className="text-sm text-white/70 mt-0.5">Days with game activity</p>
          </div>
        </div>

        {/* Stat 2: Overall Accuracy */}
        <div className="bg-white rounded-2xl p-5 border border-[#D5DFDC] flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#5A6A66] uppercase tracking-wider">Accuracy</span>
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#065F46] border border-[#10B981]/30 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#10B981]">
                {allScores.length > 0 ? `${overallAccuracy}%` : '—'}
              </span>
            </div>
            <p className="text-sm text-[#5A6A66] mt-0.5">
              {allScores.length > 0 ? `Across ${allScores.length} completed levels` : 'Play to see your score'}
            </p>
          </div>
        </div>

        {/* Stat 3: Levels Completed */}
        <div className="bg-white rounded-2xl p-5 border border-[#D5DFDC] flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#5A6A66] uppercase tracking-wider">Levels Done</span>
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0B534B] border border-[#0B534B]/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#111615]">{totalCompletedLevels}</span>
              <span className="text-base font-bold text-[#5A6A66]">/ 45</span>
            </div>
            <p className="text-sm text-[#5A6A66] mt-0.5">Total levels completed</p>
          </div>
        </div>

        {/* Stat 4: Highest Level Reached */}
        <div className="bg-white rounded-2xl p-5 border border-[#D5DFDC] flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#5A6A66] uppercase tracking-wider">Highest Level</span>
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#D97706]/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#D97706]">Level {maxUnlockedLevel}</span>
            </div>
            <p className="text-sm text-[#5A6A66] mt-0.5">Highest level reached in any game</p>
          </div>
        </div>
      </div>

      {/* ─── Category Filters ─── */}
      <nav aria-label="Game category filters" className="flex flex-wrap items-center gap-2.5">
        <span className="text-sm sm:text-base font-bold text-[#5A6A66] flex items-center gap-1.5 mr-1">
          <Filter className="w-4 h-4 text-[#0B534B]" />
          <span>Filter:</span>
        </span>
        {categories.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            aria-pressed={selectedCategory === tab.id}
            className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-colors border cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-[#0B534B] text-white border-[#08433C]'
                : 'bg-white text-[#5A6A66] border-[#D5DFDC] hover:bg-[#F6F8F7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ─── Game Cards Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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

          // Determine primary action label
          let actionLabel = `Play Level ${highestUnlocked}`;
          if (isGameAllCompleted) {
            actionLabel = 'Replay (All Mastered)';
          } else if (completedSet.size > 0 && !completedSet.has(highestUnlocked as DifficultyLevel)) {
            actionLabel = `Continue — Level ${highestUnlocked}`;
          }

          return (
            <article
              key={game.id}
              className="bg-white rounded-2xl border border-[#D5DFDC] hover:border-[#0B534B]/40 transition-colors flex flex-col h-full group"
              aria-label={`${game.title} — ${completedSet.size} of 5 levels completed`}
            >
              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-4 flex-1">

                {/* Icon + Title + Category */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-xl ${game.color} text-white flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#111615] leading-tight group-hover:text-[#0B534B] transition-colors">
                      {game.title}
                    </h2>
                    <span className="text-sm font-semibold text-[#5A6A66] mt-0.5 block">
                      {game.tag}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-base text-[#5A6A66] leading-relaxed">
                  {game.desc}
                </p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#111615]">
                      {isGameAllCompleted
                        ? '✓ All Levels Mastered'
                        : `Level ${highestUnlocked} of 5`}
                    </span>
                    <span className="text-sm font-semibold text-[#5A6A66]">
                      {completedSet.size}/5 completed
                    </span>
                  </div>
                  <div
                    className="w-full h-2.5 bg-[#EBF0EE] rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={completedSet.size}
                    aria-valuemin={0}
                    aria-valuemax={5}
                    aria-label={`${completedSet.size} of 5 levels completed`}
                  >
                    <div
                      className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Level Step Indicators */}
                <div
                  className="flex items-center"
                  role="group"
                  aria-label={`Level progress for ${game.title}`}
                >
                  {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((lvl) => {
                    const isCompleted = completedSet.has(lvl);
                    const isUnlocked = lvl <= highestUnlocked;

                    return (
                      <div key={lvl} className="flex items-center flex-1 last:flex-initial">
                        {isCompleted ? (
                          <Link
                            href={`/games/${game.id}?level=${lvl}`}
                            className="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#059669] transition-colors"
                            aria-label={`Level ${lvl} completed — tap to replay`}
                            title={`Level ${lvl} — Completed (Replay)`}
                          >
                            <Check className="w-4 h-4" aria-hidden="true" />
                          </Link>
                        ) : isUnlocked ? (
                          <Link
                            href={`/games/${game.id}?level=${lvl}`}
                            className="w-9 h-9 rounded-full bg-[#0B534B] text-white flex items-center justify-center flex-shrink-0 ring-2 ring-[#0B534B]/20 ring-offset-2 hover:bg-[#08433C] transition-colors"
                            aria-label={`Level ${lvl} — available, tap to play`}
                            title={`Level ${lvl} — Play`}
                          >
                            <span className="text-sm font-bold" aria-hidden="true">{lvl}</span>
                          </Link>
                        ) : (
                          <div
                            className="w-9 h-9 rounded-full bg-[#F6F8F7] border border-[#D5DFDC] text-[#B2C2BD] flex items-center justify-center flex-shrink-0"
                            aria-label={`Level ${lvl} — locked, complete Level ${lvl - 1} first`}
                            title={`Level ${lvl} — Locked`}
                          >
                            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                          </div>
                        )}
                        {lvl < 5 && (
                          <div
                            className={`flex-1 h-0.5 mx-1 rounded-full ${
                              isCompleted ? 'bg-[#10B981]' : 'bg-[#D5DFDC]'
                            }`}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Real-World Scenario */}
                <div className="flex items-start gap-2 text-sm sm:text-base text-[#5A6A66]">
                  <span className="text-[#D97706] flex-shrink-0 mt-0.5" aria-hidden="true">🌟</span>
                  <span>
                    <span className="font-semibold text-[#111615]">Daily routine: </span>
                    {game.realWorldScenario}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-5 sm:p-6 pt-4 space-y-3 border-t border-[#D5DFDC]/60">
                <Link
                  href={`/games/${game.id}?level=${highestUnlocked}`}
                  className="w-full min-h-[48px] py-3 px-5 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-colors"
                >
                  <Play className="w-5 h-5 fill-white" aria-hidden="true" />
                  <span>{actionLabel}</span>
                </Link>
                <VoiceButton
                  textToRead={game.audioInstruction}
                  buttonLabel="Listen Instructions"
                  className="w-full text-center justify-center"
                />
              </div>
            </article>
          );
        })}
      </div>

      {/* ─── Footer Encouragement ─── */}
      <footer className="bg-[#0B534B] text-white rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#A7F3D0]">
            <ShieldCheck className="w-4 h-4" />
            <span>Dignity & Calm-First Design</span>
          </div>
          <p className="text-lg sm:text-xl font-bold">
            Cognitive Exercises Designed for Real Senior Life
          </p>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            Scores are never penalized for slow response or errors. Begin at Level 1 and advance through all five levels at your own relaxed pace.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="min-h-[48px] py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-base border border-white/20 transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
}
