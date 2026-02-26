import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import noviosRoutes from './routes/noviosRoutes';
import citasRoutes from './routes/citasRoutes';
import registroCitaRoutes from './routes/registroCitaRoutes';

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
    }
  });
});


app.use('/novios', noviosRoutes);
app.use('/citas', citasRoutes);
app.use('/registros-citas', registroCitaRoutes);

export default app;
