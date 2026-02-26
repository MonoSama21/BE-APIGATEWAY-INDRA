console.log('SUPABASE_HOST:', process.env.SUPABASE_HOST);
console.log('SUPABASE_PORT:', process.env.SUPABASE_PORT);
console.log('SUPABASE_DB:', process.env.SUPABASE_DB);
console.log('SUPABASE_SCHEMA:', process.env.SUPABASE_SCHEMA);
//import { createClient } from '@supabase/supabase-js';
import { DataSource } from 'typeorm';
import { Novio } from '../models/noviosModel';
import { Cita } from '../models/citasModel';
import { RegistroCita } from '../models/registrosCitasModel';
import { FotoCita } from '../models/fotosCitaModel';


// Selecciona el schema según el ambiente
const SCHEMA = process.env.SUPABASE_SCHEMA || 'produccion'; // prod o desa

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.SUPABASE_HOST || '',
    port: Number(process.env.SUPABASE_PORT) || 5432,
    username: 'postgres',
    password: '123zeusyrayo',
    database: process.env.SUPABASE_DB || 'postgres',
    schema: SCHEMA,
    entities: [Novio, Cita, RegistroCita, FotoCita],
    logging: true,
    synchronize: false
});

