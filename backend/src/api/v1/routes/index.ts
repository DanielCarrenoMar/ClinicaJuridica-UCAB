import express from 'express';
import caseRoutes from './case.routes.js';
import applicantRoutes from './applicant.routes.js';
import userRoutes from './user.routes.js';

const router = express.Router();

// Ruta simple de prueba
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API v1 está funcionando',
    endpoints: {
      casos: '/cases',
      solicitantes: '/applicants',  
      beneficiarios: '/beneficiaries (próximamente)',
      estadisticas: '/stats (próximamente)'
    }
  });
});

// Usar rutas de casos
router.use('/cases', caseRoutes);

// Usar rutas de solicitantes
router.use('/applicants', applicantRoutes);

// Usar rutas de usuarios
router.use('/users', userRoutes);

export default router;