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
  Layers,
  Send,
  Smartphone,
  BellRing
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
  const [alertSending, setAlertSending] = useState(false);
  const [alertResult, setAlertResult] = useState<any>(null);

  const handleTriggerTestAlert = async (type: string = 'SUSTAINED_DECLINE') => {
    setAlertSending(true);
    setAlertResult(null);
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertType: type,
          patientName: user.name,
          caregiverPhone: user.emergencyPhone,
          details: type === 'SUSTAINED_DECLINE'
            ? 'Noticeable 10-point drop in memory test scores detected over the last 3 days.'
            : 'Patient has not confirmed morning heart medication after 2 scheduled reminders.',
          severity: 'HIGH',
        }),
      });
      const result = await res.json();
      setAlertResult(result);
      // Refresh alerts list
      fetch('/api/dashboard')
        .then((r) => r.json())
        .then((d) => setData(d));
    } catch (err) {
      console.error(err);
    } finally {
      setAlertSending(false);
    }
  };

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
        <div className="bg-gradient-to-br from-[#042420] via-[#0B534B] to-[#042420] text-white rounded-2xl p-5 sm:p-7 border border-[#10B981]/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-[#10B981]/20 text-[#ECFDF5] px-3 py-1 rounded-full text-xs font-bold border border-[#10B981]/40">
              <Stethoscope className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Caregiver & Healthcare Observation Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Caregiver Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#D5DFDC] font-medium">
              Monitoring cognitive performance trends and daily routine adherence for: <span className="text-white font-bold underline">{user.name}</span> (Age: {user.age}).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${user.emergencyPhone}`}
              className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-[#042420] px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call {user.name}</span>
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Sustained Decline / Caregiver Alert Banner */}
      <ScrollReveal direction="up" delay={80}>
        <div className="bg-[#FFFBEB] border border-[#D97706]/40 rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-[#92400E]">
              Attention Required: Performance Change Detected
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#B45309] font-medium leading-relaxed">
            Performance has decreased consistently over the selected period. Noticeable slowdown in sequence memory response time observed between Friday and Sunday.
          </p>
          <div className="bg-white/90 p-3 rounded-xl border border-[#D97706]/30 text-xs font-semibold text-[#92400E]">
            💡 Recommended Action: Check in gently with Kamla Devi. Confirm hydration, proper sleep, and comfort with lighting. (Note: Non-medical observation; consult doctor for medical evaluations).
          </div>
        </div>
      </ScrollReveal>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current Score', value: `${currentScore}`, sub: '/ 100', desc: 'Latest session benchmark', color: 'text-[#0B534B]' },
          { label: 'Avg Accuracy', value: `${avgAccuracy}%`, desc: 'Across 7 days', color: 'text-[#065F46]' },
          { label: 'Avg Response Time', value: `${avgResponse}s`, desc: 'Time per challenge', color: 'text-[#D97706]' },
          { label: 'Reminder Adherence', value: `${reminderRate}%`, desc: 'Medicines & routines completed', color: 'text-[#065F46]' },
        ].map((kpi, idx) => (
          <ScrollReveal key={kpi.label} direction="up" delay={100 + idx * 60}>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5DFDC] shadow-sm space-y-1 h-full">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6A66]">{kpi.label}</span>
              <div className={`text-2xl sm:text-3xl font-black ${kpi.color}`}>
                {kpi.value} {kpi.sub && <span className="text-sm font-semibold text-[#5A6A66]">{kpi.sub}</span>}
              </div>
              <span className="text-xs font-medium text-[#5A6A66]">{kpi.desc}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* 7-Day Performance Trend Chart */}
      <ScrollReveal direction="up" delay={150}>
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#111615]">
                7-Day Performance Trajectory
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
                Illustrating daily scores and decline detection trigger
              </p>
            </div>
            <div className="text-xs font-semibold bg-[#F6F8F7] px-2.5 py-1 rounded-lg text-[#5A6A66] border border-[#D5DFDC]">
              Trend: -10 pts decline over weekend
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D5DFDC" />
                <XAxis dataKey="day" stroke="#5A6A66" fontSize={12} fontWeight="600" />
                <YAxis domain={[50, 90]} stroke="#5A6A66" fontSize={12} fontWeight="600" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#042420',
                    color: '#fff',
                    borderRadius: '10px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontWeight: '600',
                    fontSize: '13px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#D97706"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#D97706' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ScrollReveal>

      {/* Phase 1 Implemented: Multi-Channel Caregiver Alert Dispatcher */}
      <ScrollReveal direction="up" delay={160}>
        <div className="bg-white rounded-2xl p-6 border border-[#0B534B]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#D5DFDC]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#0B534B]">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#111615]">
                  Multi-Channel Caregiver Alerts (Phase 1)
                </h3>
                <p className="text-xs text-[#5A6A66]">
                  Instant real-time dispatches via Telegram Bot, WhatsApp/SMS, and In-App surveillance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 bg-[#ECFDF5] text-[#065F46] rounded-full border border-[#10B981]/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                Telegram Bot: Free Active
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-[#E6F4F1] text-[#0B534B] rounded-full border border-[#0B534B]/20">
                WhatsApp / SMS Ready
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 bg-[#F6F8F7] rounded-xl border border-[#D5DFDC]">
              <div className="text-xs font-bold text-[#5A6A66] uppercase">Registered Caregiver</div>
              <div className="text-sm font-black text-[#111615] mt-1">{user.emergencyName || 'Rahul (Son)'}</div>
              <div className="text-xs text-[#0B534B] font-semibold">{user.emergencyPhone}</div>
            </div>
            <div className="p-3.5 bg-[#F6F8F7] rounded-xl border border-[#D5DFDC]">
              <div className="text-xs font-bold text-[#5A6A66] uppercase">Emergency Protocol</div>
              <div className="text-sm font-black text-[#111615] mt-1">Direct Cellular & Telegram</div>
              <div className="text-xs text-[#5A6A66]">Zero delayed server dependency</div>
            </div>
            <div className="p-3.5 bg-[#F6F8F7] rounded-xl border border-[#D5DFDC]">
              <div className="text-xs font-bold text-[#5A6A66] uppercase">Offline Safety Queue</div>
              <div className="text-sm font-black text-[#111615] mt-1">IndexedDB Sync Enabled</div>
              <div className="text-xs text-[#065F46] font-semibold">Auto-dispatches upon network</div>
            </div>
          </div>

          {/* Live Action Test Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={alertSending}
              onClick={() => handleTriggerTestAlert('SUSTAINED_DECLINE')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B534B] hover:bg-[#08433C] disabled:bg-[#0B534B]/40 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>{alertSending ? 'Dispatching...' : 'Test Cognitive Decline Alert'}</span>
            </button>

            <button
              type="button"
              disabled={alertSending}
              onClick={() => handleTriggerTestAlert('MISSED_MEDICINE')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:bg-[#D97706]/40 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Smartphone className="w-4 h-4" />
              <span>{alertSending ? 'Dispatching...' : 'Test Missed Medication Alert'}</span>
            </button>
          </div>

          {/* Real-time Dispatch Receipt */}
          {alertResult && (
            <div className="p-4 bg-[#E6F4F1] rounded-xl border border-[#0B534B]/20 text-xs text-[#0B534B] space-y-2 animate-in fade-in">
              <div className="font-bold text-sm text-[#0B534B] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>{alertResult.message}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                {alertResult.dispatchResults?.map((res: any, idx: number) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-[#0B534B]/15 flex items-center justify-between">
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[#111615]">{res.channel}: </span>
                      <span className="text-[#5A6A66]">{res.message}</span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] font-bold ml-2">
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Healthcare Integration & ABDM / HL7 FHIR Concept Section */}
      <ScrollReveal direction="up" delay={180}>
        <div className="bg-[#F6F8F7] rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#0B534B]" />
              <h3 className="text-base sm:text-lg font-bold text-[#111615]">
                Healthcare Data Interoperability
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 bg-[#E6F4F1] text-[#0B534B] rounded-full border border-[#0B534B]/20 uppercase">
              Planned / Future Integration: ABDM & HL7 FHIR
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#5A6A66] font-medium leading-relaxed">
            The prototype structure models patient records for future Ayushman Bharat Digital Mission (ABDM) and HL7 FHIR clinical exchange. Below is the projected patient export schema:
          </p>

          <div className="bg-[#042420] text-[#10B981] p-4 rounded-xl font-mono text-xs overflow-x-auto space-y-1 shadow-inner border border-[#10B981]/20">
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
}
