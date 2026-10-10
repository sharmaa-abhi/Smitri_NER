"use client";

import { useState, useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

// Frequencies for soothing musical chime tones
const TONES: number[] = [261.63, 329.63, 392.00, 523.25, 587.33, 659.25];

export default function SequenceMemoryArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['sequence-memory']?.[currentDiff];

  // Level 1: 4 pads, 3 steps. Level 2: 4 pads, 4 steps. Level 3: 4 pads, 5 steps. Level 4: 6 pads, 5 steps. Level 5: 6 pads, 6 steps.
  const padCount = currentDiff >= 4 ? 6 : 4;
  const sequenceLength = currentDiff === 1 ? 3 : currentDiff === 2 ? 4 : currentDiff === 3 ? 5 : currentDiff === 4 ? 5 : 6;
  const flashInterval = currentDiff === 1 ? 1100 : currentDiff === 2 ? 950 : currentDiff === 3 ? 850 : currentDiff === 4 ? 750 : 650;
  const activeDuration = currentDiff === 1 ? 650 : currentDiff === 2 ? 550 : currentDiff === 3 ? 500 : currentDiff === 4 ? 440 : 380;

  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequenceIndex, setUserSequenceIndex] = useState(0);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play audio tone
  const playTone = (index: number) => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = TONES[index % TONES.length] || 300;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio fallback silent
    }
  };

  useEffect(() => {
    const newSeq = Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * padCount));
    setSequence(newSeq);
    setUserSequenceIndex(0);
    setMistakes(0);
    setTotalAttempts(0);

    const timer = setTimeout(() => {
      playSequence(newSeq);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentDiff, padCount, sequenceLength]);

  const playSequence = (seq: number[]) => {
    setIsShowingSequence(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < seq.length) {
        const padIdx = seq[step];
        setActivePad(padIdx);
        playTone(padIdx);
        setTimeout(() => setActivePad(null), activeDuration);
        step++;
      } else {
        clearInterval(interval);
        setIsShowingSequence(false);
      }
    }, flashInterval);
  };

  const handlePadClick = (padIndex: number) => {
    if (isShowingSequence) return;

    setTotalAttempts((prev) => prev + 1);
    playTone(padIndex);

    if (padIndex === sequence[userSequenceIndex]) {
      const nextIndex = userSequenceIndex + 1;
      setUserSequenceIndex(nextIndex);

      if (nextIndex === sequence.length) {
        onFinish({
          accuracy: Math.max(50, 100 - mistakes * 12),
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

  const allPads = [
    { id: 0, label: 'Emerald', color: 'bg-[#0B534B]', active: 'bg-[#127267] ring-8 ring-[#93CEC5] scale-105' },
    { id: 1, label: 'Jade', color: 'bg-[#10B981]', active: 'bg-[#34D399] ring-8 ring-[#A7F3D0] scale-105' },
    { id: 2, label: 'Amber', color: 'bg-[#D97706]', active: 'bg-[#FBBF24] ring-8 ring-[#FDE68A] scale-105' },
    { id: 3, label: 'Teal', color: 'bg-[#2F9285]', active: 'bg-[#5EB2A6] ring-8 ring-[#C2E5DF] scale-105' },
    { id: 4, label: 'Amethyst', color: 'bg-[#7C3AED]', active: 'bg-[#A78BFA] ring-8 ring-[#DDD6FE] scale-105' },
    { id: 5, label: 'Coral', color: 'bg-[#E11D48]', active: 'bg-[#FB7185] ring-8 ring-[#FECDD3] scale-105' },
  ].slice(0, padCount);

  return (
    <div className="space-y-6 w-full max-w-md text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#0B534B' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <Brain className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>Step {userSequenceIndex} of {sequenceLength}</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black text-[#111615]">
          {isShowingSequence ? (
            <span className="text-[#0B534B] animate-pulse">👀 Memorize the light pattern...</span>
          ) : (
            <span className="text-[#059669]">👉 Tap the chime tiles in order!</span>
          )}
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
          {levelMeta?.subtitle}
        </p>
      </div>

      {/* Dynamic Grid: 2x2 for 4 pads (Level 1 & 2), 3x2 for 6 pads (Level 3) */}
      <div className={`gap-4 mx-auto grid ${padCount === 6 ? 'grid-cols-3 max-w-sm' : 'grid-cols-2 max-w-xs'}`}>
        {allPads.map((pad) => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              type="button"
              disabled={isShowingSequence}
              onClick={() => handlePadClick(pad.id)}
              className={`rounded-3xl shadow-lg border-4 border-black/10 transition-all ${
                padCount === 6 ? 'h-28 sm:h-32' : 'h-32 sm:h-40'
              } ${pad.color} ${
                isActive ? pad.active : 'opacity-85 hover:opacity-100 hover:scale-102 active:scale-95'
              }`}
              aria-label={`${pad.label} tile ${pad.id + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
