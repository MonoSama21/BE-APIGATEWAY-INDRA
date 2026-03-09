import { Router } from "express";
import asistenciaController from "../controllers/asistenciaController";
import { verificarToken } from "../middlewares/authMiddleware";

const router = Router();

// Registrar entrada/salida: valida QR internamente y registra (REQ-F-006 + REQ-F-014 + REQ-F-015)
router.post('/registrar', (req, res) => asistenciaController.registrar(req, res));

// Consultar registros del día actual de un personal
router.get('/hoy/:personalId', (req, res) => asistenciaController.consultarHoy(req, res));

// Reporte de asistencias con filtros y paginación (REQ-F-007)
router.get('/reporte', (req, res) => asistenciaController.reporte(req, res));

export default router;
