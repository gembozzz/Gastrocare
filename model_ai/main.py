# ================================================================
#  FASTAPI — Prediksi Penyakit Lambung + GastroBot RAG (Gemini AI)
#  Versi   : 3.0.0 (dengan RAG berbasis FAISS)
#
#  Setup pertama kali:
#  1. Install dependencies:
#     pip install fastapi uvicorn tensorflow joblib numpy keras==3.13.2
#             google-generativeai python-dotenv faiss-cpu PyMuPDF
#             sentence-transformers
#
#  2. Buat file .env:
#     GEMINI_API_KEY=your_api_key_here
#
#  3. Siapkan folder docs/ berisi file PDF dan/atau .md
#
#  4. Jalankan rag_builder.py SEKALI untuk build index:
#     python rag_builder.py
#
#  5. Jalankan API:
#     venv311\Scripts\activate
#     uvicorn main:app --reload --port 8000
#
#  Docs: http://localhost:8000/docs
# ================================================================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict
import numpy as np
import joblib
import pickle
import os
from dotenv import load_dotenv

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import google.generativeai as genai

# ================================================================
#  CONFIG — Gemini
# ================================================================
load_dotenv()
API_KEY_GEMINI    = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_NAME = "gemini-flash-latest"

genai.configure(api_key=API_KEY_GEMINI)
try:
    gemini_model = genai.GenerativeModel(GEMINI_MODEL_NAME)
    print(f"✅ Gemini siap: {GEMINI_MODEL_NAME}")
except Exception as e:
    gemini_model = None
    print(f"❌ Gagal inisialisasi Gemini: {e}")

# ================================================================
#  CONFIG — RAG (FAISS + SentenceTransformer)
# ================================================================
RAG_INDEX_PATH  = "rag_index.faiss"
RAG_CHUNKS_PATH = "rag_chunks.pkl"
EMBED_MODEL_NAME = "intfloat/multilingual-e5-small"  # ringan, support Bahasa Indonesia
RAG_TOP_K        = 3   # jumlah chunk relevan yang diambil

try:
    import faiss
    from sentence_transformers import SentenceTransformer

    rag_index   = faiss.read_index(RAG_INDEX_PATH)
    with open(RAG_CHUNKS_PATH, "rb") as f:
        rag_chunks = pickle.load(f)
    embed_model = SentenceTransformer(EMBED_MODEL_NAME)
    RAG_AKTIF   = True
    print(f"✅ RAG index dimuat: {len(rag_chunks)} chunk dari {RAG_CHUNKS_PATH}")
except FileNotFoundError:
    rag_index = rag_chunks = embed_model = None
    RAG_AKTIF = False
    print("⚠️  RAG index tidak ditemukan. Jalankan rag_builder.py terlebih dahulu.")
    print("    Chatbot tetap berjalan tanpa RAG (hanya pengetahuan umum Gemini).")
except ImportError as e:
    rag_index = rag_chunks = embed_model = None
    RAG_AKTIF = False
    print(f"⚠️  Library RAG tidak terinstall ({e}). pip install faiss-cpu sentence-transformers")

# ================================================================
#  CUSTOM KERAS CLASSES
# ================================================================
N_CLASSES = 8  # Sehat + 7 penyakit

class ResidualBlock(layers.Layer):
    def __init__(self, units, dropout_rate=0.3, **kwargs):
        super().__init__(**kwargs)
        self.units        = units
        self.dropout_rate = dropout_rate
        self.dense1     = layers.Dense(units, use_bias=False)
        self.bn1        = layers.BatchNormalization()
        self.act1       = layers.Activation('relu')
        self.dropout1   = layers.Dropout(dropout_rate)
        self.dense2     = layers.Dense(units, use_bias=False)
        self.bn2        = layers.BatchNormalization()
        self.projection = layers.Dense(units, use_bias=False)
        self.bn_proj    = layers.BatchNormalization()
        self.act_out    = layers.Activation('relu')

    def call(self, inputs, training=False):
        x    = self.dense1(inputs)
        x    = self.bn1(x, training=training)
        x    = self.act1(x)
        x    = self.dropout1(x, training=training)
        x    = self.dense2(x)
        x    = self.bn2(x, training=training)
        skip = self.projection(inputs)
        skip = self.bn_proj(skip, training=training)
        return self.act_out(x + skip)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'units': self.units, 'dropout_rate': self.dropout_rate})
        return cfg

