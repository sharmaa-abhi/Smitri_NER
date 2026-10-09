"use client";

import React, { useState } from "react";
import { MapPin, Volume2, Users, Wifi, Radio, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { playChime, playWebSpeechDialect } from "@/lib/audioPrompts";
import { useLanguage } from "@/lib/i18n";

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
    highlightColor: "#10B981", // Emerald
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
    highlightColor: "#2F9285", // Teal
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
    highlightColor: "#127267", // Deep Teal Mid
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
    highlightColor: "#D97706", // Amber Accent
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
    highlightColor: "#059669", // Emerald Dark
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
    highlightColor: "#10B981", // Emerald
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
    highlightColor: "#5EB2A6", // Soft Teal
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
    highlightColor: "#34D399", // Mint
  },
];

export default function RegionalCareMap() {
  const { t } = useLanguage();
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
    <div className="bg-gradient-to-br from-[#042420] via-[#06342E] to-[#0B534B] text-white rounded-3xl p-6 sm:p-10 border border-[#127267]/40 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0B534B]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#127267]/40">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#A7F3D0] text-xs font-bold border border-white/20">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#A7F3D0]" />
            <span>{t("8 Sister States Health Coverage") || "NER Care Map • 8 Sister States Live Telemetry"}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t("North East Regional Care Map") || "Pulsing Community Care Hubs"}
          </h3>
          <p className="text-xs sm:text-sm text-[#D5DFDC] font-medium leading-relaxed">
            {t("Active Senior Hubs & Languages") || "Hover or tap any regional hub to hear localized audio greetings and inspect real-time offline cognitive session health."}
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#A7F3D0] font-mono">
              {totalActive.toLocaleString()}+
            </div>
            <div className="text-[11px] font-semibold text-[#D5DFDC]">{t("Active Users") || "Total Active Elders"}</div>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#A7F3D0] font-mono">99.4%</div>
            <div className="text-[11px] font-semibold text-[#D5DFDC]">Avg Sync Reliability</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left interactive vector map, Right live telemetrics card */}
      <div className="relative mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT: Topographic SVG Map of Northeast India */}
        <div className="lg:col-span-7 relative bg-[#042420]/70 rounded-3xl p-4 sm:p-6 border border-[#127267]/40 backdrop-blur-md">
          {/* Subtle Grid overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none rounded-3xl"
            style={{
              backgroundImage: "radial-gradient(#10B981 1px, transparent 1px)",
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
                  <stop offset="0%" stopColor="#042420" />
                  <stop offset="50%" stopColor="#06342E" />
                  <stop offset="100%" stopColor="#042420" />
                </linearGradient>
                <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0B534B" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Sikkim Area */}
              <path
                d="M 40,110 L 65,115 L 70,160 L 45,155 Z"
                fill="url(#nerGradient)"
                stroke="#127267"
                strokeWidth="1.5"
                className="transition-all hover:stroke-[#10B981]"
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
                stroke="#127267"
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
                    stroke="#08433C"
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
                      fill={isSelected ? hub.highlightColor : "#042420"}
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
                      fill={isSelected ? "#A7F3D0" : "#D5DFDC"}
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
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-3 border-t border-[#127267]/40">
            {CARE_HUBS.map((hub) => (
              <button
                key={hub.id}
                type="button"
                onClick={() => handleSelectHub(hub)}
                className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  activeHub.id === hub.id
                    ? "bg-[#10B981] text-white shadow-md scale-105"
                    : "bg-white/10 text-[#D5DFDC] hover:bg-white/20 active:scale-95"
                }`}
              >
                {hub.state}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Live Telemetry Inspection Card */}
        <div className="lg:col-span-5 bg-[#06342E]/90 rounded-3xl p-6 sm:p-7 border border-[#127267]/50 shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block"
                style={{ backgroundColor: `${activeHub.highlightColor}25`, color: activeHub.highlightColor }}
              >
                {activeHub.state} Regional Care Network
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white">{activeHub.name}</h4>
              <p className="text-xs text-[#D5DFDC] font-medium">Primary Dialect: {activeHub.dialectName}</p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#A7F3D0] flex items-center justify-center border border-white/20 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
          </div>

          {/* Greeting showcase banner */}
          <div className="bg-[#042420]/80 rounded-2xl p-4 border border-[#08433C] space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Native Elder Welcome Greeting</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-wide font-sans">
              "{activeHub.greetingNative}"
            </div>
            <div className="text-xs text-[#D5DFDC] font-medium">
              Meaning: {activeHub.greetingEnglish}
            </div>

            <button
              type="button"
              onClick={handlePlayGreeting}
              disabled={isPlayingAudio}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce" : ""}`} />
              <span>{isPlayingAudio ? "Playing Pronunciation..." : "Hear Local Voice"}</span>
            </button>
          </div>

          {/* Real-time Health Telemetrics */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#042420]/60 p-3.5 rounded-2xl border border-[#08433C]">
              <div className="flex items-center gap-1.5 text-[#D5DFDC] text-xs font-semibold">
                <Users className="w-3.5 h-3.5 text-[#A7F3D0]" />
                <span>Active Seniors</span>
              </div>
              <div className="text-lg font-black text-white font-mono mt-1">
                {activeHub.activeElders} Elders
              </div>
              <div className="text-[10px] text-[#A7F3D0] font-bold mt-0.5">● Live Daily Routine</div>
            </div>

            <div className="bg-[#042420]/60 p-3.5 rounded-2xl border border-[#08433C]">
              <div className="flex items-center gap-1.5 text-[#D5DFDC] text-xs font-semibold">
                <Wifi className="w-3.5 h-3.5 text-[#A7F3D0]" />
                <span>Offline Sync Rate</span>
              </div>
              <div className="text-lg font-black text-white font-mono mt-1">
                {activeHub.syncRate}
              </div>
              <div className="text-[10px] text-[#A7F3D0] font-bold mt-0.5">Cached in IndexedDB</div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#D5DFDC] pt-1 border-t border-[#127267]/40">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
            <span>Multi-channel Caregiver WhatsApp & SOS dispatch verified for {activeHub.state}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
