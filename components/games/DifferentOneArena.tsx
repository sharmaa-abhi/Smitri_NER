"use client";

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { DIFFERENT_ONE_BY_LEVEL, GAME_LEVEL_CONFIG } from '@/data/gameBanks';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function DifferentOneArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['different-one']?.[currentDiff];

  const [round, setRound] = useState(1);
  const [options, setOptions] = useState<Array<{ id: number; icon: string; isOdd: boolean }>>([]);
  const [roundTheme, setRoundTheme] = useState<string>('');
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    setupRound(currentDiff, 1);
    setMistakes(0);
    setTotalAttempts(0);
  }, [currentDiff]);

  const setupRound = (diff: DifficultyLevel, roundNum: number) => {
    setRound(roundNum);
    const sets = DIFFERENT_ONE_BY_LEVEL[diff] || DIFFERENT_ONE_BY_LEVEL[1];
    const setItem = sets[(roundNum - 1) % sets.length];
    setRoundTheme(setItem.theme);

    // Level 1: 4 cards (2x2), Level 2-3: 6 cards (2x3), Level 4-5: 9 cards (3x3)
    const count = diff === 1 ? 4 : diff <= 3 ? 6 : 9;
    const oddPosition = Math.floor(Math.random() * count);

    const opts = Array.from({ length: count }, (_, i) => ({
      id: i,
      icon: i === oddPosition ? setItem.oddIcon : setItem.baseIcon,
      isOdd: i === oddPosition,
    }));
    setOptions(opts);
  };

  const handleSelect = (isOdd: boolean) => {
    setTotalAttempts((prev) => prev + 1);

    if (isOdd) {
      if (round >= 3) {
        onFinish({
          accuracy: Math.max(60, 100 - mistakes * 12),
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      } else {
        setupRound(currentDiff, round + 1);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-xl text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#D97706' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <Eye className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>Visual Discrimination: Round {round} of 3</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
          Which one is different?
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          Challenge: <span className="underline decoration-[#D97706]">{roundTheme}</span>
        </p>
        <p className="text-xs text-[#5A6A66]">
          {levelMeta?.subtitle}
        </p>
      </div>

      {/* Dynamic Grid: 2x2 for 4 cards, 2x3 for 6 cards, 3x3 for 9 cards */}
      <div
        className={`gap-4 pt-2 mx-auto grid ${
          options.length <= 4
            ? 'grid-cols-2 max-w-xs'
            : options.length <= 6
            ? 'grid-cols-3 max-w-md'
            : 'grid-cols-3 max-w-lg'
        }`}
      >
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSelect(opt.isOdd)}
            className={`bg-white hover:bg-[#E6F4F1] border-2 border-[#D5DFDC] hover:border-[#0B534B] rounded-2xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
              options.length <= 4
                ? 'h-32 sm:h-36 text-5xl sm:text-6xl'
                : options.length <= 6
                ? 'h-24 sm:h-28 text-4xl sm:text-5xl'
                : 'h-20 sm:h-24 text-3xl sm:text-4xl'
            }`}
            aria-label="Selection card"
          >
            {opt.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
