"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Clock, HelpCircle, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { GameId, FinishGameStats, DifficultyLevel } from '@/types/games';
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
} from '@/components/games';

const GAME_METADATA: Record<string, { title: string; instruction: string }> = {
  'memory-match': {
    title: 'Memory Match',
    instruction: 'Tap two cards to flip them over. If the symbols match, they stay open. Find all matching pairs.',
  },
  'sequence-memory': {
    title: 'Sequence Memory',
    instruction: 'Watch carefully as the colored chime tiles illuminate. Once finished, tap the tiles in the exact same sequence.',
  },
  'different-one': {
    title: 'Find the Different One',
    instruction: 'Look at the group of symbols. One of them is different from all the others. Tap the different symbol.',
  },
  'grocery-basket': {
    title: 'Grocery Basket Recall',
    instruction: 'Memorize the items in your grocery basket while the timer counts down. Then tap those same items on the market shelf.',
  },
  'number-trail': {
    title: 'Number Trail',
    instruction: 'Follow the numbered river stones in rising order. Start by tapping number 1, then 2, and so on.',
  },
  'pattern-match': {
    title: 'Matrix Pattern Recall',
    instruction: 'Memorize the glowing squares on the grid before they fade. Then tap each square that lit up.',
  },
  'sound-word-match': {
    title: 'Daily Word & Sound Match',
    instruction: 'Listen to the spoken audio cue or tap the speaker button, then choose the picture that matches the description.',
  },
  'clock-reading': {
    title: 'Clock Face Match',
    instruction: 'Look at the analog clock hands representing a familiar daily moment, and select the matching digital time.',
  },
  'rhyme-completion': {
    title: 'Rhyme & Word Completion',
    instruction: 'Listen to the classic phrase or proverb, and tap the missing word that completes the rhythm.',
  },
};

function GameArenaContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = (params?.gameId as GameId) || 'memory-match';

  const initialLevelParam = searchParams.get('level');
  const initialLevel = (
    initialLevelParam === '2' ? 2 : initialLevelParam === '3' ? 3 : 1
  ) as DifficultyLevel;

  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialLevel);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [gameKey, setGameKey] = useState<number>(0);

  useEffect(() => {
    if (gameFinished) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, gameFinished]);

  const restartGame = () => {
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameFinished(false);
    setGameKey((prev) => prev + 1);
  };

  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    if (newLevel === difficulty) return;
    setDifficulty(newLevel);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameFinished(false);
    setGameKey((prev) => prev + 1);

    // Update URL query parameter smoothly
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('level', newLevel.toString());
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleFinishGame = async (stats: FinishGameStats) => {
    setGameFinished(true);
    setSubmitting(true);

    const payload = {
      gameId,
      gameTitle: GAME_METADATA[gameId]?.title || 'Cognitive Quest',
      accuracy: Math.max(20, Math.min(100, stats.accuracy)),
      responseTimeSec: elapsedTime,
      expectedTimeSec: 25,
      mistakes: stats.mistakes,
      totalAttempts: stats.totalAttempts,
      currentDifficulty: difficulty,
    };

    try {
      const res = await fetch('/api/game-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('lastGameResult', JSON.stringify(data));
      } else {
        throw new Error('Server returned non-200');
      }
    } catch {
      // Offline fallback: save locally to IndexedDB and queue for sync
      try {
        await saveGameResultOffline({
          userId: 'user_kamla',
          gameId,
          gameTitle: payload.gameTitle,
          score: payload.accuracy,
          accuracy: payload.accuracy,
          responseTimeSec: payload.responseTimeSec,
          mistakes: payload.mistakes,
          difficultyLevel: payload.currentDifficulty,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not save game result offline:', err);
      }

      sessionStorage.setItem(
        'lastGameResult',
        JSON.stringify({
          offline: true,
          evaluation: {
            score: payload.accuracy,
            recommendedDifficulty: payload.currentDifficulty,
            feedback: 'Offline Mode: Your cognitive exercise was recorded and saved safely on your device.',
          },
        })
      );
    } finally {
      router.push('/results');
      setSubmitting(false);
    }
  };

  const currentInfo = GAME_METADATA[gameId] || GAME_METADATA['memory-match'];
  const currentLevelConfig = GAME_LEVEL_CONFIG[gameId]?.[difficulty];

  const levelConfigs: Array<{ level: DifficultyLevel; name: string; tag: string; color: string; ring: string }> = [
    { level: 1, name: 'Easy', tag: 'Level 1: Gentle', color: 'bg-[#10B981]', ring: 'ring-[#A7F3D0]' },
    { level: 2, name: 'Medium', tag: 'Level 2: Balanced', color: 'bg-[#D97706]', ring: 'ring-[#FDE68A]' },
    { level: 3, name: 'Advanced', tag: 'Level 3: Master', color: 'bg-[#DC2626]', ring: 'ring-[#FECDD3]' },
  ];

  const levelVoiceText = currentLevelConfig
    ? `You are playing ${currentInfo.title} on ${currentLevelConfig.title}. ${currentLevelConfig.description}`
    : currentInfo.instruction;

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#D5DFDC] shadow-sm">
        <div className="flex items-center gap-3.5">
          <Link
            href="/games"
            className="p-2.5 bg-[#F6F8F7] hover:bg-[#E6F4F1] rounded-xl text-[#0B534B] transition-colors border border-[#D5DFDC]"
            aria-label="Back to Games"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#111615] tracking-tight">
              {currentInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#0B534B] font-bold">
              Current Tier: {currentLevelConfig?.title || `Level ${difficulty}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#F6F8F7] px-3.5 py-2 rounded-xl border border-[#D5DFDC] text-sm font-bold text-[#111615]">
            <Clock className="w-4 h-4 text-[#0B534B]" />
            <span>{elapsedTime}s</span>
          </div>

          <button
            type="button"
            onClick={restartGame}
            className="flex items-center gap-1.5 bg-[#F6F8F7] hover:bg-[#E6F4F1] px-3.5 py-2 rounded-xl border border-[#D5DFDC] text-sm font-bold text-[#0B534B] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Interactive 3-Level Selector Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5DFDC] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span className="text-xs sm:text-sm font-extrabold text-[#111615] uppercase tracking-wider">
              Select Difficulty Level (3 Unique Tiers)
            </span>
          </div>
          <span className="text-xs font-semibold text-[#5A6A66]">
            Tap any tier to switch
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {levelConfigs.map((lvl) => {
            const isSelected = difficulty === lvl.level;
            const config = GAME_LEVEL_CONFIG[gameId]?.[lvl.level];

            return (
              <button
                key={lvl.level}
                type="button"
                onClick={() => handleDifficultyChange(lvl.level)}
                className={`py-3 px-3 sm:px-4 rounded-xl border-2 text-left transition-all flex flex-col gap-1 ${
                  isSelected
                    ? `bg-[#F2F8F6] border-[#0B534B] ring-2 ring-[#0B534B]/20 shadow-md scale-102`
                    : 'bg-[#FAFCFB] border-[#D5DFDC] hover:border-[#93CEC5] hover:bg-white opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-[#111615]">
                    {lvl.name}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${lvl.color} ${isSelected ? 'ring-2 ' + lvl.ring : ''}`}
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#0B534B] truncate">
                  {config?.badge || lvl.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Level Description Callout */}
        {currentLevelConfig && (
          <div className="mt-2 p-3.5 bg-[#E6F4F1] border border-[#0B534B]/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white tracking-wider"
                  style={{ backgroundColor: currentLevelConfig.color }}
                >
                  {currentLevelConfig.badge}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111615]">
                  {currentLevelConfig.subtitle}
                </span>
              </div>
              <p className="text-xs text-[#5A6A66] leading-relaxed">
                {currentLevelConfig.description}
              </p>
            </div>

            <VoiceButton
              textToRead={levelVoiceText}
              buttonLabel="Read Level Guide"
              className="flex-shrink-0"
            />
          </div>
        )}
      </div>

      {/* Senior Voice Instructions Card */}
      <div className="bg-[#FFFBEB] border border-[#D97706]/30 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-[#78350F] font-medium leading-snug">
            {currentInfo.instruction}
          </p>
        </div>
        <VoiceButton
          textToRead={currentInfo.instruction}
          buttonLabel="Read Instructions"
          className="flex-shrink-0"
        />
      </div>

      {/* Main Game Stage */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#D5DFDC] shadow-sm min-h-[440px] flex flex-col items-center justify-center">
        {gameId === 'memory-match' && (
          <MemoryMatchArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'sequence-memory' && (
          <SequenceMemoryArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'different-one' && (
          <DifferentOneArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'grocery-basket' && (
          <GroceryBasketArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'number-trail' && (
          <NumberTrailArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'pattern-match' && (
          <MatrixPatternArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'sound-word-match' && (
          <SoundWordMatchArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'clock-reading' && (
          <ClockReadingArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'rhyme-completion' && (
          <RhymeCompletionArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
      </div>

      {submitting && (
        <div className="fixed inset-0 bg-[#042420]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl border-2 border-[#0B534B]">
            <div className="w-16 h-16 border-4 border-[#0B534B] border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-2xl font-black text-[#111615]">Analyzing Your Rhythm...</h3>
            <p className="text-lg text-[#5A6A66] font-medium">
              Calculating cognitive performance score and adaptive difficulty adjustment for Level {difficulty}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GameArenaPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-[#0B534B] font-bold">
          Loading game arena...
        </div>
      }
    >
      <GameArenaContent />
    </Suspense>
  );
}
