"use client";

import { useState, useEffect } from 'react';
import { FinishGameStats } from '@/types/games';
import { ICONS_BANK } from '@/data/gameBanks';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function DifferentOneArena({ difficulty, onFinish }: Props) {
  const [round, setRound] = useState(1);
  const [options, setOptions] = useState<Array<{ id: number; icon: string; isOdd: boolean }>>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    setupRound(difficulty, 1);
    setMistakes(0);
    setTotalAttempts(0);
  }, [difficulty]);

  const setupRound = (diff: number, roundNum: number) => {
    setRound(roundNum);
    const count = diff === 1 ? 4 : diff === 2 ? 6 : 8;
    const baseIcon = ICONS_BANK[(roundNum * 2) % ICONS_BANK.length];
    const oddIcon = ICONS_BANK[(roundNum * 2 + 1) % ICONS_BANK.length];
    const oddPosition = Math.floor(Math.random() * count);

    const opts = Array.from({ length: count }, (_, i) => ({
      id: i,
      icon: i === oddPosition ? oddIcon : baseIcon,
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
        setupRound(difficulty, round + 1);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-xl text-center">
      <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-950 px-4 py-1.5 rounded-full font-bold text-base">
        <span>Round {round} of 3</span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
        Which one is different?
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSelect(opt.isOdd)}
            className="h-32 sm:h-36 bg-slate-50 hover:bg-amber-50 border-3 border-slate-300 hover:border-amber-500 rounded-3xl text-5xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            aria-label="Selection option"
          >
            {opt.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
