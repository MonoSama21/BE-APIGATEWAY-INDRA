//import { createClient } from '@supabase/supabase-js';
import { DataSource } from 'typeorm';
import { Usuario } from '../models/usuariosModel';
import { Personal } from '../models/personalModel';
import { Cargo } from '../models/cargosModel';
import { Asistencia } from '../models/asistenciaModel';


// Selecciona el schema según el ambiente
const SCHEMA = process.env.SUPABASE_SCHEMA || 'produccion'; // prod o desa

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.SUPABASE_URL || '',
    schema: SCHEMA,
    entities: [Usuario, Personal, Cargo, Asistencia],
    logging: true,
    synchronize: false
});

