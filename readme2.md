//import { createClient } from '@supabase/supabase-js';
import { DataSource } from 'typeorm';
import { Novio } from '../models/noviosModel';
import { Cita } from '../models/citasModel';
import { RegistroCita } from '../models/registrosCitasModel';
import { FotoCita } from '../models/fotosCitaModel';


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.SUPABASE_HOST || '',
    port: Number(process.env.SUPABASE_PORT) || 5432,
    username: 'postgres',
    password: '123zeusyrayo',
    database: process.env.SUPABASE_DB || 'postgres',
    entities: [Novio, Cita, RegistroCita, FotoCita],
    logging: true,
    synchronize: false
});


SUPABASE_URL=https://cqubhoavxbouyvvfrxcx.supabase.co
SUPABASE_KEY=sb_publishable_9d0HNt3NNxSbEVttJLHTng_gHG50HuR

SUPABASE_HOST=db.cqubhoavxbouyvvfrxcx.supabase.co
SUPABASE_PORT=5432


DATABASE_URL=#####
NOVE_ENV_DEVELOPMENT=#####
NOVE_ENV_STAGING=#####
NOVE_ENV_PRODUCTION=#####

JWT_TOKEN_SECRET=tu_clave_secreta