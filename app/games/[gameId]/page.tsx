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
  Award
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { GameId, FinishGameStats, DifficultyLevel } from '@/types/games';
import { saveGameResultOffline } from '@/lib/offlineStorage';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';
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
    // Fall back to highest unlocked level or Level 1
    return getHighestUnlockedLevel(gameId, userId);
  };

  const [difficulty, setDifficulty] = useState<DifficultyLevel>(determineInitialLevel);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [gameKey, setGameKey] = useState<number>(0);
  const [completionData, setCompletionData] = useState<CompletionModalData | null>(null);

  // URL verification: guard against manual URL manipulation attempting to access locked levels
  useEffect(() => {
    const param = searchParams.get('level');
    if (!param) return;
    const requested = parseInt(param, 10);
    if (isNaN(requested) || requested < 1 || requested > 5 || !isLevelUnlocked(gameId, requested as DifficultyLevel, userId)) {
      // Locked level requested via URL tampering! Fallback to highest unlocked
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
    // Strictly prevent clicking locked levels
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
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('lastGameResult', JSON.stringify(data));
      }
    } catch {
      try {
        await saveGameResultOffline({
          userId: userId || 'user_kamla',
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
            recommendedDifficulty: nextLvl || difficulty,
            feedback: 'Offline Mode: Level progress recorded and saved safely on your device.',
          },
        })
      );
    }
  };

  const handleProceedToNextLevel = () => {
    if (completionData?.nextLevel) {
      handleLevelSelect(completionData.nextLevel);
    }
  };

  const currentInfo = GAME_METADATA[gameId] || GAME_METADATA['memory-match'];
  const currentLevelConfig = GAME_LEVEL_CONFIG[gameId]?.[difficulty];

  const levelVoiceText = currentLevelConfig
    ? `You are playing ${currentInfo.title} on Level ${difficulty}. ${currentLevelConfig.description}`
    : currentInfo.instruction;

  return (
    <div className="space-y-6 pb-16">
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
              Level {difficulty} of 5 • {currentLevelConfig?.subtitle || 'Sequential Cognitive Progression'}
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
            className="flex items-center gap-1.5 bg-[#F6F8F7] hover:bg-[#E6F4F1] px-3.5 py-2 rounded-xl border border-[#D5DFDC] text-sm font-bold text-[#0B534B] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Sequential 5-Level Selection Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5DFDC] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span className="text-xs sm:text-sm font-extrabold text-[#111615] uppercase tracking-wider">
              Sequential Level Progression (1 → 5)
            </span>
          </div>
          <span className="text-xs font-semibold text-[#5A6A66]">
            Complete each level to unlock the next
          </span>
        </div>

        {/* 5 Level Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {ALL_LEVELS.map((lvl) => {
            const isUnlocked = isLevelUnlocked(gameId, lvl, userId);
            const isCompleted = isLevelCompleted(gameId, lvl, userId);
            const isCurrent = difficulty === lvl;

            let buttonStyles = '';
            let statusLabel = '';
            let statusIcon = null;

            if (isCurrent) {
              buttonStyles = 'bg-[#E6F4F1] border-[#0B534B] ring-2 ring-[#0B534B]/30 shadow-md text-[#0B534B] cursor-pointer';
              statusLabel = isCompleted ? 'Completed' : 'Playing Now';
              statusIcon = isCompleted ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Play className="w-3.5 h-3.5 fill-[#0B534B]" />;
            } else if (isCompleted) {
              buttonStyles = 'bg-[#F2FAF6] border-[#A7F3D0] hover:border-[#10B981] hover:bg-[#E6F9F0] text-[#065F46] cursor-pointer';
              statusLabel = 'Completed';
              statusIcon = <Check className="w-3.5 h-3.5 text-[#059669]" />;
            } else if (isUnlocked) {
              buttonStyles = 'bg-white border-[#93CEC5] hover:border-[#0B534B] hover:bg-[#F2F8F6] text-[#0B534B] cursor-pointer';
              statusLabel = 'Unlocked';
              statusIcon = <Play className="w-3.5 h-3.5" />;
            } else {
              buttonStyles = 'bg-[#F8FAF9] border-[#E5E9E8] text-[#9CA3AF] opacity-65 cursor-not-allowed';
              statusLabel = 'Locked';
              statusIcon = <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" />;
            }

            return (
              <button
                key={lvl}
                type="button"
                disabled={!isUnlocked}
                onClick={() => handleLevelSelect(lvl)}
                aria-label={`Level ${lvl}: ${statusLabel}`}
                className={`py-3 px-3 rounded-xl border-2 text-left transition-all flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B534B] ${buttonStyles}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-[#111615]">
                    Level {lvl}
                  </span>
                  <span className="flex-shrink-0">
                    {statusIcon}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className={isUnlocked ? (isCompleted ? 'text-[#059669]' : 'text-[#0B534B]') : 'text-[#9CA3AF]'}>
                    {statusLabel}
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] text-[#5A6A66]">Replayable</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Level Description */}
        {currentLevelConfig && (
          <div className="mt-2 p-3.5 bg-[#E6F4F1] border border-[#0B534B]/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white tracking-wider"
                  style={{ backgroundColor: currentLevelConfig.color || '#0B534B' }}
                >
                  Level {difficulty}
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
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#D5DFDC] shadow-sm min-h-[440px] flex flex-col items-center justify-center relative">
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

      {/* Level Completion / All-Levels Mastered Modal */}
      {completionData && (
        <div 
          className="fixed inset-0 bg-[#042420]/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="completion-title"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-6 shadow-2xl border-2 border-[#0B534B]">
            {/* Header Icon */}
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg border-2 border-white"
              style={{
                backgroundColor: completionData.isGameFullyCompleted ? '#F59E0B' : '#10B981',
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
              <span className="inline-block px-3 py-1 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] rounded-full text-xs font-black uppercase tracking-wider">
                {completionData.isGameFullyCompleted ? 'Mastery Achieved' : `Level ${completionData.completedLevel} Finished`}
              </span>
              <h2 id="completion-title" className="text-2xl sm:text-3xl font-black text-[#111615]">
                {completionData.isGameFullyCompleted
                  ? '🏆 All 5 Levels Mastered!'
                  : `Level ${completionData.completedLevel} Completed!`}
              </h2>
              <p className="text-sm text-[#5A6A66] font-medium max-w-md mx-auto leading-relaxed">
                {completionData.isGameFullyCompleted
                  ? `Incredible achievement! You have successfully conquered all 5 levels of ${currentInfo.title}.`
                  : `Outstanding work! You finished Level ${completionData.completedLevel} with calm focus and attention. Level ${completionData.nextLevel} is now unlocked!`}
              </p>
            </div>

            {/* Score Stats Summary */}
            <div className="grid grid-cols-3 gap-3 bg-[#F6F8F7] p-3.5 rounded-2xl border border-[#D5DFDC]">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[#5A6A66] uppercase">Accuracy</span>
                <p className="text-xl sm:text-2xl font-black text-[#0B534B]">{completionData.accuracy}%</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[#5A6A66] uppercase">Time</span>
                <p className="text-xl sm:text-2xl font-black text-[#111615]">{completionData.responseTimeSec}s</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[#5A6A66] uppercase">Mistakes</span>
                <p className="text-xl sm:text-2xl font-black text-[#D97706]">{completionData.mistakes}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {!completionData.isGameFullyCompleted && completionData.nextLevel ? (
                <button
                  type="button"
                  onClick={handleProceedToNextLevel}
                  className="w-full py-4 px-6 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-extrabold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Play Level {completionData.nextLevel}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <Link
                  href="/results"
                  className="w-full py-4 px-6 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-extrabold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5 text-[#F59E0B]" />
                  <span>View Full Game Results & Analysis</span>
                </Link>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={restartGame}
                  className="py-3 px-4 bg-[#F6F8F7] hover:bg-[#E6F4F1] border border-[#D5DFDC] text-[#0B534B] rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay Level {completionData.completedLevel}</span>
                </button>

                <Link
                  href="/games"
                  className="py-3 px-4 bg-[#F6F8F7] hover:bg-[#E6F4F1] border border-[#D5DFDC] text-[#111615] rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Back to Games</span>
                </Link>
              </div>
            </div>
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
