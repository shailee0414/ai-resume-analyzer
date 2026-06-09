import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { httpError } from '../middleware/errorHandler.js';
import Analysis from '../models/Analysis.js';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const items = await Analysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-resumeText -jdText');
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await Analysis.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) throw httpError(404, 'Analysis not found');
    res.json(item);
  } catch (err) {
    next(err);
  }
});

export default router;
