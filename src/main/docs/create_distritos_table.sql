-- Script para crear la tabla de DISTRITOS
-- Ejecutar en el SQL Editor de Supabase en ambos schemas (produccion y certificacion)

CREATE TABLE IF NOT EXISTS produccion.distritos (
    id SERIAL PRIMARY KEY,
    distrito VARCHAR(255) UNIQUE NOT NULL,
    alias VARCHAR(500),
    estado BOOLEAN DEFAULT TRUE,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificacion.distritos (
    id SERIAL PRIMARY KEY,
    distrito VARCHAR(255) UNIQUE NOT NULL,
    alias VARCHAR(500),
    estado BOOLEAN DEFAULT TRUE,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Si ya tienes datos de distritos migrados, ejecuta:
-- ALTER SEQUENCE produccion.distritos_id_seq RESTART WITH <valor_max_id + 1>;
-- ALTER SEQUENCE certificacion.distritos_id_seq RESTART WITH <valor_max_id + 1>;
