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
    url: process.env.SUPABASE_URL || '',
    schema: SCHEMA,
    entities: [Novio, Cita, RegistroCita, FotoCita],
    logging: true,
    synchronize: false
});

