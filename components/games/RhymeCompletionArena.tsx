"use client";

import { useState, useEffect } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { RHYME_QUESTIONS_BY_LEVEL, GAME_LEVEL_CONFIG, RhymeQuestion } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function RhymeCompletionArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['rhyme-completion']?.[currentDiff];

  const [round, setRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<RhymeQuestion | null>(null);
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
    const bank = RHYME_QUESTIONS_BY_LEVEL[diff] || RHYME_QUESTIONS_BY_LEVEL[1];
    const q = bank[(roundNum - 1) % bank.length];
    setCurrentQuestion(q);

    // Level 1: 2 decoys (3 options), Level 2 & 3: 3 decoys (4 options)
    const decoyCount = diff === 1 ? 2 : 3;
    const opts = shuffleArray([q.answer, ...q.decoys.slice(0, decoyCount)]);
    setOptions(opts);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(`${q.prefix}... What is the missing word?`);
        ut.rate = diff === 1 ? 0.8 : 0.88;
        window.speechSynthesis.speak(ut);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSelect = (chosenWord: string) => {
    if (!currentQuestion) return;
    setTotalAttempts((prev) => prev + 1);

    if (chosenWord === currentQuestion.answer) {
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
          <BookOpen className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>Rhyme & Proverb {round} of 3</span>
        </div>
      </div>

      <div className="space-y-0.5">
        <h3 className="text-2xl font-black text-[#111615]">
          Complete the Phrase
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          {levelMeta?.subtitle}
        </p>
      </div>

      <div className="bg-[#F2F8F6] border-2 border-[#D5DFDC] rounded-3xl p-6 sm:p-7 shadow-inner space-y-3">
        <p className="text-xl sm:text-2xl font-bold text-[#111615] leading-relaxed">
          &ldquo;{currentQuestion.prefix}&rdquo;
        </p>
        <div className="inline-flex items-center gap-1.5 bg-white text-[#0B534B] font-black text-xs sm:text-sm px-3.5 py-1 rounded-full border border-[#93CEC5]">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Hint: {currentQuestion.hint}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <VoiceButton
          textToRead={`${currentQuestion.prefix}... What word completes the rhyme?`}
          buttonLabel="Hear Phrase Spoken"
        />
      </div>

      <div className={`grid gap-3.5 pt-2 max-w-md mx-auto ${options.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {options.map((word, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(word)}
            className="py-4 px-3 bg-white hover:bg-[#E6F4F1] border-2 border-[#D5DFDC] hover:border-[#0B534B] rounded-2xl font-black text-base sm:text-lg text-[#111615] shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
