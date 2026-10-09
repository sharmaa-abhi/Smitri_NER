import { DifficultyLevel } from '@/types/games';

export const ICONS_BANK = ['🍎', '🌸', '🚗', '☀️', '☕', '🐱', '🔔', '🏠', '🍇', '🎈', '⭐', '🌈', '🔑', '🌙', '👓', '📚'];

export const ICONS_BANK_BY_LEVEL: Record<DifficultyLevel, string[]> = {
  1: ['🍎', '🌸', '🚗', '☀️'], // 4 pairs = 8 cards (Easy)
  2: ['🍎', '🌸', '🚗', '☀️', '☕', '🔔'], // 6 pairs = 12 cards (Medium)
  3: ['🍎', '🌸', '🚗', '☀️', '☕', '🔔', '🏠', '⭐'], // 8 pairs = 16 cards (Advanced)
};

// Grocery Market Items per Difficulty Level
export const GROCERY_ITEMS_BY_LEVEL: Record<DifficultyLevel, Array<{ name: string; icon: string }>> = {
  1: [
    { name: 'Fresh Milk', icon: '🥛' },
    { name: 'Red Apples', icon: '🍎' },
    { name: 'Wheat Bread', icon: '🍞' },
    { name: 'Yellow Bananas', icon: '🍌' },
    { name: 'Fresh Curd', icon: '🥣' },
    { name: 'Green Tea', icon: '🍵' },
  ],
  2: [
    { name: 'Fresh Milk', icon: '🥛' },
    { name: 'Red Apples', icon: '🍎' },
    { name: 'Wheat Bread', icon: '🍞' },
    { name: 'Green Tea', icon: '🍵' },
    { name: 'Honey Pot', icon: '🍯' },
    { name: 'Yellow Bananas', icon: '🍌' },
    { name: 'Sweet Mango', icon: '🥭' },
    { name: 'Fresh Carrots', icon: '🥕' },
    { name: 'Coconut Water', icon: '🥥' },
  ],
  3: [
    { name: 'Pure Cow Ghee', icon: '🧈' },
    { name: 'Green Cardamom', icon: '🌾' },
    { name: 'Sweet Mango', icon: '🥭' },
    { name: 'Honey Pot', icon: '🍯' },
    { name: 'Almonds & Nuts', icon: '🥜' },
    { name: 'Fresh Mint Leaves', icon: '🌿' },
    { name: 'Coconut Water', icon: '🥥' },
    { name: 'Red Apples', icon: '🍎' },
    { name: 'Fresh Milk', icon: '🥛' },
    { name: 'Spiced Ginger', icon: '🫚' },
    { name: 'Wheat Bread', icon: '🍞' },
    { name: 'Green Tea', icon: '🍵' },
  ],
};

// Backwards compatibility
export const GROCERY_ITEMS = GROCERY_ITEMS_BY_LEVEL[2];

// Sound & Word Match per Difficulty Level
export interface SoundPrompt {
  prompt: string;
  soundText: string;
  icon: string;
  decoys: string[];
}

