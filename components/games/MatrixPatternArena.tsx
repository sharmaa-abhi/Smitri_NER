"use client";

import { useState, useEffect } from 'react';
import { Grid3X3 } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import { sampleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function MatrixPatternArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(3, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['pattern-match']?.[currentDiff];

  const gridSize = currentDiff === 3 ? 4 : 3;
  const totalCells = gridSize * gridSize; // 9 or 16

  const [targetCells, setTargetCells] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(true);
  const [countdown, setCountdown] = useState(currentDiff === 1 ? 5 : 3);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const litCount = currentDiff === 1 ? 3 : currentDiff === 2 ? 5 : 6;
    const initialCountdown = currentDiff === 1 ? 5 : currentDiff === 2 ? 4 : 3;
    const allCells = Array.from({ length: totalCells }, (_, i) => i);
    const chosen = sampleArray(allCells, litCount);
    setTargetCells(chosen);
    setSelectedCells([]);
    setIsShowingPattern(true);
    setCountdown(initialCountdown);
    setMistakes(0);
    setTotalAttempts(0);

    let count = initialCountdown;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsShowingPattern(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentDiff, totalCells]);

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
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#10B981' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <Grid3X3 className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>
            {isShowingPattern
              ? `Memorize Glowing Squares: ${countdown}s`
              : `Tap the ${targetCells.length} Illuminated Squares`}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black text-[#111615]">
          {isShowingPattern ? 'Observe the Pattern' : 'Where were the glowing tiles?'}
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          {levelMeta?.subtitle}
        </p>
      </div>

      <div
        className={`gap-3 sm:gap-4 p-4 bg-[#F6F8F7] rounded-3xl border-2 border-[#D5DFDC] mx-auto grid ${
          gridSize === 4 ? 'grid-cols-4 max-w-sm' : 'grid-cols-3 max-w-xs'
        }`}
      >
        {Array.from({ length: totalCells }, (_, idx) => {
          const isTarget = targetCells.includes(idx);
          const isSelected = selectedCells.includes(idx);

          let cellBg = 'bg-white border-[#D5DFDC]';
          if (isShowingPattern && isTarget) {
            cellBg = 'bg-[#0B534B] border-[#08433C] ring-4 ring-[#93CEC5] text-white shadow-lg animate-pulse';
          } else if (!isShowingPattern && isSelected) {
            cellBg = isTarget
              ? 'bg-[#10B981] border-[#059669] text-white ring-4 ring-[#A7F3D0]'
              : 'bg-red-500 border-red-700 text-white';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isShowingPattern}
              onClick={() => handleCellClick(idx)}
              className={`rounded-2xl border-2 shadow-md transition-all flex items-center justify-center font-bold ${cellBg} ${
                gridSize === 4 ? 'w-16 h-16 sm:w-18 sm:h-18 text-2xl' : 'w-20 h-20 sm:w-24 sm:h-24 text-3xl'
              } ${!isShowingPattern ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}`}
              aria-label={`Grid tile ${idx + 1}`}
            >
              {!isShowingPattern && isSelected && (isTarget ? '✓' : '✗')}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-[#5A6A66]">
        {isShowingPattern
          ? `Lock the visual positions in your memory before the timer reaches 0.`
          : `Selected ${selectedCells.filter(c => targetCells.includes(c)).length} of ${targetCells.length} correct tiles.`}
      </p>
    </div>
  );
}
