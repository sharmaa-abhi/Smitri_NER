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
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useUser } from '@clerk/nextjs';
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
  const { user: clerkUser } = useUser();
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

  const clerkName = clerkUser?.fullName || 
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || 
    clerkUser?.firstName || 
    clerkUser?.username || 
    clerkUser?.primaryEmailAddress?.emailAddress?.split('@')[0];

  const resolvedName = clerkName || authUser?.name || data?.user?.name || 'Member';

  const user = {
    ...(data?.user || {}),
    ...(authUser || {}),
    name: resolvedName,
    age: data?.user?.age || authUser?.age || 68,
    city: data?.user?.city || authUser?.city || 'Guwahati, Assam',
    emergencyPhone: data?.user?.emergencyPhone || authUser?.emergencyPhone || '+91 98765 11223',
    emergencyName: data?.user?.emergencyName || authUser?.emergencyName || 'Amit Sharma (Caregiver)',
    doctorName: data?.user?.doctorName || authUser?.doctorName || 'Dr. Manab Barua',
    doctorPhone: data?.user?.doctorPhone || authUser?.doctorPhone || '+91 94350 12345',
    dailyHydrationTarget: data?.user?.dailyHydrationTarget || 6,
    currentHydrationGlasses: hydrationCount,
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
    <div className="space-y-8 pb-36 sm:pb-44">
      {/* ─── 1. Senior Welcome & Daily Summary Header ─── */}
      <header className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-2xl sm:text-3xl" aria-hidden="true">🌸</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111615] tracking-tight">
              {t("Good day! Welcome back") || "Namaste"}, {user.name}
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>Active Caregiver: {user.emergencyName?.split(' ')[0] || 'Rahul'}</span>
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base text-[#4B5563] font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              {user.city || 'Guwahati, Assam'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0B534B]" />
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span>•</span>
            <span className="text-[#0B534B] font-bold">
              Doctor: {user.doctorName || 'Dr. Manab Barua'}
            </span>
          </div>
        </div>

        {/* Voice Assistant & Emergency Call */}
        <div className="flex flex-wrap items-center gap-3 flex-shrink-0 pt-2 md:pt-0">
          <VoiceButton 
            textToRead={greetingInstruction}
            onSpeechResult={handleVoiceCommand}
            buttonLabel={t("hero_voice_intro") || "Listen Summary"}
            className="min-h-[48px] px-5 text-base font-semibold"
          />
          <a
            href={`tel:${user.emergencyPhone || '+919876543210'}`}
            className="min-h-[48px] inline-flex items-center gap-2 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white px-5 py-2.5 rounded-xl font-bold text-base shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2"
            title="Call Primary Caregiver"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Caregiver</span>
          </a>
        </div>
      </header>

      {/* ─── 2. Hero Feature: Cognitive Quest of the Day ─── */}
      <section aria-label="Personalized daily cognitive exercise">
        <div className="bg-[#0B534B] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#0B534B] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 bg-[#10B981]/20 border border-[#A7F3D0]/40 px-3 py-1 rounded-full text-xs font-black text-[#A7F3D0] tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-[#FCD34D]" />
                  <span>Personalized For Your Day</span>
                </div>
                {recommendedQuest && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                    Level {recommendedQuest.level}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
                {recommendedQuest ? recommendedQuest.gameTitle : 'Cognitive Quest of the Day'}
              </h2>

              <p className="text-[17px] sm:text-[18px] text-[#E6F4F1] font-normal leading-relaxed">
                {recommendedQuest 
                  ? recommendedQuest.reason 
                  : 'Handcrafted daily memory exercises designed for real-world elder routines.'}
              </p>

              {/* Dynamic Badges reflecting real scenario */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs sm:text-sm">
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-white font-medium flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#A7F3D0]" />
                  <span>{recommendedQuest?.realWorldScenario || 'Everyday Routine'}</span>
                </span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-white font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FCD34D]" />
                  <span>{recommendedQuest?.estimatedTimeMin || 2} Minutes • Calm Pace</span>
                </span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-white font-medium flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#A7F3D0]" />
                  <span>Level {recommendedQuest?.level || 1} • Self-Paced</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
              {recommendedQuest ? (
                <Link
                  href={`/games/${recommendedQuest.gameId}?level=${recommendedQuest.level}`}
                  className="min-h-[52px] inline-flex items-center justify-center gap-3 bg-[#D97706] hover:bg-[#B45309] text-white px-7 py-3.5 rounded-xl font-bold text-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Recommended Quest</span>
                </Link>
              ) : (
                <Link
                  href="/games/grocery-basket"
                  className="min-h-[52px] inline-flex items-center justify-center gap-3 bg-[#D97706] hover:bg-[#B45309] text-white px-7 py-3.5 rounded-xl font-bold text-lg shadow-sm transition-all text-center focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Daily Challenge</span>
                </Link>
              )}

              <Link
                href="/games"
                className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold text-base border border-white/20 transition-all text-center focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                <span>Browse All 9 Games & Levels</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. 4 Health & Adherence Cards (Unified Architecture) ─── */}
      <section aria-label="Daily health summary metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Cognitive Vitality */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Cognitive Vitality
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] flex items-center justify-center flex-shrink-0 font-bold text-base">
                ★
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0B534B]">{cognitiveScore}</span>
                <span className="text-base font-bold text-[#5A6A66]">/ 100</span>
              </div>
              <p className="text-sm font-medium text-[#4B5563] mt-1">
                Level {highestLevel} Active • {avgAccuracy}% Accuracy
              </p>
            </div>
          </div>

          {/* Card 2: Daily Routine Adherence */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Routine Adherence
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center justify-center flex-shrink-0 font-bold text-base">
                ✓
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#065F46]">{completedReminders}</span>
                <span className="text-base font-bold text-[#5A6A66]">/ {totalReminders} Done</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-[#059669] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${routinePercent}%` }}
                />
              </div>
              <p className="text-sm font-medium text-[#065F46] mt-1">
                {routinePercent}% completed today
              </p>
            </div>
          </div>

          {/* Card 3: Hydration Meter */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Hydration Tracker
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] flex items-center justify-center flex-shrink-0">
                <Droplet className="w-5 h-5 text-[#0B534B] fill-[#0B534B]" />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0B534B]">{hydrationCount}</span>
                <span className="text-base font-bold text-[#5A6A66]">/ {user.dailyHydrationTarget || 6} Glasses</span>
              </div>
              <p className="text-sm font-medium text-[#4B5563] mt-1">
                Warm water & herbal chai
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => updateHydration(1)}
                className="flex-1 min-h-[44px] py-2 bg-[#E6F4F1] hover:bg-[#D4EFEA] text-[#0B534B] border border-[#93CEC5] rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#0B534B]"
                title="Add 1 glass of water"
              >
                <Plus className="w-4 h-4" /> +1 Glass
              </button>
              <button
                type="button"
                onClick={() => updateHydration(-1)}
                className="min-h-[44px] px-3.5 py-2 bg-[#F6F8F7] hover:bg-slate-100 text-[#4B5563] border border-[#D5DFDC] rounded-xl text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#0B534B]"
                title="Decrease"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 4: Next Scheduled Medicine / Routine */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Up Next In Routine
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 font-bold text-base">
                <Clock className="w-5 h-5 text-[#D97706]" />
              </div>
            </div>

            <div className="pt-2">
              {nextReminder ? (
                <div className="space-y-1">
                  <span className="text-base sm:text-[17px] font-bold text-[#111615] line-clamp-1">
                    {nextReminder.title}
                  </span>
                  <span className="text-xs font-bold text-[#92400E] bg-[#FFFBEB] px-2.5 py-1 rounded-md border border-[#D97706]/30 inline-block">
                    ⏰ {nextReminder.time}
                  </span>
                </div>
              ) : (
                <p className="text-base font-bold text-[#065F46]">All activities completed for today!</p>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/reminders"
                className="text-sm font-bold text-[#0B534B] hover:text-[#08433C] inline-flex items-center gap-1.5 focus-visible:underline"
              >
                <span>View full schedule</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Main 2-Column: Real-World Routine Checklist + 7-Day Analytics ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Column: Real-World Daily Timeline (7 cols) */}
        <section aria-label="Daily timeline checklist" className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#111615] flex items-center gap-2">
                  <span>🗓️</span> Real-World Daily Timeline
                </h3>
                <p className="text-sm sm:text-base text-[#4B5563] font-normal">
                  Medication schedule, cognitive challenges, and meals
                </p>
              </div>
              <Link
                href="/reminders"
                className="min-h-[44px] px-4 py-2 bg-[#E6F4F1] hover:bg-[#D4EFEA] text-[#0B534B] font-bold text-sm rounded-xl border border-[#93CEC5] inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <span>Edit Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Timeline Cards */}
            <div className="space-y-3">
              {reminders.map((rem: any, idx: number) => {
                const isDone = rem.isCompleted;
                return (
                  <div
                    key={rem.id || idx}
                    onClick={() => markReminderDone(rem.id, isDone)}
                    className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isDone 
                        ? 'bg-[#F9FAFB] border-[#E5E7EB] opacity-75' 
                        : 'bg-white hover:bg-[#F0FDF4] border-[#D5DFDC] shadow-xs hover:border-[#0B534B]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <button
                        type="button"
                        className={`w-7 h-7 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          isDone
                            ? 'bg-[#059669] border-[#059669] text-white'
                            : 'border-[#D5DFDC] bg-white hover:border-[#0B534B]'
                        }`}
                        aria-label={isDone ? "Completed" : "Mark done"}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-base sm:text-lg font-bold ${isDone ? 'line-through text-[#6B7280]' : 'text-[#111615]'}`}>
                            {rem.title}
                          </span>
                          {rem.priority === 'HIGH' && (
                            <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                              Priority
                            </span>
                          )}
                        </div>

                        {rem.dosage && (
                          <p className="text-sm font-semibold text-[#4B5563] flex items-center gap-1.5">
                            <Pill className="w-4 h-4 text-[#0B534B]" />
                            Dosage: {rem.dosage}
                          </p>
                        )}

                        {rem.notes && (
                          <p className="text-sm text-[#4B5563]">
                            ℹ️ {rem.notes}
                          </p>
                        )}

                        <span className="text-sm font-bold text-[#D97706] flex items-center gap-1.5 pt-0.5">
                          <Clock className="w-4 h-4" /> {rem.time}
                        </span>
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase border flex-shrink-0 ${
                      rem.category === 'MEDICINE'
                        ? 'bg-[#E6F4F1] text-[#0B534B] border-[#93CEC5]'
                        : rem.category === 'WATER'
                        ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                        : rem.category === 'DOCTOR'
                        ? 'bg-[#E6F4F1] text-[#0B534B] border-[#93CEC5]'
                        : rem.category === 'EXERCISE'
                        ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                        : 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                    }`}>
                      {rem.category}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mood & Energy Quick Check-in */}
            <div className="bg-[#F9FAFB] rounded-xl p-4 sm:p-5 border border-[#D5DFDC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-[#111615] block">Elder Morning Feeling / Mood:</span>
                <span className="text-xs text-[#5A6A66]">Shared with caregiver daily</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMoodStatus('great')}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                    moodStatus === 'great' 
                      ? 'bg-[#059669] text-white shadow-xs' 
                      : 'bg-white border border-[#D5DFDC] text-[#111615] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <span>😊</span> Energetic
                </button>
                <button
                  type="button"
                  onClick={() => setMoodStatus('calm')}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                    moodStatus === 'calm' 
                      ? 'bg-[#0B534B] text-white shadow-xs' 
                      : 'bg-white border border-[#D5DFDC] text-[#111615] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <span>😌</span> Calm
                </button>
                <button
                  type="button"
                  onClick={() => setMoodStatus('tired')}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                    moodStatus === 'tired' 
                      ? 'bg-[#D97706] text-white shadow-xs' 
                      : 'bg-white border border-[#D5DFDC] text-[#111615] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <span>😴</span> Rest Needed
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: 7-Day Cognitive Analytics & Abilities (5 cols) */}
        <section aria-label="Cognitive trajectory and abilities" className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#111615]">
                  Cognitive Progress
                </h3>
                <p className="text-sm text-[#4B5563] font-normal">
                  Past 7 cognitive sessions
                </p>
              </div>
              <Link
                href="/progress"
                className="min-h-[44px] px-4 py-2 bg-[#E6F4F1] hover:bg-[#D4EFEA] text-[#0B534B] font-bold text-sm rounded-xl border border-[#93CEC5] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 7-Day Chart */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} fontWeight="600" />
                  <YAxis domain={[50, 100]} stroke="#6B7280" fontSize={12} fontWeight="600" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#042420',
                      color: '#fff',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '13px',
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
                    activeDot={{ r: 6, fill: '#059669' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic Everyday Mental Abilities Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-[#111615] uppercase tracking-wider block">
                  Everyday Abilities by Experience
                </span>
                {experienceProfile?.strongestDomain && (
                  <span className="text-xs font-bold uppercase text-[#0B534B] bg-[#E6F4F1] px-2.5 py-0.5 rounded-full border border-[#93CEC5] flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-[#D97706]" />
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
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                          isStrongest 
                            ? 'bg-[#E6F4F1]/90 border-[#93CEC5] shadow-xs' 
                            : 'bg-[#F9FAFB] border-[#E5E7EB]'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{m.icon}</span>
                            <span className="text-sm font-bold text-[#111615]">{m.title}</span>
                            {isStrongest && (
                              <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                                Top Strength
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#5A6A66] block">
                            {m.sessionsCount} sessions • {m.badge}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-[#0B534B] bg-white px-2.5 py-1 rounded-md border border-[#93CEC5] inline-block">
                            {m.averageAccuracy}% Acc
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="p-3.5 rounded-xl bg-[#E6F4F1]/60 border border-[#93CEC5] flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-[#111615] block">Short-Term Memory Recall</span>
                        <span className="text-xs text-[#5A6A66]">Market items & medicine strips</span>
                      </div>
                      <span className="text-sm font-black text-[#0B534B] bg-white px-2.5 py-1 rounded-md border border-[#93CEC5]">
                        90% Accuracy
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#ECFDF5]/60 border border-[#A7F3D0] flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-[#111615] block">Time & Routine Orientation</span>
                        <span className="text-xs text-[#5A6A66]">Clock hands, prayer & doctor times</span>
                      </div>
                      <span className="text-sm font-black text-[#065F46] bg-white px-2.5 py-1 rounded-md border border-[#A7F3D0]">
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
              className="w-full min-h-[48px] py-3 bg-[#0B534B] hover:bg-[#08433C] text-white rounded-xl font-bold text-base text-center flex items-center justify-center gap-2 transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-[#0B534B]"
            >
              <Award className="w-4 h-4 text-[#FCD34D]" />
              <span>Open Game Dashboard & All 9 Games</span>
            </Link>
          </div>
        </section>

      </div>

      {/* ─── 5. Recent Quests Experience Journey ─── */}
      {experienceProfile?.recentSessions && experienceProfile.recentSessions.length > 0 && (
        <section aria-label="Recent game sessions">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#111615] flex items-center gap-2">
                  <span>🎮</span> Your Recent Game Experience & Progression
                </h3>
                <p className="text-sm sm:text-base text-[#4B5563] font-normal">
                  Past exercises tailored to your focus, with sequential level progression
                </p>
              </div>
              <span className="text-sm font-bold text-[#0B534B] bg-[#E6F4F1] px-3.5 py-1.5 rounded-full border border-[#93CEC5] self-start sm:self-auto">
                {experienceProfile.totalGamesPlayed} Quests Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {experienceProfile.recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-5 rounded-xl border border-[#D5DFDC] bg-[#FAFCFB] hover:border-[#0B534B] transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase text-white bg-[#0B534B]">
                        Level {session.difficultyLevel}
                      </span>
                      <span className="text-xs font-black text-[#0B534B]">
                        Score: {session.score}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-[#111615] line-clamp-1">
                      {session.gameTitle}
                    </h4>
                    <p className="text-sm text-[#4B5563] line-clamp-2">
                      {session.feedbackText}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                    <span className="text-xs text-[#5A6A66] font-medium">
                      {session.accuracy}% Acc
                    </span>

                    <Link
                      href={`/games/${session.gameId}?level=${session.difficultyLevel}`}
                      className="min-h-[40px] py-1.5 px-3 bg-white hover:bg-[#E6F4F1] border border-[#D5DFDC] hover:border-[#0B534B] rounded-lg text-sm font-bold text-[#0B534B] transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Replay</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 6. Unlocked Experience Badges & Milestones ─── */}
      {experienceProfile?.earnedBadges && experienceProfile.earnedBadges.length > 0 && (
        <section aria-label="Earned milestones and badges">
          <div className="bg-[#FAFCFB] rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#D97706]" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111615]">
                Unlocked Experience Badges & Milestones
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {experienceProfile.earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-white p-4 rounded-xl border border-[#D5DFDC] text-center space-y-1.5 hover:border-[#0B534B] transition-all flex flex-col items-center justify-center"
                >
                  <span className="text-3xl block py-0.5" aria-hidden="true">{badge.icon}</span>
                  <span className="text-sm font-extrabold text-[#111615] block leading-tight">
                    {badge.title}
                  </span>
                  <span className="text-xs text-[#5A6A66] block leading-tight">
                    {badge.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 7. Emergency Immediate Action Footer Banner ─── */}
      <section aria-label="Senior emergency quick call">
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#DC2626] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-[#991B1B]">
                Senior Emergency or Feeling Unwell?
              </h4>
              <p className="text-sm sm:text-base text-[#7F1D1D] font-medium max-w-xl">
                One-touch direct dial to primary caregiver ({user.emergencyPhone || '+91 98765 11223'}) or emergency helpline 112.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-shrink-0">
            <a
              href={`tel:${user.emergencyPhone || '+919876511223'}`}
              className="min-h-[48px] w-full sm:w-auto px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-bold text-base shadow-sm transition-all text-center flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Caregiver Now</span>
            </a>
            <Link
              href="/emergency"
              className="min-h-[48px] w-full sm:w-auto px-5 py-3 bg-white hover:bg-rose-50 text-[#991B1B] border border-[#FECACA] rounded-xl font-bold text-base transition-all text-center inline-flex items-center justify-center"
            >
              Emergency Center
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 8. Clearance Buffer for Floating SOS Control ─── */}
      <div className="h-10 sm:h-14 w-full pointer-events-none" aria-hidden="true" />
    </div>
  );
}
