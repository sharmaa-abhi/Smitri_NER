"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Brain, 
  Search, 
  Clock, 
  Tag, 
  Calendar, 
  User, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Share2, 
  Check, 
  X, 
  ChevronRight,
  Heart,
  TrendingUp,
  ShieldCheck,
  FileText
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { playChime, stopVoicePrompt } from "@/lib/audioPrompts";

interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: "all" | "memory" | "caregiver" | "sleep" | "regional";
  categoryLabel: string;
  categoryBadgeClass: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  featured?: boolean;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
    }[];
    clinicalTakeaways: string[];
  };
}

const ARTICLES: Article[] = [
  {
    id: "art-1",
    slug: "sleep-neural-recall-seniors",
    featured: true,
    category: "sleep",
    categoryLabel: "Sleep & Memory Consolidation",
    categoryBadgeClass: "bg-[#E6F4F1] text-[#0B534B] border-[#93CEC5]",
    title: "How 7 Hours of Sleep Protects Neural Recall in Seniors",
    summary: "Slow-wave sleep acts as the brain's nightly backup drive. Discover simple evening routines that promote deeper memory consolidation for aging brains.",
    readTime: "5 min read",
    date: "October 8, 2026",
    author: {
      name: "Dr. Ananya Roy",
      role: "Geriatric Neuropsychologist",
      avatar: "AR"
    },
    content: {
      intro: "During deep slow-wave sleep, the hippocampus replays daily memory traces to the neocortex for long-term storage. For elders experiencing early cognitive changes, sleep fragmentation is often the earliest reversible factor in daytime memory lapses.",
      sections: [
        {
          heading: "The Glymphatic Clearance System",
          body: [
            "Recent neuroimaging studies demonstrate that the brain's glymphatic waste-removal system is nearly 10 times more active during deep sleep than during waking hours.",
            "This mechanism clears metabolic byproducts—including tau proteins and amyloid fragments—that are implicated in age-related cognitive decline.",
            "When sleep is chronically interrupted by late meals, blue light, or unmanaged anxiety, this clearance cycle remains incomplete."
          ]
        },
        {
          heading: "Evening Micro-Habits for Elders",
          body: [
            "Consistent Bedtime Wind-Down: Keeping bedtime within a 30-minute window trains the circadian pacemaker in the suprachiasmatic nucleus.",
            "Warm Herbal Hydration Before 7:30 PM: Prevents late-night awakenings for bathroom trips while ensuring core hydration.",
            "Gentle Mindful Breathing: Engaging in 4-second box breathing (like our Mindful Breathing Orb) lowers nocturnal cortisol levels by up to 28%."
          ]
        }
      ],
      clinicalTakeaways: [
        "Aim for 7 to 8 hours of uninterrupted sleep rather than fragmented naps.",
        "Evening routines with low ambient lighting stimulate natural melatonin production.",
        "Track morning reaction speeds: slow recall often correlates with poor sleep latency."
      ]
    }
  },
  {
    id: "art-2",
    slug: "hydration-attention-reaction-time",
    category: "memory",
    categoryLabel: "Brain Health & Attention",
    categoryBadgeClass: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
    title: "Why Water Intake Directly Affects Attention & Reaction Time",
    summary: "Mild dehydration of just 1.5% can reduce elderly attention spans by 30%. Here is why thirst signals fade with age and how to stay sharp.",
    readTime: "4 min read",
    date: "October 5, 2026",
    author: {
      name: "Dr. Bikash Sharma",
      role: "Regional Health Officer, Assam",
      avatar: "BS"
    },
    content: {
      intro: "Unlike younger adults, seniors produce lower levels of vasopressin and have diminished osmoreceptor sensitivity, meaning they rarely feel thirsty even when their cells are dehydrated.",
      sections: [
        {
          heading: "The Osmotic Impact on Neurotransmitters",
          body: [
            "Dehydration causes cellular shrinkage in neurons, leading to slower synaptic transmission and delayed neurotransmitter release.",
            "This directly shows up in cognitive tests as hesitations during word retrieval, sluggish math trails, and feeling 'foggy' in the morning."
          ]
        },
        {
          heading: "The 6-Cup Daily Anchor Strategy",
          body: [
            "Instead of asking an elder 'Are you thirsty?', anchor hydration to existing daily rituals.",
            "1 glass upon waking, 1 glass after morning tea, 1 glass with 11 AM news, 1 glass post-lunch, 1 in late afternoon, and 1 early evening."
          ]
        }
      ],
      clinicalTakeaways: [
        "Never wait for thirst; schedule water like essential medication.",
        "Electrolyte balance matters in humid climates like the North Eastern Region.",
        "Track daytime water glasses to avoid afternoon fatigue and disorientation."
      ]
    }
  },
  {
    id: "art-3",
    slug: "comforting-communication-caregivers",
    category: "caregiver",
    categoryLabel: "Caregiver Guidance",
    categoryBadgeClass: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
    title: "Comforting Communication: Encouraging Daily Mental Games Without Stress",
    summary: "How family members can transform cognitive check-ins from stressful evaluations into heartwarming bonding sessions that elders look forward to.",
    readTime: "6 min read",
    date: "October 2, 2026",
    author: {
      name: "Rahul Borah",
      role: "Caregiver & Digital Health Advocate",
      avatar: "RB"
    },
    content: {
      intro: "When elders feel they are being 'tested', their sympathetic nervous system activates, causing performance anxiety and withdrawal. Cognitive exercise must always feel like play, memory nostalgia, and shared joy.",
      sections: [
        {
          heading: "Replace 'Test' with 'Puzzle Time Together'",
          body: [
            "Saying 'Ma, let's see how your memory is today' triggers defensiveness. Instead say: 'Ma, look at this sweet Assamese rhyme game—help me finish the sentence!'",
            "Sitting side-by-side rather than watching from across the room creates partnership instead of interrogation."
          ]
        },
        {
          heading: "Praise Consistency Over Scores",
          body: [
            "Whether their score was 60 or 95, celebrate the fact that they opened the app and spent 10 minutes focused.",
            "Our adaptive engine automatically adjusts difficulty behind the scenes so the elder never feels inadequate."
          ]
        }
      ],
      clinicalTakeaways: [
        "Position memory games as delightful daily hobbies, never medical screenings.",
        "Co-play with parents during morning tea or weekend video calls.",
        "Celebrate consistency streaks to build positive dopamine reinforcement."
      ]
    }
  },
  {
    id: "art-4",
    slug: "indigenous-dialects-cognitive-stimulation",
    category: "regional",
    categoryLabel: "NER Localization & Culture",
    categoryBadgeClass: "bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]",
    title: "Preserving Indigenous Dialects for Cognitive Stimulation in North East India",
    summary: "Why mother tongue familiarity stimulates stronger neural pathways in older adults than secondary languages like English or standard Hindi.",
    readTime: "7 min read",
    date: "September 28, 2026",
    author: {
      name: "Prof. L. Meitei",
      role: "Linguistic Neurologist, Manipur",
      avatar: "LM"
    },
    content: {
      intro: "In aging brains, early childhood memories and mother tongue vocabulary reside in deeply consolidated subcortical memory networks that resist early cognitive decay far longer than secondary acquired languages.",
      sections: [
        {
          heading: "The Mother Tongue Neuro-Advantage",
          body: [
            "When a senior from Meghalaya hears Khasi proverbs or an Assamese elder hears Bihu rhymes, emotional memory networks in the amygdala light up simultaneously with language centers in Broca's area.",
            "This dual emotional-cognitive activation creates richer cognitive reserves than foreign language apps."
          ]
        },
        {
          heading: "Smitri's 8-State Dialect Localization",
          body: [
            "By offering cognitive prompts in Assamese, Bengali, Manipuri, Bodo, Khasi, Garo, Mizo, Nagamese, and Kokborok, Smitri removes tech friction and feels like a warm neighbor speaking to them."
          ]
        }
      ],
      clinicalTakeaways: [
        "Mother tongue stimulation accesses deeper, emotional memory reserves.",
        "Regional cultural games spark joyful storytelling from their youth.",
        "Eliminating language barriers drastically improves daily app retention."
      ]
    }
  },
  {
    id: "art-5",
    slug: "micro-hesitation-invisible-metric",
    category: "memory",
    categoryLabel: "Cognitive Science",
    categoryBadgeClass: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
    title: "Understanding Micro-Hesitation: The Invisible Metric in Digital Care",
    summary: "Accuracy only tells half the story. Learn how millisecond response time changes reveal cognitive shifts months before standard paper tests.",
    readTime: "5 min read",
    date: "September 24, 2026",
    author: {
      name: "Dr. Ananya Roy",
      role: "Geriatric Neuropsychologist",
      avatar: "AR"
    },
    content: {
      intro: "A patient may get 100% of memory answers correct, but taking 3.8 seconds per answer instead of their baseline 1.9 seconds is a clinical indicator that cognitive processing load has increased.",
      sections: [
        {
          heading: "Why Paper Mini-Mental Tests Miss Subtle Shifts",
          body: [
            "Traditional pen-and-paper clinical tests are administered once every 6 or 12 months in an intimidating clinic room.",
            "They only score right or wrong answers, completely blind to the mental fatigue or micro-hesitations of daily living."
          ]
        },
        {
          heading: "Passive Continuous Trajectory Modeling",
          body: [
            "Smitri measures tap latencies, hesitation before matching pairs, and sequence reversals across natural home play.",
            "This allows caregivers to catch subtle 3-day trajectory shifts before any catastrophic event occurs."
          ]
        }
      ],
      clinicalTakeaways: [
        "Response speed latency is often the earliest signal of neuro-fatigue.",
        "Continuous 7-day trendlines beat sporadic annual doctor visits.",
        "Objective data empowers families to seek timely medical advice."
      ]
    }
  },
  {
    id: "art-6",
    slug: "caregiver-burnout-prevention",
    category: "caregiver",
    categoryLabel: "Caregiver Wellness",
    categoryBadgeClass: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
    title: "Caregiver Burnout Prevention: Setting Boundaries While Caring for Elderly Parents",
    summary: "You cannot pour from an empty cup. Practical strategies for adult children balancing demanding careers with remote eldercare.",
    readTime: "6 min read",
    date: "September 20, 2026",
    author: {
      name: "Suman Hazarika",
      role: "Family Counseling Specialist",
      avatar: "SH"
    },
    content: {
      intro: "Remote caregivers often suffer from chronic background anxiety—constantly wondering: 'Did Ma take her medicine? Did she slip? Why hasn't she picked up my call?' This hyper-vigilance leads to severe burnout.",
      sections: [
        {
          heading: "Replace Panic Checking with Automated Guardianship",
          body: [
            "Calling five times a day irritates elders and exhausts children.",
            "Using automated dispatch systems—where you are only notified if a routine was missed past 90 minutes—restores peace of mind and frees up mental energy for meaningful, loving conversations."
          ]
        },
        {
          heading: "Share the Caregiver Mantle",
          body: [
            "Set up secondary emergency contacts like trusted neighbors or local relatives on your Smitri alert dispatch so you never carry the burden alone."
          ]
        }
      ],
      clinicalTakeaways: [
        "Shift from constant worry to automated threshold alerts.",
        "Quality of conversation matters far more than frequency of check-in calls.",
        "Engage local community circles for physical emergency backups."
      ]
    }
  }
];

