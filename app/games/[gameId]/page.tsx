"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Clock, HelpCircle } from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { GameId, FinishGameStats } from '@/types/games';
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
    instruction: 'Watch carefully as the colored tiles illuminate. Once finished, tap the tiles in the exact same sequence.',
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

export default function GameArenaPage() {
  const router = useRouter();
  const params = useParams();
  const gameId = (params?.gameId as GameId) || 'memory-match';

  const [difficulty, setDifficulty] = useState(1);
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
      const data = await res.json();
      sessionStorage.setItem('lastGameResult', JSON.stringify(data));
      router.push('/results');
    } catch {
      router.push('/results');
    } finally {
      setSubmitting(false);
    }
  };

  const currentInfo = GAME_METADATA[gameId] || GAME_METADATA['memory-match'];

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <Link
            href="/games"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 transition-colors border border-slate-300"
            aria-label="Back to Games"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Difficulty: Level {difficulty} (Adaptive)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-800">
            <Clock className="w-4 h-4 text-blue-700" />
            <span>{elapsedTime}s</span>
          </div>

          <button
            type="button"
            onClick={restartGame}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Senior Voice Instructions Card */}
      <div className="bg-blue-50 border border-blue-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-blue-950 font-medium leading-snug">
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
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-slate-200 shadow-lg min-h-[440px] flex flex-col items-center justify-center">
        {gameId === 'memory-match' && (
          <MemoryMatchArena key={gameKey} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'sequence-memory' && (
          <SequenceMemoryArena key={gameKey} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'different-one' && (
          <DifferentOneArena key={gameKey} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'grocery-basket' && (
          <GroceryBasketArena key={gameKey} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'number-trail' && (
          <NumberTrailArena key={gameKey} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'pattern-match' && (
          <MatrixPatternArena key={gameKey} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'sound-word-match' && (
          <SoundWordMatchArena key={gameKey} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'clock-reading' && (
          <ClockReadingArena key={gameKey} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
        {gameId === 'rhyme-completion' && (
          <RhymeCompletionArena key={gameKey} difficulty={difficulty} onFinish={handleFinishGame} />
        )}
      </div>

      {submitting && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl border-4 border-blue-600">
            <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-2xl font-black text-slate-900">Analyzing Your Rhythm...</h3>
            <p className="text-lg text-slate-600 font-medium">
              Calculating cognitive performance score and adaptive difficulty adjustment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
