import express from 'express';
import citaController from '../controllers/citasController';
import { verificarToken } from '../middlewares/authMiddleware';
const router = express.Router();


router.get('/', verificarToken, citaController.consultar);


export default router;