import app from "./app";
import { AppDataSource } from "./db/conexion";

// Inicializar la base de datos solo una vez
let dataSourceInitialized = false;

async function initializeDataSource() {
    if (!dataSourceInitialized) {
        try {
            await AppDataSource.initialize();
            dataSourceInitialized = true;
            console.log("Base de datos conectada");
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }
}

// Para Vercel: inicializar la base de datos antes de manejar cualquier request
app.use(async (req, res, next) => {
    await initializeDataSource();
    next();
});

// No usar app.listen en Vercel
// export default app para serverless
export default app;

// Si corres localmente, sí puedes usar app.listen
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    initializeDataSource().then(() => {
        app.listen(6505, () => {
            console.log("Server activo en puerto 6505");
        });
    });
}