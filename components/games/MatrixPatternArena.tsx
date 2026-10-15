"use client";

import { useState, useEffect, useRef } from 'react';
import { Grid3X3, Eye, CheckCircle2, Sparkles } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import { sampleArray } from '@/lib/algorithms/shuffle';
import { playGentleSuccessSound, playGentleRetrySound, playCelebrationSound } from '@/lib/gameAudio';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function MatrixPatternArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['pattern-match']?.[currentDiff];

  const gridSize = currentDiff >= 4 ? 4 : 3;
  const totalCells = gridSize * gridSize; // 9 or 16

  const litCount = currentDiff === 1 ? 3 : currentDiff === 2 ? 4 : currentDiff === 3 ? 5 : currentDiff === 4 ? 5 : 6;
  const initialCountdown = currentDiff === 1 ? 5 : currentDiff === 2 ? 4 : currentDiff === 3 ? 4 : currentDiff === 4 ? 4 : 3;

  const [targetCells, setTargetCells] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(true);
  const [isShowingHint, setIsShowingHint] = useState(false);
  const [countdown, setCountdown] = useState(initialCountdown);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Memorize the illuminated tiles.');
  const [isFinishing, setIsFinishing] = useState(false);

  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const allCells = Array.from({ length: totalCells }, (_, i) => i);
    const chosen = sampleArray(allCells, litCount);
    setTargetCells(chosen);
    setSelectedCells([]);
    setIsShowingPattern(true);
    setIsShowingHint(false);
    setCountdown(initialCountdown);
    setMistakes(0);
    setTotalAttempts(0);
    setIsFinishing(false);
    setFeedbackMessage('Memorize the glowing squares before they fade.');

    let count = initialCountdown;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsShowingPattern(false);
        setFeedbackMessage(`Tap each of the ${chosen.length} squares that lit up.`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, [currentDiff, totalCells, litCount, initialCountdown]);

  const handleCellClick = (cellIdx: number) => {
    if (isShowingPattern || isFinishing || selectedCells.includes(cellIdx)) return;

    const newAttempts = totalAttempts + 1;
    setTotalAttempts(newAttempts);
    const newSelected = [...selectedCells, cellIdx];
    setSelectedCells(newSelected);

    const isTarget = targetCells.includes(cellIdx);

    if (isTarget) {
      playGentleSuccessSound();
      const correctSelected = newSelected.filter((c) => targetCells.includes(c)).length;
      const remaining = targetCells.length - correctSelected;

      if (remaining === 0) {
        setIsFinishing(true);
        playCelebrationSound();
        setFeedbackMessage('🎉 Magnificent! You remembered all the glowing squares!');
        finishTimerRef.current = setTimeout(() => {
          onFinish({
            accuracy: Math.max(50, 100 - mistakes * 10),
            mistakes,
            totalAttempts: newAttempts,
          });
        }, 700);
      } else {
        setFeedbackMessage(`✓ Good recall! ${remaining} square${remaining > 1 ? 's' : ''} remaining.`);
      }
    } else {
      playGentleRetrySound();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setFeedbackMessage('That square was not glowing. Look for the remaining lit squares!');
    }
  };

  const handleHintPeek = () => {
    if (isShowingPattern || isFinishing) return;
    setIsShowingHint(true);
    setTimeout(() => {
      setIsShowingHint(false);
    }, 1400);
  };

  const correctFoundCount = selectedCells.filter((c) => targetCells.includes(c)).length;

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
          <Grid3X3 className="w-4 h-4 text-[#0B534B]" />
          <span>
            {isShowingPattern
              ? `Pattern closes in ${countdown}s`
              : `Found ${correctFoundCount} of ${targetCells.length} Squares`}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black text-[#111615]">
          {isShowingPattern ? 'Observe the Glowing Squares' : 'Where were the glowing tiles?'}
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          {levelMeta?.subtitle || 'Recall the positions of the illuminated grid squares.'}
        </p>
      </div>

      {/* Gentle In-Game Guidance Message */}
      <div
        className="w-full py-2 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#F2F8F6] text-[#0B534B] border border-[#93CEC5] flex items-center justify-center gap-2 text-center"
        role="status"
      >
        <Sparkles className="w-4 h-4 text-[#D97706] flex-shrink-0" />
        <span>{feedbackMessage}</span>
      </div>

      {/* Matrix Grid */}
      <div
        className={`gap-3 sm:gap-4 p-4 bg-[#F6F8F7] rounded-3xl border-2 border-[#D5DFDC] mx-auto grid ${
          gridSize === 4 ? 'grid-cols-4 max-w-sm' : 'grid-cols-3 max-w-xs'
        }`}
      >
        {Array.from({ length: totalCells }, (_, idx) => {
          const isTarget = targetCells.includes(idx);
          const isSelected = selectedCells.includes(idx);
          const isGlowing = isShowingPattern || isShowingHint;

          let cellBg = 'bg-white border-[#D5DFDC] text-[#111615]';
          if (isGlowing && isTarget) {
            cellBg = 'bg-[#0B534B] border-[#08433C] ring-4 ring-[#93CEC5] text-white shadow-lg';
          } else if (!isGlowing && isSelected) {
            cellBg = isTarget
              ? 'bg-[#ECFDF5] border-3 border-[#10B981] text-[#047857] ring-2 ring-[#A7F3D0]'
              : 'bg-[#FFFBEB] border-2 border-[#F59E0B] text-[#92400E]';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isShowingPattern || isFinishing}
              onClick={() => handleCellClick(idx)}
              className={`rounded-2xl border-2 shadow-sm transition-all flex items-center justify-center font-black focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B534B] ${cellBg} ${
                gridSize === 4
                  ? 'w-16 h-16 sm:w-18 sm:h-18 text-2xl'
                  : 'w-20 h-20 sm:w-24 sm:h-24 text-3xl'
              } ${
                !isShowingPattern && !isSelected && !isFinishing
                  ? 'hover:scale-104 active:scale-96 cursor-pointer'
                  : 'cursor-default'
              }`}
              aria-label={`Tile row ${Math.floor(idx / gridSize) + 1}, column ${(idx % gridSize) + 1}${
                isSelected ? (isTarget ? ', correct glowing tile' : ', not glowing') : ''
              }`}
            >
              {!isGlowing && isSelected && (isTarget ? '✓' : '✗')}
              {isGlowing && isTarget && '✦'}
            </button>
          );
        })}
      </div>

      {/* Senior Hint Button */}
      {!isShowingPattern && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={handleHintPeek}
            disabled={isShowingHint || isFinishing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6F4F1] hover:bg-[#C2E5DF] text-[#0B534B] border border-[#93CEC5] text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            aria-label="Flash the glowing pattern again for a quick hint"
          >
            <Eye className="w-3.5 h-3.5 text-[#0B534B]" />
            <span>{isShowingHint ? 'Glowing...' : 'Need a Quick Pattern Hint?'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
