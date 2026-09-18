/**
 * Cognitive Performance Engine & Adaptive Difficulty
 * 
 * IMPORTANT DISCLAIMER:
 * Prototype Cognitive Performance Score only.
 * This is NOT a medical diagnosis, clinical evaluation, or dementia detector.
 */

export interface ScoreCalculationInput {
  accuracyPercent: number; // 0 - 100
  responseTimeSec: number;
  expectedTimeSec: number;
  mistakes: number;
  totalAttempts: number;
  currentDifficulty: number; // 1, 2, 3
}

export interface CognitiveEvaluationResult {
  score: number; // 0 - 100
  category: 'Excellent' | 'Good' | 'Needs Practice' | 'Needs Support';
  recommendedDifficulty: number;
  feedback: string;
  voiceFeedback: string;
  declineDetected: boolean;
}

export function evaluateCognitivePerformance(input: ScoreCalculationInput): CognitiveEvaluationResult {
  const { accuracyPercent, responseTimeSec, expectedTimeSec, mistakes, currentDifficulty } = input;

  // 1. Accuracy contribution (50% weight)
  const accuracyScore = Math.max(0, Math.min(100, accuracyPercent)) * 0.5;

  // 2. Speed / response time contribution (30% weight)
  // If response time is within expectedTimeSec, full 30 pts. Beyond 2x expected time, drops towards 0.
  let speedRatio = expectedTimeSec / Math.max(1, responseTimeSec);
  if (speedRatio > 1) speedRatio = 1;
  const speedScore = speedRatio * 30;

  // 3. Mistake / completion contribution (20% weight)
  // Fewer mistakes yields higher completion bonus
  const mistakePenalty = Math.min(20, mistakes * 4);
  const completionScore = Math.max(0, 20 - mistakePenalty);

  // Raw score calculated (0 - 100)
  const rawScore = Math.round(accuracyScore + speedScore + completionScore);
  const score = Math.max(10, Math.min(100, rawScore));

  // Categorization
  let category: CognitiveEvaluationResult['category'] = 'Good';
  let recommendedDifficulty = currentDifficulty;
  let feedback = '';
  let voiceFeedback = '';
  let declineDetected = false;

  if (score >= 80) {
    category = 'Excellent';
    // Adaptive increase
    recommendedDifficulty = Math.min(3, currentDifficulty + 1);
    feedback = recommendedDifficulty > currentDifficulty 
      ? "You are doing great! Let's try a slightly higher level." 
      : "Outstanding focus! You are at your best pace.";
    voiceFeedback = "Wonderful job! You showed great speed and accuracy today.";
  } else if (score >= 60) {
    category = 'Good';
    recommendedDifficulty = currentDifficulty;
    feedback = "Good steady pace! Keep enjoying your daily games.";
    voiceFeedback = "Good work! Your rhythm is smooth and steady.";
  } else if (score >= 40) {
    category = 'Needs Practice';
    recommendedDifficulty = Math.max(1, currentDifficulty - 1);
    feedback = "Let's make this easier. Take your time, there is no rush.";
    voiceFeedback = "Good effort. Take your time, we are making the next level more relaxing.";
  } else {
    category = 'Needs Support';
    recommendedDifficulty = 1;
    feedback = "Let's keep things very simple and calm today. Take a relaxing breath.";
    voiceFeedback = "You did your best. Let's take a restful break and drink some water.";
    declineDetected = true;
  }

  return {
    score,
    category,
    recommendedDifficulty,
    feedback,
    voiceFeedback,
    declineDetected,
  };
}

/**
 * Check for sustained 3-day decline for caregiver alert
 */
export function analyzeSustainedDecline(recentScores: number[]): { hasDecline: boolean; explanation: string } {
  if (recentScores.length < 3) {
    return { hasDecline: false, explanation: 'Insufficient session data to evaluate trends.' };
  }

  const last3 = recentScores.slice(-3);
  const isDeclining = last3[0] > last3[1] && last3[1] > last3[2];
  const dropAmount = last3[0] - last3[2];

  if (isDeclining && dropAmount >= 12) {
    return {
      hasDecline: true,
      explanation: `Performance change detected: A steady decrease of ${dropAmount} points was observed across the last 3 sessions.`
    };
  }

  return {
    hasDecline: false,
    explanation: 'Cognitive rhythm is within normal variations.'
  };
}
