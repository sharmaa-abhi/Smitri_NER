"use client";

import Link from "next/link";
import { WifiOff, Gamepad2, Bell, RefreshCw, HeartHandshake } from "lucide-react";

export default function OfflineFallbackPage() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border-2 border-[#D5DFDC] text-center">
        {/* Offline Icon Badge */}
        <div className="w-20 h-20 bg-[#FFFBEB] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#D97706]/30">
          <WifiOff className="w-10 h-10 text-[#D97706] animate-pulse" />
        </div>

        {/* Heading & Subtitle */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#D97706]/20 text-xs font-bold uppercase tracking-wider mb-3">
          Offline Mode Active / ऑफलाइन मोड चालू है
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111615] mb-3 tracking-tight">
          No Internet Connection
        </h1>
        <p className="text-base sm:text-lg text-[#5A6A66] mb-6 leading-relaxed">
          Don&apos;t worry! <strong className="text-[#0B534B]">Smitri_NER</strong> is designed to work offline. 
          Your game scores and reminders are safely stored on this device.
        </p>

        {/* Action Buttons for Seniors */}
        <div className="space-y-3.5 mb-8">
          <Link
            href="/games"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white font-bold text-lg shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Gamepad2 className="w-6 h-6" />
            <span>Play Memory Games (Offline)</span>
          </Link>

          <Link
            href="/reminders"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white font-bold text-lg shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Bell className="w-6 h-6" />
            <span>Check Saved Reminders</span>
          </Link>

          <button
            type="button"
            onClick={handleReload}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-2xl bg-[#F6F8F7] hover:bg-[#E6F4F1] text-[#5A6A66] font-semibold text-base border border-[#D5DFDC] transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Check Internet Connection Again</span>
          </button>
        </div>

        {/* Comfort reassurance note */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#5A6A66] pt-4 border-t border-[#D5DFDC]/60">
          <HeartHandshake className="w-4 h-4 text-[#0B534B] flex-shrink-0" />
          <span>Everything will automatically sync with your caregiver when internet returns.</span>
        </div>
      </div>
    </div>
  );
}
