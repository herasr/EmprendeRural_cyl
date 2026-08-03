import { Municipality, SectorId } from "../types";

export const MUNICIPALITIES: Municipality[] = [
  // --- ZAMORA ---
  {
    id: "fermoselle",
    name: "Fermoselle",
    province: "Zamora",
    population: 1150,
    populationGrowth5Y: -3.8,
    avgAge: 56.4,
    age65PlusPct: 38.2,
    age25To55Pct: 31.0,
    activeBusinesses: {
      [SectorId.PANADERIA]: 1,
      [SectorId.TALLER]: 0,
      [SectorId.PELUQUERIA]: 1,
      [SectorId.TURISMO]: 14,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 300, // Fibra óptica instalada recientemente en capitales de comarca
    touristBeds: 180,
    distanceToCapital: 63,
    description: "La 'capital de los Arribes'. Villa medieval colgada sobre el cañón del Duero. Gran peso de viñedos y turismo rural."
  },
  {
    id: "puebla_sanabria",
    name: "Puebla de Sanabria",
    province: "Zamora",
    population: 1350,
    populationGrowth5Y: -0.8,
    avgAge: 49.2,
    age65PlusPct: 29.5,
    age25To55Pct: 37.8,
    activeBusinesses: {
      [SectorId.PANADERIA]: 3,
      [SectorId.TALLER]: 2,
      [SectorId.PELUQUERIA]: 2,
      [SectorId.TURISMO]: 28,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 600,
    touristBeds: 450,
    distanceToCapital: 110,
    description: "Conjunto Histórico-Artístico junto al Lago de Sanabria. Altísima concentración turística con demografía relativamente estable."
  },
  {
    id: "alcanices",
    name: "Alcañices",
    province: "Zamora",
    population: 1020,
    populationGrowth5Y: -4.5,
    avgAge: 54.1,
    age65PlusPct: 35.6,
    age25To55Pct: 32.2,
    activeBusinesses: {
      [SectorId.PANADERIA]: 1,
      [SectorId.TALLER]: 1,
      [SectorId.PELUQUERIA]: 1,
      [SectorId.TURISMO]: 4,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 100,
    touristBeds: 35,
    distanceToCapital: 60,
    description: "Villa fronteriza histórica con Portugal (comarca de Aliste). Zona ganadera profunda que sufre pérdida continuada de comercios locales."
  },
  {
    id: "toro",
    name: "Toro",
    province: "Zamora",
    population: 8400, // Más grande pero representativo para contrastar en la comarca
    populationGrowth5Y: -2.1,
    avgAge: 47.8,
    age65PlusPct: 26.1,
    age25To55Pct: 38.0,
    activeBusinesses: {
      [SectorId.PANADERIA]: 8,
      [SectorId.TALLER]: 11,
      [SectorId.PELUQUERIA]: 14,
      [SectorId.TURISMO]: 12,
      [SectorId.COWORKING]: 1
    },
    connectivitySpeed: 1000,
    touristBeds: 320,
    distanceToCapital: 32,
    description: "Ciudad monumental de gran relevancia histórica y vitivinícola (D.O. Toro). Buen equipamiento pero demanda retenida en el entorno periférico rural."
  },

  // --- SORIA ---
  {
    id: "el_burgo_osma",
    name: "El Burgo de Osma",
    province: "Soria",
    population: 5020,
    populationGrowth5Y: 0.4,
    avgAge: 46.5,
    age65PlusPct: 24.8,
    age25To55Pct: 39.5,
    activeBusinesses: {
      [SectorId.PANADERIA]: 4,
      [SectorId.TALLER]: 6,
      [SectorId.PELUQUERIA]: 7,
      [SectorId.TURISMO]: 32,
      [SectorId.COWORKING]: 2
    },
    connectivitySpeed: 1000,
    touristBeds: 750,
    distanceToCapital: 58,
    description: "Villa episcopal monumental sobre el río Ucero, con pujanza industrial alimentaria y turística de primer orden en la provincia."
  },
  {
    id: "medinaceli",
    name: "Medinaceli",
    province: "Soria",
    population: 720,
    populationGrowth5Y: -1.2,
    avgAge: 51.8,
    age65PlusPct: 33.0,
    age25To55Pct: 34.0,
    activeBusinesses: {
      [SectorId.PANADERIA]: 0, // ¡Déficit real de panadería propia artesanal!
      [SectorId.TALLER]: 0,
      [SectorId.PELUQUERIA]: 1,
      [SectorId.TURISMO]: 15,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 300,
    touristBeds: 210,
    distanceToCapital: 75,
    description: "Histórico baluarte en un cerro sobre el valle del Jalón. Famoso por su arco romano. Gran atractivo, pero baja densidad de servicios cotidianos."
  },
  {
    id: "vinuesa",
    name: "Vinuesa",
    province: "Soria",
    population: 840,
    populationGrowth5Y: -2.9,
    avgAge: 50.5,
    age65PlusPct: 30.2,
    age25To55Pct: 35.1,
    activeBusinesses: {
      [SectorId.PANADERIA]: 1,
      [SectorId.TALLER]: 0,
      [SectorId.PELUQUERIA]: 1,
      [SectorId.TURISMO]: 22,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 100,
    touristBeds: 340,
    distanceToCapital: 35,
    description: "La 'Corte de los Pinos', al pie de los Picos de Urbión y la Laguna Negra. Atractivo paisajístico y forestal insuperable."
  },
  {
    id: "berlanga_duero",
    name: "Berlanga de Duero",
    province: "Soria",
    population: 860,
    populationGrowth5Y: -3.5,
    avgAge: 53.9,
    age65PlusPct: 34.8,
    age25To55Pct: 31.6,
    activeBusinesses: {
      [SectorId.PANADERIA]: 1,
      [SectorId.TALLER]: 1,
      [SectorId.PELUQUERIA]: 0, // ¡No hay peluquería en el núcleo principal!
      [SectorId.TURISMO]: 8,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 300,
    touristBeds: 110,
    distanceToCapital: 50,
    description: "Villa medieval dominada por un colosal castillo renacentista. Sector agrícola activo pero acentuada despoblación."
  },

  // --- BURGOS ---
  {
    id: "covarrubias",
    name: "Covarrubias",
    province: "Burgos",
    population: 530,
    populationGrowth5Y: -1.5,
    avgAge: 52.1,
    age65PlusPct: 31.4,
    age25To55Pct: 34.2,
    activeBusinesses: {
      [SectorId.PANADERIA]: 1,
      [SectorId.TALLER]: 0,
      [SectorId.PELUQUERIA]: 0,
      [SectorId.TURISMO]: 14,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 300,
    touristBeds: 190,
    distanceToCapital: 40,
    description: "Cuna de Castilla. Una joya de entramado de madera tradicional castellano. Turismo cultural elevado pero pocos servicios para jóvenes."
  },
  {
    id: "lerma",
    name: "Lerma",
    province: "Burgos",
    population: 2600,
    populationGrowth5Y: 0.8,
    avgAge: 45.1,
    age65PlusPct: 20.8,
    age25To55Pct: 41.2,
    activeBusinesses: {
      [SectorId.PANADERIA]: 3,
      [SectorId.TALLER]: 4,
      [SectorId.PELUQUERIA]: 5,
      [SectorId.TURISMO]: 18,
      [SectorId.COWORKING]: 1
    },
    connectivitySpeed: 1000,
    touristBeds: 400,
    distanceToCapital: 38,
    description: "Gran conjunto ducal de Lerma (Autovía A-1). Nudo estratégico de transporte, servicios muy dinámicos, potencial polo coworking por cercanía a Madrid."
  },
  {
    id: "espinosa_monteros",
    name: "Espinosa de los Monteros",
    province: "Burgos",
    population: 1650,
    populationGrowth5Y: -4.1,
    avgAge: 51.5,
    age65PlusPct: 29.8,
    age25To55Pct: 34.5,
    activeBusinesses: {
      [SectorId.PANADERIA]: 2,
      [SectorId.TALLER]: 1,
      [SectorId.PELUQUERIA]: 2,
      [SectorId.TURISMO]: 16,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 100,
    touristBeds: 250,
    distanceToCapital: 98,
    description: "En Las Merindades, alta montaña pasiega. Clima frío, gran tradición ganadera y repostería artesanal ('italianos' y quesadas)."
  },

  // --- LEON ---
  {
    id: "sahagun",
    name: "Sahagún",
    province: "León",
    population: 2450,
    populationGrowth5Y: -2.7,
    avgAge: 48.9,
    age65PlusPct: 26.5,
    age25To55Pct: 38.6,
    activeBusinesses: {
      [SectorId.PANADERIA]: 2,
      [SectorId.TALLER]: 3,
      [SectorId.PELUQUERIA]: 4,
      [SectorId.TURISMO]: 10,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 600,
    touristBeds: 210,
    distanceToCapital: 60,
    description: "Hito crucial del Camino de Santiago y joya del mudéjar leonés. Entorno agrícola de la meseta con comercio tradicional asentado."
  },
  {
    id: "cacabelos",
    name: "Cacabelos",
    province: "León",
    population: 4900,
    populationGrowth5Y: -0.9,
    avgAge: 46.2,
    age65PlusPct: 22.3,
    age25To55Pct: 41.5,
    activeBusinesses: {
      [SectorId.PANADERIA]: 4,
      [SectorId.TALLER]: 5,
      [SectorId.PELUQUERIA]: 8,
      [SectorId.TURISMO]: 11,
      [SectorId.COWORKING]: 1
    },
    connectivitySpeed: 1000,
    touristBeds: 180,
    distanceToCapital: 115,
    description: "Corazón del Bierzo vitivinícola (D.O. Bierzo). Muy dinámico agrícolamente e industrialmente, conectado por autovía A-6."
  },
  {
    id: "rianio",
    name: "Riaño",
    province: "León",
    population: 470,
    populationGrowth5Y: -1.8,
    avgAge: 53.1,
    age65PlusPct: 32.7,
    age25To55Pct: 33.0,
    activeBusinesses: {
      [SectorId.PANADERIA]: 1,
      [SectorId.TALLER]: 0,
      [SectorId.PELUQUERIA]: 0, // ¡No hay peluquería fija!
      [SectorId.TURISMO]: 19,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 100,
    touristBeds: 360,
    distanceToCapital: 95,
    description: "Precioso pueblo surgido del nuevo embalse, rodeado de espectaculares montañas (los 'Fiordos Leoneses'). Atractivo paisajístico rotundo."
  },

  // --- PALENCIA ---
  {
    id: "fromista",
    name: "Frómista",
    province: "Palencia",
    population: 750,
    populationGrowth5Y: -3.0,
    avgAge: 52.9,
    age65PlusPct: 33.5,
    age25To55Pct: 32.8,
    activeBusinesses: {
      [SectorId.PANADERIA]: 1,
      [SectorId.TALLER]: 1,
      [SectorId.PELUQUERIA]: 1,
      [SectorId.TURISMO]: 9,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 300,
    touristBeds: 140,
    distanceToCapital: 32,
    description: "Cruce de caminos entre el Camino de Santiago y el impresionante Canal de Castilla con sus famosas esclusas cuádruples."
  },
  {
    id: "aguilar_campoo",
    name: "Aguilar de Campoo",
    province: "Palencia",
    population: 6600,
    populationGrowth5Y: -1.1,
    avgAge: 47.1,
    age65PlusPct: 24.3,
    age25To55Pct: 39.2,
    activeBusinesses: {
      [SectorId.PANADERIA]: 5,
      [SectorId.TALLER]: 7,
      [SectorId.PELUQUERIA]: 9,
      [SectorId.TURISMO]: 15,
      [SectorId.COWORKING]: 2
    },
    connectivitySpeed: 1000,
    touristBeds: 280,
    distanceToCapital: 98,
    description: "Famosa villa galletera rodeada de la mayor concentración de románico del mundo. Dinamismo industrial apreciable en la montaña palentina."
  },
  {
    id: "cervera_pisuerga",
    name: "Cervera de Pisuerga",
    province: "Palencia",
    population: 2200,
    populationGrowth5Y: -2.5,
    avgAge: 49.8,
    age65PlusPct: 28.0,
    age25To55Pct: 36.4,
    activeBusinesses: {
      [SectorId.PANADERIA]: 2,
      [SectorId.TALLER]: 2,
      [SectorId.PELUQUERIA]: 3,
      [SectorId.TURISMO]: 24,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 300,
    touristBeds: 420,
    distanceToCapital: 112,
    description: "En el corazón del Parque Natural Fuentes Carrionas y Fuente Cobre. Turismo de naturaleza y clima húmedo."
  },

  // --- SALAMANCA ---
  {
    id: "ciudad_rodrigo",
    name: "Ciudad Rodrigo",
    province: "Salamanca",
    population: 11800, // Comarca clave para ver datos amplios
    populationGrowth5Y: -1.9,
    avgAge: 46.8,
    age65PlusPct: 23.9,
    age25To55Pct: 40.1,
    activeBusinesses: {
      [SectorId.PANADERIA]: 11,
      [SectorId.TALLER]: 14,
      [SectorId.PELUQUERIA]: 18,
      [SectorId.TURISMO]: 45,
      [SectorId.COWORKING]: 3
    },
    connectivitySpeed: 1000,
    touristBeds: 1100,
    distanceToCapital: 86,
    description: "Espectacular ciudad fortificada fronteriza de primer orden. Centro prestador de servicios a decenas de pequeños pueblos baldíos."
  },
  {
    id: "alberca",
    name: "La Alberca",
    province: "Salamanca",
    population: 1100,
    populationGrowth5Y: 1.2, // ¡Gana población ligeramente gracias al turismo masivo y artesanía!
    avgAge: 47.5,
    age65PlusPct: 25.1,
    age25To55Pct: 38.4,
    activeBusinesses: {
      [SectorId.PANADERIA]: 3,
      [SectorId.TALLER]: 0, // ¡No hay taller de coches! Tienen que viajar 20 km.
      [SectorId.PELUQUERIA]: 1,
      [SectorId.TURISMO]: 38,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 300,
    touristBeds: 620,
    distanceToCapital: 76,
    description: "Primer pueblo declarado Conjunto Histórico en España (1940). Caserío típico serrano impecable en plena Sierra de Francia."
  },
  {
    id: "ledesma",
    name: "Ledesma",
    province: "Salamanca",
    population: 1540,
    populationGrowth5Y: -3.2,
    avgAge: 51.2,
    age65PlusPct: 31.8,
    age25To55Pct: 34.1,
    activeBusinesses: {
      [SectorId.PANADERIA]: 1,
      [SectorId.TALLER]: 2,
      [SectorId.PELUQUERIA]: 2,
      [SectorId.TURISMO]: 8,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 300,
    touristBeds: 90,
    distanceToCapital: 35,
    description: "Fortaleza junto al río Tormes. Tierra granítica de encinas y berrocales con fuerte arraigo agroganadero de dehesa."
  },

  // --- SEGOVIA ---
  {
    id: "pedraza",
    name: "Pedraza",
    province: "Segovia",
    population: 340,
    populationGrowth5Y: -1.0,
    avgAge: 54.5,
    age65PlusPct: 33.6,
    age25To55Pct: 35.0,
    activeBusinesses: {
      [SectorId.PANADERIA]: 0, // ¡No hay panadería tradicional interior en activo de uso diario!
      [SectorId.TALLER]: 0,
      [SectorId.PELUQUERIA]: 0,
      [SectorId.TURISMO]: 12,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 100,
    touristBeds: 140,
    distanceToCapital: 37,
    description: "Exquisita villa amurallada conocida por su Concierto de las Velas y cordero asado. Exclusivo, alto poder adquisitivo pero escaso equipamiento utilitario."
  },
  {
    id: "sepulveda",
    name: "Sepúlveda",
    province: "Segovia",
    population: 1010,
    populationGrowth5Y: -2.8,
    avgAge: 50.8,
    age65PlusPct: 30.1,
    age25To55Pct: 35.5,
    activeBusinesses: {
      [SectorId.PANADERIA]: 1,
      [SectorId.TALLER]: 1,
      [SectorId.PELUQUERIA]: 1,
      [SectorId.TURISMO]: 25,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 300,
    touristBeds: 310,
    distanceToCapital: 55,
    description: "Villa medieval que custodia las espectaculares Hoces del Río Duratón. Altísima relevancia turística e histórica."
  },
  {
    id: "riaza",
    name: "Riaza",
    province: "Segovia",
    population: 2100,
    populationGrowth5Y: 0.5,
    avgAge: 46.5,
    age65PlusPct: 21.4,
    age25To55Pct: 40.8,
    activeBusinesses: {
      [SectorId.PANADERIA]: 2,
      [SectorId.TALLER]: 1,
      [SectorId.PELUQUERIA]: 3,
      [SectorId.TURISMO]: 18,
      [SectorId.COWORKING]: 1
    },
    connectivitySpeed: 600,
    touristBeds: 240,
    distanceToCapital: 73,
    description: "Pintoresca plaza mayor con gradas de madera. Muy concurrida en verano y fines de semana por la proximidad a pistas de esquí."
  },

  // --- AVILA ---
  {
    id: "candeleda",
    name: "Candeleda",
    province: "Ávila",
    population: 5010,
    populationGrowth5Y: 1.5, // Gana población, microclima cálido en el sur de Gredos, segunda residencia activa
    avgAge: 46.1,
    age65PlusPct: 22.8,
    age25To55Pct: 40.5,
    activeBusinesses: {
      [SectorId.PANADERIA]: 4,
      [SectorId.TALLER]: 3,
      [SectorId.PELUQUERIA]: 5,
      [SectorId.TURISMO]: 26,
      [SectorId.COWORKING]: 1
    },
    connectivitySpeed: 600,
    touristBeds: 480,
    distanceToCapital: 102,
    description: "La Andalucía de Ávila. Paisaje frondoso en la ladera sur de la Sierra de Gredos, alta agricultura alternativa e ingresos turísticos."
  },
  {
    id: "el_arenal",
    name: "El Arenal",
    province: "Ávila",
    population: 940,
    populationGrowth5Y: -2.3,
    avgAge: 53.6,
    age65PlusPct: 34.1,
    age25To55Pct: 32.7,
    activeBusinesses: {
      [SectorId.PANADERIA]: 1,
      [SectorId.TALLER]: 0,
      [SectorId.PELUQUERIA]: 1,
      [SectorId.TURISMO]: 15,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 100,
    touristBeds: 120,
    distanceToCapital: 72,
    description: "Pueblo de montaña rodeado de densos bosques de castaños y cerezos en pleno corazón del Parque Regional de Sierra de Gredos."
  },
  {
    id: "barco_avila",
    name: "El Barco de Ávila",
    province: "Ávila",
    population: 2300,
    populationGrowth5Y: -1.7,
    avgAge: 48.5,
    age65PlusPct: 25.4,
    age25To55Pct: 38.2,
    activeBusinesses: {
      [SectorId.PANADERIA]: 2,
      [SectorId.TALLER]: 2,
      [SectorId.PELUQUERIA]: 3,
      [SectorId.TURISMO]: 20,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 300,
    touristBeds: 350,
    distanceToCapital: 80,
    description: "Histórico paso defensivo sobre el río Tormes. Famoso por su judía con indicación geográfica protegida y su imponente castillo."
  },

  // --- VALLADOLID ---
  {
    id: "uruenia",
    name: "Urueña",
    province: "Valladolid",
    population: 190,
    populationGrowth5Y: -0.5,
    avgAge: 55.2,
    age65PlusPct: 36.8,
    age25To55Pct: 33.1,
    activeBusinesses: {
      [SectorId.PANADERIA]: 0, // Compra ambulante. No hay panadería propia en activo.
      [SectorId.TALLER]: 0,
      [SectorId.PELUQUERIA]: 0,
      [SectorId.TURISMO]: 7,
      [SectorId.COWORKING]: 0
    },
    connectivitySpeed: 100, // Hay fibra básica pero cobertura débil
    touristBeds: 95,
    distanceToCapital: 52,
    description: "La 'Villa del Libro'. Espectacular recinto amurallado con un castillo de frontera que alberga más librerías que tabernas cotidianas."
  },
  {
    id: "tordesillas",
    name: "Tordesillas",
    province: "Valladolid",
    population: 8700,
    populationGrowth5Y: -1.0,
    avgAge: 45.4,
    age65PlusPct: 20.2,
    age25To55Pct: 42.1,
    activeBusinesses: {
      [SectorId.PANADERIA]: 9,
      [SectorId.TALLER]: 12,
      [SectorId.PELUQUERIA]: 15,
      [SectorId.TURISMO]: 18,
      [SectorId.COWORKING]: 2
    },
    connectivitySpeed: 1000,
    touristBeds: 510,
    distanceToCapital: 30,
    description: "Crucial nudo de comunicaciones regionales e históricas (Tratado de Tordesillas, 1494). Gran cantidad de comercios competitivos."
  },
  {
    id: "penafiel",
    name: "Peñafiel",
    province: "Valladolid",
    population: 5050,
    populationGrowth5Y: -0.2,
    avgAge: 46.0,
    age65PlusPct: 21.8,
    age25To55Pct: 40.5,
    activeBusinesses: {
      [SectorId.PANADERIA]: 5,
      [SectorId.TALLER]: 8,
      [SectorId.PELUQUERIA]: 8,
      [SectorId.TURISMO]: 24,
      [SectorId.COWORKING]: 1
    },
    connectivitySpeed: 1000,
    touristBeds: 360,
    distanceToCapital: 56,
    description: "Corazón de la Ribera del Duero en Valladolid. Su castillo-buque alberga el Museo Provincial del Vino. Sector hotelero de bodegas potente."
  }
];
