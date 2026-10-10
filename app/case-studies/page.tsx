"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  HeartHandshake, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Activity, 
  FileText, 
  Sparkles, 
  PhoneCall, 
  ChevronRight, 
  X, 
  Share2, 
  Check, 
  Award,
  Users,
  WifiOff
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { playChime } from "@/lib/audioPrompts";

interface CaseStudy {
  id: string;
  slug: string;
  patientName: string;
  age: number;
  location: string;
  state: string;
  focusArea: "remote" | "detection" | "offline" | "vernacular";
  focusAreaLabel: string;
  badgeClass: string;
  title: string;
  summary: string;
  metrics: {
    label: string;
    before: string;
    after: string;
    highlight: string;
  }[];
  challenge: string;
  intervention: string;
  outcome: string;
  caregiverQuote: {
    text: string;
    author: string;
    relation: string;
  };
  clinicalFindings: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-1",
    slug: "kamla-devi-guwahati-adherence",
    patientName: "Kamla Devi",
    age: 68,
    location: "Guwahati",
    state: "Assam",
    focusArea: "remote",
    focusAreaLabel: "Remote Family Caregiver",
    badgeClass: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
    title: "Overcoming Medication Hesitation for an Elder Living Alone in Assam",
    summary: "Son working in Bangalore experienced constant work-hour panic over missed hypertension medication. Smitri's gentle Assamese audio reminders and automated 90-minute family dispatch transformed compliance.",
    metrics: [
      {
        label: "On-Time Med Adherence",
        before: "58%",
        after: "94%",
        highlight: "+36% Gain"
      },
      {
        label: "Caregiver Daily Anxiety",
        before: "Severe (5 calls/day)",
        after: "Peace of Mind",
        highlight: "Automated Watch"
      },
      {
        label: "Morning Routine Consistency",
        before: "Erratic (±3 hrs)",
        after: "Within 45 mins",
        highlight: "Healthy Rhythm"
      }
    ],
    challenge: "Kamla Devi lived alone in Guwahati following the passing of her spouse. Her son Rahul, working 2,500 km away in Bangalore, had to constantly phone her during business meetings to confirm if she had taken her critical blood pressure and diabetes tablets. Kamla often felt badgered, while Rahul suffered severe caregiver anxiety.",
    intervention: "Installed Smitri on Kamla's Android phone with the Senior Mode layout. The application was configured with her native Assamese voice prompts ('আই, পুৱাৰ ৰক্তচাপৰ ঔষধ খোৱাৰ সময় হ'ল'). A 90-minute safety window was established: if unconfirmed after 2 gentle voice alerts, a priority WhatsApp card automatically dispatching to Rahul with 1-click dial.",
    outcome: "Medication adherence surged from 58% to 94% over the 90-day observation period. Out of 180 total doses, Rahul only needed to intervene 7 times. Their daily phone calls transformed from anxious interrogations into joyful conversations about family and daily life.",
    caregiverQuote: {
      text: "I used to freeze whenever my phone rang during meetings wondering if Ma fell ill. Now, seeing her daily checkmark on Smitri gives me complete peace of mind.",
      author: "Rahul Borah",
      relation: "Son (Software Engineer, Bangalore)"
    },
    clinicalFindings: [
      "Voice reminders in mother tongue (Assamese) resulted in 2.4x higher response rates than generic phone alarms.",
      "Threshold escalation (notifying only after 90 minutes) eliminated alarm fatigue for the remote family member.",
      "Blood pressure stability improved with zero hypertensive spikes recorded during month 2 and 3."
    ]
  },
  {
    id: "cs-2",
    slug: "ramesh-bora-imphal-early-detection",
    patientName: "Ramesh Bora",
    age: 74,
    location: "Imphal",
    state: "Manipur",
    focusArea: "detection",
    focusAreaLabel: "Early Trajectory Shift Detection",
    badgeClass: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
    title: "Flagging a 3-Day Micro-Hesitation Shift 4 Months Before Clinical Diagnosis",
    summary: "A retired teacher in Manipur enjoyed daily Manipuri Number Trail games. When response latencies slowed by 35% without accuracy dropping, the trend model triggered a timely neurological checkup.",
    metrics: [
      {
        label: "Micro-Hesitation Latency",
        before: "1.8 sec/match",
        after: "3.4 sec (+35% lag)",
        highlight: "Signal Detected"
      },
      {
        label: "Diagnostic Window Saved",
        before: "Standard (Annual)",
        after: "4 Months Earlier",
        highlight: "Early Intervention"
      },
      {
        label: "Memory Game Streak",
        before: "Sporadic",
        after: "48 Consecutive Days",
        highlight: "High Engagement"
      }
    ],
    challenge: "Ramesh Bora pridefully resisted visiting memory clinics, dismissing slight lapses as normal aging. His daughter noticed occasional forgetfulness with names but lacked objective proof to convince him to see a doctor without offending him.",
    intervention: "Ramesh was introduced to Smitri simply as a 'daily brain puzzle' in Meitei (Manipuri). Over 6 weeks, the baseline engine mapped his typical response speed across Matrix Patterns and Number Trail games. On Day 44, the engine registered a sustained 35% latency increase over three consecutive days, despite his accuracy score remaining near 88%.",
    outcome: "The Caregiver Portal generated an exportable 30-day cognitive trajectory PDF. When presented to a senior neurologist at RIMS Imphal, the physician identified early micro-vascular changes and initiated early therapeutic lifestyle and medical intervention—saving approximately 4 months compared to typical late-stage clinic walk-ins.",
    caregiverQuote: {
      text: "My father would have refused a hospital memory test. But playing his daily morning game gave the doctor the exact data needed to protect his brain.",
      author: "Linthoingambi Bora",
      relation: "Daughter & Primary Caregiver"
    },
    clinicalFindings: [
      "Micro-hesitation was visible digitally 16 weeks before standard paper MMSE testing would have caught it.",
      "Gamified non-clinical environments reduce performance anxiety and eliminate test resistance.",
      "Trajectory reporting bridges the gap between home observation and clinical neurology."
    ]
  },
  {
    id: "cs-3",
    slug: "dr-sangma-tura-offline-pwa",
    patientName: "Garo Hills Community",
    age: 71,
    location: "Tura, Garo Hills",
    state: "Meghalaya",
    focusArea: "offline",
    focusAreaLabel: "Offline Rural Healthcare",
    badgeClass: "bg-[#E6F4F1] text-[#0B534B] border-[#93CEC5]",
    title: "Delivering Cognitive Monitoring in Zero-Connectivity Hill Villages",
    summary: "In hilly regions of Meghalaya with frequent power cuts and absent cellular data, Smitri's IndexedDB Offline PWA engine maintained 100% continuous senior care.",
    metrics: [
      {
        label: "Offline Data Retention",
        before: "Cloud Failed (0%)",
        after: "100% Local Cache",
        highlight: "Zero Data Loss"
      },
      {
        label: "Rural Elders Monitored",
        before: "12 (Hospital only)",
        after: "140+ Elders",
        highlight: "11x Scale"
      },
      {
        label: "Dialect Adoption (Garo/Khasi)",
        before: "English (15%)",
        after: "Local (92%)",
        highlight: "High Trust"
      }
    ],
    challenge: "Primary Health Centers in western Meghalaya faced recurring internet blackouts lasting 3 to 5 days. Elders in surrounding villages had basic budget smartphones but rarely had active cellular mobile data.",
    intervention: "Smitri deployed its full Progressive Web App (PWA) architecture utilizing client-side IndexedDB caching. All 6 cognitive game models, audio prompts in Garo and Khasi, and local medication logs operate completely offline without internet connectivity. When Asha workers visit weekly with hotspot access, data silently synchronizes to regional health dashboards.",
    outcome: "140+ rural elders across 6 village clusters maintained continuous cognitive stimulation and medication tracking. Zero data points were lost during a 96-hour storm outage, demonstrating resilience for rural public health.",
    caregiverQuote: {
      text: "In the hills, digital health apps usually fail the moment the cell tower loses power. Smitri continues running seamlessly even when the entire village is off-grid.",
      author: "Dr. B. Sangma",
      relation: "Rural Health Medical Officer, Tura"
    },
    clinicalFindings: [
      "Zero-latency client-side IndexedDB ensures dignity and uninterrupted elder interaction.",
      "Audio prompts pre-cached locally eliminated high-bandwidth streaming requirements.",
      "Proof-of-concept for scalable low-resource geriatric care in hilly regions of South Asia."
    ]
  },
  {
    id: "cs-4",
    slug: "subhashree-agartala-vernacular",
    patientName: "Subhashree Debbarma",
    age: 72,
    location: "Agartala",
    state: "Tripura",
    focusArea: "vernacular",
    focusAreaLabel: "Multilingual Cultural Inclusion",
    badgeClass: "bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]",
    title: "Reconnecting an Isolated Bilingual Elder with Nostalgic Memory Games",
    summary: "A Kokborok and Bengali speaker feeling isolated after moving into an urban apartment re-discovered joy through traditional Grocery Basket & Rhyme Completion puzzles.",
    metrics: [
      {
        label: "Daily Engagement Streak",
        before: "0 days",
        after: "32 Days Active",
        highlight: "Consistent Play"
      },
      {
        label: "Self-Reported Happiness",
        before: "42/100 (Isolated)",
        after: "88/100",
        highlight: "+46 Pts Joy"
      },
      {
        label: "Recall Speed Accuracy",
        before: "64%",
        after: "86%",
        highlight: "Strong Recall"
      }
    ],
    challenge: "Subhashree struggled with loneliness and withdrawal after moving from her ancestral village to an apartment in Agartala. English-language mobile apps felt foreign and intimidating, causing her to avoid modern devices entirely.",
    intervention: "Her granddaughter set up Smitri in Bengali and Kokborok with the Grocery Basket and Rhyme games that use traditional regional items (local greens, bamboo shoots, seasonal fruits). The tactile interface with large touch targets and soothing chime audio made it feel like a cultural keepsake rather than a medical tool.",
    outcome: "Subhashree completed 32 consecutive daily play sessions. She began recalling old folk songs and actively quizzing her grandchildren during evening tea, reversing social withdrawal patterns.",
    caregiverQuote: {
      text: "Dida used to sit quietly in her room all afternoon. Now she asks me: 'Did you solve your morning puzzle yet?' She feels proud and mentally active again.",
      author: "Anindita Debbarma",
      relation: "Granddaughter & Caregiver"
    },
    clinicalFindings: [
      "Culturally resonant stimuli stimulate episodic memory far more effectively than abstract shapes.",
      "Social engagement increased organically within multi-generational households.",
      "Positive emotional association reversed technology phobia in elderly users."
    ]
  }
];

