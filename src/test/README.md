# 🥋 BE-API_01 - Testing Continuo SIASIS con Karate DSL

Framework de automatización de pruebas API para el Sistema SIASIS utilizando **Karate DSL** con integración CI/CD en GitHub Actions.

## 🚀 Plataforma Web de Testing

### ✨ **NUEVO: Ejecuta pruebas desde una interfaz visual**

Ya no necesitas ejecutar comandos o navegar en GitHub Actions. Usa nuestra plataforma web:

```
🌐 https://MonoSama21.github.io/BE-frameworkbase-KarateDSL/
```

**Características:**
- 🎯 Interfaz amigable con tags preconfigurados
- 🤖 Asistente ZeusBot con guías por rol (QA/DEV/Negocio)
- 📊 Visualización de historial de ejecuciones
- 📧 Notificaciones automáticas por correo
- 🔐 Gestión segura de tokens

**📖 Documentación:**
- [GUIA-RAPIDA.md](GUIA-RAPIDA.md) - Inicio rápido en 3 pasos
- [PLATAFORMA-TESTING.md](PLATAFORMA-TESTING.md) - Documentación completa

---

## 📋 Descripción

Este proyecto automatiza las APIs del sistema SIASIS mediante:
- **Framework:** Karate DSL (BDD para APIs)
- **Build Tool:** Maven + Java 17
- **CI/CD:** GitHub Actions
- **Reportes:** HTML interactivos con request/response completos
- **Notificaciones:** Correo automático con resultados

---

## 🏗️ Estructura del Proyecto

```
BE-frameworkbase-KarateDSL/
├── src/test/
│   ├── java/
│   │   ├── karate-config.js          # Configuración de ambientes
│   │   └── karate/runner/
│   │       └── TestRunner.java       # Runner principal
│   └── resources/
│       ├── features/
│       │   ├── Login/                # Feature files de Login
│       │   │   ├── POST-LoginRolAuxiliar.feature
│       │   │   ├── POST-LoginRolDirectivo.feature
│       │   │   └── ...
│       │   └── MisDatos/             # Feature files de Mis Datos
│       │       ├── Directivo/
│       │       ├── ProfesorPrimaria/
│       │       └── ...
│       └── functional/
│           ├── data/                 # Data test files
│           ├── request/              # Request templates
│           └── schema/               # JSON Schemas
├── target/karate-reports/            # Reportes HTML generados
├── .github/workflows/
│   └── karate-manual.yml            # Workflow de CI/CD
├── test-launcher.html               # 🌟 Plataforma web de testing
├── pom.xml                          # Configuración Maven
├── GUIA-RAPIDA.md                   # Guía de inicio rápido
└── PLATAFORMA-TESTING.md            # Documentación completa
```

---

## 🏷️ Tags Disponibles

| Tag | Descripción | Tiempo |
|-----|-------------|--------|
| `@dailyTests` | Suite completa de validación | 10-15 min |
| `@postLoginRolAuxiliar` | Login rol auxiliar | 2-3 min |
| `@postLoginRolDirectivo` | Login rol directivo | 2-3 min |
| `@postLoginRolProfesorPrimaria` | Login profesor primaria | 2-3 min |
| `@postLoginRolProfesorSecundaria` | Login profesor secundaria | 2-3 min |
| `@postLoginRolTutorSecundaria` | Login tutor secundaria | 2-3 min |
| `@misDatos` | Suite de datos de usuario | 5-7 min |
| `@security` | Pruebas de seguridad | 3-5 min |

---

## 🚀 Formas de Ejecutar

### 1️⃣ Plataforma Web (RECOMENDADO)

La forma más fácil y visual:

```
https://MonoSama21.github.io/BE-frameworkbase-KarateDSL/
```

**Ventajas:**
- ✅ Sin instalación
- ✅ Interfaz amigable
- ✅ Notificaciones por email
- ✅ Historial integrado

### 2️⃣ Línea de Comandos (Local)

```bash
# Clonar el repositorio
git clone https://github.com/MonoSama21/BE-frameworkbase-KarateDSL.git
cd BE-frameworkbase-KarateDSL

# Ejecutar todas las pruebas
mvn test

# Ejecutar por tag
mvn test -Dkarate.options="--tags @dailyTests"

# Ejecutar en ambiente específico
mvn test -Dkarate.env=QA
mvn test -Dkarate.env=DEV

# Ver reporte
open target/karate-reports/karate-summary.html
```

### 3️⃣ GitHub Actions (Manual)

1. Ve a: https://github.com/MonoSama21/BE-frameworkbase-KarateDSL/actions
2. Selecciona workflow: **"🚀 Karate API Tests - Manual & Scheduled"**
3. Click **"Run workflow"**
4. Completa:
   - Tag: `@dailyTests`
   - Ambiente: `QA` o `DEV`
   - Correo: tu-email@ejemplo.com
