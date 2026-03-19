-- Script para ELIMINAR las columnas de auditoría ANTIGUAS
-- Ejecutar en el SQL Editor de Supabase en ambos schemas (produccion y certificacion)
-- PRIMERO ejecuta este script, LUEGO ejecuta add_new_audit_columns.sql

-- ═══════════════════════════════════════════════════════════════════════════════
-- ELIMINAR COLUMNAS ANTIGUAS EN PRODUCCION
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE produccion.asistencia
DROP COLUMN IF EXISTS "usuarioId";

ALTER TABLE produccion.asistencia
DROP COLUMN IF EXISTS "usuarioNombre";

-- ═══════════════════════════════════════════════════════════════════════════════
-- ELIMINAR COLUMNAS ANTIGUAS EN CERTIFICACION
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE certificacion.asistencia
DROP COLUMN IF EXISTS "usuarioId";

ALTER TABLE certificacion.asistencia
DROP COLUMN IF EXISTS "usuarioNombre";
