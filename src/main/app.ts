import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import usuariosRoutes from './routes/usuariosRoutes';
import configuracionRoutes from './routes/configuracionRoutes';
import categoriasRoutes from './routes/categoriasRoutes';
import platosRoutes from './routes/platosRoutes';
import noviosRoutes from './routes/noviosRoutes';

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
      "/recuerdos": "Gestión de recuerdos"
    }
  });
});

app.use('/usuarios', usuariosRoutes);
app.use('/configuracion', configuracionRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/platos', platosRoutes);
app.use('/novios', noviosRoutes);

export default app;
