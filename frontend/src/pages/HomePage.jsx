import Button from '../components/Button'
import Card from '../components/Card'
import { useLanguage } from '../lib/languageContext'
import { t } from '../lib/translations'

function HomePage() {
  const { language } = useLanguage()
  const tr = (key) => t('home', key, language)

  return (
    <div>
      {/* Hero Section */}
      <section id="hero-section" className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-emerald-50/50" />
        <div className="absolute top-20 -left-32 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-6 border border-blue-200/50">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                {tr('badge')}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                {tr('heroTitle1')}
                <span className="gradient-text">{tr('heroTitleHighlight')}</span>
                {tr('heroTitle2')}
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                {tr('heroDesc')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button to="/questionnaire" id="hero-cta">
                  {tr('startBtn')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
                <Button to="/about" variant="secondary" id="hero-learn-more">
                  {tr('learnMore')}
                </Button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden lg:flex justify-center animate-slide-in-right">
              <div className="relative">
                <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-blue-100/60 to-emerald-100/60 border border-white/80 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-blue-500/10">
                  <div className="animate-float">
                    <svg className="w-48 h-48 text-emerald-500/70" viewBox="0 0 200 200" fill="none">
                      {/* Stomach illustration */}
                      <path d="M100 30C60 30 40 60 40 90C40 120 50 140 70 155C90 170 110 170 130 155C150 140 160 120 160 90C160 60 140 30 100 30Z" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
                      <path d="M70 50C80 45 90 43 100 43" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                      <path d="M85 80C90 78 95 77 100 77C105 77 110 78 115 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M80 100C90 105 110 105 120 100" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      {/* Pulse lines */}
                      <path d="M30 95L45 95L50 80L55 110L60 90L65 95L75 95" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                      {/* Shield */}
                      <path d="M155 60L155 75C155 85 150 92 143 95L155 60Z" fill="#10b981" opacity="0.2"/>
                      <circle cx="150" cy="75" r="15" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.4"/>
                      <path d="M144 75L148 79L156 71" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                    </svg>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg shadow-black/10 px-4 py-3 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{tr('badgeQuick')}</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg shadow-black/10 px-4 py-3 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{tr('badgePrivate')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {tr('featuresTitle1')}<span className="gradient-text">{tr('featuresTitleHighlight')}</span>{tr('featuresTitle2')}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {tr('featuresDesc')}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <Card className="p-8 text-center group" id="feature-card-1">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{tr('feature1Title')}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {tr('feature1Desc')}
              </p>
            </Card>

            {/* Card 2 */}
            <Card className="p-8 text-center group" id="feature-card-2">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{tr('feature2Title')}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {tr('feature2Desc')}
              </p>
            </Card>

            {/* Card 3 */}
            <Card className="p-8 text-center group" id="feature-card-3">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{tr('feature3Title')}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {tr('feature3Desc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {tr('ctaTitle')}
              </h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                {tr('ctaDesc')}
              </p>
              <Button
                to="/questionnaire"
                variant="secondary"
                className="!bg-white !text-blue-600 !border-white hover:!bg-blue-50 !shadow-xl !shadow-black/10"
                id="cta-button"
              >
                {tr('ctaBtn')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
