import express from 'express';
import categoriasController from '../controllers/categoriasController';
const router = express.Router();



router.get('/', categoriasController.consultar);
router.post('/', categoriasController.ingresar);


router.route("/:id")
    .get(categoriasController.consultarDetalle)
    .put(categoriasController.actualizar)
    .delete(categoriasController.borrar);

export default router;