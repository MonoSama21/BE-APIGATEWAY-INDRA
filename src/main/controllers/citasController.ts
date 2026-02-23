import { Request, Response } from 'express';
import { Cita } from '../models/citasModel';

class CitaController {

    constructor(){

    }

    async consultar(req: Request, res: Response) {  
        try {
            const data = await Cita.find();
            res.status(200).json(data);
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ error: error.message });
           
        }

    }

}

export default new CitaController();
