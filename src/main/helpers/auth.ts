import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from "express";

dotenv.config();

export function generarToken(email: string){
    return jwt.sign({ email }, process.env.JWT_TOKEN_SECRET as string, { expiresIn: '24h' });
}
