"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Brain,
  Eye,
  ShoppingBag,
  Grid3X3,
  Volume2,
  Clock,
  BookOpen,
  Award,
  ArrowRight,
  Check,
  Lock,
  Sparkles,
  X,
  Coffee,
  HelpCircle,
  Music,
  MapPin,
  RotateCcw,
  VolumeX,
  Maximize2,
  CheckCircle2,
  Flame,
  Search,
  Trophy,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  ChevronRight,
  Heart,
  CalendarCheck,
  Coins,
  Palette
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { useLanguage } from '@/lib/i18n';
import {
  getAllGamesProgress,
  getGameProgress,
  isLevelUnlocked,
  isLevelCompleted,
  getHighestUnlockedLevel,
  completeLevel,
  AllGamesProgress,
  GameProgress
} from '@/lib/gameProgress';
import { DifficultyLevel, GameId, FinishGameStats } from '@/types/games';
import { useAuth } from '@/lib/auth';
import { playChime, stopVoicePrompt } from '@/lib/audioPrompts';
import { isGameAudioEnabled, setGameAudioEnabled } from '@/lib/gameAudio';
import { saveGameResultOffline } from '@/lib/offlineStorage';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import {
  MemoryMatchArena,
  SequenceMemoryArena,
  DifferentOneArena,
  GroceryBasketArena,
  NumberTrailArena,
  MatrixPatternArena,
  SoundWordMatchArena,
  ClockReadingArena,
  RhymeCompletionArena,
  RoutineTimelineArena,
  CurrencyCalcArena,
  ColorStroopArena,
} from '@/components/games';

export type GameCategoryFilter = 'all' | 'memory' | 'focus' | 'sound' | 'daily';

export interface SeniorGameDefinition {
  id: GameId;
  title: string;
  subtitle: string;
  domain: string;
  category: 'memory' | 'focus' | 'sound' | 'daily';
  categoryBadge: string;
  tag: string;
  description: string;
  culturalNote: string;
  icon: any;
  accentColor: string;
  bgLight: string;
  borderLight: string;
  instruction: string;
  hintVoice: string;
}

