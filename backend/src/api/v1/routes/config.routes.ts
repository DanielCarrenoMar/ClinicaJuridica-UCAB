import { Router } from "express";
import * as configController from "../controllers/config.controller.js";

const router = Router();

// GET /api/v1/config/initial-data - Carga masiva de catálogos
router.get("/initial-data", configController.getAllInitialData);

// GET /api/v1/config/locations - Estados, municipios y parroquias
router.get("/locations", configController.getLocations);

// GET /api/v1/config/legal-structure - Materias y áreas legales
router.get("/legal-structure", configController.getLegalStructure);

// POST /api/v1/config/semesters - Crear nuevo periodo académico
router.post("/semesters", configController.createSemester);

export default router;