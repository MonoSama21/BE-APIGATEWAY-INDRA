import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import usuariosRoutes from './routes/usuariosRoutes';
import personalRoutes from './routes/personalRoutes';
import cargosRoutes from './routes/cargosRoutes';
import distritosRoutes from './routes/distritosRoutes';
import institucionesEducativasRoutes from './routes/institucionesEducativasRoutes';
import asistenciaRoutes from './routes/asistenciaRoutes';

const app = express();

app.use(express.json()); // Para parsear JSON en el body
app.use(morgan("dev"));
app.use(cors());


app.get("/", (req: Request, res: Response) => {
  console.log("Hola desde la consola del servidor");
  res.send({
    title: "Bienvenido a la API para citas de 100 en pareja",
    version: "1.0.0",
    endpoints: {
      "/novios": "Gestión de novios",
      "/citas": "Gestión de citas",
      "/registros-citas": "Gestión de registros de citas"
    },
    ambiente: {
      host: process.env.SUPABASE_HOST,
      port: process.env.SUPABASE_PORT,
      database: process.env.SUPABASE_DB,
      schema: process.env.SUPABASE_SCHEMA
    }
  });
});


app.use('/usuarios', usuariosRoutes);
app.use('/personal', personalRoutes);
app.use('/cargos', cargosRoutes);
app.use('/distritos', distritosRoutes);
app.use('/institucioneseducativas', institucionesEducativasRoutes);
app.use('/asistencia', asistenciaRoutes);

export default app;
