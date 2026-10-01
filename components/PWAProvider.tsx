"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { WifiOff, Zap, Download, X } from "lucide-react";
import { syncOfflineDataWithServer } from "@/lib/offlineStorage";

interface PWAContextType {
  isOnline: boolean;
  isInstallable: boolean;
  installApp: () => void;
  syncNow: () => Promise<void>;
  isSyncing: boolean;
}

const PWAContext = createContext<PWAContextType>({
  isOnline: true,
  isInstallable: false,
  installApp: () => {},
  syncNow: async () => {},
  isSyncing: false,
});

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    // Register Service Worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("Service Worker registered with scope:", reg.scope))
          .catch((err) => console.warn("Service Worker registration failed:", err));
      });
    }

    const handleOnline = async () => {
      setIsOnline(true);
      setIsSyncing(true);
      try {
        const { syncedCount } = await syncOfflineDataWithServer();
        if (syncedCount > 0) {
          setShowSyncSuccess(true);
          setTimeout(() => setShowSyncSuccess(false), 4000);
        }
      } catch (err) {
        console.warn("Auto sync failed:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Install prompt handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const syncNow = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    try {
      const { syncedCount } = await syncOfflineDataWithServer();
      if (syncedCount > 0) {
        setShowSyncSuccess(true);
        setTimeout(() => setShowSyncSuccess(false), 3000);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <PWAContext.Provider value={{ isOnline, isInstallable, installApp, syncNow, isSyncing }}>
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm sticky top-0 z-[60]">
          <WifiOff className="w-4 h-4 animate-bounce flex-shrink-0" />
          <span>
            Offline Mode Active — You can continue playing games! Scores and reminders will automatically save on this device.
          </span>
        </div>
      )}

      {/* Online Syncing Toast */}
      {showSyncSuccess && (
        <div className="fixed bottom-6 right-6 z-[70] bg-teal-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-up border border-teal-600">
          <Zap className="w-5 h-5 text-teal-300" />
          <div className="text-sm">
            <div className="font-bold">Back Online & Synced!</div>
            <div className="text-xs text-teal-200">Your offline scores have been safely uploaded to your profile.</div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowSyncSuccess(false)}
            className="text-teal-300 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Install Prompt for Android/Mobile Seniors */}
      {isInstallable && (
        <div className="fixed bottom-4 left-4 z-[70] bg-white border-2 border-teal-600 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 flex-shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-xs sm:text-sm font-bold text-slate-900">Install Smitri_NER App</div>
            <div className="text-[11px] text-slate-500">Quick 1-tap access on your home screen</div>
          </div>
          <button
            type="button"
            onClick={installApp}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm"
          >
            Install
          </button>
          <button
            type="button"
            onClick={() => setIsInstallable(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  return useContext(PWAContext);
}
