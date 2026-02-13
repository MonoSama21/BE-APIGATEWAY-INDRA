import { Request, Response } from "express";
import { Categoria } from "../models/categoriasModel"; 
import { Plato } from "../models/platosModel";

class CategoriaController {

    constructor(){

    }

    async consultar(req: Request, res: Response) {
      try {
            const data = await Categoria.find( { relations: { platos: true } } );
            res.status(200).json(data);
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }        
    }

    //ESTE METODO NO LO UTILIZARE PORQUE SOLO HAY UNA Categoria, SE CONSULTA CON EL METODO CONSULTAR
    async consultarDetalle(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const registro = await Categoria.findOneBy({ id: Number(id) });
            if (!registro) {
                throw new Error('Categoría no encontrada');
            }
            res.status(200).json(registro);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }
        }
    }

    //METODO PARA INGRESAR LA CONFIG, EN CASO EXISTA SALE UN ERROR
    async ingresar(req: Request, res: Response){
        try {
            const registro = Categoria.create(req.body);
            await registro.save();
            res.status(201).json(registro);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }
        }
    }

    async actualizar(req: Request, res: Response){
        const { id } = req.params;
        try {
            const registro = await Categoria.findOneBy({ id: Number(id) });
            if (!registro) { 
                throw new Error('Categoria no encontrada');
            }
            await Categoria.update({ id: Number(id) }, req.body);
            const registroActualizado = await Categoria.findOneBy({ id: Number(id) });
            res.status(200).json(registroActualizado);
        } catch (error) {
            if (error instanceof Error) 
                res.status(500).send(error.message);
        }
    }

    async borrar(req: Request, res: Response){
        const { id } = req.params;
        try {
            const registro = await Categoria.findOneBy({ id: Number(id) });
            if (!registro) { 
                throw new Error('Categoria no encontrada');
            }
            await Categoria.delete({ id: Number(id) });
            res.status(200).send({ message: `Categoria con ID ${id} eliminada correctamente` });
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send({ message: err.message });
        }
    }

}

export default new CategoriaController();