-- DIAGNOSTICO COMPLETO DE TABLAS Y SECUENCIAS
-- Ejecuta esto en Supabase en el schema PRODUCCION

-- 1. Ver todas las tablas del schema produccion
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'produccion' 
ORDER BY table_name;

-- 2. Ver todas las secuencias del schema produccion
SELECT sequencename FROM pg_sequences 
WHERE schemaname = 'produccion';

-- 3. Ver columnas de institucioneseducativas (si existe)
SELECT column_name, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'produccion' AND table_name = 'institucioneseducativas';

-- 4. Ver las constraint de la tabla
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_schema = 'produccion' AND table_name = 'institucioneseducativas';
