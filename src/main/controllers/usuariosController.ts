import { Request, Response } from "express";
import { Usuario } from "../models/usuariosModel";
import { AppDataSource } from "../db/conexion";
import bcrypt from 'bcrypt';
import { generarToken } from '../helpers/auth';
import { ensureConnection } from '../helpers/dbHelper';

class UsuariosController {
    
    constructor() {
        
    }

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
            const [usuarios, total] = await Usuario.findAndCount({
                select: ['id', 'nombre', 'email', 'telefono', 'rol', 'estado'],
                where,
                order: {
                    id: 'DESC'
                },
                skip: skip,
                take: limiteNum
            });
            
            res.status(200).json({
                success: true,
                usuarios,
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

    async registrar(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de registrar
        await ensureConnection();

        try {
            const campos = ['nombre', 'email', 'telefono', 'password', 'rol'];
            const faltantes = campos.filter(campo => !req.body[campo]);
            //VALIDACION DE CAMPOS FALTANTES
            if (faltantes.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    message: `Faltan campos obligatorios: ${faltantes.join(', ')}`
                });
            }

            //VALIDACION DE EMAIL UNICO
            const emailExistente = await Usuario.findOneBy({ email: req.body.email });
            if (emailExistente) {
                return res.status(400).json({ 
                    success: false,
                    message: "El email ya está registrado"
                });
            }

            //VALIDACION SI EL NOMBRE YA EXISTE
            const nombreExistente = await Usuario.findOneBy({ nombre: req.body.nombre });
            if (nombreExistente) {
                return res.status(400).json({
                    success: false,
                    message: "El nombre ya está registrado"
                });
            }


            //ENCRIPTAR CONTRASEÑA ANTES DE GUARDAR
            const saltRounds = 10;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);

            const registro = Usuario.create(req.body);
            await registro.save();
            res.status(201).json({
                success: true,
                id: registro.id,
                message: `Usuario ${registro.nombre} con ID ${registro.id} creado exitosamente`,
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: "Error al crear el usuario: " + error.message
                });
            }
        }

    }// En usuariosController.ts del Auth Service
async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    // Busca el usuario en BD
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
        return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }
    
    // Genera token CON id, nombre y rol
    const token = generarToken({
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
    });
    
    return res.json({
        success: true,
        message: "Login exitoso",
        token,
        usuariologeado: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        }
    });
}

    async cambiarDatos(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de actualizar
        await ensureConnection();

        try {
            const { nombre, telefono, email } = req.body;
            const emailUsuario = (req as any).usuario.email; // El middleware debe poner el email en req.usuario
            
            //BUSCAR USUARIO
            
            const usuarioInformacion = await Usuario.find({ select: ["id", "nombre", "email", "telefono"]});
            const usuario = await Usuario.findOne({ where: { email: emailUsuario } });
            if (!usuario) {
                return res.status(404).json({ success: false, message: "Usuario no encontrado" });
            }

            //VALIDAR SI EL NUEVO EMAIL YA EXISTE EN OTRO USUARIO
            if (email && email !== emailUsuario) {
                const emailExistente = await Usuario.findOne({ where: { email } });
                if (emailExistente) {
                    return res.status(400).json({ success: false, message: "El nuevo email ya está registrado por otro usuario" });
                }
            }

            //VALIDAR SI EL NUEVO NOMBRE YA EXISTE EN OTRO USUARIO
            if (nombre && nombre !== usuario.nombre) {
                const nombreExistente = await Usuario.findOne({ where: { nombre } });
                if (nombreExistente) {
                    return res.status(400).json({ success: false, message: "El nuevo nombre ya está registrado por otro usuario" });
                }
            }

            //VALIDAR SI EL NUEVO TELEFONO YA EXISTE EN OTRO USUARIO
            if (telefono && telefono !== usuario.telefono) {
                const telefonoExistente = await Usuario.findOne({ where: { telefono } });
                if (telefonoExistente) {
                    return res.status(400).json({ success: false, message: "El nuevo teléfono ya está registrado por otro usuario" });
                }
            }
            
            //ACTUALIZAR DATOS
            usuario.nombre = nombre || usuario.nombre;
            usuario.telefono = telefono || usuario.telefono;
            usuario.email = email || usuario.email;
            await usuario.save();

            res.status(200).json({ 
                success: true,
                message: "Datos actualizados correctamente", 
                data: usuarioInformacion
            });
        
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({     
                    success: false,
                    message: "Error al actualizar los datos" + error.message 
                });
            }
        }

    }

    async cambiarPassword(req: Request, res: Response) {
        // ✅ Asegurar conexión antes de consultar
        await ensureConnection();
        try {
            const { passwordActual, passwordNueva } = req.body;
            const email = (req as any).usuario.email; // El middleware debe poner el email en req.usuario

            // Buscar usuario
            const usuario = await Usuario.findOne({ where: { email } });
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

export default new UsuariosController();