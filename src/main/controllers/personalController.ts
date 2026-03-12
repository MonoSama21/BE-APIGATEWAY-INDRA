import { Request, Response } from "express";
import { Personal } from "../models/personalModel";
import QRCode from 'qrcode';
import { ensureConnection } from '../helpers/dbHelper';
import { Cargo } from "../models/cargosModel";

class PersonalController {

    async consultar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de consultar
        await ensureConnection();
        const { estado, pagina = 1, limite = 10 } = req.query;
        
        // Construye el filtro dinámicamente
        const where: any = {};
        if (estado !== undefined) {
            where.estado = estado === "true";
        }
        
        // Calcular skip para la paginación
        const paginaNum = Number(pagina);
        const limiteNum = Number(limite);
        const skip = (paginaNum - 1) * limiteNum;

        try {
            const [personal, total] = await Personal.createQueryBuilder('personal')
            .leftJoinAndSelect('personal.cargo', 'cargo')
            .select([
                'personal.id',
                'personal.dni',
                'personal.nombres',
                'personal.apellidos',
                'personal.cargoId',
                'personal.codigoQR',
                'personal.foto',
                'personal.estado',
                'cargo.id',
                'cargo.cargo'  // Solo id y nombre del cargo
            ])
            .where(where)
            .orderBy('personal.id', 'DESC')
            .skip(skip)
            .take(limiteNum)
            .getManyAndCount();
            
            res.status(200).json({
                success: true,
                personal,
                total,
                pagina: paginaNum,
                limite: limiteNum
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

    async consultarDetalle(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de consultar
        await ensureConnection();
        const { id } = req.params;
        
        try {
            const personal = await Personal.createQueryBuilder('personal')
            .leftJoinAndSelect('personal.cargo', 'cargo')
            .select([
                'personal.id',
                'personal.dni',
                'personal.nombres',
                'personal.apellidos',
                'personal.cargoId',
                'personal.codigoQR',
                'personal.foto',
                'personal.estado',
                'cargo.id',
                'cargo.cargo',
                'cargo.descripcion'
            ])
            .where('personal.id = :id', { id: Number(id) })
            .getOne();
        
            
            if (!personal) {
                return res.status(404).json({
                    success: false,
                    message: "Personal no encontrado"
                });
            }
            
            res.status(200).json({
                success: true,
                personal: personal
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

    async registrar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de consultar
        await ensureConnection();
        try {
            const campos = ['dni', 'nombres', 'apellidos', 'cargoId'];
            const faltantes = campos.filter(campo => !req.body[campo]);
            
            // VALIDACION DE CAMPOS FALTANTES
            if (faltantes.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    message: `Faltan campos obligatorios: ${faltantes.join(', ')}`
                });
            }

            // ✅ VALIDAR QUE EL CARGO EXISTA
            const cargoExiste = await Cargo.findOneBy({ id: req.body.cargoId });
            if (!cargoExiste) {
                return res.status(400).json({
                    success: false,
                    message: "El cargo especificado no existe"
                });
            }

            // VALIDACION DE DNI UNICO
            const dniExistente = await Personal.findOneBy({ dni: req.body.dni });
            if (dniExistente) {
                return res.status(400).json({ 
                    success: false,
                    message: "El DNI ya está registrado"
                });
            }

            // VALIDACION DE DNI (8 dígitos)
            if (!/^\d{8}$/.test(req.body.dni)) {
                return res.status(400).json({
                    success: false,
                    message: "El DNI debe tener 8 dígitos"
                });
            }

            // Crear el registro de personal sin el QR primero
            const registro = Personal.create(req.body);
            await registro.save();

            // GENERAR CÓDIGO QR con la información del personal
            const dataQR = JSON.stringify({
                id: registro.id,
                dni: registro.dni,
                nombres: registro.nombres,
                apellidos: registro.apellidos,
                cargoId: registro.cargoId
            });

            // Generar QR como base64
            const qrBase64 = await QRCode.toDataURL(dataQR, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                margin: 1,
                width: 300
            });

            // Actualizar el registro con el código QR
            registro.codigoQR = qrBase64;
            await registro.save();

            // ✅ Cargar la relación del cargo para la respuesta
            const personalConCargo = await Personal.findOne({
                where: { id: registro.id },
                relations: ['cargo']
            });

            res.status(201).json({
                success: true,
                message: `Personal ${registro.nombres} ${registro.apellidos} con ID ${registro.id} creado exitosamente`,
                personal: {
                    personalConCargo
                }
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: "Error al crear el personal: " + error.message
                });
            }
        }
    }

    async actualizar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de consultar
        await ensureConnection();
        const { id } = req.params;
        
        try {
            const personal = await Personal.findOneBy({ id: Number(id) });
            
            if (!personal) {
                return res.status(404).json({
                    success: false,
                    message: "Personal no encontrado"
                });
            }

            const { dni, nombres, apellidos, cargo } = req.body;

            // VALIDAR SI EL NUEVO DNI YA EXISTE EN OTRO REGISTRO
            if (dni && dni !== personal.dni) {
                const dniExistente = await Personal.findOne({ where: { dni } });
                if (dniExistente) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "El nuevo DNI ya está registrado por otro personal" 
                    });
                }

                // Validar formato de DNI
                if (!/^\d{8}$/.test(dni)) {
                    return res.status(400).json({
                        success: false,
                        message: "El DNI debe tener 8 dígitos"
                    });
                }
            }

