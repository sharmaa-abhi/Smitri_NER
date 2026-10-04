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
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#D5DFDC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-[#FFFBEB] text-[#B45309] px-3 py-1 rounded-full text-xs font-bold border border-[#D97706]/30">
              <TrendingUp className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Rhythm & Growth History</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111615] tracking-tight">
              Your Progress & History
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
              Celebrate your consistency and cognitive exercises over time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <VoiceButton
              textToRead={voiceSummary}
              buttonLabel="Read Progress"
            />

            {/* Range Switcher */}
            <div className="flex bg-[#F6F8F7] p-1 rounded-xl border border-[#D5DFDC]">
              <button
                type="button"
                onClick={() => setTimeRange('7')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  timeRange === '7' ? 'bg-[#0B534B] text-white shadow-sm' : 'text-[#5A6A66] hover:text-[#0B534B]'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('30')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  timeRange === '30' ? 'bg-[#0B534B] text-white shadow-sm' : 'text-[#5A6A66] hover:text-[#0B534B]'
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
            color: 'text-[#0B534B]',
            icon: Award,
            iconColor: 'text-[#0B534B]',
          },
          {
            label: 'Average Accuracy',
            val: `${avgAccuracy}%`,
            desc: 'Careful and deliberate matching',
            color: 'text-[#10B981]',
            icon: Target,
            iconColor: 'text-[#10B981]',
          },
          {
            label: 'Avg Response Time',
            val: `${avgResponse}s`,
            desc: 'Calm and comfortable speed',
            color: 'text-[#D97706]',
            icon: Clock,
            iconColor: 'text-[#D97706]',
          },
        ].map((card, idx) => (
          <ScrollReveal key={card.label} direction="up" delay={80 + idx * 60}>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5DFDC] shadow-sm space-y-1.5 h-full">
              <div className="flex items-center justify-between text-[#5A6A66]">
                <span className="text-[11px] font-bold uppercase tracking-wider">{card.label}</span>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <div className={`text-3xl sm:text-4xl font-black ${card.color}`}>
                {card.val} {card.sub && <span className="text-base font-semibold text-[#5A6A66]">{card.sub}</span>}
              </div>
              <p className="text-xs text-[#5A6A66] font-medium">{card.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Chart 1: Daily Cognitive Score Trend */}
      <ScrollReveal direction="up" delay={150}>
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-sm space-y-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-[#111615]">
            Cognitive Score Evolution ({timeRange}-Day View)
          </h2>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D5DFDC" />
                <XAxis dataKey="name" stroke="#5A6A66" fontSize={13} fontWeight="bold" />
                <YAxis domain={[40, 100]} stroke="#5A6A66" fontSize={13} fontWeight="bold" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#042420',
                    color: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #0B534B',
                    fontWeight: 'bold',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  name="Cognitive Score"
                  dataKey="score"
                  stroke="#0B534B"
                  strokeWidth={4}
                  dot={{ r: 5, fill: '#0B534B' }}
                />
                <Line
                  type="monotone"
                  name="Accuracy %"
                  dataKey="accuracy"
                  stroke="#10B981"
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
        <div className="bg-[#F6F8F7] rounded-2xl p-6 border border-[#D5DFDC] flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#5A6A66] flex-shrink-0 mt-0.5" />
          <p className="text-base text-[#5A6A66] font-medium leading-relaxed">
            These scores are for prototype demonstration and cognitive engagement purposes only. They do not constitute a medical diagnosis, clinical test, or dementia screen.
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