class FocalLoss(keras.losses.Loss):
    def __init__(self, gamma=3.0, alpha=0.25, name='focal_loss', **kwargs):
        super().__init__(name=name, **kwargs)
        self.gamma = gamma
        self.alpha = alpha

    def call(self, y_true, y_pred):
        y_true_oh = tf.one_hot(tf.cast(y_true, tf.int32), depth=N_CLASSES)
        y_true_oh = tf.cast(y_true_oh, tf.float32)
        y_pred    = tf.clip_by_value(y_pred, 1e-7, 1.0 - 1e-7)
        ce        = -y_true_oh * tf.math.log(y_pred)
        p_t       = tf.reduce_sum(y_true_oh * y_pred, axis=-1, keepdims=True)
        focal     = tf.pow(1.0 - p_t, self.gamma)
        return tf.reduce_mean(tf.reduce_sum(self.alpha * focal * ce, axis=-1))

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'gamma': self.gamma, 'alpha': self.alpha})
        return cfg

# ================================================================
#  LOAD ARTIFACTS ML
# ================================================================
MODEL_PATH  = 'model_lambung.keras'
SCALER_PATH = 'scaler.pkl'
LE_PATH     = 'label_encoder.pkl'
IMPUTE_PATH = 'impute_map.pkl'
FITUR_PATH  = 'features_list.pkl'

try:
    model       = keras.models.load_model(
        MODEL_PATH,
        custom_objects={'ResidualBlock': ResidualBlock, 'FocalLoss': FocalLoss},
        compile=False
    )
    scaler      = joblib.load(SCALER_PATH)
    le          = joblib.load(LE_PATH)
    impute_map  = joblib.load(IMPUTE_PATH)
    FITUR_FINAL = joblib.load(FITUR_PATH)
    CLASSES     = list(le.classes_)
    print(f"✅ Model ML dimuat. Kelas: {CLASSES}")
except FileNotFoundError as e:
    raise RuntimeError(
        f"❌ Artifact tidak ditemukan: {e}\n"
        "Pastikan semua file .keras dan .pkl ada di folder yang sama dengan main.py"
    )

# ================================================================
#  KONSTANTA & MAPPING
# ================================================================
SKALA_INTENSITAS = ["Tidak sama sekali", "Ringan", "Sedang", "Berat / Sangat parah"]
SKALA_FREKUENSI  = ["Tidak pernah", "Kadang-kadang", "Sering", "Hampir selalu"]
SKALA_YA_TIDAK   = ["Tidak", "Ya, sedikit", "Ya, cukup signifikan", "Ya, sangat signifikan"]
SKALA_FESES      = ["Tidak pernah", "Pernah sekali", "Beberapa kali dalam sebulan", "Sering / hampir setiap hari"]
SKALA_NSAID      = ["Tidak pernah", "Sesekali (< 1x/minggu)", "Cukup rutin (1–3x/minggu)", "Sangat rutin (hampir setiap hari)"]

FITUR_DASAR = [
    'nyeri_ulu_hati', 'mual', 'muntah', 'kembung', 'heartburn',
    'asam_naik_tenggorokan', 'diare', 'demam', 'penurunan_berat_badan',
    'cepat_kenyang', 'muntah_tak_tercerna', 'nyeri_perut_kosong',
    'feses_hitam', 'riwayat_nsaid', 'stres_tinggi', 'batuk_kronis',
    'suara_serak', 'anemia_lemas', 'nafsu_makan_hilang', 'nyeri_dada'
]

SKALA_MAP = {
    'nyeri_ulu_hati'       : SKALA_INTENSITAS,
    'mual'                 : SKALA_FREKUENSI,
    'muntah'               : SKALA_FREKUENSI,
    'kembung'              : SKALA_FREKUENSI,
    'heartburn'            : SKALA_FREKUENSI,
    'asam_naik_tenggorokan': SKALA_FREKUENSI,
    'diare'                : SKALA_FREKUENSI,
    'demam'                : SKALA_INTENSITAS,
    'penurunan_berat_badan': SKALA_YA_TIDAK,
    'cepat_kenyang'        : SKALA_FREKUENSI,
    'muntah_tak_tercerna'  : SKALA_FREKUENSI,
    'nyeri_perut_kosong'   : SKALA_FREKUENSI,
    'feses_hitam'          : SKALA_FESES,
    'riwayat_nsaid'        : SKALA_NSAID,
    'stres_tinggi'         : SKALA_FREKUENSI,
    'batuk_kronis'         : SKALA_FREKUENSI,
    'suara_serak'          : SKALA_FREKUENSI,
    'anemia_lemas'         : SKALA_FREKUENSI,
    'nafsu_makan_hilang'   : SKALA_INTENSITAS,
    'nyeri_dada'           : SKALA_FREKUENSI,
}