5. Click **"Run workflow"**

---

## 🕐 Ejecuciones Programadas

El sistema ejecuta pruebas automáticamente:

| Frecuencia | Hora (Perú) | Tag | Ambiente |
|------------|-------------|-----|----------|
| **Lunes-Viernes** | 8:00 AM | `@dailyTests` | QA |
| **Sábado-Domingo** | 10:00 AM | `@postLoginRolAuxiliar` | QA |

---

## 📧 Notificaciones por Email

Cada ejecución envía 2 correos automáticos:

### 🔵 Email de Inicio
- Confirmación de ejecución
- Tag y ambiente seleccionados
- Fecha/hora de inicio
- Número de build

### 🟢 Email de Resultados
- Estado general (✅ PASSED / ❌ FAILED)
- Tabla de resultados por escenario
- Link al reporte HTML completo
- Link a artifacts en GitHub

---

## 📊 Reportes Karate

Los reportes HTML incluyen:

- ✅ Resumen visual de escenarios (passed/failed)
- 📝 Request completo (URL, headers, body)
- 📝 Response completo (status, headers, body)
- ⏱️ Tiempos de ejecución
- 🔍 Step-by-step de cada escenario
- 📊 Comparación esperado vs actual en fallos

**Acceso a reportes:**
- 🌐 GitHub Pages: https://MonoSama21.github.io/BE-frameworkbase-KarateDSL/reports/{run_number}/
- 📦 Artifacts: Descargables desde GitHub Actions

---

## 🛠️ Requisitos para Desarrollo Local

### Java & Maven
```bash
# Verificar instalación
java -version   # Requiere Java 17+
mvn -version    # Requiere Maven 3.8+
```

### IDE Recomendado
- **IntelliJ IDEA** con plugin Karate
- **VS Code** con extensión Karate Runner

### Configuración de Ambientes

Edita `karate-config.js`:

```javascript
function fn() {
  var env = karate.env || 'QA';
  
  var config = {
    baseUrl: '',
    timeout: 30000
  };
  
  if (env == 'DEV') {
    config.baseUrl = 'https://api-dev.siasis.com';
  } else if (env == 'QA') {
    config.baseUrl = 'https://api-qa.siasis.com';
  }
  
  return config;
}
```

---

## 🔒 Configuración de Secrets

Para notificaciones por email, configura estos secrets en GitHub:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `MAIL_SERVER` | Servidor SMTP | `smtp.gmail.com` |
| `MAIL_PORT` | Puerto SMTP | `587` |
| `MAIL_USERNAME` | Usuario SMTP | `tu-correo@gmail.com` |
| `MAIL_PASSWORD` | Contraseña SMTP | `abcd efgh ijkl mnop` |

---

## 🤖 ZeusBot - Asistente Virtual

La plataforma incluye un asistente inteligente que adapta las guías según tu rol:

- **👨‍💻 QA Automation:** Guías técnicas de testing
- **⚙️ Desarrolladores:** Validación de APIs y debugging
- **💼 Negocio/PO:** Explicaciones sin tecnicismos
- **🔧 Técnico:** Detalles de arquitectura

---

## 📚 Documentación Adicional

- [GUIA-RAPIDA.md](GUIA-RAPIDA.md) - Inicio en 3 pasos
- [PLATAFORMA-TESTING.md](PLATAFORMA-TESTING.md) - Doc completa de la plataforma
- [Karate DSL Docs](https://github.com/karatelabs/karate) - Documentación oficial

---

## 🐛 Troubleshooting

### Error: "Token inválido"
Genera un nuevo token: https://github.com/settings/tokens/new?scopes=repo,workflow

### Error: "Pruebas fallidas"
1. Ve al reporte HTML
2. Revisa el request/response del escenario fallido
3. Compara con el comportamiento esperado
4. Verifica configuración de ambiente

### No recibo correos
Verifica que los secrets MAIL_* estén correctamente configurados

---

## 👥 Equipo

**QA Automation SSr:** Yrvin Pachas  
**Email:** 2101010261@undc.edu.pe  
**Proyecto:** SIASIS - Sistema Académico  

---

## 📝 Changelog

### v2.0.0 - 2026-01-08
- 🥋 Migración completa a Karate DSL
- 🌐 Plataforma web interactiva (test-launcher.html)
- 🤖 Asistente ZeusBot
- 📊 Historial de ejecuciones
- 📧 Notificaciones automáticas mejoradas
- 🏷️ Nuevos tags organizados por módulo

---

## 📄 Licencia

Este proyecto es de uso interno para SIASIS.

---

**🎯 ¡Listo para empezar!** Abre la [plataforma web](https://MonoSama21.github.io/BE-frameworkbase-KarateDSL/) y ejecuta tu primera prueba en minutos 🚀
 