export const ALL_9_GAMES: SeniorGameDefinition[] = [
  {
    id: 'grocery-basket',
    title: 'Grocery Basket Recall',
    subtitle: 'Local Bazaar Market Memory',
    domain: 'Short-term & Episodic Recall',
    category: 'daily',
    categoryBadge: 'EPISODIC RECALL',
    tag: 'Everyday Market',
    description: 'Practice remembering familiar staples from the Indian local bazaar. Helps sustain daily independence and confidence.',
    culturalNote: 'Fresh Alphonso mangoes, cardamom spices, and morning milk',
    icon: ShoppingBag,
    accentColor: '#059669',
    bgLight: '#ECFDF5',
    borderLight: '#A7F3D0',
    instruction: 'Memorize the items in your grocery basket while the timer counts down. Then tap those same items on the market shelf.',
    hintVoice: 'Remember the morning bazaar list: sweet fruits, aromatic spices, and fresh morning dairy.',
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    subtitle: 'Card Pair Matching',
    domain: 'Visual Retention & Association',
    category: 'memory',
    categoryBadge: 'VISUAL MEMORY',
    tag: 'Visual Pairs',
    description: 'Flip two cards to discover matching pairs of clay lamps, flowers, tea cups, and everyday symbols.',
    culturalNote: 'Cherished memories and comforting family album symbols',
    icon: Brain,
    accentColor: '#0B534B',
    bgLight: '#E6F4F1',
    borderLight: '#93CEC5',
    instruction: 'Tap two cards to flip them over. If the symbols match, they stay open. Find all matching pairs.',
    hintVoice: 'Notice the position of each card you turn over to recall its partner.',
  },
  {
    id: 'sequence-memory',
    title: 'Sequence Memory',
    subtitle: 'Rhythmic Chime Lights',
    domain: 'Working Memory & Attention',
    category: 'focus',
    categoryBadge: 'AUDITORY & VISUAL',
    tag: 'Chime Melodies',
    description: 'Watch colorful musical chime tiles illuminate, then gently tap them back in the exact harmonic rhythm.',
    culturalNote: 'Evening temple bells and classical rhythm cadences',
    icon: Music,
    accentColor: '#7C3AED',
    bgLight: '#F5F3FF',
    borderLight: '#DDD6FE',
    instruction: 'Watch carefully as the colored chime tiles illuminate. Once finished, tap the tiles in the exact same sequence.',
    hintVoice: 'Listen to the sequence of harmonious chimes and follow the gentle rhythm with your finger.',
  },
  {
    id: 'different-one',
    title: 'Spot the Difference',
    subtitle: 'Odd-One-Out Discovery',
    domain: 'Visual Attention & Executive Function',
    category: 'focus',
    categoryBadge: 'VISUAL FOCUS',
    tag: 'Odd-One-Out',
    description: 'Scan across peaceful everyday items and find the single unique symbol that stands out from all the others.',
    culturalNote: 'Cultivating calm discernment across daily objects',
    icon: Eye,
    accentColor: '#2563EB',
    bgLight: '#EFF6FF',
    borderLight: '#BFDBFE',
    instruction: 'Look at the group of symbols. One of them is different from all the others. Tap the different symbol.',
    hintVoice: 'Scan each row calmly. One item has a different shape or purpose.',
  },
  {
    id: 'number-trail',
    title: 'Number Trail',
    subtitle: 'Lotus Pond Stepping Stones',
    domain: 'Processing Speed & Coordination',
    category: 'focus',
    categoryBadge: 'MOTOR & FOCUS',
    tag: 'Gentle Coordination',
    description: 'Follow numbered river stones in rising order across the lotus pond. Calms hand tremors and trains motor speed.',
    culturalNote: 'Peaceful morning garden stroll with stepping stones',
    icon: MapPin,
    accentColor: '#0D9488',
    bgLight: '#F0FDFA',
    borderLight: '#99F6E4',
    instruction: 'Follow the numbered river stones in rising order. Start by tapping number 1, then 2, and so on.',
    hintVoice: 'Find stone number 1 first, then gently touch number 2, followed by the next ascending stone.',
  },
  {
    id: 'pattern-match',
    title: 'Matrix Pattern Recall',
    subtitle: 'Glowing Tile Grid',
    domain: 'Visuospatial Working Memory',
    category: 'memory',
    categoryBadge: 'SPATIAL GRID',
    tag: 'Spatial Focus',
    description: 'Memorize the glowing warm squares on the grid before they softly fade, then tap each square that lit up.',
    culturalNote: 'Warm evening lantern patterns on courtyard tiles',
    icon: Grid3X3,
    accentColor: '#D97706',
    bgLight: '#FFFBEB',
    borderLight: '#FDE68A',
    instruction: 'Memorize the glowing squares on the grid before they fade. Then tap each square that lit up.',
    hintVoice: 'Form a mental picture of the illuminated squares before tapping them.',
  },
  {
    id: 'sound-word-match',
    title: 'Word & Sound Match',
    subtitle: 'Cultural Audio Recall',
    domain: 'Auditory Association & Recall',
    category: 'sound',
    categoryBadge: 'AUDITORY MEMORY',
    tag: 'Gentle Audio',
    description: 'Listen to soothing ambient sounds like morning temple bells, steam whistles, and rain, then pick the matching picture.',
    culturalNote: 'Cherished morning sounds: temple bells, kettle whistles, rain',
    icon: Volume2,
    accentColor: '#C026D3',
    bgLight: '#FDF4FF',
    borderLight: '#F5D0FE',
    instruction: 'Listen to the spoken audio cue or tap the speaker button, then choose the picture that matches the description.',
    hintVoice: 'Listen closely to the audio cue and tap the picture that matches.',
  },
  {
    id: 'clock-reading',
    title: 'Clock Face & Timings',
    subtitle: 'Daily Routine Orientation',
    domain: 'Visuospatial Orientation',
    category: 'daily',
    categoryBadge: 'TIME ORIENTATION',
    tag: 'Routine Timings',
    description: 'Read traditional analog clock hands showing daily prayer, medicine, and tea times to keep time-of-day awareness sharp.',
    culturalNote: 'Preserving the natural rhythms of morning prayer and afternoon tea',
    icon: Clock,
    accentColor: '#EA580C',
    bgLight: '#FFF7ED',
    borderLight: '#FED7AA',
    instruction: 'Look at the analog clock hands representing a familiar daily moment, and select the matching digital time.',
    hintVoice: 'Look at the short hour hand first, then check where the minute hand points.',
  },
  {
    id: 'rhyme-completion',
    title: 'Rhyme & Proverb Complete',
    subtitle: 'Timeless Wisdom & Sayings',
    domain: 'Linguistic Fluency & Memory',
    category: 'sound',
    categoryBadge: 'LANGUAGE FLUENCY',
    tag: 'Classic Proverbs',
    description: 'Listen to timeless folk sayings and proverbs, then choose the missing rhyming word that completes the rhythm.',
    culturalNote: 'Comforting childhood sayings and traditional wisdom verses',
    icon: BookOpen,
    accentColor: '#4F46E5',
    bgLight: '#EEF2FF',
    borderLight: '#C7D2FE',
    instruction: 'Listen to the classic phrase or proverb, and tap the missing word that completes the rhythm.',
    hintVoice: 'Recite the rhythmic phrase in your mind to hear the word that rhymes.',
  },
  {
    id: 'routine-timeline',
    title: 'Daily Routine Timeline',
    subtitle: 'Daily Rhythms & Sequencing',
    domain: 'Chronological & Executive Sequencing',
    category: 'daily',
    categoryBadge: 'ROUTINE TIMINGS',
    tag: 'Daily Milestones',
    description: 'Arrange familiar daily activities like morning puja, tea, medication, and evening walks into their natural chronological order.',
    culturalNote: 'Preserving cherished daily rituals: morning tea, medication, and family gatherings',
    icon: CalendarCheck,
    accentColor: '#059669',
    bgLight: '#ECFDF5',
    borderLight: '#A7F3D0',
    instruction: 'Arrange familiar daily activities from morning to evening in the correct sequential order.',
    hintVoice: 'Start with morning habits like chai or puja, followed by lunch and evening strolls.',
  },
  {
    id: 'currency-calc',
    title: 'Rupee Tally & Market Math',
    subtitle: 'Everyday Bazaar Transactions',
    domain: 'Numerical Cognition & Daily Math',
    category: 'daily',
    categoryBadge: 'FINANCIAL COGNITION',
    tag: 'Market Rupee Tally',
    description: 'Calculate and match exact rupee notes and coins to buy fresh produce, ghee, milk, and household goods at the local bazaar.',
    culturalNote: 'Familiar Indian currency coins and notes for everyday independence',
    icon: Coins,
    accentColor: '#D97706',
    bgLight: '#FFFBEB',
    borderLight: '#FDE68A',
    instruction: 'Select rupee coins and notes to make the exact target amount for your market shopping.',
    hintVoice: 'Tap the larger notes first, then add smaller coins to reach the exact amount.',
  },
  {
    id: 'color-stroop',
    title: 'Color & Word Reflex',
    subtitle: 'Visual Attention & Reflex',
    domain: 'Inhibitory Control & Executive Function',
    category: 'focus',
    categoryBadge: 'STROOP REFLEX',
    tag: 'Mental Flexibility',
    description: 'Test your brain reflex by naming the ink color of the word rather than reading the word itself. Keeps mental agility vibrant.',
    culturalNote: 'Playful color discernment to sharpen focus and cognitive flexibility',
    icon: Palette,
    accentColor: '#7C3AED',
    bgLight: '#F5F3FF',
    borderLight: '#DDD6FE',
    instruction: 'Pay close attention to the INK color of the word shown, not what the word reads. Tap the matching color.',
    hintVoice: 'Focus on the color you see, ignore what the letters spell out.',
  },
];

export const ALL_GAMES = ALL_9_GAMES;

const ALL_LEVELS: DifficultyLevel[] = [1, 2, 3, 4, 5];

interface InPageCompletionData {
  gameId: GameId;
  completedLevel: DifficultyLevel;
  accuracy: number;
  responseTimeSec: number;
  mistakes: number;
  isGameFullyCompleted: boolean;
  nextLevel: DifficultyLevel | null;
}

interface ScreenChoiceModalData {
  game: SeniorGameDefinition;
  level: DifficultyLevel;
}

