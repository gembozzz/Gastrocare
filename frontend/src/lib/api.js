// ============================================
// GastroCare — Centralized API Client
// ============================================
// Satu-satunya file yang boleh tahu tentang API_BASE,
// HTTP method, dan header. Semua halaman import dari sini.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

/**
 * Internal helper — melakukan HTTP request ke backend.
 *
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method
 * @param {string} endpoint — path relatif (contoh: '/questions')
 * @param {object} [body] — request body (otomatis di-stringify)
 * @returns {Promise<any>} parsed JSON response
 * @throws {Error} dengan pesan yang sudah di-transform sesuai status code
 */
async function request(method, endpoint, body) {
  let response

  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    })
  } catch {
    // Network error — fetch gagal total (offline, DNS, CORS preflight, dll.)
    throw new Error(
      'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    )
  }

  // Parse response body (mungkin kosong)
  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }

  // Jika response OK, kembalikan langsung
  if (response.ok) {
    return data
  }

  // ── Error handling berdasarkan status code ─────────────

  const serverMessage = data?.message

  switch (response.status) {
    case 400:
      throw new Error(serverMessage || 'Permintaan tidak valid.')

    case 401:
      throw new Error('Sesi habis, silakan login kembali.')

    case 429:
      throw new Error('Terlalu banyak permintaan, coba lagi beberapa saat.')

    default:
      if (response.status >= 500) {
        throw new Error('Terjadi kesalahan server. Coba lagi nanti.')
      }
      throw new Error(serverMessage || response.statusText || 'Terjadi kesalahan.')
  }
}

// ── Public API Functions ───────────────────────────────

/**
 * Ambil semua pertanyaan aktif beserta opsinya.
 * @returns {Promise<Array<{id: number, text: string, order: number, options: Array}>>}
 */
export async function getQuestions() {
  const res = await request('GET', '/questions')
  return res.data
}

/**
 * Submit jawaban asesmen ke backend.
 *
 * @param {{
 *   answers: Array<{questionId: number, optionId: number, score: number}>,
 *   userEmail?: string,
 *   userName?: string
 * }} payload
 * @returns {Promise<{id: string, totalScore: number, maxScore: number, percentage: number, riskLevel: string, recommendation: string, habits: object}>}
 */
export async function submitAssessment(payload) {
  const res = await request('POST', '/assessments', payload)
  return res.data
}

/**
 * Ambil detail satu assessment berdasarkan ID.
 * @param {string} id — UUID assessment
 * @returns {Promise<object>}
 */
export async function getAssessmentById(id) {
  const res = await request('GET', `/assessments/${id}`)
  return res.data
}
