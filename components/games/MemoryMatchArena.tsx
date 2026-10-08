"use client";

import { useState, useEffect } from 'react';
import { FinishGameStats } from '@/types/games';
import { ICONS_BANK } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function MemoryMatchArena({ difficulty, onFinish }: Props) {
  const [cards, setCards] = useState<Array<{ id: number; icon: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const pairCount = difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8;
    const selected = ICONS_BANK.slice(0, pairCount);
    const deck = shuffleArray([...selected, ...selected]).map((icon, id) => ({
      id,
      icon,
      flipped: false,
      matched: false,
    }));
    setCards(deck);
    setFlippedCards([]);
    setMistakes(0);
    setTotalAttempts(0);
  }, [difficulty]);

  const [announcement, setAnnouncement] = useState<string>('');

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

  return (
    <div className="w-full flex flex-col items-center">
      {/* Screen Reader Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      <div
        className={`grid gap-4 sm:gap-6 w-full max-w-2xl ${
          cards.length <= 8 ? 'grid-cols-4' : cards.length <= 12 ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-4'
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
              className={`h-28 sm:h-36 rounded-2xl text-4xl sm:text-5xl font-bold flex items-center justify-center transition-all duration-300 shadow-md border-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2 ${
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
