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
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border-2 border-teal-100 text-center">
        {/* Offline Icon Badge */}
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-200">
          <WifiOff className="w-10 h-10 text-amber-600 animate-pulse" />
        </div>

        {/* Heading & Subtitle */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100/70 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
          Offline Mode Active / ऑफलाइन मोड चालू है
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
          No Internet Connection
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
          Don&apos;t worry! <strong className="text-teal-700">Smitri_NER</strong> is designed to work offline. 
          Your game scores and reminders are safely stored on this device.
        </p>

        {/* Action Buttons for Seniors */}
        <div className="space-y-3.5 mb-8">
          <Link
            href="/games"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Gamepad2 className="w-6 h-6" />
            <span>Play Memory Games (Offline)</span>
          </Link>

          <Link
            href="/reminders"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Bell className="w-6 h-6" />
            <span>Check Saved Reminders</span>
          </Link>

          <button
            type="button"
            onClick={handleReload}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-base transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Check Internet Connection Again</span>
          </button>
        </div>

        {/* Comfort reassurance note */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 pt-4 border-t border-slate-100">
          <HeartHandshake className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>Everything will automatically sync with your caregiver when internet returns.</span>
        </div>
      </div>
    </div>
  );
}
