import { Request, Response } from "express";
import { Plato } from "../models/platosModel";

class PlatoController {

    constructor() {

    }

    async consultar(req: Request, res: Response) {
        try {
            const data = await Plato.find();
            res.status(200).json(data);
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }

    }

    async consultarDetalle(req: Request, res: Response){
        const { id } = req.params;
       try {
            const registro = await Plato.findOneBy({ id: Number(id) });
            if (!registro) { 
                throw new Error('Plato no encontrado');
            }
            res.status(200).json(registro);
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }
    }

    async ingresar(req: Request, res: Response){
       try {
            const registro = Plato.create(req.body);
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
            const registro = await Plato.findOneBy({ id: Number(id) });
            if (!registro) { 
                throw new Error('Plato no encontrado');
            }
            await Plato.update({ id: Number(id) }, req.body);
            const registroActualizado = await Plato.findOneBy({ id: Number(id) });
            res.status(200).json(registroActualizado);
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }
    }

    async borrar(req: Request, res: Response){
        const { id } = req.params;
       try {
            const registro = await Plato.findOneBy({ id: Number(id) });
            if (!registro) { 
                throw new Error('Plato no encontrado');
            }
            await Plato.delete({ id: Number(id) });
            res.status(200).send({ message: `Plato con ID ${id} eliminado correctamente` });
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }
    }


}


// Exportamos una instancia de la clase para usarla en las rutas
export default new PlatoController();