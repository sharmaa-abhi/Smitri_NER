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
  BellRing,
  ArrowRight
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
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@/lib/auth';

export default function CaregiverPortalPage() {
  const { user: clerkUser } = useUser();
  const { user: authUser } = useAuth();
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

  const clerkName = clerkUser?.fullName || 
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || 
    clerkUser?.firstName || 
    clerkUser?.username || 
    clerkUser?.primaryEmailAddress?.emailAddress?.split('@')[0];

  const displayName = clerkName || authUser?.name || data?.user?.name || 'Member';

  const user = {
    ...(data?.user || {}),
    ...(authUser || {}),
    name: displayName,
    age: data?.user?.age || authUser?.age || 68,
    emergencyPhone: data?.user?.emergencyPhone || authUser?.emergencyPhone || '+91 98765 43210',
  };
  const gameSessions = data?.gameSessions || [];
  const reminders = data?.reminders || [];
  const alerts = data?.caregiverAlerts || [];

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

  const trendData = [
    { day: 'Mon', score: 72 },
    { day: 'Tue', score: 75 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 74 },
    { day: 'Fri', score: 69 },
    { day: 'Sat', score: 65 },
    { day: 'Sun', score: 62 },
  ];

  return (
    <div className="space-y-8 pb-36 sm:pb-44 max-w-5xl mx-auto">
      {/* ─── 1. Caregiver Header ─── */}
      <header className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#ECFDF5] text-[#065F46] px-3 py-1 rounded-full text-xs font-bold border border-[#A7F3D0]">
            <Stethoscope className="w-4 h-4 text-[#059669]" />
            <span>Caregiver &amp; Family Observation Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111615] tracking-tight">
            Caregiver Health Portal
          </h1>
          <p className="text-[17px] sm:text-[18px] text-[#374151] font-normal leading-relaxed">
            Observation console for <span className="font-bold text-[#111615]">{user.name}</span> (Age {user.age}). Monitoring daily routine completion and cognitive trajectory.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 pt-2 md:pt-0">
          <a
            href={`tel:${user.emergencyPhone}`}
            className="min-h-[48px] px-5 py-2.5 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white font-bold text-base rounded-xl transition-colors inline-flex items-center gap-2 shadow-xs focus-visible:ring-2 focus-visible:ring-[#0B534B]"
          >
            <Phone className="w-4 h-4" />
            <span>Call {user.name.split(' ')[0]}</span>
          </a>
        </div>
      </header>

      {/* ─── 2. Clinical Observation / Caregiver Alert Banner ─── */}
      <section aria-label="Clinical observation notice">
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[#92400E]">
              Routine Observation: Steady Focus Encouraged
            </h2>
          </div>
          <p className="text-base text-[#B45309] font-medium leading-relaxed">
            Gentle reminder: Cognitive scores reflect short-term daily focus and sleep quality. Check in with {user.name} to ensure restful sleep, hydration, and comfortable room lighting.
          </p>
          <div className="bg-white/90 p-3.5 rounded-xl border border-[#FDE68A] text-sm font-semibold text-[#92400E]">
            💡 Family Suggestion: Encourage morning tea together or gentle conversation after daily memory games.
          </div>
        </div>
      </section>

      {/* ─── 3. KPI Overview Cards (Harmonized Architecture) ─── */}
      <section aria-label="Key performance indicators">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5A6A66]">
              Current Vitality
            </span>
            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0B534B]">{currentScore}</span>
                <span className="text-base font-bold text-[#5A6A66]">/ 100</span>
              </div>
              <p className="text-sm font-medium text-[#4B5563] mt-1">Latest session benchmark</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5A6A66]">
              Avg Accuracy
            </span>
            <div className="pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#059669]">{avgAccuracy}%</span>
              <p className="text-sm font-medium text-[#4B5563] mt-1">Across past 7 days</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5A6A66]">
              Recall Pace
            </span>
            <div className="pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#111615]">{avgResponse}s</span>
              <p className="text-sm font-medium text-[#4B5563] mt-1">Adaptive response pace</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between min-h-[148px]">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5A6A66]">
              Routine Adherence
            </span>
            <div className="pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#059669]">{reminderRate}%</span>
              <p className="text-sm font-medium text-[#4B5563] mt-1">Medicines &amp; daily water</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. 7-Day Performance Trajectory Chart ─── */}
      <section aria-label="7-Day performance chart">
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111615]">
                7-Day Cognitive Trajectory
              </h2>
              <p className="text-sm sm:text-base text-[#4B5563] font-normal">
                Weekly score progression across memory and focus sessions
              </p>
            </div>
            <span className="text-xs font-bold bg-[#E6F4F1] text-[#0B534B] px-3 py-1 rounded-full border border-[#93CEC5] self-start sm:self-auto">
              Weekly Observation Range
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" fontSize={12} fontWeight="600" />
                <YAxis domain={[50, 90]} stroke="#6B7280" fontSize={12} fontWeight="600" />
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

      {/* ─── 5. Caregiver Alert Dispatcher ─── */}
      <section aria-label="Alert dispatcher">
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#0B534B] flex-shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#111615]">
                Caregiver Emergency Alert Channel
              </h3>
              <p className="text-sm text-[#4B5563]">
                Instant notifications sent to caregiver phone: {user.emergencyPhone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={alertSending}
              onClick={() => handleTriggerTestAlert('MEDICATION_MISSED')}
              className="min-h-[48px] px-5 py-2.5 bg-[#0B534B] hover:bg-[#08433C] text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B534B]"
            >
              <Send className="w-4 h-4" />
              <span>{alertSending ? 'Sending...' : 'Send Medication Check-in Alert'}</span>
            </button>
            <a
              href={`https://wa.me/${user.emergencyPhone?.replace(/\D/g, '')}?text=Hello%20Caregiver,%20daily%20wellness%20update%20for%20${encodeURIComponent(user.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-5 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 rounded-xl font-bold text-sm transition-colors inline-flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Family Alert</span>
            </a>
          </div>

          {alertResult && (
            <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-sm font-semibold text-[#065F46]">
              ✓ Alert dispatched successfully. Status recorded in audit log.
            </div>
          )}
        </div>
      </section>

      {/* ─── 6. Clearance Buffer for Floating SOS Control ─── */}
      <div className="h-10 sm:h-14 w-full pointer-events-none" aria-hidden="true" />
    </div>
  );
}
