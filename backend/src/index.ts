import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 
import apiRoutes from './api/v1/routes/index.js';
// 1. Importa el servicio de usuarios
import userService from './api/v1/services/user.service.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/v1', apiRoutes);

// 2. Modificamos el listen para que sea async
app.listen(port, async () => {
  console.log('='.repeat(40));
  console.log(`🚀 Servidor en http://localhost:${port}`);
  
  // 3. Ejecutamos el seed automáticamente al encender
  try {
    console.log('🌱 Verificando datos iniciales...');
    const seedResult = await userService.seedInitialUsers();
    console.log(`✅ ${seedResult.message}`);
  } catch (error) {
    console.error('❌ Error al ejecutar el seed inicial:', error);
  }
  
  console.log('='.repeat(40));
});