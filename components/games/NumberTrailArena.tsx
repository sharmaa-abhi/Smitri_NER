"use client";

import { useState, useEffect } from 'react';
import { Hash } from 'lucide-react';
import { FinishGameStats } from '@/types/games';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function NumberTrailArena({ difficulty, onFinish }: Props) {
  const [trailNumbers, setTrailNumbers] = useState<Array<{ num: number; x: number; y: number; tapped: boolean }>>([]);
  const [nextExpectedNumber, setNextExpectedNumber] = useState(1);
  const [trailErrorFlash, setTrailErrorFlash] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const totalCount = difficulty === 1 ? 5 : difficulty === 2 ? 7 : 9;
    setNextExpectedNumber(1);
    setMistakes(0);
    setTotalAttempts(0);

    const positions: Array<{ x: number; y: number }> = [];
    const cols = 3;
    for (let i = 0; i < totalCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = 18 + col * 32 + (Math.random() * 8 - 4);
      const y = 18 + row * 28 + (Math.random() * 8 - 4);
      positions.push({ x: Math.max(10, Math.min(85, x)), y: Math.max(10, Math.min(85, y)) });
    }

    const shuffledPositions = shuffleArray(positions);
    const list = Array.from({ length: totalCount }, (_, i) => ({
      num: i + 1,
      x: shuffledPositions[i].x,
      y: shuffledPositions[i].y,
      tapped: false,
    }));

    setTrailNumbers(list);
  }, [difficulty]);

  const handleClick = (num: number) => {
    setTotalAttempts((prev) => prev + 1);

    if (num === nextExpectedNumber) {
      const updated = trailNumbers.map((item) =>
        item.num === num ? { ...item, tapped: true } : item
      );
      setTrailNumbers(updated);
      const next = nextExpectedNumber + 1;
      setNextExpectedNumber(next);

      if (next > trailNumbers.length) {
        setTimeout(() => {
          onFinish({
            accuracy: Math.max(60, 100 - mistakes * 10),
            mistakes,
            totalAttempts: totalAttempts + 1,
          });
        }, 400);
      }
    } else {
      setMistakes((prev) => prev + 1);
      setTrailErrorFlash(num);
      setTimeout(() => setTrailErrorFlash(null), 500);
    }
  };

  return (
    <div className="w-full max-w-xl text-center space-y-4">
      <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-950 px-4 py-1.5 rounded-full font-bold text-sm">
        <Hash className="w-4 h-4 text-indigo-700" />
        <span>Next Number to Tap: <strong className="text-lg text-indigo-800 ml-1">{nextExpectedNumber}</strong></span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 font-medium">
        Tap the stones in numerical order from 1 to {trailNumbers.length}.
      </p>

      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-sky-50 to-indigo-50/40 rounded-3xl border-3 border-indigo-200 overflow-hidden shadow-inner mt-2">
        {trailNumbers.map((stone) => {
          const isTapped = stone.tapped;
          const isFlash = trailErrorFlash === stone.num;

          return (
            <button
              key={stone.num}
              type="button"
              onClick={() => handleClick(stone.num)}
              disabled={isTapped}
              style={{
                left: `${stone.x}%`,
                top: `${stone.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full font-black text-xl sm:text-2xl shadow-lg border-3 transition-all flex items-center justify-center ${
                isTapped
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-900 opacity-60 scale-90'
                  : isFlash
                  ? 'bg-rose-500 border-rose-700 text-white animate-bounce'
                  : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-800 text-white hover:scale-110 active:scale-95'
              }`}
              aria-label={`Number ${stone.num}`}
            >
              {isTapped ? '✓' : stone.num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
