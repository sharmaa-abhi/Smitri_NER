import { NextResponse } from 'next/server';
import { getDbAsync, addGameSessionAsync, addCaregiverAlertAsync, GameSession, CaregiverAlert } from '@/lib/db';
import { evaluateCognitivePerformance, analyzeSustainedDecline } from '@/lib/scoring';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      gameId,
      gameTitle,
      accuracy,
      responseTimeSec,
      expectedTimeSec,
      mistakes,
      totalAttempts,
      currentDifficulty
    } = body;

    const evaluation = evaluateCognitivePerformance({
      accuracyPercent: accuracy,
      responseTimeSec,
      expectedTimeSec: expectedTimeSec || 20,
      mistakes,
      totalAttempts: totalAttempts || (mistakes + 4),
      currentDifficulty: currentDifficulty || 1,
    });

    const db = await getDbAsync();
    const userId = db.users[0]?.id || 'user_kamla';

    const gameTitlesMap: Record<string, string> = {
      'memory-match': 'Memory Match',
      'sequence-memory': 'Sequence Memory',
      'different-one': 'Find the Different One',
      'grocery-basket': 'Grocery Basket Recall',
      'number-trail': 'Number Trail',
      'pattern-match': 'Matrix Pattern Recall',
      'sound-word-match': 'Daily Word & Sound Match',
      'clock-reading': 'Clock Face Match',
      'rhyme-completion': 'Rhyme & Word Completion',
    };

    const newSession: GameSession = {
      id: `s-${Date.now()}`,
      userId,
      gameId,
      gameTitle: gameTitle || gameTitlesMap[gameId] || 'Cognitive Quest',
      score: evaluation.score,
      accuracy,
      responseTimeSec,
      mistakes,
      difficultyLevel: currentDifficulty || 1,
      recommendedDifficulty: evaluation.recommendedDifficulty,
      feedbackText: evaluation.feedback,
      timestamp: new Date().toISOString(),
    };

    await addGameSessionAsync(newSession);

    // Fast O(1) backward extraction of last 3 user scores
    const recentScores: number[] = [];
    for (let i = db.gameSessions.length - 1; i >= 0 && recentScores.length < 2; i--) {
      if (db.gameSessions[i].userId === userId) {
        recentScores.unshift(db.gameSessions[i].score);
      }
    }
    recentScores.push(newSession.score);

    const declineAnalysis = analyzeSustainedDecline(recentScores);
    if (declineAnalysis.hasDecline) {
      const alert: CaregiverAlert = {
        id: `alert-${Date.now()}`,
        userId,
        type: 'PERFORMANCE_DECLINE',
        message: declineAnalysis.explanation,
        severity: 'MEDIUM',
        date: new Date().toLocaleDateString(),
        isResolved: false,
      };
      await addCaregiverAlertAsync(alert);
    }

    return NextResponse.json({
      success: true,
      session: newSession,
      evaluation,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record game session' }, { status: 500 });
  }
}
