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
  'Kabar baik! Dari keluhan yang Anda sampaikan, kondisi lambung Anda saat ini tampak sehat dan berfungsi dengan baik. Pertahankan terus gaya hidup dan pola makan sehat Anda agar pencernaan selalu nyaman dan terjaga.':
    'Great news! Based on the symptoms you shared, your stomach currently appears to be healthy and functioning well. Keep up your healthy lifestyle and diet so your digestion remains comfortable and well-maintained.',

  'Berdasarkan keluhan yang Anda rasakan, kami melihat ada indikasi ke arah Gastritis (radang lambung). Jangan terlalu khawatir, kondisi ini sangat umum terjadi. Namun, untuk memastikan kenyamanan Anda, kami sangat menyarankan Anda untuk berdiskusi dengan dokter agar mendapatkan penanganan yang paling tepat.':
    'Based on the symptoms you are experiencing, we see indications pointing towards Gastritis (stomach inflammation). Don\'t worry too much, this condition is very common. However, to ensure your comfort, we highly recommend discussing this with a doctor to get the most appropriate treatment.',

  'Melihat dari keluhan yang Anda sampaikan, gejala tersebut mengarah pada kemungkinan Tukak Lambung. Kami memahami hal ini mungkin membuat Anda kurang nyaman. Oleh karena itu, sangat penting bagi Anda untuk segera berkonsultasi dengan dokter spesialis, agar Anda bisa mendapatkan perawatan yang tepat dan segera kembali pulih.':
    'Looking at the symptoms you shared, they point to the possibility of a Peptic Ulcer. We understand this might make you uncomfortable. Therefore, it is crucial for you to immediately consult a specialist so you can receive the right treatment and recover soon.',

  'Dari pola gejala yang Anda bagikan, sepertinya Anda mungkin sedang mengalami GERD (asam lambung naik). Kondisi ini memang kerap mengganggu kenyamanan sehari-hari. Kami sarankan Anda untuk memeriksakannya ke dokter, karena dengan penyesuaian gaya hidup dan pengobatan yang tepat, kondisi ini bisa diatasi dengan baik.':
    'From the symptom pattern you shared, it seems you might be experiencing GERD (acid reflux). This condition can indeed disrupt daily comfort. We suggest getting it checked by a doctor, because with the right lifestyle adjustments and treatment, it can be managed very well.',

  'Keluhan yang Anda rasakan mengindikasikan adanya kemungkinan Dispepsia Fungsional. Kondisi ini sering kali berkaitan erat dengan tingkat stres dan pola makan yang tidak menentu. Cobalah untuk lebih rileks dan perlahan atur kembali jadwal makan Anda. Jika keluhan masih berlanjut, jangan ragu untuk berkonsultasi dengan dokter.':
    'Your symptoms indicate the possibility of Functional Dyspepsia. This condition is often closely related to stress levels and irregular eating habits. Try to relax more and slowly regulate your meal schedule. If symptoms persist, don\'t hesitate to consult a doctor.',

  'Kami memperhatikan bahwa gejala yang Anda alami menunjukkan indikasi Gastroparesis (perlambatan pengosongan lambung). Agar kondisi pencernaan Anda tidak semakin mengganggu aktivitas, kami sangat menyarankan Anda untuk segera menemui dokter spesialis agar mendapat evaluasi dan solusi yang terbaik untuk Anda.':
    'We noticed that your symptoms show indications of Gastroparesis (delayed stomach emptying). So that your digestive condition does not further disrupt your activities, we strongly advise you to see a specialist soon to get the best evaluation and solution for you.',

  'Dari gejala yang muncul, sepertinya pencernaan Anda sedang mengalami infeksi ringan atau Gastroenteritis. Yang paling penting saat ini adalah menjaga tubuh Anda tetap terhidrasi dengan baik. Mohon segera periksakan diri ke dokter jika kondisi belum membaik, agar Anda bisa cepat kembali beraktivitas dengan nyaman.':
    'From the symptoms that appear, it seems your digestion is experiencing a mild infection or Gastroenteritis. The most important thing right now is to keep your body well-hydrated. Please see a doctor promptly if the condition does not improve, so you can quickly return to your activities comfortably.',

  'Terima kasih sudah berbagi keluhan Anda dengan kami. Beberapa gejala yang Anda sampaikan merupakan sinyal penting dari tubuh yang memerlukan perhatian ekstra dan evaluasi medis lebih lanjut. Kami sangat menganjurkan Anda untuk segera memeriksakan diri ke dokter spesialis guna memastikan kondisi Anda secara menyeluruh. Pemeriksaan lebih awal adalah langkah pencegahan yang sangat bijak.':
    'Thank you for sharing your symptoms with us. Some of the symptoms you mentioned are important signals from your body that require extra attention and further medical evaluation. We strongly encourage you to immediately see a specialist to thoroughly check your condition. Early examination is a very wise preventive step.',
}

// ── Habits Title Translations ────────────────────────

const habitsTitleTranslations = {
  'Beberapa tips untuk menjaga lambung Anda tetap sehat:': 'Some tips to keep your stomach healthy:',
  'Langkah-langkah yang bisa Anda lakukan mulai sekarang:': 'Steps you can start taking right now:',
  'Tindakan penting untuk pemulihan Anda:': 'Important actions for your recovery:',
  'Langkah-langkah untuk mengurangi keluhan:': 'Steps to reduce your discomfort:',
  'Tips untuk membuat perut terasa lebih nyaman:': 'Tips to make your stomach feel more comfortable:',
  'Langkah-langkah yang sangat kami sarankan:': 'Steps we highly recommend:',
  'Perawatan mandiri yang bisa Anda terapkan:': 'Self-care practices you can apply:',
  '⚠️ Tindakan segera yang perlu Anda ambil:': '⚠️ Immediate actions you need to take:',
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

const warningTranslationsId = {
  'Kepercayaan model rendah — hasil mungkin kurang akurat. Silakan konsultasi ke dokter.':
    'Sistem mendeteksi bahwa informasi yang diberikan mungkin belum cukup untuk analisis yang sangat akurat. Untuk kenyamanan Anda, kami sangat menyarankan untuk berdiskusi dengan dokter.',
}

const warningTranslationsEn = {
  'Kepercayaan model rendah — hasil mungkin kurang akurat. Silakan konsultasi ke dokter.':
    'Our analysis indicates that the provided information might not be sufficient for a highly accurate result. For your peace of mind, we highly recommend discussing this with a doctor.',
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
 * Translate a warning message from Indonesian to English (or softened Indonesian).
 */
export function translateWarning(text, language) {
  if (language === 'id') return warningTranslationsId[text] || text
  return warningTranslationsEn[text] || text
}
