import { Request, Response } from "express";
import { Configuracion } from "../models/configuracionModel";

class ConfiguracionController {

    constructor(){

    }

    async consultar(req: Request, res: Response) {
      try {
            const data = await Configuracion.findOne({ where: { id: 1 } });
            if (!data){
                throw new Error('No se encontró la configuración');
            }
            res.status(200).json(data);
        } catch (err) {
            if (err instanceof Error) 
                res.status(500).send(err.message);
        }        
    }

    //ESTE METODO NO LO UTILIZARE PORQUE SOLO HAY UNA CONFIGURACION, SE CONSULTA CON EL METODO CONSULTAR
    async consultarDetalle(req: Request, res: Response) {
    }

    //METODO PARA INGRESAR LA CONFIG, EN CASO EXISTA SALE UN ERROR
    async ingresar(req: Request, res: Response){
        try {
            let config = await Configuracion.findOne({ where: { id: 1 } });

            if (config) {
                res.status(400).json({ message: "Ya existe una configuración, solo se permite una." });
            }else{
                const registro = Configuracion.create({ ...req.body, id: 1 });
                await registro.save();
                res.status(201).json(registro);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }
        }
    }

    async actualizar(req: Request, res: Response){
        try {
            const registro = await Configuracion.findOne({ where: { id: 1 } });
            if (!registro) { 
                throw new Error('Configuración no encontrada');
            }
            await Configuracion.update({ id: 1 }, req.body);
            const registroActualizado = await Configuracion.findOne({ where: { id: 1 } });
            res.status(200).json(registroActualizado);
        } catch (error) {
            if (error instanceof Error) 
                res.status(500).send(error.message);
        }
    }

    //NO IMPLEMENTADO DE MOMENTO
    async borrar(){
        console.log("No lo voy a utilizar de momento")
    }

}

export default new ConfiguracionController();