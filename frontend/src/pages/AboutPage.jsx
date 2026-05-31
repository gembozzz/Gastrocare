import Card from '../components/Card'
import { useLanguage } from '../lib/languageContext'
import { t } from '../lib/translations'

function AboutPage() {
  const { language } = useLanguage()
  const tr = (key) => t('about', key, language)

  const diseaseColors = [
    { color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50' },
    { color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50' },
    { color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50' },
    { color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-50' },
    { color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50' },
    { color: 'from-fuchsia-500 to-fuchsia-600', bgColor: 'bg-fuchsia-50' },
  ]

  const detectionColors = [
    { color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50' },
    { color: 'from-violet-500 to-violet-600', bgColor: 'bg-violet-50' },
  ]

  const diseases = tr('diseases')
  const symptoms = tr('symptoms')
  const riskFactors = tr('riskFactors')
  const detectionPoints = tr('detectionPoints')

  return (
    <div>
      {/* Header Section */}
      <section id="about-header" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 animate-fade-in-up">
            {tr('headerTitle')}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            {tr('headerDesc')}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* Tentang Kesehatan Lambung */}
        <Card className="p-8 sm:p-10" hover={false} id="tentang-kesehatan-lambung">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{tr('sectionAboutTitle')}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {tr('sectionAboutP1')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {tr('sectionAboutP2')}
              </p>
            </div>
          </div>
        </Card>

        {/* Jenis-jenis Penyakit Lambung */}
        <Card className="p-8 sm:p-10" hover={false} id="jenis-penyakit-lambung">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{tr('sectionDiseasesTitle')}</h2>
              <p className="text-gray-500 text-sm">
                {tr('sectionDiseasesDesc')}
              </p>
            </div>
          </div>
          <div className="space-y-4 ml-0 sm:ml-17">
            {Array.isArray(diseases) && diseases.map((disease, index) => (
              <div key={index} className={`p-5 rounded-xl ${diseaseColors[index]?.bgColor || 'bg-gray-50'} border border-gray-100/50`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${diseaseColors[index]?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5`}>
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-0.5">{disease.name}</h3>
                    <p className="text-xs text-gray-500 italic mb-1.5">{disease.fullName}</p>
                    <p className="text-sm text-gray-600">{disease.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Gejala Umum */}
        <Card className="p-8 sm:p-10" hover={false} id="gejala-umum">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 pt-2">{tr('symptomsTitle')}</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.isArray(symptoms) && symptoms.map((symptom, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800 text-sm">{symptom.name}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{symptom.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Faktor Risiko */}
        <Card className="p-8 sm:p-10" hover={false} id="faktor-risiko">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{tr('riskFactorsTitle')}</h2>
              <p className="text-gray-500 text-sm mb-4">
                {tr('riskFactorsDesc')}
              </p>
            </div>
          </div>
          <ul className="space-y-3 ml-0 sm:ml-17">
            {Array.isArray(riskFactors) && riskFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mt-1.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">{factor}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Pentingnya Deteksi Dini */}
        <Card className="p-8 sm:p-10" hover={false} id="deteksi-dini">
          <div className="flex items-start gap-5 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{tr('detectionTitle')}</h2>
              <p className="text-gray-500 text-sm">
                {tr('detectionDesc')}
              </p>
            </div>
          </div>
          <div className="space-y-5 ml-0 sm:ml-17">
            {Array.isArray(detectionPoints) && detectionPoints.map((point, index) => (
              <div key={index} className={`p-5 rounded-xl ${detectionColors[index]?.bgColor || 'bg-gray-50'} border border-gray-100/50`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${detectionColors[index]?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{point.title}</h3>
                    <p className="text-sm text-gray-600">{point.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Disclaimer */}
        <div className="py-6 border-t border-gray-200" id="about-disclaimer">
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="font-bold text-gray-500">{tr('disclaimerLabel')}</span>{' '}
            {tr('disclaimerText')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
