# API SSTMON - Guía Completa

## Overview
API REST para el juego SSTMON (¡Atrapa el Riesgo!) que gestiona registros de empleados que completan misiones de capacitación en seguridad industrial.

---

## Tabla de Contenidos
1. [Autenticación](#autenticación)
2. [Endpoints de Registros](#endpoints-de-registros)
3. [Ejemplos de Uso](#ejemplos-de-uso)
4. [Setup Base de Datos](#setup-base-de-datos)

---

## Autenticación

Los endpoints protegidos requieren un token JWT en el header `Authorization`:

```bash
Authorization: Bearer <token_jwt>
```

### Obtener Token (Login)

**Endpoint:** `POST /usuarios/login`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "tu_contraseña"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuariologeado": {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@example.com",
    "rol": "admin"
  }
}
```

---

## Endpoints de Registros

### 1. Crear Registro (Público)

**Endpoint:** `POST /registros`

**Descripción:** El frontend llama este endpoint cuando un empleado completa una misión

**Request:**
```bash
curl -X POST http://localhost:6500/registros \
  -H "Content-Type: application/json" \
  -d '{
    "nombreCompleto": "Carlos Pérez",
    "dni": "12345678",
    "cargo": "Supervisor",
    "missionId": 1,
    "missionName": "TRABAJO EN ALTURA",
    "score": 9,
    "total": 10,
    "percentage": 90,
    "approved": true,
    "pokeball": "red"
  }'
```

**Response:**
```json
{
  "success": true,
  "registro": {
    "id": 1,
    "nombreCompleto": "Carlos Pérez",
    "dni": "12345678",
    "cargo": "Supervisor",
    "missionId": 1,
    "missionName": "TRABAJO EN ALTURA",
    "score": 9,
    "total": 10,
    "percentage": 90,
    "approved": true,
    "pokeball": "red",
    "completedAt": "2026-05-05T14:30:00Z"
  }
}
```

---

### 2. Listar Registros (Solo Admin)

**Endpoint:** `GET /registros`

**Descripción:** Lista todos los registros con paginación y filtros

**Parámetros Query:**
- `pagina` (integer, default: 1) - Número de página
- `limite` (integer, default: 20) - Resultados por página
- `approved` (boolean, optional) - Filtrar por estado aprobado

**Request:**
```bash
# Lista todos los registros - página 1, 20 por página
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:6500/registros

# Filtrar solo aprobados
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:6500/registros?approved=true

# Paginación personalizada
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:6500/registros?pagina=2&limite=10
```

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "nombreCompleto": "Carlos Pérez",
      "dni": "12345678",
      "cargo": "Supervisor",
      "missionId": 1,
      "missionName": "TRABAJO EN ALTURA",
      "score": 9,
      "total": 10,
      "percentage": 90,
      "approved": true,
      "pokeball": "red",
      "completedAt": "2026-05-05T14:30:00Z"
    }
  ],
  "total": 45,
  "pagina": 1,
  "limite": 20
}
```

---

### 3. Detalle de Registro (Solo Admin)

**Endpoint:** `GET /registros/{id}`

**Descripción:** Obtiene los detalles de un registro específico

**Request:**
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:6500/registros/1
```

**Response:**
```json
{
  "success": true,
  "registro": {
    "id": 1,
    "nombreCompleto": "Carlos Pérez",
    "dni": "12345678",
    "cargo": "Supervisor",
    "missionId": 1,
    "missionName": "TRABAJO EN ALTURA",
    "score": 9,
    "total": 10,
    "percentage": 90,
    "approved": true,
    "pokeball": "red",
    "completedAt": "2026-05-05T14:30:00Z"
  }
}
```

---

## Ejemplos de Uso

### Frontend - Crear registro después de completar misión

```typescript
// En MissionResults.tsx después de que se completa la misión
const handleRegistrarResultado = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userSST'));
    
    const response = await fetch('http://localhost:6500/registros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreCompleto: userData.nombreCompleto,
        dni: userData.dni,
        cargo: userData.cargo,
        missionId: missionNum,
        missionName: MISSION_NAMES[missionNum],
        score: scoreNum,
        total: totalNum,
        percentage: Math.round((scoreNum / totalNum) * 100),
        approved: scoreNum >= 8,
        pokeball: selectedPokeball  // opcional
      })
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('Registro guardado:', data.registro);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Admin Panel - Obtener lista de registros

```typescript
// En un componente admin para ver todos los registros
const [registros, setRegistros] = useState([]);
const [token, setToken] = useState(localStorage.getItem('token'));

useEffect(() => {
  const fetchRegistros = async () => {
    try {
      const response = await fetch(
        'http://localhost:6500/registros?pagina=1&limite=50&approved=true',
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setRegistros(data.items);
      }
    } catch (error) {
      console.error('Error fetching registros:', error);
    }
  };
  
  fetchRegistros();
}, [token]);
```

---

## Setup Base de Datos

### Opción 1: Migration Manual (Recomendado para Producción)

1. Ejecuta el script SQL:
```sql
-- Archivo: src/main/docs/create_registros_table.sql
-- Ejecuta en tu cliente PostgreSQL
```

### Opción 2: Sincronizar automáticamente (Local)

1. Edita `src/main/db/conexion.ts`:
```typescript
export const AppDataSource = new DataSource({
    // ... otras opciones
    synchronize: true  // Cambiar a true temporalmente
});
```

2. Reinicia el servidor - TypeORM creará la tabla automáticamente

3. Cambia `synchronize` de vuelta a `false`:
```typescript
synchronize: false
```

### Verificar tabla creada

```sql
-- Conectar a la BD y ejecutar:
SELECT * FROM registros LIMIT 5;
```

---

## Variables de Entorno Requeridas

Asegúrate de tener estas variables en tu `.env`:

```env
SUPABASE_URL=tu_url_supabase
SUPABASE_DB=nombre_db
SUPABASE_HOST=host_db
SUPABASE_PORT=5432
SUPABASE_SCHEMA=produccion
JWT_TOKEN_SECRET=tu_secreto_jwt
PORT=6500
```

---

## Códigos de Respuesta HTTP

| Código | Significado |
|--------|-------------|
| 200 | Éxito - GET/PUT |
| 201 | Éxito - POST (recurso creado) |
| 400 | Error en los datos (validación) |
| 401 | No autenticado o token expirado |
| 403 | No autorizado (rol insuficiente) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Notas de Seguridad

- **POST /registros** es público (el frontend lo llama directamente)
- **GET /registros** y **GET /registros/{id}** requieren:
  - Token JWT válido
  - Rol de administrador (`rol: 'admin'`)
- Los endpoints están documentados en `src/main/docs/documentacion.yaml` (OpenAPI/Swagger)

---

## Siguiente Pasos

1. Crear tabla en la BD ejecutando `create_registros_table.sql`
2. Probar endpoints con Postman o curl
3. Integrar en el frontend (MissionResults.tsx)
4. Crear dashboard admin para visualizar registros
