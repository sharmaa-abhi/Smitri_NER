import { NextResponse } from 'next/server';
import { getDbAsync } from '@/lib/db';
import { buildUserExperienceProfile } from '@/lib/experienceEngine';

export async function GET() {
  try {
    const db = await getDbAsync();
    const user = db.users[0] || null;
    const experienceProfile = buildUserExperienceProfile(db.gameSessions || [], user);

    return NextResponse.json({
      user,
      gameSessions: db.gameSessions,
      reminders: db.reminders,
      caregiverAlerts: db.caregiverAlerts,
      experienceProfile,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
