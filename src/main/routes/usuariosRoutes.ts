import express from 'express';
import usuariosController from '../controllers/usuariosController';
import { verificarToken } from '../helpers/auth';
const router = express.Router();


router.get('/',  verificarToken, usuariosController.consultar);
router.post('/', usuariosController.ingresar);

router.post('/login', usuariosController.login);

router.route("/:id")
    .get(verificarToken, usuariosController.consultarDetalle)
    .put(verificarToken, usuariosController.actualizar)
    .delete(verificarToken, usuariosController.borrar);

export default router;