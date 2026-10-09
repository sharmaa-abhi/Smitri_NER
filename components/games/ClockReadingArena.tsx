"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { CLOCK_QUESTIONS_BY_LEVEL, GAME_LEVEL_CONFIG, ClockQuestion } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';
import { calculateClockAngles } from '@/lib/algorithms/clockTrig';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function ClockReadingArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(3, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['clock-reading']?.[currentDiff];

  const [round, setRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<ClockQuestion | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    setupRound(currentDiff, 1);
    setMistakes(0);
    setTotalAttempts(0);
  }, [currentDiff]);

  const setupRound = (diff: DifficultyLevel, roundNum: number) => {
    setRound(roundNum);
    const bank = CLOCK_QUESTIONS_BY_LEVEL[diff] || CLOCK_QUESTIONS_BY_LEVEL[1];
    const q = bank[(roundNum - 1) % bank.length];
    setCurrentQuestion(q);

    // Level 1 has 2 decoys (3 options), Level 2 & 3 have 3 decoys (4 options)
    const decoyCount = diff === 1 ? 2 : 3;
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
        setupRound(currentDiff, round + 1);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  if (!currentQuestion) return null;

  const { hourAngle, minuteAngle } = calculateClockAngles(currentQuestion.hours, currentQuestion.minutes);

  return (
    <div className="space-y-6 w-full max-w-xl text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#0B534B' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <Clock className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>Routine Time Check {round} of 3</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
          What time does the clock show?
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-[#0B534B]">
          Routine: <span className="underline decoration-[#D97706] decoration-2">{currentQuestion.label}</span>
        </p>
        <p className="text-xs text-[#5A6A66]">
          {levelMeta?.subtitle}
        </p>
      </div>

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

          <svg className="w-full h-full" viewBox="0 0 200 200">
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

      {/* Digital Time Options */}
      <div className={`grid gap-3.5 pt-2 max-w-md mx-auto ${options.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {options.map((timeOpt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(timeOpt)}
            className="py-3.5 px-3 bg-white hover:bg-[#E6F4F1] border-2 border-[#D5DFDC] hover:border-[#0B534B] rounded-2xl font-black text-base sm:text-lg text-[#111615] shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            {timeOpt}
          </button>
        ))}
      </div>
    </div>
  );
}