            // ACTUALIZAR DATOS
            personal.dni = dni || personal.dni;
            personal.nombres = nombres || personal.nombres;
            personal.apellidos = apellidos || personal.apellidos;
            
            // Si se proporciona cargoId, validar que exista
            if (req.body.cargoId) {
                const cargoExiste = await Cargo.findOneBy({ id: req.body.cargoId });
                if (!cargoExiste) {
                    return res.status(400).json({
                        success: false,
                        message: "El cargo especificado no existe"
                    });
                }
                personal.cargoId = req.body.cargoId;
            }

            // REGENERAR CÓDIGO QR si cambió algún dato
            if (dni || nombres || apellidos || req.body.cargoId) {
                const dataQR = JSON.stringify({
                    id: personal.id,
                    dni: personal.dni,
                    nombres: personal.nombres,
                    apellidos: personal.apellidos,
                    cargoId: personal.cargoId
                });

                personal.codigoQR = await QRCode.toDataURL(dataQR, {
                    errorCorrectionLevel: 'H',
                    type: 'image/png',
                    margin: 1,
                    width: 300
                });
            }

            await personal.save();

            // Recargar con la relación del cargo
            const personalActualizado = await Personal.findOne({
                where: { id: personal.id },
                relations: ['cargo']
            });

            res.status(200).json({ 
                success: true,
                message: "Datos del personal actualizados correctamente", 
                personal: personalActualizado
            });
        
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({     
                    success: false,
                    message: "Error al actualizar los datos: " + error.message 
                });
            }
        }
    }

    async cambiarEstado(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de consultar
        await ensureConnection();
        const { id } = req.params;
        const { estado } = req.body;
        
        try {
            const personal = await Personal.findOneBy({ id: Number(id) });
            
            if (!personal) {
                return res.status(404).json({
                    success: false,
                    message: "Personal no encontrado"
                });
            }

            personal.estado = estado;
            await personal.save();

            // Recargar con la relación del cargo
            const personalActualizado = await Personal.findOne({
                where: { id: personal.id },
                relations: ['cargo']
            });

            res.status(200).json({
                success: true,
                message: `Personal ${estado ? 'activado' : 'desactivado'} correctamente`,
                personal: personalActualizado
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

    async subirFoto(req: Request, res: Response) {
        await ensureConnection();
        const { id } = req.params;
        
        try {
            const personal = await Personal.findOneBy({ id: Number(id) });
            
            if (!personal) {
                return res.status(404).json({
                    success: false,
                    message: "Personal no encontrado"
                });
            }

            // Obtener la URL de Cloudinary del middleware
            const fotoUrl = (req as any).fotoCloudinary;
            
            if (!fotoUrl) {
                return res.status(400).json({
                    success: false,
                    message: "No se proporcionó ninguna foto"
                });
            }

            // Actualizar la foto
            personal.foto = fotoUrl;
            await personal.save();

            res.status(200).json({
                success: true,
                message: "Foto subida exitosamente",
                personal: {
                    id: personal.id,
                    foto: personal.foto
                }
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
            const personal = await Personal.findOneBy({ id: Number(id) });
            
            if (!personal) {
                return res.status(404).json({
                    success: false,
                    message: "Personal no encontrado"
                });
            }

            personal.estado = false; // Cambiar estado a inactivo en lugar de eliminar
            await personal.save();

            res.status(200).json({
                success: true,
                message: "Personal desactivado correctamente"
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

export default new PersonalController();
