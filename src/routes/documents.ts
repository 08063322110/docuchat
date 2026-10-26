
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

// Get documents belonging to the authenticated user
router.get('/', authenticate, async (req, res, next) => {
  try {
    const docs = await prisma.document.findMany({
      where: { userId: req.user!.id },
    });

    res.status(200).json({
      success: true,
      data: docs,
      error: null,
    });
  } catch (error) {
    next(error);
  }
});
export default router;

