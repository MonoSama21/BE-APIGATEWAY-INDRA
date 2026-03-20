import { Request, Response } from "express";
import { Personal } from "../models/personalModel";
import QRCode from 'qrcode';
import { ensureConnection } from '../helpers/dbHelper';
import { Cargo } from "../models/cargosModel";
import { Distrito } from "../models/distritosModel";
import { InstitucionEducativa } from "../models/institucionesEducativasModel";

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
            .leftJoinAndSelect('personal.distrito', 'distrito')
            .leftJoinAndSelect('personal.institucionEducativa', 'institucionEducativa')
            .select([
                'personal.id',
                'personal.dni',
                'personal.nombres',
                'personal.apellidos',
                'personal.cargoId',
                'personal.distritoId',
                'personal.nivelModalidad',
                'personal.institucionEducativaId',
                'personal.codigoQR',
                'personal.foto',
                'personal.estado',
                'cargo.id',
                'cargo.cargo',
                'distrito.id',
                'distrito.distrito',
                'distrito.alias',
                'institucionEducativa.id',
                'institucionEducativa.codigoModular',
                'institucionEducativa.nombreIE',
                'institucionEducativa.nivelModalidad'
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
            .leftJoinAndSelect('personal.distrito', 'distrito')
            .leftJoinAndSelect('personal.institucionEducativa', 'institucionEducativa')
            .select([
                'personal.id',
                'personal.dni',
                'personal.nombres',
                'personal.apellidos',
                'personal.cargoId',
                'personal.distritoId',
                'personal.nivelModalidad',
                'personal.institucionEducativaId',
                'personal.codigoQR',
                'personal.foto',
                'personal.estado',
                'cargo.id',
                'cargo.cargo',
                'cargo.descripcion',
                'distrito.id',
                'distrito.distrito',
                'distrito.alias',
                'institucionEducativa.id',
                'institucionEducativa.codigoModular',
                'institucionEducativa.nombreIE',
                'institucionEducativa.nivelModalidad'
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

            // ✅ VALIDAR QUE EL DISTRITO EXISTA (si se proporciona)
            if (req.body.distritoId) {
                const distritoExiste = await Distrito.findOneBy({ id: req.body.distritoId });
                if (!distritoExiste) {
                    return res.status(400).json({
                        success: false,
                        message: "El distrito especificado no existe"
                    });
                }
            }

            // ✅ VALIDAR NIVEL/MODALIDAD (si se proporciona)
            if (req.body.nivelModalidad) {
                const nivelesValidos = ['INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO'];
                if (!nivelesValidos.includes(req.body.nivelModalidad)) {
                    return res.status(400).json({
                        success: false,
                        message: `Nivel/Modalidad inválido. Debe ser uno de: ${nivelesValidos.join(', ')}`
                    });
                }
            }

            // ✅ VALIDAR QUE LA INSTITUCIÓN EDUCATIVA EXISTA (si se proporciona)
            if (req.body.institucionEducativaId) {
                const ieExiste = await InstitucionEducativa.findOneBy({ id: req.body.institucionEducativaId });
                if (!ieExiste) {
                    return res.status(400).json({
                        success: false,
                        message: "La institución educativa especificada no existe"
                    });
                }

                // ✅ VALIDAR COINCIDENCIA ENTRE nivelModalidad E institucionEducativaId
                //if (req.body.nivelModalidad && ieExiste.nivelModalidad !== req.body.nivelModalidad) {
                //    return res.status(400).json({
                //        success: false,
                //        message: `El nivel/modalidad del personal (${req.body.nivelModalidad}) no coincide con el de la institución educativa (${ieExiste.nivelModalidad})`
                //    });
                //}


                // ✅ SOBRESCRIBIR DISTRITO: si la institución tiene distrito, usarlo automáticamente
                if (ieExiste.distritoId) {
                    req.body.distritoId = ieExiste.distritoId;
                }
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

            // ✅ Cargar las relaciones para la respuesta
            const personalConRelaciones = await Personal.findOne({
                where: { id: registro.id },
                relations: ['cargo', 'distrito', 'institucionEducativa']
            });

            res.status(201).json({
                success: true,
                message: `Personal ${registro.nombres} ${registro.apellidos} con ID ${registro.id} creado exitosamente`,
                personal: personalConRelaciones
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

            const { dni, nombres, apellidos } = req.body;

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

            // Si se proporciona distritoId, validar que exista
            if (req.body.distritoId) {
                const distritoExiste = await Distrito.findOneBy({ id: req.body.distritoId });
                if (!distritoExiste) {
                    return res.status(400).json({
                        success: false,
                        message: "El distrito especificado no existe"
                    });
                }
                personal.distritoId = req.body.distritoId;
            }

            // Si se proporciona nivelModalidad, validar que sea válido
            if (req.body.nivelModalidad) {
                const nivelesValidos = ['INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO'];
                if (!nivelesValidos.includes(req.body.nivelModalidad)) {
                    return res.status(400).json({
                        success: false,
                        message: `Nivel/Modalidad inválido. Debe ser uno de: ${nivelesValidos.join(', ')}`
                    });
                }
                personal.nivelModalidad = req.body.nivelModalidad;
            }

            // Si se proporciona institucionEducativaId, validar que exista
            if (req.body.institucionEducativaId) {
                const ieExiste = await InstitucionEducativa.findOneBy({ id: req.body.institucionEducativaId });
                if (!ieExiste) {
                    return res.status(400).json({
                        success: false,
                        message: "La institución educativa especificada no existe"
                    });
                }

                // ✅ VALIDAR COINCIDENCIA ENTRE nivelModalidad E institucionEducativaId
                const nivelModalidadActual = req.body.nivelModalidad || personal.nivelModalidad;
                if (nivelModalidadActual && ieExiste.nivelModalidad !== nivelModalidadActual) {
                    return res.status(400).json({
                        success: false,
                        message: `El nivel/modalidad del personal (${nivelModalidadActual}) no coincide con el de la institución educativa (${ieExiste.nivelModalidad})`
                    });
                }

                // ✅ SOBRESCRIBIR DISTRITO: si la institución tiene distrito, usarlo automáticamente
                if (ieExiste.distritoId) {
                    personal.distritoId = ieExiste.distritoId;
                }

                personal.institucionEducativaId = req.body.institucionEducativaId;
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

            // Recargar con las relaciones
            const personalActualizado = await Personal.findOne({
                where: { id: personal.id },
                relations: ['cargo', 'distrito', 'institucionEducativa']
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

    async importarCSV(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de importar
        await ensureConnection();

        try {
            // Obtener datos de CSV o Excel (el middleware correspondiente los proporciona)
            let datos = (req as any).csvData || (req as any).excelData;
            
            if (!datos || !Array.isArray(datos)) {
                return res.status(400).json({
                    success: false,
                    message: "No se proporcionó un archivo CSV o EXCEL válido"
                });
            }

            const nivelesValidos = ['INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO'];
            const resultados = {
                exitosos: 0,
                errores: 0,
                detalles: [] as any[]
            };

            // Procesar cada fila del CSV/EXCEL
            for (let i = 0; i < datos.length; i++) {
                const fila = datos[i];
                const nroFila = i + 2; // +2 porque fila 1 es header y empieza en 0

                try {
                    // Validar campos obligatorios
                    if (!fila.dni || !fila.nombres || !fila.apellidos || !fila.cargoId) {
                        resultados.detalles.push({
                            fila: nroFila,
                            dni: fila.dni,
                            error: "Faltan campos obligatorios (dni, nombres, apellidos, cargoId)"
                        });
                        resultados.errores++;
                        continue;
                    }

                    // Validar formato de DNI
                    if (!/^\d{8}$/.test(String(fila.dni).trim())) {
                        resultados.detalles.push({
                            fila: nroFila,
                            dni: fila.dni,
                            error: "El DNI debe tener 8 dígitos"
                        });
                        resultados.errores++;
                        continue;
                    }

                    // Validar DNI único
                    const dniExistente = await Personal.findOneBy({ dni: String(fila.dni).trim() });
                    if (dniExistente) {
                        resultados.detalles.push({
                            fila: nroFila,
                            dni: fila.dni,
                            error: "El DNI ya está registrado"
                        });
                        resultados.errores++;
                        continue;
                    }

                    // Validar que el cargo exista
                    const cargoExiste = await Cargo.findOneBy({ id: Number(fila.cargoId) });
                    if (!cargoExiste) {
                        resultados.detalles.push({
                            fila: nroFila,
                            dni: fila.dni,
                            error: `El cargoId ${fila.cargoId} no existe`
                        });
                        resultados.errores++;
                        continue;
                    }

                    // Validar distrito si se proporciona
                    if (fila.distritoId) {
                        const distritoExiste = await Distrito.findOneBy({ id: Number(fila.distritoId) });
                        if (!distritoExiste) {
                            resultados.detalles.push({
                                fila: nroFila,
                                dni: fila.dni,
                                error: `El distritoId ${fila.distritoId} no existe`
                            });
                            resultados.errores++;
                            continue;
                        }
                    }

                    // Validar nivel/modalidad si se proporciona
                    if (fila.nivelModalidad && !nivelesValidos.includes(fila.nivelModalidad)) {
                        resultados.detalles.push({
                            fila: nroFila,
                            dni: fila.dni,
                            error: `Nivel/Modalidad inválido. Debe ser: ${nivelesValidos.join(', ')}`
                        });
                        resultados.errores++;
                        continue;
                    }

                    // Validar institución educativa si se proporciona
                    let ieExiste = null;
                    if (fila.institucionEducativaId) {
                        ieExiste = await InstitucionEducativa.findOneBy({ id: Number(fila.institucionEducativaId) });
                        if (!ieExiste) {
                            resultados.detalles.push({
                                fila: nroFila,
                                dni: fila.dni,
                                error: `La institucionEducativaId ${fila.institucionEducativaId} no existe`
                            });
                            resultados.errores++;
                            continue;
                        }

                        // ✅ Validación de nivel/modalidad comentada para permitir importación flexible
                        // Los niveles pueden ajustarse después desde la interfaz
                        // if (fila.nivelModalidad && ieExiste.nivelModalidad !== fila.nivelModalidad) {
                        //     resultados.detalles.push({
                        //         fila: nroFila,
                        //         dni: fila.dni,
                        //         error: `Nivel/Modalidad no coincide. Personal: ${fila.nivelModalidad}, IE: ${ieExiste.nivelModalidad}`
                        //     });
                        //     resultados.errores++;
                        //     continue;
                        // }
                    }

                    // Preparar datos para insertar
                    const datosPersonal: any = {
                        dni: String(fila.dni).trim(),
                        nombres: String(fila.nombres).trim(),
                        apellidos: String(fila.apellidos).trim(),
                        cargoId: Number(fila.cargoId),
                        estado: fila.estado !== undefined ? fila.estado === 'true' || fila.estado === true : true
                    };

                    if (fila.distritoId) datosPersonal.distritoId = Number(fila.distritoId);
                    if (fila.nivelModalidad) datosPersonal.nivelModalidad = fila.nivelModalidad;
                    if (fila.institucionEducativaId) datosPersonal.institucionEducativaId = Number(fila.institucionEducativaId);

                    // Aplicar sobrescritura de distrito si existe IE
                    if (ieExiste && ieExiste.distritoId) {
                        datosPersonal.distritoId = ieExiste.distritoId;
                    }

                    // Crear el registro
                    const registro = Personal.create(datosPersonal);
                    await registro.save();

                    // Generar QR
                    const dataQR = JSON.stringify({
                        id: registro.id,
                        dni: registro.dni,
                        nombres: registro.nombres,
                        apellidos: registro.apellidos,
                        cargoId: registro.cargoId
                    });

                    const qrBase64 = await QRCode.toDataURL(dataQR, {
                        errorCorrectionLevel: 'H',
                        type: 'image/png',
                        margin: 1,
                        width: 300
                    });

                    registro.codigoQR = qrBase64;
                    await registro.save();

                    resultados.exitosos++;
                    resultados.detalles.push({
                        fila: nroFila,
                        dni: fila.dni,
                        estado: "Insertado exitosamente",
                        id: registro.id
                    });

                } catch (error) {
                    resultados.errores++;
                    resultados.detalles.push({
                        fila: nroFila,
                        dni: fila.dni,
                        error: error instanceof Error ? error.message : "Error desconocido"
                    });
                }
            }

            res.status(200).json({
                success: true,
                message: `Importación completada: ${resultados.exitosos} exitosos, ${resultados.errores} errores`,
                resumen: {
                    total: datos.length,
                    exitosos: resultados.exitosos,
                    errores: resultados.errores
                },
                detalles: resultados.detalles
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: "Error al importar datos: " + error.message
                });
            }
        }
    }
}

export default new PersonalController();
