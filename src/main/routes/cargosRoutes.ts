import express from 'express';
import cargosController from '../controllers/cargosController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', cargosController.ingresar);
router.get('/', cargosController.consultar);

router.route("/:id")
    .delete(cargosController.borrar)
    .put(cargosController.actualizar)


export default router;