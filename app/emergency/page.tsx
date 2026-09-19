"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Phone, 
  HeartHandshake, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  Ambulance, 
  MapPin,
  Clock
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';

export default function EmergencyPage() {
  const [user, setUser] = useState<any>(null);
  const [callInitiated, setCallInitiated] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((e) => console.error(e));
  }, []);

  const emergencyName = user?.emergencyName || 'Rahul (Son / Caregiver)';
  const emergencyPhone = user?.emergencyPhone || '+91 98765 43210';

  const handleCall = (label: string, number: string) => {
    setCallInitiated(`Calling ${label} at ${number}...`);
    // In browser, trigger tel: link
    window.location.href = `tel:${number}`;
    setTimeout(() => setCallInitiated(null), 5000);
  };

  const audioGuidance = "Emergency Help Screen. Tap the large blue button to call your caregiver Rahul, or tap the red button to call emergency ambulance services.";

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <VoiceButton
          textToRead={audioGuidance}
          buttonLabel="Read Instructions"
        />
      </div>

      <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 shadow-lg space-y-5 text-center">
        <div className="w-16 h-16 bg-rose-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-9 h-9 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-rose-950 tracking-tight">
            Emergency Support
          </h1>
          <p className="text-sm sm:text-base text-rose-800 font-bold">
            Who would you like to contact?
          </p>
        </div>

        {callInitiated && (
          <div className="bg-white border-2 border-rose-500 rounded-xl p-3 text-base font-bold text-rose-900 animate-bounce">
            {callInitiated}
          </div>
        )}

        <div className="space-y-3.5 pt-2">
          {/* Button 1: Call Caregiver */}
          <button
            type="button"
            onClick={() => handleCall(emergencyName, emergencyPhone)}
            className="w-full p-4 sm:p-5 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-extrabold text-lg sm:text-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3.5 border-2 border-blue-900"
          >
            <Phone className="w-6 h-6 flex-shrink-0" />
            <div className="text-left">
              <span className="block text-xs font-semibold uppercase tracking-wider text-blue-200">
                Primary Contact
              </span>
              <span>Call Caregiver</span>
              <span className="block text-xs sm:text-sm font-normal text-blue-100">
                {emergencyName} ({emergencyPhone})
              </span>
            </div>
          </button>

          {/* Button 2: Call Emergency Services */}
          <button
            type="button"
            onClick={() => handleCall('Emergency Services', '112')}
            className="w-full p-4 sm:p-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-extrabold text-lg sm:text-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3.5 border-2 border-rose-800"
          >
            <Ambulance className="w-6 h-6 flex-shrink-0" />
            <div className="text-left">
              <span className="block text-xs font-semibold uppercase tracking-wider text-rose-200">
                Immediate Assistance
              </span>
              <span>Call Emergency Service (112)</span>
              <span className="block text-xs sm:text-sm font-normal text-rose-100">
                National Emergency Help Line
              </span>
            </div>
          </button>
        </div>

        <div className="border-t border-rose-200 pt-4 text-xs sm:text-sm text-slate-700 font-medium space-y-0.5">
          <p>📍 Location sharing: Available with caregiver alert</p>
          <p className="text-xs text-slate-500">Note: This web prototype launches your device's native dialer.</p>
        </div>
      </div>
    </div>
  );
}
