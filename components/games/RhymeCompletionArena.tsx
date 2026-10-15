"use client";

import { useState, useEffect, useRef } from 'react';
import { Sparkles, BookOpen, CheckCircle2, HelpCircle } from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { FinishGameStats, DifficultyLevel } from '@/types/games';
import { RHYME_QUESTIONS_BY_LEVEL, GAME_LEVEL_CONFIG, RhymeQuestion } from '@/data/gameBanks';
import { shuffleArray } from '@/lib/algorithms/shuffle';
import { playGentleSuccessSound, playGentleRetrySound, playCelebrationSound } from '@/lib/gameAudio';

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

  // UX Feedback states
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
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
    setSelectedWord(null);
    setFeedback({ message: '', type: null });
    setIsProcessing(false);

    const bank = RHYME_QUESTIONS_BY_LEVEL[diff] || RHYME_QUESTIONS_BY_LEVEL[1];
    const q = bank[(roundNum - 1) % bank.length];
    setCurrentQuestion(q);

    const decoyCount = diff === 1 ? 2 : 3;
    const opts = shuffleArray([q.answer, ...q.decoys.slice(0, decoyCount)]);
    setOptions(opts);
  };

  const handleSelect = (chosenWord: string) => {
    if (!currentQuestion || isProcessing) return;

    setIsProcessing(true);
    setSelectedWord(chosenWord);
    const newAttempts = totalAttempts + 1;
    setTotalAttempts(newAttempts);

    if (chosenWord === currentQuestion.answer) {
      playGentleSuccessSound();
      setFeedback({
        message: `Beautiful! "${currentQuestion.prefix} ${chosenWord}" completes the rhyme. ✓`,
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
        message: `Not quite that word. Look at the hint "${currentQuestion.hint}" and try another!`,
        type: 'retry',
      });

      timerRef.current = setTimeout(() => {
        setSelectedWord(null);
        setIsProcessing(false);
      }, 800);
    }
  };

  if (!currentQuestion) return null;

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
          <BookOpen className="w-4 h-4 text-[#0B534B]" />
          <span>Rhyme & Proverb {round} of 3</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black text-[#111615]">
          Complete the Phrase
        </h3>
        <p className="text-xs sm:text-sm text-[#0B534B] font-semibold">
          {levelMeta?.subtitle || 'Choose the missing word that completes the rhythm.'}
        </p>
      </div>

      {/* Phrase Card with Hint */}
      <div className="bg-[#F2F8F6] border-2 border-[#D5DFDC] rounded-3xl p-6 sm:p-7 shadow-inner space-y-3">
        <p className="text-xl sm:text-2xl font-black text-[#111615] leading-relaxed">
          &ldquo;{currentQuestion.prefix}&nbsp;
          <span className="inline-block border-b-2 border-[#0B534B] px-3 text-[#0B534B]">
            {selectedWord && selectedWord === currentQuestion.answer ? selectedWord : '______'}
          </span>
          &rdquo;
        </p>
        <div className="inline-flex items-center gap-1.5 bg-white text-[#0B534B] font-bold text-xs sm:text-sm px-3.5 py-1 rounded-full border border-[#93CEC5]">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Hint: {currentQuestion.hint}</span>
        </div>
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

      {/* Voice Audio Prompt */}
      <div className="flex justify-center">
        <VoiceButton
          textToRead={`${currentQuestion.prefix}... What word completes the rhyme?`}
          buttonLabel="Hear Phrase Spoken"
        />
      </div>

      {/* Large, Touch-Friendly Word Options */}
      <div className={`grid gap-3.5 pt-2 max-w-md mx-auto ${options.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {options.map((word, idx) => {
          const isSelected = selectedWord === word;
          const isCorrect = isSelected && word === currentQuestion.answer;
          const isWrong = isSelected && word !== currentQuestion.answer;

          let btnStyles = 'bg-white hover:bg-[#F2F8F6] border-[#D5DFDC] hover:border-[#0B534B] text-[#111615]';
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
              onClick={() => handleSelect(word)}
              aria-label={`Word option: ${word}`}
              className={`py-4 px-3 border-2 rounded-2xl font-black text-base sm:text-lg shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B534B] ${btnStyles} ${
                !isProcessing ? 'hover:scale-104 active:scale-96' : ''
              }`}
            >
              <span>{word}</span>
              {isCorrect && <span className="block text-xs font-bold mt-0.5">✓ Match</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
