import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import usuariosRoutes from './routes/usuariosRoutes';

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({
    title: "Authentication Service API",
    version: "1.0.0",
    description: "Microservicio de autenticación y generación de tokens JWT",
    endpoints: {
      "POST /usuarios/login": "Login de usuario - genera JWT",
      "POST /usuarios/registrar": "Registro de nuevo usuario",
      "PUT /usuarios/datos": "Actualizar datos del usuario (requiere token)",
      "PUT /usuarios/password": "Cambiar contraseña (requiere token)",
      "GET /usuarios": "Listar usuarios (requiere token - solo admins)"
    }
  });
});

app.use('/usuarios', usuariosRoutes);

export default app;
