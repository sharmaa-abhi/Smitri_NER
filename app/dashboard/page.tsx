"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Droplet, 
  Pill, 
  ShieldAlert,
  ArrowRight,
  Heart,
  Stethoscope,
  PhoneCall,
  Calendar,
  Award,
  Zap,
  Check,
  Plus,
  Minus,
  MapPin,
  Smile,
  Activity
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';
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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hydrationCount, setHydrationCount] = useState<number>(4);
  const [moodStatus, setMoodStatus] = useState<'great' | 'calm' | 'tired'>('great');
  const [activeTab, setActiveTab] = useState<'routine' | 'games'>('routine');

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

  const handleVoiceCommand = (transcript: string) => {
    const text = transcript.toLowerCase();
    if (text.includes('game') || text.includes('play') || text.includes('start') || text.includes('khel')) {
      window.location.href = '/games/grocery-basket';
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
        <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xl sm:text-2xl font-bold text-slate-700">Loading your wellness dashboard...</p>
      </div>
    );
  }

  const user = data?.user || { 
    name: 'Kamla Devi', 
    age: 68, 
    city: 'Guwahati, Assam',
    emergencyPhone: '+91 98765 43210',
    emergencyName: 'Rahul Sharma (Son / Caregiver)',
    doctorName: 'Dr. Manab Barua',
    doctorPhone: '+91 94350 12345',
    dailyHydrationTarget: 6,
    currentHydrationGlasses: 4
  };
  const gameSessions = data?.gameSessions || [];
  const reminders = data?.reminders || [];
  
  // Calculate today's cognitive score and metrics
  const latestSession = gameSessions[gameSessions.length - 1];
  const cognitiveScore = latestSession ? latestSession.score : 86;
  const avgAccuracy = Math.round(
    gameSessions.reduce((acc: number, s: any) => acc + (s.accuracy || 85), 0) / (gameSessions.length || 1)
  );

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

  const greetingInstruction = `Namaste ${user.name}. You are doing wonderfully today in ${user.city || 'Guwahati'}. You have completed ${completedReminders} of ${totalReminders} daily routines, and your cognitive wellness score is ${cognitiveScore} out of 100. Your next reminder is: ${nextReminder ? nextReminder.title : 'Take evening rest'}. Would you like to play today's Grocery Basket recall challenge?`;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Senior Welcome & Daily Summary Header */}
      <ScrollReveal direction="down">
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl sm:text-3xl">🌸</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Namaste, {user.name}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Caregiver: Rahul
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {user.city || 'Guwahati, Assam'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span>•</span>
              <span className="text-teal-700 font-bold">
                Doctor: {user.doctorName || 'Dr. Manab Barua'}
              </span>
            </div>
          </div>

          {/* Voice Assistant & Emergency dial */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <VoiceButton 
              textToRead={greetingInstruction}
              onSpeechResult={handleVoiceCommand}
              buttonLabel="Listen Summary"
            />
            <a
              href={`tel:${user.emergencyPhone || '+919876543210'}`}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all"
              title="Call Caregiver Rahul"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Rahul</span>
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Hero Banner: Real-World Routine & Daily Cognitive Quest Integration */}
      <ScrollReveal direction="up" delay={80}>
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-blue-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Today's Real-World Exercise • Episode 4</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Grocery Basket: Weekly Vegetable Bazaar Recall
              </h2>
              <p className="text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
                A real-life 2-minute memory puzzle based on remembering your vegetable and pantry shopping list for today's lunch. Proven to stimulate episodic recall and everyday confidence.
              </p>

              {/* Quick tags for real-world relevance */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10 text-white font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Real-life Shopping
                </span>
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10 text-white font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-300" /> 2 Minutes Only
                </span>
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10 text-white font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-teal-300" /> Level 1 (Gentle Pace)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
              <Link
                href="/games/grocery-basket"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 px-7 py-4 rounded-2xl font-black text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-amber-500 text-center"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>Start Bazaar Challenge</span>
              </Link>

              <Link
                href="/games"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-2xl font-bold text-sm border border-white/20 transition-all text-center"
              >
                <span>View All 9 Real-Life Games</span>
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
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cognitive Vitality
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                ★
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-blue-900">{cognitiveScore}</span>
                <span className="text-sm font-bold text-slate-500">/ 100</span>
              </div>
              <p className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 inline-block mt-2">
                Stable • Healthy Focus
              </p>
            </div>
            <span className="text-[11px] text-slate-500">
              Avg Recall Speed: <strong>17.5s</strong>
            </span>
          </div>
        </ScrollReveal>

        {/* Card 2: Real-World Routine Checklist */}
        <ScrollReveal direction="up" delay={140}>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Daily Routine Adherence
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                ✓
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-800">{completedReminders}</span>
                <span className="text-sm font-bold text-slate-500">/ {totalReminders} Done</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${routinePercent}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold">
              {routinePercent}% completed today
            </span>
          </div>
        </ScrollReveal>

        {/* Card 3: Interactive Real-World Hydration Tracker */}
        <ScrollReveal direction="up" delay={180}>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hydration Meter
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                <Droplet className="w-4 h-4 text-sky-600 fill-sky-600" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-sky-900">{hydrationCount}</span>
                <span className="text-sm font-bold text-slate-500">/ {user.dailyHydrationTarget || 6} Glasses</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-1">
                Warm water & coconut water
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => updateHydration(1)}
                className="flex-1 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                title="Add 1 glass of water"
              >
                <Plus className="w-3.5 h-3.5" /> +1 Glass
              </button>
              <button
                type="button"
                onClick={() => updateHydration(-1)}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold transition-colors"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Card 4: Next Scheduled Medicine / Routine */}
        <ScrollReveal direction="up" delay={220}>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Up Next In Routine
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {nextReminder ? (
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2">
                  {nextReminder.title}
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                  ⏰ {nextReminder.time}
                </span>
              </div>
            ) : (
              <p className="text-sm font-bold text-teal-700">All activities completed for today!</p>
            )}

            <Link
              href="/reminders"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
            >
              <span>View full schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Main 2-Column Section: Real-World Routine Checklist + 7-Day Cognitive Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Real-World Daily Timeline (Kamla Devi's Routine) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <ScrollReveal direction="left" delay={150}>
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span>🗓️</span> Real-World Daily Timeline
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Elder medication schedule, cognitive challenges, and meals
                  </p>
                </div>
                <Link
                  href="/reminders"
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
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
                          ? 'bg-slate-50/70 border-slate-200 opacity-65' 
                          : 'bg-white hover:bg-blue-50/40 border-slate-200/90 shadow-sm hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          type="button"
                          className={`w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-700 text-white'
                              : 'border-slate-400 bg-white hover:border-blue-600'
                          }`}
                          aria-label={isDone ? "Completed" : "Mark done"}
                        >
                          {isDone && <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-sm sm:text-base font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {rem.title}
                            </span>
                            {rem.priority === 'HIGH' && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                                Priority
                              </span>
                            )}
                          </div>

                          {rem.dosage && (
                            <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                              <Pill className="w-3.5 h-3.5 text-blue-600" />
                              Dosage: {rem.dosage}
                            </p>
                          )}

                          {rem.notes && (
                            <p className="text-xs text-slate-500">
                              ℹ️ {rem.notes}
                            </p>
                          )}

                          <span className="text-xs font-bold text-amber-700 flex items-center gap-1 pt-0.5">
                            <Clock className="w-3.5 h-3.5" /> {rem.time}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase border flex-shrink-0 ${
                        rem.category === 'MEDICINE'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : rem.category === 'WATER'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : rem.category === 'DOCTOR'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : rem.category === 'EXERCISE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {rem.category}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mood & Energy Quick Check-in */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 block">Elder Morning Feeling / Mood:</span>
                  <span className="text-xs text-slate-500">Reported to caregiver Rahul daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMoodStatus('great')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      moodStatus === 'great' 
                        ? 'bg-emerald-700 text-white shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>😊</span> Energetic
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoodStatus('calm')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      moodStatus === 'calm' 
                        ? 'bg-blue-700 text-white shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>😌</span> Calm
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoodStatus('tired')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      moodStatus === 'tired' 
                        ? 'bg-amber-700 text-white shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>😴</span> Rest Needed
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: 7-Day Cognitive Trajectory & Game Dashboard Mini-Analytics - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <ScrollReveal direction="right" delay={180}>
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Cognitive Progress
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Past 7 Real-World Cognitive Sessions
                  </p>
                </div>
                <Link
                  href="/progress"
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                >
                  <span>Full Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 7-Day Chart */}
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight="600" />
                    <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} fontWeight="600" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        color: '#fff',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name: any) => [`${val} / 100`, 'Score']}
                      labelFormatter={(label, payload) => {
                        const item = payload[0]?.payload;
                        return item ? `${label} • ${item.scenario}` : label;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      strokeWidth={3.5}
                      dot={{ fill: '#2563eb', r: 4 }}
                      activeDot={{ r: 6, fill: '#1d4ed8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Game Domain Performance Breakdown */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Everyday Mental Abilities
                </span>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Short-Term Memory Recall</span>
                      <span className="text-[11px] text-slate-500">Market items & medicine strips</span>
                    </div>
                    <span className="text-xs font-black text-blue-900 bg-white px-2 py-1 rounded-md border border-blue-200">
                      90% Accuracy
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Time & Routine Orientation</span>
                      <span className="text-[11px] text-slate-500">Clock hands, prayer & doctor times</span>
                    </div>
                    <span className="text-xs font-black text-emerald-900 bg-white px-2 py-1 rounded-md border border-emerald-200">
                      96% Precision
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Visual Discrimination</span>
                      <span className="text-[11px] text-slate-500">Spotting expired labels & signs</span>
                    </div>
                    <span className="text-xs font-black text-amber-900 bg-white px-2 py-1 rounded-md border border-amber-200">
                      92% Precision
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Link to Game Dashboard Hub */}
              <Link
                href="/games"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Open Game Dashboard & All 9 Games</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>

      </div>

      {/* Emergency Immediate Action Footer Banner */}
      <ScrollReveal direction="up" delay={220}>
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-extrabold text-rose-950">
                Senior Emergency or Feeling Unwell?
              </h4>
              <p className="text-xs sm:text-sm text-rose-800 font-medium max-w-xl">
                One-touch direct dial to primary caregiver Rahul ({user.emergencyPhone || '+91 98765 43210'}) or emergency helpline 112.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-shrink-0">
            <a
              href={`tel:${user.emergencyPhone || '+919876543210'}`}
              className="w-full sm:w-auto px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Rahul Now</span>
            </a>
            <Link
              href="/emergency"
              className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 rounded-xl font-bold text-sm transition-all text-center"
            >
              Emergency Center
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
