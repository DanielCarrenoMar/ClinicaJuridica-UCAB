import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

// Importar rutas
import apiRoutes from './api/v1/routes/index.js';

// Usar rutas
app.use('/api/v1', apiRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API Clínica Jurídica UCAB',
    version: '1.0.0',
    status: 'operacional',
    endpoints: {
      test: '/api/v1/test',
      casos: '/api/v1/cases',
      caso_especifico: '/api/v1/cases/:id'
    }
  });
});

// Ruta de prueba directa
app.get('/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   • http://localhost:${port}/`);
  console.log(`   • http://localhost:${port}/api/v1/test`);
  console.log(`   • http://localhost:${port}/api/v1/cases`);
  console.log(`   • http://localhost:${port}/api/v1/cases/1`);
  console.log(`   • http://localhost:${port}/api/v1/applicants`);
  console.log(`   • http://localhost:${port}/api/v1/applicants/1`);
  console.log(`   • http://localhost:${port}/api/v1/applicants/search?q=maria`);
  console.log('='.repeat(50));
});