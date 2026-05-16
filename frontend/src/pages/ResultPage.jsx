import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'

// ── Risk Level → Display Config ────────────────────────

const riskConfig = {
  LOW: {
    level: 'Low Risk',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200 bg-emerald-50/50',
    icon: 'check',
    ringColor: 'bg-emerald-100',
  },
  MODERATE: {
    level: 'Moderate Risk',
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-200 bg-amber-50/50',
    icon: 'warning',
    ringColor: 'bg-amber-100',
  },
  HIGH: {
    level: 'High Risk',
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-200 bg-red-50/50',
    icon: 'alert',
    ringColor: 'bg-red-100',
  },
}

function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    const apiResult = location.state?.result

    if (!apiResult) {
      navigate('/questionnaire')
      return
    }

    // Ambil display config berdasarkan riskLevel dari API
    const config = riskConfig[apiResult.riskLevel] || riskConfig.LOW

    // Gabungkan data API + display config menjadi satu object result
    setResult({
      ...config,
      score: apiResult.totalScore,
      totalPossible: apiResult.maxScore,
      percentage: apiResult.percentage,
      recommendation: apiResult.recommendation,
      habits: apiResult.habits,
    })

    // Fix bug: setTimeout dengan cleanup
    const timer = setTimeout(() => setAnimateIn(true), 100)
    return () => clearTimeout(timer)
  }, [location.state, navigate])

  if (!result) return null

  const iconMap = {
    check: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    alert: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }



  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/30 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8 cursor-pointer"
          id="back-home"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to Home
        </button>

        {/* Result Card */}
        <div className={`transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Card className="p-8 sm:p-10 text-center mb-6" hover={false} id="result-card">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-24 h-24 rounded-full ${result.ringColor} flex items-center justify-center`}>
                <div className={`w-16 h-16 rounded-full ${result.bgColor} flex items-center justify-center shadow-lg`}>
                  {iconMap[result.icon]}
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your GERD Risk Assessment</h1>

            {/* Risk Level Badge */}
            <div className={`inline-flex items-center px-6 py-2 rounded-full ${result.bgColor} text-white font-bold text-sm mb-4`}>
              {result.level}
            </div>

            {/* Score */}
            <p className="text-sm text-gray-400 mb-6">
              Score: {result.score} / {result.totalPossible} • {result.percentage}%
            </p>

            {/* Score Bar */}
            <div className="max-w-sm mx-auto mb-2">
              <Card className="p-4" hover={false}>
                <p className="text-sm text-gray-600 mb-3">
                  Your symptoms suggest a {result.level.toLowerCase().replace(' risk', '')} risk for GERD.
                </p>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${result.bgColor} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: animateIn ? `${result.percentage}%` : '0%' }}
                  />
                </div>
              </Card>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className={`p-8 sm:p-10 mb-6 border-l-4 ${result.borderColor}`} hover={false} id="recommendations-card">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${result.bgColor} flex items-center justify-center flex-shrink-0`}>
                {result.icon === 'check' ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{result.recommendation}</p>
                <p className="font-bold text-gray-800 text-sm mb-3">{result.habits.title}</p>
                <ul className="space-y-2">
                  {result.habits.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${result.bgColor} mt-1.5 flex-shrink-0`} />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8" id="result-actions">
            <Button
              to="/questionnaire"
              id="retake-assessment"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Take Assessment Again
            </Button>
            <Button
              to="/about"
              variant="secondary"
              id="learn-more-gerd"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More About GERD
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-center py-6 border-t border-gray-200" id="result-disclaimer">
            <p className="text-xs text-gray-400 leading-relaxed max-w-lg mx-auto">
              <span className="font-bold text-gray-500">Medical Disclaimer:</span>{' '}
              This assessment is for informational purposes only and does not constitute medical advice.
              Please consult with a qualified healthcare provider for proper diagnosis and treatment.
              This tool is not a substitute for professional medical evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultPage
