import { Request, Response } from 'express';
import { Registro } from '../models/registrosModel';
import { ensureConnection } from '../helpers/dbHelper';

class RegistrosController {
    async crear(req: Request, res: Response) {
        await ensureConnection();
        try {
            const {
                nombreCompleto,
                dni,
                cargo,
                missionId,
                missionName,
                score,
                total,
                pokeball
            } = req.body;

            // Validaciones: campos obligatorios
            if (!nombreCompleto || !dni || !cargo || missionId === undefined || score === undefined || total === undefined) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Faltan campos obligatorios: nombreCompleto, dni, cargo, missionId, score, total' 
                });
            }

            // Convertir a números
            const scoreNum = Number(score);
            const totalNum = Number(total);
            const missionIdNum = Number(missionId);

            // Calcular porcentaje automáticamente
            const calculatedPercentage = Math.round((scoreNum / totalNum) * 100);

            // Determinar si está aprobado (score >= 8)
            const isApproved = scoreNum >= 8;

            const registro = Registro.create({
                nombreCompleto: nombreCompleto.trim(),
                dni: dni.trim(),
                cargo: cargo.trim(),
                missionId: missionIdNum,
                missionName: missionName?.trim() || '',
                score: scoreNum,
                total: totalNum,
                percentage: calculatedPercentage,
                approved: isApproved,
                pokeball: pokeball?.trim() || null
            });

            await registro.save();

            return res.status(201).json({ 
                success: true, 
                registro: {
                    id: registro.id,
                    nombreCompleto: registro.nombreCompleto,
                    dni: registro.dni,
                    cargo: registro.cargo,
                    missionId: registro.missionId,
                    missionName: registro.missionName,
                    score: registro.score,
                    total: registro.total,
                    percentage: registro.percentage,
                    approved: registro.approved,
                    pokeball: registro.pokeball,
                    completedAt: registro.completedAt
                }
            });
        } catch (error) {
            console.error('Error creando registro:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error creando registro' 
            });
        }
    }

    async listar(req: Request, res: Response) {
        await ensureConnection();
        try {
            const { pagina = '1', limite = '20', approved } = req.query;
            const page = Number(pagina);
            const take = Number(limite);
            const skip = (page - 1) * take;

            const where: any = {};
            if (approved !== undefined) where.approved = approved === 'true';

            const [items, total] = await Registro.findAndCount({
                where,
                order: { id: 'DESC' },
                skip,
                take
            });

            return res.status(200).json({ success: true, items, total, pagina: page, limite: take });
        } catch (error) {
            console.error('Error listando registros:', error);
            return res.status(500).json({ success: false, message: 'Error listando registros' });
        }
    }

    async detalle(req: Request, res: Response) {
        await ensureConnection();
        try {
            const { id } = req.params;
            const registro = await Registro.findOne({ where: { id: Number(id) } });
            if (!registro) return res.status(404).json({ success: false, message: 'Registro no encontrado' });
            return res.status(200).json({ success: true, registro });
        } catch (error) {
            console.error('Error detalle registro:', error);
            return res.status(500).json({ success: false, message: 'Error obteniendo el registro' });
        }
    }
}

export default new RegistrosController();
