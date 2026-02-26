import { Request, Response } from 'express';
import { Cita } from '../models/citasModel';
import { AppDataSource } from '../db/conexion';
class CitaController {

    constructor(){

    }

    async consultar(req: Request, res: Response) {  
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
            // Obtener page y limit de los query params, con valores por defecto
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const [data, total] = await Cita.findAndCount({
                skip,
                take: limit
            });

            res.status(200).json({
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ error: error.message });
        }
    }

}

export default new CitaController();
