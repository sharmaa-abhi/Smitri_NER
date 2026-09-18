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
    <div className="max-w-2xl mx-auto space-y-8 py-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 text-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>

        <VoiceButton
          textToRead={audioGuidance}
          buttonLabel="Read Instructions"
        />
      </div>

      <div className="bg-rose-50 border-4 border-rose-300 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 text-center">
        <div className="w-20 h-20 bg-rose-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg">
          <ShieldAlert className="w-12 h-12 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-rose-950">
            Emergency Support
          </h1>
          <p className="text-xl sm:text-2xl text-rose-800 font-bold">
            Who would you like to contact?
          </p>
        </div>

        {callInitiated && (
          <div className="bg-white border-2 border-rose-500 rounded-2xl p-4 text-xl font-black text-rose-900 animate-bounce">
            {callInitiated}
          </div>
        )}

        <div className="space-y-4 pt-4">
          {/* Button 1: Call Caregiver */}
          <button
            type="button"
            onClick={() => handleCall(emergencyName, emergencyPhone)}
            className="w-full p-6 bg-blue-700 hover:bg-blue-800 text-white rounded-3xl font-black text-2xl sm:text-3xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 border-4 border-blue-900"
          >
            <Phone className="w-8 h-8" />
            <div className="text-left">
              <span className="block text-sm font-semibold uppercase tracking-wider text-blue-200">
                Primary Contact
              </span>
              <span>Call Caregiver</span>
              <span className="block text-base font-normal text-blue-100">
                {emergencyName} ({emergencyPhone})
              </span>
            </div>
          </button>

          {/* Button 2: Call Emergency Services */}
          <button
            type="button"
            onClick={() => handleCall('Emergency Services', '112')}
            className="w-full p-6 bg-rose-600 hover:bg-rose-700 text-white rounded-3xl font-black text-2xl sm:text-3xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 border-4 border-rose-800"
          >
            <Ambulance className="w-8 h-8" />
            <div className="text-left">
              <span className="block text-sm font-semibold uppercase tracking-wider text-rose-200">
                Immediate Assistance
              </span>
              <span>Call Emergency Service (112)</span>
              <span className="block text-base font-normal text-rose-100">
                National Emergency Help Line
              </span>
            </div>
          </button>
        </div>

        <div className="border-t-2 border-rose-200 pt-6 text-base text-slate-700 font-semibold space-y-1">
          <p>📍 Location sharing: Available with caregiver alert</p>
          <p>Note: This web prototype launches your device's native dialer.</p>
        </div>
      </div>
    </div>
  );
}
