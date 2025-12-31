// src/api/v1/routes/health.routes.ts
import { Router } from 'express';
import { prisma } from '../../../config/database.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const prismaClient = await prisma;
    await prismaClient.$queryRaw`SELECT 1`;
    
    res.json({
      estado: 'saludable',
      mensaje: 'Sistema funcionando correctamente',
      baseDeDatos: 'conectada',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      estado: 'error',
      mensaje: 'Problema con la base de datos',
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/ping', (req, res) => {
  res.json({ 
    mensaje: 'pong', 
    hora: new Date().toISOString(),
    proyecto: 'Clínica Jurídica UCAB'
  });
});

export default router;
