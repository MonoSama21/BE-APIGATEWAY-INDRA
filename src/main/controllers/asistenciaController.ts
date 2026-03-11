import { Request, Response } from "express";
import { Asistencia } from "../models/asistenciaModel";
import { Personal } from "../models/personalModel";
import { ensureConnection } from "../helpers/dbHelper";


const ZONA_PERU = 'America/Lima';

// Retorna la fecha actual en Perú como 'YYYY-MM-DD'
function fechaHoy(): string {
    return new Date().toLocaleDateString('en-CA', { timeZone: ZONA_PERU }); // en-CA → YYYY-MM-DD
}

// Retorna la hora actual en Perú como 'HH:MM:SS'
function horaAhora(): string {
    return new Date().toLocaleTimeString('es-PE', {
        timeZone: ZONA_PERU,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/^24:/, '00:'); // por si acaso
}

class AsistenciaController {

    // ─────────────────────────────────────────────────────────────────────────
    // REQ-F-006 + REQ-F-014 + REQ-F-015
    // Recibe el contenido del QR escaneado, valida internamente y registra
    // la ENTRADA o SALIDA automáticamente:
    //   - Sin registro hoy             → ENTRADA
    //   - Entrada sin salida           → SALIDA  (calcula horasTrabajadas)
    //   - Entrada y salida completas   → nueva ENTRADA (horario extendido)
    // ─────────────────────────────────────────────────────────────────────────
    async registrar(req: Request, res: Response) {
        await ensureConnection();
        const { qrData } = req.body;

        if (!qrData) {
            return res.status(400).json({
                success: false,
                message: "No se proporcionó ningún código QR"
            });
        }

        // ── REQ-F-014: Validar QR ──────────────────────────────────────────
        let datosQR: any;
        try {
            datosQR = JSON.parse(qrData);
        } catch {
            return res.status(400).json({
                success: false,
                message: "El código QR tiene un formato inválido"
            });
        }

        if (!datosQR.id || !datosQR.dni) {
            return res.status(400).json({
                success: false,
                message: "El código QR no contiene información válida"
            });
        }

        try {
            // Verificar que el personal exista (id + dni como doble chequeo)
            const personal = await Personal.createQueryBuilder('personal')
                .leftJoinAndSelect('personal.cargo', 'cargo')
                .select([
                    'personal.id',
                    'personal.dni',
                    'personal.nombres',
                    'personal.apellidos',
                    'personal.estado',
                    'personal.foto',
                    'cargo.id',
                    'cargo.cargo'
                ])
                .where('personal.id = :id AND personal.dni = :dni', {
                    id: datosQR.id,
                    dni: datosQR.dni
                })
                .getOne();

            if (!personal) {
                return res.status(404).json({
                    success: false,
                    message: "El código QR no corresponde a ningún personal registrado"
                });
            }

            if (!personal.estado) {
                return res.status(403).json({
                    success: false,
                    message: "El empleado está INACTIVO. No puede registrar asistencia"
                });
            }

            // ── REQ-F-015: Detectar ENTRADA o SALIDA ──────────────────────
            const hoy = fechaHoy();
            const horaActual = horaAhora();

            const registrosHoy = await Asistencia.find({
                where: { personalId: personal.id, fecha: hoy },
                order: { id: 'DESC' }
            });

            let asistencia: Asistencia;
            let tipo: string;
            let mensaje: string;

            const ultimoRegistro = registrosHoy[0];

            if (!ultimoRegistro || ultimoRegistro.estado === 'COMPLETO') {
                tipo = 'ENTRADA';
                mensaje = !ultimoRegistro
                    ? 'Entrada registrada exitosamente'
                    : 'Nueva entrada registrada (horario extendido)';

                const nuevaAsistencia = new Asistencia();
                nuevaAsistencia.personalId = personal.id;
                nuevaAsistencia.fecha = hoy;
                nuevaAsistencia.horaEntrada = horaActual;
                nuevaAsistencia.estado = 'EN_CURSO';
                await nuevaAsistencia.save();
                asistencia = nuevaAsistencia;
            } else {
                tipo = 'SALIDA';
                mensaje = 'Salida registrada exitosamente';

                ultimoRegistro.horaSalida = horaActual;
                ultimoRegistro.horasTrabajadas = this.calcularHorasTrabajadas(
                    ultimoRegistro.horaEntrada,
                    horaActual
                );
                ultimoRegistro.estado = 'COMPLETO';
                await ultimoRegistro.save();
                asistencia = ultimoRegistro;
            }

            return res.status(200).json({
                success: true,
                tipo,
                message: mensaje,
                asistencia: {
                    id: asistencia.id,
                    personalId: asistencia.personalId,
                    fecha: asistencia.fecha,
                    horaEntrada: asistencia.horaEntrada,
                    horaSalida: asistencia.horaSalida || null,
                    horasTrabajadas: asistencia.horasTrabajadas || null,
                    estado: asistencia.estado,
                    personal: {
                        dni: personal.dni,
                        nombres: personal.nombres,
                        apellidos: personal.apellidos,
                        cargo: personal.cargo?.cargo || null,
                        foto: personal.foto || null
                    }
                }
            });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    success: false,
                    message: "Error al registrar la asistencia: " + error.message
                });
            }
        }
    }

    // ─────────────────────────────────────────────────────────────
    // Obtener registros del día actual de un personal
    // ─────────────────────────────────────────────────────────────
    async consultarHoy(req: Request, res: Response) {
        await ensureConnection();
        const { personalId } = req.params;
        const hoy = fechaHoy();

        try {
            const registros = await Asistencia.find({
                where: {
                    personalId: Number(personalId),
                    fecha: hoy
                },
                order: { id: 'ASC' }
            });

            const totalMinutos = registros
                .filter(r => r.horasTrabajadas)
                .reduce((sum, r) => sum + this.horasAMinutos(r.horasTrabajadas), 0);

            return res.status(200).json({
                success: true,
                fecha: hoy,
                registros,
                totalHoras: this.minutosAHoras(totalMinutos)
            });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    // ─────────────────────────────────────────────────────────────
    // REQ-F-007: Reporte de asistencias con filtros y paginación
    // ─────────────────────────────────────────────────────────────
    async reporte(req: Request, res: Response) {
        await ensureConnection();
        const {
            fechaInicio,
            fechaFin,
            personalId,
            pagina = 1,
            limite = 10
        } = req.query;

        const paginaNum = Number(pagina);
        const limiteNum = Number(limite);
        const skip = (paginaNum - 1) * limiteNum;

        try {
            let query = Asistencia.createQueryBuilder('asistencia')
                .leftJoinAndSelect('asistencia.personal', 'personal')
                .leftJoinAndSelect('personal.cargo', 'cargo')
                .select([
                    'asistencia.id',
                    'asistencia.fecha',
                    'asistencia.horaEntrada',
                    'asistencia.horaSalida',
                    'asistencia.horasTrabajadas',
                    'asistencia.estado',
                    'personal.id',
                    'personal.dni',
                    'personal.nombres',
                    'personal.apellidos',
                    'cargo.cargo'
                ])
                .orderBy('asistencia.fecha', 'DESC')
                .addOrderBy('asistencia.id', 'DESC')
                .skip(skip)
                .take(limiteNum);

            // Filtro por personal
            if (personalId) {
                query = query.andWhere('asistencia.personalId = :personalId', {
                    personalId: Number(personalId)
                });
            }

            // Filtro por rango de fechas
            if (fechaInicio && fechaFin) {
                query = query.andWhere(
                    'asistencia.fecha BETWEEN :fechaInicio AND :fechaFin',
                    { fechaInicio, fechaFin }
                );
            } else if (fechaInicio) {
                query = query.andWhere('asistencia.fecha >= :fechaInicio', { fechaInicio });
            } else if (fechaFin) {
                query = query.andWhere('asistencia.fecha <= :fechaFin', { fechaFin });
            }

            const [asistencias, total] = await query.getManyAndCount();

            return res.status(200).json({
                success: true,
                asistencias,
                total,
                pagina: paginaNum,
                limite: limiteNum
            });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    // ─────────────────────────────────────────────────
    // REQ-F-007: Calcula diferencia entre entrada/salida
    // Retorna formato HH:MM
    // ─────────────────────────────────────────────────
    private calcularHorasTrabajadas(entrada: string, salida: string): string {
        const partsE = entrada.split(':');
        const partsS = salida.split(':');

        const minutosEntrada = Number(partsE[0]) * 60 + Number(partsE[1]);
        const minutosSalida  = Number(partsS[0]) * 60 + Number(partsS[1]);
        const diff = minutosSalida - minutosEntrada;

        if (diff <= 0) return '00:00';
        return this.minutosAHoras(diff);
    }

    private minutosAHoras(minutos: number): string {
        const h = Math.floor(minutos / 60).toString().padStart(2, '0');
        const m = (minutos % 60).toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    private horasAMinutos(horas: string): number {
        if (!horas) return 0;
        const parts = horas.split(':');
        return Number(parts[0]) * 60 + Number(parts[1]);
    }
}

export default new AsistenciaController();
