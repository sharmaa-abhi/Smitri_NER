"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Sparkles, 
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
  Layers,
  Lock,
  Check
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';
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
      difficulty: '5 Sequential Levels (Level 1 → 5)',
      realWorldScenario: 'Weekly Local Bazaar & Vegetable Shopping List',
      realWorldBenefit: 'Helps elderly navigate market shopping without forgetting essentials',
      lastPlayedScore: 82,
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
      difficulty: '5 Sequential Levels (Level 1 → 5)',
      realWorldScenario: 'Timetable for Morning Puja, Medicine & Doctor Visits',
      realWorldBenefit: 'Reinforces daily temporal awareness and appointment punctuality',
      lastPlayedScore: 92,
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
      difficulty: '5 Sequential Levels (Level 1 → 5)',
      realWorldScenario: 'Spotting Expired Medicine vs Safe Medicine Labels',
      realWorldBenefit: 'Prevents medication mix-ups by training visual discrimination',
      lastPlayedScore: 88,
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
      difficulty: '5 Sequential Levels (Level 1 → 5)',
      realWorldScenario: 'Finding Household Items & Kitchen Utensils',
      realWorldBenefit: 'Strengthens recall of where spectacles, keys, and cups are kept',
      lastPlayedScore: 84,
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
      difficulty: '5 Sequential Levels (Level 1 → 5)',
      realWorldScenario: 'Counting Currency Rupee Notes & Reading Bank Passbooks',
      realWorldBenefit: 'Maintains financial numeracy and sequential coordination',
      lastPlayedScore: 79,
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
      difficulty: '5 Sequential Levels (Level 1 → 5)',
      realWorldScenario: 'Household Safety Sounds (Doorbell, Whistle, Phone Ring)',
      realWorldBenefit: 'Sharpens auditory processing and environmental awareness',
      lastPlayedScore: 86,
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
      difficulty: '5 Sequential Levels (Level 1 → 5)',
      realWorldScenario: 'Remembering Appliance Buttons & Traffic Signals',
      realWorldBenefit: 'Boosts working memory capacity for multi-step home tasks',
      lastPlayedScore: 75,
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
      difficulty: '5 Sequential Levels (Level 1 → 5)',
      realWorldScenario: 'Home Room Layout & Furniture Placement Spatial Awareness',
      realWorldBenefit: 'Reduces disorientation and helps spatial stability at home',
      lastPlayedScore: 80,
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
      difficulty: '5 Sequential Levels (Level 1 → 5)',
      realWorldScenario: 'Traditional Storytelling & Cultural Proverbs with Grandchildren',
      realWorldBenefit: 'Maintains rich vocabulary and social communication joy',
      lastPlayedScore: 90,
      audioInstruction: 'Welcome to Rhyme and Proverb Complete. Listen to the phrase and choose the missing word. Progress through five sequential levels of folk rhymes, daily proverbs, and comforting wisdom.',
    },
  ];

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(g => g.category === selectedCategory);

  const voiceSummary = `Welcome to the Cognitive Games Hub. Every game features 5 sequential levels. Level 1 is unlocked to begin, and completing each level unlocks the next stage up to Level 5. Completed levels can be replayed anytime.`;

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Game Hub Description & Voice Reader */}
      <ScrollReveal direction="down">
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#D5DFDC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E6F4F1] text-[#0B534B] px-3.5 py-1 rounded-full text-xs font-bold border border-[#0B534B]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Real-World Cognitive Gaming Hub • 9 Scenarios • 5 Sequential Levels Each</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111615] tracking-tight">
              {t("games_title") || "Games Dashboard & Everyday Quests"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6A66] font-medium max-w-2xl leading-relaxed">
              Every game features 5 progressive levels. Level 1 is ready to play. Satisfying each level&apos;s objective unlocks the next stage in sequence up to Level 5.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <VoiceButton
              textToRead={voiceSummary}
              buttonLabel={t("Read Instructions") || "Read Guide"}
            />
            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-[#F6F8F7] hover:bg-[#E6F4F1] text-[#0B534B] font-bold text-xs sm:text-sm rounded-xl border border-[#D5DFDC] transition-colors"
            >
              {t("Back to Dashboard") || "Back to Dashboard"}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Sequential 5-Level Progression Guide Banner */}
      <ScrollReveal direction="up" delay={50}>
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D5DFDC] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0B534B]" />
              <h2 className="text-sm sm:text-base font-extrabold text-[#111615]">
                Sequential 5-Level Progression
              </h2>
            </div>
            <span className="text-xs text-[#5A6A66] font-semibold">
              Level 1 → Level 2 → Level 3 → Level 4 → Level 5
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { level: 1, label: 'Level 1', desc: 'Gentle start • Unlocked by default' },
              { level: 2, label: 'Level 2', desc: 'Expands upon Level 1 completion' },
              { level: 3, label: 'Level 3', desc: 'Expands upon Level 2 completion' },
              { level: 4, label: 'Level 4', desc: 'Expands upon Level 3 completion' },
              { level: 5, label: 'Level 5', desc: 'Mastery stage • Game completion' },
            ].map((stg) => (
              <div 
                key={stg.level} 
                className="bg-[#F8FAF9] border border-[#D5DFDC] rounded-2xl p-3.5 space-y-1 text-center"
              >
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase text-white bg-[#0B534B]">
                  {stg.label}
                </div>
                <p className="text-[11px] text-[#5A6A66] font-medium leading-snug pt-1">
                  {stg.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Real-World Game Analytics Bar */}
      <ScrollReveal direction="up" delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#042420] to-[#0B534B] text-white p-5 rounded-2xl shadow-md border border-[#0B534B] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">Consistency Streak</span>
              <div className="text-3xl font-black">7 Days 🔥</div>
              <p className="text-[11px] text-[#E6F4F1]/90">Played daily without missing</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center font-bold text-xl">
              🎯
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D5DFDC] shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A6A66]">Overall Accuracy</span>
              <div className="text-3xl font-black text-[#10B981]">88%</div>
              <p className="text-[11px] text-[#5A6A66]">Across all 9 real-life games</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#047857] border border-[#10B981]/30 flex items-center justify-center font-bold text-lg">
              ✓
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D5DFDC] shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A6A66]">Levels Available</span>
              <div className="text-2xl font-black text-[#111615]">45 Levels</div>
              <p className="text-[11px] text-[#0B534B] font-semibold">5 Sequential per game</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] text-[#0B534B] border border-[#0B534B]/20 flex items-center justify-center font-bold text-lg">
              ⚡
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D5DFDC] shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A6A66]">Adaptive Engine</span>
              <div className="text-2xl font-black text-[#D97706]">Active</div>
              <p className="text-[11px] text-[#5A6A66]">Sequential level unlock</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] text-[#B45309] border border-[#D97706]/30 flex items-center justify-center font-bold text-lg">
              ★
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#5A6A66] flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5 text-[#0B534B]" /> Filter By Scenario:
        </span>
        {[
          { id: 'all', label: 'All 9 Games' },
          { id: 'daily', label: '🛒 Everyday Routine & Bazaar' },
          { id: 'memory', label: '🧠 Visual & Spatial Recall' },
          { id: 'attention', label: '👀 Focus & Detail Discrimination' },
          { id: 'verbal', label: '🗣️ Language, Sounds & Proverbs' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id as GameCategory)}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
              selectedCategory === tab.id
                ? 'bg-[#0B534B] text-white border-[#08433C] shadow-sm'
                : 'bg-white text-[#5A6A66] border-[#D5DFDC] hover:bg-[#F6F8F7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, idx) => {
          const Icon = game.icon;
          const gameProg = progressMap[game.id] || {
            gameId: game.id,
            unlockedLevel: 1,
            completedLevels: [],
          };
          const highestUnlocked = (gameProg.unlockedLevel || 1) as DifficultyLevel;
          const completedSet = new Set(gameProg.completedLevels || []);
          const isGameAllCompleted = completedSet.size >= 5;

          return (
            <ScrollReveal
              key={game.id}
              direction="up"
              delay={idx * 40}
              className="h-full"
            >
              <div className="bg-white rounded-3xl p-6 border border-[#D5DFDC] shadow-sm hover:border-[#0B534B] hover:shadow-md transition-all flex flex-col justify-between space-y-5 h-full relative group">
                
                <div className="space-y-3.5">
                  {/* Top Bar: Icon + Category Tag + Progress Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${game.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#F6F8F7] text-[#5A6A66] px-2.5 py-1 rounded-full border border-[#D5DFDC]">
                        {game.tag}
                      </span>
                      <span className="text-xs font-black text-[#0B534B] bg-[#E6F4F1] border border-[#0B534B]/20 px-2 py-0.5 rounded-md">
                        {isGameAllCompleted ? '5/5 Mastered 🏆' : `Level ${highestUnlocked}/5`}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-extrabold text-[#111615] group-hover:text-[#0B534B] transition-colors">
                      {game.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5A6A66] font-medium leading-relaxed">
                      {game.desc}
                    </p>
                  </div>

                  {/* 5-Level Sequential Progress Chips */}
                  <div className="bg-[#FAFCFB] rounded-2xl p-3 border border-[#D5DFDC] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0B534B] flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#D97706]" /> 5 Progressive Levels:
                      </span>
                      <span className="text-[10px] text-[#5A6A66] font-bold">
                        {completedSet.size} of 5 Completed
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((lvl) => {
                        const isUnlocked = lvl <= highestUnlocked;
                        const isCompleted = completedSet.has(lvl);

                        if (isCompleted) {
                          return (
                            <Link
                              key={lvl}
                              href={`/games/${game.id}?level=${lvl}`}
                              className="py-1 px-1 bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#10B981] rounded-xl text-center transition-all flex flex-col items-center justify-center gap-0.5"
                              title={`Level ${lvl} Completed (Replayable)`}
                            >
                              <span className="text-[10px] font-black text-[#065F46] flex items-center gap-0.5">
                                L{lvl} <Check className="w-2.5 h-2.5 text-[#059669]" />
                              </span>
                            </Link>
                          );
                        }

                        if (isUnlocked) {
                          return (
                            <Link
                              key={lvl}
                              href={`/games/${game.id}?level=${lvl}`}
                              className="py-1 px-1 bg-[#E6F4F1] hover:bg-[#C2E5DF] border border-[#0B534B] rounded-xl text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm"
                              title={`Level ${lvl} Unlocked (Play)`}
                            >
                              <span className="text-[10px] font-black text-[#0B534B] flex items-center gap-0.5">
                                L{lvl} <Play className="w-2.5 h-2.5 fill-[#0B534B]" />
                              </span>
                            </Link>
                          );
                        }

                        return (
                          <div
                            key={lvl}
                            className="py-1 px-1 bg-[#F3F5F4] border border-[#E5E9E8] rounded-xl text-center flex flex-col items-center justify-center gap-0.5 opacity-60 cursor-not-allowed"
                            title={`Level ${lvl} Locked (Complete Level ${lvl - 1} first)`}
                          >
                            <span className="text-[10px] font-bold text-[#9CA3AF] flex items-center gap-0.5">
                              L{lvl} <Lock className="w-2.5 h-2.5 text-[#9CA3AF]" />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Real-World Scenario Box */}
                  <div className="bg-[#F6F8F7] rounded-2xl p-3 border border-[#D5DFDC] space-y-1">
                    <div className="flex items-start gap-1.5 text-xs font-bold text-[#111615]">
                      <span className="text-[#D97706] flex-shrink-0">🌟</span>
                      <span>Everyday Routine:</span>
                    </div>
                    <p className="text-xs text-[#5A6A66] font-semibold pl-5">
                      {game.realWorldScenario}
                    </p>
                  </div>
                </div>

                {/* Actions: Audio Guide + Start Button */}
                <div className="space-y-2.5 pt-2 border-t border-[#D5DFDC]/60">
                  <VoiceButton
                    textToRead={game.audioInstruction}
                    buttonLabel="Listen Instructions"
                    className="w-full text-center justify-center"
                  />

                  <Link
                    href={`/games/${game.id}?level=${highestUnlocked}`}
                    className="w-full py-3.5 px-5 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-extrabold text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>
                      {isGameAllCompleted 
                        ? 'Replay Levels (All Mastered 🏆)' 
                        : `Play Level ${highestUnlocked}`}
                    </span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Senior Encouragement & Safety Note Footer */}
      <ScrollReveal direction="up" delay={150}>
        <div className="bg-gradient-to-r from-[#042420] to-[#0B534B] text-white rounded-3xl p-6 sm:p-7 border border-[#0B534B]/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-[#F59E0B] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Dignity & Calm-First Design</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">
              Cognitive Exercises Designed for Real Senior Life
            </h3>
            <p className="text-xs sm:text-sm text-[#E6F4F1]/90 max-w-2xl leading-relaxed">
              Scores are never penalized for slow response or errors. Players begin at Level 1 and advance through all five levels at their own relaxed pace.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>Return to Daily Routine</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
