"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Smartphone, 
  Phone, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  BellRing
} from "lucide-react";

type ScenarioType = "NORMAL" | "MISSED_MEDICINE" | "COGNITIVE_DECLINE";

interface ScenarioConfig {
  id: ScenarioType;
  tabLabel: string;
  badge: string;
  color: string;
  borderColor: string;
  bgLight: string;
  patientStatus: string;
  time: string;
  messagePreview: string;
  actionText: string;
  urgencyLevel: "ROUTINE" | "MEDIUM" | "HIGH";
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: "NORMAL",
    tabLabel: "1. Healthy Routine",
    badge: "All Normal",
    color: "text-emerald-700",
    borderColor: "border-emerald-300",
    bgLight: "bg-emerald-50",
    patientStatus: "Kamla Devi (Age 68) • 8:15 AM Medication Taken • Memory Score: 86/100",
    time: "8:16 AM",
    messagePreview: "✅ Smitri Care: Kamla Devi just completed her morning routine. Memory score: 86/100 (Strong). Everything looks great today!",
    actionText: "No Action Needed",
    urgencyLevel: "ROUTINE",
  },
  {
    id: "MISSED_MEDICINE",
    tabLabel: "2. Missed Medication",
    badge: "Urgent Attention",
    color: "text-amber-800",
    borderColor: "border-amber-400",
    bgLight: "bg-amber-50",
    patientStatus: "Kamla Devi (Age 68) • 9:30 AM Blood Pressure Medicine Unconfirmed (+90 min)",
    time: "9:30 AM",
    messagePreview: "🚨 Smitri Alert: Kamla Devi has not confirmed her 8:00 AM Blood Pressure tablet. 2 reminders have passed. Please check in or call her.",
    actionText: "1-Tap Call Patient",
    urgencyLevel: "HIGH",
  },
  {
    id: "COGNITIVE_DECLINE",
    tabLabel: "3. 3-Day Shift Detected",
    badge: "Clinical Trend",
    color: "text-rose-800",
    borderColor: "border-rose-400",
    bgLight: "bg-rose-50",
    patientStatus: "Kamla Devi (Age 68) • 3-Day Trajectory Shift: Recall speed slowed by 35%",
    time: "Yesterday, 6:00 PM",
    messagePreview: "⚠️ Cognitive Trend: Smitri detected a 14-point decline in Sequence Recall over the last 3 days. A weekly summary is available for her doctor.",
    actionText: "View Clinical Trends",
    urgencyLevel: "MEDIUM",
  },
];

export default function CaregiverAlertSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>("MISSED_MEDICINE");

  const current = SCENARIOS.find((s) => s.id === selectedScenario) || SCENARIOS[0];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
          <span>Caregiver Peace of Mind Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Real-Time Family Protection
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          See how Smitri_NER tracks daily rhythms and automatically dispatches SMS, WhatsApp, and Telegram alerts to family members when help is needed.
        </p>
      </div>

      {/* Interactive Scenario Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
        {SCENARIOS.map((scenario) => {
          const isActive = scenario.id === selectedScenario;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setSelectedScenario(scenario.id)}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border-2 flex items-center gap-2 ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-102"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {scenario.id === "NORMAL" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {scenario.id === "MISSED_MEDICINE" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {scenario.id === "COGNITIVE_DECLINE" && <Activity className="w-4 h-4 text-rose-400" />}
              <span>{scenario.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Simulator Two-Column Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
        {/* Left Side: Scenario Explanation */}
        <div className="lg:col-span-6 space-y-4 text-left">
          <div className="space-y-1">
            <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${current.bgLight} ${current.color} border ${current.borderColor}`}>
              {current.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 pt-1">
              {current.id === "NORMAL" && "Healthy Day at Home"}
              {current.id === "MISSED_MEDICINE" && "Automated Missed Medicine Detection"}
              {current.id === "COGNITIVE_DECLINE" && "Sustained Cognitive Shift Analysis"}
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="font-bold text-slate-500 uppercase tracking-wider">Patient Status</div>
            <div className="font-semibold text-slate-800">{current.patientStatus}</div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {current.id === "NORMAL" &&
              "Smitri confirms routines in the background. Family members receive positive reassurance without needing to constantly phone or interrupt their elder."}
            {current.id === "MISSED_MEDICINE" &&
              "If high-priority heart or diabetes medicine isn't checked off within 90 minutes, an emergency SMS/WhatsApp dispatch triggers to the son or daughter with 1-click dial."}
            {current.id === "COGNITIVE_DECLINE" &&
              "Unlike simple games, our engine checks 7-day trajectories. Micro-hesitation and accuracy changes alert caregivers weeks before traditional checkups."}
          </p>

          <div className="pt-2">
            <Link
              href="/caregiver"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800"
            >
              <span>Explore Live Caregiver Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Side: Sleek Phone Simulation Mockup */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[320px] bg-slate-950 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800">
            {/* Screen Inner */}
            <div className="bg-[#ECE5DD] rounded-[28px] overflow-hidden flex flex-col h-[400px] border border-slate-700/40">
              {/* Phone Status Bar */}
              <div className="bg-[#075E54] text-white px-4 py-2 flex items-center justify-between text-[11px] font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Smitri Safety Dispatch</span>
                </div>
                <span>9:41 AM</span>
              </div>

              {/* Chat Header */}
              <div className="bg-[#128C7E] text-white px-3 py-2 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Smitri Elder Watch</div>
                    <div className="text-[10px] text-teal-100">Caregiver: Rahul (Son)</div>
                  </div>
                </div>
                <Phone className="w-4 h-4 text-white" />
              </div>

              {/* Chat Message Bubble */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                <div className="text-center">
                  <span className="text-[10px] font-bold bg-white/80 text-slate-500 px-2 py-0.5 rounded-full shadow-2xs">
                    Today
                  </span>
                </div>

                {/* Animated Simulated Alert Bubble */}
                <div className={`p-3 rounded-2xl rounded-tl-xs shadow-md border animate-in slide-in-from-bottom-3 duration-300 ${
                  current.id === "NORMAL" 
                    ? "bg-white border-emerald-200" 
                    : current.id === "MISSED_MEDICINE"
                    ? "bg-amber-50 border-amber-300"
                    : "bg-rose-50 border-rose-300"
                }`}>
                  <div className="flex items-center justify-between pb-1 border-b border-black/5 text-[10px] font-bold text-slate-500">
                    <span>Automated Dispatch</span>
                    <span>{current.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 pt-1.5 leading-snug">
                    {current.messagePreview}
                  </p>
                  <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Delivered via WhatsApp / SMS</span>
                    <span className="text-sky-600 font-bold">✓✓ Read</span>
                  </div>
                </div>

                {/* Simulated Quick Action button on phone */}
                {current.id !== "NORMAL" && (
                  <div className="pt-1">
                    <button
                      type="button"
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 ${
                        current.id === "MISSED_MEDICINE" ? "bg-amber-600 hover:bg-amber-700" : "bg-rose-600 hover:bg-rose-700"
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{current.actionText}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Phone Bar */}
              <div className="bg-white/90 p-2 text-center text-[10px] font-semibold text-slate-400 border-t border-slate-200">
                Encrypted Senior-Caregiver Channel
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
