import express from 'express';
import cargosController from '../controllers/cargosController';
import { verificarToken } from '../middlewares/authMiddleware';
import { autorizarPorRol } from '../middlewares/rolMiddleware';

const router = express.Router();

router.post('/', verificarToken, autorizarPorRol(['Admin']), cargosController.ingresar);
router.get('/', verificarToken, autorizarPorRol(['Admin']), cargosController.consultar);

router.route("/:id")
    .delete(verificarToken, autorizarPorRol(['Admin']), cargosController.borrar)
    .put(verificarToken, autorizarPorRol(['Admin']), cargosController.actualizar)


export default router;