// ============================================
// Assessment Controller
// ============================================

const { prisma } = require('../config/database');
const { calculateRisk } = require('../services/riskCalculator');
const { sendAssessmentResultEmail } = require('../services/emailService');

/**
 * POST /api/assessments
 * Submit a new assessment — sekarang menggunakan model AI untuk prediksi.
 */
async function submitAssessment(req, res, next) {
  try {
    const { answers, userEmail, userName, sessionId } = req.body;

    // Ambil data pertanyaan dari DB (perlu order untuk mapping ke fitur AI)
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      select: { id: true, order: true },
    });

    // Calculate risk menggunakan model AI
    const result = await calculateRisk(answers, questions);

    // Capture request metadata
    const ipAddress =
      req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    // Persist assessment to database
    const assessment = await prisma.assessment.create({
      data: {
        sessionId: sessionId || null,
        userEmail: userEmail || null,
        userName: userName || null,
        answers: answers,
        totalScore: result.totalScore,
        maxScore: result.maxScore,
        percentage: result.percentage,
        riskLevel: result.riskLevel,
        prediksi: result.prediksi,
        kepercayaan: result.kepercayaan,
        top3: result.top3,
        ipAddress,
        userAgent,
      },
    });

    // Send email with results if the user provided an email
    if (userEmail) {
      // Fire and forget — don't block the response
      sendAssessmentResultEmail(userEmail, userName, result).catch((err) =>
        console.error('Email send error (non-blocking):', err.message)
      );
    }

    res.status(201).json({
      success: true,
      data: {
        id: assessment.id,
        // AI prediction results
        prediksi: result.prediksi,
        kepercayaan: result.kepercayaan,
        top3: result.top3,
        semuaProbabilitas: result.semuaProbabilitas,
        peringatan: result.peringatan,
        gejala_input: result.gejala_input,
        // Backward-compatible fields
        totalScore: result.totalScore,
        maxScore: result.maxScore,
        percentage: result.percentage,
        riskLevel: result.riskLevel,
        recommendation: result.recommendation,
        habits: result.habits,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/assessments
 * List all assessments with pagination and filters — Admin only.
 */
async function getAssessments(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      riskLevel,
      startDate,
      endDate,
      search,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filters
    const where = {};

    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) where.completedAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.completedAt.lte = end;
      }
    }

    if (search) {
      where.OR = [
        { userEmail: { contains: search } },
        { userName: { contains: search } },
        { prediksi: { contains: search } },
      ];
    }

    // Execute queries in parallel
    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where,
        orderBy: { completedAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.assessment.count({ where }),
    ]);

    res.json({
      success: true,
      data: assessments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/assessments/:id
 * Get a single assessment by ID — Admin only.
 */
async function getAssessmentById(req, res, next) {
  try {
    const { id } = req.params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found.',
      });
    }

    res.json({
      success: true,
      data: {
        ...assessment,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { submitAssessment, getAssessments, getAssessmentById };
