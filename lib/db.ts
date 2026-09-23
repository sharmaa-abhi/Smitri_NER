import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  city?: string;
  doctorName?: string;
  doctorPhone?: string;
  caregiverRelation?: string;
  emergencyName: string;
  emergencyPhone: string;
  preferredLanguage: string;
  difficultyLevel: number; // 1 (Easy), 2 (Normal), 3 (Challenging)
  dailyHydrationTarget?: number;
  currentHydrationGlasses?: number;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: 
    | 'memory-match' 
    | 'sequence-memory' 
    | 'different-one' 
    | 'grocery-basket' 
    | 'number-trail' 
    | 'pattern-match' 
    | 'sound-word-match'
    | 'clock-reading'
    | 'rhyme-completion';
  gameTitle: string;
  score: number;
  accuracy: number;
  responseTimeSec: number;
  mistakes: number;
  difficultyLevel: number;
  recommendedDifficulty: number;
  feedbackText: string;
  timestamp: string;
  realWorldScenario?: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  time: string;
  category: 'MEDICINE' | 'WATER' | 'EXERCISE' | 'DOCTOR' | 'CUSTOM';
  isCompleted: boolean;
  notes?: string;
  dosage?: string;
  priority?: 'HIGH' | 'ROUTINE';
}

export interface CaregiverAlert {
  id: string;
  userId: string;
  type: 'PERFORMANCE_DECLINE' | 'MISSED_MEDICATION' | 'EMERGENCY_TRIGGER';
  message: string;
  severity: 'HIGH' | 'MEDIUM' | 'INFO';
  date: string;
  isResolved: boolean;
}

export interface DatabaseSchema {
  users: User[];
  gameSessions: GameSession[];
  reminders: Reminder[];
  caregiverAlerts: CaregiverAlert[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'smriti_store.json');

// Initialize database with realistic demo data for Kamla Devi
export function getDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialData: DatabaseSchema = {
      users: [
        {
          id: 'user_kamla',
          name: 'Kamla Devi',
          email: 'kamla.devi@example.com',
          age: 68,
          emergencyName: 'Rahul (Son / Caregiver)',
          emergencyPhone: '+91 98765 43210',
          preferredLanguage: 'English / Hindi',
          difficultyLevel: 1,
        }
      ],
      gameSessions: [
        {
          id: 's-1',
          userId: 'user_kamla',
          gameId: 'memory-match',
          gameTitle: 'Memory Match',
          score: 84,
          accuracy: 90,
          responseTimeSec: 18.2,
          mistakes: 1,
          difficultyLevel: 1,
          recommendedDifficulty: 2,
          feedbackText: "You are doing great! Let's try the next step.",
          timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
        },
        {
          id: 's-2',
          userId: 'user_kamla',
          gameId: 'sequence-memory',
          gameTitle: 'Sequence Memory',
          score: 79,
          accuracy: 82,
          responseTimeSec: 22.1,
          mistakes: 2,
          difficultyLevel: 1,
          recommendedDifficulty: 1,
          feedbackText: "Steady pace. Good focus on colors.",
          timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
        {
          id: 's-3',
          userId: 'user_kamla',
          gameId: 'different-one',
          gameTitle: 'Find the Different One',
          score: 88,
          accuracy: 94,
          responseTimeSec: 14.5,
          mistakes: 1,
          difficultyLevel: 1,
          recommendedDifficulty: 2,
          feedbackText: "Quick observation! Excellent work.",
          timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
        },
        {
          id: 's-4',
          userId: 'user_kamla',
          gameId: 'memory-match',
          gameTitle: 'Memory Match',
          score: 75,
          accuracy: 80,
          responseTimeSec: 25.0,
          mistakes: 3,
          difficultyLevel: 2,
          recommendedDifficulty: 2,
          feedbackText: "Good attempt at level 2. Keep practicing!",
          timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
        {
          id: 's-5',
          userId: 'user_kamla',
          gameId: 'sequence-memory',
          gameTitle: 'Sequence Memory',
          score: 71,
          accuracy: 75,
          responseTimeSec: 28.3,
          mistakes: 3,
          difficultyLevel: 2,
          recommendedDifficulty: 1,
          feedbackText: "Slight dip in sequence recall, adjusted to comfortable speed.",
          timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
        {
          id: 's-6',
          userId: 'user_kamla',
          gameId: 'different-one',
          gameTitle: 'Find the Different One',
          score: 66,
          accuracy: 70,
          responseTimeSec: 31.0,
          mistakes: 4,
          difficultyLevel: 2,
          recommendedDifficulty: 1,
          feedbackText: "Take your time. Let's make this easier for comfortable viewing.",
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
        {
          id: 's-7',
          userId: 'user_kamla',
          gameId: 'memory-match',
          gameTitle: 'Memory Match',
          score: 78,
          accuracy: 85,
          responseTimeSec: 20.4,
          mistakes: 2,
          difficultyLevel: 1,
          recommendedDifficulty: 1,
          feedbackText: "Nice recovery and calm focus today!",
          timestamp: new Date().toISOString(),
        }
      ],
      reminders: [
        {
          id: 'rem-1',
          userId: 'user_kamla',
          title: 'Morning Blood Pressure Medicine (Amlodipine 5mg)',
          time: '08:00 AM',
          category: 'MEDICINE',
          isCompleted: true,
          notes: 'Take after light breakfast with warm water'
        },
        {
          id: 'rem-2',
          userId: 'user_kamla',
          title: 'Hydration - Drink 1 Glass of Water',
          time: '11:30 AM',
          category: 'WATER',
          isCompleted: true,
          notes: 'Stay refreshed and active'
        },
        {
          id: 'rem-3',
          userId: 'user_kamla',
          title: 'Evening Walk / Gentle Joint Stretch',
          time: '05:30 PM',
          category: 'EXERCISE',
          isCompleted: false,
          notes: '15 minutes garden walk'
        },
        {
          id: 'rem-4',
          userId: 'user_kamla',
          title: 'Night Calcium & Vitamin D Tablet',
          time: '08:30 PM',
          category: 'MEDICINE',
          isCompleted: false,
          notes: 'Take after dinner'
        }
      ],
      caregiverAlerts: [
        {
          id: 'alert-1',
          userId: 'user_kamla',
          type: 'PERFORMANCE_DECLINE',
          message: 'Performance change detected: Average response time increased by 40% between Thursday and Saturday.',
          severity: 'MEDIUM',
          date: new Date(Date.now() - 1 * 86400000).toLocaleDateString(),
          isResolved: false
        }
      ]
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  const stat = fs.statSync(DB_PATH);
  if (cachedDb && cachedMtime === stat.mtimeMs) {
    return cachedDb;
  }

  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    cachedDb = JSON.parse(raw);
    cachedMtime = stat.mtimeMs;
    return cachedDb!;
  } catch {
    return {
      users: [],
      gameSessions: [],
      reminders: [],
      caregiverAlerts: []
    };
  }
}

// Memory cache variables for O(1) database access
let cachedDb: DatabaseSchema | null = null;
let cachedMtime: number = 0;

export function saveDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  cachedDb = data;
  try {
    cachedMtime = fs.statSync(DB_PATH).mtimeMs;
  } catch {
    cachedMtime = Date.now();
  }
}
