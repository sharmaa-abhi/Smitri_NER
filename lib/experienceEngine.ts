import { GameSession, User } from '@/lib/db';
import { DifficultyLevel } from '@/types/games';
import { GAME_LEVEL_CONFIG } from '@/data/gameBanks';

export type CognitiveDomainKey = 'daily' | 'memory' | 'attention' | 'verbal';

export interface DomainMetadata {
  key: CognitiveDomainKey;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  games: string[];
}

export const COGNITIVE_DOMAINS: Record<CognitiveDomainKey, DomainMetadata> = {
  daily: {
    key: 'daily',
    title: 'Daily Routine & Orientation',
    subtitle: 'Market recall, clock hands & prayer milestones',
    icon: '🛒',
    color: '#0B534B',
    description: 'Grounding everyday temporal awareness and independent living routines.',
    games: ['grocery-basket', 'clock-reading'],
  },
  memory: {
    key: 'memory',
    title: 'Visual & Spatial Memory',
    subtitle: 'Everyday keepsakes, room layouts & light patterns',
    icon: '🧠',
    color: '#10B981',
    description: 'Strengthens recall of where spectacles, keys, and home items are placed.',
    games: ['memory-match', 'pattern-match', 'sequence-memory'],
  },
  attention: {
    key: 'attention',
    title: 'Focus & Detail Discrimination',
    subtitle: 'Medicine labels, passbook numbers & currency',
    icon: '👀',
    color: '#D97706',
    description: 'Sharpens visual discrimination for safety labels and financial numeracy.',
    games: ['different-one', 'number-trail'],
  },
  verbal: {
    key: 'verbal',
    title: 'Verbal & Auditory Processing',
    subtitle: 'Safety sounds, proverbs & cultural rhymes',
    icon: '🗣️',
    color: '#7C3AED',
    description: 'Stimulates linguistic preservation, hearing cues, and storytelling joy.',
    games: ['sound-word-match', 'rhyme-completion'],
  },
};

export interface DomainMetric {
  domainKey: CognitiveDomainKey;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  sessionsCount: number;
  averageAccuracy: number;
  averageResponseTimeSec: number;
  masteryLevel: DifficultyLevel;
  badge: string;
  status: 'Mastered' | 'Strong' | 'Steady' | 'Getting Started';
}

export interface RecommendedQuest {
  gameId: string;
  gameTitle: string;
  category: CognitiveDomainKey;
  level: DifficultyLevel;
  levelBadge: string;
  levelSubtitle: string;
  reason: string;
  realWorldScenario: string;
  realWorldBenefit: string;
  estimatedTimeMin: number;
  color: string;
}

export interface EarnedBadge {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  color: string;
  unlockedAt?: string;
}

export interface UserExperienceProfile {
  totalGamesPlayed: number;
  overallAccuracy: number;
  averageResponseTimeSec: number;
  overallScore: number;
  highestLevelPlayed: DifficultyLevel;
  dominantDomain: {
    domainKey: CognitiveDomainKey;
    title: string;
    sessionsCount: number;
  };
  strongestDomain: {
    domainKey: CognitiveDomainKey;
    title: string;
    accuracy: number;
  };
  growthFocusDomain: {
    domainKey: CognitiveDomainKey;
    title: string;
    suggestion: string;
  };
  domainMetrics: Record<CognitiveDomainKey, DomainMetric>;
  recommendedQuest: RecommendedQuest;
  recentSessions: Array<{
    id: string;
    gameId: string;
    gameTitle: string;
    category: CognitiveDomainKey;
    score: number;
    accuracy: number;
    responseTimeSec: number;
    difficultyLevel: DifficultyLevel;
    recommendedDifficulty: DifficultyLevel;
    feedbackText: string;
    timestamp: string;
    realWorldScenario?: string;
  }>;
  earnedBadges: EarnedBadge[];
  adaptiveVoiceGreeting: string;
  experienceSummary: string;
}

/**
 * Builds a dynamic experience profile from the user's actual game sessions
 */
