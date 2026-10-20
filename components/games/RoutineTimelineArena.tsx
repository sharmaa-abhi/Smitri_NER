"use client";

import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { ROUTINE_QUESTIONS_BY_LEVEL, RoutineStep } from '@/data/gameBanks';
import { playSoftTapSound, playGentleSuccessSound, playGentleRetrySound, playCelebrationSound } from '@/lib/gameAudio';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function RoutineTimelineArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const questions = ROUTINE_QUESTIONS_BY_LEVEL[currentDiff] || ROUTINE_QUESTIONS_BY_LEVEL[1];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [shuffledSteps, setShuffledSteps] = useState<RoutineStep[]>([]);
  const [placedSteps, setPlacedSteps] = useState<RoutineStep[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string>('Tap the steps in the order they happen throughout the day.');
  const [isSuccessRound, setIsSuccessRound] = useState(false);

  const currentQ = questions[questionIndex % questions.length];

  // Initialize round
  useEffect(() => {
    if (!currentQ) return;
    setShuffledSteps(shuffleArray([...currentQ.steps]));
    setPlacedSteps([]);
    setIsSuccessRound(false);
    setFeedback(`Step 1: What happens earliest in "${currentQ.scenario}"?`);
  }, [questionIndex, currentQ]);

  const handleStepClick = (step: RoutineStep) => {
    if (isSuccessRound) return;
    playSoftTapSound();

    const expectedOrder = placedSteps.length + 1;
    setTotalAttempts((prev) => prev + 1);

    if (step.order === expectedOrder) {
      // Correct step
      const newPlaced = [...placedSteps, step];
      setPlacedSteps(newPlaced);
      setShuffledSteps((prev) => prev.filter((s) => s.id !== step.id));
      playGentleSuccessSound();

      if (newPlaced.length === currentQ.steps.length) {
        // Round completed!
        setIsSuccessRound(true);
        playCelebrationSound();
        setFeedback('Wonderful! The routine is in perfect chronological sequence.');

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
      } else {
        setFeedback(`Great! Step ${expectedOrder} placed. What comes next?`);
      }
    } else {
      // Incorrect step
      setMistakes((prev) => prev + 1);
      playGentleRetrySound();
      setFeedback(`"${step.title}" usually happens later. Think about what happens earlier.`);
    }
  };

  const handleResetCurrentRound = () => {
    playSoftTapSound();
    setShuffledSteps(shuffleArray([...currentQ.steps]));
    setPlacedSteps([]);
    setIsSuccessRound(false);
    setFeedback('Reset! Start by picking what happens earliest in the day.');
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 text-center">
      {/* Scenario Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-black uppercase text-[#0B534B] bg-[#E6F4F1] px-3 py-1 rounded-full border border-[#93CEC5] inline-block">
          Routine Sequence • Round {questionIndex + 1} of {questions.length}
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#111615]">
          {currentQ.scenario}
        </h3>
        <p className="text-xs sm:text-sm text-[#4B5563] font-medium">
          {feedback}
        </p>
      </div>

      {/* Placed Timeline Steps */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#5A6A66] uppercase block text-left pl-1">
          Your Ordered Sequence ({placedSteps.length}/{currentQ.steps.length}):
        </span>

        <div className="space-y-2 min-h-[90px] bg-white p-3 rounded-2xl border-2 border-dashed border-[#93CEC5] flex flex-col justify-center">
          {placedSteps.length === 0 ? (
            <p className="text-xs text-[#9CA3AF] py-3">
              Tap the events below starting with what happens first in the morning.
            </p>
          ) : (
            placedSteps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center justify-between bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 rounded-xl text-left animate-in fade-in"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#059669] text-white font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-lg" aria-hidden="true">{step.icon}</span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#111615] block">
                      {step.title}
                    </span>
                    <span className="text-[10px] text-[#059669] font-semibold">
                      Typical time: {step.timeHint}
                    </span>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Available Choices to Tap */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#5A6A66] uppercase block text-left pl-1">
          Available Activities (Tap next step):
        </span>

        <div className="grid grid-cols-1 gap-2">
          {shuffledSteps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => handleStepClick(step)}
              className="p-3 bg-white hover:bg-[#F0FDF4] border border-[#D5DFDC] hover:border-[#059669] rounded-xl text-left transition-all flex items-center justify-between cursor-pointer shadow-xs active:scale-98"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{step.icon}</span>
                <span className="text-xs sm:text-sm font-bold text-[#111615]">
                  {step.title}
                </span>
              </div>
              <span className="text-xs text-[#0B534B] font-bold bg-[#E6F4F1] px-2.5 py-1 rounded-lg">
                Select →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Reset button */}
      {placedSteps.length > 0 && !isSuccessRound && (
        <button
          type="button"
          onClick={handleResetCurrentRound}
          className="text-xs font-bold text-[#0B534B] hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Order for this Routine</span>
        </button>
      )}
    </div>
  );
}
