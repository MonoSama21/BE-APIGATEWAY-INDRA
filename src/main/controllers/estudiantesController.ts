import { Request, Response } from "express";
import { Estudiante } from "../models/estudiantesModel";

class EstudianteController {

    constructor() {

    }

    async consultar(req: Request, res: Response) {
        try {
            const data = await Estudiante.find();
            res.status(200).json(data);
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }

    }

    async consultarDetalle(req: Request, res: Response){
        const { id } = req.params;
       try {
            const registro = await Estudiante.findOneBy({ id: Number(id) });
            if (!registro) { 
                throw new Error('Estudiante no encontrado');
            }
            res.status(200).json(registro);
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }
    }

    async ingresar(req: Request, res: Response){
       try {
            const registro = Estudiante.create(req.body);
            await registro.save();
            res.status(201).json(registro);
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }
    }

    async actualizar(req: Request, res: Response){
        const { id } = req.params;
       try {
            const registro = await Estudiante.findOneBy({ id: Number(id) });
            if (!registro) { 
                throw new Error('Estudiante no encontrado');
            }
            await Estudiante.update({ id: Number(id) }, req.body);
            const registroActualizado = await Estudiante.findOneBy({ id: Number(id) });
            res.status(200).json(registroActualizado);
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }
    }

    async borrar(req: Request, res: Response){
        const { id } = req.params;
       try {
            const registro = await Estudiante.findOneBy({ id: Number(id) });
            if (!registro) { 
                throw new Error('Estudiante no encontrado');
            }
            await Estudiante.delete({ id: Number(id) });
            res.sendStatus(204);
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }
    }


}


// Exportamos una instancia de la clase para usarla en las rutas
export default new EstudianteController();