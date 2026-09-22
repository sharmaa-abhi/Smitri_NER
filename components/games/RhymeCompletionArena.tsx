"use client";

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { FinishGameStats } from '@/types/games';
import { RHYME_QUESTIONS } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function RhymeCompletionArena({ difficulty, onFinish }: Props) {
  const [round, setRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<typeof RHYME_QUESTIONS[0] | null>(null);
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
    const q = RHYME_QUESTIONS[(roundNum - 1) % RHYME_QUESTIONS.length];
    setCurrentQuestion(q);

    const decoyCount = diff === 1 ? 1 : diff === 2 ? 2 : 3;
    const opts = shuffleArray([q.answer, ...q.decoys.slice(0, decoyCount)]);
    setOptions(opts);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(`${q.prefix}... What is the missing word?`);
        ut.rate = 0.85;
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
        setupRound(difficulty, round + 1);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6 w-full max-w-xl text-center">
      <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-950 px-4 py-1.5 rounded-full font-bold text-sm">
        <Sparkles className="w-4 h-4 text-violet-700" />
        <span>Rhyme {round} of 3</span>
      </div>

      <div className="bg-violet-50/80 border-2 border-violet-200 rounded-3xl p-6 sm:p-7 shadow-inner space-y-3">
        <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed">
          &ldquo;{currentQuestion.prefix}&rdquo;
        </p>
        <span className="inline-block bg-white text-violet-800 font-black text-xs sm:text-sm px-3 py-1 rounded-full border border-violet-300">
          Hint: {currentQuestion.hint}
        </span>
      </div>

      <div className="flex justify-center">
        <VoiceButton
          textToRead={`${currentQuestion.prefix}... What word completes the rhyme?`}
          buttonLabel="Hear Phrase"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2 max-w-md mx-auto">
        {options.map((word, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(word)}
            className="py-4 px-4 bg-slate-50 hover:bg-violet-50 border-3 border-slate-300 hover:border-violet-500 rounded-2xl font-black text-lg sm:text-xl text-slate-900 shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
