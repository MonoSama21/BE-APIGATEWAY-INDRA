import express from 'express';
import registrosController from '../controllers/registrosController';
import { verificarToken } from '../middlewares/authMiddleware';
import { autorizarPorRol } from '../middlewares/rolMiddleware';

const router = express.Router();

// Crear registro (público - frontend llamará cuando un empleado complete la misión)
router.post('/', registrosController.crear);

// Listar registros (solo administradores autenticados)
router.get('/', verificarToken, autorizarPorRol(['admin']), registrosController.listar);

// Detalle de un registro (solo administradores autenticados)
router.get('/:id', verificarToken, autorizarPorRol(['admin']), registrosController.detalle);

export default router;
