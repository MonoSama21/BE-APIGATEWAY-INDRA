import express from 'express';
import InstitucionesEducativasController from '../controllers/institucionesEducativasController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = express.Router();

// Rutas CRUD de instituciones educativas
router.get('/', InstitucionesEducativasController.consultar);
router.post('/', InstitucionesEducativasController.ingresar);
router.put('/:id', InstitucionesEducativasController.actualizar);
router.patch('/:id/estado', InstitucionesEducativasController.cambiarEstado);
router.delete('/:id', InstitucionesEducativasController.borrar);

export default router;
