"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  Award,
  CheckCircle2,
  HelpCircle,
  Volume2,
  Check,
  ShoppingBag,
  Grid3X3,
  Hash
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';

// Everyday senior friendly emojis
const ICONS_BANK = ['🍎', '🌸', '🚗', '☀️', '☕', '🐱', '🔔', '🏠', '🍇', '🎈', '⭐', '🌈'];

// Market grocery pool for Game 4
const GROCERY_ITEMS = [
  { name: 'Fresh Milk', icon: '🥛' },
  { name: 'Red Apples', icon: '🍎' },
  { name: 'Green Tea', icon: '🍵' },
  { name: 'Honey Pot', icon: '🍯' },
  { name: 'Wheat Bread', icon: '🍞' },
  { name: 'Yellow Bananas', icon: '🍌' },
  { name: 'Sweet Mango', icon: '🥭' },
  { name: 'Coconut Water', icon: '🥥' },
  { name: 'Fresh Carrots', icon: '🥕' },
];

// Sound / Word association pool for Game 7
const SOUND_PAIRS = [
  { prompt: 'Morning Temple Bell', soundText: 'Ding dong, temple bell ringing with peace', icon: '🔔', decoys: ['🚗', '☕', '🌸'] },
  { prompt: 'Warm Steaming Chai', soundText: 'Cup of hot aromatic cardamom tea poured gently', icon: '☕', decoys: ['🌧️', '🔔', '🍎'] },
  { prompt: 'Chirping Songbird', soundText: 'Sweet morning bird chirping in the garden', icon: '🐦', decoys: ['🚗', '🏠', '🍇'] },
  { prompt: 'Fresh Rainfall Drops', soundText: 'Calm pitter-patter sound of cooling raindrops', icon: '🌧️', decoys: ['☀️', '🔔', '🎈'] },
  { prompt: 'Bright Warm Sunshine', soundText: 'Warm golden sun shining high in the blue sky', icon: '☀️', decoys: ['🌙', '🌧️', '☕'] },
  { prompt: 'Comfortable Sweet Home', soundText: 'Peaceful home with loved ones and cozy warmth', icon: '🏠', decoys: ['🚗', '🍎', '⭐'] },
];

// Clock Face Times pool for Game 8
const CLOCK_QUESTIONS = [
  { hours: 7, minutes: 0, timeString: '7:00 AM', label: 'Morning Chai & Awakening', decoys: ['9:00 AM', '6:30 AM', '11:00 AM'] },
  { hours: 12, minutes: 30, timeString: '12:30 PM', label: 'Afternoon Nourishing Lunch', decoys: ['1:30 PM', '11:30 AM', '2:00 PM'] },
  { hours: 4, minutes: 0, timeString: '4:00 PM', label: 'Evening Garden Walk', decoys: ['3:00 PM', '5:30 PM', '6:00 PM'] },
  { hours: 9, minutes: 0, timeString: '9:00 PM', label: 'Night Rest & Sleep', decoys: ['8:30 PM', '10:00 PM', '7:00 PM'] },
  { hours: 8, minutes: 15, timeString: '8:15 AM', label: 'Morning Medicine & Breakfast', decoys: ['7:15 AM', '9:30 AM', '8:45 AM'] },
];

// Rhyme & Proverb pool for Game 9
const RHYME_QUESTIONS = [
  { 
    prefix: 'Early to bed and early to rise, makes a person healthy, wealthy, and...', 
    answer: 'Wise', 
    decoys: ['Strong', 'Bright', 'Kind'],
    hint: 'Rhymes with "Rise"'
  },
  { 
    prefix: 'A stitch in time saves...', 
    answer: 'Nine', 
    decoys: ['Five', 'Ten', 'All'],
    hint: 'Famous old saying for saving effort'
  },
  { 
    prefix: 'Laughter is the best...', 
    answer: 'Medicine', 
    decoys: ['Exercise', 'Song', 'Story'],
    hint: 'Heals the spirit and heart'
  },
  { 
    prefix: 'An apple a day keeps the doctor...', 
    answer: 'Away', 
    decoys: ['Happy', 'Near', 'Smiling'],
    hint: 'Rhymes with "Day"'
  },
  { 
    prefix: 'Where there is love, there is...', 
    answer: 'Peace', 
    decoys: ['Noise', 'Fear', 'Doubt'],
    hint: 'Calmness in the home'
  },
];

