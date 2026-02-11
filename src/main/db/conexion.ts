import { DataSource } from "typeorm";
import { Estudiante } from "../models/estudiantesModel";
import { Profesor } from "../models/profesoresModel";
import { Curso } from "../models/cursoModel";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456",
    database: "sys",
    logging: true,
    entities: [Estudiante, Profesor, Curso],
    synchronize: false, //ESTO SOLO SE DEBE USAR EN DESARROLLO, NUNCA EN PRODUCCION, ES PARA SINCRONIZAR LA GENERACION DE TABLAS
});