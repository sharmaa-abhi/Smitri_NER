"use client";

import { useState, useEffect } from 'react';
import { Grid3X3 } from 'lucide-react';
import { FinishGameStats } from '@/types/games';
import { sampleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function MatrixPatternArena({ difficulty, onFinish }: Props) {
  const [targetCells, setTargetCells] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(true);
  const [countdown, setCountdown] = useState(4);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const litCount = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
    const allCells = Array.from({ length: 9 }, (_, i) => i);
    const chosen = sampleArray(allCells, litCount);
    setTargetCells(chosen);
    setSelectedCells([]);
    setIsShowingPattern(true);
    setCountdown(4);
    setMistakes(0);
    setTotalAttempts(0);

    let count = 4;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsShowingPattern(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [difficulty]);

  const handleCellClick = (cellIdx: number) => {
    if (isShowingPattern || selectedCells.includes(cellIdx)) return;

    setTotalAttempts((prev) => prev + 1);
    const newSelected = [...selectedCells, cellIdx];
    setSelectedCells(newSelected);

    if (!targetCells.includes(cellIdx)) {
      setMistakes((prev) => prev + 1);
    }

    const allCorrect = targetCells.every((c) => newSelected.includes(c));
    if (allCorrect) {
      setTimeout(() => {
        onFinish({
          accuracy: Math.max(50, 100 - mistakes * 12),
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      }, 500);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md text-center">
      <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-950 px-4 py-1.5 rounded-full font-bold text-sm">
        <Grid3X3 className="w-4 h-4 text-purple-700" />
        <span>
          {isShowingPattern
            ? `Memorize glowing squares: ${countdown}s`
            : 'Tap all squares that were glowing!'}
        </span>
      </div>

      <h3 className="text-2xl font-black text-slate-900">
        {isShowingPattern ? 'Watch the Pattern' : 'Where were the glowing tiles?'}
      </h3>

      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-100 rounded-3xl border-3 border-slate-300 max-w-xs mx-auto">
        {Array.from({ length: 9 }, (_, idx) => {
          const isTarget = targetCells.includes(idx);
          const isSelected = selectedCells.includes(idx);

          let cellBg = 'bg-white border-slate-300';
          if (isShowingPattern && isTarget) {
            cellBg = 'bg-purple-600 border-purple-800 ring-4 ring-purple-300 text-white';
          } else if (!isShowingPattern && isSelected) {
            cellBg = isTarget
              ? 'bg-emerald-500 border-emerald-700 text-white ring-4 ring-emerald-200'
              : 'bg-rose-500 border-rose-700 text-white';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isShowingPattern}
              onClick={() => handleCellClick(idx)}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 shadow-md transition-all flex items-center justify-center text-3xl font-bold ${cellBg} ${
                !isShowingPattern ? 'hover:scale-105 active:scale-95' : ''
              }`}
              aria-label={`Grid tile ${idx + 1}`}
            >
              {!isShowingPattern && isSelected && (isTarget ? '✓' : '✗')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