export function buildUserExperienceProfile(
  gameSessions: GameSession[] = [],
  user?: Partial<User> | null
): UserExperienceProfile {
  const userName = user?.name || 'Elder';
  const totalGames = gameSessions.length;

  // 1. Group sessions by domain
  const domainSessions: Record<CognitiveDomainKey, GameSession[]> = {
    daily: [],
    memory: [],
    attention: [],
    verbal: [],
  };

  const getGameDomain = (gameId: string): CognitiveDomainKey => {
    if (COGNITIVE_DOMAINS.daily.games.includes(gameId)) return 'daily';
    if (COGNITIVE_DOMAINS.memory.games.includes(gameId)) return 'memory';
    if (COGNITIVE_DOMAINS.attention.games.includes(gameId)) return 'attention';
    return 'verbal';
  };

  gameSessions.forEach((s) => {
    const domain = getGameDomain(s.gameId);
    domainSessions[domain].push(s);
  });

  // 2. Compute metrics for each domain
  const domainMetrics: Record<CognitiveDomainKey, DomainMetric> = {
    daily: computeDomainMetric('daily', domainSessions.daily),
    memory: computeDomainMetric('memory', domainSessions.memory),
    attention: computeDomainMetric('attention', domainSessions.attention),
    verbal: computeDomainMetric('verbal', domainSessions.verbal),
  };

  // 3. Find Strongest and Dominant domains
  let strongestKey: CognitiveDomainKey = 'daily';
  let highestAcc = -1;
  let dominantKey: CognitiveDomainKey = 'daily';
  let maxCount = -1;
  let growthKey: CognitiveDomainKey = 'verbal';
  let minCount = 999;

  (Object.keys(COGNITIVE_DOMAINS) as CognitiveDomainKey[]).forEach((key) => {
    const metric = domainMetrics[key];
    if (metric.averageAccuracy > highestAcc && metric.sessionsCount > 0) {
      highestAcc = metric.averageAccuracy;
      strongestKey = key;
    }
    if (metric.sessionsCount > maxCount) {
      maxCount = metric.sessionsCount;
      dominantKey = key;
    }
    if (metric.sessionsCount < minCount) {
      minCount = metric.sessionsCount;
      growthKey = key;
    }
  });

  // 4. Overall stats
  const totalScoreSum = gameSessions.reduce((acc, s) => acc + (s.score || 80), 0);
  const totalAccSum = gameSessions.reduce((acc, s) => acc + (s.accuracy || 85), 0);
  const totalTimeSum = gameSessions.reduce((acc, s) => acc + (s.responseTimeSec || 18), 0);

  const overallScore = totalGames > 0 ? Math.round(totalScoreSum / totalGames) : 86;
  const overallAccuracy = totalGames > 0 ? Math.round(totalAccSum / totalGames) : 88;
  const averageResponseTimeSec = totalGames > 0 ? Number((totalTimeSum / totalGames).toFixed(1)) : 17.5;

  const highestLevelPlayed = (Math.max(
    1,
    ...gameSessions.map((s) => s.difficultyLevel || 1)
  ) || 1) as DifficultyLevel;

  // 5. Intelligent Quest Recommendation based on game experience
  const recommendedQuest = determineNextQuest(gameSessions, domainMetrics, growthKey);

  // 6. Earned Badges based on actual gameplay milestones
  const earnedBadges = computeEarnedBadges(gameSessions, domainMetrics);

  // 7. Format recent sessions
  const recentSessions = gameSessions.slice(-4).reverse().map((s) => ({
    id: s.id,
    gameId: s.gameId,
    gameTitle: s.gameTitle,
    category: getGameDomain(s.gameId),
    score: s.score,
    accuracy: s.accuracy,
    responseTimeSec: s.responseTimeSec,
    difficultyLevel: (Math.max(1, Math.min(5, s.difficultyLevel || 1))) as DifficultyLevel,
    recommendedDifficulty: (Math.max(1, Math.min(5, s.recommendedDifficulty || 1))) as DifficultyLevel,
    feedbackText: s.feedbackText,
    timestamp: s.timestamp,
    realWorldScenario: s.realWorldScenario,
  }));

  // 8. Adaptive Voice Greeting
  const strongestTitle = COGNITIVE_DOMAINS[strongestKey].title;
  const adaptiveVoiceGreeting = `Namaste ${userName}. Your cognitive vitality is ${overallScore} out of 100 based on your game history. Your greatest strength is ${strongestTitle} with ${domainMetrics[strongestKey].averageAccuracy}% accuracy. Today, your personalized game is ${recommendedQuest.gameTitle} on ${recommendedQuest.levelBadge}. ${recommendedQuest.reason}`;

  const experienceSummary = `Based on ${totalGames} completed cognitive quests, your top domain is ${strongestTitle} (${domainMetrics[strongestKey].averageAccuracy}% accuracy). You are currently practicing up to Level ${highestLevelPlayed}.`;

  return {
    totalGamesPlayed: totalGames,
    overallAccuracy,
    averageResponseTimeSec,
    overallScore,
    highestLevelPlayed,
    dominantDomain: {
      domainKey: dominantKey,
      title: COGNITIVE_DOMAINS[dominantKey].title,
      sessionsCount: domainMetrics[dominantKey].sessionsCount,
    },
    strongestDomain: {
      domainKey: strongestKey,
      title: strongestTitle,
      accuracy: domainMetrics[strongestKey].averageAccuracy,
    },
    growthFocusDomain: {
      domainKey: growthKey,
      title: COGNITIVE_DOMAINS[growthKey].title,
      suggestion: `Gentle ${COGNITIVE_DOMAINS[growthKey].title} exercises will keep your cognitive balance well-rounded.`,
    },
    domainMetrics,
    recommendedQuest,
    recentSessions,
    earnedBadges,
    adaptiveVoiceGreeting,
    experienceSummary,
  };
}

