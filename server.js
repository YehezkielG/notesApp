import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);

app.get('/protected', (req, res) => {
  // Simple auth check.
  const token = req.cookies.session;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // In real code verify JWT signature.
  return res.json({ ok: true, message: 'Protected content' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
