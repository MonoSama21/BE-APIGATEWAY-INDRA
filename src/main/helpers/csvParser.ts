import fs from 'fs';

/**
 * Parsea un archivo CSV y retorna un array de objetos
 * @param filePath Ruta del archivo CSV
 * @returns Array de objetos con los datos del CSV
 */
export function parseCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            const lines: string[] = data.trim().split(/\r?\n/);
            
            if (lines.length < 2) {
                reject(new Error("El archivo CSV está vacío o no tiene datos"));
                return;
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

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

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
