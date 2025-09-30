# 🚀 Práctica #2 - Arquitectura del Dominio con Métodos Asíncronos

## 📋 Información del Proyecto

**Asignatura:** Aplicaciones para el Servidor Web  
**Práctica:** #2  
**Período:** 2025-2026(2)  
**Docente:** John Cevallos  
**Carrera:** Software  
**Nivel:** Quinto  

**CARLOS ALBERTO DELGADO CAMPUZANO**

## 🏗️ Arquitectura del Sistema

Este proyecto implementa una **arquitectura hexagonal** (puertos y adaptadores) siguiendo principios de **código limpio** y **SOLID**:

### 📂 Estructura de Capas

```
src/
├── domain/           # 🎯 Lógica de negocio y entidades
│   ├── entities/     # Entidades del dominio
│   └── interfaces/   # Contratos y abstracciones
├── infrastructure/   # 🔧 Implementaciones técnicas
├── application/      # 📊 Servicios de aplicación
└── presentation/     # 🖥️ Capa de presentación
```

### 🧩 Principios Aplicados

- **Single Responsibility Principle (SRP)**: Cada clase tiene una responsabilidad específica
- **Dependency Inversion Principle (DIP)**: Dependencias hacia abstracciones, no implementaciones
- **Inyección de Dependencias**: Desacoplamiento entre capas
- **Patrón Repository**: Abstracción del acceso a datos
- **Domain-Driven Design**: Enfoque en el dominio del negocio

## ⚡ Paradigmas Asíncronos Implementados

### 🔧 CREATE - Callbacks
- **Patrón**: `(error, resultado) => void`
- **Uso**: Creación de nuevos usuarios
- **Características**:
  - Simulación de latencia de red (500-1500ms)
  - Validaciones de negocio
  - Manejo de errores en primer parámetro

### ✏️ UPDATE - Promises
- **Patrón**: `Promise<T>` con `.then()` y `.catch()`
- **Uso**: Actualización de usuarios existentes
- **Características**:
  - Encadenamiento de operaciones
  - Validación de existencia
  - Actualización parcial de campos

### 📋 READ - Async/Await
- **Patrón**: `async/await` con `try/catch`
- **Uso**: Consultas de usuarios
- **Características**:
  - Sintaxis síncrona para código asíncrono
  - Manejo elegante de errores
  - Múltiples tipos de consulta

### 🗑️ DELETE - Async/Await
- **Patrón**: `async/await` con validaciones
- **Uso**: Eliminación de usuarios
- **Características**:
  - Validación de existencia previa
  - Reglas de negocio (no eliminar admins)
  - Retorno booleano de éxito/fallo

## 💾 Repositorio en Memoria

### 📊 Datos de Prueba (11 registros)

El sistema incluye **11 usuarios realistas** con diferentes roles:

| Rol | Cantidad | Ejemplos |
|-----|----------|----------|
| Admin | 1 | María González |
| Entrepreneur | 4 | Carlos Martínez, Sofía López, Miguel Castro, Fernando Ortiz |
| Investor | 3 | Ana Rodríguez, Diego Herrera, Isabella Vargas |
| Mentor | 2 | Luis Torres, Patricia Silva |
| User | 1 | Carmen Ruiz |

### 🔐 Características de los Datos

- **IDs únicos**: Generados con UUID v4
- **Emails únicos**: Validación de duplicados
- **Validaciones**: Edad (18-120), formato email, nombres válidos
- **Estados**: Usuarios activos e inactivos para pruebas
- **Roles específicos**: Sistema de emprendimiento completo

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Node.js** | v18+ | Runtime de JavaScript |
| **TypeScript** | v5.3+ | Tipado estático |
| **ts-node** | v10.9+ | Ejecución directa de TS |
| **UUID** | v9.0+ | Generación de IDs únicos |
| **Chalk** | v4.1+ | Colorización de consola |

## 📥 Instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd p1
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Verificar instalación**
```bash
npm run build
```

## 🚀 Ejecución

### 🎯 Ejecutar Pruebas Principales
```bash
npm start
```

