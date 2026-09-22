import { NextResponse } from 'next/server';
import { getDb, saveDb, GameSession, CaregiverAlert } from '@/lib/db';
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

    const db = getDb();
    const userId = db.users[0]?.id || 'user_kamla';

    const gameTitlesMap: Record<string, string> = {
      'memory-match': 'Memory Match',
      'sequence-memory': 'Sequence Memory',
      'different-one': 'Find the Different One',
      'grocery-basket': 'Grocery Basket Recall',
      'number-trail': 'Number Trail',
      'pattern-match': 'Matrix Pattern Recall',
      'sound-word-match': 'Daily Word & Sound Match',
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

    db.gameSessions.push(newSession);

    // Check if user difficulty needs updating
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.difficultyLevel = evaluation.recommendedDifficulty;
    }

    // Check for sustained decline across last scores
    const recentScores = db.gameSessions
      .filter(s => s.userId === userId)
      .map(s => s.score);

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
      db.caregiverAlerts.unshift(alert);
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      session: newSession,
      evaluation,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record game session' }, { status: 500 });
  }
}
