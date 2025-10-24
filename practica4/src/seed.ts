/*
  Script de seed para práctica4.
  Ejecuta: npm run seed
  Requiere: API REST corriendo en http://localhost:3000/api/v1
*/

const BASE = 'http://localhost:3000/api/v1';

async function http(method: string, path: string, body?: any) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.warn(`${method} ${path} -> ${res.status} ${res.statusText} ${text}`);
  }
  try { return await res.json(); } catch { return undefined; }
}

async function post(path: string, body: any) { return http('POST', path, body); }
async function get(path: string) { return http('GET', path); }

function pickIds(items: any[]) { return (items || []).map((x: any) => x.id).filter(Boolean); }

async function ensureNonEmpty(path: string, seedItems: any[]) {
  const existing = await get(path);
  if (Array.isArray(existing) && existing.length > 0) return existing;
  const created: any[] = [];
  for (const item of seedItems) {
    const r = await post(path, item);
    if (r) created.push(r);
  }
  return created;
}

async function main() {
  console.log('⏳ Iniciando seed práctica4...');

  // 1) Roles
  const roles = await ensureNonEmpty('/roles', [
    { nombre: 'Admin' },
    { nombre: 'Usuario' },
  ]);
  const [rolAdminId, rolUsuarioId] = pickIds(roles);

  // 2) Usuarios
  const usuarios = await ensureNonEmpty('/usuarios', [
    { nombre: 'Ana Admin', email: 'ana@demo.com', contrasenia: '123456', rolId: rolAdminId },
    { nombre: 'Bruno User', email: 'bruno@demo.com', contrasenia: '123456', rolId: rolUsuarioId },
    { nombre: 'Caro User', email: 'caro@demo.com', contrasenia: '123456', rolId: rolUsuarioId },
  ]);
  const [anaId, brunoId, caroId] = pickIds(usuarios);

  // 3) Catálogos
  const categorias = await ensureNonEmpty('/categorias', [
    { nombre: 'Iluminación', descripcion: 'Problemas de alumbrado' },
    { nombre: 'Limpieza', descripcion: 'Desechos, barrido, contenedores' },
    { nombre: 'Vialidad', descripcion: 'Calles, baches, semáforos' },
  ]);
  const areas = await ensureNonEmpty('/areas', [
    { nombre: 'Mantenimiento', responsable: 'Ing. Pérez' },
    { nombre: 'Servicios Públicos', responsable: 'Lic. Gómez' },
    { nombre: 'Seguridad', responsable: 'Of. Ramírez' },
  ]);
  const estados = await ensureNonEmpty('/estados', [
    { nombre: 'Nuevo', color: 'gray', orden: 1 },
    { nombre: 'En proceso', color: 'blue', orden: 2 },
    { nombre: 'Resuelto', color: 'green', orden: 3, es_final: true },
  ]);
  const etiquetas = await ensureNonEmpty('/etiquetas', [
    { nombre: 'urgente', color: 'red' },
    { nombre: 'prioridad-media', color: 'orange' },
    { nombre: 'vecinal', color: 'purple' },
    { nombre: 'alumbrado' },
    { nombre: 'limpieza' },
  ]);

  const [catIlum, catLimp, catVial] = pickIds(categorias);
  const [areaMant, areaServ, areaSeg] = pickIds(areas);
  const [estNuevo, estProceso, estResuelto] = pickIds(estados);
  const [tagUrg, tagPM, tagVec, tagAlum, tagLimp] = pickIds(etiquetas);

  // 4) Reportes
  const reportes = await ensureNonEmpty('/reportes', [
    {
      titulo: 'Farola apagada en parque', descripcion: 'Farola sin luz en la entrada norte',
      categoriaId: catIlum, areaId: areaMant, estadoId: estNuevo, usuarioId: brunoId,
      etiquetasIds: [tagAlum, tagVec]
    },
    {
      titulo: 'Bache en calle central', descripcion: 'Bache profundo frente al 123',
      categoriaId: catVial, areaId: areaServ, estadoId: estProceso, usuarioId: caroId,
      etiquetasIds: [tagUrg]
    },
    {
      titulo: 'Contenedor desbordado', descripcion: 'Contenedor lleno desde hace 3 días',
      categoriaId: catLimp, areaId: areaServ, estadoId: estNuevo, usuarioId: brunoId,
      etiquetasIds: [tagLimp, tagPM]
    }
  ]);
  const [rep1, rep2, rep3] = pickIds(reportes);

  // 5) Comentarios
  await ensureNonEmpty('/comentarios', [
    { reporteId: rep1, contenido: 'Por favor revisar hoy si es posible', usuarioId: anaId },
    { reporteId: rep1, contenido: 'Ya pasé por la noche y sigue apagada', usuarioId: brunoId },
    { reporteId: rep2, contenido: 'Se colocó señalización provisoria', usuarioId: anaId },
    { reporteId: rep3, contenido: 'Se programó retiro para mañana', usuarioId: caroId },
  ]);

  // 6) Puntuaciones
  await ensureNonEmpty('/puntuaciones', [
    { reporteId: rep1, valor: 5, usuarioId: brunoId, comentario: 'Gracias por atender' },
    { reporteId: rep1, valor: 4, usuarioId: caroId },
    { reporteId: rep2, valor: 3, usuarioId: brunoId },
    { reporteId: rep3, valor: 2, usuarioId: caroId },
  ]);

  // 7) Archivos adjuntos
  await ensureNonEmpty('/archivos', [
    { reporteId: rep1, nombre: 'farola.jpg', ruta: 'https://example.com/farola.jpg', mimeType: 'image/jpeg', tamanoBytes: 123456 },
    { reporteId: rep2, nombre: 'bache.png', ruta: 'https://example.com/bache.png', mimeType: 'image/png', tamanoBytes: 234567 },
  ]);

  console.log('✅ Seed completado. Ahora puedes probar en el gateway GraphQL.');
}

main().catch(err => {
  console.error('Seed falló:', err);
  process.exit(1);
});
