import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';


import apiRoutes from './api/v1/routes/index.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(helmet()); // Seguridad
app.use(cors());   // CORS
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true }));


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('ðŸ”§ Modo desarrollo activado');
}


console.log('ðŸ”— Iniciando conexiÃ³n a base de datos...');

connectDatabase()
  .then(() => {
    console.log('âœ… Base de datos lista');
  })
  .catch((error) => {
    console.error('âš ï¸  Advertencia:', error.message);
    console.log('âš ï¸  Servidor iniciarÃ¡ sin conexiÃ³n a BD');
  });


app.use('/api/v1', apiRoutes);


app.get('/', (req, res) => {
  res.json({
    mensaje: 'ðŸš€ Bienvenido al Backend de ClÃ­nica JurÃ­dica UCAB',
    proyecto: 'Sistema de GestiÃ³n de Casos Legales',
    estado: 'activo',
    entorno: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    desarrolladores: 3,
    fecha: new Date().toISOString(),
    rutas: {
      api: '/api/v1',
      salud: '/api/v1/salud',
      usuarios: '/api/v1/users',
      solicitantes: '/api/v1/applicants',
      casos: '/api/v1/cases',
      beneficiarios: '/api/v1/beneficiary'
    },
    mensajeEquipo: 'Â¡Trabajo colaborativo en progreso! ðŸ‘¨â€ðŸ’»ðŸ‘¨â€ðŸ’»ðŸ‘¨â€ðŸ’»'
  });
});


app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `La ruta ${req.originalUrl} no existe`,
    sugerencias: [
      'Visita / para ver la pÃ¡gina principal',
      'Usa /api/v1 para acceder a la API',
      'Consulta /api/v1/salud para el estado del sistema'
    ]
  });
});

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('ðŸ”¥ Error interno del servidor:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Por favor contacta al administrador del sistema',
    timestamp: new Date().toISOString()
  });
});


app.listen(port, () => {
  console.log('='.repeat(60));
  console.log('ðŸš€ BACKEND INICIADO CORRECTAMENTE');
  console.log('='.repeat(60));
  console.log(`ðŸŒ URL principal: http://localhost:${port}`);
  console.log(`ðŸ“ API v1: http://localhost:${port}/api/v1`);
  console.log(`â¤ï¸  Salud del sistema: http://localhost:${port}/api/v1/salud`);
  console.log(`ðŸ—„ï¸  Estado BD: ${process.env.DATABASE_URL ? 'Configurada' : 'Sin configurar'}`);
  console.log(`ðŸ‘¥ Equipo: 3 desarrolladores`);
  console.log(`ðŸ”„ Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60));
  console.log('ðŸ“¢ Presiona Ctrl+C para detener el servidor');
  console.log('='.repeat(60));
});

export default app;
