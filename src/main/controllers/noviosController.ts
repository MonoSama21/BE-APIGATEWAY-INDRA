import { Request, Response } from 'express';
import { Novio } from '../models/noviosModel';
import bycrypt from 'bcrypt';
import { generarToken } from '../helpers/auth';

class NoviosController {
    constructor(){

    }

    async ingresar(req: Request, res: Response){
        try {
            const campos = ['nombre', 'email', 'telefono', 'password'];
            const faltantes = campos.filter(campo => !req.body[campo]);
            if (faltantes.length > 0) {
                return res.status(400).json({ error: `Campos faltantes: ${faltantes.join(', ')}` });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error al procesar la solicitud' });
        }

        const saltRounds = 10;
        const hashedPassword = await bycrypt.hash(req.body.password, saltRounds);

        const registro = Novio.create(req.body);
        await registro.save();
        res.status(201).json({
            success: true,
            message: `Novio ${registro.nombre} con ID ${registro.id} creado exitosamente`,
        });


        

     }

}

export default new NoviosController;   