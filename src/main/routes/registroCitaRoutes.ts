import express from 'express';
import registroCitaController from '../controllers/registrosCitasController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', verificarToken, registroCitaController.ingresarRegistro);


export default router;