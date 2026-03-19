-- Script para AGREGAR las 4 columnas de auditoría NUEVAS (separadas entrada/salida)
-- Ejecutar en el SQL Editor de Supabase en ambos schemas (produccion y certificacion)
-- PRIMERO ejecuta drop_old_audit_columns.sql, LUEGO este script

-- ═══════════════════════════════════════════════════════════════════════════════
-- AGREGAR 4 COLUMNAS DE AUDITORÍA NUEVAS EN PRODUCCION
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE produccion.asistencia
ADD COLUMN IF NOT EXISTS "usuarioIdEntrada" integer NULL,
ADD COLUMN IF NOT EXISTS "usuarioNombreEntrada" varchar(255) NULL,
ADD COLUMN IF NOT EXISTS "usuarioIdSalida" integer NULL,
ADD COLUMN IF NOT EXISTS "usuarioNombreSalida" varchar(255) NULL;

-- ═══════════════════════════════════════════════════════════════════════════════
-- AGREGAR 4 COLUMNAS DE AUDITORÍA NUEVAS EN CERTIFICACION
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE certificacion.asistencia
ADD COLUMN IF NOT EXISTS "usuarioIdEntrada" integer NULL,
ADD COLUMN IF NOT EXISTS "usuarioNombreEntrada" varchar(255) NULL,
ADD COLUMN IF NOT EXISTS "usuarioIdSalida" integer NULL,
ADD COLUMN IF NOT EXISTS "usuarioNombreSalida" varchar(255) NULL;
