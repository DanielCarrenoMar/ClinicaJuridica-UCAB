import express from 'express';
import caseRoutes from './case.routes.js';
import applicantRoutes from './applicant.routes.js';
import userRoutes from './user.routes.js';
import { config } from 'dotenv';

const router = express.Router();

// Ruta simple de prueba
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API v1 está funcionando',
    endpoints: {
      usuarios: '/users',
      casos: '/cases',
      solicitantes: '/applicants',  
      beneficiarios: '/beneficiaries (próximamente)',
      estadisticas: '/stats (próximamente)',
      config: '/config'
    }
  });
});

// Usar rutas de casos
router.use('/cases', caseRoutes);

// Usar rutas de solicitantes
router.use('/applicants', applicantRoutes);

// Usar rutas de usuarios
router.use('/users', userRoutes);

//Usar rutas de config
router.use('/config', config);

export default router;