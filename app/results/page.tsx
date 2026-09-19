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
      <div className="bg-white rounded-3xl p-8 border-4 border-slate-200 shadow-xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-4 py-1.5 rounded-full text-base font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Exercise Completed</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Great Job Today!
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto">
          You completed <span className="font-bold text-slate-900">{session.gameTitle}</span> with calm focus and attention.
        </p>

        {/* Voice Feedback Reader */}
        <div className="flex justify-center pt-2">
          <VoiceButton
            textToRead={audioMessage}
            buttonLabel="Read Results Aloud"
          />
        </div>
      </div>

      {/* Score Hero Card */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 border-4 border-blue-800 shadow-2xl text-center space-y-6">
        <div className="space-y-1">
          <span className="text-sm font-bold tracking-widest uppercase text-blue-300">
            Prototype Cognitive Performance Score
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-7xl sm:text-8xl font-black text-amber-300">{session.score}</span>
            <span className="text-3xl font-bold text-blue-200">/ 100</span>
          </div>
        </div>

        <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20 text-2xl font-black text-white">
          Category: {evaluation.category}
        </div>

        {/* Breakdown Badges */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-800/80">
          <div className="bg-blue-950/60 p-4 rounded-2xl border border-blue-800">
            <span className="text-sm font-bold text-blue-300 block">Accuracy</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              {session.accuracy}%
            </span>
          </div>

          <div className="bg-blue-950/60 p-4 rounded-2xl border border-blue-800">
            <span className="text-sm font-bold text-blue-300 block">Response Time</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              {session.responseTimeSec}s
            </span>
          </div>

          <div className="bg-blue-950/60 p-4 rounded-2xl border border-blue-800">
            <span className="text-sm font-bold text-blue-300 block">Mistakes</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              {session.mistakes}
            </span>
          </div>
        </div>
      </div>

      {/* Adaptive Difficulty Recommendation */}
      <div className="bg-amber-50 border-3 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-600 flex-shrink-0" />
          <h3 className="text-2xl sm:text-3xl font-black text-amber-950">
            Adaptive Difficulty Recommendation
          </h3>
        </div>

        <p className="text-xl text-amber-900 font-semibold leading-relaxed">
          {evaluation.feedback}
        </p>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 flex items-center justify-between font-bold text-lg text-slate-800">
          <span>Current: Level {session.difficultyLevel}</span>
          <span className="text-amber-700">→ Recommended: Level {evaluation.recommendedDifficulty}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard"
          className="flex-1 py-5 px-6 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-black text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <Home className="w-6 h-6" />
          <span>Return to Dashboard</span>
        </Link>

        <Link
          href="/games"
          className="flex-1 py-5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 border-2 border-amber-500"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Play Another Game</span>
        </Link>
      </div>

      {/* Medical Disclaimer */}
      <div className="text-center text-sm font-semibold text-slate-500 bg-slate-100 p-4 rounded-2xl border border-slate-200">
        Notice: These scores are for cognitive wellness stimulation only and are NOT a clinical or medical diagnosis.
      </div>
    </div>
  );
}
