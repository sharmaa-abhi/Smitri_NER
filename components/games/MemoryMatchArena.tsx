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

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setTotalAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (newCards[firstIdx].icon === newCards[secondIdx].icon) {
        setTimeout(() => {
          newCards[firstIdx].matched = true;
          newCards[secondIdx].matched = true;
          setCards([...newCards]);
          setFlippedCards([]);

          if (newCards.every((c) => c.matched)) {
            onFinish({
              accuracy: Math.max(50, 100 - mistakes * 8),
              mistakes,
              totalAttempts: totalAttempts + 1,
            });
          }
        }, 500);
      } else {
        setMistakes((prev) => prev + 1);
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
    <div
      className={`grid gap-4 sm:gap-6 w-full max-w-2xl ${
        cards.length <= 8 ? 'grid-cols-4' : cards.length <= 12 ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-4'
      }`}
    >
      {cards.map((card, idx) => (
        <button
          key={card.id}
          type="button"
          onClick={() => handleCardClick(idx)}
          disabled={card.flipped || card.matched}
          className={`h-28 sm:h-36 rounded-2xl text-4xl sm:text-5xl font-bold flex items-center justify-center transition-all duration-300 shadow-md border-3 ${
            card.matched
              ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-90 scale-95'
              : card.flipped
              ? 'bg-amber-100 border-amber-400 text-slate-900 scale-105'
              : 'bg-blue-700 hover:bg-blue-800 border-blue-900 text-white hover:scale-102'
          }`}
          aria-label={`Card ${idx + 1}`}
        >
          {card.flipped || card.matched ? card.icon : '❓'}
        </button>
      ))}
    </div>
  );
}
