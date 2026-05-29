const translations = {
  // ── Navbar ──────────────────────────────────────────
  navbar: {
    id: {
      home: 'Beranda',
      about: 'Tentang',
      questionnaire: 'Kuesioner',
    },
    en: {
      home: 'Home',
      about: 'About',
      questionnaire: 'Questionnaire',
    },
  },

  // ── Footer ──────────────────────────────────────────
  footer: {
    id: {
      text: '© 2026 GastroCare. Hanya untuk tujuan edukasi. Bukan pengganti saran medis profesional.',
    },
    en: {
      text: '© 2026 GastroCare. For educational purposes only. Not a substitute for professional medical advice.',
    },
  },

  // ── HomePage ────────────────────────────────────────
  home: {
    id: {
      badge: 'Asesmen Kesehatan Lambung Berbasis AI',
      heroTitle1: 'Cek Risiko ',
      heroTitleHighlight: 'Penyakit Lambung',
      heroTitle2: ' Anda',
      heroDesc:
        'Isi kuesioner singkat berbasis sains untuk menilai risiko penyakit lambung Anda. Dapatkan analisis dari model AI hanya dalam beberapa menit.',
      startBtn: 'Mulai Kuesioner',
      learnMore: 'Pelajari Lebih Lanjut',
      badgeQuick: 'Hasil Cepat',
      badgePrivate: '100% Privat',
      featuresTitle1: 'Mengapa Menggunakan ',
      featuresTitleHighlight: 'Kuesioner Kami',
      featuresTitle2: '?',
      featuresDesc:
        'Alat asesmen kami dirancang untuk memberikan wawasan cepat dan andal tentang kesehatan pencernaan Anda.',
      feature1Title: 'Cepat & Mudah',
      feature1Desc:
        'Selesaikan asesmen hanya dalam 5 menit dengan pertanyaan sederhana tentang gejala Anda.',
      feature2Title: 'Berbasis AI',
      feature2Desc:
        'Algoritma kami menganalisis respons Anda menggunakan model Deep Learning untuk memberikan hasil yang akurat.',
      feature3Title: 'Privat & Aman',
      feature3Desc:
        'Respons Anda bersifat rahasia dan hanya digunakan untuk memberikan hasil yang dipersonalisasi.',
      ctaTitle: 'Siap Cek Risiko Penyakit Lambung Anda?',
      ctaDesc:
        'Deteksi dini dan kesadaran dapat membantu Anda mengendalikan kesehatan pencernaan.',
      ctaBtn: 'Mulai Sekarang',
    },
    en: {
      badge: 'AI-Based Gastric Health Assessment',
      heroTitle1: 'Check Your ',
      heroTitleHighlight: 'Gastric Disease',
      heroTitle2: ' Risk',
      heroDesc:
        'Take our quick, science-based questionnaire to assess your risk for gastric diseases. Get AI-powered analysis in just a few minutes.',
      startBtn: 'Start Questionnaire',
      learnMore: 'Learn More',
      badgeQuick: 'Quick Results',
      badgePrivate: '100% Private',
      featuresTitle1: 'Why Use Our ',
      featuresTitleHighlight: 'Questionnaire',
      featuresTitle2: '?',
      featuresDesc:
        'Our assessment tool is designed to give you quick, reliable insights about your digestive health.',
      feature1Title: 'Quick & Easy',
      feature1Desc:
        'Complete the assessment in just 5 minutes with simple, clear questions about your symptoms.',
      feature2Title: 'AI-Based',
      feature2Desc:
        'Our algorithm analyzes your responses using a Deep Learning model to provide accurate results.',
      feature3Title: 'Private & Secure',
      feature3Desc:
        'Your responses are confidential and used only to provide you with personalized results.',
      ctaTitle: 'Ready to Check Your Gastric Disease Risk?',
      ctaDesc:
        'Early detection and awareness can help you take control of your digestive health.',
      ctaBtn: 'Get Started Now',
    },
  },

  // ── AboutPage ───────────────────────────────────────
  about: {
    id: {
      headerTitle: 'Kenali Penyakit Lambung',
      headerDesc:
        'Pelajari berbagai penyakit yang dapat menyerang lambung Anda dan pentingnya deteksi dini untuk penanganan yang tepat',
      sectionAboutTitle: 'Tentang Kesehatan Lambung',
      sectionAboutP1:
        'Lambung merupakan organ penting dalam sistem pencernaan yang berperan mencerna makanan menggunakan asam lambung dan enzim. Berbagai faktor seperti pola makan buruk, stres, infeksi bakteri, dan gaya hidup tidak sehat dapat menyebabkan gangguan pada lambung.',
      sectionAboutP2:
        'GastroCare hadir untuk membantu Anda mengenali gejala-gejala awal dari berbagai penyakit lambung. Dengan deteksi dini, Anda dapat segera mengambil langkah penanganan yang tepat sebelum kondisi semakin parah.',
      sectionDiseasesTitle: 'Jenis-jenis Penyakit Lambung',
      sectionDiseasesDesc:
        'Berikut adalah beberapa penyakit lambung yang umum terjadi dan perlu Anda waspadai:',
      diseases: [
        {
          name: 'GERD',
          fullName: 'Gastroesophageal Reflux Disease',
          desc: 'Kondisi kronis di mana asam lambung naik ke kerongkongan, menyebabkan iritasi dan rasa terbakar di dada (heartburn).',
        },
        {
          name: 'Gastritis',
          fullName: 'Radang Lambung',
          desc: 'Peradangan pada lapisan dinding lambung yang bisa bersifat akut maupun kronis, sering disebabkan oleh infeksi bakteri H. pylori atau penggunaan obat anti-inflamasi.',
        },
        {
          name: 'Tukak Lambung',
          fullName: 'Peptic Ulcer Disease',
          desc: 'Luka terbuka yang terbentuk pada lapisan dalam lambung atau usus dua belas jari (duodenum), biasanya disebabkan oleh infeksi H. pylori atau penggunaan NSAID.',
        },
        {
          name: 'Dispepsia',
          fullName: 'Gangguan Pencernaan Fungsional',
          desc: 'Rasa tidak nyaman atau nyeri di perut bagian atas yang berulang, termasuk kembung, mual, dan cepat kenyang, tanpa ditemukan kelainan struktural.',
        },
        {
          name: 'Gastroenteritis',
          fullName: 'Radang Lambung dan Usus',
          desc: 'Infeksi atau peradangan pada lambung dan usus yang menyebabkan diare, mual, muntah, dan kram perut, sering disebabkan oleh virus atau bakteri.',
        },
      ],
      symptoms: [
        { name: 'Nyeri Ulu Hati', desc: 'Rasa sakit atau perih di area perut bagian atas' },
        { name: 'Mual & Muntah', desc: 'Rasa ingin muntah atau muntah berulang' },
        { name: 'Kembung', desc: 'Perut terasa penuh, begah, dan tidak nyaman' },
        { name: 'Heartburn', desc: 'Sensasi terbakar di dada akibat naiknya asam lambung' },
        { name: 'Kehilangan Nafsu Makan', desc: 'Penurunan keinginan makan secara signifikan' },
        { name: 'Perut Begah', desc: 'Cepat merasa kenyang walau makan sedikit' },
        { name: 'Sendawa Berlebih', desc: 'Sendawa terus-menerus setelah makan' },
        { name: 'Gangguan BAB', desc: 'Diare atau perubahan pola buang air besar' },
      ],
      symptomsTitle: 'Gejala Umum Penyakit Lambung',
      riskFactorsTitle: 'Faktor Risiko',
      riskFactorsDesc:
        'Beberapa faktor berikut dapat meningkatkan risiko terkena penyakit lambung:',
      riskFactors: [
        'Pola makan tidak teratur dan sering telat makan',
        'Konsumsi makanan pedas, asam, berlemak, atau berminyak secara berlebihan',
        'Kebiasaan merokok dan konsumsi alkohol',
        'Stres berlebihan dan kurang istirahat',
        'Penggunaan obat anti-inflamasi (NSAID) jangka panjang',
        'Infeksi bakteri Helicobacter pylori (H. pylori)',
        'Obesitas atau kelebihan berat badan',
        'Kebiasaan makan terlalu cepat atau langsung tidur setelah makan',
      ],
      detectionTitle: 'Pentingnya Deteksi Dini',
      detectionDesc:
        'Mengenali gejala penyakit lambung sejak awal sangat penting karena beberapa alasan berikut:',
      detectionPoints: [
        {
          title: 'Mencegah Komplikasi Serius',
          desc: 'Penyakit lambung yang tidak ditangani dapat berkembang menjadi perdarahan saluran cerna, perforasi lambung, atau bahkan kanker lambung.',
        },
        {
          title: 'Meningkatkan Kualitas Hidup',
          desc: 'Penanganan dini dapat memperbaiki pola makan, kualitas tidur, dan aktivitas sehari-hari yang terganggu akibat gejala lambung.',
        },
        {
          title: 'Penanganan Lebih Efektif',
          desc: 'Semakin dini terdeteksi, semakin banyak pilihan pengobatan yang tersedia — mulai dari perubahan gaya hidup hingga terapi medis yang tepat sasaran.',
        },
      ],
      disclaimerLabel: 'Disclaimer Medis:',
      disclaimerText:
        'Kuesioner ini hanya untuk tujuan edukasi dan bukan pengganti saran medis profesional, diagnosis, atau pengobatan. Selalu konsultasikan dengan tenaga kesehatan yang berkualifikasi mengenai kondisi medis Anda.',
    },
    en: {
      headerTitle: 'Understanding Gastric Diseases',
      headerDesc:
        'Learn about various diseases that can affect your stomach and why early detection matters for proper treatment',
      sectionAboutTitle: 'About Gastric Health',
      sectionAboutP1:
        'The stomach is a vital organ in the digestive system that plays a key role in breaking down food using stomach acid and enzymes. Various factors such as poor diet, stress, bacterial infections, and unhealthy lifestyles can cause stomach disorders.',
      sectionAboutP2:
        'GastroCare is here to help you recognize early symptoms of various gastric diseases. With early detection, you can take the right steps for treatment before the condition worsens.',
      sectionDiseasesTitle: 'Types of Gastric Diseases',
      sectionDiseasesDesc:
        'Here are some common gastric diseases that you should be aware of:',
      diseases: [
        {
          name: 'GERD',
          fullName: 'Gastroesophageal Reflux Disease',
          desc: 'A chronic condition where stomach acid flows back into the esophagus, causing irritation and a burning sensation in the chest (heartburn).',
        },
        {
          name: 'Gastritis',
          fullName: 'Stomach Inflammation',
          desc: 'Inflammation of the stomach lining that can be acute or chronic, often caused by H. pylori bacterial infection or use of anti-inflammatory drugs.',
        },
        {
          name: 'Peptic Ulcer',
          fullName: 'Peptic Ulcer Disease',
          desc: 'Open sores that form on the inner lining of the stomach or duodenum, usually caused by H. pylori infection or NSAID use.',
        },
        {
          name: 'Dyspepsia',
          fullName: 'Functional Digestive Disorder',
          desc: 'Recurrent discomfort or pain in the upper abdomen, including bloating, nausea, and early satiety, with no structural abnormalities found.',
        },
        {
          name: 'Gastroenteritis',
          fullName: 'Stomach and Intestinal Inflammation',
          desc: 'Infection or inflammation of the stomach and intestines causing diarrhea, nausea, vomiting, and abdominal cramps, often caused by viruses or bacteria.',
        },
      ],
      symptoms: [
        { name: 'Epigastric Pain', desc: 'Pain or burning in the upper abdomen area' },
        { name: 'Nausea & Vomiting', desc: 'Feeling of wanting to vomit or repeated vomiting' },
        { name: 'Bloating', desc: 'Stomach feels full, distended, and uncomfortable' },
        { name: 'Heartburn', desc: 'Burning sensation in the chest due to acid reflux' },
        { name: 'Loss of Appetite', desc: 'Significant decrease in desire to eat' },
        { name: 'Early Satiety', desc: 'Feeling full quickly even after eating little' },
        { name: 'Excessive Belching', desc: 'Continuous belching after eating' },
        { name: 'Bowel Changes', desc: 'Diarrhea or changes in bowel movement patterns' },
      ],
      symptomsTitle: 'Common Symptoms of Gastric Diseases',
      riskFactorsTitle: 'Risk Factors',
      riskFactorsDesc:
        'The following factors can increase your risk of developing gastric diseases:',
      riskFactors: [
        'Irregular eating patterns and frequently skipping meals',
        'Excessive consumption of spicy, sour, fatty, or oily foods',
        'Smoking and alcohol consumption habits',
        'Excessive stress and lack of rest',
        'Long-term use of anti-inflammatory drugs (NSAIDs)',
        'Helicobacter pylori (H. pylori) bacterial infection',
        'Obesity or being overweight',
        'Eating too fast or lying down immediately after meals',
      ],
      detectionTitle: 'Why Early Detection Matters',
      detectionDesc:
        'Recognizing gastric disease symptoms early is crucial for several reasons:',
      detectionPoints: [
        {
          title: 'Prevent Serious Complications',
          desc: 'Untreated gastric diseases can progress to gastrointestinal bleeding, stomach perforation, or even stomach cancer.',
        },
        {
          title: 'Improve Quality of Life',
          desc: 'Early treatment can improve eating habits, sleep quality, and daily activities disrupted by gastric symptoms.',
        },
        {
          title: 'More Effective Treatment',
          desc: 'The earlier detected, the more treatment options available — from lifestyle changes to targeted medical therapy.',
        },
      ],
      disclaimerLabel: 'Medical Disclaimer:',
      disclaimerText:
        'This questionnaire is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding any medical condition.',
    },
  },

  // ── QuestionnairePage ───────────────────────────────
  questionnaire: {
    id: {
      loadingError: 'Gagal Memuat Pertanyaan',
      loadingErrorDefault: 'Terjadi kesalahan yang tidak diketahui.',
      retryBtn: 'Coba Lagi',
      previousBtn: 'Sebelumnya',
      nextBtn: 'Selanjutnya',
      seeResults: 'Lihat Hasil',
      submitting: 'Mengirim...',
    },
    en: {
      loadingError: 'Failed to Load Questions',
      loadingErrorDefault: 'An unknown error occurred.',
      retryBtn: 'Try Again',
      previousBtn: 'Previous',
      nextBtn: 'Next',
      seeResults: 'See Results',
      submitting: 'Submitting...',
    },
  },

  // ── ResultPage ──────────────────────────────────────
  result: {
    id: {
      backHome: 'Kembali ke Beranda',
      aiResultTitle: 'Hasil Analisis AI',
      aiResultDesc: 'Prediksi menggunakan model Deep Learning',
      confidenceLabel: 'Tingkat Kepercayaan:',
      confidenceDesc1: 'Model AI memprediksi ',
      confidenceDesc2: ' dengan tingkat kepercayaan ',
      top3Title: 'Top 3 Kemungkinan',
      riskLevelLabel: 'Tingkat Risiko:',
      retakeBtn: 'Ulangi Asesmen',
      learnMoreBtn: 'Pelajari Lebih Lanjut',
      disclaimerLabel: 'Disclaimer Medis:',
      disclaimerText:
        'Hasil asesmen ini dihasilkan oleh model AI dan hanya untuk tujuan informasi. Ini BUKAN pengganti diagnosis dari dokter. Silakan konsultasikan dengan tenaga medis profesional untuk diagnosis dan penanganan yang tepat.',
      riskLow: 'Risiko Rendah',
      riskModerate: 'Risiko Sedang',
      riskHigh: 'Risiko Tinggi',
    },
    en: {
      backHome: 'Back to Home',
      aiResultTitle: 'AI Analysis Results',
      aiResultDesc: 'Prediction using Deep Learning model',
      confidenceLabel: 'Confidence Level:',
      confidenceDesc1: 'The AI model predicts ',
      confidenceDesc2: ' with a confidence level of ',
      top3Title: 'Top 3 Possibilities',
      riskLevelLabel: 'Risk Level:',
      retakeBtn: 'Retake Assessment',
      learnMoreBtn: 'Learn More',
      disclaimerLabel: 'Medical Disclaimer:',
      disclaimerText:
        'This assessment result is generated by an AI model and is for informational purposes only. It is NOT a substitute for a doctor\'s diagnosis. Please consult with a healthcare professional for proper diagnosis and treatment.',
      riskLow: 'Low Risk',
      riskModerate: 'Moderate Risk',
      riskHigh: 'High Risk',
    },
  },
}

export function t(section, key, language) {
  const sectionData = translations[section]
  if (!sectionData) return key
  const langData = sectionData[language]
  if (!langData) return key
  return langData[key] !== undefined ? langData[key] : key
}

export default translations
