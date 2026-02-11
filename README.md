# 🎓 API REST - Sistema de Gestión de Cursos con Express y TypeScript

Sistema backend completo para gestionar estudiantes, profesores y cursos utilizando Express.js, TypeScript y TypeORM con MySQL.

## 📋 Tabla de Contenidos

- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Modelos y Relaciones](#-modelos-y-relaciones)
- [API Endpoints](#-api-endpoints)
- [Problemas Resueltos](#-problemas-resueltos)

## 🛠 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js v5.2.1** - Framework web
- **TypeScript v5.9.3** - Superset de JavaScript con tipado estático

### Base de Datos
- **TypeORM v0.3.28** - ORM para TypeScript
- **MySQL2 v3.16.3** - Driver de MySQL
- **Reflect Metadata v0.2.2** - Requerido para decoradores de TypeORM

### Desarrollo
- **ts-node-dev v2.0.0** - Ejecutar TypeScript con auto-reload
- **Morgan v1.10.1** - Logger de peticiones HTTP
- **CORS v2.8.6** - Manejo de CORS

### Tipos TypeScript
- `@types/express` - Tipos para Express
- `@types/cors` - Tipos para CORS
- `@types/morgan` - Tipos para Morgan
- `@types/node` - Tipos para Node.js

## 📦 Instalación

### Paso 1: Clonar o descargar el proyecto

```bash
cd "C:\Users\Yrvin PS\Desktop\CURSO EXPRESS TS"
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Esto instalará automáticamente:
- Dependencias de producción (express, typeorm, mysql2, etc.)
- Dependencias de desarrollo (typescript, ts-node-dev, @types/*)

### Paso 3: Configurar TypeScript

El proyecto ya incluye `tsconfig.json` configurado con:
- **module:** commonjs (compatible con Node.js)
- **target:** ES2020
- **strict:** true (máxima seguridad de tipos)
- **sourceMap:** true (debugging)
- **esModuleInterop:** true (importación mejorada)

Para crear un nuevo `tsconfig.json` (si no existe):

```bash
npx tsc --init
```

## ⚙ Configuración

### Configuración de Base de Datos

Editar el archivo `src/db/conexion.ts`:

```typescript
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",        // Tu usuario de MySQL
    password: "123456",       // Tu contraseña de MySQL
    database: "sys",          // Nombre de tu base de datos
    logging: true,            // Ver queries SQL en consola
    entities: [Estudiante, Profesor, Curso],
    synchronize: true,        // Auto-crear tablas (solo desarrollo)
    // dropSchema: true,      // ⚠️ SOLO PARA DESARROLLO - Borra y recrea tablas
});
```

### Scripts Disponibles

En `package.json`:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",  // Servidor desarrollo con hot-reload
    "build": "tsc",                                 // Compilar TypeScript a JavaScript
    "start": "node build/index.js"                 // Ejecutar versión compilada
  }
}
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:6505`

### Compilar y Ejecutar en Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
CURSO EXPRESS TS/
│
├── src/
│   ├── controllers/           # Lógica de negocio
│   │   ├── estudiantesController.ts
│   │   ├── profesoresController.ts
│   │   └── cursosController.ts
│   │
│   ├── models/                # Entidades de TypeORM
│   │   ├── estudiantesModel.ts
│   │   ├── profesoresModel.ts
│   │   └── cursoModel.ts
│   │
│   ├── routes/                # Definición de rutas
│   │   ├── estudiantesRoutes.ts
│   │   ├── profesoresRoutes.ts
│   │   └── cursosRoutes.ts
│   │
│   ├── db/
│   │   └── conexion.ts        # Configuración de TypeORM
│   │
│   ├── app.ts                 # Configuración de Express
│   └── index.ts               # Punto de entrada
│
├── build/                     # Código compilado (generado)
├── node_modules/              # Dependencias
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄 Modelos y Relaciones

### 1. Estudiante

**Entidad:** `estudiantes`

```typescript
{
  id: number              // PK, autoincremental
  dni: string
  nombre: string
  apellido: string
  email: string
  createdAt: Date         // Fecha de creación
  updatedAt: Date         // Fecha de actualización
}
```

**Relaciones:**
- Muchos a Muchos con `Curso` (a través de tabla intermedia `cursos_estudiantes`)

### 2. Profesor

**Entidad:** `profesores`

```typescript
{
  id: number              // PK, autoincremental
  dni: string
  nombre: string
  apellido: string
  email: string
  profesion: string
  telefono: string
  createdAt: Date
  updatedAt: Date
  cursos: Curso[]         // Relación One to Many
}
```

**Relaciones:**
- Uno a Muchos con `Curso` (un profesor puede tener varios cursos)

### 3. Curso

**Entidad:** `cursos`

```typescript
{
  id: number              // PK, autoincremental
  nombre: string
  descripcion: text
  profesor_id: number     // FK a profesores
  createdAt: Date
  updatedAt: Date
  profesor: Profesor      // Relación Many to One
  estudiantes: Estudiante[] // Relación Many to Many
}
```

**Relaciones:**
- Muchos a Uno con `Profesor` (un curso pertenece a un profesor)
- Muchos a Muchos con `Estudiante` (un curso puede tener varios estudiantes)

### Diagrama de Relaciones

```
┌─────────────┐         ┌─────────────┐
│  Profesor   │ 1     N │    Curso    │
│             ├─────────┤             │
│  - cursos[] │         │  - profesor │
└─────────────┘         └──────┬──────┘
                               │ N
                               │
                               │ N
                        ┌──────┴───────┐
                        │  Estudiante  │
                        │              │
                        └──────────────┘

Tabla intermedia: cursos_estudiantes
- curso_id (FK)
- estudiante_id (FK)
```

## 🚀 API Endpoints

### Estudiantes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/estudiantes` | Listar todos los estudiantes |
| GET | `/estudiantes/:id` | Obtener un estudiante por ID |
| POST | `/estudiantes` | Crear nuevo estudiante |
| PUT | `/estudiantes/:id` | Actualizar estudiante |
| DELETE | `/estudiantes/:id` | Eliminar estudiante |

#### Ejemplo POST `/estudiantes`

```json
{
  "dni": "72490012",
  "nombre": "Yrvin",
  "apellido": "Pacha",
  "email": "yrvin@gmail.com"
}
```

**Respuesta:** `201 Created`

### Profesores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/profesores` | Listar todos los profesores |
| GET | `/profesores/:id` | Obtener un profesor por ID |
| POST | `/profesores` | Crear nuevo profesor |
| PUT | `/profesores/:id` | Actualizar profesor |
| DELETE | `/profesores/:id` | Eliminar profesor |

#### Ejemplo POST `/profesores`

```json
{
  "dni": "12345678",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "profesion": "Ingeniero de Software",
  "telefono": "999888777"
}
```

**Respuesta:** `201 Created`

### Cursos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/cursos` | Listar todos los cursos con profesor y estudiantes |
| GET | `/cursos/:id` | Obtener un curso por ID con relaciones |
| POST | `/cursos` | Crear nuevo curso |
| PUT | `/cursos/:id` | Actualizar curso |
| DELETE | `/cursos/:id` | Eliminar curso |
| PUT | `/cursos/:id/estudiantes` | Asociar estudiante a curso |

#### Ejemplo POST `/cursos`

```json
{
  "nombre": "Backend con Express",
  "descripcion": "Curso completo de desarrollo backend",
  "profesor_id": 1
}
```

**Respuesta:** `201 Created`

#### Ejemplo PUT `/cursos/1`

```json
{
  "nombre": "Backend Avanzado",
  "descripcion": "Curso actualizado de backend",
  "profesor_id": 4
}
```

**Respuesta:** `200 OK`

#### Ejemplo PUT `/cursos/1/estudiantes` (Asociar estudiante)

```json
{
  "estudiante_id": 2,
  "curso_id": 1
}
```

**Respuesta:** `200 OK`

## 🔧 Problemas Resueltos Durante el Desarrollo

### 1. ❌ Error: `tsc: El término 'tsc' no se reconoce`

**Problema:** TypeScript no estaba instalado o no se encontraba en el PATH.

**Solución:**
```bash
npm install            # Instalar dependencias locales
npx tsc --init         # Usar npx para ejecutar tsc local
```

### 2. ❌ Error: `Cannot save, given value must be an entity`

**Problema:** Los modelos no extendían de `BaseEntity`, por lo que no tenían acceso a métodos como `find()`, `save()`, etc.

**Solución:** Agregar `extends BaseEntity` a todas las entidades:

```typescript
import { BaseEntity, Entity, ... } from "typeorm";

@Entity('estudiantes')
export class Estudiante extends BaseEntity {
  // ...
}
```

### 3. ❌ Error: `req.body` es `undefined`

**Problema:** Faltaba el middleware para parsear JSON en Express.

**Solución:** Agregar en `app.ts`:

```typescript
app.use(express.json()); // Parsear JSON en el body
```

### 4. ❌ Error: `ECMAScript imports cannot be written in CommonJS file`

**Problema:** TypeScript estaba configurado para módulos ESM pero TypeORM esperaba CommonJS.

**Solución:** Ajustar `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "verbatimModuleSyntax": false
  }
}
```

### 5. ❌ Error: `Cannot add or update a child row: a foreign key constraint fails`

**Problema:** Las tablas tenían datos inconsistentes con referencias a IDs que no existían.

**Solución:** Limpiar las tablas usando `dropSchema: true` temporalmente:

```typescript
export const AppDataSource = new DataSource({
  // ... otras configuraciones
  synchronize: true,
  dropSchema: true,  // ⚠️ Solo para desarrollo - quitar después
});
```

### 6. ❌ Error: `Unknown column 'NaN' in 'where clause'`

**Problema:** El controlador buscaba `profesor` en el body pero el JSON enviaba `profesor_id`.

**Solución:**

```typescript
// ❌ Incorrecto
const { profesor } = req.body;
Number(profesor) // undefined → NaN

// ✅ Correcto
const { profesor_id } = req.body;
Number(profesor_id) // 1, 2, 3...
```

### 7. ❌ Respuesta DELETE se queda colgada

**Problema:** Usar `res.status(204)` sin enviar la respuesta.

**Solución:**

```typescript
// ❌ Incorrecto
res.status(204);

// ✅ Correcto
res.sendStatus(204);
```

### 8. ❌ Error al crear estudiante/profesor/curso

**Problema:** Usar `Entity.save(req.body)` directamente sin crear instancia.

**Solución:**

```typescript
// ❌ Incorrecto
await Estudiante.save(req.body);

// ✅ Correcto
const registro = Estudiante.create(req.body);
await registro.save();
```

### 9. ❌ Error al actualizar curso con relación

**Problema:** Usar `Entity.update()` no actualiza relaciones correctamente.

**Solución:**

```typescript
// ❌ Incorrecto
await Curso.update({ id }, req.body);

// ✅ Correcto
const registro = await Curso.findOneBy({ id });
registro.nombre = req.body.nombre;
registro.profesor = profesorRegistro;
await registro.save();
```

## 📚 Recursos Adicionales

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TypeORM Documentation](https://typeorm.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 👤 Autor

**Yrvin Pachas - QA Automation / FullStack Developer**

## 📝 Licencia

ISC

---

**Nota:** Este proyecto fue desarrollado con fines educativos como parte del curso de Express con TypeScript.
