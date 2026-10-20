"use client";

import { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { CURRENCY_QUESTIONS_BY_LEVEL, CurrencyQuestion } from '@/data/gameBanks';
import { playSoftTapSound, playGentleSuccessSound, playGentleRetrySound, playCelebrationSound } from '@/lib/gameAudio';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function CurrencyCalcArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const questions = CURRENCY_QUESTIONS_BY_LEVEL[currentDiff] || CURRENCY_QUESTIONS_BY_LEVEL[1];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentTally, setCurrentTally] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string>('Select notes and coins to match the exact market price.');
  const [isSuccessRound, setIsSuccessRound] = useState(false);

  const currentQ: CurrencyQuestion = questions[questionIndex % questions.length];
  const currentSum = currentTally.reduce((a, b) => a + b, 0);

  useEffect(() => {
    setCurrentTally([]);
    setIsSuccessRound(false);
    setFeedback(`Pay ₹${currentQ.targetAmount} for "${currentQ.item}".`);
  }, [questionIndex, currentQ]);

  const handleAddDenomination = (denom: number) => {
    if (isSuccessRound) return;
    playSoftTapSound();

    const newTally = [...currentTally, denom];
    const newSum = newTally.reduce((a, b) => a + b, 0);
    setCurrentTally(newTally);

    if (newSum === currentQ.targetAmount) {
      // Exact match!
      setIsSuccessRound(true);
      playGentleSuccessSound();
      playCelebrationSound();
      setFeedback(`Exact change of ₹${newSum}! Perfect payment.`);
      setTotalAttempts((prev) => prev + 1);

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
      }, 1200);
    } else if (newSum > currentQ.targetAmount) {
      // Overpaid
      setMistakes((prev) => prev + 1);
      setTotalAttempts((prev) => prev + 1);
      playGentleRetrySound();
      setFeedback(`Total is ₹${newSum}, which is ₹${newSum - currentQ.targetAmount} too high. Tap reset to try again.`);
    } else {
      const remaining = currentQ.targetAmount - newSum;
      setFeedback(`You have given ₹${newSum}. Still ₹${remaining} needed.`);
    }
  };

  const handleClearTally = () => {
    playSoftTapSound();
    setCurrentTally([]);
    setFeedback(`Cleared. Pay ₹${currentQ.targetAmount} using the notes below.`);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 text-center">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-black uppercase text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0] inline-block">
          Bazaar Tally • Item {questionIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-3xl" aria-hidden="true">{currentQ.itemIcon}</span>
          <h3 className="text-xl sm:text-2xl font-black text-[#111615]">
            {currentQ.item}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#4B5563] font-medium">
          {feedback}
        </p>
      </div>

      {/* Target Price & Current Tally Display */}
      <div className="bg-white rounded-2xl p-4 border border-[#D5DFDC] shadow-xs grid grid-cols-2 gap-3 items-center">
        <div className="text-left pl-2 space-y-0.5">
          <span className="text-[11px] font-bold text-[#5A6A66] uppercase block">
            Target Price
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#0B534B]">
            ₹{currentQ.targetAmount}
          </span>
        </div>

        <div className="text-right pr-2 space-y-0.5">
          <span className="text-[11px] font-bold text-[#5A6A66] uppercase block">
            Your Payment
          </span>
          <span className={`text-2xl sm:text-3xl font-black ${
            currentSum === currentQ.targetAmount 
              ? 'text-[#059669]' 
              : currentSum > currentQ.targetAmount 
                ? 'text-[#DC2626]' 
                : 'text-[#111615]'
          }`}>
            ₹{currentSum}
          </span>
        </div>
      </div>

      {/* Selected Notes Display */}
      <div className="min-h-[50px] bg-[#F9FAFB] p-2.5 rounded-xl border border-[#E5E7EB] flex flex-wrap items-center justify-center gap-2">
        {currentTally.length === 0 ? (
          <span className="text-xs text-[#9CA3AF]">
            Tap the currency notes &amp; coins below to start counting.
          </span>
        ) : (
          currentTally.map((val, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-lg text-xs font-black shadow-2xs"
            >
              +₹{val}
            </span>
          ))
        )}
      </div>

      {/* Denominations Choices */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#5A6A66] uppercase block text-left pl-1">
          Tap Rupee Coins &amp; Notes:
        </span>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {currentQ.allowedDenominations.map((denom) => (
            <button
              key={denom}
              type="button"
              onClick={() => handleAddDenomination(denom)}
              className={`p-3 rounded-2xl border-2 font-black text-base sm:text-lg transition-all shadow-xs cursor-pointer active:scale-95 flex flex-col items-center justify-center ${
                denom <= 5
                  ? 'bg-[#FFFBEB] hover:bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]'
                  : denom <= 50
                    ? 'bg-[#ECFDF5] hover:bg-[#D1FAE5] border-[#6EE7B7] text-[#065F46]'
                    : 'bg-[#EFF6FF] hover:bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF]'
              }`}
            >
              <span className="text-xs font-bold opacity-75">
                {denom <= 5 ? 'Coin' : 'Note'}
              </span>
              <span>₹{denom}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Payment Button */}
      {currentTally.length > 0 && !isSuccessRound && (
        <button
          type="button"
          onClick={handleClearTally}
          className="text-xs font-bold text-[#DC2626] hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Notes &amp; Recount</span>
        </button>
      )}
    </div>
  );
}
