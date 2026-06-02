// ============================================
// Risk Calculator Service — AI Model Integration
// ============================================
// Sekarang menggunakan model AI (FastAPI) untuk prediksi
// penyakit lambung, bukan lagi kalkulasi manual.

const { env } = require('../config/env');

const AI_API_URL = env.AI_API_URL || 'http://localhost:8000';

// ── Mapping: question order → fitur AI model ─────────
// Urutan ini HARUS sinkron dengan seed.js dan model AI

const QUESTION_FITUR_MAP = {
  1: 'nyeri_ulu_hati',
  2: 'mual',
  3: 'muntah',
  4: 'kembung',
  5: 'heartburn',
  6: 'asam_naik_tenggorokan',
  7: 'diare',
  8: 'demam',
  9: 'penurunan_berat_badan',
  10: 'cepat_kenyang',
  11: 'muntah_tak_tercerna',
  12: 'nyeri_perut_kosong',
  13: 'feses_hitam',
  14: 'riwayat_nsaid',
  15: 'stres_tinggi',
  16: 'batuk_kronis',
  17: 'suara_serak',
  18: 'anemia_lemas',
  19: 'nafsu_makan_hilang',
  20: 'nyeri_dada',
};

// ── Mapping: score (0-3) → kata untuk model AI ──────
// Setiap fitur memiliki skala yang berbeda

const SKALA_INTENSITAS = [
  'Tidak sama sekali',
  'Ringan',
  'Sedang',
  'Berat / Sangat parah',
];
const SKALA_FREKUENSI = [
  'Tidak pernah',
  'Kadang-kadang',
  'Sering',
  'Hampir selalu',
];
const SKALA_YA_TIDAK = [
  'Tidak',
  'Ya, sedikit',
  'Ya, cukup signifikan',
  'Ya, sangat signifikan',
];
const SKALA_FESES = [
  'Tidak pernah',
  'Pernah sekali',
  'Beberapa kali dalam sebulan',
  'Sering / hampir setiap hari',
];
const SKALA_NSAID = [
  'Tidak pernah',
  'Sesekali (< 1x/minggu)',
  'Cukup rutin (1–3x/minggu)',
  'Sangat rutin (hampir setiap hari)',
];

const FITUR_SKALA_MAP = {
  nyeri_ulu_hati: SKALA_INTENSITAS,
  mual: SKALA_FREKUENSI,
  muntah: SKALA_FREKUENSI,
  kembung: SKALA_FREKUENSI,
  heartburn: SKALA_FREKUENSI,
  asam_naik_tenggorokan: SKALA_FREKUENSI,
  diare: SKALA_FREKUENSI,
  demam: SKALA_INTENSITAS,
  penurunan_berat_badan: SKALA_YA_TIDAK,
  cepat_kenyang: SKALA_FREKUENSI,
  muntah_tak_tercerna: SKALA_FREKUENSI,
  nyeri_perut_kosong: SKALA_FREKUENSI,
  feses_hitam: SKALA_FESES,
  riwayat_nsaid: SKALA_NSAID,
  stres_tinggi: SKALA_FREKUENSI,
  batuk_kronis: SKALA_FREKUENSI,
  suara_serak: SKALA_FREKUENSI,
  anemia_lemas: SKALA_FREKUENSI,
  nafsu_makan_hilang: SKALA_INTENSITAS,
  nyeri_dada: SKALA_FREKUENSI,
};

// ── Rekomendasi berdasarkan penyakit ─────────────────

