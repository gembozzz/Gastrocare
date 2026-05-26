// ============================================
// GastroCare - Database Seed Script
// ============================================
// Run: node prisma/seed.js
//
// Pertanyaan disesuaikan dengan 20 fitur model AI
// untuk prediksi penyakit lambung.

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// ── Seed Data — 20 pertanyaan sesuai model AI ─────────

const seedQuestions = [
  {
    text: 'Seberapa berat nyeri ulu hati yang Anda rasakan?',
    order: 1,
    options: [
      'Tidak sama sekali',
      'Ringan',
      'Sedang',
      'Berat / Sangat parah',
    ],
  },
  {
    text: 'Seberapa sering Anda merasa mual?',
    order: 2,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa sering Anda mengalami muntah?',
    order: 3,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa sering Anda merasa kembung?',
    order: 4,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa sering Anda mengalami heartburn (rasa terbakar di dada)?',
    order: 5,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa sering Anda merasakan asam naik ke tenggorokan?',
    order: 6,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa sering Anda mengalami diare?',
    order: 7,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa berat demam yang Anda alami?',
    order: 8,
    options: [
      'Tidak sama sekali',
      'Ringan',
      'Sedang',
      'Berat / Sangat parah',
    ],
  },
  {
    text: 'Apakah Anda mengalami penurunan berat badan yang tidak direncanakan?',
    order: 9,
    options: [
      'Tidak',
      'Ya, sedikit',
      'Ya, cukup signifikan',
      'Ya, sangat signifikan',
    ],
  },
  {
    text: 'Seberapa sering Anda merasa cepat kenyang saat makan?',
    order: 10,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa sering Anda mengalami muntah makanan yang belum tercerna?',
    order: 11,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa sering Anda merasakan nyeri perut saat perut kosong?',
    order: 12,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Apakah Anda pernah memiliki feses berwarna hitam?',
    order: 13,
    options: [
      'Tidak pernah',
      'Pernah sekali',
      'Beberapa kali dalam sebulan',
      'Sering / hampir setiap hari',
    ],
  },
  {
    text: 'Seberapa sering Anda mengonsumsi obat anti-nyeri (NSAID seperti ibuprofen, aspirin)?',
    order: 14,
    options: [
      'Tidak pernah',
      'Sesekali (< 1x/minggu)',
      'Cukup rutin (1–3x/minggu)',
      'Sangat rutin (hampir setiap hari)',
    ],
  },
  {
    text: 'Seberapa sering Anda merasa stres tinggi?',
    order: 15,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa sering Anda mengalami batuk kronis?',
    order: 16,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa sering Anda mengalami suara serak?',
    order: 17,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa sering Anda merasa anemia atau lemas tanpa sebab jelas?',
    order: 18,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
    ],
  },
  {
    text: 'Seberapa berat hilangnya nafsu makan Anda?',
    order: 19,
    options: [
      'Tidak sama sekali',
      'Ringan',
      'Sedang',
      'Berat / Sangat parah',
    ],
  },
  {
    text: 'Seberapa sering Anda mengalami nyeri dada?',
    order: 20,
    options: [
      'Tidak pernah',
      'Kadang-kadang',
      'Sering',
      'Hampir selalu',
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

  // ── 2. Delete existing questions & re-create ─────
  // Karena pertanyaan berubah total (dari 5 GERD → 20 gejala lambung),
  // kita hapus semua pertanyaan lama dan buat ulang.

  console.log('\n🗑️  Clearing old questions...');
  await prisma.option.deleteMany({});
  await prisma.question.deleteMany({});
  console.log('✅ Old questions cleared.');

  // ── 3. Create new Questions & Options ──────────

  console.log('\n📝 Creating 20 new questions for AI model...\n');

  for (const q of seedQuestions) {
    const question = await prisma.question.create({
      data: {
        text: q.text,
        order: q.order,
        options: {
          create: q.options.map((optionText, index) => ({
            text: optionText,
            score: index, // 0, 1, 2, 3
            order: index + 1,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    console.log(
      `✅ Q${question.order}: "${question.text.substring(0, 50)}..." (${question.options.length} options)`
    );
  }

  console.log('\n🎉 Seed completed successfully!');
  console.log(`   → ${seedQuestions.length} questions created`);
  console.log('   → Admin: admin@gastrocare.com / Admin@12345');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
