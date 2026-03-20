import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

let XLSX: any = null;

// Intentar cargar xlsx, pero no fallar si no está disponible
try {
  XLSX = require('xlsx');
} catch (error) {
  console.warn('⚠️  xlsx no está instalado. Import de Excel no disponible.');
}

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

// ✅ Middleware para procesar archivo CSV
export const uploadCSV = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB para CSV
  fileFilter: (req, file, cb) => {
    // Aceptar .csv y text/csv
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos CSV'));
    }
  }
}).single('csv');

// ✅ Middleware para parsear CSV
export const parseCSVMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionó archivo CSV"
      });
    }

    // Convertir buffer a string
    const csvContent = req.file.buffer.toString('utf-8');
    const lines: string[] = csvContent.trim().split(/\r?\n/);
    
    if (lines.length < 2) {
      return res.status(400).json({
        success: false,
        message: "El archivo CSV está vacío o no tiene datos"
      });
    }

    // Obtener headers de la primera línea
    const headers = lines[0]!.split(',').map(h => h.trim());
    
    // Parsear cada línea
    const result: any[] = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i]!.trim();
      if (!line) continue; // Saltar líneas vacías
      
      // Parsear CSV considerando comillas
      const valores = parseCSVLine(line);
      
      if (valores.length !== headers.length) {
        console.warn(`Fila ${i + 1}: número de campos inconsistente`);
        continue;
      }

      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = valores[index]?.trim();
      });
      
      result.push(obj);
    }

    (req as any).csvData = result;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error procesando archivo CSV',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Parsea una línea CSV considerando comillas y comas dentro de campos
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// ✅ Middleware para procesar archivo EXCEL (.xlsx)
export const uploadExcel = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB para Excel
  fileFilter: (req, file, cb) => {
    // Aceptar .xlsx, .xls y mime types de Excel
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.endsWith('.xlsx') ||
      file.originalname.endsWith('.xls')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos EXCEL (.xlsx o .xls)'));
    }
  }
}).any(); // Aceptar cualquier nombre de campo

// ✅ Middleware para parsear EXCEL
export const parseExcelMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!XLSX) {
      return res.status(500).json({
        success: false,
        message: "xlsx no está instalado. Ejecuta: npm install xlsx"
      });
    }

    // Buscar el archivo (puede venir con cualquier nombre de campo)
    const files = (req as any).files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionó archivo EXCEL"
      });
    }

    const excelFile = files[0]!;

    // Leer el archivo Excel con XLSX
    const workbook = XLSX.read(excelFile.buffer, { type: 'buffer' });
    
    // Obtener la primera hoja
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res.status(400).json({
        success: false,
        message: "El archivo EXCEL no contiene ninguna hoja"
      });
    }

    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON (preserva los headers exactos del Excel)
    const data: any[] = XLSX.utils.sheet_to_json(worksheet, {
      defval: '',  // Valores por defecto para celdas vacías
      blankrows: false // Ignorar filas vacías
    });

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El archivo EXCEL está vacío o no contiene datos"
      });
    }

    (req as any).excelData = data;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error procesando archivo EXCEL',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
