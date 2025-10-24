# Práctica 5 – Gateway GraphQL (NestJS)

Gateway GraphQL que consume la API REST del Taller 4 (NestJS + TypeORM + SQLite) en `http://localhost:3000/api/v1`. Implementa 9 queries “ingeniosas” con agregaciones y filtros, usando arquitectura code‑first, Apollo Sandbox e introspection.

## Arquitectura

Cliente → GraphQL Gateway (Taller 5) → API REST (Taller 4) → SQLite

```
[Cliente]
   ↓
[NestJS GraphQL (Apollo) 3001]
   ↓ HTTP (HttpModule/Axios)
[NestJS REST 3000/api/v1]
   ↓
[SQLite]
```

Evidencias: capturas y schema en `practica5/imagenes/` (incluye `schema.png`).

## Requisitos
- Node.js 20+
- API REST del Taller 4 corriendo en `http://localhost:3000/api/v1`

## Instalación y ejecución

1) Terminal A – Práctica 4 (REST en 3000)

```powershell
cd "c:\Users\lenovo\Desktop\APLICACIONES_WEB\practica4"
npm install
npm run start
```

2) Terminal B – Práctica 5 (GraphQL en 3001)

```powershell
cd "c:\Users\lenovo\Desktop\APLICACIONES_WEB\practica5\graph"
npm install
npm run build
npm run start
```

Abrir Apollo Sandbox: http://localhost:3001/graphql

Semillas (opcional, Taller 4):

```powershell
cd "c:\Users\lenovo\Desktop\APLICACIONES_WEB\practica4"; npm run seed
```

Si el puerto 3001 está ocupado:

```powershell
netstat -ano | findstr :3001
Stop-Process -Id <PID> -Force
```

## Configuración técnica clave
- GraphQLModule: Apollo Driver, `autoSchemaFile: src/schema.gql`, `introspection: true`, Apollo Landing Page, `sortSchema: true`.
- CORS habilitado en `src/main.ts` para Apollo Studio y frontends locales.
- HttpModule con `baseURL: http://localhost:3000/api/v1`.
- Schema generado en `practica5/graph/src/schema.gql`.

## Módulos y queries base
- Catálogos: `categorias`, `areas`, `estados`, `etiquetas`.
- Usuarios/Roles: `usuarios`, `roles`.
- Reportes: `reporte(id)`, `reportes(filtro, paginacion)`.
- Comentarios/Archivos/Puntuaciones: `comentarios(reporteId?)`, `archivosAdjuntos(reporteId?)`, `puntuaciones(reporteId?)`.

## 9 Queries de Analytics con autores (documentadas)

Colección ejecutable completa: `practica5/graph/docs/queries.graphql`.

1) topAreasConMasReportes(limite?) — Autor: Carlos Delgado
- Descripción: Top de áreas con más reportes; incluye promedio de puntuaciones.
- Args: `limite: Int` (opcional).
- Ejemplo:
```graphql
query($limite:Int){ topAreasConMasReportes(limite:$limite){ area{ id nombre } totalReportes promedioPuntuacion } }
```

2) tableroEtiquetas(limite?) — Autor: Carlos Delgado
- Descripción: Ranking de etiquetas por usos en reportes y comentarios.
- Args: `limite: Int` (opcional).

3) resumenUsuario(usuarioId!) — Autor: Carlos Delgado
- Descripción: Totales de reportes, comentarios y promedio de puntuación de sus reportes.
- Args: `usuarioId: Int!`.

4) rankingUsuariosPorAportes(limite?, desde?, hasta?) — Autor: Jeremy Vera
- Descripción: Ranking por aportes (reportes+comentarios+puntuaciones) con filtro temporal.
- Args: `limite: Int`, `desde: String`, `hasta: String` (ISO, opcionales).

5) reportesPorEtiquetaConPromedio(etiquetaId!, limite?) — Autor: Jeremy Vera
- Descripción: Reportes asociados a una etiqueta con promedio de puntuación.
- Args: `etiquetaId: Int!`, `limite: Int`.

6) etiquetasCoocurrentes(etiquetaId!, limite?) — Autor: Jeremy Vera
- Descripción: Etiquetas que co-ocurren con la etiqueta base en reportes y comentarios.
- Args: `etiquetaId: Int!`, `limite: Int`.

7) tendenciasComentariosPorSemana(desde?, hasta?) — Autor: Cinthia Zambrano
- Descripción: Tendencia por semana ISO (YYYY-Www) de comentarios.
- Args: `desde: String`, `hasta: String` (ISO, opcionales).

8) reportesPorAreaYCategoria(areaId?, categoriaId?) — Autor: Cinthia Zambrano
- Descripción: Conteos agrupados por área y categoría con filtros opcionales.
- Args: `areaId: Int`, `categoriaId: Int`.

9) buscadorReportesAvanzado(filtro?, paginacion?) — Autor: Cinthia Zambrano
- Descripción: Búsqueda avanzada por texto, etiqueta y usuario, con paginación.
- Args: `filtro: BusquedaAvanzadaInput`, `paginacion: PaginacionInput`.

## Manejo de errores
`ServiceHttp` mapea errores del REST a excepciones GraphQL/Nest:
- 404 → `NotFoundException` (mensaje claro y detalles).
- 5xx → `InternalServerErrorException`.
- Fallos de red/timeout → `BadGatewayException`.
- Otros 4xx → `HttpException` con el status original.

## Entregables
- Código fuente: `practica5/graph` (gateway) y Taller 4 (REST) vigente.
- Schema GraphQL generado: `practica5/graph/src/schema.gql`.
- Colección de queries: `practica5/graph/docs/queries.graphql`.
- Evidencias (capturas + schema): `practica5/imagenes/`.

## División de trabajo y planificación
- Carlos Delgado: 3 queries de información agregada (1–3).
- Jeremy Vera: 3 queries de análisis/métricas (4–6).
- Cinthia Zambrano: 3 queries de búsqueda/filtrado (7–9).

Acta breve: Se acordó usar code‑first, Apollo Sandbox y `baseURL` común para REST. Se definieron tipos compartidos, se evitó duplicidad y se distribuyeron 3 queries por integrante. Se validó el schema y se capturaron evidencias en `imagenes/`.

## Notas
- Parte de los filtros se resuelven en el Gateway para demostrar la capa de agregación; se podrían llevar al REST si se desea.
- Puerto: REST 3000, GraphQL 3001 (configurable con `PORT`).

