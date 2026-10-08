import { NextResponse } from 'next/server';
import { getDbAsync, upsertUserAsync } from '@/lib/db';

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({ user: db.users[0] });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updated = await upsertUserAsync(body);
    return NextResponse.json({ success: true, user: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
