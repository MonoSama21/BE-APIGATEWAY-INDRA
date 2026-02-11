import express from 'express';
import platosController from '../controllers/platosController';
const router = express.Router();



router.get('/', platosController.consultar);
router.post('/', platosController.ingresar);


router.route("/:id")
    .get(platosController.consultarDetalle)
    .put(platosController.actualizar)
    .delete(platosController.borrar);

export default router;