import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './api/v1/routes/index.js';
import { JWT_SECRET, PORT } from './config.js';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true // Permite envío de cookies
  }
));
app.use(cookieParser())
app.use(express.json());

app.use((req, res, next) => {
  const token = req.cookies.access_token;
  try {
    const data = jwt.verify(token, JWT_SECRET) as {identityCard: string, role: string};
    req.user = data;
  } catch {
    console.log('No token o token inválido');
  }
  next();
})

app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/v1', apiRoutes);

const server = app.listen(PORT, async () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error('❌ Error al iniciar el servidor:', error);
});