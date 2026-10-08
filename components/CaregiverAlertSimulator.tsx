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
import { useLanguage } from "@/lib/i18n";

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
    color: "text-[#059669]",
    borderColor: "border-[#A7F3D0]",
    bgLight: "bg-[#ECFDF5]",
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
    color: "text-[#92400E]",
    borderColor: "border-[#FDE68A]",
    bgLight: "bg-[#FFFBEB]",
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
    color: "text-red-700",
    borderColor: "border-red-300",
    bgLight: "bg-red-50",
    patientStatus: "Kamla Devi (Age 68) • 3-Day Trajectory Shift: Recall speed slowed by 35%",
    time: "Yesterday, 6:00 PM",
    messagePreview: "⚠️ Cognitive Trend: Smitri detected a 14-point decline in Sequence Recall over the last 3 days. A weekly summary is available for her doctor.",
    actionText: "View Clinical Trends",
    urgencyLevel: "MEDIUM",
  },
];

export default function CaregiverAlertSimulator() {
  const { t } = useLanguage();
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>("MISSED_MEDICINE");

  const current = SCENARIOS.find((s) => s.id === selectedScenario) || SCENARIOS[0];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D5DFDC] shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F4F1] text-[#0B534B] text-xs font-bold border border-[#93CEC5] shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>{t("Caregiver Peace of Mind Simulator") || "Caregiver Peace of Mind Simulator"}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111615] tracking-tight">
          {t("feature_caregiver_title") || "Real-Time Family Protection"}
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6A66] font-medium leading-relaxed">
          {t("feature_caregiver_desc") || "See how Smitri_NER tracks daily rhythms and automatically dispatches SMS, WhatsApp, and Telegram alerts to family members when help is needed."}
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
                  ? "bg-[#0B534B] text-white border-[#0B534B] shadow-sm scale-102"
                  : "bg-[#F6F8F7] hover:bg-[#EBF0EE] text-[#5A6A66] border-[#D5DFDC]"
              }`}
            >
              {scenario.id === "NORMAL" && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
              {scenario.id === "MISSED_MEDICINE" && <AlertTriangle className="w-4 h-4 text-[#D97706]" />}
              {scenario.id === "COGNITIVE_DECLINE" && <Activity className="w-4 h-4 text-red-500" />}
              <span>{t(scenario.tabLabel)}</span>
            </button>
          );
        })}
      </div>

      {/* Simulator Two-Column Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
        {/* Left Side: Scenario Explanation */}
        <div className="lg:col-span-6 space-y-4 text-left">
          <div className="space-y-1">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${current.bgLight} ${current.color} border ${current.borderColor} inline-flex items-center`}>
              {current.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#111615] pt-1">
              {current.id === "NORMAL" && "Healthy Day at Home"}
              {current.id === "MISSED_MEDICINE" && "Automated Missed Medicine Detection"}
              {current.id === "COGNITIVE_DECLINE" && "Sustained Cognitive Shift Analysis"}
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F6F8F7] border border-[#D5DFDC] space-y-1 text-xs">
            <div className="font-bold text-[#5A6A66] uppercase tracking-wider">Patient Status</div>
            <div className="font-semibold text-[#111615]">{current.patientStatus}</div>
          </div>

          <p className="text-xs sm:text-sm text-[#5A6A66] leading-relaxed font-medium">
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
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B534B] hover:text-[#08433C]"
            >
              <span>Explore Live Caregiver Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Side: Sleek Phone Simulation Mockup */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[320px] bg-[#042420] rounded-[38px] p-3 shadow-2xl border-4 border-[#08433C]">
            {/* Screen Inner */}
            <div className="bg-[#F2F8F6] rounded-[28px] overflow-hidden flex flex-col h-[400px] border border-[#08433C]/40">
              {/* Phone Status Bar */}
              <div className="bg-[#0B534B] text-white px-4 py-2 flex items-center justify-between text-[11px] font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span>Smitri Safety Dispatch</span>
                </div>
                <span>9:41 AM</span>
              </div>

              {/* Chat Header */}
              <div className="bg-[#127267] text-white px-3 py-2 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Smitri Elder Watch</div>
                    <div className="text-xs text-[#A7F3D0]">Caregiver: Rahul (Son)</div>
                  </div>
                </div>
                <Phone className="w-4 h-4 text-white" />
              </div>

              {/* Chat Message Bubble */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                <div className="text-center">
                  <span className="text-xs font-bold bg-white/80 text-[#5A6A66] px-2.5 py-0.5 rounded-full shadow-2xs">
                    Today
                  </span>
                </div>

                {/* Animated Simulated Alert Bubble */}
                <div className={`p-3 rounded-2xl rounded-tl-xs shadow-md border animate-in slide-in-from-bottom-3 duration-300 ${
                  current.id === "NORMAL" 
                    ? "bg-white border-[#A7F3D0]" 
                    : current.id === "MISSED_MEDICINE"
                    ? "bg-[#FFFBEB] border-[#FDE68A]"
                    : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex items-center justify-between pb-1 border-b border-black/5 text-xs font-semibold text-[#5A6A66]">
                    <span>Automated Dispatch</span>
                    <span>{current.time}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#111615] pt-1.5 leading-snug">
                    {current.messagePreview}
                  </p>
                  <div className="pt-2 text-xs text-[#5A6A66] flex items-center justify-between font-medium">
                    <span>Delivered via WhatsApp / SMS</span>
                    <span className="text-[#0B534B] font-bold">✓✓ Read</span>
                  </div>
                </div>

                {/* Simulated Quick Action button on phone */}
                {current.id !== "NORMAL" && (
                  <div className="pt-1">
                    <button
                      type="button"
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 ${
                        current.id === "MISSED_MEDICINE" ? "bg-[#D97706] hover:bg-[#B45309]" : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{current.actionText}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Phone Bar */}
              <div className="bg-white/90 p-2 text-center text-[10px] font-semibold text-[#7A8D88] border-t border-[#D5DFDC]">
                Encrypted Senior-Caregiver Channel
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
