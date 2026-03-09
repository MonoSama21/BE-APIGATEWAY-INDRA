import express from 'express';
import personalController from '../controllers/personalController';
import { uploadFotoPersonal, subirFotoPersonalCloudinary } from '../middlewares/uploadMiddleware';

const router = express.Router();

router.post('/', personalController.registrar);
router.get('/', personalController.consultar);

router.route("/:id")
    .get(personalController.consultarDetalle)
    .put(personalController.actualizar)
    .delete(personalController.borrar);

router.put("/:id/estado", personalController.cambiarEstado);

// ✅ Ruta para subir foto
router.post("/:id/foto", uploadFotoPersonal, subirFotoPersonalCloudinary, personalController.subirFoto);

export default router;
