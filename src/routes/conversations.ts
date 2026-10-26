
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { prisma } from '../lib/prisma';
import { createConversationSchema } from '../validators/conversation.validator';

const router = Router();
/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: List the authenticated user's conversations
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: conversations,
      error: null,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/conversations
// Create a conversation
/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Create a new conversation
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: My first conversation
 *               documentId:
 *                 type: string
 *                 example: cmvorxw2i0002asuty6ofdb6v
 *             additionalProperties: false
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *       400:
 *         description: Request validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     message:
 *                       type: string
 *                       example: Request validation failed
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           field:
 *                             type: string
 *                             example: title
 *                           message:
 *                             type: string
 *                             example: "Invalid input"
 *       401:
 *         description: Authentication required
 */

router.post(
  '/',
  authenticate,
  validate(createConversationSchema),
  async (req, res, next) => {
    try {
      const conversation = await prisma.conversation.create({
        data: {
          userId: req.user!.id,
          title: req.body.title?.trim() || 'New conversation',
        },
      });

      res.status(201).json({
        success: true,
        data: conversation,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
