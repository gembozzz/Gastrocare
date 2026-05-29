# ================================================================
#  FASTAPI — Prediksi Penyakit Lambung
#  Input  : sama persis dengan pilihan di Gradio (kata-kata)
#  Output : prediksi, kepercayaan, top3, semua probabilitas
#
#  Install : pip install fastapi uvicorn tensorflow joblib numpy

#  Attention (jika baru pertama kali)!
#  1. Python 3.11+
#  2. Buat environment baru, jangan lupa install semua dependencies di atas
#     Cara membuat environment baru (venv):
#     Jalankan di terminal: - py -3.11 -m venv venv311
#                           - venv/Scripts/activate (Wajib diaktifkan setiap kali mau jalankan API)
#                           - pip install fastapi uvicorn tensorflow joblib numpy keras==3.13.2
#  Jika sudah jalankan: uvicorn main:app --reload --port 8000
#  Docs    : http://localhost:8000/docs
# ================================================================


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional
import numpy as np
import joblib
import os

# ── Load model dan artefak ───────────────────────────────────────
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, Model

# Custom classes wajib didefinisikan ulang sebelum load model
class ResidualBlock(layers.Layer):
    def __init__(self, units, dropout_rate=0.3, **kwargs):
        super().__init__(**kwargs)
        self.units        = units
        self.dropout_rate = dropout_rate
        self.dense1    = layers.Dense(units, use_bias=False)
        self.bn1       = layers.BatchNormalization()
        self.act1      = layers.Activation('relu')
        self.dropout1  = layers.Dropout(dropout_rate)
        self.dense2    = layers.Dense(units, use_bias=False)
        self.bn2       = layers.BatchNormalization()
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

N_CLASSES = 8  # Sehat + 7 penyakit

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

# Ganti path sesuai lokasi file lo
MODEL_PATH   = 'model_lambung.keras'
SCALER_PATH  = 'scaler.pkl'
LE_PATH      = 'label_encoder.pkl'
IMPUTE_PATH  = 'impute_map.pkl'
FITUR_PATH   = 'features_list.pkl'

model = keras.models.load_model(
    MODEL_PATH,
    custom_objects={'ResidualBlock': ResidualBlock, 'FocalLoss': FocalLoss},
    compile=False  # ← tambahkan ini
    )
scaler      = joblib.load(SCALER_PATH)
le          = joblib.load(LE_PATH)
impute_map  = joblib.load(IMPUTE_PATH)
FITUR_FINAL = joblib.load(FITUR_PATH)
CLASSES     = list(le.classes_)

# ── Skala kata → angka (sama persis dengan Gradio) ───────────────
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

# Mapping fitur → skala yang digunakan
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

# ================================================================
#  PYDANTIC SCHEMA — Input API
# ================================================================
class InputGejala(BaseModel):
    nyeri_ulu_hati: str = Field(
        default="Tidak sama sekali",
        description="Pilihan: " + str(SKALA_INTENSITAS)
    )
    mual: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    muntah: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    kembung: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    heartburn: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    asam_naik_tenggorokan: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    diare: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    demam: str = Field(
        default="Tidak sama sekali",
        description="Pilihan: " + str(SKALA_INTENSITAS)
    )
    penurunan_berat_badan: str = Field(
        default="Tidak",
        description="Pilihan: " + str(SKALA_YA_TIDAK)
    )
    cepat_kenyang: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    muntah_tak_tercerna: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    nyeri_perut_kosong: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    feses_hitam: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FESES)
    )
    riwayat_nsaid: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_NSAID)
    )
    stres_tinggi: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    batuk_kronis: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    suara_serak: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    anemia_lemas: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )
    nafsu_makan_hilang: str = Field(
        default="Tidak sama sekali",
        description="Pilihan: " + str(SKALA_INTENSITAS)
    )
    nyeri_dada: str = Field(
        default="Tidak pernah",
        description="Pilihan: " + str(SKALA_FREKUENSI)
    )

    # Validator: cek setiap field ada di skala yang valid
    @validator('nyeri_ulu_hati')
    def val_nyeri(cls, v):
        if v not in SKALA_INTENSITAS:
            raise ValueError(f"Harus salah satu dari: {SKALA_INTENSITAS}")
        return v

    @validator('mual','muntah','kembung','heartburn','asam_naik_tenggorokan',
               'diare','cepat_kenyang','muntah_tak_tercerna','nyeri_perut_kosong',
               'stres_tinggi','batuk_kronis','suara_serak','anemia_lemas','nyeri_dada',
               pre=True, each_item=False)
    def val_frekuensi(cls, v):
        if v not in SKALA_FREKUENSI:
            raise ValueError(f"Harus salah satu dari: {SKALA_FREKUENSI}")
        return v

    @validator('demam', 'nafsu_makan_hilang')
    def val_intensitas(cls, v):
        if v not in SKALA_INTENSITAS:
            raise ValueError(f"Harus salah satu dari: {SKALA_INTENSITAS}")
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

# ── Output Schema ────────────────────────────────────────────────
class HasilPrediksi(BaseModel):
    prediksi    : str
    kepercayaan : str
    top3        : list
    semua_probabilitas: dict
    peringatan  : Optional[str] = None

# ================================================================
#  LOGIKA PREPROCESSING & PREDIKSI
# ================================================================
def konversi_input(data: InputGejala) -> dict:
    """Konversi kata-kata → angka 0-3 menggunakan skala masing-masing fitur."""
    hasil = {}
    data_dict = data.dict()
    for fitur in FITUR_DASAR:
        pilihan = data_dict[fitur]
        skala   = SKALA_MAP[fitur]
        hasil[fitur] = skala.index(pilihan)
    return hasil