### 🔄 Modo Desarrollo (con watch)
```bash
npm run dev
```

### 🏗️ Compilar TypeScript
```bash
npm run build
```

### 🧹 Limpiar Compilación
```bash
npm run clean
```

## 📖 Documentación de APIs

### 🏛️ UserService

#### CREATE - Callbacks
```typescript
createUser(userData: CreateUserData, callback: CreateCallback<User>): void
```
- **Entrada**: Datos del usuario (sin ID)
- **Salida**: Callback con error o usuario creado
- **Validaciones**: Email único, datos requeridos

#### READ - Async/Await
```typescript
async getUserById(id: string): Promise<User | null>
async getAllUsers(): Promise<User[]>
async getUsersByRole(role: UserRole): Promise<User[]>
async getActiveUsers(): Promise<User[]>
```

#### UPDATE - Promises
```typescript
updateUser(id: string, updates: Partial<User>): Promise<User | null>
```
- **Entrada**: ID y campos a actualizar
- **Salida**: Promise con usuario actualizado
- **Validaciones**: Existencia del usuario

#### DELETE - Async/Await
```typescript
async deleteUser(id: string): Promise<boolean>
```
- **Entrada**: ID del usuario
- **Salida**: Boolean indicando éxito
- **Reglas**: No eliminar administradores

### 🏪 UserRepository

#### Operaciones Principales
- `create()` - Inserción con callbacks
- `findById()` - Búsqueda por ID
- `findAll()` - Listar todos
- `update()` - Actualización con promises
- `delete()` - Eliminación física

#### Operaciones Específicas
- `findByEmail()` - Búsqueda por email
- `findByRole()` - Filtrar por rol
- `findActiveUsers()` - Solo activos

## 🧪 Evidencias de Funcionamiento

### 📊 Salida de Consola Esperada

```
🚀 INICIANDO PRUEBAS DEL SISTEMA DE USUARIOS
====================================================

📊 DATOS INICIALES DEL SISTEMA
----------------------------------------
📈 Total de usuarios registrados: 11
👥 Usuarios activos: 10
💤 Usuarios inactivos: 1

📋 Distribución por roles:
  • admin: 1 usuarios
  • entrepreneur: 4 usuarios
  • investor: 3 usuarios
  • mentor: 2 usuarios
  • user: 1 usuarios

✓ Datos iniciales mostrados correctamente

🔧 PRUEBA CREATE CON CALLBACKS
----------------------------------
📝 Creando usuario: Roberto Mendoza...
✅ Usuario creado exitosamente:
   ID: [UUID_GENERADO]
   Nombre: Roberto Mendoza
   Email: nuevo.usuario1@test.com
   Rol: entrepreneur

[... más creaciones ...]

🧪 Probando creación con email duplicado...
❌ Error: El email admin@emprendimiento.com ya está registrado

✓ Pruebas de CREATE con callbacks completadas

🔍 PRUEBA READ CON ASYNC/AWAIT
-----------------------------------
📋 Obteniendo todos los usuarios...
✅ Se encontraron 14 usuarios

👥 Primeros 5 usuarios:
  1. María González (admin@emprendimiento.com) - admin
  2. Carlos Martínez (carlos.martinez@startup.com) - entrepreneur
  [... más usuarios ...]

[... más operaciones READ ...]

✓ Pruebas de READ con async/await completadas

✏️  PRUEBA UPDATE CON PROMISES
----------------------------------
🔄 Actualizando usuario: Carlos Martínez...
✅ Usuario actualizado exitosamente:
   ID: [UUID]
   Nombre: Carlos (Actualizado) Martínez
   Edad: 29
   Última actualización: [TIMESTAMP]

[... más actualizaciones ...]

✓ Pruebas de UPDATE con promises completadas

🗑️  PRUEBA DELETE CON ASYNC/AWAIT
------------------------------------
🗑️  Eliminando usuario: Carmen Ruiz...
✅ Usuario eliminado exitosamente

[... más eliminaciones ...]

🧪 Probando eliminación de administrador (debe fallar)...
⚠️  Error esperado: No se puede eliminar usuarios administradores

✓ Pruebas de DELETE con async/await completadas

📊 ESTADÍSTICAS FINALES DEL SISTEMA
---------------------------------------
📈 Resumen final:
   • Total de usuarios: 12
   • Usuarios activos: 11
   • Usuarios inactivos: 1

👥 Distribución por roles:
   👑 admin: 1 usuarios
   🚀 entrepreneur: 6 usuarios
   💰 investor: 3 usuarios
   🎓 mentor: 3 usuarios

✓ Estadísticas finales mostradas correctamente

✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE
```