export default function GameArenaPage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params?.gameId as string;

  // Game Settings & Stats
  const [difficulty, setDifficulty] = useState(1);
  const [score, setScore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ==================== GAME 1: MEMORY MATCH STATE ====================
  const [cards, setCards] = useState<Array<{ id: number; icon: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // ==================== GAME 2: SEQUENCE MEMORY STATE ==================
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequenceIndex, setUserSequenceIndex] = useState<number>(0);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [activePad, setActivePad] = useState<number | null>(null);

  // ==================== GAME 3: DIFFERENT ONE STATE ====================
  const [differentRound, setDifferentRound] = useState<number>(1);
  const [differentOptions, setDifferentOptions] = useState<Array<{ id: number; icon: string; isOdd: boolean }>>([]);

  // ==================== GAME 4: GROCERY BASKET STATE ===================
  const [basketTargetItems, setBasketTargetItems] = useState<Array<{ name: string; icon: string }>>([]);
  const [basketOptions, setBasketOptions] = useState<Array<{ name: string; icon: string; selected: boolean }>>([]);
  const [isMemorizingBasket, setIsMemorizingBasket] = useState<boolean>(true);
  const [basketCountdown, setBasketCountdown] = useState<number>(6);

  // ==================== GAME 5: NUMBER TRAIL STATE =====================
  const [trailNumbers, setTrailNumbers] = useState<Array<{ num: number; x: number; y: number; tapped: boolean }>>([]);
  const [nextExpectedNumber, setNextExpectedNumber] = useState<number>(1);
  const [trailErrorFlash, setTrailErrorFlash] = useState<number | null>(null);

  // ==================== GAME 6: PATTERN MATCH STATE ====================
  const [matrixSize] = useState<number>(3); // 3x3
  const [matrixTargetCells, setMatrixTargetCells] = useState<number[]>([]);
  const [matrixSelectedCells, setMatrixSelectedCells] = useState<number[]>([]);
  const [isShowingMatrixPattern, setIsShowingMatrixPattern] = useState<boolean>(true);
  const [matrixCountdown, setMatrixCountdown] = useState<number>(4);

  // ==================== GAME 7: SOUND WORD MATCH STATE =================
  const [soundRound, setSoundRound] = useState<number>(1);
  const [currentSoundPrompt, setCurrentSoundPrompt] = useState<typeof SOUND_PAIRS[0] | null>(null);
  const [soundRoundOptions, setSoundRoundOptions] = useState<Array<{ icon: string; isCorrect: boolean }>>([]);

  // ==================== GAME 8: CLOCK READING STATE ====================
  const [clockRound, setClockRound] = useState<number>(1);
  const [currentClockQuestion, setCurrentClockQuestion] = useState<typeof CLOCK_QUESTIONS[0] | null>(null);
  const [clockOptions, setClockOptions] = useState<string[]>([]);

  // ==================== GAME 9: RHYME COMPLETION STATE =================
  const [rhymeRound, setRhymeRound] = useState<number>(1);
  const [currentRhymeQuestion, setCurrentRhymeQuestion] = useState<typeof RHYME_QUESTIONS[0] | null>(null);
  const [rhymeOptions, setRhymeOptions] = useState<string[]>([]);

  // Timer Tick
  useEffect(() => {
    if (gameFinished) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, gameFinished]);

  // Initial Game Setup
  useEffect(() => {
    initGame(difficulty);
  }, [gameId, difficulty]);

  const initGame = (diff: number) => {
    setGameFinished(false);
    setScore(null);
    setMistakes(0);
    setTotalAttempts(0);
    setStartTime(Date.now());
    setElapsedTime(0);

    if (gameId === 'memory-match') {
      // Level 1: 4 pairs (8 cards), Level 2: 6 pairs (12 cards), Level 3: 8 pairs (16 cards)
      const pairCount = diff === 1 ? 4 : diff === 2 ? 6 : 8;
      const selected = ICONS_BANK.slice(0, pairCount);
      const deck = [...selected, ...selected]
        .sort(() => Math.random() - 0.5)
        .map((icon, id) => ({ id, icon, flipped: false, matched: false }));
      setCards(deck);
      setFlippedCards([]);
    } else if (gameId === 'sequence-memory') {
      // Sequence of 3 (level 1), 4 (level 2), 5 (level 3)
      const length = diff === 1 ? 3 : diff === 2 ? 4 : 5;
      const newSeq = Array.from({ length }, () => Math.floor(Math.random() * 4));
      setSequence(newSeq);
      setUserSequenceIndex(0);
      playSequence(newSeq);
    } else if (gameId === 'different-one') {
      setupDifferentOneRound(diff, 1);
    } else if (gameId === 'grocery-basket') {
      setupGroceryBasket(diff);
    } else if (gameId === 'number-trail') {
      setupNumberTrail(diff);
    } else if (gameId === 'pattern-match') {
      setupPatternMatch(diff);
    } else if (gameId === 'sound-word-match') {
      setupSoundWordMatch(diff, 1);
    }
  };

  // ---------------- GAME 1 LOGIC: MEMORY MATCH ----------------
  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setTotalAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].icon === newCards[secondIdx].icon) {
        // Matched!
        setTimeout(() => {
          newCards[firstIdx].matched = true;
          newCards[secondIdx].matched = true;
          setCards([...newCards]);
          setFlippedCards([]);

          // Check if all matched
          if (newCards.every((c) => c.matched)) {
            finishGame({
              accuracy: Math.max(50, 100 - mistakes * 8),
              mistakes,
              totalAttempts: totalAttempts + 1,
            });
          }
        }, 500);
      } else {
        // Mismatch
        setMistakes((prev) => prev + 1);
        setTimeout(() => {
          newCards[firstIdx].flipped = false;
          newCards[secondIdx].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1100);
      }
    }
  };

  // ---------------- GAME 2 LOGIC: SEQUENCE MEMORY ----------------
  const playSequence = (seq: number[]) => {
    setIsShowingSequence(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < seq.length) {
        setActivePad(seq[step]);
        setTimeout(() => setActivePad(null), 600);
        step++;
      } else {
        clearInterval(interval);
        setIsShowingSequence(false);
      }
    }, 1000);
  };

  const handlePadClick = (padIndex: number) => {
    if (isShowingSequence || gameFinished) return;

    setTotalAttempts((prev) => prev + 1);
    if (padIndex === sequence[userSequenceIndex]) {
      // Correct step
      const nextIndex = userSequenceIndex + 1;
      setUserSequenceIndex(nextIndex);

      if (nextIndex === sequence.length) {
        // Successfully reproduced sequence!
        finishGame({
          accuracy: 100 - mistakes * 15,
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      }
    } else {
      // Mistake
      setMistakes((prev) => prev + 1);
      setActivePad(-1); // Flash red
      setTimeout(() => setActivePad(null), 400);
      if (mistakes >= 2) {
        finishGame({
          accuracy: 50,
          mistakes: mistakes + 1,
          totalAttempts: totalAttempts + 1,
        });
      }
    }
  };

  // ---------------- GAME 3 LOGIC: FIND THE DIFFERENT ONE ----------------
  const setupDifferentOneRound = (diff: number, roundNum: number) => {
    setDifferentRound(roundNum);
    const count = diff === 1 ? 4 : diff === 2 ? 6 : 8;
    const baseIcon = ICONS_BANK[(roundNum * 2) % ICONS_BANK.length];
    const oddIcon = ICONS_BANK[(roundNum * 2 + 1) % ICONS_BANK.length];
    const oddPosition = Math.floor(Math.random() * count);

    const opts = Array.from({ length: count }, (_, i) => ({
      id: i,
      icon: i === oddPosition ? oddIcon : baseIcon,
      isOdd: i === oddPosition,
    }));
    setDifferentOptions(opts);
  };

  const handleSelectOddOption = (isOdd: boolean) => {
    if (gameFinished) return;
    setTotalAttempts((prev) => prev + 1);

    if (isOdd) {
      if (differentRound >= 3) {
        finishGame({
          accuracy: Math.max(60, 100 - mistakes * 12),
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      } else {
        setupDifferentOneRound(difficulty, differentRound + 1);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  // ---------------- GAME 4 LOGIC: GROCERY BASKET RECALL ----------------
  const setupGroceryBasket = (diff: number) => {
    const targetCount = diff === 1 ? 3 : diff === 2 ? 4 : 5;
    const shuffled = [...GROCERY_ITEMS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, targetCount);
    setBasketTargetItems(targets);

    // Provide 6-8 choices on shelf
    const shelfPool = [...targets, ...shuffled.slice(targetCount, targetCount + 3)].sort(
      () => Math.random() - 0.5
    );
    setBasketOptions(shelfPool.map((item) => ({ ...item, selected: false })));

    setIsMemorizingBasket(true);
    setBasketCountdown(6);

    let count = 6;
    const cdInterval = setInterval(() => {
      count--;
      setBasketCountdown(count);
      if (count <= 0) {
        clearInterval(cdInterval);
        setIsMemorizingBasket(false);
      }
    }, 1000);
  };

  const toggleBasketItem = (name: string) => {
    if (isMemorizingBasket || gameFinished) return;
    setTotalAttempts((prev) => prev + 1);

    const isTarget = basketTargetItems.some((t) => t.name === name);
    const updated = basketOptions.map((opt) =>
      opt.name === name ? { ...opt, selected: !opt.selected } : opt
    );
    setBasketOptions(updated);

    if (!isTarget) {
      setMistakes((prev) => prev + 1);
    }

    const selectedTargetCount = updated.filter(
      (opt) => opt.selected && basketTargetItems.some((t) => t.name === opt.name)
    ).length;

    if (selectedTargetCount === basketTargetItems.length) {
      // Completed recall
      setTimeout(() => {
        finishGame({
          accuracy: Math.max(50, 100 - mistakes * 10),
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      }, 400);
    }
  };

  // ---------------- GAME 5 LOGIC: NUMBER TRAIL ----------------
  const setupNumberTrail = (diff: number) => {
    // Level 1: numbers 1 to 5, Level 2: 1 to 7, Level 3: 1 to 9
    const totalCount = diff === 1 ? 5 : diff === 2 ? 7 : 9;
    setNextExpectedNumber(1);

    // Pre-distributed positions with jitter to avoid strict grid
    const positions: Array<{ x: number; y: number }> = [];
    const cols = 3;
    for (let i = 0; i < totalCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = 18 + col * 32 + (Math.random() * 8 - 4);
      const y = 18 + row * 28 + (Math.random() * 8 - 4);
      positions.push({ x: Math.max(10, Math.min(85, x)), y: Math.max(10, Math.min(85, y)) });
    }

    // Shuffle positions so numbers appear randomly on screen
    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);

    const list = Array.from({ length: totalCount }, (_, i) => ({
      num: i + 1,
      x: shuffledPositions[i].x,
      y: shuffledPositions[i].y,
      tapped: false,
    }));

    setTrailNumbers(list);
  };

  const handleTrailNumberClick = (num: number) => {
    if (gameFinished) return;
    setTotalAttempts((prev) => prev + 1);

    if (num === nextExpectedNumber) {
      // Correct number
      const updated = trailNumbers.map((item) =>
        item.num === num ? { ...item, tapped: true } : item
      );
      setTrailNumbers(updated);
      const next = nextExpectedNumber + 1;
      setNextExpectedNumber(next);

      if (next > trailNumbers.length) {
        // Finished all numbers in order!
        setTimeout(() => {
          finishGame({
            accuracy: Math.max(60, 100 - mistakes * 10),
            mistakes,
            totalAttempts: totalAttempts + 1,
          });
        }, 400);
      }
    } else {
      // Wrong number clicked
      setMistakes((prev) => prev + 1);
      setTrailErrorFlash(num);
      setTimeout(() => setTrailErrorFlash(null), 500);
    }
  };

  // ---------------- GAME 6 LOGIC: MATRIX PATTERN RECALL ----------------
  const setupPatternMatch = (diff: number) => {
    // 3x3 grid (9 cells: 0 to 8)
    const litCount = diff === 1 ? 3 : diff === 2 ? 4 : 5;
    const allCells = Array.from({ length: 9 }, (_, i) => i);
    const chosen = [...allCells].sort(() => Math.random() - 0.5).slice(0, litCount);
    setMatrixTargetCells(chosen);
    setMatrixSelectedCells([]);
    setIsShowingMatrixPattern(true);
    setMatrixCountdown(4);

    let count = 4;
    const interval = setInterval(() => {
      count--;
      setMatrixCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsShowingMatrixPattern(false);
      }
    }, 1000);
  };

  const handleMatrixCellClick = (cellIdx: number) => {
    if (isShowingMatrixPattern || gameFinished) return;
    if (matrixSelectedCells.includes(cellIdx)) return;

    setTotalAttempts((prev) => prev + 1);
    const newSelected = [...matrixSelectedCells, cellIdx];
    setMatrixSelectedCells(newSelected);

    if (!matrixTargetCells.includes(cellIdx)) {
      setMistakes((prev) => prev + 1);
    }

    const allCorrectSelected = matrixTargetCells.every((c) => newSelected.includes(c));
    if (allCorrectSelected) {
      setTimeout(() => {
        finishGame({
          accuracy: Math.max(50, 100 - mistakes * 12),
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      }, 500);
    }
  };

  // ---------------- GAME 7 LOGIC: DAILY WORD & SOUND MATCH -------------
  const setupSoundWordMatch = (diff: number, roundNum: number) => {
    setSoundRound(roundNum);
    const promptItem = SOUND_PAIRS[(roundNum - 1) % SOUND_PAIRS.length];
    setCurrentSoundPrompt(promptItem);

    // Combine correct with decoys
    const options = [
      { icon: promptItem.icon, isCorrect: true },
      ...promptItem.decoys.slice(0, diff === 1 ? 3 : diff === 2 ? 5 : 5).map((icon) => ({
        icon,
        isCorrect: false,
      })),
    ].sort(() => Math.random() - 0.5);

    setSoundRoundOptions(options);

    // Speak the sound clue aloud via browser speech
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(promptItem.soundText);
        ut.rate = 0.85;
        window.speechSynthesis.speak(ut);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSoundOptionClick = (isCorrect: boolean) => {
    if (gameFinished) return;
    setTotalAttempts((prev) => prev + 1);

    if (isCorrect) {
      if (soundRound >= 3) {
        finishGame({
          accuracy: Math.max(60, 100 - mistakes * 12),
          mistakes,
          totalAttempts: totalAttempts + 1,
        });
      } else {
        setupSoundWordMatch(difficulty, soundRound + 1);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  // ---------------- FINISH & SAVE RESULT ----------------
  const finishGame = async (stats: { accuracy: number; mistakes: number; totalAttempts: number }) => {
    setGameFinished(true);
    setSubmitting(true);

    const gameTitlesMap: Record<string, string> = {
      'memory-match': 'Memory Match',
      'sequence-memory': 'Sequence Memory',
      'different-one': 'Find the Different One',
      'grocery-basket': 'Grocery Basket Recall',
      'number-trail': 'Number Trail',
      'pattern-match': 'Matrix Pattern Recall',
      'sound-word-match': 'Daily Word & Sound Match',
    };

    const payload = {
      gameId,
      gameTitle: gameTitlesMap[gameId] || 'Cognitive Quest',
      accuracy: Math.max(20, Math.min(100, stats.accuracy)),
      responseTimeSec: elapsedTime,
      expectedTimeSec: 25,
      mistakes: stats.mistakes,
      totalAttempts: stats.totalAttempts,
      currentDifficulty: difficulty,
    };

    try {
      const res = await fetch('/api/game-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      sessionStorage.setItem('lastGameResult', JSON.stringify(data));
      router.push('/results');
    } catch {
      router.push('/results');
    } finally {
      setSubmitting(false);
    }
  };

  const gameTitles: Record<string, { title: string; instruction: string }> = {
    'memory-match': {
      title: 'Memory Match',
      instruction: 'Tap two cards to flip them over. If the symbols match, they stay open. Find all matching pairs.',
    },
    'sequence-memory': {
      title: 'Sequence Memory',
      instruction: 'Watch carefully as the colored tiles illuminate. Once finished, tap the tiles in the exact same sequence.',
    },
    'different-one': {
      title: 'Find the Different One',
      instruction: 'Look at the group of symbols. One of them is different from all the others. Tap the different symbol.',
    },
    'grocery-basket': {
      title: 'Grocery Basket Recall',
      instruction: 'Memorize the items in your grocery basket while the timer counts down. Then tap those same items on the market shelf.',
    },
    'number-trail': {
      title: 'Number Trail',
      instruction: 'Follow the numbered river stones in rising order. Start by tapping number 1, then 2, and so on.',
    },
    'pattern-match': {
      title: 'Matrix Pattern Recall',
      instruction: 'Memorize the glowing squares on the grid before they fade. Then tap each square that lit up.',
    },
    'sound-word-match': {
      title: 'Daily Word & Sound Match',
      instruction: 'Listen to the spoken audio cue or tap the speaker button, then choose the picture that matches the description.',
    },
  };

  const currentInfo = gameTitles[gameId] || gameTitles['memory-match'];

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <Link
            href="/games"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 transition-colors border border-slate-300"
            aria-label="Back to Games"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Difficulty: Level {difficulty} (Adaptive)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-800">
            <Clock className="w-4 h-4 text-blue-700" />
            <span>{elapsedTime}s</span>
          </div>

          <button
            type="button"
            onClick={() => initGame(difficulty)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Senior Voice Instructions Card */}
      <div className="bg-blue-50 border border-blue-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-blue-950 font-medium leading-snug">
            {currentInfo.instruction}
          </p>
        </div>
        <VoiceButton
          textToRead={currentInfo.instruction}
          buttonLabel="Read Instructions"
          className="flex-shrink-0"
        />
      </div>

      {/* Main Game Stage */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-slate-200 shadow-lg min-h-[440px] flex flex-col items-center justify-center">
        {/* ===================== GAME 1 ARENA: MEMORY MATCH ===================== */}
        {gameId === 'memory-match' && (
          <div
            className={`grid gap-4 sm:gap-6 w-full max-w-2xl ${
              cards.length <= 8 ? 'grid-cols-4' : cards.length <= 12 ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-4'
            }`}
          >
            {cards.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(idx)}
                disabled={card.flipped || card.matched}
                className={`h-28 sm:h-36 rounded-2xl text-4xl sm:text-5xl font-bold flex items-center justify-center transition-all duration-300 shadow-md border-3 ${
                  card.matched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-90 scale-95'
                    : card.flipped
                    ? 'bg-amber-100 border-amber-400 text-slate-900 scale-105'
                    : 'bg-blue-700 hover:bg-blue-800 border-blue-900 text-white hover:scale-102'
                }`}
                aria-label={`Card ${idx + 1}`}
              >
                {card.flipped || card.matched ? card.icon : '❓'}
              </button>
            ))}
          </div>
        )}

        {/* ===================== GAME 2 ARENA: SEQUENCE MEMORY ===================== */}
        {gameId === 'sequence-memory' && (
          <div className="space-y-8 w-full max-w-md text-center">
            <div className="text-xl font-black text-slate-800">
              {isShowingSequence ? (
                <span className="text-blue-700 animate-pulse">👀 Memorize the light pattern...</span>
              ) : (
                <span className="text-teal-700">👉 Now tap the tiles in the same sequence!</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { id: 0, color: 'bg-blue-500', active: 'bg-blue-300 ring-8 ring-blue-300 scale-105' },
                { id: 1, color: 'bg-emerald-500', active: 'bg-emerald-300 ring-8 ring-emerald-300 scale-105' },
                { id: 2, color: 'bg-amber-500', active: 'bg-amber-300 ring-8 ring-amber-300 scale-105' },
                { id: 3, color: 'bg-rose-500', active: 'bg-rose-300 ring-8 ring-rose-300 scale-105' },
              ].map((pad) => {
                const isActive = activePad === pad.id;
                return (
                  <button
                    key={pad.id}
                    type="button"
                    disabled={isShowingSequence}
                    onClick={() => handlePadClick(pad.id)}
                    className={`h-36 sm:h-44 rounded-3xl shadow-lg border-4 border-slate-800/20 transition-all ${
                      pad.color
                    } ${isActive ? pad.active : 'opacity-85 hover:opacity-100 active:scale-95'}`}
                    aria-label={`Color tile ${pad.id + 1}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== GAME 3 ARENA: DIFFERENT ONE ===================== */}
        {gameId === 'different-one' && (
          <div className="space-y-6 w-full max-w-xl text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-950 px-4 py-1.5 rounded-full font-bold text-base">
              <span>Round {differentRound} of 3</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Which one is different?
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
              {differentOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOddOption(opt.isOdd)}
                  className="h-32 sm:h-36 bg-slate-50 hover:bg-amber-50 border-3 border-slate-300 hover:border-amber-500 rounded-3xl text-5xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                  aria-label="Selection option"
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===================== GAME 4 ARENA: GROCERY BASKET ===================== */}
        {gameId === 'grocery-basket' && (
          <div className="space-y-8 w-full max-w-2xl text-center">
            {isMemorizingBasket ? (
              <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-950 px-4 py-1.5 rounded-full font-bold text-sm">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span>Memorize Items: Closing in {basketCountdown}s</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  What is in your market basket?
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  {basketTargetItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-emerald-50 border-3 border-emerald-400 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2 min-w-[130px] shadow-md"
                    >
                      <span className="text-5xl">{item.icon}</span>
                      <span className="text-sm font-bold text-emerald-950">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-950 px-4 py-1.5 rounded-full font-bold text-sm">
                  <span>Tap all items that were in your basket</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Select your basket items:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  {basketOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleBasketItem(opt.name)}
                      className={`p-4 rounded-2xl border-3 flex flex-col items-center gap-2 transition-all shadow-sm ${
                        opt.selected
                          ? 'bg-emerald-100 border-emerald-500 scale-105'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-300'
                      }`}
                    >
                      <span className="text-4xl">{opt.icon}</span>
                      <span className="text-sm font-bold text-slate-900">{opt.name}</span>
                      {opt.selected && (
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== GAME 5 ARENA: NUMBER TRAIL ===================== */}
        {gameId === 'number-trail' && (
          <div className="w-full max-w-xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-950 px-4 py-1.5 rounded-full font-bold text-sm">
              <Hash className="w-4 h-4 text-indigo-700" />
              <span>Next Number to Tap: <strong className="text-lg text-indigo-800 ml-1">{nextExpectedNumber}</strong></span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Tap the stones in numerical order from 1 to {trailNumbers.length}.
            </p>

            <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-sky-50 to-indigo-50/40 rounded-3xl border-3 border-indigo-200 overflow-hidden shadow-inner mt-2">
              {trailNumbers.map((stone) => {
                const isTapped = stone.tapped;
                const isFlash = trailErrorFlash === stone.num;

                return (
                  <button
                    key={stone.num}
                    type="button"
                    onClick={() => handleTrailNumberClick(stone.num)}
                    disabled={isTapped}
                    style={{
                      left: `${stone.x}%`,
                      top: `${stone.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full font-black text-xl sm:text-2xl shadow-lg border-3 transition-all flex items-center justify-center ${
                      isTapped
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 opacity-60 scale-90'
                        : isFlash
                        ? 'bg-rose-500 border-rose-700 text-white animate-bounce'
                        : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-800 text-white hover:scale-110 active:scale-95'
                    }`}
                    aria-label={`Number ${stone.num}`}
                  >
                    {isTapped ? '✓' : stone.num}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== GAME 6 ARENA: MATRIX PATTERN RECALL ===================== */}
        {gameId === 'pattern-match' && (
          <div className="space-y-6 w-full max-w-md text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-950 px-4 py-1.5 rounded-full font-bold text-sm">
              <Grid3X3 className="w-4 h-4 text-purple-700" />
              <span>
                {isShowingMatrixPattern
                  ? `Memorize glowing squares: ${matrixCountdown}s`
                  : 'Tap all squares that were glowing!'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              {isShowingMatrixPattern ? 'Watch the Pattern' : 'Where were the glowing tiles?'}
            </h3>

            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-100 rounded-3xl border-3 border-slate-300 max-w-xs mx-auto">
              {Array.from({ length: 9 }, (_, idx) => {
                const isTarget = matrixTargetCells.includes(idx);
                const isSelected = matrixSelectedCells.includes(idx);

                let cellBg = 'bg-white border-slate-300';
                if (isShowingMatrixPattern && isTarget) {
                  cellBg = 'bg-purple-600 border-purple-800 ring-4 ring-purple-300 text-white';
                } else if (!isShowingMatrixPattern && isSelected) {
                  cellBg = isTarget
                    ? 'bg-emerald-500 border-emerald-700 text-white ring-4 ring-emerald-200'
                    : 'bg-rose-500 border-rose-700 text-white';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isShowingMatrixPattern}
                    onClick={() => handleMatrixCellClick(idx)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 shadow-md transition-all flex items-center justify-center text-3xl font-bold ${cellBg} ${
                      !isShowingMatrixPattern ? 'hover:scale-105 active:scale-95' : ''
                    }`}
                    aria-label={`Grid tile ${idx + 1}`}
                  >
                    {!isShowingMatrixPattern && isSelected && (isTarget ? '✓' : '✗')}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== GAME 7 ARENA: DAILY WORD & SOUND MATCH ===================== */}
        {gameId === 'sound-word-match' && currentSoundPrompt && (
          <div className="space-y-6 w-full max-w-xl text-center">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-950 px-4 py-1.5 rounded-full font-bold text-sm">
              <Volume2 className="w-4 h-4 text-rose-700" />
              <span>Question {soundRound} of 3</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                &ldquo;{currentSoundPrompt.prompt}&rdquo;
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Tap the speaker to hear the description again, then choose the picture.
              </p>
            </div>

            <div className="flex justify-center pt-1">
              <VoiceButton
                textToRead={currentSoundPrompt.soundText}
                buttonLabel="Listen to Cue"
                className="scale-110"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {soundRoundOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSoundOptionClick(opt.isCorrect)}
                  className="h-32 sm:h-36 bg-slate-50 hover:bg-rose-50 border-3 border-slate-300 hover:border-rose-400 rounded-3xl text-5xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                  aria-label="Selection option"
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {submitting && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl border-4 border-blue-600">
            <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-2xl font-black text-slate-900">Analyzing Your Rhythm...</h3>
            <p className="text-lg text-slate-600 font-medium">
              Calculating cognitive performance score and adaptive difficulty adjustment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

