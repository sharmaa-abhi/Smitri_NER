"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { FinishGameStats } from '@/types/games';
import { CLOCK_QUESTIONS } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';
import { calculateClockAngles } from '@/lib/algorithms/clockTrig';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function ClockReadingArena({ difficulty, onFinish }: Props) {
  const [round, setRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<typeof CLOCK_QUESTIONS[0] | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    setupRound(difficulty, 1);
    setMistakes(0);
    setTotalAttempts(0);
  }, [difficulty]);

  const setupRound = (diff: number, roundNum: number) => {
    setRound(roundNum);
    const q = CLOCK_QUESTIONS[(roundNum - 1) % CLOCK_QUESTIONS.length];
    setCurrentQuestion(q);

    const decoyCount = diff === 1 ? 1 : diff === 2 ? 2 : 3;
    const opts = shuffleArray([q.timeString, ...q.decoys.slice(0, decoyCount)]);
    setOptions(opts);
  };

  const handleSelect = (chosenTime: string) => {
    if (!currentQuestion) return;
    setTotalAttempts((prev) => prev + 1);

    if (chosenTime === currentQuestion.timeString) {
      if (round >= 3) {
        onFinish({
          accuracy: Math.max(60, 100 - mistakes * 12),
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      } else {
        setupRound(difficulty, round + 1);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  if (!currentQuestion) return null;

  const { hourAngle, minuteAngle } = calculateClockAngles(currentQuestion.hours, currentQuestion.minutes);

  return (
    <div className="space-y-6 w-full max-w-xl text-center">
      <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-950 px-4 py-1.5 rounded-full font-bold text-sm">
        <Clock className="w-4 h-4 text-cyan-700" />
        <span>Time Check {round} of 3</span>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
          What time does the clock show?
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-cyan-800">
          Hint: {currentQuestion.label}
        </p>
      </div>

      {/* SVG Analog Clock Face */}
      <div className="flex justify-center py-2">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-slate-50 rounded-full border-4 border-slate-800 shadow-xl flex items-center justify-center">
          <span className="absolute top-2 font-black text-slate-700 text-lg">12</span>
          <span className="absolute right-3 font-black text-slate-700 text-lg">3</span>
          <span className="absolute bottom-2 font-black text-slate-700 text-lg">6</span>
          <span className="absolute left-3 font-black text-slate-700 text-lg">9</span>

          <svg className="w-full h-full" viewBox="0 0 200 200">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="52"
              stroke="#1e293b"
              strokeWidth="7"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 100 100)`}
            />
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke="#0891b2"
              strokeWidth="5"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 100 100)`}
            />
            <circle cx="100" cy="100" r="6" fill="#0891b2" />
          </svg>
        </div>
      </div>

      {/* Digital Time Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2 max-w-md mx-auto">
        {options.map((timeOpt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(timeOpt)}
            className="py-3.5 px-4 bg-slate-50 hover:bg-cyan-50 border-3 border-slate-300 hover:border-cyan-500 rounded-2xl font-black text-lg sm:text-xl text-slate-800 shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            {timeOpt}
          </button>
        ))}
      </div>
    </div>
  );
}
