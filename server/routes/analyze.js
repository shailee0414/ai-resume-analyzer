import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { uploadPdf } from '../middleware/uploadMiddleware.js';
import { dailyAnalyzeLimit } from '../middleware/rateLimiter.js';
import { extractText } from '../services/pdfService.js';
import { callClaude } from '../services/claudeService.js';
import { httpError } from '../middleware/errorHandler.js';
import Analysis from '../models/Analysis.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  dailyAnalyzeLimit,
  (req, res, next) =>
    uploadPdf(req, res, (err) => {
      if (err) return next(httpError(400, err.message));
      next();
    }),
  async (req, res, next) => {
    try {
      if (!req.file) throw httpError(400, 'Resume PDF is required');
      const jd = (req.body?.jd || '').trim();
      if (!jd) throw httpError(400, 'Job description is required');
      if (jd.length < 200) throw httpError(400, 'Job description must be at least 200 characters');
      if (jd.length > 5000) throw httpError(400, 'Job description must be at most 5000 characters');

      const resumeText = await extractText(req.file.buffer);
      if (!resumeText || resumeText.length < 100) {
        throw httpError(400, 'Could not extract enough text from PDF (scanned PDFs not supported)');
      }

      const result = await callClaude(resumeText, jd);

      const saved = await Analysis.create({
        userId: req.user.id,
        jobTitle: result.jobTitle,
        matchSummary: result.matchSummary,
        score: result.score,
        strongKeywords: result.strongKeywords,
        missingKeywords: result.missingKeywords,
        atsChecks: result.atsChecks,
        suggestions: result.suggestions,
        resumeText,
        jdText: jd,
      });

      res.json({ id: saved._id.toString(), ...result, createdAt: saved.createdAt });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
