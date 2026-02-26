import express from 'express';
import registroCitaController from '../controllers/registrosCitasController';
import { verificarToken } from '../middlewares/authMiddleware';
import { uploadFotos, subirAFotosCloudinary } from '../middlewares/uploadMiddleware';

const router = express.Router();


// Crear registro
router.post('/',  verificarToken, uploadFotos, subirAFotosCloudinary, registroCitaController.ingresarRegistro);
// Consultar registros
router.get('/', verificarToken, registroCitaController.consultarRegistros);
// Actualizar registro (PATCH)
router.patch('/:id', verificarToken, uploadFotos, subirAFotosCloudinary, registroCitaController.actualizarRegistro);


export default router;