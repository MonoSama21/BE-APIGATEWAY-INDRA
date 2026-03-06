import express from 'express';
import personalController from '../controllers/personalController';

const router = express.Router();

router.post('/', personalController.registrar);
router.get('/', personalController.consultar);

router.route("/:id")
    .get(personalController.consultarDetalle)
    .put(personalController.actualizar)
    .delete(personalController.borrar);

router.put("/:id/estado", personalController.cambiarEstado);

export default router;
