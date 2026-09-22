"use client";

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  Clock, 
  Target, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';

export default function ProgressPage() {
  const [data, setData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
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

  const gameSessions = data?.gameSessions || [];
  const count = timeRange === '7' ? 7 : 30;
  const sessions = gameSessions.slice(-count);

  // Compute metrics
  const avgScore = sessions.length
    ? Math.round(sessions.reduce((acc: number, s: any) => acc + s.score, 0) / sessions.length)
    : 76;
  const avgAccuracy = sessions.length
    ? Math.round(sessions.reduce((acc: number, s: any) => acc + s.accuracy, 0) / sessions.length)
    : 84;
  const avgResponse = sessions.length
    ? (sessions.reduce((acc: number, s: any) => acc + s.responseTimeSec, 0) / sessions.length).toFixed(1)
    : '21.0';

  const chartData = sessions.map((s: any, idx: number) => ({
    name: new Date(s.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' }),
    score: s.score,
    accuracy: s.accuracy,
    response: s.responseTimeSec,
  }));

  const voiceSummary = `In your past ${timeRange} days of exercises, your average cognitive score is ${avgScore} out of 100, and your average accuracy is ${avgAccuracy} percent. Keep up your wonderful steady rhythm!`;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <ScrollReveal direction="down">
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
              <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
              <span>Rhythm & Growth History</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Your Progress & History
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Celebrate your consistency and cognitive exercises over time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <VoiceButton
              textToRead={voiceSummary}
              buttonLabel="Read Progress"
            />

            {/* Range Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setTimeRange('7')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  timeRange === '7' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:text-blue-900'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('30')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  timeRange === '30' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:text-blue-900'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Average Score',
            val: avgScore,
            sub: '/ 100',
            desc: 'Steady focus across all games',
            color: 'text-blue-900',
            icon: Award,
            iconColor: 'text-blue-700',
          },
          {
            label: 'Average Accuracy',
            val: `${avgAccuracy}%`,
            desc: 'Careful and deliberate matching',
            color: 'text-teal-900',
            icon: Target,
            iconColor: 'text-teal-700',
          },
          {
            label: 'Avg Response Time',
            val: `${avgResponse}s`,
            desc: 'Calm and comfortable speed',
            color: 'text-amber-900',
            icon: Clock,
            iconColor: 'text-amber-700',
          },
        ].map((card, idx) => (
          <ScrollReveal key={card.label} direction="up" delay={80 + idx * 60}>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-1.5 h-full">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-[11px] font-bold uppercase tracking-wider">{card.label}</span>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <div className={`text-3xl sm:text-4xl font-black ${card.color}`}>
                {card.val} {card.sub && <span className="text-base font-semibold text-slate-600">{card.sub}</span>}
              </div>
              <p className="text-xs text-slate-600 font-medium">{card.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Chart 1: Daily Cognitive Score Trend */}
      <ScrollReveal direction="up" delay={150}>
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Cognitive Score Evolution ({timeRange}-Day View)
          </h2>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={13} fontWeight="bold" />
                <YAxis domain={[40, 100]} stroke="#64748b" fontSize={13} fontWeight="bold" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  name="Cognitive Score"
                  dataKey="score"
                  stroke="#1d4ed8"
                  strokeWidth={4}
                  dot={{ r: 5, fill: '#1d4ed8' }}
                />
                <Line
                  type="monotone"
                  name="Accuracy %"
                  dataKey="accuracy"
                  stroke="#0d9488"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ScrollReveal>

      {/* Non-Medical Notice Footer */}
      <ScrollReveal direction="up" delay={180}>
        <div className="bg-slate-100 rounded-2xl p-6 border-2 border-slate-300 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-slate-600 flex-shrink-0 mt-0.5" />
          <p className="text-base text-slate-600 font-medium leading-relaxed">
            These scores are for prototype demonstration and cognitive engagement purposes only. They do not constitute a medical diagnosis, clinical test, or dementia screen.
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
