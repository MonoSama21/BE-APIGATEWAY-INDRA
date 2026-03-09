import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'dzhz9nzqu',
  api_key: process.env.CLOUDINARY_KEY || '529215272241327',
  api_secret: process.env.CLOUDINARY_SECRET || 'JOgIBCzeAIPuMC0mAXuPI3Jsr9k',
});

const storage = multer.memoryStorage();


// ✅ Middleware para una sola foto (Personal)
export const uploadFotoPersonal = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten archivos JPEG, JPG y PNG'));
  }
}).single('foto');



// ✅ Middleware para subir una sola foto a Cloudinary (Personal)
export const subirFotoPersonalCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return next();

    const result = await new Promise<{ url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'personal' },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result?.secure_url || '' });
        }
      ).end(req.file!.buffer);
    });

    (req as any).fotoCloudinary = result.url;
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error subiendo la foto a Cloudinary', 
      error 
    });
  }
};
