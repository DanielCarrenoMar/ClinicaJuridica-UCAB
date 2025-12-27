import { PrismaClient } from './generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import express from 'express';
import cors from 'cors'

import apiRoutes from './api/v1/routes/index.js';
import userService from './api/v1/services/user.service.js';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/v1', apiRoutes);

app.listen(port, async () => {
  console.log(`🚀 Servidor en http://localhost:${port}`);
});