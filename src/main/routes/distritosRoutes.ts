import express from 'express';
import distritosController from '../controllers/distritosController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = express.Router();


// Rutas CRUD de distritos
router.get('/', distritosController.consultar);
router.post('/', distritosController.ingresar);
router.put('/:id', distritosController.actualizar);
router.patch('/:id/estado', distritosController.cambiarEstado);
router.delete('/:id', distritosController.borrar);

export default router;