NILAI_NORMAL = {
    'nyeri_ulu_hati'       : "Tidak sama sekali",
    'mual'                 : "Tidak pernah",
    'muntah'               : "Tidak pernah",
    'kembung'              : "Tidak pernah",
    'heartburn'            : "Tidak pernah",
    'asam_naik_tenggorokan': "Tidak pernah",
    'diare'                : "Tidak pernah",
    'demam'                : "Tidak sama sekali",
    'penurunan_berat_badan': "Tidak",
    'cepat_kenyang'        : "Tidak pernah",
    'muntah_tak_tercerna'  : "Tidak pernah",
    'nyeri_perut_kosong'   : "Tidak pernah",
    'feses_hitam'          : "Tidak pernah",
    'riwayat_nsaid'        : "Tidak pernah",
    'stres_tinggi'         : "Tidak pernah",
    'batuk_kronis'         : "Tidak pernah",
    'suara_serak'          : "Tidak pernah",
    'anemia_lemas'         : "Tidak pernah",
    'nafsu_makan_hilang'   : "Tidak sama sekali",
    'nyeri_dada'           : "Tidak pernah",
}

# ================================================================
#  PYDANTIC SCHEMAS
# ================================================================
class InputGejala(BaseModel):
    nyeri_ulu_hati        : str = Field(default="Tidak sama sekali", description="Pilihan: " + str(SKALA_INTENSITAS))
    mual                  : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    muntah                : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    kembung               : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    heartburn             : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    asam_naik_tenggorokan : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    diare                 : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    demam                 : str = Field(default="Tidak sama sekali", description="Pilihan: " + str(SKALA_INTENSITAS))
    penurunan_berat_badan : str = Field(default="Tidak",             description="Pilihan: " + str(SKALA_YA_TIDAK))
    cepat_kenyang         : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    muntah_tak_tercerna   : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    nyeri_perut_kosong    : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    feses_hitam           : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FESES))
    riwayat_nsaid         : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_NSAID))
    stres_tinggi          : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    batuk_kronis          : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    suara_serak           : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    anemia_lemas          : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))
    nafsu_makan_hilang    : str = Field(default="Tidak sama sekali", description="Pilihan: " + str(SKALA_INTENSITAS))
    nyeri_dada            : str = Field(default="Tidak pernah",      description="Pilihan: " + str(SKALA_FREKUENSI))

    @validator('nyeri_ulu_hati', 'demam', 'nafsu_makan_hilang')
    def val_intensitas(cls, v):
        if v not in SKALA_INTENSITAS:
            raise ValueError(f"Harus salah satu dari: {SKALA_INTENSITAS}")
        return v

    @validator(
        'mual', 'muntah', 'kembung', 'heartburn', 'asam_naik_tenggorokan',
        'diare', 'cepat_kenyang', 'muntah_tak_tercerna', 'nyeri_perut_kosong',
        'stres_tinggi', 'batuk_kronis', 'suara_serak', 'anemia_lemas', 'nyeri_dada',
        pre=True, each_item=False
    )
    def val_frekuensi(cls, v):
        if v not in SKALA_FREKUENSI:
            raise ValueError(f"Harus salah satu dari: {SKALA_FREKUENSI}")
        return v

    @validator('penurunan_berat_badan')
    def val_ya_tidak(cls, v):
        if v not in SKALA_YA_TIDAK:
            raise ValueError(f"Harus salah satu dari: {SKALA_YA_TIDAK}")
        return v

    @validator('feses_hitam')
    def val_feses(cls, v):
        if v not in SKALA_FESES:
            raise ValueError(f"Harus salah satu dari: {SKALA_FESES}")
        return v

    @validator('riwayat_nsaid')
    def val_nsaid(cls, v):
        if v not in SKALA_NSAID:
            raise ValueError(f"Harus salah satu dari: {SKALA_NSAID}")
        return v

    class Config:
        schema_extra = {
            "example": {
                "nyeri_ulu_hati"       : "Sedang",
                "mual"                 : "Sering",
                "muntah"               : "Tidak pernah",
                "kembung"              : "Sering",
                "heartburn"            : "Hampir selalu",
                "asam_naik_tenggorokan": "Hampir selalu",
                "diare"                : "Tidak pernah",
                "demam"                : "Tidak sama sekali",
                "penurunan_berat_badan": "Tidak",
                "cepat_kenyang"        : "Tidak pernah",
                "muntah_tak_tercerna"  : "Tidak pernah",
                "nyeri_perut_kosong"   : "Tidak pernah",
                "feses_hitam"          : "Tidak pernah",
                "riwayat_nsaid"        : "Tidak pernah",
                "stres_tinggi"         : "Kadang-kadang",
                "batuk_kronis"         : "Sering",
                "suara_serak"          : "Sering",
                "anemia_lemas"         : "Tidak pernah",
                "nafsu_makan_hilang"   : "Tidak sama sekali",
                "nyeri_dada"           : "Sering"
            }
        }

