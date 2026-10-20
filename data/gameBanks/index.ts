import { DifficultyLevel } from '@/types/games';

export const ICONS_BANK = ['🍎', '🌸', '🚗', '☀️', '☕', '🐱', '🔔', '🏠', '🍇', '🎈', '⭐', '🌈', '🔑', '🌙', '👓', '📚'];

export const ICONS_BANK_BY_LEVEL: Record<DifficultyLevel, string[]> = {
  1: ['🍎', '🌸', '🚗'], // 3 pairs = 6 cards
  2: ['🍎', '🌸', '🚗', '☀️'], // 4 pairs = 8 cards
  3: ['🍎', '🌸', '🚗', '☀️', '☕'], // 5 pairs = 10 cards
  4: ['🍎', '🌸', '🚗', '☀️', '☕', '🔔'], // 6 pairs = 12 cards
  5: ['🍎', '🌸', '🚗', '☀️', '☕', '🔔', '🏠', '⭐'], // 8 pairs = 16 cards
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
  ],
  3: [
    { name: 'Fresh Milk', icon: '🥛' },
    { name: 'Red Apples', icon: '🍎' },
    { name: 'Wheat Bread', icon: '🍞' },
    { name: 'Honey Pot', icon: '🍯' },
    { name: 'Sweet Mango', icon: '🥭' },
    { name: 'Fresh Carrots', icon: '🥕' },
    { name: 'Coconut Water', icon: '🥥' },
    { name: 'Green Tea', icon: '🍵' },
    { name: 'Pure Cow Ghee', icon: '🧈' },
    { name: 'Fresh Curd', icon: '🥣' },
  ],
  4: [
    { name: 'Pure Cow Ghee', icon: '🧈' },
    { name: 'Green Cardamom', icon: '🌾' },
    { name: 'Sweet Mango', icon: '🥭' },
    { name: 'Honey Pot', icon: '🍯' },
    { name: 'Fresh Mint Leaves', icon: '🌿' },
    { name: 'Coconut Water', icon: '🥥' },
    { name: 'Red Apples', icon: '🍎' },
    { name: 'Fresh Milk', icon: '🥛' },
    { name: 'Wheat Bread', icon: '🍞' },
    { name: 'Green Tea', icon: '🍵' },
    { name: 'Almonds & Nuts', icon: '🥜' },
    { name: 'Yellow Bananas', icon: '🍌' },
  ],
  5: [
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
    { name: 'Fresh Curd', icon: '🥣' },
    { name: 'Fresh Carrots', icon: '🥕' },
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
  4: [
    { prompt: 'Morning Rooster Crow in Hills', soundText: 'Lively morning rooster crow echoing across mist-covered tea gardens as daybreak begins', icon: '🐓', decoys: ['🐦', '🚗', '🔔', '☕'] },
    { prompt: 'Gentle Bamboo Grove Breeze', soundText: 'Soothing whispering rustle of green bamboo shoots swaying under afternoon hillside wind', icon: '🎋', decoys: ['🌧️', '🪴', '🌸', '📻'] },
    { prompt: 'Evening Classical Flute Melody', soundText: 'Serene bamboo flute raga playing sweetly from the temple steps during sunset prayers', icon: '🪈', decoys: ['📻', '🔔', '🕰️', '🐦'] },
    { prompt: 'Woodpecker Rhythmic Tapping', soundText: 'Steady rhythmic hollow wood tapping of a friendly woodpecker in the backyard jackfruit tree', icon: '🪵', decoys: ['🚪', '🍲', '🚗', '🚂'] },
  ],
  5: [
    { prompt: 'Brahmaputra Ferry Horn', soundText: 'Resonant deep horn of the morning river ferry boat gliding across the calm waters of the Brahmaputra', icon: '🚢', decoys: ['🚂', '🚗', '📻', '🌧️'] },
    { prompt: 'Temple Brass Cymbal Rhythm', soundText: 'Bright resonant rhythmic clanging of brass cymbals during evening prayer aarti in the prayer hall', icon: '🪘', decoys: ['🔔', '🥣', '🪴', '🚪'] },
    { prompt: 'Monsoon Distant Thunder Echo', soundText: 'Deep peaceful rolling rumble of distant monsoon thunder over hillsides before warm rain', icon: '⛈️', decoys: ['🌧️', '🚂', '🚗', '🍲'] },
    { prompt: 'Sweet Nightingale Twilight Song', soundText: 'Soft melodious twilight nightingale trills welcoming calm starry skies into the home courtyard', icon: '✨', decoys: ['🐦', '📻', '🌸', '🕰️'] },
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
    { hours: 4, minutes: 30, timeString: '4:30 PM', label: 'Evening Tea & Biscuits', decoys: ['5:30 PM', '3:30 PM', '4:00 PM'] },
    { hours: 7, minutes: 30, timeString: '7:30 PM', label: 'Night Medicine Schedule', decoys: ['8:30 PM', '6:30 PM', '7:00 PM'] },
    { hours: 10, minutes: 30, timeString: '10:30 AM', label: 'Doctor Phone Consultation', decoys: ['11:30 AM', '9:30 AM', '10:00 AM'] },
  ],
  3: [
    { hours: 4, minutes: 15, timeString: '4:15 PM', label: 'Evening Tea Gathering', decoys: ['4:45 PM', '5:15 PM', '3:15 PM'] },
    { hours: 7, minutes: 45, timeString: '7:45 PM', label: 'Dinner Preparation Moment', decoys: ['7:15 PM', '8:45 PM', '8:15 PM'] },
    { hours: 9, minutes: 15, timeString: '9:15 AM', label: 'Morning Walk with Friends', decoys: ['9:45 AM', '8:15 AM', '10:15 AM'] },
    { hours: 2, minutes: 45, timeString: '2:45 PM', label: 'Quiet Book Reading Hour', decoys: ['2:15 PM', '3:45 PM', '1:45 PM'] },
    { hours: 6, minutes: 15, timeString: '6:15 PM', label: 'Sunset Lamp Lighting', decoys: ['6:45 PM', '5:15 PM', '7:15 PM'] },
  ],
  4: [
    { hours: 8, minutes: 20, timeString: '8:20 AM', label: 'Morning Herbal Tonic Routine', decoys: ['8:10 AM', '8:40 AM', '9:20 AM'] },
    { hours: 11, minutes: 40, timeString: '11:40 AM', label: 'Midday Soup & Hydration', decoys: ['11:20 AM', '11:50 AM', '12:40 PM'] },
    { hours: 3, minutes: 50, timeString: '3:50 PM', label: 'Afternoon Melody Time', decoys: ['3:40 PM', '4:10 PM', '4:50 PM'] },
    { hours: 6, minutes: 10, timeString: '6:10 PM', label: 'Evening Family Call', decoys: ['6:20 PM', '5:50 PM', '7:10 PM'] },
    { hours: 9, minutes: 40, timeString: '9:40 PM', label: 'Night Bedtime Herbal Chai', decoys: ['9:20 PM', '9:50 PM', '10:40 PM'] },
  ],
  5: [
    { hours: 7, minutes: 25, timeString: '7:25 AM', label: 'Morning Park Walk & Stretch', decoys: ['7:20 AM', '7:35 AM', '8:25 AM'] },
    { hours: 11, minutes: 35, timeString: '11:35 AM', label: 'Vegetable Basket Unloading', decoys: ['11:25 AM', '11:45 AM', '12:35 PM'] },
    { hours: 3, minutes: 55, timeString: '3:55 PM', label: 'Tea Time Preparation', decoys: ['3:50 PM', '4:05 PM', '4:55 PM'] },
    { hours: 6, minutes: 5, timeString: '6:05 PM', label: 'Sunset Lamp Glow Routine', decoys: ['6:15 PM', '5:55 PM', '7:05 PM'] },
    { hours: 9, minutes: 55, timeString: '9:55 PM', label: 'Final Bedtime Routine', decoys: ['9:50 PM', '10:05 PM', '9:45 PM'] },
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
    { baseIcon: '🍎', oddIcon: '🚗', theme: 'Fresh Apple vs Motor Car' },
    { baseIcon: '🐦', oddIcon: '☕', theme: 'Garden Bird vs Warm Tea' },
    { baseIcon: '🏠', oddIcon: '☀️', theme: 'Cozy House vs Bright Sun' },
    { baseIcon: '🌸', oddIcon: '⏰', theme: 'Pink Flower vs Clock' },
    { baseIcon: '🍃', oddIcon: '🎈', theme: 'Green Leaf vs Balloon' },
  ],
  2: [
    { baseIcon: '🍌', oddIcon: '🍏', theme: 'Yellow Banana vs Green Apple' },
    { baseIcon: '❤️', oddIcon: '⭐', theme: 'Red Heart vs Gold Star' },
    { baseIcon: '🌻', oddIcon: '🌸', theme: 'Sunflower vs Lotus' },
    { baseIcon: '☕', oddIcon: '🥛', theme: 'Hot Tea vs Cold Milk' },
    { baseIcon: '🔔', oddIcon: '👜', theme: 'Temple Bell vs Handbag' },
    { baseIcon: '🐱', oddIcon: '🐶', theme: 'Kitten vs Puppy' },
  ],
  3: [
    { baseIcon: '🍵', oddIcon: '☕', theme: 'Green Tea Cup vs Hot Coffee' },
    { baseIcon: '🌲', oddIcon: '🌴', theme: 'Pine Tree vs Palm Tree' },
    { baseIcon: '🍊', oddIcon: '🍋', theme: 'Orange Citrus vs Yellow Lemon' },
    { baseIcon: '🦋', oddIcon: '🐝', theme: 'Butterfly vs Honeybee' },
    { baseIcon: '📚', oddIcon: '📖', theme: 'Book Stack vs Open Notebook' },
  ],
  4: [
    { baseIcon: '⭐', oddIcon: '✨', theme: 'Golden Star vs Sparkling Star' },
    { baseIcon: '🌙', oddIcon: '🌕', theme: 'Crescent Moon vs Full Moon' },
    { baseIcon: '⏰', oddIcon: '⌚', theme: 'Alarm Clock vs Wristwatch' },
    { baseIcon: '✉️', oddIcon: '📩', theme: 'Closed Envelope vs Open Mail' },
    { baseIcon: '🍎', oddIcon: '🍅', theme: 'Red Apple vs Red Tomato' },
  ],
  5: [
    { baseIcon: '🌺', oddIcon: '🌸', theme: 'Hibiscus Petal vs Cherry Blossom' },
    { baseIcon: '🕯️', oddIcon: '🏮', theme: 'Candle Flame vs Traditional Lantern' },
    { baseIcon: '🪴', oddIcon: '🌱', theme: 'Potted Planter vs Sprout Seedling' },
    { baseIcon: '🥣', oddIcon: '🍲', theme: 'Porridge Bowl vs Clay Cooking Pot' },
    { baseIcon: '🗝️', oddIcon: '🔑', theme: 'Vintage Skeleton Key vs Modern Brass Key' },
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
      prefix: 'Early to bed and early to rise, makes a person healthy, wealthy, and...',
      answer: 'Wise',
      decoys: ['Kind', 'Bright'],
      hint: 'Rhymes with "Rise"',
    },
    {
      prefix: 'Laughter is the best...',
      answer: 'Medicine',
      decoys: ['Exercise', 'Song'],
      hint: 'Heals the spirit and heart',
    },
    {
      prefix: 'Slow and steady wins the...',
      answer: 'Race',
      decoys: ['Prize', 'Game'],
      hint: 'Patience leads to triumph',
    },
  ],
  3: [
    {
      prefix: 'A stitch in time saves...',
      answer: 'Nine',
      decoys: ['Five', 'Ten', 'Seven'],
      hint: 'Rhymes with "Time"',
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
  ],
  4: [
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
  ],
  5: [
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
    {
      prefix: 'Better late than...',
      answer: 'Never',
      decoys: ['Ever', 'After', 'Later'],
      hint: 'Completing a meaningful goal at any time',
    },
  ],
};

