-- ╔════════════════════════════════════════════════════════════════════════════╗
-- ║ Script: agregar distritoId a institucionesEducativas                       ║
-- ║ Propósito: vincular cada institución educativa con un distrito             ║
-- ║ Uso: ejecutar en ambos esquemas (produccion y certificacion)               ║
-- ╚════════════════════════════════════════════════════════════════════════════╝

-- ═══════════════════════════════════════════════════════════════════════════
-- ESQUEMA: produccion
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE produccion."institucionesEducativas"
ADD COLUMN distritoId integer NULL;

-- Crear la FK hacia distritos
ALTER TABLE produccion."institucionesEducativas"
ADD CONSTRAINT fk_institucionesEducativas_distritoId
FOREIGN KEY (distritoId) 
REFERENCES produccion."distritos"(id)
ON DELETE SET NULL;

-- ═══════════════════════════════════════════════════════════════════════════
-- ESQUEMA: certificacion
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE certificacion."institucionesEducativas"
ADD COLUMN distritoId integer NULL;

-- Crear la FK hacia distritos
ALTER TABLE certificacion."institucionesEducativas"
ADD CONSTRAINT fk_institucionesEducativas_distritoId
FOREIGN KEY (distritoId) 
REFERENCES certificacion."distritos"(id)
ON DELETE SET NULL;
