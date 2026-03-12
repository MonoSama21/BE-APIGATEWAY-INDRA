import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";


export function autorizarPorRol(rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario; // El middleware verificarToken debe poner esto
    if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ success: false, message: "No tienes permiso para acceder a este recurso" });
    }
    next();
  };
}