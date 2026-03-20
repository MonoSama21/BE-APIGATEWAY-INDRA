-- SCRIPT PARA ENCONTRAR EL NOMBRE CORRECTO DE LA SECUENCIA
-- Ejecuta esto primero en Supabase SQL Editor

-- En el schema PRODUCCION
SELECT * FROM pg_sequences 
WHERE tablename = 'institucioneseducativas' OR schemaname = 'produccion';

-- Esto mostrará todas las secuencias disponibles
-- Busca la que corresponda a institucioneseducativas y copia su nombre exacto
