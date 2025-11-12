import crypto from 'crypto';
import { saveToken, consumeToken } from './tokenStore.js';

const TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function generateMagicLink(email, baseUrl) {
  const token = crypto.randomBytes(32).toString('hex');
  saveToken(token, email, TOKEN_TTL_MS);
  const link = `${baseUrl}/auth/verify?token=${token}`;
  // Simulate email send.
  console.log(`[MagicLink] Send to ${email}: ${link}`);
  return link;
}

export function verifyMagicToken(token) {
  const email = consumeToken(token);
  return email; // null if invalid/expired
}

export function createSessionJwt(email) {
  // Simplified unsigned pseudo JWT (DO NOT use in production).
  const payload = Buffer.from(JSON.stringify({ email, iat: Date.now() })).toString('base64url');
  return `dummy.${payload}.sig`;
}
