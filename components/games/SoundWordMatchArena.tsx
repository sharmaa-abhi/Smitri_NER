"use client";

import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { SOUND_PAIRS_BY_LEVEL, GAME_LEVEL_CONFIG, SoundPrompt } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';

interface Props {
  difficulty: number;
  onFinish: (stats: FinishGameStats) => void;
}

export default function SoundWordMatchArena({ difficulty, onFinish }: Props) {
  const currentDiff = (Math.max(1, Math.min(5, difficulty)) || 1) as DifficultyLevel;
  const levelMeta = GAME_LEVEL_CONFIG['sound-word-match']?.[currentDiff];

  const [round, setRound] = useState(1);
  const [currentPrompt, setCurrentPrompt] = useState<SoundPrompt | null>(null);
  const [options, setOptions] = useState<Array<{ icon: string; isCorrect: boolean }>>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    setupRound(currentDiff, 1);
    setMistakes(0);
    setTotalAttempts(0);
  }, [currentDiff]);

  const setupRound = (diff: DifficultyLevel, roundNum: number) => {
    setRound(roundNum);
    const bank = SOUND_PAIRS_BY_LEVEL[diff] || SOUND_PAIRS_BY_LEVEL[1];
    const promptItem = bank[(roundNum - 1) % bank.length];
    setCurrentPrompt(promptItem);

    // Level 1-2: 2 decoys (3 options), Level 3-5: 3 decoys (4 options)
    const decoyCount = diff <= 2 ? 2 : 3;
    const opts = shuffleArray([
      { icon: promptItem.icon, isCorrect: true },
      ...promptItem.decoys.slice(0, decoyCount).map((icon) => ({
        icon,
        isCorrect: false,
      })),
    ]);
    setOptions(opts);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(promptItem.soundText);
        ut.rate = diff === 1 ? 0.8 : 0.88;
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
        setupRound(currentDiff, round + 1);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  if (!currentPrompt) return null;

  return (
    <div className="space-y-6 w-full max-w-xl text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: levelMeta?.color || '#D97706' }}
        >
          {levelMeta?.badge || `Level ${currentDiff}`}
        </span>
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm">
          <Volume2 className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>Auditory & Semantic Quest {round} of 3</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
          &ldquo;{currentPrompt.prompt}&rdquo;
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          {levelMeta?.subtitle}
        </p>
        <p className="text-xs text-[#5A6A66]">
          Tap the speaker button to hear the cue again, then choose the matching picture.
        </p>
      </div>

      <div className="flex justify-center pt-1">
        <VoiceButton
          textToRead={currentPrompt.soundText}
          buttonLabel="Listen to Audio Description"
          className="scale-105"
        />
      </div>

      <div className={`grid gap-4 pt-3 mx-auto max-w-md ${options.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(opt.isCorrect)}
            className="h-28 sm:h-32 bg-white hover:bg-[#E6F4F1] border-2 border-[#D5DFDC] hover:border-[#0B534B] rounded-2xl text-4xl sm:text-5xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            aria-label="Selection option"
          >
            {opt.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
