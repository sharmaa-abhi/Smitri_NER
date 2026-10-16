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
import ScrollReveal from '@/components/ScrollReveal';
import { useLanguage } from '@/lib/i18n';

export default function EmergencyPage() {
  const { t } = useLanguage();
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
    window.location.href = `tel:${number}`;
    setTimeout(() => setCallInitiated(null), 5000);
  };

  const audioGuidance = t("emergency_reassurance") || "Emergency Help Screen. Tap the large teal button to call your caregiver Rahul, or tap the red button to call emergency ambulance services.";

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6 pb-36 sm:pb-44 px-3 sm:px-4">
      {/* Header */}
      <ScrollReveal direction="down">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 min-h-[48px] px-4 py-2.5 rounded-2xl bg-white hover:bg-[#E6F4F1] font-bold text-[#0B534B] text-sm sm:text-base transition-colors border border-[#D5DFDC] shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B534B]"
          >
            <ArrowLeft className="w-4 h-4 text-[#0B534B]" />
            <span>{t("Back to Dashboard") || "Back to Dashboard"}</span>
          </Link>

          <VoiceButton
            textToRead={audioGuidance}
            buttonLabel={t("Read Instructions") || "Listen"}
          />
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={80}>
        <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 bg-rose-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
              Immediate Assistance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111615] tracking-tight">
              {t("emergency_title") || "Emergency Support"}
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] font-medium max-w-md mx-auto">
              {t("Who would you like to contact?") || "Tap once below to call your primary family caregiver or emergency services."}
            </p>
          </div>

          {callInitiated && (
            <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 text-base font-bold text-rose-900 animate-pulse">
              {callInitiated}
            </div>
          )}

          <div className="space-y-4 pt-1">
            {/* Button 1: Call Caregiver */}
            <a
              href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
              role="button"
              onClick={() => handleCall(emergencyName, emergencyPhone)}
              aria-label={`${t("emergency_call_caregiver") || "Call Caregiver"} ${emergencyName} at ${emergencyPhone}`}
              className="w-full min-h-[76px] p-4 sm:p-5 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-2xl font-extrabold text-lg sm:text-xl shadow-sm hover:shadow-md transition-all flex items-center justify-start gap-4 border border-[#06342E] cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#10B981]"
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#A7F3D0]">
                  {t("Primary Contact") || "Family Caregiver"}
                </span>
                <span className="block text-lg sm:text-xl font-bold truncate">
                  {t("emergency_call_caregiver") || "Call Caregiver"}
                </span>
                <span className="block text-sm font-medium text-[#E6F4F1] truncate">
                  {emergencyName} • {emergencyPhone}
                </span>
              </div>
            </a>

            {/* Button 2: Call Emergency Services */}
            <a
              href="tel:112"
              role="button"
              onClick={() => handleCall("Emergency Services", "112")}
              aria-label={`${t("emergency_call_helpline") || "Call National Emergency Service (112)"}`}
              className="w-full min-h-[76px] p-4 sm:p-5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-2xl font-extrabold text-lg sm:text-xl shadow-sm hover:shadow-md transition-all flex items-center justify-start gap-4 border border-rose-800 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-rose-400"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Ambulance className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider text-rose-100">
                  {t("Immediate Assistance") || "Medical & Police Helpline"}
                </span>
                <span className="block text-lg sm:text-xl font-bold truncate">
                  {t("emergency_call_helpline") || "Call Emergency (112)"}
                </span>
                <span className="block text-sm font-medium text-rose-100 truncate">
                  {t("National Emergency Help Line") || "National 24/7 Helpline"}
                </span>
              </div>
            </a>
          </div>

          <div className="border-t border-[#D5DFDC] pt-5 text-sm text-[#4B5563] font-medium space-y-1">
            <p className="flex items-center justify-center gap-1.5 font-semibold text-[#0B534B]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>{t("emergency_reassurance") || "Tap once to call. You are safe and supported."}</span>
            </p>
            <p className="text-xs text-[#6B7280]">
              Tapping opens your device dialer. For immediate life-threatening events, dial 112 directly.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Trailing clearance spacer so floating SOS dock never covers content */}
      <div className="h-10 sm:h-14 w-full pointer-events-none" />
    </div>
  );
}
