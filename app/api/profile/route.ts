import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json({ user: db.users[0] });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();
    if (db.users[0]) {
      db.users[0] = { ...db.users[0], ...body };
      saveDb(db);
    }
    return NextResponse.json({ success: true, user: db.users[0] });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
