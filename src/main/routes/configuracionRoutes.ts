import express from 'express';
import configuracionController from '../controllers/configuracionController';
import { verificarToken } from '../helpers/auth';
const router = express.Router();


router.get('/', configuracionController.consultar);
router.post('/',  verificarToken, configuracionController.ingresar);
router.put('/', verificarToken, configuracionController.actualizar);



export default router;