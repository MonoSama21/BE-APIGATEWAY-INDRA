import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from "express";

dotenv.config();

interface TokenPayload {
    email: string;
    iat?: number;
    exp?: number;
}



export function generarToken(email: string){
    return jwt.sign({ email }, process.env.JWT_TOKEN_SECRET as string, { expiresIn: '1h' });
}

//EL NEX ES INDICANDO QUE HAY UN SIGUIENTE PROCESO
export function verificarToken(req: Request, res: Response, next: Function) {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
        success: false,
        message: 'Token requerido'});    
    }    

    try {
        const dataToken = jwt.verify(token as string, process.env.JWT_TOKEN_SECRET as string) as TokenPayload;
        // Guardar datos del usuario en el request para usar después
        (req as any).usuario = dataToken;
        
        console.log('✅ Token válido para:', dataToken.email);
        next(); // ✅ Solo llama a next(), NO envíes respuesta aquí       
    } catch (error) {
        res.status(401).json({
        success: false,
        message: 'Token no válido o expirado'});
    };

};