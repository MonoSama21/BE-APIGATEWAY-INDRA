import express from 'express';
import personalController from '../controllers/personalController';
import { uploadFotoPersonal, subirFotoPersonalCloudinary, uploadCSV, parseCSVMiddleware, uploadExcel, parseExcelMiddleware } from '../middlewares/uploadMiddleware';
import { verificarToken } from '../middlewares/authMiddleware';
import { autorizarPorRol } from '../middlewares/rolMiddleware';

const router = express.Router();

router.post('/', verificarToken, autorizarPorRol(['Admin']), personalController.registrar);
router.get('/', verificarToken, autorizarPorRol(['Admin']), personalController.consultar);

router.route("/:id")
    .get(verificarToken, autorizarPorRol(['Admin']), personalController.consultarDetalle)
    .put(verificarToken, autorizarPorRol(['Admin']), personalController.actualizar)
    .delete(verificarToken, autorizarPorRol(['Admin']), personalController.borrar)
    .put(verificarToken, autorizarPorRol(['Admin']), personalController.actualizar);

router.put("/:id/estado", verificarToken, autorizarPorRol(['Admin']), personalController.cambiarEstado);

// ✅ Ruta para subir foto
router.post("/:id/foto", uploadFotoPersonal, subirFotoPersonalCloudinary, verificarToken, autorizarPorRol(['Admin']), personalController.subirFoto);

// ✅ Ruta para importar CSV masivo
router.post('/importar-csv', uploadCSV, parseCSVMiddleware, verificarToken, autorizarPorRol(['Admin']), personalController.importarCSV);

// ✅ Ruta para importar EXCEL masivo
router.post('/importar-excel', uploadExcel, parseExcelMiddleware, verificarToken, autorizarPorRol(['Admin']), personalController.importarCSV);

export default router;
