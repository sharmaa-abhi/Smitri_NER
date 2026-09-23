"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Home,
  ShieldAlert
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';

export default function ResultsPage() {
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('lastGameResult');
    if (raw) {
      try {
        setResultData(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Default fallback if directly visited
  const session = resultData?.session || {
    gameTitle: 'Memory Match',
    score: 82,
    accuracy: 88,
    responseTimeSec: 19.5,
    mistakes: 1,
    difficultyLevel: 1,
    recommendedDifficulty: 2,
    feedbackText: "You are doing great! Let's try a slightly higher level.",
  };

  const evaluation = resultData?.evaluation || {
    category: 'Excellent',
    feedback: "You are doing great! Let's try a slightly higher level.",
    voiceFeedback: "Wonderful job! You showed great speed and accuracy today.",
    recommendedDifficulty: 2,
  };

  const audioMessage = `Congratulations! You scored ${session.score} out of 100. Category: ${evaluation.category}. ${evaluation.voiceFeedback}`;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 pb-16">
      {/* Top Banner */}
      <ScrollReveal direction="down">
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-lg text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Exercise Completed</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Great Job Today!
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
            You completed <span className="font-bold text-slate-900">{session.gameTitle}</span> with calm focus and attention.
          </p>

          {/* Voice Feedback Reader */}
          <div className="flex justify-center pt-1">
            <VoiceButton
              textToRead={audioMessage}
              buttonLabel="Read Results Aloud"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Score Hero Card */}
      <ScrollReveal direction="up" delay={80}>
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border-2 border-blue-800 shadow-xl text-center space-y-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-300">
              Prototype Cognitive Performance Score
            </span>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-5xl sm:text-6xl font-black text-amber-300">{session.score}</span>
              <span className="text-2xl font-bold text-blue-200">/ 100</span>
            </div>
          </div>

          <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/20 text-base sm:text-lg font-bold text-white">
            Category: {evaluation.category}
          </div>

          {/* Breakdown Badges */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-blue-800/80">
            <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-800">
              <span className="text-xs font-semibold text-blue-300 block">Accuracy</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                {session.accuracy}%
              </span>
            </div>

            <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-800">
              <span className="text-xs font-semibold text-blue-300 block">Response Time</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                {session.responseTimeSec}s
              </span>
            </div>

            <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-800">
              <span className="text-xs font-semibold text-blue-300 block">Mistakes</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                {session.mistakes}
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Adaptive Difficulty Recommendation */}
      <ScrollReveal direction="up" delay={120}>
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-amber-950">
              Adaptive Difficulty Recommendation
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
            {evaluation.feedback}
          </p>

          <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-800">
            <span>Current: Level {session.difficultyLevel}</span>
            <span className="text-amber-700 font-extrabold">→ Recommended: Level {evaluation.recommendedDifficulty}</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Action Buttons */}
      <ScrollReveal direction="up" delay={160}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 py-3 px-5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>

          <Link
            href="/games"
            className="flex-1 py-3 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 border border-amber-500"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Another Game</span>
          </Link>
        </div>
      </ScrollReveal>

      {/* Medical Disclaimer */}
      <ScrollReveal direction="up" delay={190}>
        <div className="text-center text-xs font-medium text-slate-500 bg-slate-100 p-3 rounded-xl border border-slate-200">
          Notice: These scores are for cognitive wellness stimulation only and are NOT a clinical or medical diagnosis.
        </div>
      </ScrollReveal>
    </div>
  );
}
