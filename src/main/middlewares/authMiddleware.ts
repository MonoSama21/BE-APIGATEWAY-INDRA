import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
import { Usuario } from '../models/usuariosModel';

dotenv.config();

interface TokenPayload {
    email: string;
    iat?: number;
    exp?: number;
}

export async function verificarToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token requerido'
        });    
    }    

    try {
        const dataToken = jwt.verify(token as string, process.env.JWT_TOKEN_SECRET as string) as TokenPayload;
        // Busca el usuario en la base de datos para obtener el rol
        const usuario = await Usuario.findOne({ where: { email: dataToken.email } });
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Guardar datos del usuario en el request para usar después
        (req as any).usuario = { email: dataToken.email, rol: usuario.rol };
        console.log('✅ Token válido para:', dataToken.email, 'con rol:', usuario.rol);
        next();      
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token no válido o expirado'
        });
    }
};