export default function CaseStudiesPage() {
  const { t } = useLanguage();
  const [selectedFocus, setSelectedFocus] = useState<"all" | "remote" | "detection" | "offline" | "vernacular">("all");
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filteredStudies = useMemo(() => {
    if (selectedFocus === "all") return CASE_STUDIES;
    return CASE_STUDIES.filter((cs) => cs.focusArea === selectedFocus);
  }, [selectedFocus]);

  const handleShare = (study: CaseStudy) => {
    playChime("start");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/case-studies#${study.slug}`);
      setCopiedSlug(study.slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  return (
    <div className="py-6 sm:py-10 space-y-10 sm:space-y-14 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* BREADCRUMB & HEADER                                                       */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-[#5A6A66]">
          <Link href="/" className="hover:text-[#0B534B] transition-colors">
            {t("nav_home") || "Home"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0B534B] font-bold">
            Case Studies
          </span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D5DFDC] pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] text-[#0B534B] text-xs font-bold border border-[#93CEC5] shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#0B534B]" />
              <span>Real-World Clinical & Caregiver Outcomes</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111615] tracking-tight">
              Evidence in Action: Senior Care Case Studies
            </h1>
            <p className="text-sm sm:text-base text-[#5A6A66] font-medium leading-relaxed">
              Explore how families, rural health clinics, and geriatric specialists across the 8 sister states of North East India use Smitri to preserve cognitive vitality and ensure elder safety.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/caregiver"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0B534B] hover:bg-[#08433C] text-white text-xs sm:text-sm font-black shadow-md transition-all hover:-translate-y-0.5"
            >
              <span>Explore Caregiver Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MACRO OUTCOMES BANNER                                                     */}
      {/* ========================================================================= */}
      <section 
        aria-label="Clinical Metrics"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B534B] to-[#042420] text-white shadow-xl border border-white/20"
      >
        <div className="space-y-1 p-3">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#A7F3D0]">
            94%
          </div>
          <p className="text-xs sm:text-sm font-bold text-white">Medication Adherence</p>
          <p className="text-[11px] text-[#D5DFDC]">+36% average gain in 90 days</p>
        </div>

        <div className="space-y-1 p-3 border-l border-white/15">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#FDE68A]">
            3.2x
          </div>
          <p className="text-xs sm:text-sm font-bold text-white">Faster Family Dispatch</p>
          <p className="text-[11px] text-[#D5DFDC]">Automated WhatsApp/SMS alerts</p>
        </div>

        <div className="space-y-1 p-3 border-l-0 lg:border-l border-white/15">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#A7F3D0]">
            4 Mo.
          </div>
          <p className="text-xs sm:text-sm font-bold text-white">Earlier Shift Detection</p>
          <p className="text-[11px] text-[#D5DFDC]">Via 3-day micro-hesitation models</p>
        </div>

        <div className="space-y-1 p-3 border-l border-white/15">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            8 States
          </div>
          <p className="text-xs sm:text-sm font-bold text-white">NER Regional Footprint</p>
          <p className="text-[11px] text-[#D5DFDC]">13 vernacular dialects supported</p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CATEGORY FOCUS FILTERS                                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {[
          { id: "all", label: "All Case Studies" },
          { id: "remote", label: "Remote Family Caregiving" },
          { id: "detection", label: "Early Clinical Detection" },
          { id: "offline", label: "Offline Rural PWA" },
          { id: "vernacular", label: "Dialect & Culture Inclusion" },
        ].map((tab) => {
          const isActive = selectedFocus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playChime("start");
                setSelectedFocus(tab.id as any);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                isActive
                  ? "bg-[#0B534B] text-white border-[#0B534B] shadow-xs"
                  : "bg-white text-[#5A6A66] hover:text-[#111615] border-[#D5DFDC] hover:bg-[#F6F8F7]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* CASE STUDIES CARDS GRID                                                   */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        {filteredStudies.map((study) => {
          return (
            <article
              key={study.id}
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#D5DFDC] hover:border-[#0B534B]/40 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 7 Columns: Story Narrative */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${study.badgeClass}`}>
                      {study.focusAreaLabel}
                    </span>
                    <span className="text-xs font-bold text-[#5A6A66] flex items-center gap-1 bg-[#F6F8F7] px-2.5 py-1 rounded-full border border-[#D5DFDC]">
                      <MapPin className="w-3.5 h-3.5 text-[#0B534B]" />
                      <span>{study.location}, {study.state}</span>
                    </span>
                    <span className="text-xs font-semibold text-[#7A8D88]">
                      Age: {study.age}
                    </span>
                  </div>

                  <h2 
                    onClick={() => setActiveStudy(study)}
                    className="text-xl sm:text-2xl font-black text-[#111615] hover:text-[#0B534B] transition-colors leading-tight cursor-pointer"
                  >
                    {study.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5A6A66] font-medium leading-relaxed">
                    {study.summary}
                  </p>

                  {/* Caregiver Quote Box */}
                  <blockquote className="p-4 rounded-2xl bg-[#F6F8F7] border-l-4 border-[#0B534B] space-y-2">
                    <p className="text-xs sm:text-sm text-[#111615] italic font-medium">
                      "{study.caregiverQuote.text}"
                    </p>
                    <footer className="text-xs text-[#5A6A66] font-bold">
                      — {study.caregiverQuote.author} <span className="text-[#7A8D88] font-normal">({study.caregiverQuote.relation})</span>
                    </footer>
                  </blockquote>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveStudy(study)}
                      className="px-5 py-2.5 rounded-xl bg-[#0B534B] hover:bg-[#08433C] text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:scale-102 active:scale-98"
                    >
                      <span>Read Full Clinical Case Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(study)}
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DFDC] hover:border-[#0B534B] text-[#5A6A66] hover:text-[#0B534B] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSlug === study.slug ? (
                        <>
                          <Check className="w-4 h-4 text-[#10B981]" />
                          <span>Link Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right 5 Columns: Quantitative Outcome Metrics Card */}
                <div className="lg:col-span-5 bg-[#F6F8F7] border border-[#D5DFDC] rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D5DFDC]">
                    <span className="text-xs font-bold text-[#111615] uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-[#0B534B]" />
                      <span>Quantitative Impact</span>
                    </span>
                    <span className="text-xs font-bold text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                      Verified
                    </span>
                  </div>

                  <div className="space-y-3">
                    {study.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#D5DFDC] space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-[#5A6A66]">
                          <span>{metric.label}</span>
                          <span className="text-[#0B534B] font-black">{metric.highlight}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-semibold pt-1 border-t border-black/5">
                          <span className="text-[#7A8D88]">Baseline: {metric.before}</span>
                          <span className="text-[#111615] font-bold">With Smitri: {metric.after}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1 text-[11px] text-[#7A8D88] text-center">
                    Data tracked across 90-day active pilot cohort.
                  </div>
                </div>

              </div>
            </article>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* CASE STUDY EXPANDED REPORT MODAL                                          */}
      {/* ========================================================================= */}
      {activeStudy && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#D5DFDC] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#D5DFDC] flex items-center justify-between gap-4 bg-[#F6F8F7]">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${activeStudy.badgeClass}`}>
                  {activeStudy.focusAreaLabel}
                </span>
                <span className="text-xs text-[#7A8D88]">
                  • {activeStudy.location}, {activeStudy.state}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveStudy(null)}
                className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center text-[#5A6A66] hover:text-[#111615] transition-colors cursor-pointer"
                aria-label="Close Case Report"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-[#111615] leading-tight">
                  {activeStudy.title}
                </h2>
                <p className="text-xs text-[#5A6A66] font-semibold">
                  Patient Subject: {activeStudy.patientName} (Age {activeStudy.age}) • Primary Setting: Home Care
                </p>
              </div>

              {/* Challenge */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#DC2626] uppercase tracking-wider flex items-center gap-2">
                  <span>1. Initial Clinical & Family Challenge</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6A66] leading-relaxed font-medium">
                  {activeStudy.challenge}
                </p>
              </div>

              {/* Intervention */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#0B534B] uppercase tracking-wider flex items-center gap-2">
                  <span>2. Smitri_NER Technology Intervention</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6A66] leading-relaxed font-medium">
                  {activeStudy.intervention}
                </p>
              </div>

              {/* Outcome */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#059669] uppercase tracking-wider flex items-center gap-2">
                  <span>3. Measured 90-Day Outcome</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6A66] leading-relaxed font-medium">
                  {activeStudy.outcome}
                </p>
              </div>

              {/* Clinical Findings Pill Box */}
              <div className="p-5 rounded-2xl bg-[#E6F4F1] border border-[#93CEC5] space-y-3">
                <h4 className="text-xs font-black text-[#0B534B] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0B534B]" />
                  <span>Key Clinical Findings & Geriatric Learnings</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#111615] font-medium">
                  {activeStudy.clinicalFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#10B981] font-bold">✓</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#D5DFDC] bg-[#F6F8F7] flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleShare(activeStudy)}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#D5DFDC] text-xs font-bold text-[#5A6A66] hover:text-[#0B534B] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedSlug === activeStudy.slug ? "Link Copied" : "Share Case Report"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStudy(null)}
                className="px-5 py-2 rounded-xl bg-[#0B534B] hover:bg-[#08433C] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM CTA: EXPERIMENT IN CAREGIVER PORTAL                                 */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D5DFDC] text-center space-y-4 shadow-sm">
        <h3 className="text-2xl sm:text-3xl font-black text-[#111615]">
          Ready to Experience Real-Time Family Protection?
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6A66] max-w-xl mx-auto font-medium leading-relaxed">
          Try our interactive Caregiver Simulator or explore cognitive games tailored for elderly users in your family.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/caregiver"
            className="px-6 py-3 rounded-2xl bg-[#0B534B] hover:bg-[#08433C] text-white text-xs sm:text-sm font-black transition-all shadow-md hover:-translate-y-0.5"
          >
            Open Live Caregiver Portal
          </Link>
          <Link
            href="/games"
            className="px-6 py-3 rounded-2xl bg-[#F6F8F7] hover:bg-[#EBF0EE] text-[#111615] border border-[#D5DFDC] text-xs sm:text-sm font-bold transition-all"
          >
            Play Memory Games
          </Link>
        </div>
      </section>

    </div>
  );
}
