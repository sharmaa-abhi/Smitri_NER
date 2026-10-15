"use client";

import { useState, useEffect, useRef } from 'react';
import { Eye, CheckCircle2, HelpCircle } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { DIFFERENT_ONE_BY_LEVEL, GAME_LEVEL_CONFIG } from '@/data/gameBanks';
import { playGentleSuccessSound, playGentleRetrySound } from '@/lib/gameAudio';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function DifferentOneArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['different-one']?.[currentDiff];

  const [round, setRound] = useState(1);
  const [options, setOptions] = useState<Array<{ id: number; icon: string; isOdd: boolean }>>([]);
  const [roundTheme, setRoundTheme] = useState<string>('');
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // UX Feedback states
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'retry' | null }>({
    message: '',
    type: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setupRound(currentDiff, 1);
    setMistakes(0);
    setTotalAttempts(0);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentDiff]);

  const setupRound = (diff: DifficultyLevel, roundNum: number) => {
    setRound(roundNum);
    setSelectedId(null);
    setFeedback({ message: '', type: null });
    setIsProcessing(false);

    const sets = DIFFERENT_ONE_BY_LEVEL[diff] || DIFFERENT_ONE_BY_LEVEL[1];
    const setItem = sets[(roundNum - 1) % sets.length];
    setRoundTheme(setItem.theme);

    // Level 1: 4 cards (2x2), Level 2-3: 6 cards (2x3), Level 4-5: 9 cards (3x3)
    const count = diff === 1 ? 4 : diff <= 3 ? 6 : 9;
    const oddPosition = Math.floor(Math.random() * count);

    const opts = Array.from({ length: count }, (_, i) => ({
      id: i,
      icon: i === oddPosition ? setItem.oddIcon : setItem.baseIcon,
      isOdd: i === oddPosition,
    }));
    setOptions(opts);
  };

  const handleSelect = (option: { id: number; icon: string; isOdd: boolean }) => {
    // Prevent accidental double clicks or clicks while processing feedback
    if (isProcessing) return;

    setIsProcessing(true);
    setSelectedId(option.id);
    const newAttempts = totalAttempts + 1;
    setTotalAttempts(newAttempts);

    if (option.isOdd) {
      playGentleSuccessSound();
      setFeedback({
        message: 'Wonderful! You spotted the different one! ✓',
        type: 'success',
      });

      timerRef.current = setTimeout(() => {
        if (round >= 3) {
          onFinish({
            accuracy: Math.max(60, 100 - mistakes * 12),
            mistakes,
            totalAttempts: newAttempts,
          });
        } else {
          setupRound(currentDiff, round + 1);
        }
      }, 700);
    } else {
      playGentleRetrySound();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setFeedback({
        message: 'That one matches the others. Take your time and look for the different symbol.',
        type: 'retry',
      });

      timerRef.current = setTimeout(() => {
        setSelectedId(null);
        setIsProcessing(false);
      }, 750);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-xl text-center">
      {/* Screen Reader Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {feedback.message}
      </div>

      {/* Progress & Category Header */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#D97706' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <Eye className="w-4 h-4 text-[#0B534B]" />
          <span>Question {round} of 3</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
          Which symbol looks different?
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          Theme: <span className="underline decoration-[#D97706]">{roundTheme}</span>
        </p>
        <p className="text-xs text-[#5A6A66]">
          {levelMeta?.subtitle || 'Tap the single item that is different from the rest.'}
        </p>
      </div>

      {/* Interactive Gentle Feedback Banner */}
      {feedback.message && (
        <div
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            feedback.type === 'success'
              ? 'bg-[#ECFDF5] text-[#065F46] border border-[#10B981]'
              : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
          }`}
          role="status"
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
          ) : (
            <HelpCircle className="w-4 h-4 text-[#D97706] flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Touch-Friendly Cards Grid */}
      <div
        className={`gap-3 sm:gap-4 pt-2 mx-auto grid ${
          options.length <= 4
            ? 'grid-cols-2 max-w-xs'
            : options.length <= 6
            ? 'grid-cols-3 max-w-md'
            : 'grid-cols-3 max-w-lg'
        }`}
      >
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          let cardStyle = 'bg-white hover:bg-[#F2F8F6] border-2 border-[#D5DFDC] hover:border-[#0B534B] text-[#111615]';

          if (isSelected) {
            if (opt.isOdd) {
              cardStyle = 'bg-[#ECFDF5] border-3 border-[#10B981] text-[#047857] ring-4 ring-[#A7F3D0] shadow-lg';
            } else {
              cardStyle = 'bg-[#FFFBEB] border-3 border-[#F59E0B] text-[#92400E] ring-4 ring-[#FDE68A] shadow-md';
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSelect(opt)}
              aria-label={`Option ${opt.id + 1}: ${opt.icon}`}
              className={`rounded-2xl flex flex-col items-center justify-center shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2 disabled:cursor-not-allowed ${cardStyle} ${
                options.length <= 4
                  ? 'h-32 sm:h-36 text-5xl sm:text-6xl'
                  : options.length <= 6
                  ? 'h-24 sm:h-28 text-4xl sm:text-5xl'
                  : 'h-20 sm:h-24 text-3xl sm:text-4xl'
              }`}
            >
              <span>{opt.icon}</span>
              {isSelected && (
                <span className="text-[11px] font-bold mt-1">
                  {opt.isOdd ? '✓ Different' : 'Matches'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
