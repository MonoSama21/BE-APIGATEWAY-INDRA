-- ============================================================
-- Migration: Crear tabla 'registros' para SSTMON
-- Descripción: Tabla que almacena los registros de empleados
--              que completaron misiones del juego SSTMON
-- Fecha: 2026-05-05
-- ============================================================

CREATE TABLE IF NOT EXISTS registros (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    dni VARCHAR(15) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    mission_id INTEGER NOT NULL,
    mission_name VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    pokeball VARCHAR(50),
    completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar consultas
CREATE INDEX idx_registros_dni ON registros(dni);
CREATE INDEX idx_registros_mission_id ON registros(mission_id);
CREATE INDEX idx_registros_approved ON registros(approved);
CREATE INDEX idx_registros_completed_at ON registros(completed_at);
CREATE INDEX idx_registros_nombre ON registros(nombre_completo);

-- Comentarios de documentación
COMMENT ON TABLE registros IS 'Registros de empleados que completaron misiones del juego SSTMON';
COMMENT ON COLUMN registros.nombre_completo IS 'Nombre completo del empleado';
COMMENT ON COLUMN registros.dni IS 'DNI del empleado (8 dígitos)';
COMMENT ON COLUMN registros.cargo IS 'Cargo del empleado';
COMMENT ON COLUMN registros.mission_id IS 'ID de la misión completada (1=Altura, 2=Vía Pública, 3=Energías)';
COMMENT ON COLUMN registros.mission_name IS 'Nombre descriptivo de la misión';
COMMENT ON COLUMN registros.score IS 'Número de respuestas correctas';
COMMENT ON COLUMN registros.total IS 'Total de preguntas (normalmente 10)';
COMMENT ON COLUMN registros.percentage IS 'Porcentaje de aciertos (0-100)';
COMMENT ON COLUMN registros.approved IS 'Indica si aprobó (score >= 8)';
COMMENT ON COLUMN registros.pokeball IS 'Color de la pokebola seleccionada (red, blue, yellow)';
COMMENT ON COLUMN registros.completed_at IS 'Fecha y hora de culminación de la misión';
