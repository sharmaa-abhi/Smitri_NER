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
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-teal-400 px-3.5 py-1 rounded-full text-sm font-bold border border-slate-700">
            <Stethoscope className="w-4 h-4" />
            <span>Caregiver & Healthcare Observation Console</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Caregiver Dashboard
          </h1>
          <p className="text-lg text-slate-300 font-medium">
            Monitoring cognitive performance trends and daily routine adherence for: <span className="text-white font-bold underline">{user.name}</span> (Age: {user.age}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${user.emergencyPhone}`}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3.5 rounded-2xl font-black text-lg shadow-md transition-all"
          >
            <Phone className="w-5 h-5" />
            <span>Call Kamla Devi</span>
          </a>
        </div>
      </div>

      {/* Sustained Decline / Caregiver Alert Banner */}
      <div className="bg-amber-50 border-3 border-amber-400 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
            Attention Required: Performance Change Detected
          </h2>
        </div>
        <p className="text-xl text-amber-900 font-semibold leading-relaxed">
          Performance has decreased consistently over the selected period. Noticeable slowdown in sequence memory response time observed between Friday and Sunday.
        </p>
        <div className="bg-white/80 p-4 rounded-2xl border border-amber-200 text-sm font-bold text-amber-950">
          💡 Recommended Action: Check in gently with Kamla Devi. Confirm hydration, proper sleep, and comfort with lighting. (Note: Non-medical observation; consult doctor for medical evaluations).
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border-3 border-slate-200 shadow-md space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Score</span>
          <div className="text-4xl font-black text-blue-900">{currentScore} <span className="text-lg font-bold text-slate-500">/ 100</span></div>
          <span className="text-sm font-semibold text-slate-600">Latest session benchmark</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border-3 border-slate-200 shadow-md space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Accuracy</span>
          <div className="text-4xl font-black text-teal-800">{avgAccuracy}%</div>
          <span className="text-sm font-semibold text-slate-600">Across 7 days</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border-3 border-slate-200 shadow-md space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Response Time</span>
          <div className="text-4xl font-black text-amber-800">{avgResponse}s</div>
          <span className="text-sm font-semibold text-slate-600">Time per challenge</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border-3 border-slate-200 shadow-md space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Reminder Adherence</span>
          <div className="text-4xl font-black text-emerald-800">{reminderRate}%</div>
          <span className="text-sm font-semibold text-slate-600">Medicines & routines completed</span>
        </div>
      </div>

      {/* 7-Day Performance Trend Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              7-Day Performance Trajectory
            </h2>
            <p className="text-base text-slate-600 font-medium">
              Illustrating daily scores and decline detection trigger
            </p>
          </div>
          <div className="text-sm font-bold bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700 border border-slate-200">
            Trend: -10 pts decline over weekend
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={13} fontWeight="bold" />
              <YAxis domain={[50, 90]} stroke="#64748b" fontSize={13} fontWeight="bold" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#dc2626"
                strokeWidth={4}
                dot={{ r: 6, fill: '#dc2626' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Healthcare Integration & ABDM / HL7 FHIR Concept Section */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border-3 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Layers className="w-7 h-7 text-blue-800" />
            <h3 className="text-2xl font-black text-slate-900">
              Healthcare Data Interoperability
            </h3>
          </div>
          <span className="text-xs font-black px-3 py-1 bg-blue-100 text-blue-900 rounded-full border border-blue-300 uppercase">
            Planned / Future Integration: ABDM & HL7 FHIR
          </span>
        </div>

        <p className="text-base text-slate-600 font-medium leading-relaxed">
          The prototype structure models patient records for future Ayushman Bharat Digital Mission (ABDM) and HL7 FHIR clinical exchange. Below is the projected patient export schema:
        </p>

        <div className="bg-slate-900 text-emerald-400 p-5 rounded-2xl font-mono text-sm overflow-x-auto space-y-1 shadow-inner">
          <div>Patient ID: ABHA-8492-4910-3841 (Kamla Devi)</div>
          <div>Resource Type: Observation / CognitiveWellnessRecord</div>
          <div>Average Trend: 71.4 / 100 (Weekly Mean)</div>
          <div>Compliance: 85% Medication Adherence</div>
          <div>FHIR Mapping: Planned / Future Integration via ABDM Gateway</div>
        </div>
      </div>
    </div>
  );
}
