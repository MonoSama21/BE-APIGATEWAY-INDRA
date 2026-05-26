import express from 'express';
import usuariosController from '../controllers/usuariosController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = express.Router();

// Endpoints públicos
router.post('/login', usuariosController.login);
router.post('/registrar', usuariosController.registrar);

// Endpoints protegidos (requieren token)
router.put('/datos', verificarToken, usuariosController.cambiarDatos);
router.put('/password', verificarToken, usuariosController.cambiarPassword);
router.get('/', verificarToken, usuariosController.consultar);

export default router;