import { Router } from "express";
import * as configController from "../controllers/config.controller.js";

const router = Router();

// Catálogos Generales
router.get("/initial-data", configController.getAllInitialData);
router.get("/locations", configController.getLocations);
router.get("/legal-structure", configController.getLegalStructure);

// Periodos Académicos
router.get("/semesters", configController.getSemesters);
router.post("/semesters", configController.createSemester);

// Eliminar Semestre (solo si no tiene casos)
router.delete("/semesters/:term", configController.deleteSemester); 

// Gestión de Tribunales
router.get("/courts", configController.getAllCourts);
router.post("/courts", configController.createCourt);
router.put("/courts/:id", configController.updateCourt);

// Gestión de Núcleos
router.get("/nuclei", configController.getAllNuclei);
router.post("/nuclei", configController.createNucleus);
// router.put("/nuclei/:id", ...); //si se requiere editar núcleo

export default router;