//import { createClient } from '@supabase/supabase-js';
import { DataSource } from 'typeorm';
import { Usuario } from '../models/usuariosModel';
import { Personal } from '../models/personalModel';
import { Cargo } from '../models/cargosModel';
import { Distrito } from '../models/distritosModel';
import { InstitucionEducativa } from '../models/institucionesEducativasModel';
import { Asistencia } from '../models/asistenciaModel';
import { Registro } from '../models/registrosModel';


// Selecciona el schema según el ambiente
const SCHEMA = process.env.SUPABASE_SCHEMA || 'produccion'; // prod o desa

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.SUPABASE_URL || '',
    schema: SCHEMA,
    entities: [Usuario, Personal, Cargo, Distrito, InstitucionEducativa, Asistencia, Registro],
    logging: true,
    synchronize: true
});

