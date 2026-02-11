import { Request, Response } from "express";
import { Usuario } from "../models/usuariosModel";

class UsuariosController {

    constructor(){

    }

    async consultar(req: Request, res: Response) {

    }

    async consultarDetalle(req: Request, res: Response) {
    }

    async ingresar(req: Request, res: Response){
        try {
            const registro = Usuario.create(req.body);
            await registro.save();
            res.status(201).json(registro);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }
        }
    }

    async actualizar(req: Request, res: Response){
    }

    async borrar(){

    }

}

export default new UsuariosController();