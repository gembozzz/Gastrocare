# ================================================================
#  RAG BUILDER — Build FAISS index dari dokumen PDF dan Markdown
#  Jalankan SEKALI sebelum menjalankan main.py, atau setiap kali
#  kamu menambah/mengubah dokumen di folder docs/
#
#  Install dependencies:
#  pip install faiss-cpu PyMuPDF sentence-transformers
#
#  Cara pakai:
#  python rag_builder.py
#
#  Output:
#  - rag_index.faiss   → vector index (dibaca oleh main.py)
#  - rag_chunks.pkl    → metadata chunk (teks + nama sumber)
# ================================================================

import faiss
import pickle
import fitz          # PyMuPDF — untuk baca PDF
from pathlib import Path
from sentence_transformers import SentenceTransformer

# ── Konfigurasi ───────────────────────────────────────────────────
DOCS_DIR     = "docs/"               # Taruh PDF dan .md kamu di sini
INDEX_PATH   = "rag_index.faiss"     # Output: FAISS index
CHUNKS_PATH  = "rag_chunks.pkl"      # Output: metadata chunk
EMBED_MODEL  = "intfloat/multilingual-e5-small"  # Model embedding, support Bahasa Indonesia

# Ukuran chunk: 400 kata, overlap 80 kata antar chunk
# Overlap mencegah konteks terpotong di tengah kalimat penting
CHUNK_SIZE   = 400
CHUNK_OVERLAP = 80

# ── Fungsi Baca Dokumen ───────────────────────────────────────────
def baca_pdf(path: Path) -> str:
    """Ekstrak teks dari semua halaman PDF."""
    doc   = fitz.open(str(path))
    teks  = "\n".join(page.get_text() for page in doc)
    doc.close()
    return teks

def baca_markdown(path: Path) -> str:
    """Baca file markdown sebagai plain text."""
    return path.read_text(encoding="utf-8")

# ── Fungsi Chunking ───────────────────────────────────────────────
def chunking(teks: str, ukuran: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """
    Potong teks menjadi chunk berdasarkan jumlah kata.
    Overlap memastikan konteks tidak hilang di batas chunk.
    """
    words  = teks.split()
    chunks = []
    step   = ukuran - overlap
    for i in range(0, len(words), step):
        chunk = " ".join(words[i : i + ukuran])
        if len(chunk.strip()) > 50:   # skip chunk yang terlalu pendek (noise)
            chunks.append(chunk)
    return chunks

# ── Main: Kumpulkan semua chunk ───────────────────────────────────
print(f"📂 Membaca dokumen dari folder: {DOCS_DIR}")

docs_dir   = Path(DOCS_DIR)
all_chunks = []
file_count = 0

if not docs_dir.exists():
    docs_dir.mkdir(parents=True)
    print(f"⚠️  Folder '{DOCS_DIR}' belum ada, sudah dibuat.")
    print("    Masukkan file PDF dan/atau .md ke dalamnya, lalu jalankan script ini lagi.")
    exit()

for file in sorted(docs_dir.iterdir()):
    if file.suffix.lower() == ".pdf":
        print(f"  📄 PDF  : {file.name}")
        teks = baca_pdf(file)
    elif file.suffix.lower() in (".md", ".txt"):
        print(f"  📝 Teks : {file.name}")
        teks = baca_markdown(file)
    else:
        continue   # skip file lain (.docx, .jpg, dll)

    chunks     = chunking(teks)
    file_count += 1
    print(f"         → {len(chunks)} chunk")

    for chunk in chunks:
        all_chunks.append({
            "sumber": file.name,
            "teks"  : chunk,
        })

print(f"\n✅ Total: {file_count} file, {len(all_chunks)} chunk\n")

if len(all_chunks) == 0:
    print("❌ Tidak ada chunk yang dihasilkan. Pastikan folder docs/ berisi file PDF atau .md.")
    exit()

# ── Buat Embedding ────────────────────────────────────────────────
print(f"🔄 Load model embedding: {EMBED_MODEL}")
embed_model = SentenceTransformer(EMBED_MODEL)

# Prefix 'passage:' adalah format yang disyaratkan multilingual-e5
# untuk teks yang diindeks (berbeda dengan 'query:' saat retrieval)
teks_list = [f"passage: {c['teks']}" for c in all_chunks]

print(f"🔄 Membuat embedding untuk {len(teks_list)} chunk...")
vectors = embed_model.encode(
    teks_list,
    batch_size=64,
    show_progress_bar=True,
    normalize_embeddings=True    # normalize → bisa pakai IndexFlatIP sebagai cosine similarity
)

# ── Build FAISS Index ─────────────────────────────────────────────
dim   = vectors.shape[1]
index = faiss.IndexFlatIP(dim)   # Inner Product = cosine similarity (karena sudah normalized)
index.add(vectors)

print(f"\n✅ FAISS index dibuat: {index.ntotal} vektor, dimensi {dim}")

# ── Simpan ke Disk ────────────────────────────────────────────────
faiss.write_index(index, INDEX_PATH)
with open(CHUNKS_PATH, "wb") as f:
    pickle.dump(all_chunks, f)

print(f"💾 Tersimpan:")
print(f"   - {INDEX_PATH}")
print(f"   - {CHUNKS_PATH}")
print(f"\n🚀 Selesai! Sekarang jalankan: uvicorn main:app --reload --port 8000")
