"use client";

import { useState, useEffect } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { FinishGameStats } from '@/types/games';
import { GROCERY_ITEMS } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function GroceryBasketArena({ difficulty, onFinish }: Props) {
  const [targetItems, setTargetItems] = useState<Array<{ name: string; icon: string }>>([]);
  const [options, setOptions] = useState<Array<{ name: string; icon: string; selected: boolean }>>([]);
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [countdown, setCountdown] = useState(6);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const targetCount = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
    const shuffled = shuffleArray(GROCERY_ITEMS);
    const targets = shuffled.slice(0, targetCount);
    setTargetItems(targets);

    const shelfPool = shuffleArray([...targets, ...shuffled.slice(targetCount, targetCount + 3)]);
    setOptions(shelfPool.map((item) => ({ ...item, selected: false })));

    setIsMemorizing(true);
    setCountdown(6);
    setMistakes(0);
    setTotalAttempts(0);

    let count = 6;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsMemorizing(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [difficulty]);

  const toggleItem = (name: string) => {
    if (isMemorizing) return;
    setTotalAttempts((prev) => prev + 1);

    const targetSet = new Set(targetItems.map((t) => t.name));
    const isTarget = targetSet.has(name);
    const updated = options.map((opt) =>
      opt.name === name ? { ...opt, selected: !opt.selected } : opt
    );
    setOptions(updated);

    if (!isTarget) {
      setMistakes((prev) => prev + 1);
    }

    const selectedTargetCount = updated.filter(
      (opt) => opt.selected && targetSet.has(opt.name)
    ).length;

    if (selectedTargetCount === targetItems.length) {
      setTimeout(() => {
        onFinish({
          accuracy: Math.max(50, 100 - mistakes * 10),
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      }, 400);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-2xl text-center">
      {isMemorizing ? (
        <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-950 px-4 py-1.5 rounded-full font-bold text-sm">
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span>Memorize Items: Closing in {countdown}s</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            What is in your market basket?
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {targetItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-emerald-50 border-3 border-emerald-400 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2 min-w-[130px] shadow-md"
              >
                <span className="text-5xl">{item.icon}</span>
                <span className="text-sm font-bold text-emerald-950">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-950 px-4 py-1.5 rounded-full font-bold text-sm">
            <span>Tap all items that were in your basket</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            Select your basket items:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            {options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleItem(opt.name)}
                className={`p-4 rounded-2xl border-3 flex flex-col items-center gap-2 transition-all shadow-sm ${
                  opt.selected
                    ? 'bg-emerald-100 border-emerald-500 scale-105'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-300'
                }`}
              >
                <span className="text-4xl">{opt.icon}</span>
                <span className="text-sm font-bold text-slate-900">{opt.name}</span>
                {opt.selected && (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                    <span>Selected</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