export const SOUND_PAIRS_BY_LEVEL: Record<DifficultyLevel, SoundPrompt[]> = {
  1: [
    { prompt: 'Morning Temple Bell', soundText: 'Ding dong, clear temple bell ringing with peace', icon: '🔔', decoys: ['🚗', '☕', '🌸'] },
    { prompt: 'Steaming Hot Chai', soundText: 'Warm soothing cup of hot chai poured gently', icon: '☕', decoys: ['🌧️', '🔔', '🍎'] },
    { prompt: 'Fresh Rain Showers', soundText: 'Gentle calming pitter-patter sound of cooling raindrops', icon: '🌧️', decoys: ['☀️', '🔔', '🏠'] },
    { prompt: 'Street Taxi Horn', soundText: 'Gentle honk of a car driving along the street', icon: '🚗', decoys: ['🏠', '🌸', '☕'] },
  ],
  2: [
    { prompt: 'Pressure Cooker Whistle', soundText: 'Steaming hiss and sharp whistle from the kitchen pressure cooker', icon: '🍲', decoys: ['🚪', '☕', '🔔', '🚗'] },
    { prompt: 'Wooden Front Door Knock', soundText: 'Gentle rhythmic rap-tap-tap knock of a friendly visitor at the door', icon: '🚪', decoys: ['☎️', '🚗', '🌧️', '🍲'] },
    { prompt: 'Sweet Garden Songbird', soundText: 'Sweet morning cuckoo chirping melodiously outside the window', icon: '🐦', decoys: ['🌧️', '🚗', '🍲', '🏠'] },
    { prompt: 'Vintage Telephone Ring', soundText: 'Ringing tring-tring of the telephone bringing pleasant family news', icon: '☎️', decoys: ['⏰', '🔔', '🚪', '☕'] },
    { prompt: 'Grandfather Clock Pendulum', soundText: 'Deep tick-tock pendulum swing marking the quiet afternoon hour', icon: '🕰️', decoys: ['🚗', '☕', '🍲', '🔔'] },
  ],
  3: [
    { prompt: 'Morning Raga on Vintage Radio', soundText: 'Warm classical sitar raga melody playing on the old kitchen radio while grandma strings fresh fragrant jasmine flowers', icon: '📻', decoys: ['🪕', '🌸', '☕', '🔔'] },
    { prompt: 'Village Railway Steam Crossing', soundText: 'Deep echoing steam train horn with rhythmic steel wheel tracks rumbling as twilight arrives', icon: '🚂', decoys: ['🚗', '🌧️', '🚪', '🐦'] },
    { prompt: 'Courtyard Clay Pot Watering', soundText: 'Gentle splashing of cool water poured over terracotta tulsi planters as evening garden sparrows settle', icon: '🪴', decoys: ['🌧️', '🌸', '☕', '🐦'] },
    { prompt: 'Stone Mortar Saffron Grinding', soundText: 'Rhythmic clinking of stone pestle gently crushing fragrant saffron, cardamom, and roasted pistachios for festival sweets', icon: '🥣', decoys: ['🍲', '☕', '🔔', '🍯'] },
  ],
};

// Backwards compatibility
export const SOUND_PAIRS = SOUND_PAIRS_BY_LEVEL[1];

// Clock Face Questions per Difficulty Level
export interface ClockQuestion {
  hours: number;
  minutes: number;
  timeString: string;
  label: string;
  decoys: string[];
}

export const CLOCK_QUESTIONS_BY_LEVEL: Record<DifficultyLevel, ClockQuestion[]> = {
  1: [
    { hours: 7, minutes: 0, timeString: '7:00 AM', label: 'Morning Chai & Awakening', decoys: ['9:00 AM', '6:00 AM'] },
    { hours: 12, minutes: 0, timeString: '12:00 PM', label: 'Midday Lunch & Rest', decoys: ['2:00 PM', '10:00 AM'] },
    { hours: 4, minutes: 0, timeString: '4:00 PM', label: 'Evening Garden Walk', decoys: ['6:00 PM', '2:00 PM'] },
    { hours: 8, minutes: 0, timeString: '8:00 PM', label: 'Night Prayer & Dinner', decoys: ['10:00 PM', '6:00 PM'] },
    { hours: 10, minutes: 0, timeString: '10:00 AM', label: 'Morning Sunshine & Reading', decoys: ['8:00 AM', '1:00 PM'] },
  ],
  2: [
    { hours: 8, minutes: 30, timeString: '8:30 AM', label: 'Morning Medicine & Newspaper', decoys: ['9:30 AM', '8:00 AM', '7:30 AM'] },
    { hours: 1, minutes: 30, timeString: '1:30 PM', label: 'Afternoon Rest Routine', decoys: ['12:30 PM', '2:30 PM', '1:00 PM'] },
    { hours: 4, minutes: 15, timeString: '4:15 PM', label: 'Evening Tea & Biscuits', decoys: ['4:45 PM', '5:15 PM', '3:15 PM'] },
    { hours: 7, minutes: 45, timeString: '7:45 PM', label: 'Night Medicine Schedule', decoys: ['7:15 PM', '8:45 PM', '8:15 PM'] },
    { hours: 10, minutes: 30, timeString: '10:30 AM', label: 'Doctor Phone Consultation', decoys: ['11:30 AM', '9:30 AM', '10:00 AM'] },
  ],
  3: [
    { hours: 7, minutes: 25, timeString: '7:25 AM', label: 'Morning Park Walk & Stretch', decoys: ['7:20 AM', '7:35 AM', '8:25 AM'] },
    { hours: 11, minutes: 40, timeString: '11:40 AM', label: 'Nourishing Soup Preparation', decoys: ['11:35 AM', '11:45 AM', '12:40 PM'] },
    { hours: 3, minutes: 50, timeString: '3:50 PM', label: 'Afternoon Temple Chimes', decoys: ['3:45 PM', '3:55 PM', '4:50 PM'] },
    { hours: 6, minutes: 35, timeString: '6:35 PM', label: 'Sunset Lamp Lighting', decoys: ['6:30 PM', '6:40 PM', '7:35 PM'] },
    { hours: 9, minutes: 55, timeString: '9:55 PM', label: 'Final Bedtime Routine', decoys: ['9:50 PM', '10:55 PM', '9:05 PM'] },
  ],
};

