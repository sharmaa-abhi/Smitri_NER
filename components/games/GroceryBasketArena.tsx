"use client";

import { useState, useEffect } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { GROCERY_ITEMS_BY_LEVEL, GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function GroceryBasketArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['grocery-basket']?.[currentDiff];

  const targetCount = currentDiff === 1 ? 2 : currentDiff === 2 ? 3 : currentDiff === 3 ? 4 : currentDiff === 4 ? 5 : 6;
  const shelfCount = currentDiff === 1 ? 5 : currentDiff === 2 ? 6 : currentDiff === 3 ? 8 : currentDiff === 4 ? 10 : 12;
  const initialCountdown = currentDiff === 1 ? 8 : currentDiff === 2 ? 7 : currentDiff === 3 ? 6 : 5;

  const [targetItems, setTargetItems] = useState<Array<{ name: string; icon: string }>>([]);
  const [options, setOptions] = useState<Array<{ name: string; icon: string; selected: boolean }>>([]);
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [countdown, setCountdown] = useState(initialCountdown);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const itemPool = GROCERY_ITEMS_BY_LEVEL[currentDiff] || GROCERY_ITEMS_BY_LEVEL[1];

    const shuffled = shuffleArray(itemPool);
    const targets = shuffled.slice(0, targetCount);
    setTargetItems(targets);

    // Shelf items = targets + decoys from the pool
    const decoys = shuffled.slice(targetCount, targetCount + (shelfCount - targetCount));
    const shelfPool = shuffleArray([...targets, ...decoys]);
    setOptions(shelfPool.map((item) => ({ ...item, selected: false })));

    setIsMemorizing(true);
    setCountdown(initialCountdown);
    setMistakes(0);
    setTotalAttempts(0);

    let count = initialCountdown;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsMemorizing(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentDiff]);

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
    <div className="space-y-6 w-full max-w-2xl text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#10B981' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <ShoppingBag className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>
            {isMemorizing ? `Memorize Basket: Closing in ${countdown}s` : `Find Your ${targetItems.length} Basket Items`}
          </span>
        </div>
      </div>

      {isMemorizing ? (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
              What is in your market basket?
            </h3>
            <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
              {levelMeta?.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {targetItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#E6F4F1] border-2 border-[#93CEC5] rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2 min-w-[120px] sm:min-w-[130px] shadow-md transform hover:scale-105 transition-transform"
              >
                <span className="text-5xl">{item.icon}</span>
                <span className="text-sm font-bold text-[#0B534B]">{item.name}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#5A6A66]">
            Take a deep breath and gently look at the items. The market shelf will appear shortly.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
              Select your basket items from the shelf:
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
              Tap each item you placed into your basket. Found: {options.filter(o => o.selected && targetItems.some(t => t.name === o.name)).length} of {targetItems.length}
            </p>
          </div>

          <div className={`grid gap-3.5 pt-2 ${options.length <= 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-5'}`}>
            {options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleItem(opt.name)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all shadow-sm ${
                  opt.selected
                    ? 'bg-[#ECFDF5] border-[#10B981] scale-105 shadow-md ring-2 ring-[#A7F3D0]'
                    : 'bg-white hover:bg-[#F6F8F7] border-[#D5DFDC] hover:scale-102'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{opt.icon}</span>
                <span className="text-xs sm:text-sm font-bold text-[#111615] text-center leading-tight">{opt.name}</span>
                {opt.selected && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                    <Check className="w-3 h-3" />
                    <span>In Basket</span>
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
