"use client";

import { useState, useEffect } from 'react';
import { Eye, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { STROOP_QUESTIONS_BY_LEVEL, StroopQuestion } from '@/data/gameBanks';
import { playSoftTapSound, playGentleSuccessSound, playGentleRetrySound, playCelebrationSound } from '@/lib/gameAudio';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function ColorStroopArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const questions = STROOP_QUESTIONS_BY_LEVEL[currentDiff] || STROOP_QUESTIONS_BY_LEVEL[1];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string>('Look at the ink color of the word below. Tap the color of the ink!');
  const [isSuccessRound, setIsSuccessRound] = useState(false);

  const currentQ: StroopQuestion = questions[questionIndex % questions.length];

  useEffect(() => {
    setIsSuccessRound(false);
    setFeedback('What color is this text written in? (Ignore the word itself!)');
  }, [questionIndex]);

  const handleColorChoice = (selectedName: string) => {
    if (isSuccessRound) return;
    playSoftTapSound();

    setTotalAttempts((prev) => prev + 1);

    if (selectedName.toLowerCase() === currentQ.colorName.toLowerCase()) {
      // Correct!
      setIsSuccessRound(true);
      playGentleSuccessSound();
      playCelebrationSound();
      setFeedback(`Correct! The ink is ${currentQ.colorName}. Excellent focus!`);

      setTimeout(() => {
        if (questionIndex + 1 < questions.length) {
          setQuestionIndex((prev) => prev + 1);
        } else {
          const accuracy = Math.max(25, Math.round(((totalAttempts + 1 - mistakes) / Math.max(1, totalAttempts + 1)) * 100));
          onFinish({
            accuracy,
            mistakes,
            totalAttempts: totalAttempts + 1,
          });
        }
      }, 1100);
    } else {
      // Mistake
      setMistakes((prev) => prev + 1);
      playGentleRetrySound();
      setFeedback(`Not quite! Look only at the color of the letters, not what the word says.`);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 text-center">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-black uppercase text-[#7C3AED] bg-[#F5F3FF] px-3 py-1 rounded-full border border-[#DDD6FE] inline-block">
          Color &amp; Word Harmony • Round {questionIndex + 1} of {questions.length}
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#111615]">
          Identify the Font Color
        </h3>
        <p className="text-xs sm:text-sm text-[#4B5563] font-medium">
          {feedback}
        </p>
      </div>

      {/* Stimulus Word Display (Big and bold with colorful ink) */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#D5DFDC] shadow-sm flex items-center justify-center min-h-[140px]">
        <span
          className="text-4xl sm:text-5xl font-black tracking-wider select-none animate-in zoom-in-95 duration-200"
          style={{ color: currentQ.colorHex }}
        >
          {currentQ.word}
        </span>
      </div>

      {/* Reminder Hint */}
      <div className="bg-[#FFFBEB] border border-[#FDE68A] p-2.5 rounded-xl text-xs text-[#92400E] font-semibold">
        💡 Tip: Tap the color your eyes see, not what the letters spell out!
      </div>

      {/* Color Options */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#5A6A66] uppercase block text-left pl-1">
          Choose the Ink Color:
        </span>

        <div className="grid grid-cols-2 gap-3">
          {currentQ.options.map((opt) => (
            <button
              key={opt.name}
              type="button"
              onClick={() => handleColorChoice(opt.name)}
              className="p-4 bg-white hover:bg-[#F9FAFB] border-2 border-[#D5DFDC] hover:border-[#0B534B] rounded-2xl font-black text-base text-[#111615] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2.5 active:scale-98"
            >
              <span
                className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                style={{ backgroundColor: opt.hex }}
              />
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
