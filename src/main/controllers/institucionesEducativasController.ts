import { Request, Response } from "express";
import { InstitucionEducativa } from "../models/institucionesEducativasModel";
import { Distrito } from "../models/distritosModel";
import { ensureConnection } from '../helpers/dbHelper';


class InstitucionesEducativasController {
    
    constructor() {
    
    }

    async consultar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de consultar
        await ensureConnection();
        const { estado, nivelModalidad } = req.query;
        const where: any = {};
        if (estado !== undefined) {
            where.estado = estado === "true";
        }
        if (nivelModalidad) {
            where.nivelModalidad = nivelModalidad;
        }

        try {
            const [instituciones] = await InstitucionEducativa.findAndCount({
                select: ["id", "codigoModular", "nombreIE", "nivelModalidad", "distritoId", "estado"],
                relations: ["distrito"],
                where
            });

            res.status(200).json({
                success: true,
                instituciones
            })

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }


    async ingresar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de registrar
        await ensureConnection();

        try {
            const campos = ['codigoModular', 'nombreIE', 'nivelModalidad', 'distritoId'];

            const faltantes = campos.filter(campo => !req.body[campo]);
            
            if (faltantes.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    message: `Faltan campos obligatorios: ${faltantes.join(', ')}`
                });
            }

            // Validar que el código modular no exista
            const ieExistente = await InstitucionEducativa.findOneBy({ codigoModular: req.body.codigoModular });
            if (ieExistente) {
                return res.status(400).json({
                    success: false,
                    message: "El código modular ya existe"
                });
            }

            // Validar que el nivelModalidad sea válido
            const nivelesValidos = ['INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO'];
            if (!nivelesValidos.includes(req.body.nivelModalidad)) {
                return res.status(400).json({
                    success: false,
                    message: `Nivel/Modalidad inválido. Debe ser uno de: ${nivelesValidos.join(', ')}`
                });
            }

            // ✅ Validar que el distrito exista (si se proporciona)
            if (req.body.distritoId) {
                const distritoExiste = await Distrito.findOneBy({ id: req.body.distritoId });
                if (!distritoExiste) {
                    return res.status(400).json({
                        success: false,
                        message: "El distrito especificado no existe"
                    });
                }
            }

            const nuevaIE = InstitucionEducativa.create(req.body);
            await nuevaIE.save();

            // REMOVER CAMPOS
            const { createdat, updatedat, ...ieFiltered } = nuevaIE;

            res.status(201).json({
                success: true,
                message: `Institución educativa ${nuevaIE.nombreIE} creada exitosamente`,
                institucion: ieFiltered
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: "Error al crear la institución: " + error.message
                });
            }
        }
    }

    async actualizar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de actualizar
        await ensureConnection();
        const { id } = req.params;

        try {
            const ie = await InstitucionEducativa.findOneBy({ id: Number(id) });

            if (!ie) {
                return res.status(404).json({
                    success: false,
                    message: "Institución educativa no encontrada"
                });
            }

            const { codigoModular, nombreIE, nivelModalidad, estado } = req.body;

            // Validar que el nuevo código modular no exista en otro registro
            if (codigoModular && codigoModular !== ie.codigoModular) {
                const ieExistente = await InstitucionEducativa.findOneBy({ codigoModular });
                if (ieExistente) {
                    return res.status(400).json({
                        success: false,
                        message: "El código modular ya existe"
                    });
                }
            }

            // Validar nivelModalidad si se proporciona
            if (nivelModalidad) {
                const nivelesValidos = ['INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO'];
                if (!nivelesValidos.includes(nivelModalidad)) {
                    return res.status(400).json({
                        success: false,
                        message: `Nivel/Modalidad inválido. Debe ser uno de: ${nivelesValidos.join(', ')}`
                    });
                }
            }

            // ✅ Validar que el distrito exista (si se proporciona)
            if (req.body.distritoId) {
                const distritoExiste = await Distrito.findOneBy({ id: req.body.distritoId });
                if (!distritoExiste) {
                    return res.status(400).json({
                        success: false,
                        message: "El distrito especificado no existe"
                    });
                }
            }

            // Actualizar datos
            if (codigoModular) ie.codigoModular = codigoModular;
            if (nombreIE) ie.nombreIE = nombreIE;
            if (nivelModalidad) ie.nivelModalidad = nivelModalidad;
            if (req.body.distritoId) ie.distritoId = req.body.distritoId;
            if (estado !== undefined) ie.estado = estado;

            await ie.save();

            const { createdat, updatedat, ...ieFiltered } = ie;

            res.status(200).json({
                success: true,
                message: "Institución educativa actualizada correctamente",
                institucion: ieFiltered
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: "Error al actualizar la institución: " + error.message
                });
            }
        }
    }

    async cambiarEstado(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de cambiar estado
        await ensureConnection();
        const { id } = req.params;
        const { estado } = req.body;

        try {
            const ie = await InstitucionEducativa.findOneBy({ id: Number(id) });

            if (!ie) {
                return res.status(404).json({
                    success: false,
                    message: "Institución educativa no encontrada"
                });
            }

            ie.estado = estado;
            await ie.save();

            const { createdat, updatedat, ...ieFiltered } = ie;

            res.status(200).json({
                success: true,
                message: `Institución ${estado ? 'activada' : 'desactivada'} correctamente`,
                institucion: ieFiltered
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    async borrar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de borrar
        await ensureConnection();
        const { id } = req.params;

        try {
            const ie = await InstitucionEducativa.findOneBy({ id: Number(id) });

            if (!ie) {
                return res.status(404).json({
                    success: false,
                    message: "Institución educativa no encontrada"
                });
            }

            ie.estado = false; // Cambiar estado a inactivo en lugar de eliminar
            await ie.save();

            res.status(200).json({
                success: true,
                message: "Institución desactivada correctamente"
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }
}

export default new InstitucionesEducativasController();
