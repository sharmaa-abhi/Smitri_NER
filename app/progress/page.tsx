"use client";

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  Clock, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Activity
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

  const avgScore = sessions.length
    ? Math.round(sessions.reduce((acc: number, s: any) => acc + s.score, 0) / sessions.length)
    : 76;
  const avgAccuracy = sessions.length
    ? Math.round(sessions.reduce((acc: number, s: any) => acc + s.accuracy, 0) / sessions.length)
    : 84;
  const avgResponse = sessions.length
    ? (sessions.reduce((acc: number, s: any) => acc + s.responseTimeSec, 0) / sessions.length).toFixed(1)
    : '21.0';

  const chartData = sessions.map((s: any) => ({
    name: new Date(s.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' }),
    score: s.score,
    accuracy: s.accuracy,
    response: s.responseTimeSec,
  }));

  const voiceSummary = `In your past ${timeRange} days of exercises, your average cognitive score is ${avgScore} out of 100, and your average accuracy is ${avgAccuracy} percent. Keep up your wonderful steady rhythm!`;

  return (
    <div className="space-y-8 pb-36 sm:pb-44 max-w-5xl mx-auto">
      {/* ─── 1. Header ─── */}
      <header className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D5DFDC] shadow-[0_2px_12px_rgba(11,83,75,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 bg-[#ECFDF5] text-[#065F46] px-3.5 py-1 rounded-full text-xs font-bold border border-[#A7F3D0]">
            <TrendingUp className="w-4 h-4 text-[#059669]" />
            <span>Cognitive History &amp; Vitality</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111615] tracking-tight">
            Your Cognitive Progress
          </h1>
          <p className="text-[17px] sm:text-[18px] text-[#374151] font-normal leading-relaxed">
            Review your consistency, recall accuracy, and cognitive rhythm over time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-shrink-0 pt-2 md:pt-0">
          <VoiceButton
            textToRead={voiceSummary}
            buttonLabel="Read Progress"
            className="min-h-[48px] px-5 text-base font-semibold"
          />

          {/* Range Switcher */}
          <div className="flex bg-[#F9FAFB] p-1.5 rounded-xl border border-[#D5DFDC]">
            <button
              type="button"
              onClick={() => setTimeRange('7')}
              className={`min-h-[40px] px-4 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                timeRange === '7' ? 'bg-[#0B534B] text-white shadow-xs' : 'text-[#4B5563] hover:text-[#0B534B]'
              }`}
            >
              Past 7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30')}
              className={`min-h-[40px] px-4 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                timeRange === '30' ? 'bg-[#0B534B] text-white shadow-xs' : 'text-[#4B5563] hover:text-[#0B534B]'
              }`}
            >
              Past 30 Days
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2. Metric Overview Cards ─── */}
      <section aria-label="Progress metrics">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-[0_2px_10px_rgba(11,83,75,0.04)] flex flex-col justify-between min-h-[156px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Average Score
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5] flex items-center justify-center shadow-2xs">
                <Award className="w-5 h-5 text-[#0B534B]" />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0B534B]">{avgScore}</span>
                <span className="text-base font-bold text-[#5A6A66]">/ 100</span>
              </div>
              <p className="text-sm font-medium text-[#4B5563] mt-1">Across {sessions.length} sessions</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-[0_2px_10px_rgba(11,83,75,0.04)] flex flex-col justify-between min-h-[156px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Average Accuracy
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#059669]" />
              </div>
            </div>
            <div className="pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#059669]">{avgAccuracy}%</span>
              <p className="text-sm font-medium text-[#4B5563] mt-1">Precise choice rate</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-[0_2px_10px_rgba(11,83,75,0.04)] flex flex-col justify-between min-h-[156px]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5A6A66] uppercase tracking-wider">
                Average Response Time
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] flex items-center justify-center shadow-2xs">
                <Clock className="w-5 h-5 text-[#D97706]" />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#111615]">{avgResponse}</span>
                <span className="text-base font-bold text-[#5A6A66]">seconds</span>
              </div>
              <p className="text-sm font-medium text-[#4B5563] mt-1">Comfortable, unrushed speed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Score Trajectory Chart ─── */}
      <section aria-label="Score trajectory chart">
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-[0_2px_12px_rgba(11,83,75,0.06)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111615]">
                Cognitive Vitality Over Time
              </h2>
              <p className="text-sm text-[#4B5563]">
                Daily score consistency over the past {timeRange} days
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0B534B"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0B534B' }}
                  activeDot={{ r: 7, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ─── 4. Response Time Bar Chart ─── */}
      <section aria-label="Response time chart">
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111615]">
                Recall Response Time (Seconds)
              </h2>
              <p className="text-sm text-[#4B5563]">
                Pacing per exercise (unhurried and relaxed)
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} fontWeight="600" />
                <YAxis stroke="#6B7280" fontSize={12} fontWeight="600" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#042420',
                    color: '#fff',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontSize: '13px',
                  }}
                  formatter={(val: any) => [`${val}s`, 'Pace']}
                />
                <Bar dataKey="response" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ─── 5. Clearance Buffer for Floating SOS Control ─── */}
      <div className="h-10 sm:h-14 w-full pointer-events-none" aria-hidden="true" />
    </div>
  );
}
