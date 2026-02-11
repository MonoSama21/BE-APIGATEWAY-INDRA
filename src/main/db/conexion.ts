import { DataSource } from "typeorm";
import { Estudiante } from "../models/estudiantesModel";
import { Profesor } from "../models/profesoresModel";
import { Curso } from "../models/cursoModel";
import { Plato } from "../models/platosModel";
import { Categoria } from "../models/categoriasModel";
import { Configuracion } from "../models/configuracionModel";
import { Usuario } from "../models/usuariosModel";


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456",
    database: "sys",
    logging: true,
    entities: [Estudiante, Profesor, Curso, Plato, Categoria, Configuracion, Usuario],
    synchronize: false, //ESTO SOLO SE DEBE USAR EN DESARROLLO, NUNCA EN PRODUCCION, ES PARA SINCRONIZAR LA GENERACION DE TABLAS
});