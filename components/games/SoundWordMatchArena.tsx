"use client";

import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { FinishGameStats } from '@/types/games';
import { SOUND_PAIRS } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function SoundWordMatchArena({ difficulty, onFinish }: Props) {
  const [round, setRound] = useState(1);
  const [currentPrompt, setCurrentPrompt] = useState<typeof SOUND_PAIRS[0] | null>(null);
  const [options, setOptions] = useState<Array<{ icon: string; isCorrect: boolean }>>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    setupRound(difficulty, 1);
    setMistakes(0);
    setTotalAttempts(0);
  }, [difficulty]);

  const setupRound = (diff: number, roundNum: number) => {
    setRound(roundNum);
    const promptItem = SOUND_PAIRS[(roundNum - 1) % SOUND_PAIRS.length];
    setCurrentPrompt(promptItem);

    const opts = shuffleArray([
      { icon: promptItem.icon, isCorrect: true },
      ...promptItem.decoys.slice(0, diff === 1 ? 3 : diff === 2 ? 5 : 5).map((icon) => ({
        icon,
        isCorrect: false,
      })),
    ]);
    setOptions(opts);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(promptItem.soundText);
        ut.rate = 0.85;
        window.speechSynthesis.speak(ut);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSelect = (isCorrect: boolean) => {
    setTotalAttempts((prev) => prev + 1);

    if (isCorrect) {
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

  if (!currentPrompt) return null;

  return (
    <div className="space-y-6 w-full max-w-xl text-center">
      <div className="inline-flex items-center gap-2 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-4 py-1.5 rounded-full font-bold text-sm">
        <Volume2 className="w-4 h-4 text-[#0B534B]" />
        <span>Question {round} of 3</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
          &ldquo;{currentPrompt.prompt}&rdquo;
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
          Tap the speaker to hear the description again, then choose the picture.
        </p>
      </div>

      <div className="flex justify-center pt-1">
        <VoiceButton
          textToRead={currentPrompt.soundText}
          buttonLabel="Listen to Cue"
          className="scale-110"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(opt.isCorrect)}
            className="h-32 sm:h-36 bg-white hover:bg-[#E6F4F1] border-2 border-[#D5DFDC] hover:border-[#0B534B] rounded-3xl text-5xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            aria-label="Selection option"
          >
            {opt.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
