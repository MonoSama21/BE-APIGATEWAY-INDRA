import { Request, Response } from "express";
import { RegistroCita } from "../models/registrosCitasModel";
import { Novio } from "../models/noviosModel";
import { Cita } from "../models/citasModel";

class RegistrosCitasController {

    constructor(){

    }

    async ingresarRegistro(req: Request, res: Response) {
        try {
            // Obtener el id del usuario autenticado (del token)
            const usuarioId = (req as any).usuario?.id || req.body.novioId;
            const { citaId, comentario, fotos } = req.body;

            // Validar existencia de usuario y cita

            const novio = await Novio.findOneBy({ id: usuarioId });
            const cita = await Cita.findOneBy({ id: citaId });
            if (!novio || !cita) {
                return res.status(400).json({ success: false, message: "Usuario o cita no encontrada" });
            }

            // Validar que no exista ya un registro para ese usuario y cita
            const existe = await RegistroCita.findOne({ where: { cita: { id: citaId }, novio: { id: usuarioId } } });
            if (existe) {
                return res.status(400).json({ success: false, message: "Ya registraste esta cita" });
            }

            const novioInfo = {
                id: novio.id,
                nombre: novio.nombre,
                email: novio.email,
                telefono: novio.telefono
            }

            // Crear el registro
            const registro = RegistroCita.create({
                comentario,
                novio: novioInfo,
                cita
            });
            await registro.save();



            // Guardar fotos (máximo 2)
            if (Array.isArray(fotos) && fotos.length > 0 && fotos.length <= 2) {
                const { FotoCita } = await import("../models/fotosCitaModel");
                for (const url of fotos) {
                    await FotoCita.create({ url, registro }).save();
                }
            }

            res.status(201).json({ 
                success: true, 
                message: "Cita registrada", 
                registro
             });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
        }
    }

}

export default new RegistrosCitasController();