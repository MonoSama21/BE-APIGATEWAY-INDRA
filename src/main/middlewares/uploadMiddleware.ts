import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'dzhz9nzqu',
  api_key: process.env.CLOUDINARY_KEY || '529215272241327',
  api_secret: process.env.CLOUDINARY_SECRET || 'JOgIBCzeAIPuMC0mAXuPI3Jsr9k',
});

const storage = multer.memoryStorage();
export const uploadFotos = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten archivos JPEG, JPG y PNG'));
  }
}).array('fotos', 2);

export const subirAFotosCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !(req.files instanceof Array)) return next();

    const urls: string[] = [];
    for (const file of req.files as Express.Multer.File[]) {
      const result = await new Promise<{ url: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'citas' }, (error, result) => {
          if (error) return reject(error);
          resolve({ url: result?.secure_url || '' });
        }).end(file.buffer);
      });
      urls.push(result.url);
    }
    (req as any).fotosCloudinary = urls;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error subiendo imágenes a Cloudinary', error });
  }
};