// Backwards compatibility
export const CLOCK_QUESTIONS = CLOCK_QUESTIONS_BY_LEVEL[1];

// Find The Different One Sets per Difficulty Level
export interface DifferentOneSet {
  baseIcon: string;
  oddIcon: string;
  theme: string;
}

export const DIFFERENT_ONE_BY_LEVEL: Record<DifficultyLevel, DifferentOneSet[]> = {
  1: [
    // Clear Semantic Category Contrast (2x2 grid, 4 cards)
    { baseIcon: '🍎', oddIcon: '🚗', theme: 'Fresh Apple vs Motor Car' },
    { baseIcon: '🐦', oddIcon: '☕', theme: 'Garden Bird vs Warm Tea' },
    { baseIcon: '🏠', oddIcon: '☀️', theme: 'Cozy House vs Bright Sun' },
    { baseIcon: '🌸', oddIcon: '⏰', theme: 'Pink Flower vs Clock' },
    { baseIcon: '🍃', oddIcon: '🎈', theme: 'Green Leaf vs Balloon' },
  ],
  2: [
    // Attribute & Color Family Shift (2x3 grid, 6 cards)
    { baseIcon: '🍌', oddIcon: '🍏', theme: 'Yellow Banana vs Green Apple' },
    { baseIcon: '❤️', oddIcon: '⭐', theme: 'Red Heart vs Gold Star' },
    { baseIcon: '🌻', oddIcon: '🌸', theme: 'Sunflower vs Lotus' },
    { baseIcon: '☕', oddIcon: '🥛', theme: 'Hot Tea vs Cold Milk' },
    { baseIcon: '🔔', oddIcon: '👜', theme: 'Temple Bell vs Handbag' },
    { baseIcon: '🐱', oddIcon: '🐶', theme: 'Kitten vs Puppy' },
  ],
  3: [
    // Subtle Micro-Detail & Orientation Scan (3x3 grid, 9 cards)
    { baseIcon: '⭐', oddIcon: '✨', theme: 'Golden Star vs Sparkling Star' },
    { baseIcon: '🌙', oddIcon: '🌕', theme: 'Crescent Moon vs Full Moon' },
    { baseIcon: '⏰', oddIcon: '⌚', theme: 'Alarm Clock vs Wristwatch' },
    { baseIcon: '✉️', oddIcon: '📩', theme: 'Closed Envelope vs Open Mail' },
    { baseIcon: '🌲', oddIcon: '🌴', theme: 'Pine Tree vs Palm Tree' },
    { baseIcon: '🍎', oddIcon: '🍅', theme: 'Red Apple vs Red Tomato' },
  ],
};

// Rhyme & Proverb Questions per Difficulty Level
export interface RhymeQuestion {
  prefix: string;
  answer: string;
  decoys: string[];
  hint: string;
}

