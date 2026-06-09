import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signToken, requireAuth } from '../middleware/authMiddleware.js';
import { httpError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw httpError(400, 'Email and password are required');
    if (password.length < 8) throw httpError(400, 'Password must be at least 8 characters');

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw httpError(409, 'Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), passwordHash });
    const token = signToken(user);
    res.status(201).json({ token, user: user.toPublic() });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw httpError(400, 'Email and password are required');

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw httpError(401, 'Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw httpError(401, 'Invalid credentials');

    const token = signToken(user);
    res.json({ token, user: user.toPublic() });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw httpError(404, 'User not found');
    res.json({ user: user.toPublic() });
  } catch (err) {
    next(err);
  }
});

export default router;
