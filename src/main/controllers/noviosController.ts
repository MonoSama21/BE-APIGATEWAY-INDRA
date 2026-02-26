import { Request, Response } from 'express';
import { Novio } from '../models/noviosModel';
import bcrypt from 'bcrypt';
import { generarToken } from '../helpers/auth';
import { AppDataSource } from '../db/conexion';




class NoviosController {

    constructor(){

    }

    async consultar(req: Request, res: Response) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const data = await Novio.find({
            select: ['id', 'nombre', 'email', 'telefono']
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
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const { id } = req.params;
        try {
            const novio = await Novio.findOneBy({ id: Number(id) });
            if (!novio) {
                return res.status(404).json({
                    success: false,
                    message: "Novio no encontrado"
                });
            }
            res.status(200).json({
                success: true,
                data: novio
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
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        try {
            const campos = ['nombre', 'email', 'telefono', 'password'];
            const faltantes = campos.filter(campo => !req.body[campo]);
            //VALIDACION DE CAMPOS FALTANTES
            if (faltantes.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    message: `Campos faltantes: ${faltantes.join(', ')}`
                });
            }

            //VALIDACION DE EMAIL DUPLICADO
            const emailExistente = await Novio.findOneBy({ email: req.body.email });
            if (emailExistente) {
                return res.status(400).json({ 
                    success: false,
                    message: "El email ya está registrado"
                });
            }

            //VERIFICACION SI EL NOMBRE YA EXISTE
            const nombreExistente = await Novio.findOneBy({ nombre: req.body.nombre });
            if (nombreExistente) {
                return res.status(400).json({
                    success: false,
                    message: "El nombre ya está registrado"
                });
            }

            // Encriptar la contraseña antes de guardar
            const saltRounds = 10;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
            
            const registro = Novio.create(req.body);
            await registro.save();
            res.status(201).json({
                success: true,
                message: `Novio ${registro.nombre} con ID ${registro.id} creado exitosamente`,
            });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ 
                    success: false,
                    message: "Error al procesar la solicitud: " + error.message
                });
            }
        }
    }

    async login(req: Request, res: Response){
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        try {
            const { email, password } = req.body;

            const usuarioExiste = await Novio.findOne({ where: { email } });
            if (!usuarioExiste) {
                return res.status(400).json({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }

            const passwordValido = await bcrypt.compare(password, usuarioExiste.password);
            if (!passwordValido) {
                return res.status(400).json({
                    success: false,
                    message: "Contraseña incorrecta"
                });
            }

            const token = generarToken(usuarioExiste.email);
            res.status(200).json({
                success: true,
                message: "Login exitoso",
                token
            });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ 
                    success: false,
                    message: "Error al procesar el login: " + error.message
                });
            }
        }
    }

    async cambiarPassword(req: Request, res: Response) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        try {
            const { passwordActual, passwordNueva } = req.body;
            const email = (req as any).usuario.email; // El middleware debe poner el email en req.usuario

            // Buscar usuario
            const usuario = await Novio.findOne({ where: { email } });
            if (!usuario) {
                return res.status(404).json({ success: false, message: "Usuario no encontrado" });
            }

            // Verificar contraseña actual
            const passwordValido = await bcrypt.compare(passwordActual, usuario.password);
            if (!passwordValido) {
                return res.status(400).json({ success: false, message: "Contraseña actual incorrecta" });
            }

            // Encriptar y guardar nueva contraseña
            usuario.password = await bcrypt.hash(passwordNueva, 10);
            await usuario.save();

            res.json({ success: true, message: "Contraseña actualizada correctamente" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error al cambiar la contraseña" });
        }
    }

}

export default new NoviosController;   