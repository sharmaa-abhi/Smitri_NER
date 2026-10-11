"use client";

import { useState, useEffect } from 'react';
import { Hash } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function NumberTrailArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['number-trail']?.[currentDiff];

  const totalCount = currentDiff === 1 ? 4 : currentDiff === 2 ? 6 : currentDiff === 3 ? 8 : currentDiff === 4 ? 10 : 12;

  const [trailNumbers, setTrailNumbers] = useState<Array<{ num: number; x: number; y: number; tapped: boolean }>>([]);
  const [nextExpectedNumber, setNextExpectedNumber] = useState(1);
  const [trailErrorFlash, setTrailErrorFlash] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    setNextExpectedNumber(1);
    setMistakes(0);
    setTotalAttempts(0);

    const positions: Array<{ x: number; y: number }> = [];
    const cols = currentDiff >= 4 ? 4 : 3;
    const rows = Math.ceil(totalCount / cols);

    for (let i = 0; i < totalCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = 16 + (col * (70 / Math.max(1, cols - 1))) + (Math.random() * 6 - 3);
      const y = 16 + (row * (68 / Math.max(1, rows - 1))) + (Math.random() * 6 - 3);
      positions.push({ x: Math.max(12, Math.min(88, x)), y: Math.max(12, Math.min(88, y)) });
    }

    const shuffledPositions = shuffleArray(positions);
    const list = Array.from({ length: totalCount }, (_, i) => ({
      num: i + 1,
      x: shuffledPositions[i].x,
      y: shuffledPositions[i].y,
      tapped: false,
    }));

    setTrailNumbers(list);
  }, [currentDiff, totalCount]);

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
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#10B981' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <Hash className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>Next Stone: <strong className="text-base text-[#0B534B] ml-1">#{nextExpectedNumber}</strong> of {totalCount}</span>
        </div>
      </div>

      <div className="space-y-0.5">
        <h3 className="text-2xl font-black text-[#111615]">
          Step on the River Stones
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          {levelMeta?.subtitle}
        </p>
      </div>

      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-[#F2F8F6] to-[#E6F4F1] rounded-3xl border-2 border-[#D5DFDC] overflow-hidden shadow-inner mt-2">
        {/* Subtle decorative river ripples */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-[#0B534B]/30 animate-ping" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full border-2 border-[#0B534B]/20" />
        </div>

        {trailNumbers.map((stone) => {
          const isTapped = stone.tapped;
          const isFlash = trailErrorFlash === stone.num;
          const isNext = stone.num === nextExpectedNumber;

          // In Level 1, give gentle breathing pulse guidance to the next stone
          const pulseHint = currentDiff === 1 && isNext && !isTapped;

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
              className={`absolute rounded-full font-black shadow-lg border-2 transition-all flex items-center justify-center ${
                currentDiff >= 4
                  ? 'w-11 h-11 sm:w-13 sm:h-13 text-base sm:text-lg'
                  : currentDiff >= 2
                  ? 'w-13 h-13 sm:w-15 sm:h-15 text-lg sm:text-xl'
                  : 'w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl'
              } ${
                isTapped
                  ? 'bg-[#ECFDF5] border-[#10B981] text-[#059669] opacity-70 scale-90'
                  : isFlash
                  ? 'bg-red-500 border-red-700 text-white animate-bounce'
                  : pulseHint
                  ? 'bg-[#0B534B] border-[#93CEC5] ring-4 ring-[#A7F3D0] text-white animate-pulse scale-110'
                  : 'bg-[#0B534B] hover:bg-[#08433C] border-[#06342E] text-white hover:scale-110 active:scale-95'
              }`}
              aria-label={`Stone ${stone.num}`}
            >
              {isTapped ? '✓' : stone.num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
