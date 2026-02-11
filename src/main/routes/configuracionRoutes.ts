import express from 'express';
import configuracionController from '../controllers/configuracionController';
const router = express.Router();


router.get('/', configuracionController.consultar);
router.post('/', configuracionController.ingresar);
router.put('/', configuracionController.actualizar);



export default router;