const DISEASE_RECOMMENDATIONS = {
  Sehat: {
    riskLevel: 'LOW',
    recommendation:
      'Kabar baik! Dari keluhan yang Anda sampaikan, kondisi lambung Anda saat ini tampak sehat dan berfungsi dengan baik. Pertahankan terus gaya hidup dan pola makan sehat Anda agar pencernaan selalu nyaman dan terjaga.',
    habits: {
      title: 'Beberapa tips untuk menjaga lambung Anda tetap sehat:',
      items: [
        'Makan teratur dengan porsi yang sesuai',
        'Hindari makanan pedas, asam, dan berlemak berlebihan',
        'Kelola stres dengan baik',
        'Olahraga secara teratur minimal 30 menit/hari',
        'Minum air putih yang cukup (8 gelas/hari)',
      ],
    },
  },
  Gastritis: {
    riskLevel: 'MODERATE',
    recommendation:
      'Berdasarkan keluhan yang Anda rasakan, kami melihat ada indikasi ke arah Gastritis (radang lambung). Jangan terlalu khawatir, kondisi ini sangat umum terjadi. Namun, untuk memastikan kenyamanan Anda, kami sangat menyarankan Anda untuk berdiskusi dengan dokter agar mendapatkan penanganan yang paling tepat.',
    habits: {
      title: 'Langkah-langkah yang bisa Anda lakukan mulai sekarang:',
      items: [
        'Hindari makanan pedas, asam, dan berminyak',
        'Makan dalam porsi kecil tapi sering',
        'Hindari NSAID (ibuprofen, aspirin) tanpa resep dokter',
        'Kelola stres — stres memperburuk gastritis',
        'Segera periksakan ke dokter untuk diagnosis dan obat yang tepat',
      ],
    },
  },
  'Tukak Lambung': {
    riskLevel: 'HIGH',
    recommendation:
      'Melihat dari keluhan yang Anda sampaikan, gejala tersebut mengarah pada kemungkinan Tukak Lambung. Kami memahami hal ini mungkin membuat Anda kurang nyaman. Oleh karena itu, sangat penting bagi Anda untuk segera berkonsultasi dengan dokter spesialis, agar Anda bisa mendapatkan perawatan yang tepat dan segera kembali pulih.',
    habits: {
      title: 'Tindakan penting untuk pemulihan Anda:',
      items: [
        'Segera periksakan ke dokter gastroenterologi',
        'Jangan abaikan nyeri perut yang persisten',
        'Hindari total NSAID dan alkohol',
        'Ikuti pengobatan dokter secara disiplin',
        'Perhatikan tanda bahaya: feses hitam, muntah darah',
      ],
    },
  },
  GERD: {
    riskLevel: 'MODERATE',
    recommendation:
      'Dari pola gejala yang Anda bagikan, sepertinya Anda mungkin sedang mengalami GERD (asam lambung naik). Kondisi ini memang kerap mengganggu kenyamanan sehari-hari. Kami sarankan Anda untuk memeriksakannya ke dokter, karena dengan penyesuaian gaya hidup dan pengobatan yang tepat, kondisi ini bisa diatasi dengan baik.',
    habits: {
      title: 'Langkah-langkah untuk mengurangi keluhan:',
      items: [
        'Tinggikan kepala saat tidur 15-20 cm',
        'Hindari makan 2-3 jam sebelum tidur',
        'Hindari makanan pemicu: cokelat, kopi, gorengan, soda',
        'Turunkan berat badan jika berlebih',
        'Konsultasikan ke dokter untuk terapi medikamentosa',
      ],
    },
  },
  'Dispepsia Fungsional': {
    riskLevel: 'MODERATE',
    recommendation:
      'Keluhan yang Anda rasakan mengindikasikan adanya kemungkinan Dispepsia Fungsional. Kondisi ini sering kali berkaitan erat dengan tingkat stres dan pola makan yang tidak menentu. Cobalah untuk lebih rileks dan perlahan atur kembali jadwal makan Anda. Jika keluhan masih berlanjut, jangan ragu untuk berkonsultasi dengan dokter.',
    habits: {
      title: 'Tips untuk membuat perut terasa lebih nyaman:',
      items: [
        'Atur pola makan teratur — jangan telat makan',
        'Makan dalam porsi kecil tapi sering (5-6x sehari)',
        'Hindari makanan berlemak tinggi dan pedas',
        'Kelola stres melalui meditasi, yoga, atau olahraga',
        'Konsultasikan ke dokter jika gejala berlanjut > 2 minggu',
      ],
    },
  },
  Gastroparesis: {
    riskLevel: 'HIGH',
    recommendation:
      'Kami memperhatikan bahwa gejala yang Anda alami menunjukkan indikasi Gastroparesis (perlambatan pengosongan lambung). Agar kondisi pencernaan Anda tidak semakin mengganggu aktivitas, kami sangat menyarankan Anda untuk segera menemui dokter spesialis agar mendapat evaluasi dan solusi yang terbaik untuk Anda.',
    habits: {
      title: 'Langkah-langkah yang sangat kami sarankan:',
      items: [
        'Segera periksakan ke dokter gastroenterologi',
        'Makan porsi kecil tapi sering — hindari makan besar',
        'Kunyah makanan dengan baik dan makan perlahan',
        'Hindari makanan tinggi serat dan lemak',
        'Catat gejala harian untuk diskusi dengan dokter',
      ],
    },
  },
  Gastroenteritis: {
    riskLevel: 'MODERATE',
    recommendation:
      'Dari gejala yang muncul, sepertinya pencernaan Anda sedang mengalami infeksi ringan atau Gastroenteritis. Yang paling penting saat ini adalah menjaga tubuh Anda tetap terhidrasi dengan baik. Mohon segera periksakan diri ke dokter jika kondisi belum membaik, agar Anda bisa cepat kembali beraktivitas dengan nyaman.',
    habits: {
      title: 'Perawatan mandiri yang bisa Anda terapkan:',
      items: [
        'Pastikan hidrasi cukup — minum oralit atau air putih',
        'Makan makanan lunak: bubur, roti, pisang',
        'Hindari susu, kafein, dan makanan berlemak sementara',
        'Cuci tangan secara teratur untuk mencegah penyebaran',
        'Periksakan ke dokter jika demam tinggi atau diare > 3 hari',
      ],
    },
  },
  'Kanker Lambung': {
    riskLevel: 'HIGH',
    recommendation:
      'Terima kasih sudah berbagi keluhan Anda dengan kami. Beberapa gejala yang Anda sampaikan merupakan sinyal penting dari tubuh yang memerlukan perhatian ekstra dan evaluasi medis lebih lanjut. Kami sangat menganjurkan Anda untuk segera memeriksakan diri ke dokter spesialis guna memastikan kondisi Anda secara menyeluruh. Pemeriksaan lebih awal adalah langkah pencegahan yang sangat bijak.',
    habits: {
      title: '⚠️ Tindakan segera yang perlu Anda ambil:',
      items: [
        'SEGERA periksakan ke dokter spesialis gastroenterologi',
        'Minta pemeriksaan endoskopi dan biopsi',
        'Jangan tunda — deteksi dini sangat penting',
        'Siapkan catatan lengkap gejala untuk dokter',
        'Hasil ini BUKAN diagnosis — hanya indikasi untuk pemeriksaan lanjutan',
      ],
    },
  },
};