class PredictionDetail(BaseModel):
    kelas        : str
    probabilitas : str

class HasilPrediksi(BaseModel):
    prediksi           : str
    kepercayaan        : str
    top3               : List[PredictionDetail]
    semua_probabilitas : Dict[str, float]
    gejala_input       : Dict[str, str]
    peringatan         : Optional[str] = None

class ChatRequest(BaseModel):
    message            : str
    history_prediction : HasilPrediksi

# ================================================================
#  PREPROCESSING & PREDIKSI
# ================================================================
def konversi_input(data: InputGejala) -> tuple[dict, dict]:
    """Konversi kata-kata → angka 0-3, fallback ke impute_map jika nilai tak dikenal."""
    hasil     = {}
    data_dict = data.dict()
    for fitur in FITUR_DASAR:
        pilihan = data_dict[fitur]
        skala   = SKALA_MAP[fitur]
        hasil[fitur] = skala.index(pilihan) if pilihan in skala else impute_map.get(fitur, 0)
    return hasil, data_dict

def preprocess_dan_prediksi(jawaban: dict) -> dict:
    f = jawaban.copy()

    # Feature Engineering
    f['gejala_refluks']    = int(f['heartburn'] >= 1 and f['asam_naik_tenggorokan'] >= 1)
    f['gejala_ulkus']      = int(f['nyeri_perut_kosong'] >= 1 and f['feses_hitam'] >= 1)
    f['gejala_infeksi']    = int(f['diare'] >= 1 and f['demam'] >= 1)
    f['gejala_kanker']     = int(f['penurunan_berat_badan'] >= 1 and f['anemia_lemas'] >= 1 and f['nafsu_makan_hilang'] >= 1)
    f['gejala_motilitas']  = int(f['muntah_tak_tercerna'] >= 1 and f['cepat_kenyang'] >= 1)
    f['gejala_fungsional'] = int(f['kembung'] >= 1 and f['stres_tinggi'] >= 1)
    f['total_gejala']      = sum(f[k] for k in FITUR_DASAR)
    f['skor_gerd']         = f['heartburn'] + f['asam_naik_tenggorokan'] + f['batuk_kronis'] + f['suara_serak'] + f['nyeri_dada']
    f['skor_gastritis']    = f['nyeri_ulu_hati'] + f['mual'] + f['muntah'] + f['kembung'] + f['riwayat_nsaid']
    f['skor_kanker']       = f['penurunan_berat_badan'] + f['anemia_lemas'] + f['nafsu_makan_hilang'] + f['feses_hitam']
    f['skor_infeksi']      = f['diare'] + f['demam'] + f['muntah']

    x     = np.array([[f[k] for k in FITUR_FINAL]], dtype=np.float32)
    x_s   = scaler.transform(x)
    proba = model.predict(x_s, verbose=0)[0]
    idx   = int(np.argmax(proba))
    kelas = le.inverse_transform([idx])[0]
    conf  = float(proba[idx]) * 100

    top3 = sorted(
        [{'kelas': le.inverse_transform([i])[0], 'probabilitas': f"{proba[i]*100:.1f}%"}
         for i in range(len(proba))],
        key=lambda x: float(x['probabilitas'].replace('%', '')),
        reverse=True
    )[:3]

    semua      = {le.inverse_transform([i])[0]: round(float(proba[i]), 4) for i in range(len(proba))}
    peringatan = None
    if conf < 40.0 and kelas != 'Sehat':
        peringatan = f"⚠️ Confidence rendah ({conf:.1f}%) — gejala tidak khas satu penyakit. Disarankan konsultasi dokter."

    return {
        'prediksi'          : kelas,
        'kepercayaan'       : f"{conf:.1f}%",
        'top3'              : top3,
        'semua_probabilitas': semua,
        'peringatan'        : peringatan,
    }

