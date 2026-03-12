import app from "./app";
import { AppDataSource } from './db/conexion';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
dotenv.config();

const PORT = process.env.PORT || 6500;

// Middlewares
app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(bodyParser.json()); // Parsear JSON en el body
app.use(bodyParser.urlencoded({ extended: true })); // Parsear datos de formularios




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