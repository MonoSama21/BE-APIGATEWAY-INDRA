import { DataSource } from "typeorm";
import { Plato } from "../models/platosModel";
import { Categoria } from "../models/categoriasModel";
import { Configuracion } from "../models/configuracionModel";
import { Usuario } from "../models/usuariosModel";
import * as dotenv from 'dotenv';

// Detectar ambiente y cargar el .env correspondiente
const nodeEnv = process.env.NODE_ENV || 'development';

let envPath = '.env.development';
if (nodeEnv === 'production') {
    envPath = '.env.production';
} else if (nodeEnv === 'staging') {
    envPath = '.env.staging';
}

dotenv.config({ path: envPath });
console.log(`Cargando variables de entorno desde: ${envPath}`);

// Configuración de conexión a Supabase/PostgreSQL
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL no está definida. Verifica tu archivo .env correspondiente al ambiente.');
}

export const AppDataSource = new DataSource({
    type: "postgres",
    url: databaseUrl,
    schema: process.env.DATABASE_SCHEMA || "desarrollo",
    logging: nodeEnv !== 'production',
    entities: [Plato, Categoria, Configuracion, Usuario],
    synchronize: false,
    ssl: databaseUrl.includes('supabase.co')
        ? { rejectUnauthorized: false }
        : false,
});
