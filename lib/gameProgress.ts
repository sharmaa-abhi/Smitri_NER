/**
 * Smitri_NER — Sequential Game Level Progression & Unlocking Manager
 * 
 * Rules:
 * - 5 levels per game: Level 1 -> Level 2 -> Level 3 -> Level 4 -> Level 5
 * - Level 1 is unlocked by default
 * - Level N+1 unlocks ONLY after successfully completing Level N
 * - Completed levels can be replayed at any time without resetting progress
 * - Progress is persisted per-user and per-game in localStorage
 * - No skipping or accessing locked levels via UI or URL
 */

export interface GameProgress {
  gameId: string;
  unlockedLevel: number; // 1 to 5
  completedLevels: number[]; // e.g. [1, 2]
  highestScores?: Record<number, number>; // level -> score
  updatedAt: string;
}

const STORAGE_PREFIX = 'smitri_game_progress';

function getStorageKey(gameId: string, userId?: string): string {
  const normalizedUser = (userId && userId.trim()) ? userId.trim() : 'guest';
  return `${STORAGE_PREFIX}_${normalizedUser}_${gameId}`;
}

/**
 * Retrieve saved progress for a specific game and user
 */
export function getGameProgress(gameId: string, userId?: string): GameProgress {
  const defaultProgress: GameProgress = {
    gameId,
    unlockedLevel: 1,
    completedLevels: [],
    highestScores: {},
    updatedAt: new Date().toISOString(),
  };

  if (typeof window === 'undefined') {
    return defaultProgress;
  }

  try {
    const raw = localStorage.getItem(getStorageKey(gameId, userId));
    if (!raw) return defaultProgress;

    const parsed = JSON.parse(raw);
    const unlocked = Math.max(1, Math.min(5, Number(parsed.unlockedLevel) || 1));
    const completed = Array.isArray(parsed.completedLevels)
      ? parsed.completedLevels
          .map((n: unknown) => Number(n))
          .filter((n: number) => n >= 1 && n <= 5)
      : [];

    return {
      gameId,
      unlockedLevel: unlocked,
      completedLevels: Array.from(new Set(completed)).sort((a, b) => a - b),
      highestScores: parsed.highestScores || {},
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return defaultProgress;
  }
}

/**
 * Check whether a given level is currently unlocked for play
 */
export function isLevelUnlocked(gameId: string, level: number, userId?: string): boolean {
  if (level <= 1) return true;
  if (level > 5) return false;
  const progress = getGameProgress(gameId, userId);
  return progress.unlockedLevel >= level;
}

/**
 * Check whether a given level has been successfully completed
 */
export function isLevelCompleted(gameId: string, level: number, userId?: string): boolean {
  const progress = getGameProgress(gameId, userId);
  return progress.completedLevels.includes(level);
}

/**
 * Get the highest available unlocked level (1 to 5)
 */
export function getHighestUnlockedLevel(gameId: string, userId?: string): number {
  const progress = getGameProgress(gameId, userId);
  return Math.max(1, Math.min(5, progress.unlockedLevel));
}

/**
 * Record successful completion of a level and unlock the next level
 */
export function completeLevel(
  gameId: string,
  level: number,
  score: number = 100,
  userId?: string
): { nextLevel: number | null; isAllCompleted: boolean; wasFirstCompletion: boolean } {
  const current = getGameProgress(gameId, userId);
  const wasFirstCompletion = !current.completedLevels.includes(level);

  const updatedCompleted = Array.from(new Set([...current.completedLevels, level])).sort((a, b) => a - b);
  // Unlocking next level (capped at 5)
  const nextLevel = level < 5 ? Math.max(current.unlockedLevel, level + 1) : current.unlockedLevel;

  const highestScores = { ...(current.highestScores || {}) };
  highestScores[level] = Math.max(highestScores[level] || 0, score);

  const newProgress: GameProgress = {
    gameId,
    unlockedLevel: nextLevel,
    completedLevels: updatedCompleted,
    highestScores,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(getStorageKey(gameId, userId), JSON.stringify(newProgress));
      window.dispatchEvent(
        new CustomEvent('smitri_game_progress_updated', {
          detail: { gameId, level, progress: newProgress },
        })
      );
    } catch (err) {
      console.warn('Failed to persist game progress to localStorage:', err);
    }
  }

  const isAllCompleted = updatedCompleted.length >= 5 || level === 5;
  return {
    nextLevel: level < 5 ? (level + 1) : null,
    isAllCompleted,
    wasFirstCompletion,
  };
}

/**
 * Get progress summary across all games for the current user
 */
export function getAllGamesProgress(userId?: string): Record<string, GameProgress> {
  const gameIds = [
    'memory-match',
    'sequence-memory',
    'different-one',
    'grocery-basket',
    'number-trail',
    'pattern-match',
    'sound-word-match',
    'clock-reading',
    'rhyme-completion',
  ];

  const map: Record<string, GameProgress> = {};
  for (const id of gameIds) {
    map[id] = getGameProgress(id, userId);
  }
  return map;
}

/**
 * Reset progress for testing or restarting from Level 1
 */
export function resetGameProgress(gameId: string, userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getStorageKey(gameId, userId));
    window.dispatchEvent(
      new CustomEvent('smitri_game_progress_updated', {
        detail: { gameId, level: 1, reset: true },
      })
    );
  } catch (err) {
    console.warn('Failed to reset game progress:', err);
  }
}
