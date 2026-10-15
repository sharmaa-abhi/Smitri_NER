"use client";

import { useState, useEffect, useRef } from 'react';
import { Volume2, CheckCircle2, HelpCircle } from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { SOUND_PAIRS_BY_LEVEL, GAME_LEVEL_CONFIG, SoundPrompt } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';
import { playGentleSuccessSound, playGentleRetrySound, playCelebrationSound } from '@/lib/gameAudio';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function SoundWordMatchArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['sound-word-match']?.[currentDiff];

  const [round, setRound] = useState(1);
  const [currentPrompt, setCurrentPrompt] = useState<SoundPrompt | null>(null);
  const [options, setOptions] = useState<Array<{ id: number; icon: string; isCorrect: boolean }>>([]);
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

    const bank = SOUND_PAIRS_BY_LEVEL[diff] || SOUND_PAIRS_BY_LEVEL[1];
    const promptItem = bank[(roundNum - 1) % bank.length];
    setCurrentPrompt(promptItem);

    const decoyCount = diff <= 2 ? 2 : 3;
    const rawOpts = shuffleArray([
      { icon: promptItem.icon, isCorrect: true },
      ...promptItem.decoys.slice(0, decoyCount).map((icon) => ({
        icon,
        isCorrect: false,
      })),
    ]);
    setOptions(rawOpts.map((opt, idx) => ({ ...opt, id: idx })));
  };

  const handleSelect = (option: { id: number; icon: string; isCorrect: boolean }) => {
    if (isProcessing || !currentPrompt) return;

    setIsProcessing(true);
    setSelectedId(option.id);
    const newAttempts = totalAttempts + 1;
    setTotalAttempts(newAttempts);

    if (option.isCorrect) {
      playGentleSuccessSound();
      setFeedback({
        message: `Wonderful! You matched "${currentPrompt.prompt}". ✓`,
        type: 'success',
      });

      timerRef.current = setTimeout(() => {
        if (round >= 3) {
          playCelebrationSound();
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
        message: 'Not quite that picture. Tap the speaker to hear the description again, and try another!',
        type: 'retry',
      });

      timerRef.current = setTimeout(() => {
        setSelectedId(null);
        setIsProcessing(false);
      }, 800);
    }
  };

  if (!currentPrompt) return null;

  return (
    <div className="space-y-6 w-full max-w-xl text-center">
      {/* Screen Reader Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {feedback.message}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#D97706' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <Volume2 className="w-4 h-4 text-[#0B534B]" />
          <span>Auditory Question {round} of 3</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
          &ldquo;{currentPrompt.prompt}&rdquo;
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          {levelMeta?.subtitle || 'Listen to the spoken cue, then select the matching picture.'}
        </p>
      </div>

      {/* Gentle In-Game Guidance Message */}
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

      {/* Audio Playback Button */}
      <div className="flex justify-center pt-1">
        <VoiceButton
          textToRead={currentPrompt.soundText}
          buttonLabel="Listen to Spoken Cue"
          className="scale-105"
        />
      </div>

      {/* Pictures Grid (Touch-friendly & High-contrast) */}
      <div className={`grid gap-4 pt-2 mx-auto max-w-md ${options.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          let btnStyle = 'bg-white hover:bg-[#F2F8F6] border-[#D5DFDC] hover:border-[#0B534B] text-[#111615]';

          if (isSelected) {
            if (opt.isCorrect) {
              btnStyle = 'bg-[#ECFDF5] border-3 border-[#10B981] text-[#047857] ring-4 ring-[#A7F3D0] shadow-md';
            } else {
              btnStyle = 'bg-[#FFFBEB] border-3 border-[#F59E0B] text-[#92400E] ring-4 ring-[#FDE68A]';
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSelect(opt)}
              aria-label={`Picture option ${opt.id + 1}: ${opt.icon}`}
              className={`h-28 sm:h-32 border-2 rounded-2xl text-4xl sm:text-5xl flex flex-col items-center justify-center shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B534B] ${btnStyle} ${
                !isProcessing ? 'hover:scale-105 active:scale-95' : ''
              }`}
            >
              <span>{opt.icon}</span>
              {isSelected && (
                <span className="text-[11px] font-bold mt-1">
                  {opt.isCorrect ? '✓ Match' : 'Try another'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
