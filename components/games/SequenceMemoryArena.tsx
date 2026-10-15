"use client";

import { useState, useEffect, useRef } from 'react';
import { Brain, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import { playGentleSuccessSound, playGentleRetrySound, playCelebrationSound } from '@/lib/gameAudio';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

// Frequencies for soothing musical chime tones
const TONES: number[] = [261.63, 329.63, 392.00, 523.25, 587.33, 659.25];

export default function SequenceMemoryArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['sequence-memory']?.[currentDiff];

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
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Watch the chime tiles light up.');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play gentle audio tone for pad
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
        ctx.resume().catch(() => {});
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = TONES[index % TONES.length] || 300;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
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

    timerRef.current = setTimeout(() => {
      playSequence(newSeq);
    }, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentDiff, padCount, sequenceLength]);

  const playSequence = (seq: number[]) => {
    setIsShowingSequence(true);
    setUserSequenceIndex(0);
    setFeedbackMessage('👀 Look closely as the tiles illuminate in order...');
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
        setFeedbackMessage('👉 Your turn! Tap the tiles in the exact order you saw.');
      }
    }, flashInterval);
  };

  const handleReplaySequence = () => {
    if (isShowingSequence || sequence.length === 0) return;
    playSequence(sequence);
  };

  const handlePadClick = (padIndex: number) => {
    if (isShowingSequence) return;

    const newAttempts = totalAttempts + 1;
    setTotalAttempts(newAttempts);
    playTone(padIndex);

    if (padIndex === sequence[userSequenceIndex]) {
      const nextIndex = userSequenceIndex + 1;
      setUserSequenceIndex(nextIndex);

      if (nextIndex === sequence.length) {
        playCelebrationSound();
        setFeedbackMessage('🎉 Wonderful! You matched the complete sequence!');
        setTimeout(() => {
          onFinish({
            accuracy: Math.max(50, 100 - mistakes * 10),
            mistakes,
            totalAttempts: newAttempts,
          });
        }, 650);
      } else {
        setFeedbackMessage(`Good step! Tap step ${nextIndex + 1} of ${sequence.length}.`);
      }
    } else {
      playGentleRetrySound();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setActivePad(-1);
      setTimeout(() => setActivePad(null), 400);

      setUserSequenceIndex(0);
      setFeedbackMessage('Not quite that tile. No worries! Try from step 1, or tap "Watch Again" below.');

      if (newMistakes >= 3) {
        setTimeout(() => {
          onFinish({
            accuracy: 50,
            mistakes: newMistakes,
            totalAttempts: newAttempts,
          });
        }, 750);
      }
    }
  };

  const allPads = [
    { id: 0, label: 'Tile 1', symbol: '●', color: 'bg-[#0B534B]', active: 'bg-[#127267] ring-8 ring-[#93CEC5] scale-105' },
    { id: 1, label: 'Tile 2', symbol: '▲', color: 'bg-[#10B981]', active: 'bg-[#34D399] ring-8 ring-[#A7F3D0] scale-105' },
    { id: 2, label: 'Tile 3', symbol: '■', color: 'bg-[#D97706]', active: 'bg-[#FBBF24] ring-8 ring-[#FDE68A] scale-105' },
    { id: 3, label: 'Tile 4', symbol: '★', color: 'bg-[#2F9285]', active: 'bg-[#5EB2A6] ring-8 ring-[#C2E5DF] scale-105' },
    { id: 4, label: 'Tile 5', symbol: '◆', color: 'bg-[#7C3AED]', active: 'bg-[#A78BFA] ring-8 ring-[#DDD6FE] scale-105' },
    { id: 5, label: 'Tile 6', symbol: '♥', color: 'bg-[#E11D48]', active: 'bg-[#FB7185] ring-8 ring-[#FECDD3] scale-105' },
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
          <Brain className="w-4 h-4 text-[#0B534B]" />
          <span>Step {userSequenceIndex} of {sequenceLength}</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black text-[#111615]">
          {isShowingSequence ? (
            <span className="text-[#0B534B]">👀 Memorize the light pattern...</span>
          ) : (
            <span className="text-[#059669]">👉 Tap the chime tiles in order</span>
          )}
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
          {levelMeta?.subtitle || 'Repeat the exact sequence of flashing chime pads.'}
        </p>
      </div>

      {/* Gentle In-Game Guidance Message */}
      <div
        className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#F2F8F6] text-[#0B534B] border border-[#93CEC5] flex items-center justify-center gap-2 text-center"
        role="status"
      >
        <Sparkles className="w-4 h-4 text-[#D97706] flex-shrink-0" />
        <span>{feedbackMessage}</span>
      </div>

      {/* Pads Grid (Cards labeled with clear symbols and numbers for accessibility) */}
      <div
        className={`grid gap-4 max-w-xs mx-auto ${
          padCount <= 4 ? 'grid-cols-2' : 'grid-cols-3'
        }`}
      >
        {allPads.map((pad) => {
          const isLit = activePad === pad.id;
          const isError = activePad === -1;

          return (
            <button
              key={pad.id}
              type="button"
              disabled={isShowingSequence}
              onClick={() => handlePadClick(pad.id)}
              className={`h-24 sm:h-28 rounded-3xl transition-all duration-200 border-3 border-white/40 shadow-lg flex flex-col items-center justify-center gap-1 text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0B534B] cursor-pointer disabled:cursor-not-allowed ${
                isLit
                  ? `${pad.active} ring-6 shadow-2xl`
                  : isError
                  ? 'bg-[#F59E0B] ring-4 ring-[#FDE68A] scale-95'
                  : `${pad.color} hover:brightness-110 active:scale-95`
              }`}
              aria-label={`${pad.label} with symbol ${pad.symbol}`}
            >
              <span className="text-2xl sm:text-3xl font-black">{pad.symbol}</span>
              <span className="text-xs font-bold tracking-wide">{pad.label}</span>
            </button>
          );
        })}
      </div>

      {/* Senior Help: Watch Again Button */}
      {!isShowingSequence && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={handleReplaySequence}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#E6F4F1] hover:bg-[#C2E5DF] text-[#0B534B] border border-[#93CEC5] text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
            aria-label="Watch the sequence light pattern again"
          >
            <RotateCcw className="w-4 h-4 text-[#0B534B]" />
            <span>Watch Sequence Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
