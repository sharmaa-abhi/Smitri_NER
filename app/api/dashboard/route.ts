import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({
      user: db.users[0] || null,
      gameSessions: db.gameSessions,
      reminders: db.reminders,
      caregiverAlerts: db.caregiverAlerts,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
