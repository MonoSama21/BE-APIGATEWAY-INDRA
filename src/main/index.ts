import app from "./app";
import { AppDataSource } from './db/conexion';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
dotenv.config();

const PORT = process.env.PORT || 6500;

// Middlewares
app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(bodyParser.json()); // Parsear JSON en el body
app.use(bodyParser.urlencoded({ extended: true })); // Parsear datos de formularios


// ✅ Middleware para asegurar conexión en cada request (para Vercel)
app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!AppDataSource.isInitialized) {
        try {
            await AppDataSource.initialize();
            console.log('✅ DataSource inicializado para request');
        } catch (error) {
            console.error('❌ Error conexión DB:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error de conexión a la base de datos' 
            });
        }
    }
    next();
});


// Inicializar TypeORM y arrancar el servidor solo si la conexión es exitosa
AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar con la base de datos:', error);
    });

export default app;