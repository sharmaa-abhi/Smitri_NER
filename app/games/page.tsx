"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Sparkles, 
  Brain, 
  Shapes, 
  Eye, 
  ShoppingBag, 
  Hash, 
  Grid3X3, 
  Volume2, 
  Clock,
  BookOpen,
  Award,
  Zap,
  TrendingUp,
  Target,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';

type GameCategory = 'all' | 'daily' | 'memory' | 'attention' | 'verbal';

export default function GamesHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');

  const games = [
    {
      id: 'grocery-basket',
      title: 'Grocery Basket Recall',
      desc: 'Remember items placed in your daily market basket. Stimulates short-term verbal recall and everyday grocery shopping recognition.',
      icon: ShoppingBag,
      color: 'bg-emerald-600',
      category: 'daily',
      tag: 'Everyday Market Recall',
      difficulty: 'Adaptive (Level 1-3)',
      realWorldScenario: 'Weekly Local Bazaar & Vegetable Shopping List',
      realWorldBenefit: 'Helps elderly navigate market shopping without forgetting essentials',
      lastPlayedScore: 82,
      audioInstruction: 'Welcome to Grocery Basket Recall. Memorize the items in your basket, then pick them out from the market shelves. There is no hurry.',
    },
    {
      id: 'clock-reading',
      title: 'Clock Face Match',
      desc: 'Read gentle analog clock hands and pick the correct daily routine moment. Grounding for time orientation, prayer, and meal timings.',
      icon: Clock,
      color: 'bg-cyan-600',
      category: 'daily',
      tag: 'Daily Routine & Time',
      difficulty: 'Adaptive (Level 1-3)',
      realWorldScenario: 'Timetable for Morning Puja, Medicine & Doctor Visits',
      realWorldBenefit: 'Reinforces daily temporal awareness and appointment punctuality',
      lastPlayedScore: 92,
      audioInstruction: 'Welcome to Clock Face Match. Look at the clock hands and select the matching routine time. Take all the time you need.',
    },
    {
      id: 'different-one',
      title: 'Find the Different One',
      desc: 'Spot the single object that looks different from the others. Enhances attention to detail and sharpens eye-for-detail.',
      icon: Eye,
      color: 'bg-amber-600',
      category: 'attention',
      tag: 'Visual Attention',
      difficulty: 'Adaptive (Level 1-3)',
      realWorldScenario: 'Spotting Expired Medicine vs Safe Medicine Labels',
      realWorldBenefit: 'Prevents medication mix-ups by training visual discrimination',
      lastPlayedScore: 88,
      audioInstruction: 'Welcome to Find the Different One. Look carefully at the icons and tap the one that does not match the rest.',
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      desc: 'Flip and match pairs of colorful everyday icons. Gentle exercise for short-term visual recall and object association.',
      icon: Shapes,
      color: 'bg-blue-600',
      category: 'memory',
      tag: 'Visual Memory',
      difficulty: 'Adaptive (Level 1-3)',
      realWorldScenario: 'Finding Household Items & Kitchen Utensils',
      realWorldBenefit: 'Strengthens recall of where spectacles, keys, and cups are kept',
      lastPlayedScore: 84,
      audioInstruction: 'Welcome to Memory Match. Flip two cards to find matching pairs. Take your time, there is no hurry.',
    },
    {
      id: 'number-trail',
      title: 'Number Trail',
      desc: 'Follow river stones by tapping numbers in rising order. Strengthens mental sequencing, passbook checks, and motor agility.',
      icon: Hash,
      color: 'bg-indigo-600',
      category: 'attention',
      tag: 'Numerical Order',
      difficulty: 'Adaptive (Level 1-3)',
      realWorldScenario: 'Counting Currency Rupee Notes & Reading Bank Passbooks',
      realWorldBenefit: 'Maintains financial numeracy and sequential coordination',
      lastPlayedScore: 79,
      audioInstruction: 'Welcome to Number Trail. Look at the numbered circles and tap them in order, starting from 1 upward.',
    },
    {
      id: 'sound-word-match',
      title: 'Daily Word & Sound Match',
      desc: 'Listen to spoken prompts and choose the matching picture. Enhances auditory comprehension and household sound awareness.',
      icon: Volume2,
      color: 'bg-rose-600',
      category: 'verbal',
      tag: 'Auditory & Semantic',
      difficulty: 'Adaptive (Level 1-3)',
      realWorldScenario: 'Household Safety Sounds (Doorbell, Whistle, Phone Ring)',
      realWorldBenefit: 'Sharpens auditory processing and environmental awareness',
      lastPlayedScore: 86,
      audioInstruction: 'Welcome to Daily Word and Sound Association. Listen to the audio cue or tap the sound button, then select the matching picture.',
    },
    {
      id: 'sequence-memory',
      title: 'Sequence Memory',
      desc: 'Watch the light sequence flash and tap them back in order. Stimulates working memory and light perception.',
      icon: Brain,
      color: 'bg-teal-600',
      category: 'memory',
      tag: 'Pattern Recall',
      difficulty: 'Adaptive (Level 1-3)',
      realWorldScenario: 'Remembering Appliance Buttons & Traffic Signals',
      realWorldBenefit: 'Boosts working memory capacity for multi-step home tasks',
      lastPlayedScore: 75,
      audioInstruction: 'Welcome to Sequence Memory. Watch the colored tiles light up, then repeat the sequence in order.',
    },
    {
      id: 'pattern-match',
      title: 'Matrix Pattern Recall',
      desc: 'Observe illuminated squares on a grid and replicate where they were. Boosts spatial memory and room navigation.',
      icon: Grid3X3,
      color: 'bg-purple-600',
      category: 'memory',
      tag: 'Spatial Memory',
      difficulty: 'Adaptive (Level 1-3)',
      realWorldScenario: 'Home Room Layout & Furniture Placement Spatial Awareness',
      realWorldBenefit: 'Reduces disorientation and helps spatial stability at home',
      lastPlayedScore: 80,
      audioInstruction: 'Welcome to Matrix Pattern Recall. Watch the glowing squares on the grid, then tap those exact locations.',
    },
    {
      id: 'rhyme-completion',
      title: 'Rhyme & Proverb Complete',
      desc: 'Complete classic comfort proverbs and rhymes with the missing word. Stimulates linguistic recall and conversational confidence.',
      icon: BookOpen,
      color: 'bg-violet-600',
      category: 'verbal',
      tag: 'Verbal Fluency',
      difficulty: 'Adaptive (Level 1-3)',
      realWorldScenario: 'Traditional Storytelling & Cultural Proverbs with Grandchildren',
      realWorldBenefit: 'Maintains rich vocabulary and social communication joy',
      lastPlayedScore: 90,
      audioInstruction: 'Welcome to Rhyme and Word Complete. Listen to the phrase and choose the word that completes the rhyme.',
    },
  ];

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(g => g.category === selectedCategory);

  const voiceSummary = `Welcome to the Cognitive Games Dashboard. Here you have 9 games rooted in real-world everyday elder activities, such as Bazaar vegetable shopping, clock reading for prayer times, and recognizing medicine labels. You have a 7-day consistency streak. Tap any game to start.`;

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Game Hub Description & Voice Reader */}
      <ScrollReveal direction="down">
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Real-World Cognitive Gaming Hub • 9 Scenarios</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Games Dashboard & Everyday Quests
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              Every game is carefully modeled after real-world senior experiences — from grocery market shopping to reading clock hands for daily routines.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <VoiceButton
              textToRead={voiceSummary}
              buttonLabel="Read Guide"
            />
            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Real-World Game Analytics Bar (Embedded Game Dashboard Stats) */}
      <ScrollReveal direction="up" delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-5 rounded-2xl shadow-md border border-blue-900 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Consistency Streak</span>
              <div className="text-3xl font-black">7 Days 🔥</div>
              <p className="text-[11px] text-blue-100">Played daily without missing</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center font-bold text-xl">
              🎯
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Accuracy</span>
              <div className="text-3xl font-black text-emerald-700">88%</div>
              <p className="text-[11px] text-slate-600">Across all 9 real-life games</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg">
              ✓
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fastest Domain</span>
              <div className="text-2xl font-black text-blue-950">Clock Face</div>
              <p className="text-[11px] text-teal-700 font-semibold">12.4s avg response speed</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold text-lg">
              ⏰
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pace Setting</span>
              <div className="text-2xl font-black text-amber-700">Adaptive L1</div>
              <p className="text-[11px] text-slate-600">Stress-free, zero time pressure</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-lg">
              ★
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter By Scenario:
        </span>
        {[
          { id: 'all', label: 'All 9 Games' },
          { id: 'daily', label: '🛒 Everyday Routine & Bazaar' },
          { id: 'memory', label: '🧠 Visual & Spatial Recall' },
          { id: 'attention', label: '👀 Focus & Detail Discrimination' },
          { id: 'verbal', label: '🗣️ Language, Sounds & Proverbs' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id as GameCategory)}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
              selectedCategory === tab.id
                ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Game Cards Grid with Real-World Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, idx) => {
          const Icon = game.icon;
          return (
            <ScrollReveal
              key={game.id}
              direction="up"
              delay={idx * 50}
              className="h-full"
            >
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between space-y-5 h-full relative group">
                
                <div className="space-y-3.5">
                  {/* Top Bar: Icon + Category Tag + Last Score */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${game.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                        {game.tag}
                      </span>
                      <span className="text-xs font-black text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                        Score: {game.lastPlayedScore}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {game.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {game.desc}
                    </p>
                  </div>

                  {/* Real-World Example & Elder Benefit Box */}
                  <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-start gap-1.5 text-xs font-bold text-slate-900">
                      <span className="text-amber-600 flex-shrink-0">🌟</span>
                      <span>Real-World Scenario:</span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold pl-5">
                      {game.realWorldScenario}
                    </p>
                    <p className="text-[11px] text-teal-800 font-medium pl-5 italic">
                      Why it helps: {game.realWorldBenefit}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 inline-flex">
                    <Award className="w-3.5 h-3.5" />
                    <span>{game.difficulty}</span>
                  </div>
                </div>

                {/* Actions: Audio Guide + Start Button */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <VoiceButton
                    textToRead={game.audioInstruction}
                    buttonLabel="Listen Instructions"
                    className="w-full text-center justify-center"
                  />

                  <Link
                    href={`/games/${game.id}`}
                    className="w-full py-3.5 px-5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-extrabold text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play This Real-World Quest</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Senior Encouragement & Safety Note Footer */}
      <ScrollReveal direction="up" delay={200}>
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Dignity & Calm-First Design</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">
              Cognitive Exercises Designed for Real Senior Life
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Scores are never penalized for slow response or errors. Our adaptive system automatically slows down and eases questions so that every daily exercise feels comfortable and rewarding.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-sm shadow-md transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>Return to Daily Routine</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