export const RHYME_QUESTIONS_BY_LEVEL: Record<DifficultyLevel, RhymeQuestion[]> = {
  1: [
    {
      prefix: 'An apple a day keeps the doctor...',
      answer: 'Away',
      decoys: ['Near', 'Fine'],
      hint: 'Rhymes with "Day"',
    },
    {
      prefix: 'Early to bed and early to rise, makes a person healthy, wealthy, and...',
      answer: 'Wise',
      decoys: ['Kind', 'Bright'],
      hint: 'Rhymes with "Rise"',
    },
    {
      prefix: 'Twinkle, twinkle, little star, how I wonder what you...',
      answer: 'Are',
      decoys: ['See', 'Do'],
      hint: 'Rhymes with "Star"',
    },
    {
      prefix: 'Where there is love and harmony, there is always...',
      answer: 'Peace',
      decoys: ['Fear', 'Rush'],
      hint: 'Warm calmness in the home',
    },
  ],
  2: [
    {
      prefix: 'A stitch in time saves...',
      answer: 'Nine',
      decoys: ['Five', 'Ten', 'Seven'],
      hint: 'Rhymes with "Time"',
    },
    {
      prefix: 'Laughter is the best...',
      answer: 'Medicine',
      decoys: ['Exercise', 'Song', 'Remedy'],
      hint: 'Heals the spirit and heart',
    },
    {
      prefix: 'Actions speak louder than...',
      answer: 'Words',
      decoys: ['Thoughts', 'Wishes', 'Dreams'],
      hint: 'Doing good matters most',
    },
    {
      prefix: 'Every dark cloud has a silver...',
      answer: 'Lining',
      decoys: ['Border', 'Shadow', 'Edge'],
      hint: 'There is hope in difficult times',
    },
    {
      prefix: 'Slow and steady wins the...',
      answer: 'Race',
      decoys: ['Prize', 'Game', 'Track'],
      hint: 'Patience leads to triumph',
    },
  ],
  3: [
    {
      prefix: 'Practice makes a person...',
      answer: 'Perfect',
      decoys: ['Better', 'Skilled', 'Strong'],
      hint: 'Mastery achieved through dedication',
    },
    {
      prefix: 'Beauty lies in the eyes of the...',
      answer: 'Beholder',
      decoys: ['Dreamer', 'Painter', 'Observer'],
      hint: 'Perception is unique to everyone',
    },
    {
      prefix: 'Birds of a feather flock...',
      answer: 'Together',
      decoys: ['Forever', 'Farther', 'Faster'],
      hint: 'Rhymes with "Feather"',
    },
    {
      prefix: 'Honesty is always the best...',
      answer: 'Policy',
      decoys: ['Virtue', 'Habit', 'Rule'],
      hint: 'Timeless moral guiding light',
    },
    {
      prefix: 'Knowledge is a treasure that accompanies its owner...',
      answer: 'Everywhere',
      decoys: ['Forever', 'Always', 'Inside'],
      hint: 'Wisdom travels with you everywhere',
    },
  ],
};

// Backwards compatibility
export const RHYME_QUESTIONS = RHYME_QUESTIONS_BY_LEVEL[1];

