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













import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'dzhz9nzqu',
  api_key: process.env.CLOUDINARY_KEY || '529215272241327',
  api_secret: process.env.CLOUDINARY_SECRET || 'JOgIBCzeAIPuMC0mAXuPI3Jsr9k',
});


const image = "src/main/img/foto.jpg";

cloudinary.uploader.upload(image).then(result => {
  console.log('URL de la imagen subida:', result.secure_url);
}).catch(error => {
  console.error('Error al subir la imagen:', error);
});
