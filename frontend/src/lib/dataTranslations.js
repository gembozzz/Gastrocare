// ============================================
// Backend Data Translations
// ============================================
// Translates backend data (questions, options, recommendations)
// to English when the user switches language.
// The backend always serves data in Indonesian (as source of truth
// for AI model compatibility), and this file provides the English mapping.

// ── Question Translations ────────────────────────────
// Key = Indonesian text, Value = English text

const questionTranslations = {
  // Questions
  'Seberapa berat nyeri ulu hati yang Anda rasakan?': 'How severe is the epigastric pain you feel?',
  'Seberapa sering Anda merasa mual?': 'How often do you feel nauseous?',
  'Seberapa sering Anda mengalami muntah?': 'How often do you experience vomiting?',
  'Seberapa sering Anda merasa kembung?': 'How often do you feel bloated?',
  'Seberapa sering Anda mengalami heartburn (rasa terbakar di dada)?': 'How often do you experience heartburn (burning sensation in the chest)?',
  'Seberapa sering Anda merasakan asam naik ke tenggorokan?': 'How often do you feel acid rising to your throat?',
  'Seberapa sering Anda mengalami diare?': 'How often do you experience diarrhea?',
  'Seberapa berat demam yang Anda alami?': 'How severe is the fever you experience?',
  'Apakah Anda mengalami penurunan berat badan yang tidak direncanakan?': 'Have you experienced unplanned weight loss?',
  'Seberapa sering Anda merasa cepat kenyang saat makan?': 'How often do you feel full quickly when eating?',
  'Seberapa sering Anda mengalami muntah makanan yang belum tercerna?': 'How often do you vomit undigested food?',
  'Seberapa sering Anda merasakan nyeri perut saat perut kosong?': 'How often do you feel stomach pain on an empty stomach?',
  'Apakah Anda pernah memiliki feses berwarna hitam?': 'Have you ever had black-colored stools?',
  'Seberapa sering Anda mengonsumsi obat anti-nyeri (NSAID seperti ibuprofen, aspirin)?': 'How often do you take pain relievers (NSAIDs like ibuprofen, aspirin)?',
  'Seberapa sering Anda merasa stres tinggi?': 'How often do you feel highly stressed?',
  'Seberapa sering Anda mengalami batuk kronis?': 'How often do you experience chronic cough?',
  'Seberapa sering Anda mengalami suara serak?': 'How often do you experience hoarseness?',
  'Seberapa sering Anda merasa anemia atau lemas tanpa sebab jelas?': 'How often do you feel anemic or weak without clear cause?',
  'Seberapa berat hilangnya nafsu makan Anda?': 'How severe is your loss of appetite?',
  'Seberapa sering Anda mengalami nyeri dada?': 'How often do you experience chest pain?',
}

// ── Option Translations ──────────────────────────────

const optionTranslations = {
  // Intensity scale
  'Tidak sama sekali': 'Not at all',
  'Ringan': 'Mild',
  'Sedang': 'Moderate',
  'Berat / Sangat parah': 'Severe / Very severe',

  // Frequency scale
  'Tidak pernah': 'Never',
  'Kadang-kadang': 'Sometimes',
  'Sering': 'Often',
  'Hampir selalu': 'Almost always',

  // Yes/No scale
  'Tidak': 'No',
  'Ya, sedikit': 'Yes, a little',
  'Ya, cukup signifikan': 'Yes, quite significant',
  'Ya, sangat signifikan': 'Yes, very significant',

  // Stool scale
  'Pernah sekali': 'Once',
  'Beberapa kali dalam sebulan': 'Several times a month',
  'Sering / hampir setiap hari': 'Often / almost every day',

  // NSAID scale
  'Sesekali (< 1x/minggu)': 'Occasionally (< 1x/week)',
  'Cukup rutin (1–3x/minggu)': 'Fairly regular (1–3x/week)',
  'Sangat rutin (hampir setiap hari)': 'Very regular (almost every day)',
}

// ── Recommendation Translations ──────────────────────

