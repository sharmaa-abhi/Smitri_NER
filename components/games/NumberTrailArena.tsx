"use client";

import { useState, useEffect, useRef } from 'react';
import { Hash, CheckCircle2, HelpCircle } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';
import { playGentleSuccessSound, playGentleRetrySound, playCelebrationSound } from '@/lib/gameAudio';

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
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Start by tapping river stone #1');
  const [isFinishing, setIsFinishing] = useState(false);

  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setNextExpectedNumber(1);
    setMistakes(0);
    setTotalAttempts(0);
    setIsFinishing(false);
    setFeedbackMessage('Start by tapping river stone #1');

    const positions: Array<{ x: number; y: number }> = [];
    const cols = currentDiff >= 4 ? 4 : 3;
    const rows = Math.ceil(totalCount / cols);

    for (let i = 0; i < totalCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = 16 + (col * (70 / Math.max(1, cols - 1))) + (Math.random() * 6 - 3);
      const y = 16 + (row * (68 / Math.max(1, rows - 1))) + (Math.random() * 6 - 3);
      positions.push({ x: Math.max(14, Math.min(86, x)), y: Math.max(14, Math.min(86, y)) });
    }

    const shuffledPositions = shuffleArray(positions);
    const list = Array.from({ length: totalCount }, (_, i) => ({
      num: i + 1,
      x: shuffledPositions[i].x,
      y: shuffledPositions[i].y,
      tapped: false,
    }));

    setTrailNumbers(list);
    return () => {
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, [currentDiff, totalCount]);

  const handleClick = (num: number) => {
    if (isFinishing) return;
    const newAttempts = totalAttempts + 1;
    setTotalAttempts(newAttempts);

    if (num === nextExpectedNumber) {
      playGentleSuccessSound();
      const updated = trailNumbers.map((item) =>
        item.num === num ? { ...item, tapped: true } : item
      );
      setTrailNumbers(updated);
      const next = nextExpectedNumber + 1;
      setNextExpectedNumber(next);

      if (next > trailNumbers.length) {
        setIsFinishing(true);
        playCelebrationSound();
        setFeedbackMessage('🎉 Wonderful river crossing! All stones stepped in order!');
        finishTimerRef.current = setTimeout(() => {
          onFinish({
            accuracy: Math.max(60, 100 - mistakes * 10),
            mistakes,
            totalAttempts: newAttempts,
          });
        }, 650);
      } else {
        setFeedbackMessage(`✓ Good step! Now look for stone #${next}.`);
      }
    } else {
      playGentleRetrySound();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setTrailErrorFlash(num);
      setFeedbackMessage(`Take your time! The next stone is #${nextExpectedNumber}.`);
      setTimeout(() => setTrailErrorFlash(null), 600);
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
          <Hash className="w-4 h-4 text-[#0B534B]" />
          <span>
            Next Stone: <strong className="text-base text-[#0B534B] ml-1">#{Math.min(nextExpectedNumber, totalCount)}</strong> of {totalCount}
          </span>
        </div>
      </div>

      <div className="space-y-0.5">
        <h3 className="text-2xl font-black text-[#111615]">
          Step on the River Stones
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          {levelMeta?.subtitle || 'Tap the stones in numerical order from 1 upward.'}
        </p>
      </div>

      {/* Friendly In-Game Guidance Message */}
      <div
        className="w-full py-2 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#F2F8F6] text-[#0B534B] border border-[#93CEC5] flex items-center justify-center gap-2 text-center"
        role="status"
      >
        <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
        <span>{feedbackMessage}</span>
      </div>

      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-[#F2F8F6] to-[#E6F4F1] rounded-3xl border-2 border-[#D5DFDC] overflow-hidden shadow-inner mt-2">
        {/* Soft decorative river water ripples */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-[#0B534B]/30" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full border-2 border-[#0B534B]/20" />
        </div>

        {trailNumbers.map((stone) => {
          const isTapped = stone.tapped;
          const isFlash = trailErrorFlash === stone.num;
          const isNext = stone.num === nextExpectedNumber;

          // In Level 1 and 2, give a gentle glowing pulse to help elders locate the first/next stone
          const pulseHint = currentDiff <= 2 && isNext && !isTapped;

          let stoneStyle = 'bg-[#0B534B] hover:bg-[#08433C] border-[#06342E] text-white hover:scale-108 active:scale-95 shadow-md';
          if (isTapped) {
            stoneStyle = 'bg-[#ECFDF5] border-2 border-[#10B981] text-[#047857] opacity-80 scale-90 cursor-default';
          } else if (isFlash) {
            stoneStyle = 'bg-[#FFFBEB] border-3 border-[#F59E0B] text-[#92400E] ring-4 ring-[#FDE68A] scale-105';
          } else if (pulseHint) {
            stoneStyle = 'bg-[#0B534B] border-3 border-[#93CEC5] ring-4 ring-[#A7F3D0] text-white shadow-xl scale-108';
          }

          return (
            <button
              key={stone.num}
              type="button"
              onClick={() => handleClick(stone.num)}
              disabled={isTapped || isFinishing}
              style={{
                left: `${stone.x}%`,
                top: `${stone.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute rounded-full font-black transition-all flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B534B] ${stoneStyle} ${
                currentDiff >= 4
                  ? 'w-12 h-12 sm:w-14 sm:h-14 text-base sm:text-lg'
                  : currentDiff >= 2
                  ? 'w-14 h-14 sm:w-16 sm:h-16 text-lg sm:text-xl'
                  : 'w-16 h-16 sm:w-18 sm:h-18 text-xl sm:text-2xl'
              }`}
              aria-label={`Stone number ${stone.num}${isTapped ? ', already stepped' : ''}`}
            >
              {isTapped ? '✓' : stone.num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
