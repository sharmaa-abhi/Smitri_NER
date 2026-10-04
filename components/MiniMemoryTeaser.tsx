"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, RotateCcw, Trophy, CheckCircle2, ArrowRight, Timer } from "lucide-react";
import { playChime } from "@/lib/audioPrompts";
import { useLanguage } from "@/lib/i18n";

interface TeaserCard {
  id: number;
  symbol: string;
  name: string;
  matched: boolean;
}

const CARDS_DATA = [
  { symbol: "🍵", name: "Assam Tea (চাহ পাত)" },
  { symbol: "🪷", name: "Lotus Flower (পদুম)" },
  { symbol: "🍵", name: "Assam Tea (চাহ পাত)" },
  { symbol: "🪷", name: "Lotus Flower (পদুম)" },
];

export default function MiniMemoryTeaser() {
  const { t } = useLanguage();
  const [cards, setCards] = useState<TeaserCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Initialize or reset game
  const resetGame = () => {
    // Shuffle cards
    const shuffled = [...CARDS_DATA]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        symbol: item.symbol,
        name: item.name,
        matched: false,
      }));

    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedCount(0);
    setMoves(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    resetGame();
  }, []);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (startTime && !isCompleted) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  const handleCardClick = (index: number) => {
    if (cards[index].matched || flippedIndices.includes(index) || flippedIndices.length === 2) {
      return;
    }

    // Start timer on first flip
    if (!startTime) {
      setStartTime(Date.now());
      playChime("start");
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // Matched!
        playChime("success");
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === firstIdx || i === secondIdx ? { ...card, matched: true } : card
            )
          );
          setFlippedIndices([]);
          setMatchedCount((prev) => {
            const nextCount = prev + 1;
            if (nextCount === 2) {
              setIsCompleted(true);
            }
            return nextCount;
          });
        }, 400);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#042420] via-[#06342E] to-[#0B534B] text-white rounded-3xl p-6 sm:p-10 border border-[#127267]/40 shadow-xl relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0B534B]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header Badge & Title */}
        <div className="text-center space-y-2.5 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#A7F3D0] text-xs font-bold border border-white/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#A7F3D0]" />
            <span>{t("Quick Senior Brain Spark") || "Interactive Teaser • No Login Required"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            {t("15-Second Mini Memory Challenge") || "15-Second Memory Spark"}
          </h2>
          <p className="text-xs sm:text-sm text-[#D5DFDC] max-w-xl mx-auto font-medium">
            {t("Tap 2 matching cards to awaken recall") || "Tap two cards to find matching pairs of cultural symbols. See how quickly your visual recall activates!"}
          </p>
        </div>

        {/* Game Arena & Cards */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-7 max-w-xl mx-auto">
          {/* Status Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-xs sm:text-sm font-bold text-[#D5DFDC]">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Timer className="w-3.5 h-3.5 text-[#A7F3D0]" />
              <span>{t("Time")}: <strong className="text-white font-mono">{elapsedSeconds}s</strong></span>
            </div>
            <div className="text-[#D5DFDC]">
              {t("Moves")}: <strong className="text-white font-mono">{moves}</strong>
            </div>
            <button
              type="button"
              onClick={resetGame}
              className="inline-flex items-center gap-1 text-[#D5DFDC] hover:text-white transition-colors"
              title="Restart teaser"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-xs">{t("Reset") || "Reset"}</span>
            </button>
          </div>

          {/* Cards Grid */}
          {!isCompleted ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-3">
              {cards.map((card, idx) => {
                const isFlipped = flippedIndices.includes(idx) || card.matched;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleCardClick(idx)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-3 text-center transition-all duration-300 transform select-none border-2 ${
                      card.matched
                        ? "bg-[#10B981]/25 border-[#10B981] scale-95 shadow-sm"
                        : isFlipped
                        ? "bg-white text-[#111615] border-white scale-102 shadow-lg"
                        : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-[#10B981] active:scale-95"
                    }`}
                    aria-label={`Card ${idx + 1}`}
                  >
                    {isFlipped ? (
                      <div className="animate-in zoom-in-75 duration-200">
                        <span className="text-4xl sm:text-5xl block mb-1">{card.symbol}</span>
                        <span className="text-[10px] font-bold text-[#111615] line-clamp-1">
                          {t(card.name)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#A7F3D0]/70 group-hover:text-[#A7F3D0]">
                        <span className="text-2xl font-black mb-1">?</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider">Tap</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Celebration Screen */
            <div className="text-center py-6 px-4 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#10B981] to-[#D97706] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#10B981]/20 animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {t("Congratulations! Recall Sparked!") || "Sharp Reflexes!"}
                </h3>
                <p className="text-xs sm:text-sm text-[#A7F3D0]">
                  {t("Moves")}: <strong className="text-white">{moves}</strong> • {t("Time")}: <strong className="text-white">{elapsedSeconds}s</strong>
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetGame}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t("Play Again") || "Play Again"}</span>
                </button>
                <Link
                  href="/games"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{t("Play Full Games") || "Play All 9 Full Games"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          <div className="text-center pt-3 text-[11px] text-[#D5DFDC] font-medium">
            💡 Full platform includes 9 adaptive games with audio narration in 8 regional dialects.
          </div>
        </div>
      </div>
    </section>
  );
}
