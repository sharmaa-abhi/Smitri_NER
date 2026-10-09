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
  Filter, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  Layers
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';
import { useLanguage } from '@/lib/i18n';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';

type GameCategory = 'all' | 'daily' | 'memory' | 'attention' | 'verbal';

export default function GamesHubPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');

  const games = [
    {
      id: 'grocery-basket',
      title: 'Grocery Basket Recall',
      desc: 'Remember items placed in your daily market basket. Stimulates short-term verbal recall and everyday grocery shopping recognition.',
      icon: ShoppingBag,
      color: 'bg-[#10B981]',
      category: 'daily',
      tag: 'Everyday Market Recall',
      difficulty: '3 Unique Levels (Easy • Medium • Advanced)',
      realWorldScenario: 'Weekly Local Bazaar & Vegetable Shopping List',
      realWorldBenefit: 'Helps elderly navigate market shopping without forgetting essentials',
      lastPlayedScore: 82,
      audioInstruction: 'Welcome to Grocery Basket Recall. Memorize the items in your basket, then pick them out from the market shelves. Level 1 starts with 3 staples, Level 2 has 4 recipe items, and Level 3 features 5 festive mandi ingredients.',
    },
    {
      id: 'clock-reading',
      title: 'Clock Face Match',
      desc: 'Read gentle analog clock hands and pick the correct daily routine moment. Grounding for time orientation, prayer, and meal timings.',
      icon: Clock,
      color: 'bg-[#0B534B]',
      category: 'daily',
      tag: 'Daily Routine & Time',
      difficulty: '3 Unique Levels (Easy • Medium • Advanced)',
      realWorldScenario: 'Timetable for Morning Puja, Medicine & Doctor Visits',
      realWorldBenefit: 'Reinforces daily temporal awareness and appointment punctuality',
      lastPlayedScore: 92,
      audioInstruction: 'Welcome to Clock Face Match. Look at the clock hands and select the matching routine time. Level 1 covers whole hours, Level 2 half and quarter hours, and Level 3 tests 5-minute precision.',
    },
    {
      id: 'different-one',
      title: 'Find the Different One',
      desc: 'Spot the single object that looks different from the others. Enhances attention to detail and sharpens eye-for-detail.',
      icon: Eye,
      color: 'bg-[#D97706]',
      category: 'attention',
      tag: 'Visual Attention',
      difficulty: '3 Unique Levels (Easy • Medium • Advanced)',
      realWorldScenario: 'Spotting Expired Medicine vs Safe Medicine Labels',
      realWorldBenefit: 'Prevents medication mix-ups by training visual discrimination',
      lastPlayedScore: 88,
      audioInstruction: 'Welcome to Find the Different One. Look carefully at the icons and tap the one that does not match the rest. Level 1 has 4 cards with category differences, Level 2 has 6 cards with color shifts, and Level 3 has 9 cards with micro-detail scans.',
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      desc: 'Flip and match pairs of colorful everyday icons. Gentle exercise for short-term visual recall and object association.',
      icon: Shapes,
      color: 'bg-[#0B534B]',
      category: 'memory',
      tag: 'Visual Memory',
      difficulty: '3 Unique Levels (Easy • Medium • Advanced)',
      realWorldScenario: 'Finding Household Items & Kitchen Utensils',
      realWorldBenefit: 'Strengthens recall of where spectacles, keys, and cups are kept',
      lastPlayedScore: 84,
      audioInstruction: 'Welcome to Memory Match. Flip two cards to find matching pairs. Level 1 has 8 cards, Level 2 has 12 cards, and Level 3 has a full 16-card master matrix.',
    },
    {
      id: 'number-trail',
      title: 'Number Trail',
      desc: 'Follow river stones by tapping numbers in rising order. Strengthens mental sequencing, passbook checks, and motor agility.',
      icon: Hash,
      color: 'bg-[#10B981]',
      category: 'attention',
      tag: 'Numerical Order',
      difficulty: '3 Unique Levels (Easy • Medium • Advanced)',
      realWorldScenario: 'Counting Currency Rupee Notes & Reading Bank Passbooks',
      realWorldBenefit: 'Maintains financial numeracy and sequential coordination',
      lastPlayedScore: 79,
      audioInstruction: 'Welcome to Number Trail. Look at the numbered river stones and tap them in order starting from 1. Level 1 has 5 guided stones, Level 2 has 8 stones, and Level 3 has 12 stones.',
    },
    {
      id: 'sound-word-match',
      title: 'Daily Word & Sound Match',
      desc: 'Listen to spoken prompts and choose the matching picture. Enhances auditory comprehension and household sound awareness.',
      icon: Volume2,
      color: 'bg-[#D97706]',
      category: 'verbal',
      tag: 'Auditory & Semantic',
      difficulty: '3 Unique Levels (Easy • Medium • Advanced)',
      realWorldScenario: 'Household Safety Sounds (Doorbell, Whistle, Phone Ring)',
      realWorldBenefit: 'Sharpens auditory processing and environmental awareness',
      lastPlayedScore: 86,
      audioInstruction: 'Welcome to Daily Word and Sound Match. Listen to the audio cue, then select the matching picture. Level 1 features clear home sounds, Level 2 kitchen and safety alerts, and Level 3 rich cultural scenes.',
    },
    {
      id: 'sequence-memory',
      title: 'Sequence Memory',
      desc: 'Watch the chime sequence flash and tap them back in order. Stimulates working memory and light perception.',
      icon: Brain,
      color: 'bg-[#0B534B]',
      category: 'memory',
      tag: 'Pattern Recall',
      difficulty: '3 Unique Levels (Easy • Medium • Advanced)',
      realWorldScenario: 'Remembering Appliance Buttons & Traffic Signals',
      realWorldBenefit: 'Boosts working memory capacity for multi-step home tasks',
      lastPlayedScore: 75,
      audioInstruction: 'Welcome to Sequence Memory. Watch the chime tiles light up, then repeat the sequence in order. Level 1 has 3 steps, Level 2 has 5 steps, and Level 3 features 6 chime pads with 6 musical tones.',
    },
    {
      id: 'pattern-match',
      title: 'Matrix Pattern Recall',
      desc: 'Observe illuminated squares on a grid and replicate where they were. Boosts spatial memory and room navigation.',
      icon: Grid3X3,
      color: 'bg-[#10B981]',
      category: 'memory',
      tag: 'Spatial Memory',
      difficulty: '3 Unique Levels (Easy • Medium • Advanced)',
      realWorldScenario: 'Home Room Layout & Furniture Placement Spatial Awareness',
      realWorldBenefit: 'Reduces disorientation and helps spatial stability at home',
      lastPlayedScore: 80,
      audioInstruction: 'Welcome to Matrix Pattern Recall. Watch the glowing squares on the grid, then tap those exact locations. Level 1 is a 3x3 grid with 3 tiles, Level 2 has 5 tiles, and Level 3 expands to a 4x4 grid with 16 tiles.',
    },
    {
      id: 'rhyme-completion',
      title: 'Rhyme & Proverb Complete',
      desc: 'Complete classic comfort proverbs and rhymes with the missing word. Stimulates linguistic recall and conversational confidence.',
      icon: BookOpen,
      color: 'bg-[#0B534B]',
      category: 'verbal',
      tag: 'Verbal Fluency',
      difficulty: '3 Unique Levels (Easy • Medium • Advanced)',
      realWorldScenario: 'Traditional Storytelling & Cultural Proverbs with Grandchildren',
      realWorldBenefit: 'Maintains rich vocabulary and social communication joy',
      lastPlayedScore: 90,
      audioInstruction: 'Welcome to Rhyme and Proverb Complete. Listen to the phrase and choose the missing word. Level 1 features folk rhymes, Level 2 wisdom proverbs, and Level 3 deep poetic idioms.',
    },
  ];

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(g => g.category === selectedCategory);

  const voiceSummary = `Welcome to the Cognitive Games Hub. Every single game now features 3 unique levels: Level 1 Easy, Level 2 Medium, and Level 3 Advanced. Each level brings distinct mechanics, expanded grids, and tailored cognitive stimuli. You can pick your desired level directly on any game card.`;

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Game Hub Description & Voice Reader */}
      <ScrollReveal direction="down">
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#D5DFDC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E6F4F1] text-[#0B534B] px-3.5 py-1 rounded-full text-xs font-bold border border-[#0B534B]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Real-World Cognitive Gaming Hub • 9 Scenarios • 3 Unique Levels Each</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111615] tracking-tight">
              {t("games_title") || "Games Dashboard & Everyday Quests"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6A66] font-medium max-w-2xl leading-relaxed">
              Every game features at least 3 distinct, handcrafted levels — Easy (Level 1), Medium (Level 2), and Advanced (Level 3) — each with unique mechanics, grids, timers, and real-world elder scenarios.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <VoiceButton
              textToRead={voiceSummary}
              buttonLabel={t("Read Instructions") || "Read Guide"}
            />
            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-[#F6F8F7] hover:bg-[#E6F4F1] text-[#0B534B] font-bold text-xs sm:text-sm rounded-xl border border-[#D5DFDC] transition-colors"
            >
              {t("Back to Dashboard") || "Back to Dashboard"}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* 3-Level Tier Guide Banner */}
      <ScrollReveal direction="up" delay={50}>
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D5DFDC] shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0B534B]" />
            <h2 className="text-sm sm:text-base font-extrabold text-[#111615]">
              3 Unique Difficulty Tiers on All Games
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="bg-[#ECFDF5] border border-[#10B981]/30 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white bg-[#10B981]">
                  Level 1 • Easy
                </span>
                <span className="text-xs font-bold text-[#059669]">Gentle & Familiar</span>
              </div>
              <p className="text-xs text-[#065F46] font-medium leading-relaxed pt-1">
                Relaxed pacing, generous hints, fewer items, high visual contrast, and step-by-step guidance.
              </p>
            </div>

            <div className="bg-[#FFFBEB] border border-[#D97706]/30 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white bg-[#D97706]">
                  Level 2 • Medium
                </span>
                <span className="text-xs font-bold text-[#B45309]">Balanced Practice</span>
              </div>
              <p className="text-xs text-[#78350F] font-medium leading-relaxed pt-1">
                Standard everyday rhythm, moderate options, subtle category shifts, and realistic timeframes.
              </p>
            </div>

            <div className="bg-[#FEF2F2] border border-[#DC2626]/30 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white bg-[#DC2626]">
                  Level 3 • Advanced
                </span>
                <span className="text-xs font-bold text-[#B91C1C]">Master Agility</span>
              </div>
              <p className="text-xs text-[#991B1B] font-medium leading-relaxed pt-1">
                Expanded grids (4x4 matrix, 6 chime pads, 12 river stones), 5-minute clock angles, and multi-sensory scenes.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Real-World Game Analytics Bar */}
      <ScrollReveal direction="up" delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#042420] to-[#0B534B] text-white p-5 rounded-2xl shadow-md border border-[#0B534B] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">Consistency Streak</span>
              <div className="text-3xl font-black">7 Days 🔥</div>
              <p className="text-[11px] text-[#E6F4F1]/90">Played daily without missing</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center font-bold text-xl">
              🎯
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D5DFDC] shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A6A66]">Overall Accuracy</span>
              <div className="text-3xl font-black text-[#10B981]">88%</div>
              <p className="text-[11px] text-[#5A6A66]">Across all 9 real-life games</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#047857] border border-[#10B981]/30 flex items-center justify-center font-bold text-lg">
              ✓
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D5DFDC] shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A6A66]">Levels Available</span>
              <div className="text-2xl font-black text-[#111615]">27 Levels</div>
              <p className="text-[11px] text-[#0B534B] font-semibold">3 Unique per each game</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] text-[#0B534B] border border-[#0B534B]/20 flex items-center justify-center font-bold text-lg">
              ⚡
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D5DFDC] shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A6A66]">Adaptive Engine</span>
              <div className="text-2xl font-black text-[#D97706]">Active</div>
              <p className="text-[11px] text-[#5A6A66]">Auto-recommends next tier</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] text-[#B45309] border border-[#D97706]/30 flex items-center justify-center font-bold text-lg">
              ★
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#5A6A66] flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5 text-[#0B534B]" /> Filter By Scenario:
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
                ? 'bg-[#0B534B] text-white border-[#08433C] shadow-sm'
                : 'bg-white text-[#5A6A66] border-[#D5DFDC] hover:bg-[#F6F8F7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, idx) => {
          const Icon = game.icon;
          const levelConfigs = GAME_LEVEL_CONFIG[game.id];

          return (
            <ScrollReveal
              key={game.id}
              direction="up"
              delay={idx * 40}
              className="h-full"
            >
              <div className="bg-white rounded-3xl p-6 border border-[#D5DFDC] shadow-sm hover:border-[#0B534B] hover:shadow-md transition-all flex flex-col justify-between space-y-5 h-full relative group">
                
                <div className="space-y-3.5">
                  {/* Top Bar: Icon + Category Tag + Last Score */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${game.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#F6F8F7] text-[#5A6A66] px-2.5 py-1 rounded-full border border-[#D5DFDC]">
                        {game.tag}
                      </span>
                      <span className="text-xs font-black text-[#0B534B] bg-[#E6F4F1] border border-[#0B534B]/20 px-2 py-0.5 rounded-md">
                        Score: {game.lastPlayedScore}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-extrabold text-[#111615] group-hover:text-[#0B534B] transition-colors">
                      {game.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5A6A66] font-medium leading-relaxed">
                      {game.desc}
                    </p>
                  </div>

                  {/* 3 Unique Levels Quick Launch Row */}
                  <div className="bg-[#FAFCFB] rounded-2xl p-3 border border-[#D5DFDC] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0B534B] flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#D97706]" /> 3 Unique Levels:
                      </span>
                      <span className="text-[10px] text-[#5A6A66] font-bold">Pick your tier</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <Link
                        href={`/games/${game.id}?level=1`}
                        className="py-1.5 px-2 bg-white hover:bg-[#ECFDF5] border border-[#10B981]/40 hover:border-[#10B981] rounded-xl text-center transition-all group/btn flex flex-col items-center"
                        title={levelConfigs?.[1]?.description || 'Level 1'}
                      >
                        <span className="text-[11px] font-black text-[#065F46] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Easy
                        </span>
                        <span className="text-[9px] text-[#5A6A66] truncate max-w-full">
                          {levelConfigs?.[1]?.badge.split('(')[1]?.replace(')', '') || 'Level 1'}
                        </span>
                      </Link>

                      <Link
                        href={`/games/${game.id}?level=2`}
                        className="py-1.5 px-2 bg-white hover:bg-[#FFFBEB] border border-[#D97706]/40 hover:border-[#D97706] rounded-xl text-center transition-all group/btn flex flex-col items-center"
                        title={levelConfigs?.[2]?.description || 'Level 2'}
                      >
                        <span className="text-[11px] font-black text-[#B45309] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#D97706]" /> Medium
                        </span>
                        <span className="text-[9px] text-[#5A6A66] truncate max-w-full">
                          {levelConfigs?.[2]?.badge.split('(')[1]?.replace(')', '') || 'Level 2'}
                        </span>
                      </Link>

                      <Link
                        href={`/games/${game.id}?level=3`}
                        className="py-1.5 px-2 bg-white hover:bg-[#FEF2F2] border border-[#DC2626]/40 hover:border-[#DC2626] rounded-xl text-center transition-all group/btn flex flex-col items-center"
                        title={levelConfigs?.[3]?.description || 'Level 3'}
                      >
                        <span className="text-[11px] font-black text-[#B91C1C] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#DC2626]" /> Adv
                        </span>
                        <span className="text-[9px] text-[#5A6A66] truncate max-w-full">
                          {levelConfigs?.[3]?.badge.split('(')[1]?.replace(')', '') || 'Level 3'}
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Real-World Scenario Box */}
                  <div className="bg-[#F6F8F7] rounded-2xl p-3 border border-[#D5DFDC] space-y-1">
                    <div className="flex items-start gap-1.5 text-xs font-bold text-[#111615]">
                      <span className="text-[#D97706] flex-shrink-0">🌟</span>
                      <span>Everyday Routine:</span>
                    </div>
                    <p className="text-xs text-[#5A6A66] font-semibold pl-5">
                      {game.realWorldScenario}
                    </p>
                  </div>
                </div>

                {/* Actions: Audio Guide + Start Button */}
                <div className="space-y-2.5 pt-2 border-t border-[#D5DFDC]/60">
                  <VoiceButton
                    textToRead={game.audioInstruction}
                    buttonLabel="Listen Instructions"
                    className="w-full text-center justify-center"
                  />

                  <Link
                    href={`/games/${game.id}`}
                    className="w-full py-3.5 px-5 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-extrabold text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Quest (Choose Level)</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Senior Encouragement & Safety Note Footer */}
      <ScrollReveal direction="up" delay={150}>
        <div className="bg-gradient-to-r from-[#042420] to-[#0B534B] text-white rounded-3xl p-6 sm:p-7 border border-[#0B534B]/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-[#F59E0B] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Dignity & Calm-First Design</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">
              Cognitive Exercises Designed for Real Senior Life
            </h3>
            <p className="text-xs sm:text-sm text-[#E6F4F1]/90 max-w-2xl leading-relaxed">
              Scores are never penalized for slow response or errors. Players can start at Easy (Level 1) and advance at their own leisure to Medium and Advanced tiers.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>Return to Daily Routine</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
