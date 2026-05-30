import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useLanguage } from '../lib/languageContext'
import { t } from '../lib/translations'
import { translateRecommendation, translateHabitsTitle, translateHabitsItem, translateWarning } from '../lib/dataTranslations'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ResultPDF from '../components/pdf/ResultPDF'

// ── Risk Level → Display Config ────────────────────────

const riskConfig = {
  LOW: {
    level: 'Risiko Rendah',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200 bg-emerald-50/50',
    icon: 'check',
    ringColor: 'bg-emerald-100',
    gradientFrom: 'from-emerald-400',
    gradientTo: 'to-teal-500',
  },
  MODERATE: {
    level: 'Risiko Sedang',
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-200 bg-amber-50/50',
    icon: 'warning',
    ringColor: 'bg-amber-100',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-orange-500',
  },
  HIGH: {
    level: 'Risiko Tinggi',
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-200 bg-red-50/50',
    icon: 'alert',
    ringColor: 'bg-red-100',
    gradientFrom: 'from-red-400',
    gradientTo: 'to-rose-600',
  },
}

const formatDiseaseName = (name) => {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [animateIn, setAnimateIn] = useState(false)
  const { language } = useLanguage()
  const tr = (key) => t('result', key, language)

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
      // AI prediction data
      prediksi: apiResult.prediksi,
      kepercayaan: apiResult.kepercayaan,
      top3: apiResult.top3 || [],
      semuaProbabilitas: apiResult.semuaProbabilitas || {},
      peringatan: apiResult.peringatan,
      // Raw risk level key for dynamic translation
      riskLevel: apiResult.riskLevel || 'LOW',
      // Backward compatible
      score: apiResult.totalScore,
      totalPossible: apiResult.maxScore,
      percentage: apiResult.percentage,
      recommendation: apiResult.recommendation,
      habits: apiResult.habits,
    })

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

  // Parse confidence percentage for progress bar
  const confidenceNum = parseFloat(result.kepercayaan) || 0

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
          {tr('backHome')}
        </button>

        {/* Main Result Card */}
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

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{tr('aiResultTitle')}</h1>
            <p className="text-sm text-gray-400 mb-6">{tr('aiResultDesc')}</p>

            {/* Disease Prediction Badge */}
            <div className={`inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r ${result.gradientFrom} ${result.gradientTo} text-white font-bold text-lg mb-3 shadow-lg`}>
              {formatDiseaseName(result.prediksi)}
            </div>

            {/* Confidence */}
            <p className="text-sm text-gray-500 mb-6">
              {tr('confidenceLabel')} <span className="font-bold text-gray-700">{result.kepercayaan}</span>
            </p>

            {/* Confidence Bar */}
            <div className="max-w-sm mx-auto mb-2">
              <Card className="p-4" hover={false}>
                <p className="text-sm text-gray-600 mb-3">
                  {tr('confidenceDesc1')}<span className="font-semibold">{formatDiseaseName(result.prediksi)}</span>{tr('confidenceDesc2')}{result.kepercayaan}
                </p>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${result.gradientFrom} ${result.gradientTo} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: animateIn ? `${confidenceNum}%` : '0%' }}
                  />
                </div>
              </Card>
            </div>
          </Card>

          {/* AI Warning */}
          {result.peringatan && (
            <Card className="p-5 mb-6 border-l-4 border-amber-400 bg-amber-50/50" hover={false} id="ai-warning">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <p className="text-sm text-amber-800">{translateWarning(result.peringatan, language)}</p>
              </div>
            </Card>
          )}

          {/* Top 3 Predictions */}
          {result.top3 && result.top3.length > 0 && (
            <Card className="p-6 sm:p-8 mb-6" hover={false} id="top3-card">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {tr('top3Title')}
              </h2>
              <div className="space-y-3">
                {result.top3.map((item, index) => {
                  const prob = parseFloat(item.probabilitas) || 0
                  const isTop = index === 0
                  const barColors = [
                    `bg-gradient-to-r ${result.gradientFrom} ${result.gradientTo}`,
                    'bg-gradient-to-r from-blue-400 to-indigo-500',
                    'bg-gradient-to-r from-gray-400 to-slate-500',
                  ]
                  return (
                    <div key={index} className={`p-3 rounded-xl ${isTop ? 'bg-blue-50/50 border border-blue-100' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isTop ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            #{index + 1}
                          </span>
                          <span className={`text-sm font-semibold ${isTop ? 'text-blue-700' : 'text-gray-700'}`}>
                            {formatDiseaseName(item.kelas)}
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${isTop ? 'text-blue-600' : 'text-gray-500'}`}>
                          {item.probabilitas}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColors[index]}`}
                          style={{ width: animateIn ? `${prob}%` : '0%' }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

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
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{translateRecommendation(result.recommendation, language)}</p>
                <p className="font-bold text-gray-800 text-sm mb-3">{translateHabitsTitle(result.habits.title, language)}</p>
                <ul className="space-y-2">
                  {result.habits.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${result.bgColor} mt-1.5 flex-shrink-0`} />
                      <span className="text-sm text-gray-600">{translateHabitsItem(item, language)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Risk Level Badge */}
          <Card className="p-4 mb-6 text-center" hover={false} id="risk-badge">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-gray-500">{tr('riskLevelLabel')}</span>
              <span className={`inline-flex items-center px-4 py-1 rounded-full text-white font-bold text-xs ${result.bgColor}`}>
                {result.riskLevel === 'HIGH' ? tr('riskHigh') : result.riskLevel === 'MODERATE' ? tr('riskModerate') : tr('riskLow')}
              </span>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8" id="result-actions">
            <PDFDownloadLink
              document={<ResultPDF result={result} summaryData={location.state?.summaryData} />}
              fileName="gastrocare-result.pdf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {({ loading }) => (
                <>
                  {loading ? (
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {loading ? 'Generating PDF...' : 'Download Result PDF'}
                </>
              )}
            </PDFDownloadLink>

            <Button
              to="/questionnaire"
              id="retake-assessment"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {tr('retakeBtn')}
            </Button>
            <Button
              to="/about"
              variant="secondary"
              id="learn-more"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tr('learnMoreBtn')}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-center py-6 border-t border-gray-200" id="result-disclaimer">
            <p className="text-xs text-gray-400 leading-relaxed max-w-lg mx-auto">
              <span className="font-bold text-gray-500">{tr('disclaimerLabel')}</span>{' '}
              {tr('disclaimerText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultPage
