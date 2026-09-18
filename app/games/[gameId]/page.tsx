"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  Award,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';

// Everyday senior friendly emojis
const ICONS_BANK = ['🍎', '🌸', '🚗', '☀️', '☕', '🐱', '🔔', '🏠', '🍇', '🎈', '⭐', '🌈'];

export default function GameArenaPage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params?.gameId as string;

  // Game Settings & Stats
  const [difficulty, setDifficulty] = useState(1);
  const [score, setScore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ==================== GAME 1: MEMORY MATCH STATE ====================
  const [cards, setCards] = useState<Array<{ id: number; icon: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // ==================== GAME 2: SEQUENCE MEMORY STATE ==================
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequenceIndex, setUserSequenceIndex] = useState<number>(0);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [activePad, setActivePad] = useState<number | null>(null);

  // ==================== GAME 3: DIFFERENT ONE STATE ====================
  const [differentRound, setDifferentRound] = useState<number>(1);
  const [differentOptions, setDifferentOptions] = useState<Array<{ id: number; icon: string; isOdd: boolean }>>([]);

  // Timer Tick
  useEffect(() => {
    if (gameFinished) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, gameFinished]);

  // Initial Game Setup
  useEffect(() => {
    initGame(difficulty);
  }, [gameId, difficulty]);

  const initGame = (diff: number) => {
    setGameFinished(false);
    setScore(null);
    setMistakes(0);
    setTotalAttempts(0);
    setStartTime(Date.now());
    setElapsedTime(0);

    if (gameId === 'memory-match') {
      // Level 1: 4 pairs (8 cards), Level 2: 6 pairs (12 cards), Level 3: 8 pairs (16 cards)
      const pairCount = diff === 1 ? 4 : diff === 2 ? 6 : 8;
      const selected = ICONS_BANK.slice(0, pairCount);
      const deck = [...selected, ...selected]
        .sort(() => Math.random() - 0.5)
        .map((icon, id) => ({ id, icon, flipped: false, matched: false }));
      setCards(deck);
      setFlippedCards([]);
    } else if (gameId === 'sequence-memory') {
      // Sequence of 3 (level 1), 4 (level 2), 5 (level 3)
      const length = diff === 1 ? 3 : diff === 2 ? 4 : 5;
      const newSeq = Array.from({ length }, () => Math.floor(Math.random() * 4));
      setSequence(newSeq);
      setUserSequenceIndex(0);
      playSequence(newSeq);
    } else if (gameId === 'different-one') {
      setupDifferentOneRound(diff, 1);
    }
  };

  // ---------------- GAME 1 LOGIC: MEMORY MATCH ----------------
  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setTotalAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].icon === newCards[secondIdx].icon) {
        // Matched!
        setTimeout(() => {
          newCards[firstIdx].matched = true;
          newCards[secondIdx].matched = true;
          setCards([...newCards]);
          setFlippedCards([]);

          // Check if all matched
          if (newCards.every((c) => c.matched)) {
            finishGame({
              accuracy: Math.max(50, 100 - mistakes * 8),
              mistakes,
              totalAttempts: totalAttempts + 1,
            });
          }
        }, 500);
      } else {
        // Mismatch
        setMistakes((prev) => prev + 1);
        setTimeout(() => {
          newCards[firstIdx].flipped = false;
          newCards[secondIdx].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1100);
      }
    }
  };

  // ---------------- GAME 2 LOGIC: SEQUENCE MEMORY ----------------
  const playSequence = (seq: number[]) => {
    setIsShowingSequence(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < seq.length) {
        setActivePad(seq[step]);
        setTimeout(() => setActivePad(null), 600);
        step++;
      } else {
        clearInterval(interval);
        setIsShowingSequence(false);
      }
    }, 1000);
  };

  const handlePadClick = (padIndex: number) => {
    if (isShowingSequence || gameFinished) return;

    setTotalAttempts((prev) => prev + 1);
    if (padIndex === sequence[userSequenceIndex]) {
      // Correct step
      const nextIndex = userSequenceIndex + 1;
      setUserSequenceIndex(nextIndex);

      if (nextIndex === sequence.length) {
        // Successfully reproduced sequence!
        finishGame({
          accuracy: 100 - mistakes * 15,
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      }
    } else {
      // Mistake
      setMistakes((prev) => prev + 1);
      setActivePad(-1); // Flash red
      setTimeout(() => setActivePad(null), 400);
      if (mistakes >= 2) {
        // Finished with partial score
        finishGame({
          accuracy: 50,
          mistakes: mistakes + 1,
          totalAttempts: totalAttempts + 1,
        });
      }
    }
  };

  // ---------------- GAME 3 LOGIC: FIND THE DIFFERENT ONE ----------------
  const setupDifferentOneRound = (diff: number, roundNum: number) => {
    setDifferentRound(roundNum);
    // Count: level 1: 4 choices, level 2: 6 choices, level 3: 8 choices
    const count = diff === 1 ? 4 : diff === 2 ? 6 : 8;
    const baseIcon = ICONS_BANK[(roundNum * 2) % ICONS_BANK.length];
    const oddIcon = ICONS_BANK[(roundNum * 2 + 1) % ICONS_BANK.length];
    const oddPosition = Math.floor(Math.random() * count);

    const opts = Array.from({ length: count }, (_, i) => ({
      id: i,
      icon: i === oddPosition ? oddIcon : baseIcon,
      isOdd: i === oddPosition,
    }));
    setDifferentOptions(opts);
  };

  const handleSelectOddOption = (isOdd: boolean) => {
    if (gameFinished) return;
    setTotalAttempts((prev) => prev + 1);

    if (isOdd) {
      if (differentRound >= 3) {
        // Completed 3 rounds
        finishGame({
          accuracy: Math.max(60, 100 - mistakes * 12),
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      } else {
        // Next round
        setupDifferentOneRound(difficulty, differentRound + 1);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  // ---------------- FINISH & SAVE RESULT ----------------
  const finishGame = async (stats: { accuracy: number; mistakes: number; totalAttempts: number }) => {
    setGameFinished(true);
    setSubmitting(true);

    const payload = {
      gameId,
      gameTitle:
        gameId === 'memory-match'
          ? 'Memory Match'
          : gameId === 'sequence-memory'
          ? 'Sequence Memory'
          : 'Find the Different One',
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

  const gameTitles: Record<string, { title: string; instruction: string }> = {
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
  };

  const currentInfo = gameTitles[gameId] || gameTitles['memory-match'];

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-3 border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/games"
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-800 transition-colors border border-slate-300"
            aria-label="Back to Games"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentInfo.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-semibold">
              Difficulty: Level {difficulty} (Adaptive)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-300 text-lg font-bold text-slate-800">
            <Clock className="w-5 h-5 text-blue-700" />
            <span>{elapsedTime}s</span>
          </div>

          <button
            type="button"
            onClick={() => initGame(difficulty)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl border border-slate-300 text-lg font-bold text-slate-800 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Senior Voice Instructions Card */}
      <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-7 h-7 text-blue-700 flex-shrink-0 mt-0.5" />
          <p className="text-lg text-blue-950 font-semibold leading-snug">
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
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-slate-200 shadow-lg min-h-[420px] flex flex-col items-center justify-center">
        {/* ===================== GAME 1 ARENA ===================== */}
        {gameId === 'memory-match' && (
          <div
            className={`grid gap-4 sm:gap-6 w-full max-w-2xl ${
              cards.length <= 8 ? 'grid-cols-4' : cards.length <= 12 ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-4'
            }`}
          >
            {cards.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(idx)}
                disabled={card.flipped || card.matched}
                className={`h-28 sm:h-36 rounded-2xl text-4xl sm:text-5xl font-bold flex items-center justify-center transition-all duration-300 shadow-md border-3 ${
                  card.matched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-90 scale-95'
                    : card.flipped
                    ? 'bg-amber-100 border-amber-400 text-slate-900 scale-105'
                    : 'bg-blue-700 hover:bg-blue-800 border-blue-900 text-white hover:scale-102'
                }`}
                aria-label={`Card ${idx + 1}`}
              >
                {card.flipped || card.matched ? card.icon : '❓'}
              </button>
            ))}
          </div>
        )}

        {/* ===================== GAME 2 ARENA ===================== */}
        {gameId === 'sequence-memory' && (
          <div className="space-y-8 w-full max-w-md text-center">
            <div className="text-xl font-black text-slate-800">
              {isShowingSequence ? (
                <span className="text-blue-700 animate-pulse">👀 Memorize the light pattern...</span>
              ) : (
                <span className="text-teal-700">👉 Now tap the tiles in the same sequence!</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { id: 0, color: 'bg-blue-500', active: 'bg-blue-300 ring-8 ring-blue-300 scale-105' },
                { id: 1, color: 'bg-emerald-500', active: 'bg-emerald-300 ring-8 ring-emerald-300 scale-105' },
                { id: 2, color: 'bg-amber-500', active: 'bg-amber-300 ring-8 ring-amber-300 scale-105' },
                { id: 3, color: 'bg-rose-500', active: 'bg-rose-300 ring-8 ring-rose-300 scale-105' },
              ].map((pad) => {
                const isActive = activePad === pad.id;
                return (
                  <button
                    key={pad.id}
                    type="button"
                    disabled={isShowingSequence}
                    onClick={() => handlePadClick(pad.id)}
                    className={`h-36 sm:h-44 rounded-3xl shadow-lg border-4 border-slate-800/20 transition-all ${
                      pad.color
                    } ${isActive ? pad.active : 'opacity-85 hover:opacity-100 active:scale-95'}`}
                    aria-label={`Color tile ${pad.id + 1}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== GAME 3 ARENA ===================== */}
        {gameId === 'different-one' && (
          <div className="space-y-6 w-full max-w-xl text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-950 px-4 py-1.5 rounded-full font-bold text-base">
              <span>Round {differentRound} of 3</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Which one is different?
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
              {differentOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOddOption(opt.isOdd)}
                  className="h-32 sm:h-36 bg-slate-50 hover:bg-amber-50 border-3 border-slate-300 hover:border-amber-500 rounded-3xl text-5xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                  aria-label="Selection option"
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>
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
