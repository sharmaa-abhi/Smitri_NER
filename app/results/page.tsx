"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  Award, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Home,
  ShieldAlert,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  HelpCircle,
  Clock,
  Target,
  Brain,
  Layers,
  Heart
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { playChime } from '@/lib/audioPrompts';

export default function ResultsPage() {
  const { currentLangInfo, t } = useLanguage();
  const { user } = useAuth();
  const [resultData, setResultData] = useState<any>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Speech Synthesis Controller States
  const [speechStatus, setSpeechStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [speechRate, setSpeechRate] = useState<number>(0.82);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('lastGameResult');
      if (raw) {
        setResultData(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Could not load session results:', e);
    } finally {
      setHasLoaded(true);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Real or fallback session data
  const hasRealSession = Boolean(resultData?.session);
  const session = resultData?.session || {
    gameId: 'memory-match',
    gameTitle: 'Memory Match',
    score: 82,
    accuracy: 88,
    responseTimeSec: 19.5,
    mistakes: 1,
    difficultyLevel: 1,
    recommendedDifficulty: 2,
    feedbackText: "Great effort and calm focus! Let's continue practicing with a slightly higher level.",
  };

  const evaluation = resultData?.evaluation || {
    score: session.score || 82,
    category: session.score >= 80 ? 'Excellent' : session.score >= 60 ? 'Good' : 'Needs Practice',
    feedback: session.feedbackText || "Great effort and calm focus! Every daily game stimulates active recall.",
    voiceFeedback: "Wonderful job! You completed this exercise with steady attention.",
    recommendedDifficulty: session.recommendedDifficulty || 2,
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Friend';

  // Construct clear audio narrative for elderly listeners
  const audioNarrative = `Exercise completed! Wonderful job, ${displayName}. You completed ${session.gameTitle} on Level ${session.difficultyLevel}. Your prototype cognitive performance score is ${session.score} out of 100. Accuracy was ${session.accuracy} percent, with a relaxed response time of ${Math.round(session.responseTimeSec)} seconds and ${session.mistakes} gentle mistakes. Category: ${evaluation.category}. ${evaluation.voiceFeedback} Remember, these exercises are for daily memory stimulation and enjoyment, not a medical test. Would you like to play again or return to games?`;

  // Speech Synthesis Handlers
  const handleStartSpeaking = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    playChime('start');

    const ut = new SpeechSynthesisUtterance(audioNarrative);
    ut.rate = speechRate;
    ut.pitch = 1.05;
    ut.lang = currentLangInfo.bcp47 || 'en-IN';

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang === currentLangInfo.bcp47 || v.lang.startsWith(currentLangInfo.code)
    );
    if (matchingVoice) {
      ut.voice = matchingVoice;
    }

    ut.onstart = () => setSpeechStatus('playing');
    ut.onend = () => setSpeechStatus('idle');
    ut.onerror = () => setSpeechStatus('idle');

    utteranceRef.current = ut;
    setTimeout(() => {
      window.speechSynthesis.speak(ut);
    }, 150);
  }, [audioNarrative, speechRate, currentLangInfo]);

  const handlePauseSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speechStatus === 'playing') {
      window.speechSynthesis.pause();
      setSpeechStatus('paused');
    }
  };

  const handleResumeSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speechStatus === 'paused') {
      window.speechSynthesis.resume();
      setSpeechStatus('playing');
    } else {
      handleStartSpeaking();
    }
  };

  const handleStopSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeechStatus('idle');
  };

  const handleChangeRate = (newRate: number) => {
    setSpeechRate(newRate);
    if (speechStatus === 'playing') {
      handleStopSpeaking();
      setTimeout(() => {
        handleStartSpeaking();
      }, 200);
    }
  };

  const playAgainUrl = session.gameId
    ? `/games/${session.gameId}?level=${session.difficultyLevel || 1}`
    : '/games';

  const nextLevelUrl = session.gameId
    ? `/games/${session.gameId}?level=${evaluation.recommendedDifficulty || session.difficultyLevel || 1}`
    : '/games';

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 py-4 pb-20 px-3 sm:px-6">
      {/* Screen Reader Live Announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {speechStatus === 'playing' ? 'Reading exercise results aloud...' : ''}
      </div>

      {/* Notice if visiting without active game session */}
      {hasLoaded && !hasRealSession && (
        <div className="bg-[#FFFBEB] border-2 border-[#F59E0B]/50 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm text-[#92400E]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#D97706] flex-shrink-0" />
            <span>Showing sample exercise results. Pick any game to generate fresh real-time results.</span>
          </div>
          <Link
            href="/games"
            className="px-3.5 py-1.5 bg-[#D97706] hover:bg-[#B45309] text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-sm"
          >
            Choose Game
          </Link>
        </div>
      )}

      {/* Top Banner: Friendly Completion Message */}
      <ScrollReveal direction="down">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D5DFDC] shadow-sm text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#ECFDF5] text-[#047857] px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold border border-[#10B981]/30">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Exercise Completed Successfully</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#111615] tracking-tight">
            Wonderful Effort, {displayName}!
          </h1>

          <p className="text-sm sm:text-base text-[#5A6A66] font-medium max-w-xl mx-auto leading-relaxed">
            You completed <span className="font-extrabold text-[#0B534B]">{session.gameTitle}</span> (Level {session.difficultyLevel}) with calm focus and attention.
          </p>
        </div>
      </ScrollReveal>

      {/* Voice Results Reader Bar (Elderly-Friendly Speech Controls) */}
      <ScrollReveal direction="up" delay={60}>
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#93CEC5] shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E6F4F1] border border-[#93CEC5] flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-6 h-6 text-[#0B534B]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[#111615]">
                  Listen to Your Results
                </h2>
                <p className="text-xs text-[#5A6A66]">
                  {speechStatus === 'playing'
                    ? 'Reading your results in a calm, clear voice...'
                    : speechStatus === 'paused'
                    ? 'Audio narration paused.'
                    : 'Tap play to have your results read aloud at an unhurried pace.'}
                </p>
              </div>
            </div>

            {/* Speaking Rate Selector for Seniors */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F6F8F7] p-1 rounded-xl border border-[#D5DFDC]">
              <span className="text-[11px] font-bold text-[#5A6A66] px-2">Voice Pace:</span>
              <button
                type="button"
                onClick={() => handleChangeRate(0.82)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  speechRate === 0.82
                    ? 'bg-[#0B534B] text-white shadow-sm'
                    : 'text-[#5A6A66] hover:text-[#111615]'
                }`}
                aria-label="Standard gentle voice pace"
              >
                Gentle (0.8x)
              </button>
              <button
                type="button"
                onClick={() => handleChangeRate(0.72)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  speechRate === 0.72
                    ? 'bg-[#0B534B] text-white shadow-sm'
                    : 'text-[#5A6A66] hover:text-[#111615]'
                }`}
                aria-label="Extra slow relaxed voice pace"
              >
                Slower (0.7x)
              </button>
            </div>
          </div>

          {/* Player Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {speechStatus === 'idle' && (
              <button
                type="button"
                onClick={handleStartSpeaking}
                className="py-3 px-5 rounded-2xl bg-[#0B534B] hover:bg-[#08433C] text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#10B981]"
                aria-label="Read Results Aloud"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Read Results Aloud</span>
              </button>
            )}

            {speechStatus === 'playing' && (
              <>
                <button
                  type="button"
                  onClick={handlePauseSpeaking}
                  className="py-3 px-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  aria-label="Pause audio reading"
                >
                  <Pause className="w-4 h-4 fill-[#92400E]" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={handleStopSpeaking}
                  className="py-3 px-4 rounded-2xl bg-[#F6F8F7] border border-[#D5DFDC] text-[#5A6A66] hover:text-[#111615] font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  aria-label="Stop audio reading"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop</span>
                </button>
              </>
            )}

            {speechStatus === 'paused' && (
              <>
                <button
                  type="button"
                  onClick={handleResumeSpeaking}
                  className="py-3 px-5 rounded-2xl bg-[#0B534B] hover:bg-[#08433C] text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  aria-label="Resume audio reading"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Resume Reading</span>
                </button>
                <button
                  type="button"
                  onClick={handleStopSpeaking}
                  className="py-3 px-4 rounded-2xl bg-[#F6F8F7] border border-[#D5DFDC] text-[#5A6A66] font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  aria-label="Stop audio reading"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleStartSpeaking}
              className="py-3 px-4 rounded-2xl bg-[#F6F8F7] hover:bg-[#E6F4F1] border border-[#D5DFDC] text-[#0B534B] font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
              aria-label="Replay results from start"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Audio</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Score Hero Card: Prototype Performance Score */}
      <ScrollReveal direction="up" delay={100}>
        <div className="bg-gradient-to-br from-[#042420] via-[#0B534B] to-[#04332D] text-white rounded-3xl p-6 sm:p-9 border-2 border-[#0B534B] shadow-xl text-center space-y-5">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-black tracking-widest uppercase text-[#A7F3D0] border border-white/20">
              Prototype Cognitive Performance Score
            </span>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-6xl sm:text-7xl font-black text-[#F59E0B] tracking-tight">{session.score}</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#A7F3D0]">/ 100</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/25 text-base sm:text-lg font-extrabold text-white">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            <span>Category: {evaluation.category}</span>
          </div>

          {/* Breakdown Badges with Clear, Plain-Language Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 border-t border-white/15 text-left">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/15 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#A7F3D0]">
                <Target className="w-4 h-4 text-[#A7F3D0]" />
                <span>Accuracy</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white block">
                {session.accuracy}%
              </span>
              <p className="text-[11px] text-[#A7F3D0]/85 font-medium leading-snug">
                Correct answers chosen on the first try.
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/15 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#A7F3D0]">
                <Clock className="w-4 h-4 text-[#A7F3D0]" />
                <span>Response Time</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white block">
                {Math.round(session.responseTimeSec)}s
              </span>
              <p className="text-[11px] text-[#A7F3D0]/85 font-medium leading-snug">
                Unrushed, relaxed completion time.
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/15 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#A7F3D0]">
                <Heart className="w-4 h-4 text-[#A7F3D0]" />
                <span>Mistakes</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white block">
                {session.mistakes}
              </span>
              <p className="text-[11px] text-[#A7F3D0]/85 font-medium leading-snug">
                Gentle learning steps (natural and expected!).
              </p>
            </div>
          </div>

          {/* Expandable Explanation of What This Score Means */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#A7F3D0] hover:text-white underline decoration-[#A7F3D0]/60 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showExplanation ? 'Hide Score Explanation' : 'What does this score mean?'}</span>
            </button>

            {showExplanation && (
              <div className="mt-3 p-4 bg-black/25 rounded-2xl border border-white/15 text-left text-xs sm:text-sm text-[#E6F4F1] leading-relaxed space-y-2 animate-fade-in">
                <p>
                  <strong>How your score is calculated:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[12px] sm:text-[13px]">
                  <li><strong>Accuracy (50% weight):</strong> Rewards getting the correct answers.</li>
                  <li><strong>Pace &amp; Rhythm (30% weight):</strong> Rewards steady, unhurried completion without stressful rush.</li>
                  <li><strong>Attentive Focus (20% weight):</strong> Gentle bonus for few retries.</li>
                </ul>
                <p className="text-[11px] text-[#A7F3D0] pt-1">
                  Scores vary naturally from day to day based on sleep, hydration, and mood. The most beneficial aspect is daily mental engagement!
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Encouraging, Non-Judgmental Summary & Progression Recommendation */}
      <ScrollReveal direction="up" delay={130}>
        <div className="bg-[#FFFBEB] border-2 border-[#D97706]/30 rounded-3xl p-5 sm:p-7 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#D97706] flex-shrink-0" />
            <h3 className="text-base sm:text-lg font-extrabold text-[#92400E]">
              Encouraging Feedback &amp; Next Stage
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-[#78350F] font-medium leading-relaxed">
            {evaluation.feedback}
          </p>

          <div className="bg-white p-4 rounded-2xl border border-[#D97706]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-bold text-xs sm:text-sm text-[#111615]">
            <span className="flex items-center gap-1.5 text-[#0B534B]">
              <Layers className="w-4 h-4 text-[#0B534B]" />
              <span>Current: Level {session.difficultyLevel}</span>
            </span>
            <span className="text-[#D97706] font-black">
              Recommended Next Stage: Level {evaluation.recommendedDifficulty || session.difficultyLevel || 1}
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* Prominent Action Buttons: Play Again, Back to Games, Return to Dashboard */}
      <ScrollReveal direction="up" delay={160}>
        <div className="space-y-3">
          {/* Primary Action Button: Play Again / Play Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href={playAgainUrl}
              className="w-full py-4 px-6 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-2xl font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#10B981]"
            >
              <RotateCcw className="w-5 h-5 text-[#F59E0B]" />
              <span>Play Again (Level {session.difficultyLevel})</span>
            </Link>

            {evaluation.recommendedDifficulty !== session.difficultyLevel ? (
              <Link
                href={nextLevelUrl}
                className="w-full py-4 px-6 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white rounded-2xl font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B534B]"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>Play Level {evaluation.recommendedDifficulty}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            ) : (
              <Link
                href="/games"
                className="w-full py-4 px-6 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white rounded-2xl font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B534B]"
              >
                <Brain className="w-5 h-5 text-white" />
                <span>Explore Other Games</span>
              </Link>
            )}
          </div>

          {/* Secondary Actions: Back to Games & Return to Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/games"
              className="py-3.5 px-5 bg-white hover:bg-[#F2F8F6] border-2 border-[#D5DFDC] hover:border-[#0B534B] text-[#0B534B] rounded-2xl font-extrabold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Brain className="w-4 h-4 text-[#0B534B]" />
              <span>Back to Games Hub</span>
            </Link>

            <Link
              href="/dashboard"
              className="py-3.5 px-5 bg-white hover:bg-[#F2F8F6] border-2 border-[#D5DFDC] hover:border-[#0B534B] text-[#111615] rounded-2xl font-extrabold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-[#0B534B]" />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Prominent Prototype & Medical Disclaimer */}
      <ScrollReveal direction="up" delay={190}>
        <div className="bg-[#F8FAF9] p-4 sm:p-5 rounded-2xl border-2 border-[#D5DFDC] text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#5A6A66]">
            <ShieldAlert className="w-4 h-4 text-[#D97706]" />
            <span>Prototype Cognitive Care Notice</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#5A6A66] max-w-xl mx-auto leading-relaxed">
            These game scores and adaptive suggestions are designed for cognitive wellness exercises and mental stimulation. They are <strong>NOT</strong> a medical diagnosis, clinical assessment, or diagnostic test for dementia or Alzheimer&apos;s disease. Always consult your qualified healthcare practitioner for any medical concerns.
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
