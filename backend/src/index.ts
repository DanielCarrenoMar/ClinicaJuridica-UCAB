import express from 'express';
import cors from 'cors';

import apiRoutes from './api/v1/routes/index.js';
import { PORT } from './config.js';

const app = express();

app.use(cors());
app.use(express.json());

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