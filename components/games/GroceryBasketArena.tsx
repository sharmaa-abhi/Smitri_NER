"use client";

import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Check, CheckCircle2, Eye, HelpCircle } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { GROCERY_ITEMS_BY_LEVEL, GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';
import { playGentleSuccessSound, playGentleRetrySound, playCelebrationSound } from '@/lib/gameAudio';

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
  const [shelfItems, setShelfItems] = useState<Array<{ name: string; icon: string }>>([]);
  const [selectedTargetNames, setSelectedTargetNames] = useState<string[]>([]);
  const [recentWrongItem, setRecentWrongItem] = useState<string | null>(null);

  const [isMemorizing, setIsMemorizing] = useState(true);
  const [isShowingPeek, setIsShowingPeek] = useState(false);
  const [countdown, setCountdown] = useState(initialCountdown);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isFinishing, setIsFinishing] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const itemPool = GROCERY_ITEMS_BY_LEVEL[currentDiff] || GROCERY_ITEMS_BY_LEVEL[1];
    const shuffled = shuffleArray(itemPool);
    const targets = shuffled.slice(0, targetCount);
    setTargetItems(targets);

    const decoys = shuffled.slice(targetCount, targetCount + (shelfCount - targetCount));
    const shelfPool = shuffleArray([...targets, ...decoys]);
    setShelfItems(shelfPool);

    setSelectedTargetNames([]);
    setRecentWrongItem(null);
    setIsMemorizing(true);
    setIsShowingPeek(false);
    setCountdown(initialCountdown);
    setMistakes(0);
    setTotalAttempts(0);
    setIsFinishing(false);
    setFeedbackMessage('Memorize the items in your basket.');

    let count = initialCountdown;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsMemorizing(false);
        setFeedbackMessage(`Find your ${targets.length} basket items on the market shelf.`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentDiff, targetCount, shelfCount, initialCountdown]);

  const handleShelfItemClick = (name: string) => {
    if (isMemorizing || isFinishing) return;

    // Check if already found
    if (selectedTargetNames.includes(name)) return;

    const newAttempts = totalAttempts + 1;
    setTotalAttempts(newAttempts);

    const isTarget = targetItems.some((t) => t.name === name);

    if (isTarget) {
      playGentleSuccessSound();
      const updatedTargets = [...selectedTargetNames, name];
      setSelectedTargetNames(updatedTargets);
      setRecentWrongItem(null);

      const remaining = targetItems.length - updatedTargets.length;
      if (remaining === 0) {
        setIsFinishing(true);
        playCelebrationSound();
        setFeedbackMessage('🎉 You found all items from your basket! Great shopping!');
        timerRef.current = setTimeout(() => {
          onFinish({
            accuracy: Math.max(50, 100 - mistakes * 10),
            mistakes,
            totalAttempts: newAttempts,
          });
        }, 700);
      } else {
        setFeedbackMessage(`✓ Correct! Found ${name}. ${remaining} item${remaining > 1 ? 's' : ''} left to find.`);
      }
    } else {
      playGentleRetrySound();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setRecentWrongItem(name);
      setFeedbackMessage(`"${name}" was not in your basket. Keep looking!`);

      setTimeout(() => {
        setRecentWrongItem(null);
      }, 900);
    }
  };

  const handleTogglePeek = () => {
    setIsShowingPeek((prev) => !prev);
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
          <ShoppingBag className="w-4 h-4 text-[#0B534B]" />
          <span>
            {isMemorizing
              ? `Basket closes in ${countdown}s`
              : `Found ${selectedTargetNames.length} of ${targetItems.length} Items`}
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
              {levelMeta?.subtitle || 'Take a calm look at these grocery items.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {targetItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#E6F4F1] border-2 border-[#93CEC5] rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2 min-w-[120px] sm:min-w-[130px] shadow-md"
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
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
              Select your basket items from the shelf
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
              Tap each item you had placed in your market basket.
            </p>
          </div>

          {/* Feedback banner */}
          <div
            className="w-full max-w-lg mx-auto py-2 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#F2F8F6] text-[#0B534B] border border-[#93CEC5] flex items-center justify-center gap-2 text-center"
            role="status"
          >
            <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
            <span>{feedbackMessage}</span>
          </div>

          {/* Market Shelf Items Grid */}
          <div
            className={`grid gap-3 sm:gap-4 pt-2 ${
              shelfItems.length <= 6
                ? 'grid-cols-2 sm:grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-5'
            }`}
          >
            {shelfItems.map((opt, idx) => {
              const isFound = selectedTargetNames.includes(opt.name);
              const isWrongFlash = recentWrongItem === opt.name;

              let itemStyles = 'bg-white hover:bg-[#F2F8F6] border-[#D5DFDC] text-[#111615] hover:border-[#0B534B]';
              if (isFound) {
                itemStyles = 'bg-[#ECFDF5] border-3 border-[#10B981] text-[#047857] ring-2 ring-[#A7F3D0] shadow-sm';
              } else if (isWrongFlash) {
                itemStyles = 'bg-[#FFFBEB] border-3 border-[#F59E0B] text-[#92400E] ring-2 ring-[#FDE68A]';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isFound || isFinishing}
                  onClick={() => handleShelfItemClick(opt.name)}
                  aria-label={`${opt.name}${isFound ? ', found in basket' : ''}`}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2 ${itemStyles} ${
                    isFound ? 'cursor-default opacity-90' : 'hover:scale-102 active:scale-98'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl">{opt.icon}</span>
                  <span className="text-xs sm:text-sm font-bold text-center leading-tight">
                    {opt.name}
                  </span>
                  {isFound && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#047857] mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>In Basket</span>
                    </div>
                  )}
                  {isWrongFlash && (
                    <span className="text-[10px] font-bold text-[#D97706] mt-0.5">
                      Not in basket
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Peek Basket Reminder for Seniors */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTogglePeek}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6F4F1] hover:bg-[#C2E5DF] text-[#0B534B] border border-[#93CEC5] text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isShowingPeek ? 'Hide Basket Peek' : 'Need a Peek at Your Basket?'}</span>
            </button>

            {isShowingPeek && (
              <div className="mt-3 p-4 bg-[#F2FAF6] border-2 border-[#10B981]/40 rounded-2xl max-w-md mx-auto space-y-2 animate-fade-in">
                <span className="text-xs font-extrabold text-[#0B534B] block">Basket Memory Reminder:</span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {targetItems.map((t, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                        selectedTargetNames.includes(t.name)
                          ? 'bg-[#ECFDF5] text-[#047857] border-[#10B981] line-through'
                          : 'bg-white text-[#111615] border-[#93CEC5]'
                      }`}
                    >
                      {t.icon} {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