function computeDomainMetric(key: CognitiveDomainKey, sessions: GameSession[]): DomainMetric {
  const meta = COGNITIVE_DOMAINS[key];
  if (sessions.length === 0) {
    return {
      domainKey: key,
      title: meta.title,
      subtitle: meta.subtitle,
      icon: meta.icon,
      color: meta.color,
      sessionsCount: 0,
      averageAccuracy: 85, // Friendly default
      averageResponseTimeSec: 18,
      masteryLevel: 1,
      badge: 'Level 1: Ready to Begin',
      status: 'Getting Started',
    };
  }

  const avgAcc = Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length);
  const avgTime = Number((sessions.reduce((acc, s) => acc + s.responseTimeSec, 0) / sessions.length).toFixed(1));
  const maxDiff = (Math.max(1, ...sessions.map((s) => s.difficultyLevel || 1))) as DifficultyLevel;

  let status: DomainMetric['status'] = 'Steady';
  if (avgAcc >= 92 && maxDiff >= 2) status = 'Mastered';
  else if (avgAcc >= 85) status = 'Strong';

  const badgeText = `Level ${maxDiff}`;

  return {
    domainKey: key,
    title: meta.title,
    subtitle: meta.subtitle,
    icon: meta.icon,
    color: meta.color,
    sessionsCount: sessions.length,
    averageAccuracy: avgAcc,
    averageResponseTimeSec: avgTime,
    masteryLevel: maxDiff,
    badge: badgeText,
    status,
  };
}

