import { AppDataSource } from '../db/conexion';

/**
 * Asegura que el DataSource esté inicializado antes de ejecutar consultas
 * Necesario para ambientes serverless como Vercel
 */
export async function ensureConnection() {
    if (!AppDataSource.isInitialized) {
        try {
            await AppDataSource.initialize();
            console.log('✅ DataSource inicializado');
        } catch (error) {
            console.error('❌ Error al inicializar DataSource:', error);
            throw error;
        }
    }
    return AppDataSource;
}