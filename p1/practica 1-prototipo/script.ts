// Declaración de Leaflet para TypeScript cuando se carga vía <script> en el HTML
declare const L: any;

interface Lugar {
  nombre: string;
  descripcion: string;
  lat: number;
  lon: number;
  restaurantes: string[];
  hoteles: string[];
}

const lugares: Lugar[] = [
  {
    nombre: "Playa El Murciélago",
    descripcion: "La playa más importante de la ciudad, céntrica y con muchas actividades náuticas, tiendas y restaurantes cerca.",
  lat: -0.959, // aproximado
  lon: -80.721,
    restaurantes: ["Restaurante Pata Salada", "Restaurante Martinica", "El Faro"],
    hoteles: ["Hotel Oro Verde Manta", "Hotel Wyndham Manta Sail Plaza"]
  },
  {
    nombre: "Playa Santa Marianita",
    descripcion: "Ideal para el kitesurf, hermosos atardeceres y ambiente costero relajado.",
    lat: -0.9295,
    lon: -80.5476,
    restaurantes: ["La Casa del Marisco", "Kite Surf Lounge"],
    hoteles: ["Hostería Santa Marianita"]
  },
  {
    nombre: "Playa San Lorenzo",
    descripcion: "Zona más apartada y tranquila, naturaleza, senderos y aire fresco.",
  lat: -0.877,
  lon: -80.705,
    restaurantes: ["Rustico San Lorenzo", "La Cevichería de San Lorenzo"],
    hoteles: ["Eco Lodge San Lorenzo"]
  },
  {
    nombre: "Ligüiqui",
    descripcion: "Playa con historia, charcos naturales, entorno rural con encanto costero.",
  lat: -0.876,
  lon: -80.548,
    restaurantes: ["Restaurante Ligüiqui", "Marisquería Ligüiqui"],
    hoteles: ["Lodge Ligüiqui"]
  }
];

function mostrarLugar(index: number) {
  // Validación de índice
  if (index < 0 || index >= lugares.length) {
    console.error(`Índice fuera de rango: ${index}`);
    return;
  }

  const lugar = lugares[index];

  // Panel de detalle
  const detalle = document.getElementById("detalleLugar");
  if (!detalle) {
    console.warn('Elemento "detalleLugar" no encontrado');
    return;
  }
  detalle.classList.remove("oculto");

  const nombreEl = document.getElementById("nombreLugar");
  if (nombreEl) nombreEl.textContent = lugar.nombre;

  const descripcionEl = document.getElementById("descripcionLugar");
  if (descripcionEl) descripcionEl.textContent = lugar.descripcion;

  // Inicializar mapa si existe el contenedor
  const mapaDiv = document.getElementById("mapa");
  if (mapaDiv) {
    mapaDiv.innerHTML = ""; // limpiar si había algo

    const map = L.map('mapa').setView([lugar.lat, lugar.lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // marcador del lugar
    L.marker([lugar.lat, lugar.lon]).addTo(map)
      .bindPopup(lugar.nombre)
      .openPopup();
  }

  // Restaurantes
  const listaRest = document.getElementById("listaRestaurantes");
  if (listaRest) {
    listaRest.innerHTML = "";
    for (const r of lugar.restaurantes) {
      listaRest.innerHTML += `<li>${r}</li>`;
    }
  }

  // Hoteles
  const listaHot = document.getElementById("listaHoteles");
  if (listaHot) {
    listaHot.innerHTML = "";
    for (const h of lugar.hoteles) {
      listaHot.innerHTML += `<li>${h}</li>`;
    }
  }
}

(globalThis as any).mostrarLugar = mostrarLugar;
