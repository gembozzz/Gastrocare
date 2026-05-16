import Card from '../components/Card'

function AboutPage() {
  const symptoms = [
    { name: 'Heartburn', desc: 'Burning sensation in the chest' },
    { name: 'Chest discomfort', desc: 'Pain or pressure in chest area' },
    { name: 'Regurgitation', desc: 'Sour or bitter taste in mouth' },
    { name: 'Difficulty swallowing', desc: 'Feeling of food stuck in throat' },
    { name: 'Chronic cough', desc: 'Persistent dry cough' },
    { name: 'Hoarseness', desc: 'Changes in voice quality' },
  ]

  const causes = [
    'Obesity or being overweight',
    'Hiatal hernia (when part of the stomach pushes through the diaphragm)',
    'Pregnancy',
    'Smoking',
    'Certain foods and beverages (fatty foods, caffeine, alcohol, chocolate)',
  ]

  const detectionPoints = [
    {
      title: 'Prevent Complications',
      desc: 'Untreated GERD can lead to esophageal damage, Barrett\'s esophagus, or even esophageal cancer.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Improve Quality of Life',
      desc: 'Managing symptoms can significantly improve sleep, eating habits, and daily activities.',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Effective Treatment',
      desc: 'Many treatment options are available, from lifestyle changes to medications and procedures.',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
    },
  ]

  return (
    <div>
      {/* Header Section */}
      <section id="about-header" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 animate-fade-in-up">
            Understanding GERD
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            Learn about Gastroesophageal Reflux Disease and why early detection matters
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* What is GERD */}
        <Card className="p-8 sm:p-10" hover={false} id="what-is-gerd">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GERD?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Gastroesophageal Reflux Disease (GERD) is a chronic digestive condition where stomach acid or bile flows back into the esophagus, irritating its lining. This backward flow of acid is called acid reflux.
              </p>
              <p className="text-gray-600 leading-relaxed">
                While occasional acid reflux is common, GERD occurs when reflux happens frequently and causes troublesome symptoms or complications. It affects millions of people worldwide and can significantly impact quality of life if left untreated.
              </p>
            </div>
          </div>
        </Card>

        {/* Common Symptoms */}
        <Card className="p-8 sm:p-10" hover={false} id="common-symptoms">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 pt-2">Common Symptoms</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {symptoms.map((symptom, index) => (
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

        {/* Common Causes */}
        <Card className="p-8 sm:p-10" hover={false} id="common-causes">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Common Causes</h2>
              <p className="text-gray-500 text-sm mb-4">
                GERD occurs when the lower esophageal sphincter (LES) becomes weak or relaxes inappropriately. Several factors can contribute to this:
              </p>
            </div>
          </div>
          <ul className="space-y-3 ml-0 sm:ml-17">
            {causes.map((cause, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mt-1.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">{cause}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Why Early Detection Matters */}
        <Card className="p-8 sm:p-10" hover={false} id="early-detection">
          <div className="flex items-start gap-5 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Early Detection Matters</h2>
              <p className="text-gray-500 text-sm">
                Identifying GERD early is crucial for several reasons:
              </p>
            </div>
          </div>
          <div className="space-y-5 ml-0 sm:ml-17">
            {detectionPoints.map((point, index) => (
              <div key={index} className={`p-5 rounded-xl ${point.bgColor} border border-gray-100/50`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${point.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
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
            <span className="font-bold text-gray-500">Medical Disclaimer:</span>{' '}
            This questionnaire is for educational purposes only and is not a substitute for professional medical
            advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding any
            medical condition.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