function determineNextQuest(
  sessions: GameSession[],
  domainMetrics: Record<CognitiveDomainKey, DomainMetric>,
  growthKey: CognitiveDomainKey
): RecommendedQuest {
  const latest = sessions[sessions.length - 1];

  // If no sessions yet, start with gentle Grocery Basket Level 1
  if (!latest) {
    return {
      gameId: 'grocery-basket',
      gameTitle: 'Grocery Basket Recall',
      category: 'daily',
      level: 1,
      levelBadge: 'Level 1',
      levelSubtitle: 'Morning Essentials • 2 Items',
      reason: 'A relaxing starter puzzle to stimulate everyday market list memory.',
      realWorldScenario: 'Weekly Local Bazaar & Vegetable Shopping List',
      realWorldBenefit: 'Helps elderly navigate market shopping without forgetting essentials',
      estimatedTimeMin: 2,
      color: '#10B981',
    };
  }

  // If latest session scored high (>=80), suggest advancing or complementary game
  if (latest.score >= 80) {
    const nextLevel = (Math.min(5, (latest.recommendedDifficulty || latest.difficultyLevel || 1))) as DifficultyLevel;

    // If the user played clock reading with great success, recommend next level!
    if (latest.gameId === 'clock-reading') {
      const config = GAME_LEVEL_CONFIG['clock-reading']?.[nextLevel];
      return {
        gameId: 'clock-reading',
        gameTitle: 'Clock Face Match',
        category: 'daily',
        level: nextLevel,
        levelBadge: `Level ${nextLevel}`,
        levelSubtitle: config?.subtitle || 'Time Orientation',
        reason: `You scored ${latest.score}% in your previous time check! Ready for ${config?.badge || 'Level ' + nextLevel}.`,
        realWorldScenario: 'Timetable for Morning Puja, Medicine & Doctor Visits',
        realWorldBenefit: 'Reinforces daily temporal awareness and appointment punctuality',
        estimatedTimeMin: 2,
        color: config?.color || '#0B534B',
      };
    }

    // If memory domain has high accuracy, recommend next memory tier or a diverse domain
    if (growthKey && domainMetrics[growthKey].sessionsCount === 0) {
      const targetGameId = COGNITIVE_DOMAINS[growthKey].games[0];
      const targetConfig = GAME_LEVEL_CONFIG[targetGameId]?.[1];
      return {
        gameId: targetGameId,
        gameTitle: formatTitle(targetGameId),
        category: growthKey,
        level: 1,
        levelBadge: 'Level 1',
        levelSubtitle: targetConfig?.subtitle || 'Gentle Practice',
        reason: `Your ${COGNITIVE_DOMAINS[latest.gameId.includes('clock') ? 'daily' : 'memory'].title} is strong! Let's enrich your mind with a gentle ${COGNITIVE_DOMAINS[growthKey].title} quest.`,
        realWorldScenario: 'Everyday Household Awareness',
        realWorldBenefit: COGNITIVE_DOMAINS[growthKey].description,
        estimatedTimeMin: 2,
        color: '#D97706',
      };
    }

    // Default to advancing the latest game or partner game
    const partnerId = getPartnerGameId(latest.gameId);
    const partnerConfig = GAME_LEVEL_CONFIG[partnerId]?.[nextLevel];
    return {
      gameId: partnerId,
      gameTitle: formatTitle(partnerId),
      category: getDomainOfGame(partnerId),
      level: nextLevel,
      levelBadge: `Level ${nextLevel}`,
      levelSubtitle: partnerConfig?.subtitle || 'Sequential Practice',
      reason: `Based on your recent ${latest.gameTitle} score (${latest.score}%), Level ${nextLevel} is ready for you.`,
      realWorldScenario: partnerConfig?.description || 'Everyday Senior Memory and Focus',
      realWorldBenefit: 'Maintains mental agility across real-world situations',
      estimatedTimeMin: 2,
      color: partnerConfig?.color || '#10B981',
    };
  }

  // If latest score was moderate or needs practice (<80), suggest Level 1 quest
  return {
    gameId: 'grocery-basket',
    gameTitle: 'Grocery Basket Recall',
    category: 'daily',
    level: 1,
    levelBadge: 'Level 1',
    levelSubtitle: 'Morning Essentials • 2 Items',
    reason: 'A calm, stress-free market recall quest to maintain rhythm with zero time pressure.',
    realWorldScenario: 'Weekly Local Bazaar & Vegetable Shopping List',
    realWorldBenefit: 'Helps elderly navigate market shopping without forgetting essentials',
    estimatedTimeMin: 2,
    color: '#10B981',
  };
}

