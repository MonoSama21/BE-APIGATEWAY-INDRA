import express from 'express';
import usuariosController from '../controllers/usuariosController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', usuariosController.registrar);
router.post('/login', usuariosController.login);
router.put('/datos', verificarToken, usuariosController.cambiarDatos);
router.put('/password', verificarToken, usuariosController.cambiarPassword);
router.get('/', usuariosController.consultar);

router.route("/:id")
    .get(usuariosController.consultarDetalle)
    .delete(usuariosController.borrar)

export default router;