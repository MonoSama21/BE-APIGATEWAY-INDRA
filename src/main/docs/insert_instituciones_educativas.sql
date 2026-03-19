-- Script para LLENAR la tabla INSTITUCIONES EDUCATIVAS
-- Ejecutar en el SQL Editor de Supabase en ambos schemas (produccion y certificacion)
-- Cambiar "certificacion" por "produccion" según corresponda

-- ═══════════════════════════════════════════════════════════════════════════════
-- INSERTAR INSTITUCIONES EDUCATIVAS CON DISTRITOS Y NIVEL MODALIDAD
-- Mapeo de Nivel/Modalidad:
--   Inicial - Jardín, Inicial - Cuna Jardín → INICIAL-JARDIN
--   Primaria → PRIMARIA
--   Secundaria → SECUNDARIA
--   Técnico Productivo, Básica Alternativa, Básica Especial → EBA-CEPTPRO
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO "certificacion"."institucioneseducativas" (
  "codigoModular", "nombreIE", "nivelModalidad", "distritoId", "estado"
) 
VALUES 
  -- DISTRITO 1: Grocio Prado
  ('0714055', '252', 'INICIAL-JARDIN', 1, true),
  ('0714063', 'CANTAGALLO', 'INICIAL-JARDIN', 1, true),
  ('0714089', 'J.I. 1136 "ISABEL LA CATÓLICA"', 'INICIAL-JARDIN', 1, true),
  ('0714097', 'J.I. 1045', 'INICIAL-JARDIN', 1, true),
  ('0714105', 'J.I. 1156 VIRGEN MARÍA', 'INICIAL-JARDIN', 1, true),
  ('0714113', 'J.I. 1046', 'INICIAL-JARDIN', 1, true),
  ('0714121', 'HUMBERTO LUNA', 'PRIMARIA', 1, true),
  ('0714138', 'VICTOR LARCO HERRERA', 'PRIMARIA', 1, true),
  ('0714146', 'MELINA PAREDES', 'PRIMARIA', 1, true),
  ('0714153', 'ALMIRANTE COCHRANE', 'PRIMARIA', 1, true),
  ('0714161', 'REPÚBLICA DE BOLIVIA', 'PRIMARIA', 1, true),
  ('0714179', 'JOSÉ DE LARIVAÑO', 'PRIMARIA', 1, true),
  ('0714187', 'REPÚBLICA DE ITALIA', 'PRIMARIA', 1, true),
  ('0714195', 'REPÚBLICA DE JAPÓN', 'PRIMARIA', 1, true),
  ('0714203', 'INSTITUTO TECNOLÓGICO LA RECOLETA', 'PRIMARIA', 1, true),
  ('0714211', 'REPÚBLICA DE PERÚ', 'PRIMARIA', 1, true),
  ('0714229', 'REPÚBLICA DEL ECUADOR', 'PRIMARIA', 1, true),
  ('0714237', 'REPÚBLICA DE COSTA RICA', 'PRIMARIA', 1, true),
  ('0714245', 'REPÚBLICA DE CHILE', 'PRIMARIA', 1, true),
  ('0714252', 'REPÚBLICA DE ARGENTINA', 'PRIMARIA', 1, true),
  ('0714260', 'REPÚBLICA DE COLOMBIA', 'PRIMARIA', 1, true),
  ('0714278', 'REPÚBLICA DE VENEZUELA', 'PRIMARIA', 1, true),
  ('0714286', 'SAN JOSÉ', 'PRIMARIA', 1, true),
  ('0714294', 'REPÚBLICA DE PANAMA', 'PRIMARIA', 1, true),
  ('0714302', 'REPÚBLICA DE CUBA', 'PRIMARIA', 1, true),
  ('0714310', 'REPÚBLICA DE MÉXICO', 'PRIMARIA', 1, true),
  ('0714328', 'REPÚBLICA DE ESPAÑA', 'PRIMARIA', 1, true),
  ('0714336', 'REPÚBLICA DE HONDURAS', 'PRIMARIA', 1, true),
  ('0714344', 'REPÚBLICA DE PARAGUAY', 'PRIMARIA', 1, true),
  ('0714351', 'REPÚBLICA DE URUGUAY', 'PRIMARIA', 1, true),
  ('0714369', 'REPÚBLICA DE EL SALVADOR', 'PRIMARIA', 1, true),
  ('0714377', 'REPÚBLICA DE NICARAGUA', 'PRIMARIA', 1, true),
  ('0714385', 'REPÚBLICA DE GUATEMALA', 'PRIMARIA', 1, true),
  ('0714393', 'REPÚBLICA DE BELICE', 'PRIMARIA', 1, true),
  ('0714401', 'REPÚBLICA DOMINICANA', 'PRIMARIA', 1, true),
  ('0714419', 'REPÚBLICA DE HAITÍ', 'PRIMARIA', 1, true),
  ('0714427', 'REPÚBLICA DE TRINIDAD Y TOBAGO', 'PRIMARIA', 1, true),
  ('0700062', 'SAN VICENTE PAUL', 'SECUNDARIA', 1, true),
  ('0700070', 'INCA PACHACÚTEC', 'SECUNDARIA', 1, true),

  -- DISTRITO 2: Pueblo Nuevo
  ('0679720', 'ALEJANDRO HERNANDEZ BONILLA', 'EBA-CEPTPRO', 2, true),
  ('0679738', '120 PROYECTO ESPECIAL CHAVIMOCHIC', 'PRIMARIA', 2, true),
  ('0679746', 'SANTA MARÍA A.C. TRUJILLO', 'PRIMARIA', 2, true),
  ('0679753', 'SANTA ROSA DE ENRÍQUEZ', 'PRIMARIA', 2, true),
  ('0679761', 'SAN ANDRÉS', 'PRIMARIA', 2, true),
  ('0679779', 'REPÚBLICA DE BRASIL', 'SECUNDARIA', 2, true),

  -- DISTRITO 3: Alto Laran
  ('0713876', 'JOSÉ MARÍA ARGUEDAS', 'INICIAL-JARDIN', 3, true),
  ('0713884', 'DOS DE MAYO', 'PRIMARIA', 3, true),
  ('0713892', 'ALTO LARAN', 'PRIMARIA', 3, true),
  ('0713900', 'ESPERANZA', 'SECUNDARIA', 3, true),

  -- DISTRITO 4: Sunampe
  ('0713421', 'CAPILLA VIRGEN DEL ROSARIO', 'INICIAL-JARDIN', 4, true),
  ('0713439', 'JOSÉ DOMINGO ATIENZA', 'PRIMARIA', 4, true),
  ('0713447', 'SUNAMPE', 'SECUNDARIA', 4, true),

  -- DISTRITO 5: Chincha Alta
  ('0678757', 'LA HUACA NEGRA JI-010', 'INICIAL-JARDIN', 5, true),
  ('0678765', 'SANTA ANA', 'INICIAL-JARDIN', 5, true),
  ('0678773', 'INMACULADA CONCEPCIÓN', 'INICIAL-JARDIN', 5, true),
  ('0678781', 'Nº 1008 MARÍA INMACULADA CONCEPCIÓN', 'PRIMARIA', 5, true),
  ('0678799', 'HUACA NEGRA', 'PRIMARIA', 5, true),
  ('0678807', 'REPÚBLICA DE BRASIL', 'PRIMARIA', 5, true),
  ('0678815', 'MARÍA INMACULADA CONCEPCIÓN', 'PRIMARIA', 5, true),
  ('0678823', 'JOSÉ SANTOS ALFARO', 'PRIMARIA', 5, true),
  ('0678831', 'MÉXICO', 'PRIMARIA', 5, true),
  ('0678849', '003 CHINCHA ALTA', 'PRIMARIA', 5, true),
  ('0678856', 'COMERCIAL MIXTO 'JOSÉ MARÍA ARGUMENTS VALDELOMAR'', 'PRIMARIA', 5, true),
  ('0678864', 'ROSA MERCEDES INDICADOR', 'PRIMARIA', 5, true),
  ('0678872', 'SANTO DOMINGO', 'PRIMARIA', 5, true),
  ('0678880', 'REPÚBLICA DE PERÚ', 'PRIMARIA', 5, true),
  ('0678898', 'REPÚBLICA DE ESPAÑA', 'PRIMARIA', 5, true),
  ('0678906', 'SAN FRANCISCO', 'PRIMARIA', 5, true),
  ('0678914', 'REPÚBLICA DE ITALIA', 'PRIMARIA', 5, true),
  ('0678922', 'REPÚBLICA DE ARGENTINA', 'PRIMARIA', 5, true),
  ('0678930', 'LA INMACULADA', 'SECUNDARIA', 5, true),
  ('0678948', 'INDEPENDENCIA', 'SECUNDARIA', 5, true),
  ('0678955', 'SANTA ROSA', 'SECUNDARIA', 5, true),
  ('0679002', 'COMERCIAL "SANTA ROSA"', 'EBA-CEPTPRO', 5, true),

  -- DISTRITO 6: El Carmen
  ('0678609', 'LA PRIMAVERA DEL CARMEN', 'PRIMARIA', 6, true),
  ('0678617', 'REPÚBLICA DE PANAMÁ', 'PRIMARIA', 6, true),
  ('0678625', 'REPÚBLICA DE VENEZUELA', 'PRIMARIA', 6, true),
  ('0678633', 'REPÚBLICA DE URUGUAY', 'PRIMARIA', 6, true),
  ('0678641', 'REPÚBLICA DE HAITÍ', 'SECUNDARIA', 6, true),

  -- DISTRITO 7: San Juan de Yanac
  ('0678229', 'JOSÉ ANTONIO ENCINAS', 'PRIMARIA', 7, true),
  ('0678237', 'CRUZ DE MAYO', 'PRIMARIA', 7, true),
  ('0678245', 'SAN JUAN DE YANAC', 'SECUNDARIA', 7, true),

  -- DISTRITO 8: San Pedro de Huacarpana
  ('0678021', 'HUACARPANA', 'PRIMARIA', 8, true),
  ('0678039', 'SAN PEDRO DE HUACARPANA', 'SECUNDARIA', 8, true),

  -- DISTRITO 9: Chavín
  ('0677779', 'JOSÉ MARÍA CORDOVA', 'PRIMARIA', 9, true),
  ('0677787', 'CHAVIN', 'SECUNDARIA', 9, true),

  -- DISTRITO 10: Chincha Baja
  ('0677399', 'JOSÉ MARÍA MORENO', 'INICIAL-JARDIN', 10, true),
  ('0677407', 'REPÚBLICA DE ITALIA', 'PRIMARIA', 10, true),
  ('0677415', 'REPÚBLICA DE BRASIL', 'PRIMARIA', 10, true),
  ('0677423', 'REPÚBLICA DE ARGENTINA', 'PRIMARIA', 10, true),
  ('0677431', 'REPÚBLICA DEL ECUADOR', 'PRIMARIA', 10, true),
  ('0677449', 'REPÚBLICA DE PERÚ', 'SECUNDARIA', 10, true),
  ('0677456', 'TECNOLÓGICO "CHINCHA BAJA"', 'EBA-CEPTPRO', 10, true),

  -- DISTRITO 11: Tambo de Mora
  ('0677076', 'SANTO DOMINGO DE GUZMÁN', 'INICIAL-JARDIN', 11, true),
  ('0677084', 'SANTO DOMINGO DE GUZMÁN', 'PRIMARIA', 11, true),
  ('0677092', 'TAMBO DE MORA', 'SECUNDARIA', 11, true);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Verificación: contar registros insertados
-- ═══════════════════════════════════════════════════════════════════════════════
-- SELECT COUNT(*) as total_instituciones, "distritoId", "nivelModalidad" 
-- FROM "certificacion"."institucioneseducativas"
-- GROUP BY "distritoId", "nivelModalidad"
-- ORDER BY "distritoId", "nivelModalidad";
