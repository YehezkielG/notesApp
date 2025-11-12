import express from 'express';
import { generateMagicLink, verifyMagicToken, createSessionJwt } from '../auth/magicLinkService.js';

const router = express.Router();

router.post('/magic-link', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  generateMagicLink(email, baseUrl);
  return res.json({ ok: true, message: 'If the email exists, a link was sent.' });
});

router.get('/verify', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token missing' });
  const email = verifyMagicToken(token);
  if (!email) return res.status(400).json({ error: 'Invalid or expired token' });
  const session = createSessionJwt(email);
  res.cookie('session', session, { httpOnly: true, secure: false, sameSite: 'lax' });
  return res.json({ ok: true, email });
});

export default router;
