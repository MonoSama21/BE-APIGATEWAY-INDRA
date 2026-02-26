import { Request, Response } from "express";
import { RegistroCita } from "../models/registrosCitasModel";
import { Novio } from "../models/noviosModel";
import { Cita } from "../models/citasModel";
import { FotoCita } from "../models/fotosCitaModel";
import { AppDataSource } from '../db/conexion';


class RegistrosCitasController {
    // PATCH: Actualizar registro de cita
    async actualizarRegistro(req: Request, res: Response) {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
            const registroId = req.params.id;
            const { citaId, comentario } = req.body;
            const fotosCloudinary = (req as any).fotosCloudinary; // opcional, puede venir de un middleware

            // Buscar el registro existente
            const registro = await RegistroCita.findOne({ where: { id: Number(registroId) }, relations: ["cita", "fotos"] });
            if (!registro) {
                return res.status(404).json({ success: false, message: "Registro no encontrado" });
            }

            // Si se envía citaId, actualizar la cita
            if (citaId) {
                const cita = await Cita.findOneBy({ id: citaId });
                if (!cita) {
                    return res.status(400).json({ success: false, message: "Cita no encontrada" });
                }
                registro.cita = cita;
            }

            // Si se envía comentario, actualizarlo
            if (comentario !== undefined) {
                registro.comentario = comentario;
            }

            await registro.save();

            // Obtener las fotos actuales
            let fotos = await FotoCita.find({ where: { registro: { id: registro.id } }, order: { id: "ASC" } });

            // Lógica para actualizar fotos:
            if (Array.isArray(fotosCloudinary) && fotosCloudinary.length > 0 && fotosCloudinary.length <= 2) {
                // Caso 1: Se envía una sola foto
                if (fotosCloudinary.length === 1 && fotos.length > 0) {
                    // Reemplaza la primera foto, conserva la segunda
                    if (fotos[0]) {
                        await FotoCita.update(fotos[0].id, { url: fotosCloudinary[0] });
                    }
                }
                // Caso 2: Se envían dos fotos
                else if (fotosCloudinary.length === 2) {
                    // Si hay dos fotos, actualiza ambas
                    if (fotos.length === 2) {
                        if (fotos[0]) await FotoCita.update(fotos[0].id, { url: fotosCloudinary[0] });
                        if (fotos[1]) await FotoCita.update(fotos[1].id, { url: fotosCloudinary[1] });
                    } else {
                        // Si solo hay una, actualiza la primera y crea la segunda
                        if (fotos[0]) await FotoCita.update(fotos[0].id, { url: fotosCloudinary[0] });
                        await FotoCita.create({ url: fotosCloudinary[1], registro }).save();
                    }
                }
                // Caso especial: No hay fotos previas, crea nuevas
                else if (fotos.length === 0) {
                    for (const url of fotosCloudinary) {
                        await FotoCita.create({ url, registro }).save();
                    }
                }
            }
            // Caso 3: No se envían fotos, se conservan todas

            // Obtener las URLs de las fotos asociadas (actualizadas)
            fotos = await FotoCita.find({ where: { registro: { id: registro.id } }, order: { id: "ASC" } });
            const urls = fotos.map(f => f.url);

            // Construir el objeto de respuesta
            const registroResponse = {
                cita: {
                    id: registro.cita.id,
                    titulo: registro.cita.titulo,
                    descripcion: registro.cita.descripcion
                },
                comentario: registro.comentario,
                fotos: urls,
                id: registro.id,
                fechaRealizada: registro.fechaRealizada
            };

            res.status(200).json({
                success: true,
                message: "Registro actualizado",
                registro: registroResponse
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
        }
    }

    constructor(){

    }

    async ingresarRegistro(req: Request, res: Response) {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
            // Obtener el id del usuario autenticado (del token)
            const usuarioId = (req as any).usuario?.id || req.body.novioId;
            const { citaId, comentario } = req.body;
            const fotosCloudinary = (req as any).fotosCloudinary;
            

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


            // Crear el registro
            const registro = RegistroCita.create({
                cita,
                comentario
                
            });
            await registro.save();

            if (fotosCloudinary.length > 0 && fotosCloudinary.length <= 2) {
                for (const url of fotosCloudinary) {
                    await FotoCita.create({ url, registro }).save();
                }
            }

            // Asignar las fotos Cloudinary al registro
            // Obtener las URLs de las fotos asociadas
            const fotos = await FotoCita.find({ where: { registro: { id: registro.id } } });
            const urls = fotos.map(f => f.url);

            // Construir el objeto de respuesta
            const registroResponse = {
                cita: {
                    id: cita.id,
                    titulo: cita.titulo,
                    descripcion: cita.descripcion
                },
                comentario: registro.comentario,
                fotos: urls,
                id: registro.id,
                fechaRealizada: registro.fechaRealizada
            };

            res.status(201).json({
                success: true,
                message: "Cita registrada",
                registro: registroResponse
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
        }
    }

    

    async consultarRegistros(req: Request, res: Response) {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
            // Obtener page y limit de los query params, con valores por defecto
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            // Obtener registros y total
            const [registros, total] = await RegistroCita.findAndCount({
                relations: ["cita", "fotos"],
                skip,
                take: limit
            });

            res.status(200).json({
                success: true,
                registros,
                page,
                total,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ success: false, message: error.message });
        }
    }

}

export default new RegistrosCitasController();