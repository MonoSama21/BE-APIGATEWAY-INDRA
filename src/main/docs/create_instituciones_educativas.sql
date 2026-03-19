-- Script para crear tabla INSTITUCIONES EDUCATIVAS y alterar PERSONAL
-- Ejecutar en el SQL Editor de Supabase en ambos schemas (produccion y certificacion)

-- ═══════════════════════════════════════════════════════════════════════════════
-- CREAR TABLA INSTITUCIONES EDUCATIVAS EN PRODUCCION
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS produccion."institucionesEducativas" (
    id SERIAL PRIMARY KEY,
    "codigoModular" VARCHAR(20) UNIQUE NOT NULL,
    "nombreIE" VARCHAR(255) NOT NULL,
    "nivelModalidad" VARCHAR(50) NOT NULL DEFAULT 'PRIMARIA' CHECK ("nivelModalidad" IN ('INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO')),
    estado BOOLEAN DEFAULT TRUE,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- CREAR TABLA INSTITUCIONES EDUCATIVAS EN CERTIFICACION
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS certificacion."institucionesEducativas" (
    id SERIAL PRIMARY KEY,
    "codigoModular" VARCHAR(20) UNIQUE NOT NULL,
    "nombreIE" VARCHAR(255) NOT NULL,
    "nivelModalidad" VARCHAR(50) NOT NULL DEFAULT 'PRIMARIA' CHECK ("nivelModalidad" IN ('INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO')),
    estado BOOLEAN DEFAULT TRUE,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ALTERAR TABLA PERSONAL EN PRODUCCION
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE produccion.personal 
ADD COLUMN IF NOT EXISTS "nivelModalidad" VARCHAR(50) 
CHECK ("nivelModalidad" IN ('INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO') OR "nivelModalidad" IS NULL);

ALTER TABLE produccion.personal 
ADD COLUMN IF NOT EXISTS "institucionEducativaId" integer;

-- Agregar constraint de foreign key (opcional, pero recomendado)
ALTER TABLE produccion.personal
ADD CONSTRAINT fk_personal_institucionEducativaId 
FOREIGN KEY ("institucionEducativaId") 
REFERENCES produccion."institucionesEducativas"(id) 
ON DELETE SET NULL;

-- ═══════════════════════════════════════════════════════════════════════════════
-- ALTERAR TABLA PERSONAL EN CERTIFICACION
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE certificacion.personal 
ADD COLUMN IF NOT EXISTS "nivelModalidad" VARCHAR(50) 
CHECK ("nivelModalidad" IN ('INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO') OR "nivelModalidad" IS NULL);

ALTER TABLE certificacion.personal 
ADD COLUMN IF NOT EXISTS "institucionEducativaId" integer;

-- Agregar constraint de foreign key (opcional, pero recomendado)
ALTER TABLE certificacion.personal
ADD CONSTRAINT fk_personal_institucionEducativaId 
FOREIGN KEY ("institucionEducativaId") 
REFERENCES certificacion."institucionesEducativas"(id) 
ON DELETE SET NULL;

-- ═══════════════════════════════════════════════════════════════════════════════
-- NOTAS:
-- - Los campos nivelModalidad e institucionEducativaId son OPCIONALES en personal
-- - Si migraste datos históricos, estos campos quedarán NULL
-- - El nivel/modalidad debe ser uno de los 4 valores especificados
-- ═══════════════════════════════════════════════════════════════════════════════
