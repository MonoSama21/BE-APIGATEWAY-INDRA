import express from 'express';
import categoriasController from '../controllers/categoriasController';
import { verificarToken } from '../middlewares/authMiddleware';
const router = express.Router();



router.get('/', categoriasController.consultar);
router.post('/', verificarToken, categoriasController.ingresar);


router.route("/:id")
    .get(categoriasController.consultarDetalle)
    .put(verificarToken, categoriasController.actualizar)
    .delete(verificarToken, categoriasController.borrar);

export default router;