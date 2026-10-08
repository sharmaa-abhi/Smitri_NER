import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Supabase Cloud Database with initial data ---');

  const storePath = path.join(process.cwd(), 'data', 'smriti_store.json');
  if (!fs.existsSync(storePath)) {
    console.log('No data/smriti_store.json found to seed from.');
    return;
  }

  const raw = fs.readFileSync(storePath, 'utf-8');
  const store = JSON.parse(raw);

  const existingUsers = await prisma.user.count();
  if (existingUsers === 0) {
    console.log('Seeding demo user...');
    const demoUser = store.users?.[0] || {
      id: 'user_kamla',
      name: 'Kamla Devi',
      email: 'kamla.devi@example.com',
      age: 68,
      emergencyName: 'Rahul (Son / Caregiver)',
      emergencyPhone: '+91 98765 43210',
      preferredLanguage: 'English / Hindi',
      difficultyLevel: 1,
    };

    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {},
      create: {
        id: demoUser.id || 'user_kamla',
        name: demoUser.name,
        email: demoUser.email,
        age: demoUser.age || 68,
        city: demoUser.city || 'Guwahati, Assam',
        doctorName: demoUser.doctorName || 'Dr. Manab Barua',
        doctorPhone: demoUser.doctorPhone || '+91 94350 12345',
        caregiverRelation: demoUser.caregiverRelation || 'Son & Primary Caregiver',
        emergencyName: demoUser.emergencyName || 'Rahul Sharma (Son)',
        emergencyPhone: demoUser.emergencyPhone || '+91 98765 43210',
        preferredLanguage: demoUser.preferredLanguage || 'English',
        difficultyLevel: demoUser.difficultyLevel || 1,
        dailyHydrationTarget: demoUser.dailyHydrationTarget || 6,
        currentHydrationGlasses: demoUser.currentHydrationGlasses || 4,
      },
    });

    console.log(`Created user: ${user.name} (${user.id})`);

    // Seed Reminders
    if (store.reminders && store.reminders.length > 0) {
      console.log(`Seeding ${store.reminders.length} reminders...`);
      for (const r of store.reminders) {
        await prisma.reminder.create({
          data: {
            id: r.id.startsWith('rem-') ? r.id : `rem-${Date.now()}-${Math.random()}`,
            userId: user.id,
            title: r.title,
            time: r.time,
            category: r.category || 'MEDICINE',
            isCompleted: Boolean(r.isCompleted),
            notes: r.notes || null,
            dosage: r.dosage || null,
            priority: r.priority || 'ROUTINE',
          },
        });
      }
    }

    // Seed Game Sessions
    if (store.gameSessions && store.gameSessions.length > 0) {
      console.log(`Seeding ${store.gameSessions.length} game sessions...`);
      for (const g of store.gameSessions) {
        await prisma.gameSession.create({
          data: {
            id: g.id,
            userId: user.id,
            gameId: g.gameId,
            gameTitle: g.gameTitle,
            score: Number(g.score),
            accuracy: Number(g.accuracy),
            responseTimeSec: Number(g.responseTimeSec),
            mistakes: Number(g.mistakes || 0),
            difficultyLevel: Number(g.difficultyLevel || 1),
            recommendedDifficulty: Number(g.recommendedDifficulty || 1),
            feedbackText: g.feedbackText || null,
            realWorldScenario: g.realWorldScenario || null,
            timestamp: g.timestamp ? new Date(g.timestamp) : new Date(),
          },
        });
      }
    }

    // Seed Caregiver Alerts
    if (store.caregiverAlerts && store.caregiverAlerts.length > 0) {
      console.log(`Seeding ${store.caregiverAlerts.length} caregiver alerts...`);
      for (const a of store.caregiverAlerts) {
        await prisma.caregiverAlert.create({
          data: {
            id: a.id,
            userId: user.id,
            type: a.type,
            message: a.message,
            severity: a.severity || 'MEDIUM',
            date: a.date,
            isResolved: Boolean(a.isResolved),
          },
        });
      }
    }
  } else {
    console.log(`Database already has ${existingUsers} users. Skipping initial seed.`);
  }

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