const recommendationTranslations = {
  // Recommendations
  'Berdasarkan analisis AI, kondisi lambung Anda terindikasi sehat. Tetap jaga pola makan dan gaya hidup sehat untuk mencegah gangguan pencernaan.':
    'Based on AI analysis, your stomach condition appears healthy. Maintain a healthy diet and lifestyle to prevent digestive disorders.',

  'Model AI mendeteksi kemungkinan Gastritis (radang lambung). Segera konsultasikan ke dokter untuk evaluasi dan pengobatan yang tepat.':
    'The AI model detected a possibility of Gastritis (stomach inflammation). Please consult a doctor for proper evaluation and treatment.',

  'Model AI mendeteksi kemungkinan Tukak Lambung (ulkus peptikum). Ini adalah kondisi serius — segera konsultasikan ke dokter spesialis gastroenterologi.':
    'The AI model detected a possibility of Peptic Ulcer. This is a serious condition — please consult a gastroenterology specialist immediately.',

  'Model AI mendeteksi kemungkinan GERD (Gastroesophageal Reflux Disease). Konsultasikan ke dokter untuk penanganan yang sesuai.':
    'The AI model detected a possibility of GERD (Gastroesophageal Reflux Disease). Consult a doctor for appropriate treatment.',

  'Model AI mendeteksi kemungkinan Dispepsia Fungsional. Kondisi ini sering dipicu oleh stres dan pola makan tidak teratur.':
    'The AI model detected a possibility of Functional Dyspepsia. This condition is often triggered by stress and irregular eating patterns.',

  'Model AI mendeteksi kemungkinan Gastroparesis (gangguan pengosongan lambung). Segera konsultasikan ke dokter spesialis.':
    'The AI model detected a possibility of Gastroparesis (delayed stomach emptying). Please consult a specialist immediately.',

  'Model AI mendeteksi kemungkinan Gastroenteritis (infeksi saluran cerna). Pastikan hidrasi yang cukup dan konsultasikan ke dokter.':
    'The AI model detected a possibility of Gastroenteritis (gastrointestinal infection). Ensure adequate hydration and consult a doctor.',

  'Model AI mendeteksi kemungkinan tanda-tanda yang perlu pemeriksaan lebih lanjut untuk Kanker Lambung. Segera periksakan ke dokter spesialis untuk evaluasi mendalam.':
    'The AI model detected signs that require further examination for Stomach Cancer. Please see a specialist immediately for thorough evaluation.',
}

// ── Habits Title Translations ────────────────────────

const habitsTitleTranslations = {
  'Tips menjaga kesehatan lambung:': 'Tips for maintaining stomach health:',
  'Langkah yang disarankan:': 'Recommended steps:',
  'Tindakan penting:': 'Important actions:',
  '⚠️ Tindakan segera:': '⚠️ Immediate actions:',
}

// ── Habits Items Translations ────────────────────────

const habitsItemTranslations = {
  // Sehat
  'Makan teratur dengan porsi yang sesuai': 'Eat regularly with appropriate portions',
  'Hindari makanan pedas, asam, dan berlemak berlebihan': 'Avoid excessively spicy, sour, and fatty foods',
  'Kelola stres dengan baik': 'Manage stress effectively',
  'Olahraga secara teratur minimal 30 menit/hari': 'Exercise regularly at least 30 minutes/day',
  'Minum air putih yang cukup (8 gelas/hari)': 'Drink enough water (8 glasses/day)',

  // Gastritis
  'Hindari makanan pedas, asam, dan berminyak': 'Avoid spicy, sour, and oily foods',
  'Makan dalam porsi kecil tapi sering': 'Eat small portions but frequently',
  'Hindari NSAID (ibuprofen, aspirin) tanpa resep dokter': 'Avoid NSAIDs (ibuprofen, aspirin) without a doctor\'s prescription',
  'Kelola stres — stres memperburuk gastritis': 'Manage stress — stress worsens gastritis',
  'Segera periksakan ke dokter untuk diagnosis dan obat yang tepat': 'See a doctor promptly for proper diagnosis and medication',

  // Tukak Lambung
  'Segera periksakan ke dokter gastroenterologi': 'See a gastroenterology specialist immediately',
  'Jangan abaikan nyeri perut yang persisten': 'Do not ignore persistent stomach pain',
  'Hindari total NSAID dan alkohol': 'Completely avoid NSAIDs and alcohol',
  'Ikuti pengobatan dokter secara disiplin': 'Follow doctor\'s treatment plan strictly',
  'Perhatikan tanda bahaya: feses hitam, muntah darah': 'Watch for warning signs: black stools, vomiting blood',

  // GERD
  'Tinggikan kepala saat tidur 15-20 cm': 'Elevate your head when sleeping by 15-20 cm',
  'Hindari makan 2-3 jam sebelum tidur': 'Avoid eating 2-3 hours before bedtime',
  'Hindari makanan pemicu: cokelat, kopi, gorengan, soda': 'Avoid trigger foods: chocolate, coffee, fried food, soda',
  'Turunkan berat badan jika berlebih': 'Lose weight if overweight',
  'Konsultasikan ke dokter untuk terapi medikamentosa': 'Consult a doctor for medication therapy',

  // Dispepsia Fungsional
  'Atur pola makan teratur — jangan telat makan': 'Maintain regular eating patterns — don\'t skip meals',
  'Makan dalam porsi kecil tapi sering (5-6x sehari)': 'Eat small portions frequently (5-6 times a day)',
  'Hindari makanan berlemak tinggi dan pedas': 'Avoid high-fat and spicy foods',
  'Kelola stres melalui meditasi, yoga, atau olahraga': 'Manage stress through meditation, yoga, or exercise',
  'Konsultasikan ke dokter jika gejala berlanjut > 2 minggu': 'Consult a doctor if symptoms persist > 2 weeks',

  // Gastroparesis
  'Makan porsi kecil tapi sering — hindari makan besar': 'Eat small portions frequently — avoid large meals',
  'Kunyah makanan dengan baik dan makan perlahan': 'Chew food well and eat slowly',
  'Hindari makanan tinggi serat dan lemak': 'Avoid high-fiber and high-fat foods',
  'Catat gejala harian untuk diskusi dengan dokter': 'Keep a daily symptom log to discuss with your doctor',

  // Gastroenteritis
  'Pastikan hidrasi cukup — minum oralit atau air putih': 'Ensure adequate hydration — drink ORS or water',
  'Makan makanan lunak: bubur, roti, pisang': 'Eat soft foods: porridge, bread, bananas',
  'Hindari susu, kafein, dan makanan berlemak sementara': 'Temporarily avoid milk, caffeine, and fatty foods',
  'Cuci tangan secara teratur untuk mencegah penyebaran': 'Wash hands regularly to prevent spread',
  'Periksakan ke dokter jika demam tinggi atau diare > 3 hari': 'See a doctor if high fever or diarrhea > 3 days',

  // Kanker Lambung
  'SEGERA periksakan ke dokter spesialis gastroenterologi': 'IMMEDIATELY see a gastroenterology specialist',
  'Minta pemeriksaan endoskopi dan biopsi': 'Request endoscopy and biopsy examination',
  'Jangan tunda — deteksi dini sangat penting': 'Don\'t delay — early detection is crucial',
  'Siapkan catatan lengkap gejala untuk dokter': 'Prepare a complete symptom log for the doctor',
  'Hasil ini BUKAN diagnosis — hanya indikasi untuk pemeriksaan lanjutan': 'This result is NOT a diagnosis — only an indication for further examination',
}

