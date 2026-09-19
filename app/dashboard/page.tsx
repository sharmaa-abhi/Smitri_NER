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
  ArrowRight
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
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

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleVoiceCommand = (transcript: string) => {
    const text = transcript.toLowerCase();
    if (text.includes('game') || text.includes('play') || text.includes('start')) {
      window.location.href = '/games/memory-match';
    } else if (text.includes('reminder') || text.includes('medicine') || text.includes('water')) {
      window.location.href = '/reminders';
    } else if (text.includes('emergency') || text.includes('help') || text.includes('doctor')) {
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

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-2xl font-bold text-slate-700">Loading your wellness dashboard...</p>
      </div>
    );
  }

  const user = data?.user || { name: 'Kamla Devi' };
  const gameSessions = data?.gameSessions || [];
  const reminders = data?.reminders || [];
  
  // Calculate today's cognitive score
  const latestSession = gameSessions[gameSessions.length - 1];
  const cognitiveScore = latestSession ? latestSession.score : 78;
  const gamesCompleted = gameSessions.filter((s: any) => {
    const today = new Date().toDateString();
    return new Date(s.timestamp).toDateString() === today;
  }).length || 2;

  // Next pending reminder
  const nextReminder = reminders.find((r: any) => !r.isCompleted) || reminders[0];

  // 7-Day Trend Chart Data
  const chartData = gameSessions.slice(-7).map((s: any, idx: number) => ({
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx % 7] || `Day ${idx + 1}`,
    score: s.score,
  }));

  const greetingInstruction = `Good day, ${user.name}. Your cognitive score today is ${cognitiveScore} out of 100. You have completed ${gamesCompleted} out of 3 daily exercises. Would you like to start today's memory game?`;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">🌅</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Good Morning, {user.name}
            </h1>
          </div>
          <p className="text-base text-slate-600 font-medium">
            Here is your gentle cognitive wellness rhythm for today.
          </p>
        </div>

        {/* Voice Assistant Controls */}
        <div className="flex-shrink-0">
          <VoiceButton 
            textToRead={greetingInstruction}
            onSpeechResult={handleVoiceCommand}
            buttonLabel="Read Summary"
          />
        </div>
      </div>

      {/* Main Big CTA Card */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-blue-900">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-900/60 px-4 py-1.5 rounded-full text-base font-bold text-amber-300">
            <Sparkles className="w-5 h-5" />
            <span>Today's Brain Workout</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black">
            Ready for Today's Memory Match?
          </h2>
          <p className="text-xl text-blue-100 font-medium max-w-xl">
            A relaxing 2-minute card puzzle designed to stimulate pattern recognition.
          </p>
        </div>

        <Link
          href="/games/memory-match"
          className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 px-10 py-5 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-all border-2 border-amber-500 flex-shrink-0"
        >
          <Play className="w-7 h-7 fill-slate-950" />
          <span>Start Today's Game</span>
        </Link>
      </div>

      {/* Primary Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Cognitive Score */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-3 border-slate-200 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-600 uppercase tracking-wider">
              Cognitive Score
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
              ★
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-blue-900">{cognitiveScore}</span>
            <span className="text-2xl font-bold text-slate-500">/ 100</span>
          </div>
          <p className="text-sm font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 inline-block">
            {cognitiveScore >= 80 ? "Status: Excellent Focus" : cognitiveScore >= 60 ? "Status: Steady & Good" : "Status: Relaxed Pace"}
          </p>
        </div>

        {/* Metric 2: Games Completed */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-3 border-slate-200 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-600 uppercase tracking-wider">
              Games Completed
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
              ✓
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">{gamesCompleted}</span>
            <span className="text-2xl font-bold text-slate-500">/ 3 today</span>
          </div>
          <p className="text-base text-slate-600 font-medium">
            1 gentle exercise left for your daily rhythm.
          </p>
        </div>

        {/* Metric 3: Next Reminder */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-3 border-slate-200 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-600 uppercase tracking-wider">
              Next Reminder
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          {nextReminder ? (
            <div>
              <span className="text-2xl font-black text-slate-900 block truncate">
                {nextReminder.title}
              </span>
              <span className="text-xl font-bold text-amber-700 block mt-1">
                ⏰ {nextReminder.time}
              </span>
            </div>
          ) : (
            <p className="text-xl font-bold text-teal-700">All caught up for now!</p>
          )}
          <Link
            href="/reminders"
            className="text-base font-bold text-blue-800 hover:underline inline-flex items-center gap-1"
          >
            <span>View all reminders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2-Column Section: 7-Day Chart & Quick Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Your Progress Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Your Progress</h3>
              <p className="text-base text-slate-600 font-medium">Past 7 daily cognitive sessions</p>
            </div>
            <Link
              href="/progress"
              className="text-base font-bold text-blue-800 hover:underline flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={14} fontWeight="bold" />
                <YAxis domain={[40, 100]} stroke="#64748b" fontSize={14} fontWeight="bold" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#1d4ed8"
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#1d4ed8' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs sm:text-sm text-slate-500 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200">
            ℹ️ Scores reflect prototype memory performance and are not medical diagnoses.
          </div>
        </div>

        {/* Right: Today's Reminders Checklist */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Daily Support</h3>
              <p className="text-base text-slate-600 font-medium">Tap to check off tasks</p>
            </div>
            <Link
              href="/reminders"
              className="text-base font-bold text-blue-800 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {reminders.slice(0, 4).map((rem: any) => (
              <div
                key={rem.id}
                onClick={() => markReminderDone(rem.id, rem.isCompleted)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  rem.isCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-slate-500 opacity-80'
                    : 'bg-slate-50 border-slate-300 hover:border-blue-400 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                      rem.isCompleted
                        ? 'bg-emerald-600 border-emerald-700 text-white'
                        : 'border-slate-400 bg-white'
                    }`}
                    aria-label={rem.isCompleted ? "Completed" : "Mark as done"}
                  >
                    {rem.isCompleted && <CheckCircle2 className="w-6 h-6" />}
                  </button>
                  <div>
                    <span className={`text-lg font-bold block ${rem.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {rem.title}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {rem.time}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase bg-white border border-slate-200">
                  {rem.category}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Link
              href="/reminders"
              className="w-full py-3 text-center bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-800 transition-colors"
            >
              + Add New Reminder
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Quick Bar at Bottom of Dashboard */}
      <div className="bg-rose-50 border-3 border-rose-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-rose-950">Need Immediate Help?</h4>
            <p className="text-base text-rose-800 font-medium">
              Call your caregiver Rahul or trigger 1-touch emergency services anytime.
            </p>
          </div>
        </div>

        <Link
          href="/emergency"
          className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xl shadow-lg transition-all text-center flex-shrink-0"
        >
          Open Emergency Support
        </Link>
      </div>
    </div>
  );
}