// Detailed metadata on what makes Level 1, 2, and 3 unique for every game
export const GAME_LEVEL_CONFIG: Record<string, Record<DifficultyLevel, { title: string; subtitle: string; description: string; badge: string; color: string }>> = {
  'grocery-basket': {
    1: {
      title: 'Level 1: Morning Essentials',
      subtitle: 'Gentle 3-Item Recall • 7s Window',
      description: 'Memorize 3 essential daily staples (Milk, Bread, Apple) with a relaxing 7-second countdown and 6 shelf choices.',
      badge: 'Easy (3 Items)',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Weekly Kitchen Recipe',
      subtitle: 'Balanced 4-Item Recall • 5s Window',
      description: 'Memorize 4 diverse grocery and produce items with a 5-second countdown and 8 shelf choices.',
      badge: 'Medium (4 Items)',
      color: '#D97706',
    },
    3: {
      title: 'Level 3: Festive Mandi Rush',
      subtitle: 'Master 5-Item Recall • 4s Window',
      description: 'Fast-paced 4-second memorization of 5 specialty festive items with 10 shelf choices containing tricky lookalike decoys.',
      badge: 'Advanced (5 Items)',
      color: '#DC2626',
    },
  },
  'clock-reading': {
    1: {
      title: "Level 1: O'Clock Routines",
      subtitle: 'Exact Hour Positions (Hand at 12)',
      description: 'Recognize exact whole hour times (7:00 AM, 12:00 PM, 4:00 PM) with minute hands positioned straight at 12.',
      badge: 'Easy (Exact Hours)',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Half & Quarter Milestones',
      subtitle: 'Half-Hour (:30) & Quarter-Hour (:15 / :45)',
      description: 'Read realistic daily routine milestones like 8:30 AM medicine and 4:15 PM afternoon tea with 4 choice options.',
      badge: 'Medium (:30 / :15)',
      color: '#D97706',
    },
    3: {
      title: 'Level 3: 5-Minute Precision',
      subtitle: 'Exact 5-Minute Angle Discrimination',
      description: 'Distinguish subtle clock hand positions (7:25 AM, 11:40 AM, 3:50 PM) with closely matched 5-minute decoy times.',
      badge: 'Advanced (5-Min Precision)',
      color: '#DC2626',
    },
  },
  'different-one': {
    1: {
      title: 'Level 1: Category Contrast',
      subtitle: '4 Cards (2x2 Grid) • Distinct Themes',
      description: 'Spot the single card belonging to a completely different semantic category (e.g., 3 Apples vs 1 Sports Car).',
      badge: 'Easy (2x2 Grid)',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Attribute & Family Shift',
      subtitle: '6 Cards (2x3 Grid) • Color & Family Difference',
      description: 'Spot items that belong to the same family but differ in color or variant (e.g., Yellow Bananas vs Green Apple).',
      badge: 'Medium (6 Cards)',
      color: '#D97706',
    },
    3: {
      title: 'Level 3: Micro-Detail & Orientation',
      subtitle: '9 Cards (3x3 Grid) • Subtle Feature Scan',
      description: 'Examine a full 9-card matrix to find micro-feature differences like Star vs Sparkle or Crescent vs Full Moon.',
      badge: 'Advanced (3x3 Grid)',
      color: '#DC2626',
    },
  },
  'memory-match': {
    1: {
      title: 'Level 1: Everyday Essentials',
      subtitle: '4 Pairs (8 Cards, 2x4 Grid)',
      description: 'Match 4 high-contrast, universally recognizable pairs (Apple, Flower, Car, Sun) with gentle pacing.',
      badge: 'Easy (8 Cards)',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Household Keepsakes',
      subtitle: '6 Pairs (12 Cards, 3x4 Grid)',
      description: 'Match 6 pairs incorporating everyday home keepsakes like Chai, Bell, and Grapes on a 12-card grid.',
      badge: 'Medium (12 Cards)',
      color: '#D97706',
    },
    3: {
      title: 'Level 3: Master Memory Matrix',
      subtitle: '8 Pairs (16 Cards, 4x4 Grid)',
      description: 'Full 16-card square matrix testing deep spatial memory across 8 pairs of intricate symbols.',
      badge: 'Advanced (16 Cards)',
      color: '#DC2626',
    },
  },
  'number-trail': {
    1: {
      title: 'Level 1: Gentle Stepping Stones',
      subtitle: '5 Stones (1 to 5) • Soft Guidance Pulse',
      description: 'Follow 5 spacious river stones in rising order (1 to 5) with a soft breathing pulse to reassure navigation.',
      badge: 'Easy (1 to 5)',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: River Crossing',
      subtitle: '8 Stones (1 to 8) • Wider River Bed',
      description: 'Traverse 8 stones across the pond (1 to 8) without pulse guides, encouraging active sequential visual scanning.',
      badge: 'Medium (1 to 8)',
      color: '#D97706',
    },
    3: {
      title: 'Level 3: Passbook Stream',
      subtitle: '12 Stones (1 to 12) • Full Pond Coordinate Flow',
      description: 'A complete 12-stone stream simulating counting currency notes and reading multi-row bank passbooks.',
      badge: 'Advanced (1 to 12)',
      color: '#DC2626',
    },
  },
  'pattern-match': {
    1: {
      title: 'Level 1: Corner Lights',
      subtitle: '3x3 Grid • 3 Glowing Tiles • 5s Preview',
      description: 'Watch 3 illuminated emerald tiles on a 3x3 grid with a calm 5-second memorization window.',
      badge: 'Easy (3x3, 3 Tiles)',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Courtyard Mosaic',
      subtitle: '3x3 Grid • 5 Glowing Tiles • 3.5s Preview',
      description: 'Observe 5 glowing tiles on a 3x3 grid with a 3.5-second observation window.',
      badge: 'Medium (3x3, 5 Tiles)',
      color: '#D97706',
    },
    3: {
      title: 'Level 3: Palace Matrix',
      subtitle: '4x4 Grid (16 Tiles!) • 6 Glowing Tiles • 3s Preview',
      description: 'An expanded 16-square master grid with 6 glowing squares to memorize within 3 seconds.',
      badge: 'Advanced (4x4, 6 Tiles)',
      color: '#DC2626',
    },
  },
  'sound-word-match': {
    1: {
      title: 'Level 1: Clear Household Sounds',
      subtitle: 'Distinct Audio Cues • 3 Visual Options',
      description: 'Listen to iconic everyday sounds (Temple Bell, Pouring Chai, Raindrops) and select from 3 distinct choices.',
      badge: 'Easy (3 Choices)',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Kitchen & Safety Alerts',
      subtitle: 'Nuanced Ambient Sounds • 4 Visual Options',
      description: 'Identify ambient household sounds like a Pressure Cooker whistle, Door knock, or Vintage Telephone ring.',
      badge: 'Medium (4 Choices)',
      color: '#D97706',
    },
    3: {
      title: 'Level 3: Multi-Sensory Scenarios',
      subtitle: 'Rich Cultural Soundscapes • Semantic Inference',
      description: 'Listen to descriptive audio soundscapes (Radio Raga with Jasmine, Railway Crossing, Mortar Grinding) and deduce the moment.',
      badge: 'Advanced (Deep Scenarios)',
      color: '#DC2626',
    },
  },
  'sequence-memory': {
    1: {
      title: 'Level 1: Gentle Chimes',
      subtitle: '3 Steps • 4 Pads • Gentle Tempo (1.1s)',
      description: 'Watch a 3-step sequence illuminate across 4 color pads at a relaxed tempo.',
      badge: 'Easy (3 Steps)',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Rhythmic Chain',
      subtitle: '5 Steps • 4 Pads • Standard Tempo (0.85s)',
      description: 'Recall a 5-step rhythmic sequence across 4 color pads at standard tempo.',
      badge: 'Medium (5 Steps)',
      color: '#D97706',
    },
    3: {
      title: 'Level 3: Master Symphony',
      subtitle: '6 Steps • 6 Color Pads (Hexagon) • Brisk Tempo (0.65s)',
      description: 'Experience an expanded 6-pad hexagonal symphony with 6 color tones and a brisk 6-step working memory chain.',
      badge: 'Advanced (6 Pads, 6 Steps)',
      color: '#DC2626',
    },
  },
  'rhyme-completion': {
    1: {
      title: 'Level 1: Everyday Folk Rhymes',
      subtitle: 'Familiar Short Couplets • 3 Clear Options',
      description: 'Complete timeless rhymes and phrases (Doctor away, Early to rise, Twinkle star) with 3 simple choices.',
      badge: 'Easy (3 Options)',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Traditional Proverbs',
      subtitle: 'Cultural Wisdom • 4 Choices with Rhyme Decoys',
      description: 'Complete wisdom proverbs (Stitch in time, Laughter medicine, Silver lining) with 4 options.',
      badge: 'Medium (4 Options)',
      color: '#D97706',
    },
    3: {
      title: 'Level 3: Poetic Epics & Idioms',
      subtitle: 'Nuanced Idioms • Close Semantic Distractors',
      description: 'Finish rich cultural idioms and couplets (Practice perfect, Eyes of beholder, Birds of a feather) with close decoys.',
      badge: 'Advanced (Nuanced)',
      color: '#DC2626',
    },
  },
};