// Backwards compatibility
export const RHYME_QUESTIONS = RHYME_QUESTIONS_BY_LEVEL[1];

// Complete 5-Level Configs across all 9 games with NO visible Easy/Medium/Advanced difficulty labels
export const GAME_LEVEL_CONFIG: Record<
  string,
  Record<DifficultyLevel, { title: string; subtitle: string; description: string; badge: string; color: string }>
> = {
  'grocery-basket': {
    1: {
      title: 'Level 1: Morning Essentials',
      subtitle: '2 Items • 6s Window',
      description: 'Memorize 2 essential daily staples with a calm 6-second countdown and 4 shelf choices.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Kitchen Breakfast',
      subtitle: '3 Items • 6s Window',
      description: 'Memorize 3 diverse grocery staples with a 6-second countdown and 6 shelf choices.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Weekly Recipe Basket',
      subtitle: '4 Items • 5s Window',
      description: 'Memorize 4 kitchen items with a 5-second countdown and 8 shelf choices.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Local Bazaar Run',
      subtitle: '5 Items • 5s Window',
      description: 'Memorize 5 diverse produce and grocery items with 10 shelf choices.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Festive Mandi Harvest',
      subtitle: '6 Items • 4s Window',
      description: 'Fast-paced 4-second memorization of 6 festive items with 12 shelf choices.',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'clock-reading': {
    1: {
      title: "Level 1: Exact Hour Positions",
      subtitle: "Whole Hours (Hand on 12)",
      description: 'Recognize exact whole hour times (7:00 AM, 12:00 PM, 4:00 PM) with minute hands straight at 12.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Half-Hour Milestones',
      subtitle: 'Half-Hours (:30 Routine)',
      description: 'Read daily routine milestones like 8:30 AM medicine and 1:30 PM afternoon lunch.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Quarter-Hour Angles',
      subtitle: 'Quarter-Hours (:15 and :45)',
      description: 'Distinguish clock hands pointing at 15 past and 15 till the hour.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: 10-Minute Intervals',
      subtitle: '10-Minute Precision Markers',
      description: 'Read realistic daily times like 8:20 AM and 11:40 AM with balanced choices.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: 5-Minute Precision',
      subtitle: 'Exact 5-Minute Time Scan',
      description: 'Distinguish subtle clock hand positions (7:25 AM, 9:55 PM) with closely matched 5-minute options.',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'different-one': {
    1: {
      title: 'Level 1: Category Contrast',
      subtitle: '4 Cards (2x2 Grid)',
      description: 'Spot the single card belonging to a distinct category (e.g., Apple vs Car).',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Everyday Items',
      subtitle: '6 Cards (2x3 Grid)',
      description: 'Find the different item on a 6-card display of familiar objects.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Attribute & Color Shift',
      subtitle: '6 Cards (2x3 Grid)',
      description: 'Spot items that belong to the same family but differ in color or variant.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Fine Feature Scan',
      subtitle: '9 Cards (3x3 Grid)',
      description: 'Examine a 9-card matrix to find subtle symbol differences.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Micro-Detail Scan',
      subtitle: '9 Cards (3x3 Grid)',
      description: 'Scan fine details across 9 cards (e.g. Crescent vs Full Moon, Key styles).',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'memory-match': {
    1: {
      title: 'Level 1: Everyday Essentials',
      subtitle: '3 Pairs (6 Cards, 2x3 Grid)',
      description: 'Match 3 high-contrast pairs (Apple, Flower, Car) with relaxed pacing.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Garden Symbols',
      subtitle: '4 Pairs (8 Cards, 2x4 Grid)',
      description: 'Match 4 recognizable pairs on an 8-card grid.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Household Keepsakes',
      subtitle: '5 Pairs (10 Cards, 2x5 Grid)',
      description: 'Match 5 pairs incorporating warm tea, sunshine, and cheerful keepsakes.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Expanded Grid',
      subtitle: '6 Pairs (12 Cards, 3x4 Grid)',
      description: 'Match 6 pairs across a 12-card grid for active working memory.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Master Matrix',
      subtitle: '8 Pairs (16 Cards, 4x4 Grid)',
      description: 'Full 16-card square matrix testing deep visual recall across 8 pairs.',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'number-trail': {
    1: {
      title: 'Level 1: Stepping Stones',
      subtitle: '4 Stones (1 to 4)',
      description: 'Tap 4 spacious river stones in rising order (1 to 4) with gentle guidance.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Stream Crossing',
      subtitle: '6 Stones (1 to 6)',
      description: 'Follow 6 stones across the stream (1 to 6) in rising sequential order.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: River Bend',
      subtitle: '8 Stones (1 to 8)',
      description: 'Traverse 8 stones across the pond (1 to 8) with active scanning.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Counting Trail',
      subtitle: '10 Stones (1 to 10)',
      description: 'Follow 10 river stones in rising order, stimulating number sequencing.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Passbook Stream',
      subtitle: '12 Stones (1 to 12)',
      description: 'A complete 12-stone stream simulating counting notes and reading multi-row records.',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'pattern-match': {
    1: {
      title: 'Level 1: Corner Lights',
      subtitle: '3x3 Grid • 3 Tiles • 5s Preview',
      description: 'Watch 3 illuminated tiles on a 3x3 grid with a calm 5-second memorization window.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Courtyard Lights',
      subtitle: '3x3 Grid • 4 Tiles • 4s Preview',
      description: 'Observe 4 glowing tiles on a 3x3 grid with a 4-second observation window.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Mosaic Grid',
      subtitle: '3x3 Grid • 5 Tiles • 3.5s Preview',
      description: 'Recall 5 glowing tiles on a 3x3 grid within 3.5 seconds.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Temple Courtyard',
      subtitle: '4x4 Grid • 5 Tiles • 3.5s Preview',
      description: 'An expanded 16-square grid with 5 glowing squares to memorize.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Palace Matrix',
      subtitle: '4x4 Grid • 6 Tiles • 3s Preview',
      description: 'An expanded 16-square master grid with 6 glowing squares to memorize in 3 seconds.',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'sound-word-match': {
    1: {
      title: 'Level 1: Clear Household Sounds',
      subtitle: 'Familiar Cues • 2 Choices',
      description: 'Listen to iconic sounds (Temple Bell, Pouring Chai) and select from 2 choices.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Daily Ambient Sounds',
      subtitle: 'Household Sounds • 3 Choices',
      description: 'Identify ambient sounds like Rain showers, Taxi horn, or Door knock.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Kitchen & Living Room Sounds',
      subtitle: 'Nuanced Cues • 4 Choices',
      description: 'Identify sounds like Pressure Cooker whistle, Door knock, or Vintage Telephone ring.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Natural & Folk Soundscapes',
      subtitle: 'Rich Audio Cues • 4 Choices',
      description: 'Listen to sounds like Rooster crow in hills, Bamboo grove breeze, or Temple flute.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Multi-Sensory Scenes',
      subtitle: 'Descriptive Soundscapes • 4 Choices',
      description: 'Listen to descriptive soundscapes (River ferry horn, Temple cymbal, Saffron mortar) and deduce the moment.',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'sequence-memory': {
    1: {
      title: 'Level 1: Gentle Chimes',
      subtitle: '3 Steps • 4 Pads',
      description: 'Watch a 3-step sequence illuminate across 4 color pads at a relaxed tempo.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Melody Sequence',
      subtitle: '4 Steps • 4 Pads',
      description: 'Recall a 4-step sequence across 4 color chime pads at a steady tempo.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Rhythmic Chain',
      subtitle: '5 Steps • 4 Pads',
      description: 'Recall a 5-step rhythmic sequence across 4 color chime pads.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Six-Pad Raga',
      subtitle: '5 Steps • 6 Pads',
      description: 'Experience an expanded 6-pad hexagonal chime layout with 5 tones in sequence.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Master Symphony',
      subtitle: '6 Steps • 6 Pads',
      description: 'An expanded 6-pad symphony with 6 musical tones and a brisk 6-step working memory chain.',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'rhyme-completion': {
    1: {
      title: 'Level 1: Everyday Folk Rhymes',
      subtitle: 'Familiar Couplets • 3 Choices',
      description: 'Complete timeless rhymes and phrases (Doctor away, Twinkle star) with 3 simple choices.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Common Proverbs',
      subtitle: 'Everyday Wisdom • 3 Choices',
      description: 'Complete familiar sayings (Early to bed early to rise, Slow and steady) with 3 choices.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Traditional Proverbs',
      subtitle: 'Cultural Wisdom • 4 Choices',
      description: 'Complete wisdom proverbs (Stitch in time, Actions speak louder, Silver lining) with 4 options.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Timeless Idioms',
      subtitle: 'Nuanced Phrases • 4 Choices',
      description: 'Complete classic couplets (Practice makes perfect, Beauty in eyes of beholder, Birds of feather).',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Poetic Epics & Idioms',
      subtitle: 'Deep Proverbs • 4 Choices',
      description: 'Finish rich cultural idioms and proverbs (Honesty best policy, Knowledge treasure, Better late than never).',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'routine-timeline': {
    1: {
      title: 'Level 1: Morning Routine Sequence',
      subtitle: '3 Daily Steps • Natural Flow',
      description: 'Place 3 morning events (Wake up, Drink warm chai, Morning stroll) in chronological order.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Day Milestones',
      subtitle: '4 Milestones • Morning to Evening',
      description: 'Arrange 4 essential milestones: Wake up, Lunch, Evening prayer, Night rest in sequence.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Medicine & Routine Care',
      subtitle: '4 Steps • Medication Timing',
      description: 'Sequence morning BP medicine, wholesome breakfast, afternoon rest, and evening tea.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Full Day Independence',
      subtitle: '5 Daily Milestones',
      description: 'Sequence 5 activities from morning garden stroll, bath, lunch, family phone call, to dinner.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Weekly Wellness Schedule',
      subtitle: '5 Dynamic Events',
      description: 'Order rich daily events with precise cultural and health routine steps.',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'currency-calc': {
    1: {
      title: 'Level 1: Morning Stall Purchases',
      subtitle: 'Simple Amounts • Coins & Notes',
      description: 'Match simple daily amounts (₹15, ₹20, ₹30) using ₹5, ₹10, and ₹20 denominations.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Vegetable Basket Tally',
      subtitle: 'Medium Amounts • Exact Change',
      description: 'Tally fresh vegetable purchases (₹45, ₹55, ₹70) using coins and notes.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Grocery & Dairy Bill',
      subtitle: 'Bills up to ₹150',
      description: 'Count ₹10, ₹20, ₹50, and ₹100 notes for milk and pantry supplies.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Local Bazaar Run',
      subtitle: 'Multi-item Totals up to ₹250',
      description: 'Select combined rupee notes for multi-item bazaar shopping with minimal change.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Festive Mandi Shopping',
      subtitle: 'Fast Mental Currency Match',
      description: 'Calculate and match larger purchases up to ₹400 with diverse denominations.',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
  'color-stroop': {
    1: {
      title: 'Level 1: Color Harmony Match',
      subtitle: 'Congruent Colors • 2 Choices',
      description: 'Identify the ink color where words and ink match to build comfortable confidence.',
      badge: 'Level 1',
      color: '#10B981',
    },
    2: {
      title: 'Level 2: Gentle Color Contrast',
      subtitle: '3 Color Options',
      description: 'Choose the font ink color, gently training the brain to ignore misleading text.',
      badge: 'Level 2',
      color: '#059669',
    },
    3: {
      title: 'Level 3: Inhibitory Resilience',
      subtitle: '4 Vibrant Color Choices',
      description: 'Focus purely on the visual ink color (e.g. Red, Blue, Green, Amber) despite conflicting words.',
      badge: 'Level 3',
      color: '#0B534B',
    },
    4: {
      title: 'Level 4: Cultural Color Harmony',
      subtitle: 'Sindoor, Mehendi, Neela, Haldi',
      description: 'Identify traditional Indian hues rapidly across challenging ink combinations.',
      badge: 'Level 4',
      color: '#D97706',
    },
    5: {
      title: 'Level 5: Master Cognitive Agility',
      subtitle: 'Rapid Incongruent Streams',
      description: 'Test sharp mental agility and selective attention with 5 continuous color trials.',
      badge: 'Level 5',
      color: '#B45309',
    },
  },
};

// ─── 10. Routine Timeline Questions ───
export interface RoutineStep {
  id: string;
  order: number;
  title: string;
  timeHint: string;
  icon: string;
}

export interface RoutineQuestion {
  scenario: string;
  steps: RoutineStep[];
}

export const ROUTINE_QUESTIONS_BY_LEVEL: Record<DifficultyLevel, RoutineQuestion[]> = {
  1: [
    {
      scenario: 'Morning Routine Order',
      steps: [
        { id: 'wake', order: 1, title: 'Wake Up & Drink Warm Water', timeHint: '6:30 AM', icon: '🌅' },
        { id: 'tea', order: 2, title: 'Sip Morning Masala Chai', timeHint: '7:30 AM', icon: '☕' },
        { id: 'walk', order: 3, title: 'Gentle Stroll in the Verandah', timeHint: '8:30 AM', icon: '🚶' },
      ],
    },
    {
      scenario: 'Daily Meals Timing',
      steps: [
        { id: 'breakfast', order: 1, title: 'Warm Morning Idli & Poha', timeHint: '8:30 AM', icon: '🥣' },
        { id: 'lunch', order: 2, title: 'Dal, Roti & Fresh Subzi', timeHint: '1:00 PM', icon: '🍛' },
        { id: 'dinner', order: 3, title: 'Light Khichdi & Warm Milk', timeHint: '8:00 PM', icon: '🥛' },
      ],
    },
  ],
  2: [
    {
      scenario: 'Day Milestones in Order',
      steps: [
        { id: 'wake', order: 1, title: 'Wake Up & Fresh Up', timeHint: '6:30 AM', icon: '🌅' },
        { id: 'prayer', order: 2, title: 'Morning Prayer & Puja Diya', timeHint: '7:30 AM', icon: '🪔' },
        { id: 'lunch', order: 3, title: 'Afternoon Lunch with Family', timeHint: '1:30 PM', icon: '🍛' },
        { id: 'evening', order: 4, title: 'Evening Bhajan & Sunset', timeHint: '6:30 PM', icon: '🔔' },
      ],
    },
  ],
  3: [
    {
      scenario: 'Medication & Health Schedule',
      steps: [
        { id: 'med_morning', order: 1, title: 'Morning BP Medicine with Water', timeHint: '7:00 AM', icon: '💊' },
        { id: 'breakfast', order: 2, title: 'Wholesome Breakfast with Family', timeHint: '8:30 AM', icon: '🥣' },
        { id: 'rest', order: 3, title: 'Afternoon Quiet Nap & Rest', timeHint: '2:30 PM', icon: '🛏️' },
        { id: 'tea_med', order: 4, title: 'Evening Herbal Tea & Stroll', timeHint: '5:30 PM', icon: '🍵' },
      ],
    },
  ],
  4: [
    {
      scenario: 'Full Day Care & Connection',
      steps: [
        { id: 'bath', order: 1, title: 'Warm Bath & Fresh Clothes', timeHint: '8:00 AM', icon: '🧼' },
        { id: 'market', order: 2, title: 'Local Vegetable Bazaar Visit', timeHint: '10:00 AM', icon: '🧺' },
        { id: 'lunch', order: 3, title: 'Traditional Midday Meal', timeHint: '1:00 PM', icon: '🍛' },
        { id: 'call', order: 4, title: 'Phone Call with Grandchildren', timeHint: '5:00 PM', icon: '📞' },
        { id: 'sleep', order: 5, title: 'Soothing Classical Music & Sleep', timeHint: '9:30 PM', icon: '🌙' },
      ],
    },
  ],
  5: [
    {
      scenario: 'Master Independence Routine',
      steps: [
        { id: 'yoga', order: 1, title: 'Pranayama & Gentle Breathing', timeHint: '6:00 AM', icon: '🧘' },
        { id: 'chai_news', order: 2, title: 'Morning Newspaper & Hot Chai', timeHint: '7:30 AM', icon: '📰' },
        { id: 'medicine', order: 3, title: 'Daily Prescribed Health Routine', timeHint: '9:00 AM', icon: '💊' },
        { id: 'social', order: 4, title: 'Park Bench Chat with Neighbours', timeHint: '5:30 PM', icon: '👥' },
        { id: 'reading', order: 5, title: 'Comforting Book Reading', timeHint: '8:30 PM', icon: '📖' },
      ],
    },
  ],
};

// ─── 11. Currency & Rupee Tally Questions ───
export interface CurrencyQuestion {
  item: string;
  itemIcon: string;
  targetAmount: number;
  allowedDenominations: number[];
}

export const CURRENCY_QUESTIONS_BY_LEVEL: Record<DifficultyLevel, CurrencyQuestion[]> = {
  1: [
    { item: 'Morning Elaichi Chai', itemIcon: '☕', targetAmount: 15, allowedDenominations: [1, 2, 5, 10, 20] },
    { item: 'Fresh Coriander & Mirchi', itemIcon: '🌿', targetAmount: 20, allowedDenominations: [2, 5, 10, 20] },
    { item: 'Daily Morning Newspaper', itemIcon: '📰', targetAmount: 10, allowedDenominations: [1, 2, 5, 10] },
    { item: 'Fresh Curd Dahi Pouch', itemIcon: '🥣', targetAmount: 30, allowedDenominations: [5, 10, 20] },
  ],
  2: [
    { item: '1 Litre Cow Milk Pouch', itemIcon: '🥛', targetAmount: 55, allowedDenominations: [5, 10, 20, 50] },
    { item: 'Ripe Alphonso Mangoes', itemIcon: '🥭', targetAmount: 75, allowedDenominations: [5, 10, 20, 50] },
    { item: 'Brown Bread Loaf', itemIcon: '🍞', targetAmount: 45, allowedDenominations: [5, 10, 20] },
  ],
  3: [
    { item: 'Pure Cow Ghee Jar (200g)', itemIcon: '🧈', targetAmount: 130, allowedDenominations: [10, 20, 50, 100] },
    { item: 'Organic Honey Bottle', itemIcon: '🍯', targetAmount: 160, allowedDenominations: [10, 20, 50, 100] },
    { item: 'Assam Gold Leaf Tea (250g)', itemIcon: '🍵', targetAmount: 125, allowedDenominations: [5, 10, 20, 50, 100] },
  ],
  4: [
    { item: 'Weekly Produce Vegetable Bag', itemIcon: '🧺', targetAmount: 240, allowedDenominations: [10, 20, 50, 100, 200] },
    { item: 'Almonds & Dry Fruit Pack', itemIcon: '🥜', targetAmount: 275, allowedDenominations: [5, 10, 20, 50, 100, 200] },
  ],
  5: [
    { item: 'Festive Sweets & Mithai Box', itemIcon: '🪔', targetAmount: 380, allowedDenominations: [10, 20, 50, 100, 200] },
    { item: 'Ayurvedic Chawanprash Jar', itemIcon: '✨', targetAmount: 350, allowedDenominations: [20, 50, 100, 200] },
  ],
};

// ─── 12. Color & Word Stroop Questions ───
export interface StroopQuestion {
  word: string;
  colorName: string;
  colorHex: string;
  options: Array<{ name: string; hex: string }>;
}

export const STROOP_QUESTIONS_BY_LEVEL: Record<DifficultyLevel, StroopQuestion[]> = {
  1: [
    {
      word: 'RED',
      colorName: 'Red',
      colorHex: '#DC2626',
      options: [
        { name: 'Red', hex: '#DC2626' },
        { name: 'Blue', hex: '#2563EB' },
      ],
    },
    {
      word: 'GREEN',
      colorName: 'Green',
      colorHex: '#059669',
      options: [
        { name: 'Green', hex: '#059669' },
        { name: 'Yellow', hex: '#D97706' },
      ],
    },
    {
      word: 'BLUE',
      colorName: 'Blue',
      colorHex: '#2563EB',
      options: [
        { name: 'Blue', hex: '#2563EB' },
        { name: 'Red', hex: '#DC2626' },
      ],
    },
  ],
  2: [
    {
      word: 'BLUE',
      colorName: 'Green',
      colorHex: '#059669',
      options: [
        { name: 'Green', hex: '#059669' },
        { name: 'Blue', hex: '#2563EB' },
        { name: 'Red', hex: '#DC2626' },
      ],
    },
    {
      word: 'RED',
      colorName: 'Yellow',
      colorHex: '#D97706',
      options: [
        { name: 'Yellow', hex: '#D97706' },
        { name: 'Red', hex: '#DC2626' },
        { name: 'Green', hex: '#059669' },
      ],
    },
  ],
  3: [
    {
      word: 'YELLOW',
      colorName: 'Red',
      colorHex: '#DC2626',
      options: [
        { name: 'Red', hex: '#DC2626' },
        { name: 'Yellow', hex: '#D97706' },
        { name: 'Green', hex: '#059669' },
        { name: 'Blue', hex: '#2563EB' },
      ],
    },
    {
      word: 'GREEN',
      colorName: 'Blue',
      colorHex: '#2563EB',
      options: [
        { name: 'Blue', hex: '#2563EB' },
        { name: 'Green', hex: '#059669' },
        { name: 'Red', hex: '#DC2626' },
        { name: 'Purple', hex: '#7C3AED' },
      ],
    },
  ],
  4: [
    {
      word: 'PURPLE',
      colorName: 'Amber',
      colorHex: '#D97706',
      options: [
        { name: 'Amber', hex: '#D97706' },
        { name: 'Purple', hex: '#7C3AED' },
        { name: 'Red', hex: '#DC2626' },
        { name: 'Teal', hex: '#0B534B' },
      ],
    },
    {
      word: 'RED',
      colorName: 'Teal',
      colorHex: '#0B534B',
      options: [
        { name: 'Teal', hex: '#0B534B' },
        { name: 'Red', hex: '#DC2626' },
        { name: 'Blue', hex: '#2563EB' },
        { name: 'Amber', hex: '#D97706' },
      ],
    },
  ],
  5: [
    {
      word: 'GREEN',
      colorName: 'Rose Red',
      colorHex: '#E11D48',
      options: [
        { name: 'Rose Red', hex: '#E11D48' },
        { name: 'Green', hex: '#059669' },
        { name: 'Deep Teal', hex: '#0B534B' },
        { name: 'Violet', hex: '#7C3AED' },
      ],
    },
    {
      word: 'VIOLET',
      colorName: 'Deep Teal',
      colorHex: '#0B534B',
      options: [
        { name: 'Deep Teal', hex: '#0B534B' },
        { name: 'Violet', hex: '#7C3AED' },
        { name: 'Rose Red', hex: '#E11D48' },
        { name: 'Amber', hex: '#D97706' },
      ],
    },
  ],
};
