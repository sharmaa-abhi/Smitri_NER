"use client";

import { useEffect, useState } from 'react';
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Calendar, 
  User, 
  Activity, 
  Clock, 
  Phone,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import ScrollReveal from '@/components/ScrollReveal';

export default function CaregiverPortalPage() {
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

  const user = data?.user || { name: 'Kamla Devi', age: 68, emergencyPhone: '+91 98765 43210' };
  const gameSessions = data?.gameSessions || [];
  const reminders = data?.reminders || [];
  const alerts = data?.caregiverAlerts || [];

  // Metrics computation
  const recent7 = gameSessions.slice(-7);
  const currentScore = recent7.length ? recent7[recent7.length - 1].score : 78;
  const avgResponse = recent7.length
    ? (recent7.reduce((acc: number, s: any) => acc + s.responseTimeSec, 0) / recent7.length).toFixed(1)
    : '21.4';
  const avgAccuracy = recent7.length
    ? Math.round(recent7.reduce((acc: number, s: any) => acc + s.accuracy, 0) / recent7.length)
    : 82;

  const completedReminders = reminders.filter((r: any) => r.isCompleted).length;
  const reminderRate = reminders.length ? Math.round((completedReminders / reminders.length) * 100) : 100;

  // 7-day trend chart with labels Mon->Sun
  const trendData = [
    { day: 'Monday', score: 72 },
    { day: 'Tuesday', score: 75 },
    { day: 'Wednesday', score: 78 },
    { day: 'Thursday', score: 74 },
    { day: 'Friday', score: 69 },
    { day: 'Saturday', score: 65 },
    { day: 'Sunday', score: 62 },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Caregiver Portal Header */}
      <ScrollReveal direction="down">
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-slate-800 text-teal-400 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Caregiver & Healthcare Observation Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Caregiver Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Monitoring cognitive performance trends and daily routine adherence for: <span className="text-white font-bold underline">{user.name}</span> (Age: {user.age}).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${user.emergencyPhone}`}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call {user.name}</span>
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Sustained Decline / Caregiver Alert Banner */}
      <ScrollReveal direction="up" delay={80}>
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-amber-950">
              Attention Required: Performance Change Detected
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
            Performance has decreased consistently over the selected period. Noticeable slowdown in sequence memory response time observed between Friday and Sunday.
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs font-semibold text-amber-950">
            💡 Recommended Action: Check in gently with Kamla Devi. Confirm hydration, proper sleep, and comfort with lighting. (Note: Non-medical observation; consult doctor for medical evaluations).
          </div>
        </div>
      </ScrollReveal>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current Score', value: `${currentScore}`, sub: '/ 100', desc: 'Latest session benchmark', color: 'text-blue-900' },
          { label: 'Avg Accuracy', value: `${avgAccuracy}%`, desc: 'Across 7 days', color: 'text-teal-800' },
          { label: 'Avg Response Time', value: `${avgResponse}s`, desc: 'Time per challenge', color: 'text-amber-800' },
          { label: 'Reminder Adherence', value: `${reminderRate}%`, desc: 'Medicines & routines completed', color: 'text-emerald-800' },
        ].map((kpi, idx) => (
          <ScrollReveal key={kpi.label} direction="up" delay={100 + idx * 60}>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-1 h-full">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{kpi.label}</span>
              <div className={`text-2xl sm:text-3xl font-black ${kpi.color}`}>
                {kpi.value} {kpi.sub && <span className="text-sm font-semibold text-slate-600">{kpi.sub}</span>}
              </div>
              <span className="text-xs font-medium text-slate-600">{kpi.desc}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* 7-Day Performance Trend Chart */}
      <ScrollReveal direction="up" delay={150}>
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                7-Day Performance Trajectory
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Illustrating daily scores and decline detection trigger
              </p>
            </div>
            <div className="text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 border border-slate-200">
              Trend: -10 pts decline over weekend
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} fontWeight="600" />
                <YAxis domain={[50, 90]} stroke="#64748b" fontSize={12} fontWeight="600" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '10px',
                    fontWeight: '600',
                    fontSize: '13px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#dc2626' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ScrollReveal>

      {/* Healthcare Integration & ABDM / HL7 FHIR Concept Section */}
      <ScrollReveal direction="up" delay={180}>
        <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-blue-800" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Healthcare Data Interoperability
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded-full border border-blue-300 uppercase">
              Planned / Future Integration: ABDM & HL7 FHIR
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            The prototype structure models patient records for future Ayushman Bharat Digital Mission (ABDM) and HL7 FHIR clinical exchange. Below is the projected patient export schema:
          </p>

          <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto space-y-1 shadow-inner">
            <div>Patient ID: ABHA-8492-4910-3841 (Kamla Devi)</div>
            <div>Resource Type: Observation / CognitiveWellnessRecord</div>
            <div>Average Trend: 71.4 / 100 (Weekly Mean)</div>
            <div>Compliance: 85% Medication Adherence</div>
            <div>FHIR Mapping: Planned / Future Integration via ABDM Gateway</div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}iv>
    </div>
  );
}
