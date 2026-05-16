// ============================================
// Risk Calculator Service
// ============================================

/**
 * Calculate the GERD risk level based on assessment answers.
 *
 * @param {Array<{questionId: number, optionId: number, score: number}>} answers
 * @returns {Object} Risk assessment result
 */
function calculateRisk(answers) {
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const maxScore = answers.length * 5;
  const percentage = Math.round((totalScore / maxScore) * 100);

  let riskLevel, recommendation, habits;

  if (percentage <= 33) {
    riskLevel = 'LOW';
    recommendation =
      'Your symptoms appear minimal. However, if you experience any changes or worsening symptoms, please consult a healthcare professional.';
    habits = {
      title: 'Maintain good habits:',
      items: [
        'Continue eating healthy, balanced meals',
        'Avoid trigger foods (spicy, fatty, acidic foods)',
        'Maintain a healthy weight',
        'Avoid eating close to bedtime',
        'Stay hydrated and limit alcohol/caffeine',
      ],
    };
  } else if (percentage <= 66) {
    riskLevel = 'MODERATE';
    recommendation =
      'Based on your responses, we recommend consulting with a healthcare professional for a proper evaluation and personalized treatment plan.';
    habits = {
      title: 'Recommended next steps:',
      items: [
        'Schedule an appointment with your doctor or gastroenterologist',
        'Keep a symptom diary to track patterns',
        'Discuss treatment options including lifestyle changes and medications',
        'Consider dietary modifications to reduce symptoms',
      ],
    };
  } else {
    riskLevel = 'HIGH';
    recommendation =
      'Your responses indicate significant symptoms. We strongly recommend seeking medical attention promptly for proper diagnosis and treatment.';
    habits = {
      title: 'Important actions to take:',
      items: [
        'Seek medical attention as soon as possible',
        'Do not ignore persistent or worsening symptoms',
        'Discuss potential complications with your doctor',
        'Follow prescribed treatment plans carefully',
        'Make immediate lifestyle and dietary changes',
      ],
    };
  }

  return {
    totalScore,
    maxScore,
    percentage,
    riskLevel,
    recommendation,
    habits,
  };
}

module.exports = { calculateRisk };
