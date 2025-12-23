import express from 'express';
import type { Request, Response, NextFunction } from 'express'; // Usamos 'import type' para los tipos
import cors from 'cors';

interface Beneficiary {
  idBeneficiary: string;
  name: string;
  lastName: string;
  sex: string;
}

const app = express();
const PORT = 4000;

// 1. CONFIGURACIÓN DE CORS (Debe ir antes de todo)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// "BASE DE DATOS" TEMPORAL
let mockDatabase: Beneficiary[] = [
  { idBeneficiary: "V000000", name: "Admin", lastName: "Servidor", sex: "M" }
];

// --- RUTAS MODIFICADAS PARA COINCIDIR CON TU FRONT ---

// Cambiamos '/beneficiarios' por '/api/v1/applicants'
app.get('/api/v1/applicants', (req: Request, res: Response) => {
  console.log("📢 El Front pidió la lista de applicants");
  res.json(mockDatabase);
});

app.post('/api/v1/applicants', (req: Request<{}, {}, Beneficiary>, res: Response) => {
  const nuevoBeneficiario = req.body;
  
  console.log("-----------------------------------------");
  console.log("📩 ¡DATOS RECIBIDOS EN /api/v1/applicants!");
  console.log(nuevoBeneficiario);
  console.log("-----------------------------------------");

  mockDatabase.push(nuevoBeneficiario);
  res.status(201).json(nuevoBeneficiario);
});

// 2. INICIO DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en: http://localhost:${PORT}`);
  console.log(`✅ Ruta lista: http://localhost:3000/api/v1/applicants`);
});