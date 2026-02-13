import { Request, Response } from "express";
import { Usuario } from "../models/usuariosModel";
import bcrypt from 'bcrypt';
import { generarToken } from "../helpers/auth";


class UsuariosController {

    constructor(){

    }

    async consultar(req: Request, res: Response) {
        const data = await Usuario.find({
            select: ['id', 'nombre', 'email', 'rol', 'activo']
        });

        try {
            const usuarios = data;
            res.status(200).json({
                success: true,
                usuarios
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
        const { id } = req.params;
        try {
            const usuario = await Usuario.findOneBy({ id: Number(id) });
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            res.status(200).json({
                success: true,
                data: usuario
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

    async ingresar(req: Request, res: Response){
        try {
            const campos = ['nombre', 'email', 'password', 'rol', 'activo'];
            const faltantes = campos.filter(campo => !req.body[campo]);

            if (faltantes.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Faltan campos obligatorios: ${faltantes.join(', ')}`
                });
            }

            // Verificar si el email ya existe
            const emailExiste = await Usuario.findOne({ where: { email: req.body.email } });
            if (emailExiste) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }

            // Verificar si el nombre ya existe
            const nombreExiste = await Usuario.findOne({ where: { nombre: req.body.nombre } });
            if (nombreExiste) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de usuario ya está en uso'
                });
            }

            // Encriptar la contraseña antes de guardar
            const saltRounds = 10;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);

            const registro = Usuario.create(req.body);
            await registro.save();
            res.status(201).json({
                success: true,
                message: `Usuario ${registro.nombre} con ID ${registro.id} creado exitosamente`,
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

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const usuarioExiste = await Usuario.findOne({ where: { email } });
            if (!usuarioExiste) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            const passwordValido = await bcrypt.compare(password, usuarioExiste.password);
            if (!passwordValido) {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña incorrecta'
                });
            }

            const token = generarToken(usuarioExiste.email);
            res.status(200).json({
                success: true,
                message: 'Login exitoso',
                token
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

    //DE MOMENTO NO SE PUEDE ACTUALIZAR, FALTA IMPLEMENTAR
    async actualizar(req: Request, res: Response){
    }

    async borrar(req: Request, res: Response){
        const { id } = req.params;
        try {
            const usuario = await Usuario.findOneBy({ id: Number(id) });
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            await usuario.remove();
            res.status(200).json({
                success: true,
                message: `Usuario con ID ${id} eliminado exitosamente`
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

export default new UsuariosController();