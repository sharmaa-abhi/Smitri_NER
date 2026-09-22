export const ICONS_BANK = ['🍎', '🌸', '🚗', '☀️', '☕', '🐱', '🔔', '🏠', '🍇', '🎈', '⭐', '🌈'];

export const GROCERY_ITEMS = [
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

export const SOUND_PAIRS = [
  { prompt: 'Morning Temple Bell', soundText: 'Ding dong, temple bell ringing with peace', icon: '🔔', decoys: ['🚗', '☕', '🌸'] },
  { prompt: 'Warm Steaming Chai', soundText: 'Cup of hot aromatic cardamom tea poured gently', icon: '☕', decoys: ['🌧️', '🔔', '🍎'] },
  { prompt: 'Chirping Songbird', soundText: 'Sweet morning bird chirping in the garden', icon: '🐦', decoys: ['🚗', '🏠', '🍇'] },
  { prompt: 'Fresh Rainfall Drops', soundText: 'Calm pitter-patter sound of cooling raindrops', icon: '🌧️', decoys: ['☀️', '🔔', '🎈'] },
  { prompt: 'Bright Warm Sunshine', soundText: 'Warm golden sun shining high in the blue sky', icon: '☀️', decoys: ['🌙', '🌧️', '☕'] },
  { prompt: 'Comfortable Sweet Home', soundText: 'Peaceful home with loved ones and cozy warmth', icon: '🏠', decoys: ['🚗', '🍎', '⭐'] },
];

export const CLOCK_QUESTIONS = [
  { hours: 7, minutes: 0, timeString: '7:00 AM', label: 'Morning Chai & Awakening', decoys: ['9:00 AM', '6:30 AM', '11:00 AM'] },
  { hours: 12, minutes: 30, timeString: '12:30 PM', label: 'Afternoon Nourishing Lunch', decoys: ['1:30 PM', '11:30 AM', '2:00 PM'] },
  { hours: 4, minutes: 0, timeString: '4:00 PM', label: 'Evening Garden Walk', decoys: ['3:00 PM', '5:30 PM', '6:00 PM'] },
  { hours: 9, minutes: 0, timeString: '9:00 PM', label: 'Night Rest & Sleep', decoys: ['8:30 PM', '10:00 PM', '7:00 PM'] },
  { hours: 8, minutes: 15, timeString: '8:15 AM', label: 'Morning Medicine & Breakfast', decoys: ['7:15 AM', '9:30 AM', '8:45 AM'] },
];

export const RHYME_QUESTIONS = [
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
