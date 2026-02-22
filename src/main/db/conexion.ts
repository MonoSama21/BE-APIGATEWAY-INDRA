//import { createClient } from '@supabase/supabase-js';
import { DataSource } from 'typeorm';
import { Novio } from '../models/noviosModel';


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.SUPABASE_HOST || '',
    port: Number(process.env.SUPABASE_PORT) || 5432,
    username: 'postgres',
    password: '123zeusyrayo',
    database: process.env.SUPABASE_DB || 'postgres',
    entities: [Novio],
    logging: true,
    synchronize: false
});
