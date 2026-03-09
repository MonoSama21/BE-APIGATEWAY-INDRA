import { Request, Response } from "express";
import { Cargo } from "../models/cargosModel";
import { AppDataSource } from "../db/conexion";
import { ensureConnection } from '../helpers/dbHelper';


class CargosController {
    
    constructor() {
    
    }

    async consultar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de registrar
        await ensureConnection();
        // Construye el filtro dinámicamente
        const { estado } = req.query;
        const where: any = {};
        if (estado !== undefined) {
            where.estado = estado === "true";
        }

        try {
            const [cargos] = await Cargo.findAndCount({
                select: ["id", "cargo", "descripcion", "estado"],
                where
            });

            res.status(200).json({
                succes: true,
                cargos
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
            const campos = ['cargo', 'descripcion'];
            const faltantes = campos.filter(campo => !req.body[campo]);
            if (faltantes.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    message: `Faltan campos: ${faltantes.join(', ')}` 
                });
            }

            //VALIDACION DE CARGO UNICO
            const cargoExistente = await Cargo.findOneBy({ cargo: req.body.cargo });
            if (cargoExistente) {
                return res.status(400).json({ 
                    success: false,
                    message: "El cargo ya existe" 
                });
            }

            const nuevoCargo = Cargo.create(req.body);
            await nuevoCargo.save();
            res.status(201).json({ 
                success: true, 
                data: `Cargo '${nuevoCargo.cargo}' registrado exitosamente con ID ${nuevoCargo.id}`
            });


        } catch (error) {
            
        }
    }


    async actualizar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de consultar
        await ensureConnection();
        const { id } = req.params;

        try {
            const cargo = await Cargo.findOneBy({ id: Number(id) });
            if (!cargo) {
                return res.status(404).json({
                    success: false,
                    message: "Cargo no encontrado"
                });
            }

            //VALIDAR SI EL NUEVO NOMBRE DE CARGO YA EXISTE EN OTRO REGISTRO
            if (req.body.cargo && req.body.cargo !== cargo.cargo) {
                const cargoExistente = await Cargo.findOneBy({ cargo: req.body.cargo });
                if (cargoExistente) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "El cargo ya existe" 
                    });
                }
            }

            cargo.cargo = req.body.cargo || cargo.cargo;
            cargo.descripcion = req.body.descripcion || cargo.descripcion;
            await cargo.save();

            res.status(200).json({
                success: true,
                message: "Cargo actualizado correctamente",
                data: cargo
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
        // ✅ Asegurar conexión antes de consultar
        await ensureConnection();
        
        const { id } = req.params;
        try {
            const cargo = await Cargo.findOneBy({ id: Number(id) });
            if (!cargo) {
                return res.status(404).json({
                    success: false,
                    message: "Cargo no encontrado"
                });
            }

            cargo.estado = false; // Cambiar estado a inactivo en lugar de eliminar
            await cargo.save();

            res.status(200).json({
                success: true,
                message: "Cargo desactivado correctamente"
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

export default new CargosController();