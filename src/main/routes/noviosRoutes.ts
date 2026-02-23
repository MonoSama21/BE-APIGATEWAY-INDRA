import express from 'express';
import noviosController from '../controllers/noviosController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', noviosController.consultar);
router.post('/', noviosController.ingresar);
router.post('/login', noviosController.login);
router.put('/password', verificarToken, noviosController.cambiarPassword);


router.route("/:id")
    .get(verificarToken, noviosController.consultarDetalle)

export default router;