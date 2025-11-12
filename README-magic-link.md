Magic Link Authentication (Development Demo)
Steps:
1. npm install express cookie-parser
2. Start: node server.js
3. Open the RequestMagicLink component in your frontend and submit email.
4. Copy the magic link from server console and open it in browser.
5. Session cookie is set; call /protected to test.

Security TODO:
- Replace dummy JWT with real signed JWT (use jsonwebtoken).
- Use HTTPS and secure cookies.
- Integrate real email service (SES, SendGrid, etc).
- Persist tokens in DB (with single-use constraint).
