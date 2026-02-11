import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import estudiantesRoutes from './routes/estudiantesRoutes';
import profesoresRoutes from './routes/profesoresRoutes';   
import cursosRoutes from './routes/cursosRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import configuracionRoutes from './routes/configuracionRoutes';
import categoriasRoutes from './routes/categoriasRoutes';
import platosRoutes from './routes/platosRoutes';

const app = express();

app.use(express.json()); // Para parsear JSON en el body
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  console.log("hola mundo");
  res.send("Hola mundo");
});

app.use('/estudiantes', estudiantesRoutes);
app.use('/profesores', profesoresRoutes);
app.use('/cursos', cursosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/configuracion', configuracionRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/platos', platosRoutes);

export default app;