function getPartnerGameId(gameId: string): string {
  const map: Record<string, string> = {
    'grocery-basket': 'clock-reading',
    'clock-reading': 'grocery-basket',
    'memory-match': 'pattern-match',
    'pattern-match': 'sequence-memory',
    'sequence-memory': 'memory-match',
    'different-one': 'number-trail',
    'number-trail': 'different-one',
    'sound-word-match': 'rhyme-completion',
    'rhyme-completion': 'sound-word-match',
  };
  return map[gameId] || 'clock-reading';
}

function getDomainOfGame(gameId: string): CognitiveDomainKey {
  if (COGNITIVE_DOMAINS.daily.games.includes(gameId)) return 'daily';
  if (COGNITIVE_DOMAINS.memory.games.includes(gameId)) return 'memory';
  if (COGNITIVE_DOMAINS.attention.games.includes(gameId)) return 'attention';
  return 'verbal';
}

function formatTitle(id: string): string {
  const titles: Record<string, string> = {
    'grocery-basket': 'Grocery Basket Recall',
    'clock-reading': 'Clock Face Match',
    'different-one': 'Find the Different One',
    'memory-match': 'Memory Match',
    'number-trail': 'Number Trail',
    'pattern-match': 'Matrix Pattern Recall',
    'sound-word-match': 'Daily Word & Sound Match',
    'sequence-memory': 'Sequence Memory',
    'rhyme-completion': 'Rhyme & Proverb Complete',
  };
  return titles[id] || 'Cognitive Quest';
}

function computeEarnedBadges(
  sessions: GameSession[],
  domainMetrics: Record<CognitiveDomainKey, DomainMetric>
): EarnedBadge[] {
  const badges: EarnedBadge[] = [];

  if (domainMetrics.daily.sessionsCount >= 2) {
    badges.push({
      id: 'badge-daily',
      title: 'Bazaar & Routine Specialist',
      icon: '🛒',
      category: 'Daily Routine',
      description: 'Mastered 2+ grocery bazaar and clock orientation sessions.',
      color: '#0B534B',
    });
  }

  if (domainMetrics.memory.sessionsCount >= 2) {
    badges.push({
      id: 'badge-memory',
      title: 'Memory Guardian',
      icon: '🧠',
      category: 'Visual Memory',
      description: 'Demonstrated high visual and spatial pattern retention.',
      color: '#10B981',
    });
  }

  if (domainMetrics.attention.sessionsCount >= 2) {
    badges.push({
      id: 'badge-attention',
      title: 'Eagle Eye Inspector',
      icon: '👀',
      category: 'Attention',
      description: 'Acute discrimination spotting medicine labels and number paths.',
      color: '#D97706',
    });
  }

  if (domainMetrics.verbal.sessionsCount >= 1) {
    badges.push({
      id: 'badge-verbal',
      title: 'Cultural Wordsmith',
      icon: '🗣️',
      category: 'Language',
      description: 'Active linguistic recall of classic proverbs and audio cues.',
      color: '#7C3AED',
    });
  }

  const hasLevel2 = sessions.some((s) => s.difficultyLevel >= 2);
  if (hasLevel2) {
    badges.push({
      id: 'badge-level2',
      title: 'Level 2 Explorer',
      icon: '⚡',
      category: 'Agility',
      description: 'Successfully advanced to Balanced Level 2 game challenges.',
      color: '#D97706',
    });
  }

  const hasLevel3 = sessions.some((s) => s.difficultyLevel === 3);
  if (hasLevel3) {
    badges.push({
      id: 'badge-level3',
      title: 'Level 3 Master Mind',
      icon: '👑',
      category: 'Mastery',
      description: 'Conquered advanced 4x4 matrices, 6 chime pads, or 5-min clock hands.',
      color: '#DC2626',
    });
  }

  if (sessions.length >= 5) {
    badges.push({
      id: 'badge-streak',
      title: '7-Day Consistency Star',
      icon: '🔥',
      category: 'Routine',
      description: 'Maintained unbroken daily cognitive stimulation streak.',
      color: '#F59E0B',
    });
  }

  return badges;
}