# ================================================================
#  RAG — RETRIEVAL
# ================================================================
def retrieve_docs(query: str, top_k: int = RAG_TOP_K) -> list[dict]:
    """Cari chunk paling relevan dari FAISS index berdasarkan query."""
    if not RAG_AKTIF:
        return []
    vec = embed_model.encode(
        [f"query: {query}"],   # prefix 'query:' sesuai format multilingual-e5
        normalize_embeddings=True
    )
    distances, indices = rag_index.search(vec, top_k)
    hasil = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx < len(rag_chunks) and dist > 0.3:  # filter chunk yang kurang relevan (skor < 0.3)
            hasil.append({**rag_chunks[idx], "skor": round(float(dist), 3)})
    return hasil

# ================================================================
#  FASTAPI APP
# ================================================================
app = FastAPI(
    title       = "API Deteksi Penyakit Lambung + GastroBot RAG",
    description = """
API prediksi penyakit lambung menggunakan Deep Learning (MLP + ResidualBlock)
dan GastroBot berbasis **Gemini AI + RAG** (Retrieval-Augmented Generation).

GastroBot menjawab berdasarkan dokumen referensi medis yang kamu sediakan,
bukan hanya pengetahuan umum model.

**Penyakit yang dapat dideteksi:**
Sehat · Gastritis · Tukak Lambung · GERD · Dispepsia Fungsional · Gastroparesis · Gastroenteritis · Kanker Lambung

> ⚠️ Hasil API ini **bukan pengganti diagnosis dokter**.
    """,
    version     = "3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Ganti dengan domain spesifik saat production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================================================
#  ENDPOINTS — HEALTH & INFO
# ================================================================
@app.get("/", tags=["Health"])
def root():
    return {
        "status"     : "online",
        "versi"      : "3.0.0",
        "model_ml"   : "MLP Penyakit Lambung",
        "chatbot"    : "GastroBot (Gemini + RAG)",
        "rag_aktif"  : RAG_AKTIF,
        "rag_chunks" : len(rag_chunks) if rag_chunks else 0,
        "kelas"      : CLASSES,
        "docs"       : "/docs",
    }

@app.get("/health", tags=["Health"])
def health():
    return {
        "status"        : "ok",
        "model_loaded"  : model is not None,
        "gemini_loaded" : gemini_model is not None,
        "rag_aktif"     : RAG_AKTIF,
        "rag_chunks"    : len(rag_chunks) if rag_chunks else 0,
    }

@app.get("/pilihan", tags=["Info"], summary="Lihat semua pilihan jawaban per fitur")
def get_pilihan():
    """Kembalikan semua pilihan kata-kata yang valid untuk setiap fitur input."""
    return {fitur: SKALA_MAP[fitur] for fitur in FITUR_DASAR}

# ================================================================
#  ENDPOINTS — PREDIKSI
# ================================================================
@app.post("/predict", response_model=HasilPrediksi, tags=["Prediksi"],
          summary="Prediksi penyakit lambung dari jawaban kuesioner")
def predict_endpoint(data: InputGejala):
    """
    Kirim 20 jawaban kuesioner gejala dan dapatkan prediksi penyakit lambung.
    Gunakan **/pilihan** untuk melihat semua opsi jawaban yang valid.
    """
    try:
        jawaban, data_dict = konversi_input(data)
        hasil              = preprocess_dan_prediksi(jawaban)
        hasil['gejala_input'] = data_dict
        return HasilPrediksi(**hasil)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/batch", tags=["Prediksi"], summary="Prediksi banyak pasien sekaligus")
def predict_batch(data_list: list[InputGejala]):
    """Prediksi untuk beberapa input sekaligus (maks 50 per request)."""
    if len(data_list) > 50:
        raise HTTPException(status_code=400, detail="Maksimal 50 input per request.")
    hasil_list = []
    for i, data in enumerate(data_list):
        try:
            jawaban, data_dict = konversi_input(data)
            hasil              = preprocess_dan_prediksi(jawaban)
            hasil['gejala_input'] = data_dict
            hasil_list.append({"index": i, "status": "ok", **hasil})
        except Exception as e:
            hasil_list.append({"index": i, "status": "error", "detail": str(e)})
    return {"total": len(data_list), "hasil": hasil_list}

# ================================================================
#  ENDPOINT — CHATBOT (Gemini + RAG)
# ================================================================
@app.post("/chat", tags=["Chatbot"], summary="Tanya GastroBot seputar kondisi lambung")
async def chat_endpoint(request: ChatRequest):
    """
    GastroBot menjawab pertanyaan berdasarkan:
    - Dokumen referensi medis (RAG)
    - Hasil prediksi pasien
    - Gejala aktif pasien

    Kirim `message` (pertanyaan) dan `history_prediction` (hasil dari /predict).
    """
    if gemini_model is None:
        raise HTTPException(
            status_code=503,
            detail="GastroBot tidak tersedia. Periksa GEMINI_API_KEY di file .env."
        )

    try:
        pred = request.history_prediction

        # Gejala yang aktif (bukan nilai normal)
        gejala_aktif = [
            k.replace('_', ' ').title()
            for k, v in pred.gejala_input.items()
            if v not in NILAI_NORMAL.values()
        ]

        # Sanitasi input (cegah prompt injection sederhana)
        pesan_user = request.message[:500].replace("{", "").replace("}", "")

        # ── RAG: ambil dokumen relevan ──────────────────────────
        # Query dibuat lebih kaya dengan menggabungkan pertanyaan + nama penyakit
        query_rag  = f"{pesan_user} {pred.prediksi} lambung"
        docs       = retrieve_docs(query_rag)

        if docs:
            bagian_rag = "\n\n".join(
                f"[Sumber: {d['sumber']} | Relevansi: {d['skor']}]\n{d['teks']}"
                for d in docs
            )
            instruksi_sumber = (
                "Jawab HANYA apa yang ditanyakan pasien, tidak lebih. "
                "Jangan tambahkan penjelasan yang tidak diminta. "
                "Gunakan informasi dari dokumen referensi di atas sebagai sumber jawaban. "
                "Sebutkan sumber dokumen yang kamu gunakan jika relevan."
            )
        else:
            bagian_rag = "Tidak ada dokumen referensi yang relevan ditemukan."
            instruksi_sumber = (
                "Tidak ada dokumen referensi yang tersedia. "
                "Jawab berdasarkan pengetahuan medis umum, tapi sampaikan bahwa ini bukan dari panduan spesifik."
            )

        # ── Susun konteks pasien ────────────────────────────────
        konteks_pasien = f"""
PREDIKSI  : {pred.prediksi} ({pred.kepercayaan})
TOP 3     : {', '.join([f"{t.kelas} ({t.probabilitas})" for t in pred.top3])}
GEJALA    : {', '.join(gejala_aktif) if gejala_aktif else 'Tidak ada gejala signifikan'}
PERINGATAN: {pred.peringatan if pred.peringatan else 'Tidak ada'}
        """.strip()

        # ── Prompt final ────────────────────────────────────────
        full_prompt = f"""
Anda adalah GastroBot, asisten AI medis yang hangat dan berempati, spesialis penyakit lambung.

=== DOKUMEN REFERENSI MEDIS ===
{bagian_rag}

=== DATA PASIEN ===
{konteks_pasien}

=== PERTANYAAN PASIEN ===
{pesan_user}

=== PANDUAN MENJAWAB ===
1. {instruksi_sumber}
2. Jawab FOKUS pada pertanyaan — jangan jelaskan hal yang tidak ditanya.
3. Gunakan bahasa yang mudah dipahami, hindari jargon berlebihan.
4. Berikan saran pola makan dan gaya hidup yang relevan dengan kondisi pasien.
5. Jika ada gejala berbahaya (feses hitam, penurunan berat badan signifikan, anemia),
   tekankan untuk segera ke dokter.
6. WAJIB akhiri dengan:
   "⚠️ Informasi ini bersifat edukatif dan bukan pengganti diagnosis dokter. Selalu konsultasikan kondisi Anda ke tenaga medis."
        """.strip()

        response = gemini_model.generate_content(full_prompt)

        return {
            "reply"      : response.text,
            "rag_aktif"  : RAG_AKTIF,
            "docs_dipakai": [{"sumber": d["sumber"], "skor": d["skor"]} for d in docs],
        }

    except Exception as e:
        print(f"[ERROR /chat] {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gagal memanggil GastroBot: {str(e)}")

# ================================================================
#  JALANKAN LANGSUNG (opsional)
# ================================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
