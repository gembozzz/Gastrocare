// ============================================
// GastroCare - Database Seed Script
// ============================================
// Run: node prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// ── Seed Data ────────────────────────────────

const seedQuestions = [
  {
    text: 'How often do you experience heartburn (burning sensation in your chest)?',
    order: 1,
    options: [
      'Never',
      'Less than once a month',
      '1–3 times per month',
      'Once a week',
      'Several times a week',
      'Daily',
    ],
  },
  {
    text: 'How often do you experience acid regurgitation (sour or bitter taste in your mouth)?',
    order: 2,
    options: [
      'Never',
      'Less than once a month',
      '1–3 times per month',
      'Once a week',
      'Several times a week',
      'Daily',
    ],
  },
  {
    text: 'Do you experience difficulty swallowing food or feel like food gets stuck in your throat?',
    order: 3,
    options: [
      'Never',
      'Rarely',
      'Sometimes',
      'Often',
      'Very often',
      'Always',
    ],
  },
  {
    text: 'Do you experience chest pain or discomfort unrelated to heart conditions?',
    order: 4,
    options: [
      'Never',
      'Rarely',
      'Sometimes',
      'Often',
      'Very often',
      'Always',
    ],
  },
  {
    text: 'Do your symptoms worsen after eating, lying down, or bending over?',
    order: 5,
    options: [
      'Never',
      'Rarely',
      'Sometimes',
      'Often',
      'Very often',
      'Always',
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...\n');

  // ── 1. Create Admin User ────────────────────

  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@gastrocare.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@12345', 10);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@gastrocare.com',
        password: hashedPassword,
        name: 'GastroCare Admin',
        role: 'ADMIN',
      },
    });

    console.log(`✅ Admin user created: ${admin.email}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${existingAdmin.email}`);
  }

  // ── 2. Create Questions & Options ───────────

  for (const q of seedQuestions) {
    const existingQuestion = await prisma.question.findUnique({
      where: { order: q.order },
    });

    if (existingQuestion) {
      console.log(`ℹ️  Question ${q.order} already exists, skipping...`);
      continue;
    }

    const question = await prisma.question.create({
      data: {
        text: q.text,
        order: q.order,
        options: {
          create: q.options.map((optionText, index) => ({
            text: optionText,
            score: index, // index 0 = 0, index 1 = 1, ..., index 5 = 5
            order: index + 1,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    console.log(`✅ Question ${question.order}: "${question.text.substring(0, 50)}..." (${question.options.length} options)`);
  }

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
