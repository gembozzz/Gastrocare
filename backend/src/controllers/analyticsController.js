// ============================================
// Analytics Controller
// ============================================

const { prisma } = require('../config/database');

/**
 * GET /api/analytics/summary
 * Overall statistics summary — Admin only.
 */
async function getSummary(req, res, next) {
  try {
    // Total assessments
    const totalAssessments = await prisma.assessment.count();

    // Breakdown by risk level
    const riskBreakdown = await prisma.assessment.groupBy({
      by: ['riskLevel'],
      _count: { id: true },
    });

    const byRiskLevel = {
      LOW: 0,
      MODERATE: 0,
      HIGH: 0,
    };
    riskBreakdown.forEach((group) => {
      byRiskLevel[group.riskLevel] = group._count.id;
    });

    // Average score and percentage
    const averages = await prisma.assessment.aggregate({
      _avg: {
        totalScore: true,
        percentage: true,
      },
    });

    // This month's assessments
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [thisMonth, lastMonth] = await Promise.all([
      prisma.assessment.count({
        where: { completedAt: { gte: startOfThisMonth } },
      }),
      prisma.assessment.count({
        where: {
          completedAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
    ]);

    // Growth rate
    const growthRate =
      lastMonth > 0
        ? parseFloat((((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1))
        : thisMonth > 0
          ? 100
          : 0;

    res.json({
      success: true,
      data: {
        totalAssessments,
        byRiskLevel,
        averageScore: Math.round(averages._avg.totalScore || 0),
        averagePercentage: Math.round(averages._avg.percentage || 0),
        thisMonth,
        lastMonth,
        growthRate,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/analytics/trend
 * Assessment trends over time — Admin only.
 *
 * Query params:
 *   - period: 'daily' | 'weekly' | 'monthly' (default: 'daily')
 *   - startDate / endDate
 */
async function getTrend(req, res, next) {
  try {
    const { period = 'daily', startDate, endDate } = req.query;

    // Build date filter
    const where = {};
    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) where.completedAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.completedAt.lte = end;
      }
    }

    // Default: last 30 days
    if (!startDate && !endDate) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      where.completedAt = { gte: thirtyDaysAgo };
    }

    // Fetch all assessments in range
    const assessments = await prisma.assessment.findMany({
      where,
      orderBy: { completedAt: 'asc' },
      select: {
        completedAt: true,
        riskLevel: true,
      },
    });

    // Group by period
    const grouped = {};

    assessments.forEach((a) => {
      let key;
      const date = new Date(a.completedAt);

      switch (period) {
        case 'weekly': {
          // ISO week: use the Monday of the week
          const day = date.getDay();
          const diff = date.getDate() - day + (day === 0 ? -6 : 1);
          const monday = new Date(date);
          monday.setDate(diff);
          key = monday.toISOString().split('T')[0];
          break;
        }
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'daily':
        default:
          key = date.toISOString().split('T')[0];
          break;
      }

      if (!grouped[key]) {
        grouped[key] = { date: key, total: 0, low: 0, moderate: 0, high: 0 };
      }

      grouped[key].total++;
      grouped[key][a.riskLevel.toLowerCase()]++;
    });

    const trendData = Object.values(grouped);

    res.json({
      success: true,
      data: trendData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/analytics/questions
 * Distribution of answers per question — Admin only.
 */
async function getQuestionStats(req, res, next) {
  try {
    // Get all active questions with their options
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // Get all assessments
    const assessments = await prisma.assessment.findMany({
      select: { answers: true },
    });

    // Build distribution map
    const stats = questions.map((question) => {
      // Count how many times each option was selected
      const optionCounts = {};
      question.options.forEach((opt) => {
        optionCounts[opt.id] = 0;
      });

      let totalAnswersForQuestion = 0;

      assessments.forEach((assessment) => {
        const answers = assessment.answers;
        if (Array.isArray(answers)) {
          const answer = answers.find((a) => a.questionId === question.id);
          if (answer && optionCounts[answer.optionId] !== undefined) {
            optionCounts[answer.optionId]++;
            totalAnswersForQuestion++;
          }
        }
      });

      const optionDistribution = question.options.map((opt) => ({
        optionId: opt.id,
        optionText: opt.text,
        count: optionCounts[opt.id] || 0,
        percentage:
          totalAnswersForQuestion > 0
            ? Math.round((optionCounts[opt.id] / totalAnswersForQuestion) * 100)
            : 0,
      }));

      return {
        questionId: question.id,
        questionText: question.text,
        totalResponses: totalAnswersForQuestion,
        optionDistribution,
      };
    });

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getSummary, getTrend, getQuestionStats };
