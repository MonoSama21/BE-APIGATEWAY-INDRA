import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from "express";

dotenv.config();

export function generarToken(usuario: { id: number; email: string; nombre: string; rol: string }){
    return jwt.sign(
        { 
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            rol: usuario.rol
        }, 
        process.env.JWT_TOKEN_SECRET as string, 
        { expiresIn: '24h' }
    );
}