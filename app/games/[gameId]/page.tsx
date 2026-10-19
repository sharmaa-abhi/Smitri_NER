"use client";

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RotateCcw, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Lock, 
  Check, 
  Play, 
  Trophy, 
  ArrowRight,
  Award,
  Volume2,
  VolumeX,
  Home,
  Loader2
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { GameId, FinishGameStats, DifficultyLevel } from '@/types/games';
import { saveGameResultOffline } from '@/lib/offlineStorage';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import { isGameAudioEnabled, setGameAudioEnabled } from '@/lib/gameAudio';
import { 
  getGameProgress, 
  isLevelUnlocked, 
  isLevelCompleted, 
  getHighestUnlockedLevel, 
  completeLevel,
  GameProgressData
} from '@/lib/gameProgress';
import { useAuth } from '@/lib/auth';
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
    title: 'Spot the Difference',
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
    title: 'Clock Face & Timings',
    instruction: 'Look at the analog clock hands representing a familiar daily moment, and select the matching digital time.',
  },
  'rhyme-completion': {
    title: 'Rhyme & Proverb Complete',
    instruction: 'Listen to the classic phrase or proverb, and tap the missing word that completes the rhythm.',
  },
  'routine-timeline': {
    title: 'Daily Routine Timeline',
    instruction: 'Arrange familiar daily activities from morning to evening in the correct sequential order.',
  },
  'currency-calc': {
    title: 'Rupee Tally & Market Math',
    instruction: 'Select rupee coins and notes to make the exact target amount for your market shopping.',
  },
  'color-stroop': {
    title: 'Color & Word Reflex',
    instruction: 'Pay close attention to the INK color of the word shown, not what the word reads. Tap the matching color.',
  },
};

const ALL_LEVELS: DifficultyLevel[] = [1, 2, 3, 4, 5];

interface CompletionModalData {
  completedLevel: DifficultyLevel;
  accuracy: number;
  responseTimeSec: number;
  mistakes: number;
  isGameFullyCompleted: boolean;
  nextLevel: DifficultyLevel | null;
}

function GameArenaContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const gameId = (params?.gameId as GameId) || 'memory-match';

  // Read current progress from persistent storage
  const [progress, setProgress] = useState<GameProgressData>(() => 
    getGameProgress(gameId, userId)
  );

  // Sync progress if user or game changes or custom progress events fire
  const refreshProgress = useCallback(() => {
    setProgress(getGameProgress(gameId, userId));
  }, [gameId, userId]);

  useEffect(() => {
    refreshProgress();
    const handleProgressUpdate = () => refreshProgress();
    window.addEventListener('smitri_game_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('smitri_game_progress_updated', handleProgressUpdate);
  }, [refreshProgress]);

  // Determine active level with strict unlocking verification
  const determineInitialLevel = (): DifficultyLevel => {
    const param = searchParams.get('level');
    const parsed = param ? parseInt(param, 10) : NaN;
    if (parsed >= 1 && parsed <= 5 && isLevelUnlocked(gameId, parsed as DifficultyLevel, userId)) {
      return parsed as DifficultyLevel;
    }
    return getHighestUnlockedLevel(gameId, userId);
  };

  const [difficulty, setDifficulty] = useState<DifficultyLevel>(determineInitialLevel);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [gameKey, setGameKey] = useState<number>(0);
  const [completionData, setCompletionData] = useState<CompletionModalData | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIsLevelUnlocked = useCallback((lvl: DifficultyLevel) => {
    if (!mounted) return lvl === 1;
    return isLevelUnlocked(gameId, lvl, userId);
  }, [mounted, gameId, userId]);

  const getIsLevelCompleted = useCallback((lvl: DifficultyLevel) => {
    if (!mounted) return false;
    return isLevelCompleted(gameId, lvl, userId);
  }, [mounted, gameId, userId]);

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

  // URL verification: guard against manual URL manipulation attempting to access locked levels
  useEffect(() => {
    const param = searchParams.get('level');
    if (!param) return;
    const requested = parseInt(param, 10);
    if (isNaN(requested) || requested < 1 || requested > 5 || !isLevelUnlocked(gameId, requested as DifficultyLevel, userId)) {
      const fallback = getHighestUnlockedLevel(gameId, userId);
      setDifficulty(fallback);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('level', fallback.toString());
        window.history.replaceState({}, '', url.toString());
      }
    } else if (requested !== difficulty) {
      setDifficulty(requested as DifficultyLevel);
    }
  }, [searchParams, gameId, userId, difficulty]);

  // Timer
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
    setCompletionData(null);
    setGameKey((prev) => prev + 1);
  };

  const handleLevelSelect = (targetLevel: DifficultyLevel) => {
    if (!isLevelUnlocked(gameId, targetLevel, userId)) return;
    if (targetLevel === difficulty && !gameFinished && !completionData) return;

    setDifficulty(targetLevel);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameFinished(false);
    setCompletionData(null);
    setGameKey((prev) => prev + 1);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('level', targetLevel.toString());
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleFinishGame = async (stats: FinishGameStats) => {
    setGameFinished(true);
    setIsSaving(true);

    const safeAccuracy = Math.max(20, Math.min(100, stats.accuracy));
    const responseSec = elapsedTime;

    // 1. Persist Level Completion and unlock next level in sequence
    const updatedProg = completeLevel(gameId, difficulty, safeAccuracy, userId);
    setProgress(updatedProg);

    const isLastLevel = difficulty === 5;
    const nextLvl = !isLastLevel ? ((difficulty + 1) as DifficultyLevel) : null;

    setCompletionData({
      completedLevel: difficulty,
      accuracy: safeAccuracy,
      responseTimeSec: responseSec,
      mistakes: stats.mistakes,
      isGameFullyCompleted: isLastLevel,
      nextLevel: nextLvl,
    });

    // 2. Post to API / Offline DB in background for caregiver tracking & analysis
    const payload = {
      gameId,
      gameTitle: GAME_METADATA[gameId]?.title || 'Cognitive Quest',
      accuracy: safeAccuracy,
      responseTimeSec: responseSec,
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

      if (!res.ok) throw new Error('Network failed, saving to offline database');

      const data = await res.json();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lastGameResult', JSON.stringify(data));
      }
    } catch {
      await saveGameResultOffline({
        userId,
        gameId,
        gameTitle: GAME_METADATA[gameId]?.title || 'Cognitive Quest',
        score: safeAccuracy,
        accuracy: safeAccuracy,
        responseTimeSec: responseSec,
        mistakes: stats.mistakes,
        difficultyLevel: difficulty,
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
    setDifficulty(next);
    setCompletionData(null);
    setGameFinished(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameKey((prev) => prev + 1);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('level', next.toString());
      window.history.replaceState({}, '', url.toString());
    }
  };

  const currentInfo = GAME_METADATA[gameId] || GAME_METADATA['memory-match'];
  const currentLevelConfig = GAME_LEVEL_CONFIG[gameId]?.[difficulty];

  const levelVoiceText = currentLevelConfig
    ? `You are playing ${currentInfo.title} on Level ${difficulty}. ${currentLevelConfig.description}`
    : currentInfo.instruction;

  return (
    <div className="space-y-6 pb-36 sm:pb-44 max-w-5xl mx-auto">
      
      {/* ─── 1. Spacious Top Header & Navigation Bar ─── */}
      <header className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D5DFDC] shadow-[0_2px_12px_rgba(11,83,75,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            href="/games"
            className="min-h-[48px] px-4 py-2.5 bg-[#E6F4F1] hover:bg-[#D4EFEA] rounded-xl text-[#0B534B] font-bold text-base transition-colors border border-[#93CEC5] inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#0B534B]"
            aria-label="Back to all games"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111615] tracking-tight">
              {currentInfo.title}
            </h1>
            <p className="text-sm font-bold text-[#0B534B]">
              Level {difficulty} of 5 • {currentLevelConfig?.subtitle || 'Sequential Cognitive Progression'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#0B534B] ${
              audioEnabled
                ? 'bg-[#E6F4F1] hover:bg-[#D4EFEA] border-[#93CEC5] text-[#0B534B]'
                : 'bg-[#F9FAFB] hover:bg-[#E5E7EB] border-[#D5DFDC] text-[#6B7280]'
            }`}
            aria-label={audioEnabled ? 'Mute game sound effects' : 'Turn on game sound effects'}
            title={audioEnabled ? 'Mute game sound effects' : 'Turn on game sound effects'}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 text-[#0B534B]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#6B7280]" />
            )}
            <span>{audioEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          {/* Gentle Elapsed Timer */}
          <div className="min-h-[44px] flex items-center gap-1.5 bg-[#F9FAFB] px-4 py-2 rounded-xl border border-[#D5DFDC] text-sm font-bold text-[#111615]">
            <Clock className="w-4 h-4 text-[#0B534B]" />
            <span>{elapsedTime}s</span>
          </div>

          {/* Restart Level */}
          <button
            type="button"
            onClick={restartGame}
            className="min-h-[44px] flex items-center gap-1.5 bg-[#F9FAFB] hover:bg-[#E6F4F1] px-4 py-2 rounded-xl border border-[#D5DFDC] text-sm font-bold text-[#0B534B] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B534B]"
            aria-label="Restart this level"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        </div>
      </header>

      {/* ─── 2. Clear Instruction & Voice Bar ─── */}
      <section aria-label="Exercise instructions" className="bg-[#ECFDF5] border border-[#A7F3D0] p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_2px_10px_rgba(11,83,75,0.04)]">
        <div className="flex items-start gap-3.5">
          <HelpCircle className="w-6 h-6 text-[#059669] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] block">
              Exercise Instructions
            </span>
            <p className="text-base sm:text-lg text-[#111615] font-medium leading-relaxed">
              {currentInfo.instruction}
            </p>
          </div>
        </div>
        <VoiceButton
          textToRead={levelVoiceText}
          buttonLabel="Listen Instructions"
          className="min-h-[44px] px-4 text-sm font-semibold flex-shrink-0 self-start sm:self-auto"
        />
      </section>

      {/* ─── 3. Compact 5-Stage Level Selector ─── */}
      <section aria-label="Level selection">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5DFDC] shadow-[0_2px_10px_rgba(11,83,75,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span className="text-sm font-extrabold text-[#111615]">
              Sequential Levels (1 → 5):
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-2.5 w-full sm:w-auto" suppressHydrationWarning>
            {ALL_LEVELS.map((lvl) => {
              const isUnlocked = getIsLevelUnlocked(lvl);
              const isCompleted = getIsLevelCompleted(lvl);
              const isCurrent = difficulty === lvl;

              if (isCurrent) {
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleLevelSelect(lvl)}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-[#0B534B] text-white border-2 border-[#0B534B] font-bold text-sm shadow-xs flex items-center justify-center gap-1.5 ring-2 ring-[#0B534B]/30 ring-offset-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B534B]"
                    title={`Level ${lvl} — Current Active Level`}
                    aria-label={`Level ${lvl} (Current active)`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>L{lvl}</span>
                  </button>
                );
              }

              if (isCompleted) {
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleLevelSelect(lvl)}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border-2 border-[#059669] font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B534B]"
                    title={`Level ${lvl} — Completed. Tap to replay.`}
                    aria-label={`Level ${lvl} completed (Replay)`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>L{lvl}</span>
                  </button>
                );
              }

              return (
                <div
                  key={lvl}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-[#F9FAFB] text-[#9CA3AF] border border-[#E5E7EB] font-semibold text-sm flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
                  title={`Level ${lvl} — Locked`}
                  aria-label={`Level ${lvl} (Locked)`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>L{lvl}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 4. Reassuring Saving State Feedback Banner ─── */}
      {isSaving && (
        <div
          className="bg-[#E6F4F1] border-2 border-[#10B981] p-3.5 rounded-2xl flex items-center justify-center gap-2.5 text-[#065F46] font-bold text-sm shadow-xs animate-fade-in"
          role="status"
        >
          <Loader2 className="w-4 h-4 animate-spin text-[#0B534B]" />
          <span>Saving your exercise progress safely...</span>
        </div>
      )}

      {/* ─── 5. Spacious Active Game Stage ─── */}
      <main className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D5DFDC] shadow-xs min-h-[480px] flex flex-col items-center justify-center relative">
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
        {gameId === 'routine-timeline' && (
          <RoutineTimelineArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'currency-calc' && (
          <CurrencyCalcArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'color-stroop' && (
          <ColorStroopArena key={`${gameKey}-${difficulty}`} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
      </main>

      {/* ─── 6. Level Completion / Mastery Modal ─── */}
      {completionData && (
        <div 
          className="fixed inset-0 bg-[#042420]/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="completion-title"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-6 shadow-xl border-2 border-[#0B534B]">
            {/* Header Icon */}
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-md border-2 border-white"
              style={{
                backgroundColor: completionData.isGameFullyCompleted ? '#D97706' : '#059669',
              }}
            >
              {completionData.isGameFullyCompleted ? (
                <Trophy className="w-10 h-10 text-white animate-bounce" />
              ) : (
                <Check className="w-10 h-10 text-white stroke-[3]" />
              )}
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] rounded-full text-xs font-black uppercase tracking-wider">
                {completionData.isGameFullyCompleted ? 'Mastery Achieved' : `Level ${completionData.completedLevel} Finished`}
              </span>
              <h2 id="completion-title" className="text-2xl sm:text-3xl font-extrabold text-[#111615]">
                {completionData.isGameFullyCompleted
                  ? '🏆 All 5 Levels Mastered!'
                  : `Level ${completionData.completedLevel} Completed!`}
              </h2>
              <p className="text-base text-[#4B5563] font-normal max-w-md mx-auto leading-relaxed">
                {completionData.isGameFullyCompleted
                  ? `Incredible achievement! You have successfully mastered all 5 levels of ${currentInfo.title}.`
                  : `Outstanding work! You finished Level ${completionData.completedLevel} with calm focus. Level ${completionData.nextLevel} is now unlocked!`}
              </p>
            </div>

            {/* Score Stats Summary */}
            <div className="grid grid-cols-3 gap-3 bg-[#F9FAFB] p-4 rounded-2xl border border-[#D5DFDC]">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#5A6A66] uppercase">Accuracy</span>
                <p className="text-2xl font-black text-[#059669]">{completionData.accuracy}%</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#5A6A66] uppercase">Time</span>
                <p className="text-2xl font-black text-[#111615]">{completionData.responseTimeSec}s</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#5A6A66] uppercase">Mistakes</span>
                <p className="text-2xl font-black text-[#D97706]">{completionData.mistakes}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {!completionData.isGameFullyCompleted && completionData.nextLevel && (
                <button
                  type="button"
                  onClick={handleProceedToNextLevel}
                  className="w-full min-h-[52px] py-3.5 px-6 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B534B]"
                >
                  <span>Continue to Level {completionData.nextLevel}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              <Link
                href="/results"
                className={`w-full min-h-[48px] py-3 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  completionData.isGameFullyCompleted || !completionData.nextLevel
                    ? 'bg-[#0B534B] hover:bg-[#08433C] text-white shadow-sm'
                    : 'bg-[#E6F4F1] hover:bg-[#D4EFEA] text-[#0B534B] border border-[#93CEC5]'
                }`}
              >
                <Award className="w-5 h-5 text-[#D97706]" />
                <span>View Full Results &amp; Report</span>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={restartGame}
                  className="min-h-[44px] py-2.5 px-3 bg-[#F9FAFB] hover:bg-[#E6F4F1] border border-[#D5DFDC] text-[#0B534B] rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay Level {completionData.completedLevel}</span>
                </button>

                <Link
                  href="/games"
                  className="min-h-[44px] py-2.5 px-3 bg-[#F9FAFB] hover:bg-[#E6F4F1] border border-[#D5DFDC] text-[#111615] rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Back to Games</span>
                </Link>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB]">
                <Link
                  href="/dashboard"
                  className="w-full py-2 px-4 text-[#4B5563] hover:text-[#0B534B] font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Return to Main Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 7. Safe Clearance Buffer for Floating SOS Control ─── */}
      <div className="h-10 sm:h-14 w-full pointer-events-none" aria-hidden="true" />
    </div>
  );
}

export default function GameArenaPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4">
          <div className="w-14 h-14 border-4 border-[#0B534B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl font-bold text-[#5A6A66]">Preparing your cognitive exercise...</p>
        </div>
      }
    >
      <GameArenaContent />
    </Suspense>
  );
}
