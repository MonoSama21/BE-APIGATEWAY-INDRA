import express from 'express';
import noviosController from '../controllers/noviosController';
import { verificarToken } from '../helpers/auth';

const router = express.Router();

router.post('/', noviosController.ingresar);

export default router;