"use client";

import Link from 'next/link';
import { Play, Sparkles, Brain, Shapes, Eye, ArrowRight, Award } from 'lucide-react';
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
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-3.5 py-1 rounded-full text-sm font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Daily Cognitive Quest</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Cognitive Wellness Games
          </h1>
          <p className="text-base text-slate-600 font-medium">
            Choose a game below. Difficulty automatically adapts to provide a calm, relaxing challenge.
          </p>
        </div>

        <VoiceButton
          textToRead="Here are your daily cognitive games: Memory Match, Sequence Memory, and Find the Different One. Tap any game to start playing."
          buttonLabel="Read Games List"
        />
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-7 border-3 border-slate-200 shadow-md hover:border-blue-500 hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-16 h-16 rounded-2xl ${game.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-9 h-9" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200">
                    {game.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {game.title}
                  </h2>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed">
                    {game.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                  <Award className="w-4 h-4" />
                  <span>{game.difficulty}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <VoiceButton
                  textToRead={game.audioInstruction}
                  buttonLabel="Instructions"
                  className="w-full text-center justify-center"
                />

                <Link
                  href={`/games/${game.id}`}
                  className="w-full py-4 px-6 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-black text-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Game</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement footer */}
      <div className="bg-slate-100 rounded-2xl p-6 border-2 border-slate-300 text-center space-y-1">
        <p className="text-lg font-bold text-slate-800">
          Remember: There is no penalty for mistakes.
        </p>
        <p className="text-base text-slate-600">
          Our adaptive system simply adjusts the pace and grid size to make sure you always feel comfortable.
        </p>
      </div>
    </div>
  );
}
