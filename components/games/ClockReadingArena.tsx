"use client";

import { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, HelpCircle } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { CLOCK_QUESTIONS_BY_LEVEL, GAME_LEVEL_CONFIG, ClockQuestion } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';
import { calculateClockAngles } from '@/lib/algorithms/clockTrig';
import { playGentleSuccessSound, playGentleRetrySound, playCelebrationSound } from '@/lib/gameAudio';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function ClockReadingArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['clock-reading']?.[currentDiff];

  const [round, setRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<ClockQuestion | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // UX Feedback states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
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
    setSelectedOption(null);
    setFeedback({ message: '', type: null });
    setIsProcessing(false);

    const bank = CLOCK_QUESTIONS_BY_LEVEL[diff] || CLOCK_QUESTIONS_BY_LEVEL[1];
    const q = bank[(roundNum - 1) % bank.length];
    setCurrentQuestion(q);

    const decoyCount = diff === 1 ? 2 : 3;
    const opts = shuffleArray([q.timeString, ...q.decoys.slice(0, decoyCount)]);
    setOptions(opts);
  };

  const handleSelect = (chosenTime: string) => {
    if (!currentQuestion || isProcessing) return;

    setIsProcessing(true);
    setSelectedOption(chosenTime);
    const newAttempts = totalAttempts + 1;
    setTotalAttempts(newAttempts);

    if (chosenTime === currentQuestion.timeString) {
      playGentleSuccessSound();
      setFeedback({
        message: `Spot on! The clock shows ${currentQuestion.timeString} — ${currentQuestion.label}. ✓`,
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
        message: `Not quite. Look carefully at where the short hour hand is pointing. Try another!`,
        type: 'retry',
      });

      timerRef.current = setTimeout(() => {
        setSelectedOption(null);
        setIsProcessing(false);
      }, 800);
    }
  };

  if (!currentQuestion) return null;

  const { hourAngle, minuteAngle } = calculateClockAngles(currentQuestion.hours, currentQuestion.minutes);

  return (
    <div className="space-y-6 w-full max-w-xl text-center">
      {/* Screen Reader Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {feedback.message}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#0B534B' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <Clock className="w-4 h-4 text-[#0B534B]" />
          <span>Routine Time Check {round} of 3</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
          What time does the clock show?
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-[#0B534B]">
          Daily Moment: <span className="underline decoration-[#D97706] decoration-2">{currentQuestion.label}</span>
        </p>
        <p className="text-xs text-[#5A6A66]">
          {levelMeta?.subtitle || 'Match the analog clock hands to the routine moment.'}
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

      {/* SVG Analog Clock Face */}
      <div className="flex justify-center py-2">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-white rounded-full border-4 border-[#0B534B] shadow-xl flex items-center justify-center">
          <span className="absolute top-2 font-black text-[#111615] text-lg">12</span>
          <span className="absolute right-3 font-black text-[#111615] text-lg">3</span>
          <span className="absolute bottom-2 font-black text-[#111615] text-lg">6</span>
          <span className="absolute left-3 font-black text-[#111615] text-lg">9</span>

          {/* Tick marks for hours */}
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-2 bg-[#D5DFDC]"
              style={{
                top: '6px',
                transformOrigin: '50% 98px',
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}

          <svg className="w-full h-full" viewBox="0 0 200 200" aria-label="Analog clock face">
            {/* Hour Hand */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="52"
              stroke="#111615"
              strokeWidth="7"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 100 100)`}
            />
            {/* Minute Hand */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke="#0B534B"
              strokeWidth="5"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 100 100)`}
            />
            {/* Center Cap */}
            <circle cx="100" cy="100" r="6" fill="#0B534B" />
          </svg>
        </div>
      </div>

      {/* Digital Time Options (Large, Touch-Friendly, Accessible) */}
      <div className={`grid gap-3.5 pt-2 max-w-md mx-auto ${options.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {options.map((timeOpt, idx) => {
          const isSelected = selectedOption === timeOpt;
          const isCorrect = isSelected && timeOpt === currentQuestion.timeString;
          const isWrong = isSelected && timeOpt !== currentQuestion.timeString;

          let btnStyles = 'bg-white hover:bg-[#E6F4F1] border-[#D5DFDC] hover:border-[#0B534B] text-[#111615]';
          if (isCorrect) {
            btnStyles = 'bg-[#ECFDF5] border-3 border-[#10B981] text-[#047857] ring-4 ring-[#A7F3D0] shadow-md';
          } else if (isWrong) {
            btnStyles = 'bg-[#FFFBEB] border-3 border-[#F59E0B] text-[#92400E] ring-4 ring-[#FDE68A]';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSelect(timeOpt)}
              aria-label={`Time option: ${timeOpt}`}
              className={`py-4 px-3 border-2 rounded-2xl font-black text-base sm:text-lg shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B534B] ${btnStyles} ${
                !isProcessing ? 'hover:scale-104 active:scale-96' : ''
              }`}
            >
              <span>{timeOpt}</span>
              {isCorrect && <span className="block text-xs font-bold mt-0.5">✓ Correct</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
