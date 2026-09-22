"use client";

import { useState, useEffect } from 'react';
import { FinishGameStats } from '@/types/games';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function SequenceMemoryArena({ difficulty, onFinish }: Props) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequenceIndex, setUserSequenceIndex] = useState(0);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const length = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
    const newSeq = Array.from({ length }, () => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    setUserSequenceIndex(0);
    setMistakes(0);
    setTotalAttempts(0);
    playSequence(newSeq);
  }, [difficulty]);

  const playSequence = (seq: number[]) => {
    setIsShowingSequence(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < seq.length) {
        setActivePad(seq[step]);
        setTimeout(() => setActivePad(null), 600);
        step++;
      } else {
        clearInterval(interval);
        setIsShowingSequence(false);
      }
    }, 1000);
  };

  const handlePadClick = (padIndex: number) => {
    if (isShowingSequence) return;

    setTotalAttempts((prev) => prev + 1);
    if (padIndex === sequence[userSequenceIndex]) {
      const nextIndex = userSequenceIndex + 1;
      setUserSequenceIndex(nextIndex);

      if (nextIndex === sequence.length) {
        onFinish({
          accuracy: 100 - mistakes * 15,
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      }
    } else {
      setMistakes((prev) => prev + 1);
      setActivePad(-1);
      setTimeout(() => setActivePad(null), 400);
      if (mistakes >= 2) {
        onFinish({
          accuracy: 50,
          mistakes: mistakes + 1,
          totalAttempts: totalAttempts + 1,
        });
      }
    }
  };

  return (
    <div className="space-y-8 w-full max-w-md text-center">
      <div className="text-xl font-black text-slate-800">
        {isShowingSequence ? (
          <span className="text-blue-700 animate-pulse">👀 Memorize the light pattern...</span>
        ) : (
          <span className="text-teal-700">👉 Now tap the tiles in the same sequence!</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { id: 0, color: 'bg-blue-500', active: 'bg-blue-300 ring-8 ring-blue-300 scale-105' },
          { id: 1, color: 'bg-emerald-500', active: 'bg-emerald-300 ring-8 ring-emerald-300 scale-105' },
          { id: 2, color: 'bg-amber-500', active: 'bg-amber-300 ring-8 ring-amber-300 scale-105' },
          { id: 3, color: 'bg-rose-500', active: 'bg-rose-300 ring-8 ring-rose-300 scale-105' },
        ].map((pad) => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              type="button"
              disabled={isShowingSequence}
              onClick={() => handlePadClick(pad.id)}
              className={`h-36 sm:h-44 rounded-3xl shadow-lg border-4 border-slate-800/20 transition-all ${
                pad.color
              } ${isActive ? pad.active : 'opacity-85 hover:opacity-100 active:scale-95'}`}
              aria-label={`Color tile ${pad.id + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
