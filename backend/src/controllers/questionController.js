// ============================================
// Question Controller
// ============================================

const { prisma } = require('../config/database');

/**
 * GET /api/questions
 * Retrieve all active questions with their options, ordered by `order`.
 * This is a PUBLIC endpoint — no auth required.
 */
async function getQuestions(req, res, next) {
  try {
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        text: true,
        order: true,
        options: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            text: true,
            score: true,
            order: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/questions/all
 * Retrieve ALL questions (including inactive) — Admin only.
 */
async function getAllQuestions(req, res, next) {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { order: 'asc' },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/questions
 * Create a new question with options — Admin only.
 */
async function createQuestion(req, res, next) {
  try {
    const { text, order, options } = req.body;

    const question = await prisma.question.create({
      data: {
        text,
        order,
        options: {
          create: options.map((opt, index) => ({
            text: opt.text,
            score: opt.score !== undefined ? opt.score : index,
            order: opt.order !== undefined ? opt.order : index + 1,
          })),
        },
      },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/questions/:id
 * Update a question and its options — Admin only.
 */
async function updateQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const { text, order, isActive, options } = req.body;

    // Update the question fields
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    // If options are provided, delete existing and re-create
    if (options && options.length > 0) {
      await prisma.option.deleteMany({
        where: { questionId: parseInt(id) },
      });

      updateData.options = {
        create: options.map((opt, index) => ({
          text: opt.text,
          score: opt.score !== undefined ? opt.score : index,
          order: opt.order !== undefined ? opt.order : index + 1,
        })),
      };
    }

    const question = await prisma.question.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/questions/:id
 * Soft-delete a question (set isActive = false) — Admin only.
 */
async function deleteQuestion(req, res, next) {
  try {
    const { id } = req.params;

    const question = await prisma.question.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: `Question ${question.id} has been deactivated.`,
      data: question,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
