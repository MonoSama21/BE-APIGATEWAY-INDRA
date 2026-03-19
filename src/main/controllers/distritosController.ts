import { Request, Response } from "express";
import { Distrito } from "../models/distritosModel";
import { ensureConnection } from '../helpers/dbHelper';


class DistritosController {
    
    constructor() {
    
    }

    async consultar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de consultar
        await ensureConnection();
        const { estado } = req.query;
        const where: any = {};
        if (estado !== undefined) {
            where.estado = estado === "true";
        }

        try {
            const [distritos] = await Distrito.findAndCount({
                select: ["id", "distrito", "alias", "estado"],
                where
            });

            res.status(200).json({
                success: true,
                distritos
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
            const campos = ['distrito', 'alias'];

            const faltantes = campos.filter(campo => !req.body[campo]);
            
            if (faltantes.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    message: `Faltan campos obligatorios: ${faltantes.join(', ')}`
                });
            }

            // Validar que el distrito no exista
            const distritoExistente = await Distrito.findOneBy({ distrito: req.body.distrito });
            if (distritoExistente) {
                return res.status(400).json({
                    success: false,
                    message: "El distrito ya existe"
                });
            }

            const aliasExistente = await Distrito.findOneBy({ alias: req.body.alias });
            if (aliasExistente) {
                return res.status(400).json({
                    success: false,
                    message: "El alias ya existe"
                });
            }


            const nuevoDistrito = Distrito.create(req.body);
            await nuevoDistrito.save();

            //REMOVER CAMPOS
            delete nuevoDistrito.createdat;
            delete nuevoDistrito.updatedat;

            res.status(201).json({
                success: true,
                message: `Distrito ${nuevoDistrito.distrito} creado exitosamente`,
                distrito: nuevoDistrito
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: "Error al crear el distrito: " + error.message
                });
            }
        }
    }

    async actualizar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de actualizar
        await ensureConnection();
        const { id } = req.params;

        try {
            const distrito = await Distrito.findOneBy({ id: Number(id) });

            if (!distrito) {
                return res.status(404).json({
                    success: false,
                    message: "Distrito no encontrado"
                });
            }

            const { distrito: nombreDistrito, alias, estado } = req.body;

            // Validar que el nuevo nombre no exista en otro registro
            if (nombreDistrito && nombreDistrito !== distrito.distrito) {
                const distritoExistente = await Distrito.findOneBy({ distrito: nombreDistrito });
                if (distritoExistente) {
                    return res.status(400).json({
                        success: false,
                        message: "El nombre del distrito ya existe"
                    });
                }
            }

            if (alias && alias !== distrito.alias) {
                const aliasExistente = await Distrito.findOneBy({ alias });
                if (aliasExistente) {
                    return res.status(400).json({
                        success: false,
                        message: "El alias del distrito ya existe"
                    });
                }
            }

            // Actualizar datos
            if (nombreDistrito) distrito.distrito = nombreDistrito;
            if (alias !== undefined) distrito.alias = alias;
            if (estado !== undefined) distrito.estado = estado;
        

            await distrito.save();
            const { createdat, updatedat, ...distritoActualizado } = distrito; // Excluir campos de fecha

            res.status(200).json({
                success: true,
                message: "Distrito actualizado correctamente",
                distrito: distritoActualizado
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: "Error al actualizar el distrito: " + error.message
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
            const distrito = await Distrito.findOneBy({ id: Number(id) });

            if (!distrito) {
                return res.status(404).json({
                    success: false,
                    message: "Distrito no encontrado"
                });
            }

            distrito.estado = estado;
            await distrito.save();

            res.status(200).json({
                success: true,
                message: `Distrito ${estado ? 'activado' : 'desactivado'} correctamente`,
                distrito
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
            const distrito = await Distrito.findOneBy({ id: Number(id) });

            if (!distrito) {
                return res.status(404).json({
                    success: false,
                    message: "Distrito no encontrado"
                });
            }

            distrito.estado = false; // Cambiar estado a inactivo en lugar de eliminar
            await distrito.save();

            res.status(200).json({
                success: true,
                message: "Distrito desactivado correctamente"
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

export default new DistritosController();
