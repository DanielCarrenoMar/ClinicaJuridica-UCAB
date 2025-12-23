import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // <--- Instalar: npm install cors
import apiRoutes from './api/v1/routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

// Configuración de Middlewares
app.use(cors());
app.use(express.json());

// Logging de peticiones
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/v1', apiRoutes);

app.listen(port, () => {
  console.log('='.repeat(40));
  console.log(`🚀 Servidor en http://localhost:${port}`);
  console.log(`📡 Endpoint: http://localhost:${port}/api/v1/applicants`);
  console.log('='.repeat(40));
});