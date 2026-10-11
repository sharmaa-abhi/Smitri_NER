"use client";

import { useState, useEffect } from 'react';
import { Shapes } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { ICONS_BANK_BY_LEVEL, GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function MemoryMatchArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['memory-match']?.[currentDiff];

  const [cards, setCards] = useState<Array<{ id: number; icon: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [announcement, setAnnouncement] = useState<string>('');

  useEffect(() => {
    const iconSet = ICONS_BANK_BY_LEVEL[currentDiff] || ICONS_BANK_BY_LEVEL[1];
    const deck = shuffleArray([...iconSet, ...iconSet]).map((icon, id) => ({
      id,
      icon,
      flipped: false,
      matched: false,
    }));
    setCards(deck);
    setFlippedCards([]);
    setMistakes(0);
    setTotalAttempts(0);
  }, [currentDiff]);

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 1) {
      setAnnouncement(`First card flipped: ${newCards[index].icon}`);
    }

    if (newFlipped.length === 2) {
      setTotalAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (newCards[firstIdx].icon === newCards[secondIdx].icon) {
        setAnnouncement(`Match found! Pair of ${newCards[firstIdx].icon}`);
        setTimeout(() => {
          newCards[firstIdx].matched = true;
          newCards[secondIdx].matched = true;
          setCards([...newCards]);
          setFlippedCards([]);

          if (newCards.every((c) => c.matched)) {
            setAnnouncement('All pairs matched! Fantastic work!');
            onFinish({
              accuracy: Math.max(50, 100 - mistakes * 8),
              mistakes,
              totalAttempts: totalAttempts + 1,
            });
          }
        }, 500);
      } else {
        setMistakes((prev) => prev + 1);
        setAnnouncement('Not a match. Cards will flip back.');
        setTimeout(() => {
          newCards[firstIdx].flipped = false;
          newCards[secondIdx].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1100);
      }
    }
  };

  const matchedPairsCount = cards.filter((c) => c.matched).length / 2;
  const totalPairsCount = cards.length / 2;

  return (
    <div className="w-full flex flex-col items-center space-y-5">
      {/* Screen Reader Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#0B534B' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <Shapes className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>Matched {matchedPairsCount} of {totalPairsCount} Pairs</span>
        </div>
      </div>

      <div className="text-center space-y-0.5">
        <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
          Find the Matching Pairs
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          {levelMeta?.subtitle}
        </p>
      </div>

      <div
        className={`grid gap-3 sm:gap-4 w-full max-w-xl mx-auto ${
          cards.length <= 8
            ? 'grid-cols-4 max-w-md'
            : cards.length <= 12
            ? 'grid-cols-4 sm:grid-cols-4 max-w-lg'
            : 'grid-cols-4 max-w-xl'
        }`}
      >
        {cards.map((card, idx) => {
          const cardLabel = card.matched
            ? `Card ${idx + 1}, matched pair of ${card.icon}`
            : card.flipped
            ? `Card ${idx + 1}, revealed ${card.icon}`
            : `Card ${idx + 1}, hidden. Tap to flip`;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(idx)}
              disabled={card.flipped || card.matched}
              className={`rounded-2xl font-bold flex items-center justify-center transition-all duration-300 shadow-md border-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2 ${
                cards.length <= 8
                  ? 'h-28 sm:h-32 text-4xl sm:text-5xl'
                  : cards.length <= 12
                  ? 'h-24 sm:h-28 text-3xl sm:text-4xl'
                  : 'h-20 sm:h-24 text-2xl sm:text-3xl'
              } ${
                card.matched
                  ? 'bg-[#ECFDF5] border-[#10B981] text-[#059669] opacity-90 scale-95'
                  : card.flipped
                  ? 'bg-[#FFFBEB] border-[#D97706] text-[#111615] scale-105 shadow-lg'
                  : 'bg-[#0B534B] hover:bg-[#08433C] border-[#06342E] text-white hover:scale-102'
              }`}
              aria-label={cardLabel}
            >
              {card.flipped || card.matched ? card.icon : '❓'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
