import express from 'express';
import usuariosController from '../controllers/usuariosController';
const router = express.Router();


router.get('/', usuariosController.consultar);
router.post('/', usuariosController.ingresar);



export default router;