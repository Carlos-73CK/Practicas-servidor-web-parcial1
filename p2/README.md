# 🚀 Práctica #2 - Arquitectura del Dominio con Métodos Asíncronos

## 📋 Información del Proyecto

**Asignatura:** Aplicaciones para el Servidor Web  
**Práctica:** #2  
**Período:** 2025-2026(2)  
**Docente:** John Cevallos  
**Carrera:** Software  
**Nivel:** Quinto  

**CARLOS ALBERTO DELGADO CAMPUZANO**

## 🏗️ Entidad Usuario 

La entidad `User` ha sido refactorizada con una estructura más simple y enfocada:

### � Atributos de la Entidad

| Atributo | Tipo | Descripción | Validaciones |
|----------|------|-------------|--------------|
| **id_usuario** | `string` | Identificador único (UUID) | Generado automáticamente |
| **nombres** | `string` | Nombres completos del usuario | Mínimo 2 caracteres |
| **email** | `string` | Correo electrónico único | Formato válido, único en sistema |
| **contraseña** | `string` | Contraseña del usuario | Mínimo 6 caracteres |
| **estado** | `UserStatus` | Estado del usuario | `activo` o `inactivo` |

### � Enumeración UserStatus

```typescript
export enum UserStatus {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo'
}
```

### 🛡️ Validaciones Implementadas

1. **Email**: Formato válido y único en el sistema
2. **Nombres**: Mínimo 2 caracteres, no vacío
3. **Contraseña**: Mínimo 6 caracteres para seguridad básica
4. **Estado**: Solo valores válidos del enum UserStatus

### 🧰 Métodos Disponibles

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `getNombres()` | `string` | Obtiene los nombres del usuario |
| `isActive()` | `boolean` | Verifica si el usuario está activo |
| `updateWith()` | `User` | Crea nueva instancia con campos actualizados |
| `toJSON()` | `UserData` | Serialización completa (incluye contraseña) |
| `toSafeJSON()` | `SafeUserData` | Serialización segura (sin contraseña) |

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

El sistema incluye **11 usuarios realistas** con la nueva estructura simplificada:

| Usuario | Email | Estado |
|---------|-------|--------|
| María González Admin | maria.gonzalez@sistema.com | ✅ Activo |
| Carlos Martínez López | carlos.martinez@empresa.com | ✅ Activo |
| Ana Sofía Rodríguez | ana.rodriguez@negocio.com | ✅ Activo |
| Luis Fernando Torres | luis.torres@consulta.com | ✅ Activo |
| Sofía Elena López | sofia.lopez@startup.com | ✅ Activo |
| Diego Alejandro Herrera | diego.herrera@inversion.com | ✅ Activo |
| Patricia Silva Morales | patricia.silva@mentor.com | ✅ Activo |
| Miguel Ángel Castro | miguel.castro@tech.com | ✅ Activo |
| Carmen Beatriz Ruiz | carmen.ruiz@usuario.com | ✅ Activo |
| Fernando José Ortiz | fernando.ortiz@empresa.com | ✅ Activo |
| Isabella Vargas Pérez | isabella.vargas@prueba.com | ❌ Inactivo |

### 🔐 Características de los Datos

- **IDs únicos**: Generados con UUID v4
- **Emails únicos**: Validación de duplicados
- **Contraseñas**: Todas tienen formato `nombre123456` (mínimo 6 caracteres)
- **Estados**: 10 usuarios activos, 1 inactivo para pruebas
- **Validaciones**: Email válido, nombres mínimo 2 caracteres

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
- **Entrada**: `{ nombres, email, contraseña, estado? }`
- **Salida**: Callback con error o usuario creado
- **Validaciones**: Email único, contraseña mínimo 6 caracteres

#### READ - Async/Await
```typescript
async getUserById(id: string): Promise<User | null>
async getAllUsers(): Promise<User[]>
async getUsersByEstado(estado: UserStatus): Promise<User[]>
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
- **Reglas**: Eliminación física del usuario

### 🏪 UserRepository

#### Operaciones Principales
- `create()` - Inserción con callbacks
- `findById()` - Búsqueda por ID
- `findAll()` - Listar todos
- `update()` - Actualización con promises
- `delete()` - Eliminación física

#### Operaciones Específicas
- `findByEmail()` - Búsqueda por email único
- `findByEstado()` - Filtrar por estado (activo/inactivo)
- `findActiveUsers()` - Solo usuarios activos

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