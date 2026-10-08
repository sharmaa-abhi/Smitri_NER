import { NextResponse } from 'next/server';
import { getDbAsync, addReminderAsync, updateReminderStatusAsync, Reminder } from '@/lib/db';

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({ reminders: db.reminders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, time, category, notes, dosage, priority } = body;

    if (!title || !time) {
      return NextResponse.json({ error: 'Title and time are required' }, { status: 400 });
    }

    const db = await getDbAsync();
    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      userId: db.users[0]?.id || 'user_kamla',
      title,
      time,
      category: category || 'MEDICINE',
      isCompleted: false,
      notes: notes || '',
      dosage: dosage || '',
      priority: priority || 'ROUTINE',
    };

    await addReminderAsync(newReminder);

    return NextResponse.json({ success: true, reminder: newReminder });
  } catch {
    return NextResponse.json({ error: 'Failed to add reminder' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isCompleted } = body;

    const db = await getDbAsync();
    const reminder = db.reminders.find(r => r.id === id);
    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    await updateReminderStatusAsync(id, isCompleted);
    reminder.isCompleted = isCompleted;

    return NextResponse.json({ success: true, reminder });
  } catch {
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
  }
}
