"use client";

import React, { useState } from "react";
import { MapPin, Volume2, Users, Wifi, Radio, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { playChime, playWebSpeechDialect } from "@/lib/audioPrompts";

interface CareHub {
  id: string;
  name: string;
  state: string;
  x: number; // percentage in SVG coordinate space
  y: number;
  greetingNative: string;
  greetingEnglish: string;
  dialectName: string;
  langCode: string;
  activeElders: number;
  syncRate: string;
  highlightColor: string;
}

const CARE_HUBS: CareHub[] = [
  {
    id: "guwahati",
    name: "Guwahati Hub",
    state: "Assam",
    x: 42,
    y: 54,
    greetingNative: "নমস্কাৰ",
    greetingEnglish: "Nomoskar (Hello & Respect)",
    dialectName: "Assamese (অসমীয়া)",
    langCode: "as-IN",
    activeElders: 540,
    syncRate: "99.8%",
    highlightColor: "#0D9488", // Teal
  },
  {
    id: "shillong",
    name: "Shillong Care Unit",
    state: "Meghalaya",
    x: 38,
    y: 68,
    greetingNative: "Khublei",
    greetingEnglish: "Khublei Shibun (Warm Blessings)",
    dialectName: "Khasi & Garo",
    langCode: "en-IN",
    activeElders: 285,
    syncRate: "99.4%",
    highlightColor: "#0284C7", // Sky
  },
  {
    id: "imphal",
    name: "Imphal Valley Node",
    state: "Manipur",
    x: 74,
    y: 72,
    greetingNative: "খুরুমজরি",
    greetingEnglish: "Khurumjari (Honorable Greetings)",
    dialectName: "Manipuri / Meitei",
    langCode: "bn-IN",
    activeElders: 215,
    syncRate: "99.2%",
    highlightColor: "#7C3AED", // Violet
  },
  {
    id: "kohima",
    name: "Kohima Hills Station",
    state: "Nagaland",
    x: 76,
    y: 56,
    greetingNative: "Ayo / Greetings",
    greetingEnglish: "Warmest Hill Greetings",
    dialectName: "Angami & Nagamese",
    langCode: "en-IN",
    activeElders: 165,
    syncRate: "99.1%",
    highlightColor: "#D97706", // Amber
  },
  {
    id: "agartala",
    name: "Agartala Health Link",
    state: "Tripura",
    x: 33,
    y: 84,
    greetingNative: "নমস্কার",
    greetingEnglish: "Nomoshkar (Cordial Well-wishes)",
    dialectName: "Bengali & Kokborok",
    langCode: "bn-IN",
    activeElders: 195,
    syncRate: "99.5%",
    highlightColor: "#E11D48", // Rose
  },
  {
    id: "aizawl",
    name: "Aizawl Ridge Hub",
    state: "Mizoram",
    x: 58,
    y: 88,
    greetingNative: "Chibai",
    greetingEnglish: "Chibai (Peaceful Greetings)",
    dialectName: "Mizo",
    langCode: "en-IN",
    activeElders: 145,
    syncRate: "99.0%",
    highlightColor: "#059669", // Emerald
  },
  {
    id: "itanagar",
    name: "Itanagar Foothills",
    state: "Arunachal Pradesh",
    x: 62,
    y: 28,
    greetingNative: "Tashi Delek / Namaste",
    greetingEnglish: "Peaceful Radiance & Health",
    dialectName: "Nyishi, Adi & Monpa",
    langCode: "hi-IN",
    activeElders: 120,
    syncRate: "98.9%",
    highlightColor: "#0EA5E9", // Light blue
  },
  {
    id: "gangtok",
    name: "Gangtok Alpine Post",
    state: "Sikkim",
    x: 10,
    y: 38,
    greetingNative: "कुजुजाङ्पो / Namaste",
    greetingEnglish: "Kuzuzangpo (Auspicious Life)",
    dialectName: "Nepali & Bhutia",
    langCode: "hi-IN",
    activeElders: 98,
    syncRate: "99.7%",
    highlightColor: "#10B981", // Mint
  },
];

export default function RegionalCareMap() {
  const [activeHub, setActiveHub] = useState<CareHub>(CARE_HUBS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSelectHub = (hub: CareHub) => {
    setActiveHub(hub);
    playChime("start");
  };

  const handlePlayGreeting = () => {
    setIsPlayingAudio(true);
    playChime("success");
    playWebSpeechDialect(activeHub.greetingNative + ". " + activeHub.greetingEnglish, activeHub.langCode);
    setTimeout(() => setIsPlayingAudio(false), 2000);
  };

  const totalActive = CARE_HUBS.reduce((acc, h) => acc + h.activeElders, 0);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-teal-300" />
            <span>NER Care Map • 8 Sister States Live Telemetry</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pulsing Community Care Hubs
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Hover or tap any regional hub to hear localized audio greetings and inspect real-time offline cognitive session health.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
          <div>
            <div className="text-xl sm:text-2xl font-black text-teal-300 font-mono">
              {totalActive.toLocaleString()}+
            </div>
            <div className="text-[11px] font-semibold text-slate-400">Total Active Elders</div>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div>
            <div className="text-xl sm:text-2xl font-black text-sky-300 font-mono">99.4%</div>
            <div className="text-[11px] font-semibold text-slate-400">Avg Sync Reliability</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left interactive vector map, Right live telemetrics card */}
      <div className="relative mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT: Topographic SVG Map of Northeast India */}
        <div className="lg:col-span-7 relative bg-slate-900/60 rounded-3xl p-4 sm:p-6 border border-slate-800/80 backdrop-blur-md">
          {/* Subtle Grid overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none rounded-3xl"
            style={{
              backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* SVG Map Container */}
          <div className="relative aspect-[4/3] w-full max-w-lg mx-auto">
            <svg
              viewBox="0 0 500 375"
              className="w-full h-full drop-shadow-lg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stylized Silhouette Geography of NER */}
              <defs>
                <linearGradient id="nerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="50%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Sikkim Area */}
              <path
                d="M 40,110 L 65,115 L 70,160 L 45,155 Z"
                fill="url(#nerGradient)"
                stroke="#334155"
                strokeWidth="1.5"
                className="transition-all hover:stroke-teal-400"
              />

              {/* Main Northeast Region Outline (Arunachal, Assam, Meghalaya, Nagaland, Manipur, Mizoram, Tripura) */}
              <path
                d="M 170,180 
                   L 200,165 
                   L 260,110 
                   L 330,80 
                   L 420,95 
                   L 440,150 
                   L 410,190 
                   L 390,230 
                   L 380,290 
                   L 330,340 
                   L 280,330 
                   L 270,280 
                   L 220,310 
                   L 160,310 
                   L 160,250 
                   L 190,230 
                   L 180,190 Z"
                fill="url(#nerGradient)"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Stylized Brahmaputra River Curve */}
              <path
                d="M 400,135 Q 310,165 240,195 T 160,235"
                stroke="url(#riverGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Connecting Telemetry Network Lines */}
              {CARE_HUBS.map((hub, idx) => {
                const nextHub = CARE_HUBS[(idx + 1) % CARE_HUBS.length];
                const x1 = (hub.x / 100) * 500;
                const y1 = (hub.y / 100) * 375;
                const x2 = (nextHub.x / 100) * 500;
                const y2 = (nextHub.y / 100) * 375;
                return (
                  <line
                    key={`line-${hub.id}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#1E293B"
                    strokeDasharray="3 4"
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* Active Hub Node Indicators */}
              {CARE_HUBS.map((hub) => {
                const cx = (hub.x / 100) * 500;
                const cy = (hub.y / 100) * 375;
                const isSelected = activeHub.id === hub.id;

                return (
                  <g
                    key={hub.id}
                    className="cursor-pointer group"
                    onClick={() => handleSelectHub(hub)}
                  >
                    {/* Pulsing Radar Ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 18 : 10}
                      fill={hub.highlightColor}
                      fillOpacity={isSelected ? 0.35 : 0.18}
                      className="animate-ping"
                      style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: "2.5s" }}
                    />

                    {/* Outer Circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 10 : 6}
                      fill={isSelected ? hub.highlightColor : "#1E293B"}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="transition-all duration-300"
                    />

                    {/* Core Light Center */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 4 : 2.5}
                      fill="#FFFFFF"
                    />

                    {/* Hub Text Label */}
                    <text
                      x={cx + 12}
                      y={cy + 4}
                      fill={isSelected ? "#38BDF8" : "#94A3B8"}
                      fontSize={isSelected ? "11" : "9"}
                      fontWeight={isSelected ? "bold" : "600"}
                      className="select-none pointer-events-none transition-colors"
                    >
                      {hub.state}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Clickable State Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 pt-3 border-t border-slate-800">
            {CARE_HUBS.map((hub) => (
              <button
                key={hub.id}
                type="button"
                onClick={() => handleSelectHub(hub)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  activeHub.id === hub.id
                    ? "bg-teal-500 text-slate-950 shadow-md scale-105"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {hub.state}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Live Telemetry Inspection Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-700/80 shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block"
                style={{ backgroundColor: `${activeHub.highlightColor}25`, color: activeHub.highlightColor }}
              >
                {activeHub.state} Regional Care Network
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white">{activeHub.name}</h4>
              <p className="text-xs text-slate-400 font-medium">Primary Dialect: {activeHub.dialectName}</p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
          </div>

          {/* Greeting showcase banner */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Native Elder Welcome Greeting</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-wide font-sans">
              "{activeHub.greetingNative}"
            </div>
            <div className="text-xs text-slate-300 font-medium">
              Meaning: {activeHub.greetingEnglish}
            </div>

            <button
              type="button"
              onClick={handlePlayGreeting}
              disabled={isPlayingAudio}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce" : ""}`} />
              <span>{isPlayingAudio ? "Playing Pronunciation..." : "Hear Local Voice"}</span>
            </button>
          </div>

          {/* Real-time Health Telemetrics */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>Active Seniors</span>
              </div>
              <div className="text-lg font-black text-white font-mono mt-1">
                {activeHub.activeElders} Elders
              </div>
              <div className="text-[10px] text-teal-400 font-bold mt-0.5">● Live Daily Routine</div>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Wifi className="w-3.5 h-3.5 text-sky-400" />
                <span>Offline Sync Rate</span>
              </div>
              <div className="text-lg font-black text-white font-mono mt-1">
                {activeHub.syncRate}
              </div>
              <div className="text-[10px] text-sky-400 font-bold mt-0.5">Cached in IndexedDB</div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pt-1 border-t border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Multi-channel Caregiver WhatsApp & SOS dispatch verified for {activeHub.state}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
