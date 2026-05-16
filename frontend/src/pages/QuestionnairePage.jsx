import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import QuestionCard from '../components/QuestionCard'
import { questions as fallbackQuestions } from '../data/questions'
import { getQuestions, submitAssessment } from '../lib/api'

function QuestionnairePage() {
  const [questions, setQuestions] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // ── Fetch pertanyaan dari API ────────────────────────

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getQuestions()

      if (data && data.length > 0) {
        // Transform API format → format yang dipakai QuestionCard
        const transformed = data.map((q) => ({
          id: q.id,
          question: q.text,
          options: q.options,
        }))
        setQuestions(transformed)
        setAnswers(Array(transformed.length).fill(null))
      } else {
        throw new Error('Tidak ada pertanyaan yang tersedia.')
      }
    } catch (err) {
      console.warn('API fetch gagal, gunakan data lokal:', err.message)

      // Fallback ke data lokal
      if (fallbackQuestions && fallbackQuestions.length > 0) {
        const transformed = fallbackQuestions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options.map((text, i) => ({
            id: i + 1,
            text,
            score: i,
            order: i + 1,
          })),
        }))
        setQuestions(transformed)
        setAnswers(Array(transformed.length).fill(null))
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  // ── Handlers ─────────────────────────────────────────

  const handleSelectAnswer = (optionIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setError(null)
      return
    }

    // ── Pertanyaan terakhir: submit ke API ──────────────
    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        answers: questions.map((q, i) => ({
          questionId: q.id,
          optionId: q.options[answers[i]].id,
          score: answers[i],
        })),
      }

      const result = await submitAssessment(payload)
      navigate('/result', { state: { result } })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setError(null)
    }
  }

  // ── Loading state ────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/30 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <Card className="p-8 sm:p-10 mb-8" hover={false}>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-5/6" />
            </div>
            <div className="mt-8 space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // ── Error state (gagal total, tanpa fallback) ────────

  if (!questions) {
    return (
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/30 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Card className="p-8 sm:p-10 text-center" hover={false}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Gagal Memuat Pertanyaan</h2>
            <p className="text-sm text-gray-500 mb-6">{error || 'Terjadi kesalahan yang tidak diketahui.'}</p>
            <Button onClick={fetchQuestions} id="btn-retry">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Coba Lagi
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // ── Render kuesioner ─────────────────────────────────

  const isLastQuestion = currentQuestion === questions.length - 1
  const isFirstQuestion = currentQuestion === 0
  const hasAnswer = answers[currentQuestion] !== null

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/30 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar current={currentQuestion + 1} total={questions.length} />
        </div>

        {/* Question Card */}
        <Card className="p-8 sm:p-10 mb-8" hover={false} id="questionnaire-card">
          <QuestionCard
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options.map((opt) => opt.text)}
            selectedAnswer={answers[currentQuestion]}
            onSelectAnswer={handleSelectAnswer}
          />
        </Card>

        {/* Inline Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between" id="questionnaire-nav">
          <Button
            onClick={handlePrevious}
            variant="secondary"
            disabled={isFirstQuestion}
            id="btn-previous"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!hasAnswer || isSubmitting}
            id="btn-next"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                {isLastQuestion ? 'See Results' : 'Next'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuestionnairePage
