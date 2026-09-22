"use client";

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
  Award 
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';

export default function GamesHubPage() {
  const games = [
    {
      id: 'memory-match',
      title: 'Memory Match',
      desc: 'Flip and match pairs of colorful everyday icons. Gentle exercise for short-term visual recall.',
      icon: Shapes,
      color: 'bg-blue-600',
      tag: 'Visual Memory',
      difficulty: 'Adaptive (Level 1-3)',
      audioInstruction: 'Welcome to Memory Match. Flip two cards to find matching pairs. Take your time, there is no hurry.',
    },
    {
      id: 'sequence-memory',
      title: 'Sequence Memory',
      desc: 'Watch the light sequence flash and tap them back in order. Stimulates working memory and focus.',
      icon: Brain,
      color: 'bg-teal-600',
      tag: 'Pattern Recall',
      difficulty: 'Adaptive (Level 1-3)',
      audioInstruction: 'Welcome to Sequence Memory. Watch the colored tiles light up, then repeat the sequence in order.',
    },
    {
      id: 'different-one',
      title: 'Find the Different One',
      desc: 'Spot the single object that looks different from the others. Enhances attention to detail and reaction time.',
      icon: Eye,
      color: 'bg-amber-600',
      tag: 'Visual Attention',
      difficulty: 'Adaptive (Level 1-3)',
      audioInstruction: 'Welcome to Find the Different One. Look carefully at the icons and tap the one that does not match the rest.',
    },
    {
      id: 'grocery-basket',
      title: 'Grocery Basket Recall',
      desc: 'Remember items placed in your daily market basket. Encourages short-term verbal recall and everyday recognition.',
      icon: ShoppingBag,
      color: 'bg-emerald-600',
      tag: 'Verbal Memory',
      difficulty: 'Adaptive (Level 1-3)',
      audioInstruction: 'Welcome to Grocery Basket Recall. Memorize the items in your basket, then pick them out from the market shelves.',
    },
    {
      id: 'number-trail',
      title: 'Number Trail',
      desc: 'Follow the river stones by tapping numbers in rising order. Strengthens sequencing, mental agility, and motor control.',
      icon: Hash,
      color: 'bg-indigo-600',
      tag: 'Numerical Order',
      difficulty: 'Adaptive (Level 1-3)',
      audioInstruction: 'Welcome to Number Trail. Look at the numbered circles and tap them in order, starting from 1 upward.',
    },
    {
      id: 'pattern-match',
      title: 'Matrix Pattern Recall',
      desc: 'Observe illuminated squares on a grid and replicate where they were. Boosts spatial memory and orientation.',
      icon: Grid3X3,
      color: 'bg-purple-600',
      tag: 'Spatial Memory',
      difficulty: 'Adaptive (Level 1-3)',
      audioInstruction: 'Welcome to Matrix Pattern Recall. Watch the glowing squares on the grid, then tap those exact locations.',
    },
    {
      id: 'sound-word-match',
      title: 'Word & Sound Association',
      desc: 'Listen to the spoken prompt and choose the matching picture. Enhances auditory comprehension and semantic connections.',
      icon: Volume2,
      color: 'bg-rose-600',
      tag: 'Auditory & Semantic',
      difficulty: 'Adaptive (Level 1-3)',
      audioInstruction: 'Welcome to Word and Sound Association. Listen to the spoken cue or tap the sound button, then select the matching picture.',
    },
    {
      id: 'clock-reading',
      title: 'Clock Face Match',
      desc: 'Read the gentle analog clock hands and pick the correct daily routine time. Grounding for time orientation.',
      icon: Clock,
      color: 'bg-cyan-600',
      tag: 'Time Orientation',
      difficulty: 'Adaptive (Level 1-3)',
      audioInstruction: 'Welcome to Clock Face Match. Look at the clock hands and select the matching digital time.',
    },
    {
      id: 'rhyme-completion',
      title: 'Rhyme & Word Complete',
      desc: 'Complete classic comfort proverbs and rhymes with the missing word. Stimulates verbal fluency and recall.',
      icon: BookOpen,
      color: 'bg-violet-600',
      tag: 'Verbal Fluency',
      difficulty: 'Adaptive (Level 1-3)',
      audioInstruction: 'Welcome to Rhyme and Word Complete. Listen to the phrase and choose the word that completes the rhyme.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Cognitive Quests • 9 Games Available</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Cognitive Wellness Games
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
            Choose a game below. Difficulty automatically adapts to provide a calm, relaxing challenge tailored to your pace.
          </p>
        </div>

        <VoiceButton
          textToRead="Here are your 9 daily cognitive games: Memory Match, Sequence Memory, Find the Different One, Grocery Basket Recall, Number Trail, Matrix Pattern Recall, Word and Sound Association, Clock Face Match, and Rhyme Completion. Tap any game to begin."
          buttonLabel="Read Games List"
        />
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl ${game.color} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                    {game.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {game.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {game.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  <Award className="w-3.5 h-3.5" />
                  <span>{game.difficulty}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <VoiceButton
                  textToRead={game.audioInstruction}
                  buttonLabel="Instructions"
                  className="w-full text-center justify-center"
                />

                <Link
                  href={`/games/${game.id}`}
                  className="w-full py-3 px-5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Game</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement footer */}
      <div className="bg-slate-100/80 rounded-xl p-4 sm:p-5 border border-slate-200 text-center space-y-1">
        <p className="text-sm sm:text-base font-bold text-slate-800">
          Remember: There is no penalty for mistakes.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Our adaptive system simply adjusts the pace and grid size to make sure you always feel comfortable.
        </p>
      </div>
    </div>
  );
}
