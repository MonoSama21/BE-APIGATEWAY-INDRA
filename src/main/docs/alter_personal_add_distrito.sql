-- Script para agregar campos a la tabla PERSONAL
-- Especialmente el campo distritoId para la relación con distritos
-- Ejecutar en el SQL Editor de Supabase en ambos schemas (produccion y certificacion)

-- Para SCHEMA PRODUCCION
ALTER TABLE produccion.personal 
ADD COLUMN IF NOT EXISTS "distritoId" integer;

-- Agregar constraint de foreign key (opcional, pero recomendado)
ALTER TABLE produccion.personal
ADD CONSTRAINT fk_personal_distritoId 
FOREIGN KEY ("distritoId") 
REFERENCES produccion.distritos(id) 
ON DELETE SET NULL;

-- Para SCHEMA CERTIFICACION
ALTER TABLE certificacion.personal 
ADD COLUMN IF NOT EXISTS "distritoId" integer;

-- Agregar constraint de foreign key (opcional, pero recomendado)
ALTER TABLE certificacion.personal
ADD CONSTRAINT fk_personal_distritoId 
FOREIGN KEY ("distritoId") 
REFERENCES certificacion.distritos(id) 
ON DELETE SET NULL;

-- Nota: Los registros históricos tendrán distritoId = NULL
-- Si necesitas migrar datos de distritos existentes, puedes usar:
-- UPDATE produccion.personal SET "distritoId" = 1 WHERE "distritoId" IS NULL;