// ── API Error Translations ───────────────────────────

const errorTranslations = {
  'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.':
    'Unable to connect to the server. Please check your internet connection.',
  'Permintaan tidak valid.': 'Invalid request.',
  'Sesi habis, silakan login kembali.': 'Session expired, please log in again.',
  'Terlalu banyak permintaan, coba lagi beberapa saat.': 'Too many requests, please try again later.',
  'Terjadi kesalahan server. Coba lagi nanti.': 'A server error occurred. Please try again later.',
  'Terjadi kesalahan.': 'An error occurred.',
  'Tidak ada pertanyaan yang tersedia.': 'No questions available.',
  'Terjadi kesalahan yang tidak diketahui.': 'An unknown error occurred.',
}

// ── Warning Translations ─────────────────────────────

const warningTranslations = {
  'Kepercayaan model rendah — hasil mungkin kurang akurat. Silakan konsultasi ke dokter.':
    'Model confidence is low — results may be less accurate. Please consult a doctor.',
}

/**
 * Translate a question text from Indonesian to English.
 * Returns the original text if no translation found.
 */
export function translateQuestion(text, language) {
  if (language === 'id') return text
  return questionTranslations[text] || text
}

/**
 * Translate an option text from Indonesian to English.
 * Returns the original text if no translation found.
 */
export function translateOption(text, language) {
  if (language === 'id') return text
  return optionTranslations[text] || text
}

/**
 * Translate a recommendation text from Indonesian to English.
 */
export function translateRecommendation(text, language) {
  if (language === 'id') return text
  return recommendationTranslations[text] || text
}

/**
 * Translate a habits title from Indonesian to English.
 */
export function translateHabitsTitle(text, language) {
  if (language === 'id') return text
  return habitsTitleTranslations[text] || text
}

/**
 * Translate a habits item from Indonesian to English.
 */
export function translateHabitsItem(text, language) {
  if (language === 'id') return text
  return habitsItemTranslations[text] || text
}

/**
 * Translate an error message from Indonesian to English.
 */
export function translateError(text, language) {
  if (language === 'id') return text
  return errorTranslations[text] || text
}

/**
 * Translate a warning message from Indonesian to English.
 */
export function translateWarning(text, language) {
  if (language === 'id') return text
  return warningTranslations[text] || text
}