/**
 * Convert jawaban dari frontend (questionOrder → score)
 * menjadi format yang diharapkan model AI (kata-kata).
 *
 * @param {Array<{questionId: number, optionId: number, score: number}>} answers
 * @param {Array<{id: number, order: number}>} questions - data pertanyaan dari DB
 * @returns {Object} payload untuk model AI
 */
function buildAIPayload(answers, questions) {
  const payload = {};

  for (const answer of answers) {
    // Cari question berdasarkan questionId untuk dapatkan order
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const fitur = QUESTION_FITUR_MAP[question.order];
    if (!fitur) continue;

    const skala = FITUR_SKALA_MAP[fitur];
    if (!skala) continue;

    // score 0-3 → kata sesuai skala
    const scoreIndex = Math.min(answer.score, skala.length - 1);
    payload[fitur] = skala[scoreIndex];
  }

  return payload;
}

/**
 * Panggil model AI dan kembalikan hasil prediksi beserta rekomendasi.
 *
 * @param {Array<{questionId: number, optionId: number, score: number}>} answers
 * @param {Array<{id: number, order: number}>} questions
 * @returns {Promise<Object>} risk assessment result
 */
async function calculateRisk(answers, questions) {
  const aiPayload = buildAIPayload(answers, questions);

  // Panggil model AI
  const response = await fetch(`${AI_API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aiPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI Model error: ${error}`);
  }

  const aiResult = await response.json();

  // Ambil rekomendasi berdasarkan penyakit yang diprediksi (dengan normalisasi string)
  const normalizedPrediksi = String(aiResult.prediksi).toLowerCase().replace(/_/g, ' ');
  
  // Buat mapping case-insensitive untuk pencocokan yang aman
  const diseaseMap = {};
  for (const key in DISEASE_RECOMMENDATIONS) {
    diseaseMap[key.toLowerCase().replace(/_/g, ' ')] = DISEASE_RECOMMENDATIONS[key];
  }

  const diseaseInfo =
    diseaseMap[normalizedPrediksi] ||
    DISEASE_RECOMMENDATIONS['Sehat'];

  // Hitung total score sederhana untuk backward compatibility
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const maxScore = answers.length * 3; // skala 0-3
  const percentage = Math.round((totalScore / maxScore) * 100);

  return {
    // Data dari AI model
    prediksi: aiResult.prediksi,
    kepercayaan: aiResult.kepercayaan,
    top3: aiResult.top3,
    semuaProbabilitas: aiResult.semua_probabilitas,
    peringatan: aiResult.peringatan || null,
    gejala_input: aiPayload, // Tambahkan gejala_input untuk chatbot

    // Data backward-compatible
    totalScore,
    maxScore,
    percentage,
    riskLevel: diseaseInfo.riskLevel,
    recommendation: diseaseInfo.recommendation,
    habits: diseaseInfo.habits,
  };
}

module.exports = { calculateRisk, buildAIPayload };