export default function BlogPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<"all" | "memory" | "caregiver" | "sleep" | "regional">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg">("base");

  // Filter articles based on category and search
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((art) => {
      const matchesCategory = selectedCategory === "all" || art.category === selectedCategory;
      const matchesQuery = 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const featuredArticle = ARTICLES.find((a) => a.featured) || ARTICLES[0];

  const handleShare = (article: Article) => {
    playChime("start");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/blog#${article.slug}`);
      setCopiedSlug(article.slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  const handleListen = (article: Article) => {
    playChime("start");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      stopVoicePrompt();
      const textToRead = `${article.title}. Written by ${article.author.name}. ${article.content.intro}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
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
            {t("nav_blog") || "Blog & Knowledge Hub"}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D5DFDC] pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] text-[#0B534B] text-xs font-bold border border-[#93CEC5] shadow-2xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t("blog_badge") || "Evidence-Based Cognitive Wellness Hub"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111615] tracking-tight">
              Cognitive Wellness & Caregiver Library
            </h1>
            <p className="text-sm sm:text-base text-[#5A6A66] font-medium leading-relaxed">
              Clinical insights, memory preservation techniques, sleep science, and heartwarming advice tailored for elders and family caregivers in North East India.
            </p>
          </div>

          {/* Quick link to Case Studies */}
          <div className="flex items-center gap-3">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#D5DFDC] hover:border-[#0B534B] text-xs sm:text-sm font-bold text-[#111615] hover:text-[#0B534B] shadow-2xs transition-all hover:-translate-y-0.5"
            >
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <span>View Clinical Case Studies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURED SPOTLIGHT ARTICLE BANNER                                         */}
      {/* ========================================================================= */}
      <section 
        aria-label="Featured Article"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B534B] via-[#0E685E] to-[#042420] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-white/20"
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#10B981] text-white uppercase tracking-wider shadow-xs">
              Featured Insight
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
              {featuredArticle.categoryLabel}
            </span>
            <span className="text-xs text-[#A7F3D0] font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {featuredArticle.readTime}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
            {featuredArticle.title}
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-[#D5DFDC] leading-relaxed font-medium">
            {featuredArticle.summary}
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-black text-xs text-white">
                {featuredArticle.author.avatar}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{featuredArticle.author.name}</p>
                <p className="text-[11px] text-[#A7F3D0]">{featuredArticle.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleListen(featuredArticle)}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
                title="Listen to this article"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Listen</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveArticle(featuredArticle)}
                className="px-5 py-2.5 rounded-xl bg-white text-[#0B534B] hover:bg-[#E6F4F1] text-xs sm:text-sm font-black flex items-center gap-2 shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Ambient decorative glowing backdrop shapes */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-[#C084FC]/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* ========================================================================= */}
      {/* SEARCH & CATEGORY FILTERS                                                 */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Insights" },
              { id: "memory", label: "Brain & Attention" },
              { id: "caregiver", label: "Caregiver Guides" },
              { id: "sleep", label: "Sleep & Routine" },
              { id: "regional", label: "NER Regional Care" },
            ].map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playChime("start");
                    setSelectedCategory(tab.id as any);
                  }}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
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

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#7A8D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 text-xs sm:text-sm text-[#111615] outline-none transition-all placeholder:text-[#7A8D88]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A8D88] hover:text-[#111615]"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ARTICLES GRID                                                             */}
      {/* ========================================================================= */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#D5DFDC] space-y-3">
          <BookOpen className="w-10 h-10 text-[#7A8D88] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#111615]">No articles found</h3>
          <p className="text-xs text-[#5A6A66]">Try clearing your search query or choosing another category tab.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-xs font-bold text-[#0B534B] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => {
            return (
              <article
                key={article.id}
                className="group flex flex-col justify-between bg-white rounded-3xl p-6 border border-[#D5DFDC] hover:border-[#0B534B]/40 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Category Pill and Read Time */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${article.categoryBadgeClass}`}>
                      {article.categoryLabel}
                    </span>
                    <span className="text-xs font-semibold text-[#7A8D88] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h3 
                    onClick={() => setActiveArticle(article)}
                    className="text-lg font-bold text-[#111615] group-hover:text-[#0B534B] transition-colors leading-snug cursor-pointer"
                  >
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5A6A66] font-medium leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                {/* Footer Metadata & CTA */}
                <div className="pt-6 mt-6 border-t border-[#D5DFDC]/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#E6F4F1] text-[#0B534B] flex items-center justify-center font-black text-xs border border-[#93CEC5]">
                      {article.author.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111615] leading-none">{article.author.name}</p>
                      <p className="text-[10px] text-[#7A8D88] mt-0.5">{article.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleShare(article)}
                      className="w-8 h-8 rounded-full hover:bg-[#F6F8F7] text-[#7A8D88] hover:text-[#0B534B] flex items-center justify-center transition-colors cursor-pointer"
                      title="Copy link"
                      aria-label="Share article"
                    >
                      {copiedSlug === article.slug ? (
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveArticle(article)}
                      className="px-3 py-1.5 rounded-xl bg-[#E6F4F1] hover:bg-[#0B534B] text-[#0B534B] hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* NEWSLETTER & CAREGIVER DIGEST BANNER                                      */}
      {/* ========================================================================= */}
      <section className="bg-[#F6F8F7] border border-[#D5DFDC] rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0B534B] text-xs font-bold border border-[#D5DFDC]">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Weekly Senior Wellness Digest</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#111615]">
            Receive Doctor-Reviewed Brain Care Tips in Your Inbox
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6A66] font-medium leading-relaxed">
            Free every Saturday. 5-minute actionable guides for diet, sleep, memory stimulation, and elder emotional wellness in the North Eastern Region.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! You are subscribed to Smitri Senior Wellness Digest."); }} className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <input
            type="email"
            required
            placeholder="Enter caregiver email..."
            className="w-full sm:w-72 px-4 py-3 rounded-2xl bg-white border border-[#D5DFDC] focus:border-[#0B534B] text-xs sm:text-sm outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0B534B] hover:bg-[#08433C] text-white text-xs sm:text-sm font-black transition-all cursor-pointer flex-shrink-0"
          >
            Subscribe Free
          </button>
        </form>
      </section>

      {/* ========================================================================= */}
      {/* ARTICLE READER MODAL (FULL READ EXPERIENCE)                               */}
      {/* ========================================================================= */}
      {activeArticle && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#D5DFDC] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#D5DFDC] flex items-center justify-between gap-4 bg-[#F6F8F7]">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${activeArticle.categoryBadgeClass}`}>
                  {activeArticle.categoryLabel}
                </span>
                <span className="text-xs text-[#7A8D88]">• {activeArticle.readTime}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Font Size Selector inside reader */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D5DFDC]">
                  <button
                    type="button"
                    onClick={() => setReaderFontSize("sm")}
                    className={`px-2 py-0.5 rounded text-xs font-bold ${readerFontSize === "sm" ? "bg-[#0B534B] text-white" : "text-[#5A6A66]"}`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize("base")}
                    className={`px-2 py-0.5 rounded text-xs font-bold ${readerFontSize === "base" ? "bg-[#0B534B] text-white" : "text-[#5A6A66]"}`}
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize("lg")}
                    className={`px-2 py-0.5 rounded text-xs font-bold ${readerFontSize === "lg" ? "bg-[#0B534B] text-white" : "text-[#5A6A66]"}`}
                  >
                    A++
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleListen(activeArticle)}
                  className="p-2 rounded-xl bg-white hover:bg-[#E6F4F1] text-[#0B534B] border border-[#D5DFDC] text-xs font-bold transition-colors cursor-pointer"
                  title="Listen to audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopVoicePrompt();
                    setActiveArticle(null);
                  }}
                  className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center text-[#5A6A66] hover:text-[#111615] transition-colors cursor-pointer"
                  aria-label="Close reader"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-[#111615] leading-tight">
                  {activeArticle.title}
                </h2>
                <div className="flex items-center gap-3 pt-1 text-xs text-[#5A6A66]">
                  <span className="font-bold text-[#111615]">{activeArticle.author.name}</span>
                  <span>•</span>
                  <span>{activeArticle.author.role}</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                </div>
              </div>

              {/* Intro Callout */}
              <div className="p-4 rounded-2xl bg-[#E6F4F1]/70 border border-[#93CEC5]/60 text-xs sm:text-sm text-[#0B534B] font-medium leading-relaxed">
                {activeArticle.content.intro}
              </div>

              {/* Body Sections */}
              <div className={`space-y-6 text-[#111615] leading-relaxed ${
                readerFontSize === "sm" ? "text-xs" : readerFontSize === "base" ? "text-sm sm:text-base" : "text-base sm:text-lg"
              }`}>
                {activeArticle.content.sections.map((sec, i) => (
                  <div key={i} className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#0B534B]">
                      {sec.heading}
                    </h3>
                    {sec.body.map((p, pIdx) => (
                      <p key={pIdx} className="text-[#5A6A66] leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Clinical Takeaways Box */}
              <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#92400E] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                  <span>Clinical & Practical Takeaways</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#111615] font-medium">
                  {activeArticle.content.clinicalTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#D97706] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#D5DFDC] bg-[#F6F8F7] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(activeArticle)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#D5DFDC] text-xs font-bold text-[#5A6A66] hover:text-[#0B534B] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedSlug === activeArticle.slug ? "Link Copied!" : "Share Article"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  stopVoicePrompt();
                  setActiveArticle(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#0B534B] hover:bg-[#08433C] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