export default function GamesHubPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const seniorName = user?.name || 'Harishji';
  const userId = user?.id || 'guest';

  // State management
  const [selectedCategory, setSelectedCategory] = useState<GameCategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Right screen is automatically active by default
  const [activeGameId, setActiveGameId] = useState<GameId>('grocery-basket');
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel>(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  
  // Screen choice prompt modal state
  const [screenChoiceModal, setScreenChoiceModal] = useState<ScreenChoiceModalData | null>(null);

  const [gameKey, setGameKey] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [completionData, setCompletionData] = useState<InPageCompletionData | null>(null);
  const [streakDays, setStreakDays] = useState<number>(6);
  const [progressMap, setProgressMap] = useState<AllGamesProgress>({});
  const [mounted, setMounted] = useState<boolean>(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync Progress across all games
  const refreshProgress = useCallback(() => {
    setProgressMap(getAllGamesProgress(userId));
  }, [userId]);

  useEffect(() => {
    refreshProgress();
    const handleProgressUpdate = () => refreshProgress();
    window.addEventListener('smitri_game_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('smitri_game_progress_updated', handleProgressUpdate);
  }, [refreshProgress]);

  // Audio system sync
  useEffect(() => {
    setAudioEnabled(isGameAudioEnabled());
    const handleAudioChange = (e: any) => {
      if (e?.detail?.enabled !== undefined) setAudioEnabled(e.detail.enabled);
    };
    window.addEventListener('smitri_game_audio_changed', handleAudioChange);
    return () => window.removeEventListener('smitri_game_audio_changed', handleAudioChange);
  }, []);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    setGameAudioEnabled(next);
  };

  // Timer for active in-page arena
  useEffect(() => {
    if (gameFinished || !isDrawerOpen) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, gameFinished, isDrawerOpen]);

  // Calculate overall mastery metrics across all 12 games (60 total levels)
  const masteryStats = useMemo(() => {
    if (!mounted) {
      return { totalCompleted: 0, totalPossible: ALL_GAMES.length * 5, percentage: 0 };
    }
    let totalCompleted = 0;
    ALL_GAMES.forEach((g) => {
      const prog = progressMap[g.id];
      if (prog?.completedLevels) {
        totalCompleted += prog.completedLevels.length;
      }
    });
    const totalPossible = ALL_GAMES.length * 5; // 60
    const percentage = Math.round((totalCompleted / totalPossible) * 100);
    return { totalCompleted, totalPossible, percentage };
  }, [progressMap, mounted]);

  // Safe SSR level check helpers
  const getIsLevelUnlocked = useCallback((gameId: GameId, level: DifficultyLevel) => {
    if (!mounted) return level === 1;
    return isLevelUnlocked(gameId, level, userId);
  }, [mounted, userId]);

  const getIsLevelCompleted = useCallback((gameId: GameId, level: DifficultyLevel) => {
    if (!mounted) return false;
    return isLevelCompleted(gameId, level, userId);
  }, [mounted, userId]);

  // Active game metadata
  const activeGame = useMemo(() => {
    return ALL_9_GAMES.find((g) => g.id === activeGameId) || ALL_9_GAMES[0];
  }, [activeGameId]);

  // Ensure active difficulty is unlocked
  useEffect(() => {
    const highest = getHighestUnlockedLevel(activeGameId, userId);
    if (!isLevelUnlocked(activeGameId, activeDifficulty, userId)) {
      setActiveDifficulty(highest);
    }
  }, [activeGameId, userId, activeDifficulty]);

  // Switch active game in the right drawer/panel (Right Screen Play)
  const handleSelectGameForPanel = (game: SeniorGameDefinition, targetLevel?: DifficultyLevel) => {
    playChime('start');
    setActiveGameId(game.id);
    setIsDrawerOpen(true);
    setGameFinished(false);
    setCompletionData(null);
    setStartTime(Date.now());
    setElapsedTime(0);

    const highest = getHighestUnlockedLevel(game.id, userId);
    const chosenLevel = targetLevel && isLevelUnlocked(game.id, targetLevel, userId) ? targetLevel : highest;
    setActiveDifficulty(chosenLevel);
    setGameKey((prev) => prev + 1);

    // Smooth scroll into view if on mobile/smaller screens
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        drawerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Triggered when user initiates a game: asks Right Screen vs Full Screen
  const handleStartGamePrompt = (game: SeniorGameDefinition, targetLevel?: DifficultyLevel) => {
    playChime('start');
    const highest = getHighestUnlockedLevel(game.id, userId);
    const chosenLevel = targetLevel && isLevelUnlocked(game.id, targetLevel, userId) ? targetLevel : highest;
    setScreenChoiceModal({ game, level: chosenLevel });
  };

  // Switch level in the active drawer
  const handleSelectDifficulty = (level: DifficultyLevel) => {
    if (!isLevelUnlocked(activeGameId, level, userId)) return;
    playChime('start');
    setActiveDifficulty(level);
    setGameFinished(false);
    setCompletionData(null);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameKey((prev) => prev + 1);
  };

  // Restart active game in the drawer
  const restartActiveGame = () => {
    playChime('start');
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameFinished(false);
    setCompletionData(null);
    setGameKey((prev) => prev + 1);
  };

  // Handle completion of active game inside the in-page drawer
  const handleFinishActiveGame = async (stats: FinishGameStats) => {
    setGameFinished(true);
    setIsSaving(true);

    const safeAccuracy = Math.max(20, Math.min(100, stats.accuracy));
    const responseSec = elapsedTime;

    // Persist level completion
    completeLevel(activeGameId, activeDifficulty, safeAccuracy, userId);
    refreshProgress();

    const isLastLevel = activeDifficulty === 5;
    const nextLvl = !isLastLevel ? ((activeDifficulty + 1) as DifficultyLevel) : null;

    setCompletionData({
      gameId: activeGameId,
      completedLevel: activeDifficulty,
      accuracy: safeAccuracy,
      responseTimeSec: responseSec,
      mistakes: stats.mistakes,
      isGameFullyCompleted: isLastLevel,
      nextLevel: nextLvl,
    });

    const payload = {
      gameId: activeGameId,
      gameTitle: activeGame.title,
      accuracy: safeAccuracy,
      responseTimeSec: responseSec,
      expectedTimeSec: 25,
      mistakes: stats.mistakes,
      totalAttempts: stats.totalAttempts,
      currentDifficulty: activeDifficulty,
    };

    try {
      const res = await fetch('/api/game-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Offline fallback');
      const data = await res.json();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lastGameResult', JSON.stringify(data));
      }
    } catch {
      await saveGameResultOffline({
        userId,
        gameId: activeGameId,
        gameTitle: activeGame.title,
        score: safeAccuracy,
        accuracy: safeAccuracy,
        responseTimeSec: responseSec,
        mistakes: stats.mistakes,
        difficultyLevel: activeDifficulty,
        timestamp: new Date().toISOString(),
      }).catch((e) => console.warn('Offline save error:', e));

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'lastGameResult',
          JSON.stringify({
            session: {
              ...payload,
              score: safeAccuracy,
              feedbackText: 'Great focus! Your offline result has been saved locally.',
            },
          })
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleProceedToNextLevel = () => {
    if (!completionData?.nextLevel) return;
    const next = completionData.nextLevel;
    setActiveDifficulty(next);
    setCompletionData(null);
    setGameFinished(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameKey((prev) => prev + 1);
  };

  // Filtered games based on category and search query
  const filteredGames = useMemo(() => {
    return ALL_9_GAMES.filter((g) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        g.category === selectedCategory ||
        (selectedCategory === 'memory' && (g.id === 'grocery-basket' || g.id === 'memory-match' || g.id === 'pattern-match')) ||
        (selectedCategory === 'focus' && (g.id === 'different-one' || g.id === 'number-trail' || g.id === 'sequence-memory' || g.id === 'color-stroop')) ||
        (selectedCategory === 'sound' && (g.id === 'sound-word-match' || g.id === 'rhyme-completion' || g.id === 'sequence-memory')) ||
        (selectedCategory === 'daily' && (g.id === 'grocery-basket' || g.id === 'clock-reading' || g.id === 'routine-timeline' || g.id === 'currency-calc' || g.id === 'different-one'));

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        g.title.toLowerCase().includes(q) ||
        g.domain.toLowerCase().includes(q) ||
        g.tag.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.culturalNote.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: ALL_9_GAMES.length,
      memory: ALL_9_GAMES.filter((g) => g.id === 'memory-match' || g.id === 'grocery-basket' || g.id === 'pattern-match').length,
      focus: ALL_9_GAMES.filter((g) => g.id === 'different-one' || g.id === 'number-trail' || g.id === 'sequence-memory' || g.id === 'color-stroop').length,
      sound: ALL_9_GAMES.filter((g) => g.id === 'sound-word-match' || g.id === 'rhyme-completion' || g.id === 'sequence-memory').length,
      daily: ALL_9_GAMES.filter((g) => g.id === 'grocery-basket' || g.id === 'clock-reading' || g.id === 'routine-timeline' || g.id === 'currency-calc' || g.id === 'different-one').length,
    };
  }, []);

  const categories = [
    { id: 'all' as GameCategoryFilter, label: 'All 12 Games', count: categoryCounts.all, icon: '🌟' },
    { id: 'memory' as GameCategoryFilter, label: 'Memory & Recall', count: categoryCounts.memory, icon: '🧠' },
    { id: 'focus' as GameCategoryFilter, label: 'Focus & Speed', count: categoryCounts.focus, icon: '🎯' },
    { id: 'sound' as GameCategoryFilter, label: 'Sound & Melodies', count: categoryCounts.sound, icon: '🎵' },
    { id: 'daily' as GameCategoryFilter, label: 'Daily Living', count: categoryCounts.daily, icon: '🧺' },
  ];

  const currentLevelConfig = GAME_LEVEL_CONFIG[activeGameId]?.[activeDifficulty];

  const welcomeVoiceText = `Welcome to the Smitri Cognitive Games Hub, ${seniorName}. All 12 exercises are ready. You can play on the right side of the screen which is automatically set, or open full screen. Take your time with no timers or penalties.`;

  return (
    <div className="space-y-6 pb-36 sm:pb-44 max-w-7xl mx-auto font-sans antialiased">

      {/* ─── 1. MORNING CALM SESSION STATUS BANNER & OVERALL MASTERY ─── */}
      <section 
        aria-label="Morning Calm Session Status"
        className="bg-white rounded-3xl p-5 sm:p-7 border border-[#D5DFDC] shadow-[0_2px_14px_rgba(11,83,75,0.05)] flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all"
      >
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl" aria-hidden="true">🌱</span>
            <span className="text-xs sm:text-sm font-black tracking-wider text-[#065F46] uppercase">
              MORNING CALM SESSION • ALL 12 GAMES ACTIVE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              Right Screen Auto-Set
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#111615] tracking-tight">
            Welcome back, {seniorName}.
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] font-medium leading-relaxed">
            All 12 cognitive games are ready. By default, games start on the <strong className="text-[#065F46]">Right Side of Screen</strong> so you can easily switch activities, or you can choose <strong className="text-[#0B534B]">Full Screen</strong> anytime.
          </p>

          {/* Overall 45-Level Mastery Progress Bar */}
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#5A6A66]">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Overall Mastery Progress</span>
              </span>
              <span className="text-[#0B534B] font-extrabold">
                {masteryStats.totalCompleted} / {masteryStats.totalPossible} Levels ({masteryStats.percentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#E6ECEB] rounded-full overflow-hidden" role="progressbar" aria-valuenow={masteryStats.percentage} aria-valuemin={0} aria-valuemax={100}>
              <div 
                className="h-full bg-gradient-to-r from-[#10B981] to-[#0B534B] rounded-full transition-all duration-500"
                style={{ width: `${Math.max(4, masteryStats.percentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right side stats & voice assistant */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold flex-wrap">
            <div className="flex items-center gap-1.5 text-[#B45309] bg-[#FFFBEB] px-3.5 py-2 rounded-2xl border border-[#FDE68A] shadow-2xs">
              <Flame className="w-4 h-4 text-[#D97706]" />
              <span>{streakDays} Day Streak</span>
            </div>

            <div className="flex items-center gap-1.5 text-[#065F46] bg-[#ECFDF5] px-3.5 py-2 rounded-2xl border border-[#A7F3D0] shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>Right Screen Default</span>
            </div>
          </div>

          <VoiceButton
            textToRead={welcomeVoiceText}
            buttonLabel="Listen Page Guide"
            className="min-h-[44px] px-4 text-xs font-bold self-start sm:self-auto lg:self-end"
          />
        </div>
      </section>

      {/* ─── 2. SEARCH & CATEGORY FILTER BAR ─── */}
      <section aria-label="Game Filter and Search Controls" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#D5DFDC] shadow-[0_2px_8px_rgba(11,83,75,0.04)]">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2" role="tablist">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`min-h-[42px] px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all border cursor-pointer inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#0B534B] ${
                    isSelected
                      ? 'bg-[#0B534B] text-white border-[#08433C] shadow-xs'
                      : 'bg-white text-[#374151] border-[#E6ECEB] hover:bg-[#F0FDF4] hover:border-[#93CEC5]'
                  }`}
                >
                  <span aria-hidden="true">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Drawer Toggle */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games or skills..."
                className="w-full min-h-[42px] pl-9 pr-8 py-2 rounded-xl bg-[#F9FAFB] border border-[#D5DFDC] text-xs sm:text-sm text-[#111615] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0B534B] focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Toggle Drawer Visibility */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isDrawerOpen
                  ? 'bg-[#E6F4F1] text-[#0B534B] border-[#93CEC5] hover:bg-[#D4EFEA]'
                  : 'bg-white text-[#374151] border-[#D5DFDC] hover:bg-[#F9FAFB]'
              }`}
              title={isDrawerOpen ? 'Minimize Arena Panel for wide grid view' : 'Open Right Arena Panel'}
            >
              {isDrawerOpen ? (
                <>
                  <PanelRightClose className="w-4 h-4" />
                  <span className="hidden sm:inline">Hide Right Panel</span>
                </>
              ) : (
                <>
                  <PanelRightOpen className="w-4 h-4 text-[#0B534B]" />
                  <span className="text-[#0B534B]">Open Right Panel (Auto)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ─── 3. MAIN SPLIT / MASTER-DETAIL GAMEPLAY UX ─── */}
      <div className={`grid grid-cols-1 ${isDrawerOpen ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-6 items-start`}>

        {/* ─── LEFT COLUMN: ALL 12 GAMES ROSTER ─── */}
        <section 
          aria-label="All 12 Senior Cognitive Games"
          className={`${isDrawerOpen ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-5`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111615] tracking-tight">
                All 12 Senior Cognitive Games
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
                Tap <strong className="text-[#0B534B]">Play Game</strong> to choose screen, or tap <strong className="text-[#065F46]">Right Screen (Auto)</strong> to play instantly on the side panel.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0B534B] bg-[#E6F4F1] px-3 py-1 rounded-full border border-[#93CEC5]">
              {filteredGames.length} of 12 Available
            </span>
          </div>

          {/* Games Grid (2 cols if drawer open, 3 cols if drawer closed) */}
          <div className={`grid grid-cols-1 ${isDrawerOpen ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-5`}>
            {filteredGames.map((game) => {
              const Icon = game.icon;
              const isSelectedInPanel = game.id === activeGameId && isDrawerOpen;
              const progress: GameProgress = progressMap[game.id] || {
                gameId: game.id,
                unlockedLevel: 1,
                completedLevels: [],
                updatedAt: new Date().toISOString()
              };

              const unlockedLvl = progress.unlockedLevel || 1;
              const completedCount = progress.completedLevels?.length || 0;
              const isFullyMastered = completedCount === 5;

              return (
                <article
                  key={game.id}
                  className={`rounded-3xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between min-h-[350px] relative ${
                    isSelectedInPanel
                      ? 'bg-white border-2 border-[#059669] shadow-[0_6px_24px_rgba(5,150,105,0.14)] ring-4 ring-[#059669]/10'
                      : 'bg-white border border-[#D5DFDC] hover:border-[#93CEC5] shadow-[0_2px_12px_rgba(11,83,75,0.04)] hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: game.bgLight, color: game.accentColor }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isFullyMastered ? (
                          <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-[#D97706]" />
                            <span>Mastered</span>
                          </span>
                        ) : (
                          <span
                            className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                            style={{ backgroundColor: game.bgLight, color: game.accentColor, borderColor: game.borderLight }}
                          >
                            {game.categoryBadge}
                          </span>
                        )}

                        {isSelectedInPanel && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                            Right Screen Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Domain */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#111615] leading-snug tracking-tight">
                        {game.title}
                      </h3>
                      <p className="text-xs font-bold text-[#5A6A66] mt-0.5">
                        {game.domain}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed line-clamp-2">
                      {game.description}
                    </p>

                    {/* Cultural Touchpoint Note */}
                    <div className="bg-[#F9FAFB] rounded-xl px-3 py-2 border border-[#E5E7EB] text-[11px] text-[#5A6A66] flex items-center gap-2">
                      <span className="text-sm">🪔</span>
                      <span className="truncate">{game.culturalNote}</span>
                    </div>

                    {/* 5-Level Visual Dots & Quick Level Launcher */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-xs font-bold text-[#5A6A66] mb-1.5">
                        <span>Level Progress:</span>
                        <span className="text-[#0B534B] font-extrabold">
                          {completedCount === 5 ? '5/5 Mastered' : `Level ${unlockedLvl} of 5`}
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5" suppressHydrationWarning>
                        {ALL_LEVELS.map((lvl) => {
                          const isUnlocked = getIsLevelUnlocked(game.id, lvl);
                          const isCompleted = getIsLevelCompleted(game.id, lvl);
                          const isCurrentActive = unlockedLvl === lvl;

                          if (isCompleted) {
                            return (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => handleStartGamePrompt(game, lvl)}
                                className="h-8 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] text-xs font-black flex items-center justify-center gap-0.5 cursor-pointer transition-colors"
                                title={`Level ${lvl} Completed — Tap to choose screen`}
                                aria-label={`Level ${lvl} completed`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>L{lvl}</span>
                              </button>
                            );
                          }

                          if (isCurrentActive) {
                            return (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => handleStartGamePrompt(game, lvl)}
                                className="h-8 rounded-lg bg-[#0B534B] text-white border border-[#0B534B] text-xs font-black flex items-center justify-center gap-0.5 shadow-2xs ring-2 ring-[#0B534B]/20 cursor-pointer"
                                title={`Level ${lvl} Unlocked — Tap to choose screen`}
                                aria-label={`Level ${lvl} current unlocked`}
                              >
                                <Play className="w-2.5 h-2.5 fill-white" />
                                <span>L{lvl}</span>
                              </button>
                            );
                          }

                          return (
                            <div
                              key={lvl}
                              className="h-8 rounded-lg bg-[#F9FAFB] text-[#9CA3AF] border border-[#E5E7EB] text-xs font-semibold flex items-center justify-center gap-0.5 cursor-not-allowed select-none"
                              title={`Level ${lvl} Locked — Complete Level ${lvl - 1} first`}
                              aria-label={`Level ${lvl} locked`}
                            >
                              <Lock className="w-2.5 h-2.5" />
                              <span>L{lvl}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Dual Play Action Buttons: Ask Screen Choice vs Instant Direct Buttons */}
                  <div className="pt-4 mt-3 border-t border-[#F3F4F6] space-y-2">
                    {/* Primary Button: Asks User Screen Choice (Right Screen is Pre-selected / Auto Default) */}
                    <button
                      type="button"
                      onClick={() => handleStartGamePrompt(game, unlockedLvl)}
                      className="w-full min-h-[48px] px-4 py-2.5 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B534B]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Game (Level {unlockedLvl})</span>
                    </button>

                    {/* Instant Direct Shortcuts: Right Screen (Auto) & Full Screen */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectGameForPanel(game, unlockedLvl)}
                        className={`min-h-[38px] px-2 py-1 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border ${
                          isSelectedInPanel
                            ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                            : 'bg-[#F9FAFB] hover:bg-[#E6F4F1] text-[#065F46] border-[#D5DFDC]'
                        }`}
                        title="Start immediately on the right side of the screen (Auto Default)"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        <span>Right Screen (Auto)</span>
                      </button>

                      <Link
                        href={`/games/${game.id}?level=${unlockedLvl}`}
                        className="min-h-[38px] px-2 py-1 rounded-xl font-bold text-xs bg-[#F9FAFB] hover:bg-[#E6F4F1] text-[#374151] hover:text-[#0B534B] border border-[#D5DFDC] transition-colors flex items-center justify-center gap-1.5"
                        title="Open directly in full screen arena"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#0B534B]" />
                        <span>Full Screen</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Warm Pause Reassurance Note */}
          <div className="bg-[#F8FAF9] rounded-2xl p-4 sm:p-5 border border-[#E6ECEB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">☕</span>
              <div className="space-y-0.5">
                <span className="text-xs sm:text-sm font-bold text-[#111615] block">
                  Need a warm pause or chai break?
                </span>
                <p className="text-xs text-[#5A6A66]">
                  There is never a penalty for stepping away. Your level progress and consistency streaks are safeguarded constantly.
                </p>
              </div>
            </div>

            <Link
              href="/caregiver"
              className="text-xs font-extrabold text-[#0B534B] hover:text-[#08433C] whitespace-nowrap bg-white px-4 py-2 rounded-xl border border-[#D5DFDC] transition-colors self-start sm:self-auto shadow-2xs"
            >
              Caregiver Check-in →
            </Link>
          </div>
        </section>

        {/* ─── RIGHT COLUMN: INTERACTIVE GAMEPLAY ARENA DRAWER (AUTO SET BY DEFAULT) ─── */}
        {isDrawerOpen && (
          <aside 
            ref={drawerRef}
            aria-label="Active Exercise Interactive Panel"
            className="lg:col-span-5 bg-white rounded-3xl border-2 border-[#A7F3D0] shadow-[0_4px_24px_rgba(11,83,75,0.08)] p-5 sm:p-6 space-y-4 sticky top-20 transition-all"
          >
            {/* Auto-set Right Screen Active Indicator & Fullscreen Switcher */}
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse flex-shrink-0" />
                <div>
                  <span className="text-xs font-black text-[#065F46] uppercase tracking-wide block">
                    Screen Mode: Right Side (Auto Set)
                  </span>
                  <span className="text-[11px] text-[#5A6A66]">
                    Playing side-by-side with games list on left
                  </span>
                </div>
              </div>

              <Link
                href={`/games/${activeGameId}?level=${activeDifficulty}`}
                className="text-xs font-black text-[#0B534B] hover:text-[#08433C] bg-white px-3 py-1.5 rounded-xl border border-[#93CEC5] hover:bg-[#D4EFEA] transition-all flex items-center gap-1.5 shadow-2xs self-end sm:self-auto"
                title="Switch to full screen mode"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#0B534B]" />
                <span>Switch to Full Screen</span>
              </Link>
            </div>

            {/* Drawer Top Navigation & Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6] gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-3 py-1.5 rounded-full border border-[#D5DFDC] hover:border-[#0B534B] text-xs font-bold text-[#5A6A66] hover:text-[#0B534B] hover:bg-[#E6F4F1] transition-all flex items-center gap-1 cursor-pointer"
                title="Minimize active panel to view wider grid"
              >
                <X className="w-3.5 h-3.5" />
                <span>Minimize</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Audio sound effects toggle */}
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    audioEnabled
                      ? 'bg-[#E6F4F1] border-[#93CEC5] text-[#0B534B]'
                      : 'bg-[#F9FAFB] border-[#D5DFDC] text-[#6B7280]'
                  }`}
                  title={audioEnabled ? 'Mute game sound effects' : 'Turn on game sound effects'}
                  aria-label={audioEnabled ? 'Mute sound' : 'Turn on sound'}
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="hidden sm:inline">{audioEnabled ? 'Sound On' : 'Muted'}</span>
                </button>

                {/* Elapsed Timer */}
                <div className="flex items-center gap-1 bg-[#F9FAFB] px-2.5 py-1.5 rounded-xl border border-[#D5DFDC] text-xs font-bold text-[#111615]">
                  <Clock className="w-3.5 h-3.5 text-[#0B534B]" />
                  <span>{elapsedTime}s</span>
                </div>

                {/* Restart Level */}
                <button
                  type="button"
                  onClick={restartActiveGame}
                  className="p-2 rounded-xl bg-[#F9FAFB] hover:bg-[#E6F4F1] text-[#0B534B] border border-[#D5DFDC] text-xs font-bold transition-all cursor-pointer"
                  title="Restart this level"
                  aria-label="Restart level"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Game Info & Level Title */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5A6A66]">
                <span className="text-[#0B534B] font-black uppercase">{activeGame.tag}</span>
                <span>•</span>
                <span className="text-[#059669] font-black">Level {activeDifficulty} of 5</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#111615] tracking-tight">
                {activeGame.title}
              </h3>
              <p className="text-xs text-[#5A6A66]">
                {currentLevelConfig?.description || activeGame.description}
              </p>
            </div>

            {/* In-Panel Level Selector (1 to 5) */}
            <div className="bg-[#F9FAFB] p-2.5 rounded-2xl border border-[#E5E7EB] flex items-center justify-between gap-2">
              <span className="text-xs font-black text-[#111615] pl-1">Level:</span>
              <div className="grid grid-cols-5 gap-1.5 flex-1" suppressHydrationWarning>
                {ALL_LEVELS.map((lvl) => {
                  const isUnlocked = getIsLevelUnlocked(activeGameId, lvl);
                  const isCompleted = getIsLevelCompleted(activeGameId, lvl);
                  const isCurrent = activeDifficulty === lvl;

                  if (isCurrent) {
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleSelectDifficulty(lvl)}
                        className="h-8 rounded-lg bg-[#0B534B] text-white font-black text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>L{lvl}</span>
                      </button>
                    );
                  }

                  if (isCompleted) {
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleSelectDifficulty(lvl)}
                        className="h-8 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] font-black text-xs flex items-center justify-center gap-0.5 cursor-pointer"
                        title={`Level ${lvl} Completed — Replay`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>L{lvl}</span>
                      </button>
                    );
                  }

                  return (
                    <div
                      key={lvl}
                      className="h-8 rounded-lg bg-white text-[#9CA3AF] border border-[#E5E7EB] font-semibold text-xs flex items-center justify-center gap-0.5 select-none cursor-not-allowed"
                      title={`Level ${lvl} Locked`}
                    >
                      <Lock className="w-2.5 h-2.5" />
                      <span>L{lvl}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instruction Callout & Audio Hint */}
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-3.5 rounded-2xl flex items-start justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-[#065F46] tracking-wider block">
                  Instructions
                </span>
                <p className="text-xs text-[#111615] font-medium leading-relaxed">
                  {activeGame.instruction}
                </p>
              </div>

              <VoiceButton
                textToRead={`You are playing ${activeGame.title} on level ${activeDifficulty}. ${activeGame.instruction}`}
                buttonLabel="Listen"
                className="min-h-[36px] px-2.5 text-[11px] font-bold flex-shrink-0"
              />
            </div>

            {/* Saving State Banner */}
            {isSaving && (
              <div
                className="bg-[#E6F4F1] border border-[#10B981] p-2.5 rounded-xl flex items-center justify-center gap-2 text-[#065F46] font-bold text-xs"
                role="status"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0B534B]" />
                <span>Safely recording exercise progress...</span>
              </div>
            )}

            {/* ─── REAL INTERACTIVE ARENA STAGE FOR ALL 9 GAMES ─── */}
            <div className="bg-[#F9FAFB] rounded-2xl p-4 sm:p-5 border border-[#D5DFDC] min-h-[360px] flex flex-col items-center justify-center relative overflow-hidden">
              {activeGameId === 'grocery-basket' && (
                <GroceryBasketArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'memory-match' && (
                <MemoryMatchArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'sequence-memory' && (
                <SequenceMemoryArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'different-one' && (
                <DifferentOneArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'number-trail' && (
                <NumberTrailArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'pattern-match' && (
                <MatrixPatternArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'sound-word-match' && (
                <SoundWordMatchArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'clock-reading' && (
                <ClockReadingArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'rhyme-completion' && (
                <RhymeCompletionArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'routine-timeline' && (
                <RoutineTimelineArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'currency-calc' && (
                <CurrencyCalcArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
              {activeGameId === 'color-stroop' && (
                <ColorStroopArena
                  key={`${gameKey}-${activeDifficulty}`}
                  difficulty={activeDifficulty}
                  onFinish={handleFinishActiveGame}
                />
              )}
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="pt-2 flex items-center justify-between gap-3 text-xs text-[#5A6A66]">
              <span className="flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Unrushed pace • No penalties</span>
              </span>

              <Link
                href={`/games/${activeGameId}?level=${activeDifficulty}`}
                className="font-extrabold text-[#0B534B] hover:underline inline-flex items-center gap-1"
              >
                <span>Full screen arena</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        )}
      </div>

      {/* ─── 4. SCREEN CHOICE PROMPT MODAL (Right Screen vs Full Screen) ─── */}
      {screenChoiceModal && (
        <div
          className="fixed inset-0 bg-[#042420]/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="screen-choice-title"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl border-2 border-[#0B534B] relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setScreenChoiceModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111615] transition-colors cursor-pointer"
              aria-label="Close screen selection"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="w-9 h-9 rounded-xl bg-[#E6F4F1] text-[#0B534B] flex items-center justify-center text-lg shadow-xs">
                  🎮
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-[#065F46] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                  Choose Playing Screen • स्क्रीन मोड चुनें
                </span>
              </div>

              <h3 id="screen-choice-title" className="text-2xl sm:text-3xl font-black text-[#111615] tracking-tight">
                Where would you like to play {screenChoiceModal.game.title}?
              </h3>
              <p className="text-sm text-[#4B5563] font-medium leading-relaxed">
                You can play on the <strong>Right Side of the Screen</strong> (automatically set as default) or open the dedicated <strong>Full Screen</strong> arena.
              </p>
            </div>

            {/* Audio Voice Assistant */}
            <div className="flex justify-start">
              <VoiceButton
                textToRead={`Where would you like to play ${screenChoiceModal.game.title}? Option 1: Right side of screen, which is set as auto default. Option 2: Full screen arena.`}
                buttonLabel="Listen Options"
                className="min-h-[38px] px-3 text-xs font-bold"
              />
            </div>

            {/* Two Playing Mode Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* OPTION 1: Right Side of Screen (Auto Default / Recommended) */}
              <div className="bg-[#ECFDF5] border-2 border-[#059669] rounded-2xl p-5 space-y-4 relative flex flex-col justify-between shadow-xs ring-4 ring-[#059669]/10">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#059669] text-white flex items-center justify-center shadow-xs">
                      <PanelRightOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#6EE7B7]">
                      ★ Auto Default
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-[#111615]">
                    Right Side of Screen
                  </h4>
                  <p className="text-xs text-[#065F46] font-medium leading-relaxed">
                    Play comfortably in the side panel while keeping the games list and stats open on the left.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleSelectGameForPanel(screenChoiceModal.game, screenChoiceModal.level);
                    setScreenChoiceModal(null);
                  }}
                  className="w-full min-h-[46px] py-2.5 px-4 bg-[#059669] hover:bg-[#047857] active:bg-[#065F46] text-white rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play on Right Screen (Default)</span>
                </button>
              </div>

              {/* OPTION 2: Full Screen Arena */}
              <div className="bg-white border-2 border-[#D5DFDC] hover:border-[#0B534B] rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-colors shadow-xs">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0B534B] flex items-center justify-center">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#5A6A66] border border-[#E5E7EB]">
                      Full Focus
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-[#111615]">
                    Full Screen Arena
                  </h4>
                  <p className="text-xs text-[#5A6A66] leading-relaxed">
                    Dedicated full-page experience with larger interactive elements and zero distractions.
                  </p>
                </div>

                <Link
                  href={`/games/${screenChoiceModal.game.id}?level=${screenChoiceModal.level}`}
                  onClick={() => setScreenChoiceModal(null)}
                  className="w-full min-h-[46px] py-2.5 px-4 bg-[#0B534B] hover:bg-[#08433C] text-white rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Open Full Screen</span>
                </Link>
              </div>
            </div>

            {/* Footer Reassurance */}
            <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#5A6A66]">
              <span>Auto-set: <strong>Right Screen</strong> is currently active.</span>
              <button
                type="button"
                onClick={() => setScreenChoiceModal(null)}
                className="text-[#0B534B] font-bold hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. LEVEL COMPLETION MODAL FOR IN-PAGE PLAY ─── */}
      {completionData && (
        <div 
          className="fixed inset-0 bg-[#042420]/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl border-2 border-[#0B534B]">
            {/* Header Icon */}
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-md border-2 border-white"
              style={{
                backgroundColor: completionData.isGameFullyCompleted ? '#D97706' : '#059669',
              }}
            >
              {completionData.isGameFullyCompleted ? (
                <Trophy className="w-8 h-8 text-white animate-bounce" />
              ) : (
                <Check className="w-8 h-8 text-white stroke-[3]" />
              )}
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5">
              <span className="text-xs font-black uppercase text-[#0B534B] bg-[#E6F4F1] px-3 py-1 rounded-full border border-[#93CEC5] inline-block">
                {completionData.isGameFullyCompleted ? 'Mastery Achieved' : `Level ${completionData.completedLevel} Complete`}
              </span>
              <h3 className="text-2xl font-black text-[#111615]">
                {completionData.isGameFullyCompleted
                  ? '🏆 All 5 Levels Mastered!'
                  : `Well Done, ${seniorName}!`}
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {completionData.isGameFullyCompleted
                  ? `You have successfully mastered all 5 sequential stages of ${activeGame.title}.`
                  : `You completed Level ${completionData.completedLevel} with calm precision. Level ${completionData.nextLevel} is now unlocked!`}
              </p>
            </div>

            {/* Score Stats Summary */}
            <div className="grid grid-cols-3 gap-2.5 bg-[#F9FAFB] p-3 rounded-2xl border border-[#D5DFDC]">
              <div>
                <span className="text-[10px] font-bold text-[#5A6A66] uppercase block">Accuracy</span>
                <span className="text-xl font-black text-[#059669]">{completionData.accuracy}%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#5A6A66] uppercase block">Time</span>
                <span className="text-xl font-black text-[#111615]">{completionData.responseTimeSec}s</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#5A6A66] uppercase block">Mistakes</span>
                <span className="text-xl font-black text-[#D97706]">{completionData.mistakes}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {!completionData.isGameFullyCompleted && completionData.nextLevel && (
                <button
                  type="button"
                  onClick={handleProceedToNextLevel}
                  className="w-full min-h-[48px] py-2.5 px-5 bg-[#0B534B] hover:bg-[#08433C] text-white rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Level {completionData.nextLevel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <Link
                href="/results"
                className="w-full min-h-[44px] py-2 px-4 rounded-xl font-bold text-xs bg-[#E6F4F1] hover:bg-[#D4EFEA] text-[#0B534B] border border-[#93CEC5] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Award className="w-4 h-4 text-[#D97706]" />
                <span>View Full Cognitive Report</span>
              </Link>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={restartActiveGame}
                  className="min-h-[40px] py-2 px-3 bg-[#F9FAFB] hover:bg-[#E6F4F1] border border-[#D5DFDC] text-[#0B534B] rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay L{completionData.completedLevel}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCompletionData(null)}
                  className="min-h-[40px] py-2 px-3 bg-[#F9FAFB] hover:bg-[#E6F4F1] border border-[#D5DFDC] text-[#111615] rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Pick Another Game</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. SENIOR ACCESSIBILITY FOOTER ─── */}
      <footer className="pt-8 border-t border-[#E6ECEB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A6A66]">
        <p>© 2025 Smitri NER Memory Care System. Gentle Brain Health for Elders.</p>
        <div className="flex items-center gap-4">
          <Link href="/progress" className="hover:text-[#0B534B] font-bold">
            Cognitive Progress Trends
          </Link>
          <span>•</span>
          <Link href="/caregiver" className="hover:text-[#0B534B] font-bold">
            Caregiver Alerts
          </Link>
          <span>•</span>
          <span className="font-bold text-[#059669]">Offline Storage Ready</span>
        </div>
      </footer>

      {/* ─── 7. Clearance Buffer for Floating Emergency & Caregiver Controls ─── */}
      <div className="h-10 sm:h-14 w-full pointer-events-none" aria-hidden="true" />
    </div>
  );
}
