from pydantic import BaseModel
from typing import List

# 1. Format untuk hasil prediksi (digunakan di dalam ChatRequest)
class PredictionResult(BaseModel):
    label: str
    confidence: float

# 2. Format untuk Input Chatbot
class ChatRequest(BaseModel):
    message: str
    prediction_context: List[PredictionResult]

# 3. Format untuk Input Screening (20 Soal)
# Ini opsional, tapi bagus supaya main.py kamu lebih rapi
class ScreeningRequest(BaseModel):
    answers: List[int] # Berisi 20 angka (0 atau 1)