"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Droplet, 
  Pill, 
  ShieldAlert,
  ArrowRight, 
  PhoneCall, 
  Calendar, 
  Award, 
  Zap, 
  Check, 
  Plus, 
  Minus, 
  MapPin, 
  Activity,
  Brain,
  Eye,
  ShoppingBag,
  Volume2,
  Trophy,
  Flame,
  Layers,
  RotateCcw
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { UserExperienceProfile } from '@/lib/experienceEngine';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hydrationCount, setHydrationCount] = useState<number>(4);
  const [moodStatus, setMoodStatus] = useState<'great' | 'calm' | 'tired'>('great');

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        if (res.user?.currentHydrationGlasses) {
          setHydrationCount(res.user.currentHydrationGlasses);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const experienceProfile: UserExperienceProfile | undefined = data?.experienceProfile;
  const recommendedQuest = experienceProfile?.recommendedQuest;

  const handleVoiceCommand = (transcript: string) => {
    const text = transcript.toLowerCase();
    if (text.includes('game') || text.includes('play') || text.includes('start') || text.includes('khel')) {
      if (recommendedQuest) {
        window.location.href = `/games/${recommendedQuest.gameId}?level=${recommendedQuest.level}`;
      } else {
        window.location.href = '/games/grocery-basket';
      }
    } else if (text.includes('reminder') || text.includes('medicine') || text.includes('dawai') || text.includes('water')) {
      window.location.href = '/reminders';
    } else if (text.includes('emergency') || text.includes('help') || text.includes('doctor') || text.includes('rahul')) {
      window.location.href = '/emergency';
    } else if (text.includes('progress') || text.includes('score')) {
      window.location.href = '/progress';
    }
  };

  const markReminderDone = async (id: string, currentStatus: boolean) => {
    try {
      await fetch('/api/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !currentStatus }),
      });
      // Refresh state
      const res = await fetch('/api/dashboard');
      const updated = await res.json();
      setData(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const updateHydration = async (change: number) => {
    const newCount = Math.max(0, Math.min(10, hydrationCount + change));
    setHydrationCount(newCount);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentHydrationGlasses: newCount }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#0B534B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xl sm:text-2xl font-bold text-[#5A6A66]">Preparing your personalized wellness dashboard...</p>
      </div>
    );
  }

  const user = data?.user || authUser || { 
    name: 'Sunita Devi', 
    age: 72, 
    city: 'Guwahati, Assam',
    emergencyPhone: '+91 98765 11223',
    emergencyName: 'Amit Sharma (Son / Caregiver)',
    doctorName: 'Dr. Manab Barua',
    doctorPhone: '+91 94350 12345',
    dailyHydrationTarget: 6,
    currentHydrationGlasses: 4
  };
  const gameSessions = data?.gameSessions || [];
  const reminders = data?.reminders || [];
  
  // Real metrics derived from experienceProfile
  const cognitiveScore = experienceProfile ? experienceProfile.overallScore : 86;
  const avgAccuracy = experienceProfile ? experienceProfile.overallAccuracy : 88;
  const avgResponseTime = experienceProfile ? experienceProfile.averageResponseTimeSec : 17.5;
  const highestLevel = experienceProfile ? experienceProfile.highestLevelPlayed : 1;

  const completedReminders = reminders.filter((r: any) => r.isCompleted).length;
  const totalReminders = reminders.length || 6;
  const routinePercent = Math.round((completedReminders / totalReminders) * 100);

  // Next pending reminder
  const nextReminder = reminders.find((r: any) => !r.isCompleted) || reminders[reminders.length - 1];

  // 7-Day Trend Chart Data
  const chartData = gameSessions.slice(-7).map((s: any, idx: number) => ({
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx % 7] || `Day ${idx + 1}`,
    score: s.score,
    accuracy: s.accuracy,
    scenario: s.realWorldScenario || s.gameTitle
  }));

  const greetingInstruction = experienceProfile?.adaptiveVoiceGreeting || 
    `Namaste ${user.name}. You are doing wonderfully today in ${user.city || 'Guwahati'}. You have completed ${completedReminders} of ${totalReminders} daily routines, and your cognitive wellness score is ${cognitiveScore} out of 100.`;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Senior Welcome & Daily Summary Header */}
      <ScrollReveal direction="down">
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#D5DFDC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl sm:text-3xl">🌸</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111615] tracking-tight">
                {t("Good day! Welcome back") || "Namaste"}, {user.name}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#10B981]/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>Active Caregiver: {user.emergencyName?.split(' ')[0] || 'Rahul'}</span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#5A6A66] font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {user.city || 'Guwahati, Assam'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#0B534B]" />
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span>•</span>
              <span className="text-[#0B534B] font-bold">
                Doctor: {user.doctorName || 'Dr. Manab Barua'}
              </span>
            </div>
          </div>

          {/* Voice Assistant & Emergency dial */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <VoiceButton 
              textToRead={greetingInstruction}
              onSpeechResult={handleVoiceCommand}
              buttonLabel={t("hero_voice_intro") || "Listen Summary"}
            />
            <a
              href={`tel:${user.emergencyPhone || '+919876543210'}`}
              className="inline-flex items-center gap-2 bg-[#0B534B] hover:bg-[#08433C] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all"
              title="Call Primary Caregiver"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Caregiver</span>
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Hero Banner: Dynamically Tailored based on User's Game Experience */}
      <ScrollReveal direction="up" delay={80}>
        <div className="bg-gradient-to-br from-[#042420] via-[#0B534B] to-[#042420] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#10B981]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 bg-[#10B981]/25 border border-[#10B981]/50 px-3 py-1 rounded-full text-xs font-black text-[#A7F3D0]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Personalized For Your Experience</span>
                </div>
                {recommendedQuest && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                    {recommendedQuest.levelBadge}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
                {recommendedQuest ? recommendedQuest.gameTitle : 'Cognitive Quest of the Day'}
              </h2>

              <p className="text-sm sm:text-base text-[#D5DFDC] font-normal leading-relaxed">
                {recommendedQuest 
                  ? recommendedQuest.reason 
                  : 'Handcrafted daily memory exercises designed for real-world elder routines.'}
              </p>

              {/* Dynamic Badges reflecting recommended level & real scenario */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/15 text-white font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{recommendedQuest?.realWorldScenario || 'Everyday Routine'}</span>
                </span>
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/15 text-white font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FCD34D]" />
                  <span>{recommendedQuest?.estimatedTimeMin || 2} Minutes • Calm Pace</span>
                </span>
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/15 text-white font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{recommendedQuest?.levelSubtitle || 'Adaptive Level'}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
              {recommendedQuest ? (
                <Link
                  href={`/games/${recommendedQuest.gameId}?level=${recommendedQuest.level}`}
                  className="inline-flex items-center justify-center gap-3 bg-[#D97706] hover:bg-[#B45309] text-white px-7 py-4 rounded-2xl font-black text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#D97706]/40 text-center"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Recommended Quest</span>
                </Link>
              ) : (
                <Link
                  href="/games/grocery-basket"
                  className="inline-flex items-center justify-center gap-3 bg-[#D97706] hover:bg-[#B45309] text-white px-7 py-4 rounded-2xl font-black text-base shadow-lg hover:scale-102 transition-all text-center"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Bazaar Challenge</span>
                </Link>
              )}

              <Link
                href="/games"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-2xl font-bold text-sm border border-white/20 transition-all text-center"
              >
                <span>Browse All 9 Games & Levels</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 4 Real-World Vitals & Daily Adherence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Cognitive Score */}
        <ScrollReveal direction="up" delay={100}>
          <div className="bg-white rounded-2xl p-5 border border-[#D5DFDC] shadow-sm space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                Cognitive Vitality
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#0B534B] flex items-center justify-center font-bold text-sm">
                ★
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#0B534B]">{cognitiveScore}</span>
                <span className="text-sm font-bold text-[#5A6A66]">/ 100</span>
              </div>
              <p className="text-xs font-semibold text-[#0B534B] bg-[#E6F4F1] px-2.5 py-1 rounded-md border border-[#0B534B]/20 inline-block mt-2">
                Level {highestLevel} Active • {avgAccuracy}% Acc
              </p>
            </div>
            <span className="text-[11px] text-[#5A6A66]">
              Avg Recall Speed: <strong>{avgResponseTime}s</strong>
            </span>
          </div>
        </ScrollReveal>

        {/* Card 2: Real-World Routine Checklist */}
        <ScrollReveal direction="up" delay={140}>
          <div className="bg-white rounded-2xl p-5 border border-[#D5DFDC] shadow-sm space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                Daily Routine Adherence
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#065F46] flex items-center justify-center font-bold text-sm">
                ✓
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#065F46]">{completedReminders}</span>
                <span className="text-sm font-bold text-[#5A6A66]">/ {totalReminders} Done</span>
              </div>
              <div className="w-full bg-[#F6F8F7] h-2.5 rounded-full overflow-hidden mt-2 border border-[#D5DFDC]/60">
                <div 
                  className="bg-[#10B981] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${routinePercent}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-[#065F46] font-bold">
              {routinePercent}% completed today
            </span>
          </div>
        </ScrollReveal>

        {/* Card 3: Interactive Real-World Hydration Tracker */}
        <ScrollReveal direction="up" delay={180}>
          <div className="bg-white rounded-2xl p-5 border border-[#D5DFDC] shadow-sm space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                Hydration Meter
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#0B534B] flex items-center justify-center font-bold text-sm">
                <Droplet className="w-4 h-4 text-[#0B534B] fill-[#0B534B]" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#0B534B]">{hydrationCount}</span>
                <span className="text-sm font-bold text-[#5A6A66]">/ {user.dailyHydrationTarget || 6} Glasses</span>
              </div>
              <p className="text-[11px] text-[#5A6A66] font-medium mt-1">
                Warm water & herbal chai
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => updateHydration(1)}
                className="flex-1 py-1.5 bg-[#E6F4F1] hover:bg-[#E6F4F1]/80 text-[#0B534B] border border-[#0B534B]/20 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                title="Add 1 glass of water"
              >
                <Plus className="w-3.5 h-3.5" /> +1 Glass
              </button>
              <button
                type="button"
                onClick={() => updateHydration(-1)}
                className="px-2.5 py-1.5 bg-[#F6F8F7] hover:bg-slate-100 text-[#5A6A66] border border-[#D5DFDC] rounded-lg text-xs font-bold transition-colors"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Card 4: Next Scheduled Medicine / Routine */}
        <ScrollReveal direction="up" delay={220}>
          <div className="bg-white rounded-2xl p-5 border border-[#D5DFDC] shadow-sm space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                Up Next In Routine
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#D97706] flex items-center justify-center font-bold text-sm">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {nextReminder ? (
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-bold text-[#111615] line-clamp-2">
                  {nextReminder.title}
                </span>
                <span className="text-xs font-bold text-[#92400E] bg-[#FFFBEB] px-2 py-0.5 rounded border border-[#D97706]/30 inline-block">
                  ⏰ {nextReminder.time}
                </span>
              </div>
            ) : (
              <p className="text-sm font-bold text-[#065F46]">All activities completed for today!</p>
            )}

            <Link
              href="/reminders"
              className="text-xs font-bold text-[#0B534B] hover:text-[#08433C] inline-flex items-center gap-1"
            >
              <span>View full schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Main 2-Column Section: Real-World Routine Checklist + 7-Day Cognitive Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Real-World Daily Timeline - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <ScrollReveal direction="left" delay={150}>
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D5DFDC] shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D5DFDC]/60">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#111615] flex items-center gap-2">
                    <span>🗓️</span> Real-World Daily Timeline
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
                    Elder medication schedule, cognitive challenges, and meals
                  </p>
                </div>
                <Link
                  href="/reminders"
                  className="text-xs font-bold text-[#0B534B] hover:text-[#08433C] flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Edit Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Timeline Cards */}
              <div className="space-y-3.5">
                {reminders.map((rem: any, idx: number) => {
                  const isDone = rem.isCompleted;
                  return (
                    <div
                      key={rem.id || idx}
                      onClick={() => markReminderDone(rem.id, isDone)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3.5 ${
                        isDone 
                          ? 'bg-[#F6F8F7] border-[#D5DFDC] opacity-70' 
                          : 'bg-white hover:bg-[#E6F4F1]/30 border-[#D5DFDC] shadow-sm hover:border-[#0B534B]/40'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          type="button"
                          className={`w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isDone
                              ? 'bg-[#10B981] border-[#059669] text-white'
                              : 'border-[#D5DFDC] bg-white hover:border-[#0B534B]'
                          }`}
                          aria-label={isDone ? "Completed" : "Mark done"}
                        >
                          {isDone && <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-sm sm:text-base font-bold ${isDone ? 'line-through text-[#5A6A66]' : 'text-[#111615]'}`}>
                              {rem.title}
                            </span>
                            {rem.priority === 'HIGH' && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                                Priority
                              </span>
                            )}
                          </div>

                          {rem.dosage && (
                            <p className="text-xs font-semibold text-[#5A6A66] flex items-center gap-1.5">
                              <Pill className="w-3.5 h-3.5 text-[#0B534B]" />
                              Dosage: {rem.dosage}
                            </p>
                          )}

                          {rem.notes && (
                            <p className="text-xs text-[#5A6A66]">
                              ℹ️ {rem.notes}
                            </p>
                          )}

                          <span className="text-xs font-bold text-[#D97706] flex items-center gap-1 pt-0.5">
                            <Clock className="w-3.5 h-3.5" /> {rem.time}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase border flex-shrink-0 ${
                        rem.category === 'MEDICINE'
                          ? 'bg-[#E6F4F1] text-[#0B534B] border-[#0B534B]/20'
                          : rem.category === 'WATER'
                          ? 'bg-[#ECFDF5] text-[#065F46] border-[#10B981]/30'
                          : rem.category === 'DOCTOR'
                          ? 'bg-[#E6F4F1] text-[#0B534B] border-[#0B534B]/20'
                          : rem.category === 'EXERCISE'
                          ? 'bg-[#ECFDF5] text-[#065F46] border-[#10B981]/30'
                          : 'bg-[#FFFBEB] text-[#92400E] border-[#D97706]/30'
                      }`}>
                        {rem.category}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mood & Energy Quick Check-in */}
              <div className="bg-[#F6F8F7] rounded-2xl p-4 border border-[#D5DFDC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#111615] block">Elder Morning Feeling / Mood:</span>
                  <span className="text-xs text-[#5A6A66]">Shared with caregiver daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMoodStatus('great')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      moodStatus === 'great' 
                        ? 'bg-[#10B981] text-white shadow-sm' 
                        : 'bg-white border border-[#D5DFDC] text-[#111615] hover:bg-[#E6F4F1]'
                    }`}
                  >
                    <span>😊</span> Energetic
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoodStatus('calm')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      moodStatus === 'calm' 
                        ? 'bg-[#0B534B] text-white shadow-sm' 
                        : 'bg-white border border-[#D5DFDC] text-[#111615] hover:bg-[#E6F4F1]'
                    }`}
                  >
                    <span>😌</span> Calm
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoodStatus('tired')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      moodStatus === 'tired' 
                        ? 'bg-[#D97706] text-white shadow-sm' 
                        : 'bg-white border border-[#D5DFDC] text-[#111615] hover:bg-[#E6F4F1]'
                    }`}
                  >
                    <span>😴</span> Rest Needed
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: 7-Day Cognitive Trajectory & Dynamic Domain Abilities - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <ScrollReveal direction="right" delay={180}>
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D5DFDC] shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#D5DFDC]/60">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#111615]">
                    Cognitive Progress
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
                    Past 7 Real-World Cognitive Sessions
                  </p>
                </div>
                <Link
                  href="/progress"
                  className="text-xs font-bold text-[#0B534B] hover:text-[#08433C] flex items-center gap-1"
                >
                  <span>Full Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 7-Day Chart */}
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D5DFDC" />
                    <XAxis dataKey="name" stroke="#5A6A66" fontSize={11} fontWeight="600" />
                    <YAxis domain={[50, 100]} stroke="#5A6A66" fontSize={11} fontWeight="600" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#042420',
                        color: '#fff',
                        borderRadius: '12px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val} / 100`, 'Score']}
                      labelFormatter={(label, payload) => {
                        const item = payload[0]?.payload;
                        return item ? `${label} • ${item.scenario}` : label;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#0B534B"
                      strokeWidth={3.5}
                      dot={{ fill: '#0B534B', r: 4 }}
                      activeDot={{ r: 6, fill: '#10B981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Dynamic Everyday Mental Abilities Breakdown (Real Domain Data from Game History) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111615] uppercase tracking-wider block">
                    Everyday Abilities by Experience
                  </span>
                  {experienceProfile?.strongestDomain && (
                    <span className="text-[10px] font-black uppercase text-[#0B534B] bg-[#E6F4F1] px-2 py-0.5 rounded-full border border-[#0B534B]/20 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-[#D97706]" />
                      <span>Top: {experienceProfile.strongestDomain.title.split(' ')[0]}</span>
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {experienceProfile?.domainMetrics ? (
                    Object.values(experienceProfile.domainMetrics).map((m) => {
                      const isStrongest = experienceProfile.strongestDomain.domainKey === m.domainKey;
                      return (
                        <div
                          key={m.domainKey}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                            isStrongest 
                              ? 'bg-[#E6F4F1]/90 border-[#0B534B]/30 shadow-xs' 
                              : 'bg-[#F6F8F7] border-[#D5DFDC]'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{m.icon}</span>
                              <span className="text-xs font-bold text-[#111615]">{m.title}</span>
                              {isStrongest && (
                                <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                                  Top Strength
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#5A6A66] block">
                              {m.sessionsCount} sessions • {m.badge}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-black text-[#0B534B] bg-white px-2 py-1 rounded-md border border-[#0B534B]/20 inline-block">
                              {m.averageAccuracy}% Acc
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <div className="p-3 rounded-xl bg-[#E6F4F1]/60 border border-[#0B534B]/15 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#111615] block">Short-Term Memory Recall</span>
                          <span className="text-[11px] text-[#5A6A66]">Market items & medicine strips</span>
                        </div>
                        <span className="text-xs font-black text-[#0B534B] bg-white px-2 py-1 rounded-md border border-[#0B534B]/20">
                          90% Accuracy
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#ECFDF5]/60 border border-[#10B981]/20 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#111615] block">Time & Routine Orientation</span>
                          <span className="text-[11px] text-[#5A6A66]">Clock hands, prayer & doctor times</span>
                        </div>
                        <span className="text-xs font-black text-[#065F46] bg-white px-2 py-1 rounded-md border border-[#10B981]/30">
                          96% Precision
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Link to Game Dashboard Hub */}
              <Link
                href="/games"
                className="w-full py-3 bg-[#0B534B] hover:bg-[#08433C] text-white rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Award className="w-4 h-4 text-[#FCD34D]" />
                <span>Open Game Dashboard & All 9 Games</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>

      </div>

      {/* Dynamic Section: User's Recent Quests Experience Journey */}
      {experienceProfile?.recentSessions && experienceProfile.recentSessions.length > 0 && (
        <ScrollReveal direction="up" delay={190}>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D5DFDC] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5DFDC]/60 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#111615] flex items-center gap-2">
                  <span>🎮</span> Your Recent Game Experience & Progression
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
                  Past quests tailored to your focus, with level tracking and adaptive difficulty feedback
                </p>
              </div>
              <span className="text-xs font-bold text-[#0B534B] bg-[#E6F4F1] px-3 py-1 rounded-full border border-[#0B534B]/20 self-start sm:self-auto">
                {experienceProfile.totalGamesPlayed} Quests Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {experienceProfile.recentSessions.map((session) => {
                const levelColor = session.difficultyLevel === 3 ? 'bg-[#DC2626]' : session.difficultyLevel === 2 ? 'bg-[#D97706]' : 'bg-[#10B981]';
                const levelName = session.difficultyLevel === 3 ? 'Advanced' : session.difficultyLevel === 2 ? 'Medium' : 'Easy';

                return (
                  <div
                    key={session.id}
                    className="p-4 rounded-2xl border border-[#D5DFDC] bg-[#FAFCFB] hover:border-[#0B534B] hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${levelColor}`}>
                          L{session.difficultyLevel} • {levelName}
                        </span>
                        <span className="text-xs font-black text-[#0B534B]">
                          Score: {session.score}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-[#111615] line-clamp-1">
                        {session.gameTitle}
                      </h4>
                      <p className="text-xs text-[#5A6A66] line-clamp-2">
                        {session.feedbackText}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#D5DFDC]/60 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#5A6A66]">
                        {session.accuracy}% Acc
                      </span>

                      <Link
                        href={`/games/${session.gameId}?level=${session.difficultyLevel}`}
                        className="py-1 px-2.5 bg-white hover:bg-[#E6F4F1] border border-[#D5DFDC] hover:border-[#0B534B] rounded-lg text-xs font-bold text-[#0B534B] transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Replay</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Earned Experience Badges & Cognitive Milestones */}
      {experienceProfile?.earnedBadges && experienceProfile.earnedBadges.length > 0 && (
        <ScrollReveal direction="up" delay={200}>
          <div className="bg-[#FAFCFB] rounded-3xl p-6 sm:p-7 border border-[#D5DFDC] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#D97706]" />
              <h3 className="text-lg font-extrabold text-[#111615]">
                Unlocked Experience Badges & Milestones
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {experienceProfile.earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#D5DFDC] shadow-xs text-center space-y-1 hover:border-[#0B534B] transition-all flex flex-col items-center justify-center"
                >
                  <span className="text-3xl block py-0.5">{badge.icon}</span>
                  <span className="text-xs font-black text-[#111615] block leading-tight">
                    {badge.title}
                  </span>
                  <span className="text-[10px] text-[#5A6A66] block leading-tight">
                    {badge.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Emergency Immediate Action Footer Banner */}
      <ScrollReveal direction="up" delay={220}>
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-extrabold text-[#991B1B]">
                Senior Emergency or Feeling Unwell?
              </h4>
              <p className="text-xs sm:text-sm text-[#7F1D1D] font-medium max-w-xl">
                One-touch direct dial to primary caregiver ({user.emergencyPhone || '+91 98765 11223'}) or emergency helpline 112.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-shrink-0">
            <a
              href={`tel:${user.emergencyPhone || '+919876511223'}`}
              className="w-full sm:w-auto px-5 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-bold text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Caregiver Now</span>
            </a>
            <Link
              href="/emergency"
              className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-rose-50 text-[#991B1B] border border-[#FECACA] rounded-xl font-bold text-sm transition-all text-center"
            >
              Emergency Center
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
