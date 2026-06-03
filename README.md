# 🩺 GastroCare: Smart Gastric Health Screening

> **Capstone Project Theme:** Healthy Lives & Well-being  
> **Status:** Active / In Development  

## Deskripsi Singkat Proyek
GastroCare adalah platform web berbasis kecerdasan buatan (AI) yang dirancang sebagai solusi *pre-screening* dini untuk gangguan kesehatan lambung (seperti Gastritis, GERD, dan Tukak Lambung). 

Berbeda dengan mesin pencari konvensional yang sering kali memberikan informasi yang terlalu luas dan memicu kecemasan (*cyberchondria*), GastroCare bertindak sebagai *Decision Support System* yang objektif, terarah, dan berbasis data medis yang valid.

---

## 🚀 Fitur Utama

*   **📊 Smart Symptom Questionnaire:** Menggunakan model **Deep Learning** untuk menganalisis korelasi antar gejala yang diinput pengguna, lalu mengklasifikasikan tingkat risiko penyakit lambung secara personal.
*   **📱 Responsive & Clean UI:** Antarmuka kuesioner yang intuitif dan mudah digunakan oleh masyarakat awam untuk mendapatkan *actionable insights* secara cepat.

---

## 🛠️ Petunjuk Setup Environment

### 1. Kebutuhan Sistem (Prerequisites)
Pastikan Anda telah menginstal:
*   **Node.js** (v18 atau lebih baru disarankan)
*   **Python** (v3.10 atau lebih baru disarankan)
*   **PostgreSQL** (Jika menggunakan database lokal)
*   **Git**

### 2. Setup Database
- Buat database baru di PostgreSQL.
- Konfigurasikan file `.env` di folder `backend` dengan URL database Anda.

### 3. Setup Backend (Express.js)
```bash
cd backend
npm install
# Pastikan konfigurasi .env sudah sesuai
npx prisma generate
npx prisma migrate dev
```

### 4. Setup Frontend (React.js)
```bash
cd frontend
npm install
```

### 5. Setup AI/ML Model (FastAPI)
```bash
cd model_ai
python -m venv venv

# Aktivasi virtual environment:
# Untuk Windows:
venv\Scripts\activate
# Untuk Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

---

## 🧠 Tautan Model ML

Model Machine Learning (*Deep Learning Classification*) yang digunakan sudah terintegrasi di dalam repositori ini. 
- **Lokasi File Model:** Terdapat di dalam direktori `model_ai/model_lambung.keras`
- **Cara Memuat (Load) Model:** Model ini secara otomatis dimuat saat menjalankan servis AI (FastAPI) menggunakan library `tensorflow.keras` di dalam file `model_ai/main.py`.

*(Jika Anda perlu mengunduh atau memeriksa model secara terpisah, Anda dapat mengambil file `model_lambung.keras` beserta file pra-pemrosesan data seperti `scaler.pkl` dan `label_encoder.pkl` dari direktori `model_ai/` di repositori ini).*

Link google drive model AI : https://drive.google.com/drive/folders/1Cd2_3BMPGLfB5_DxIw0THcDfooQcy87Z?usp=drive_link

---

## 🏃 Cara Menjalankan Aplikasi

Aplikasi GastroCare terdiri dari 3 layanan utama yang harus dijalankan secara bersamaan di terminal terpisah.

### 1. Menjalankan Backend API
Buka terminal baru dan jalankan:
```bash
cd backend
npm run dev
```

### 2. Menjalankan Frontend Web
Buka terminal baru dan jalankan:
```bash
cd frontend
npm run dev
```

### 3. Menjalankan AI Service
Buka terminal baru dan jalankan:
```bash
cd model_ai
# Pastikan virtual environment sudah diaktifkan (venv\Scripts\activate)
uvicorn main:app --reload
```

Setelah semua layanan berjalan, akses aplikasi utama di browser melalui URL yang diberikan oleh Vite (umumnya: `http://localhost:5173`).

---

## 🛠️ Tech Stack & Sumber Daya

*   **Frontend & Backend:** React.js, Express.js, FastAPI, PostgreSQL
*   **Data Science & AI/ML:** Python, TensorFlow / PyTorch, Scikit-Learn, Vector Database (ChromaDB / Pinecone)
*   **Metode AI:** Deep Learning Classification & Retrieval-Augmented Generation (RAG)

---

## 👥 Tim Capstone (Group Members)

*   **(CFCC620D6Y1342) - Aldiyanson Panji Jawa** | Full-Stack Web Developer
*   **(CFCC193D6Y1162) - Dava Ariel Maulana** | Full-Stack Web Developer
*   **(CDCC959D6X2013) - Natalita Stayvina Suoth** | Data Scientist
*   **(CDCC284D6X1519) - Della Apriliani** | Data Scientist
*   **(CACC009D6Y1349) - Ibnul Mahdi** | AI Engineer
*   **(CACC144D6X0934) - Amelia Rahmasari** | AI Engineer

---
*Disclaimer: GastroCare dikembangkan untuk tujuan edukasi dan skrining awal. Platform ini tidak menggantikan diagnosis, saran, atau pengobatan medis profesional dari dokter.*
