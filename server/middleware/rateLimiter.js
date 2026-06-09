import Analysis from '../models/Analysis.js';

const DAILY_CAP = 3;

export async function dailyAnalyzeLimit(req, res, next) {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const count = await Analysis.countDocuments({
      userId: req.user.id,
      createdAt: { $gte: start },
    });
    if (count >= DAILY_CAP) {
      return res
        .status(429)
        .json({ error: `Daily limit reached (${DAILY_CAP} analyses). Try again tomorrow.` });
    }
    next();
  } catch (err) {
    next(err);
  }
}