def preprocess_dan_prediksi(jawaban: dict) -> dict:
    f = jawaban.copy()

    # Feature Engineering
    f['gejala_refluks']    = int(f['heartburn'] >= 1 and f['asam_naik_tenggorokan'] >= 1)
    f['gejala_ulkus']      = int(f['nyeri_perut_kosong'] >= 1 and f['feses_hitam'] >= 1)
    f['gejala_infeksi']    = int(f['diare'] >= 1 and f['demam'] >= 1)
    f['gejala_kanker']     = int(f['penurunan_berat_badan'] >= 1 and
                                  f['anemia_lemas'] >= 1 and f['nafsu_makan_hilang'] >= 1)
    f['gejala_motilitas']  = int(f['muntah_tak_tercerna'] >= 1 and f['cepat_kenyang'] >= 1)
    f['gejala_fungsional'] = int(f['kembung'] >= 1 and f['stres_tinggi'] >= 1)
    f['total_gejala']      = sum(f[k] for k in FITUR_DASAR)
    # Tambahan Feature Engineering
    f['skor_gerd']         = f['heartburn'] + f['asam_naik_tenggorokan'] + f['batuk_kronis'] + f['suara_serak'] + f['nyeri_dada']
    f['skor_gastritis']    = f['nyeri_ulu_hati'] + f['mual'] + f['muntah'] + f['kembung'] + f['riwayat_nsaid']
    f['skor_kanker']       = f['penurunan_berat_badan'] + f['anemia_lemas'] + f['nafsu_makan_hilang'] + f['feses_hitam']
    f['skor_infeksi']      = f['diare'] + f['demam'] + f['muntah']

    x     = np.array([[f[k] for k in FITUR_FINAL]], dtype=np.float32)
    x_s   = scaler.transform(x)
    proba = model.predict(x_s, verbose=0)[0]
    idx   = int(np.argmax(proba))
    kelas = le.inverse_transform([idx])[0]

    top3 = sorted(
        [{'kelas': le.inverse_transform([i])[0], 'probabilitas': f"{proba[i]*100:.1f}%"}
         for i in range(len(proba))],
        key=lambda x: float(x['probabilitas'].replace('%', '')), reverse=True
    )[:3]

    semua = {le.inverse_transform([i])[0]: round(float(proba[i]), 4)
             for i in range(len(proba))}

    conf      = float(proba[idx]) * 100
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
#  FASTAPI APP
# ================================================================
app = FastAPI(
    title       = "API Deteksi Penyakit Lambung",
    description = """
API prediksi penyakit lambung menggunakan model Deep Learning MLP (TensorFlow).

**Input:** 20 pertanyaan gejala dengan pilihan kata-kata (sama persis dengan tampilan Gradio).

**Output:** Prediksi penyakit, tingkat kepercayaan model, top-3 kemungkinan, dan semua probabilitas.

**Penyakit yang dapat dideteksi:**
- Sehat
- Gastritis
- Tukak Lambung
- GERD
- Dispepsia Fungsional
- Gastroparesis
- Gastroenteritis
- Kanker Lambung

> ⚠️ Hasil API ini bukan pengganti diagnosis dokter.
    """,
    version     = "1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Endpoint: Health Check ───────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {
        "status" : "online",
        "model"  : "MLP Penyakit Lambung v1.0",
        "kelas"  : CLASSES,
        "docs"   : "/docs"
    }

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "model_loaded": model is not None}

# ── Endpoint: Opsi Pilihan ───────────────────────────────────────
@app.get("/pilihan", tags=["Info"],
         summary="Lihat semua pilihan jawaban per fitur")
def get_pilihan():
    """Kembalikan semua pilihan kata-kata yang valid untuk setiap fitur input."""
    return {fitur: SKALA_MAP[fitur] for fitur in FITUR_DASAR}

# ── Endpoint: Prediksi ───────────────────────────────────────────
@app.post("/predict", response_model=HasilPrediksi, tags=["Prediksi"],
          summary="Prediksi penyakit lambung dari jawaban kuesioner")
def predict_endpoint(data: InputGejala):
    """
    Kirim jawaban kuesioner (20 pertanyaan) dan dapatkan prediksi penyakit lambung.

    Setiap field harus diisi dengan string pilihan yang valid
    (gunakan endpoint **/pilihan** untuk melihat semua opsi).
    """
    try:
        jawaban = konversi_input(data)
        hasil   = preprocess_dan_prediksi(jawaban)
        return HasilPrediksi(**hasil)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Endpoint: Prediksi Batch ─────────────────────────────────────
@app.post("/predict/batch", tags=["Prediksi"],
          summary="Prediksi banyak pasien sekaligus")
def predict_batch(data_list: list[InputGejala]):
    """Prediksi untuk beberapa input sekaligus (maks 50 per request)."""
    if len(data_list) > 50:
        raise HTTPException(status_code=400, detail="Maksimal 50 input per request.")
    hasil_list = []
    for i, data in enumerate(data_list):
        try:
            jawaban = konversi_input(data)
            hasil   = preprocess_dan_prediksi(jawaban)
            hasil_list.append({"index": i, "status": "ok", **hasil})
        except Exception as e:
            hasil_list.append({"index": i, "status": "error", "detail": str(e)})
    return {"total": len(data_list), "hasil": hasil_list}


# ── Jalankan langsung (opsional) ─────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