### 🎨 Características Visuales

- **Colores**: Chalk para diferenciación visual
- **Iconos**: Emojis para mejor UX
- **Estructura**: Secciones claramente delimitadas
- **Estados**: Indicadores de éxito/error/advertencia

## 🎯 Conclusiones Individuales

### 🏗️ Arquitectura y Diseño

**Logros alcanzados:**
- ✅ Implementación exitosa de arquitectura hexagonal
- ✅ Separación clara de responsabilidades en 4 capas
- ✅ Aplicación correcta de principios SOLID
- ✅ Inyección de dependencias funcional

**Aprendizajes:**
- La arquitectura hexagonal facilita enormemente el testing y mantenimiento
- La separación de capas hace el código más legible y escalable
- Los principios SOLID realmente mejoran la calidad del código

### ⚡ Paradigmas Asíncronos

**Logros alcanzados:**
- ✅ Implementación correcta de callbacks con patrón (error, result)
- ✅ Uso apropiado de Promises con .then() y .catch()
- ✅ Aplicación efectiva de async/await con try/catch
- ✅ Manejo adecuado de errores en todos los paradigmas

**Aprendizajes:**
- Cada paradigma tiene sus casos de uso óptimos
- Los callbacks son útiles para APIs legacy pero verbosos
- Las Promises ofrecen mejor composabilidad
- Async/await proporciona la sintaxis más limpia

### 💾 Gestión de Datos

**Logros alcanzados:**
- ✅ Repositorio en memoria completamente funcional
- ✅ 11 registros realistas con datos coherentes
- ✅ Validaciones de negocio implementadas
- ✅ Simulación realista de latencia de red

**Aprendizajes:**
- La simulación de latencia ayuda a entender el comportamiento asíncrono
- Las validaciones de dominio son cruciales para integridad de datos
- El patrón Repository abstrae efectivamente el acceso a datos

### 🧪 Testing y Calidad

**Logros alcanzados:**
- ✅ Suite completa de pruebas para todos los paradigmas
- ✅ Manejo comprehensivo de errores
- ✅ Logs claros y informativos
- ✅ Casos edge probados (duplicados, inexistentes, etc.)

**Aprendizajes:**
- Un buen sistema de logging es esencial para debugging
- Las pruebas exhaustivas revelan edge cases importantes
- La retroalimentación visual mejora significativamente la UX

### 🚀 Impacto Profesional

Esta práctica ha sido fundamental para entender:

1. **Arquitectura de Software**: Cómo diseñar sistemas escalables y mantenibles
2. **Programación Asíncrona**: Dominio de los diferentes paradigmas de JavaScript/TypeScript
3. **Principios de Diseño**: Aplicación práctica de SOLID y patrones de diseño
4. **Calidad de Código**: Importancia de validaciones, manejo de errores y testing

**Preparación para el futuro:**
- Base sólida para APIs REST
- Fundamentos para integración con bases de datos reales
- Conocimientos aplicables a frameworks como Express, Fastify, etc.
- Comprensión profunda de TypeScript y Node.js

### 🎓 Reflexión Final

Esta práctica demuestra que una arquitectura bien diseñada y la aplicación correcta de paradigmas asíncronos son fundamentales para crear aplicaciones robustas y escalables. Los conocimientos adquiridos serán la base para desarrollos más complejos en el futuro.

---

---

*Desarrollado con ❤️ para la materia Aplicaciones para el Servidor Web*