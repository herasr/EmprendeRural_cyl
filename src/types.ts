/**
 * Tipos de datos para EmprendeRural CyL
 * Plataforma para la detección de oportunidades de emprendimiento rural
 * Concurso de Datos Abiertos de Castilla y León - IX Edición
 */

/** Identificadores de los sectores económicos analizados (CNAE) */
export enum SectorId {
  PANADERIA = "panaderia",
  TALLER = "taller",
  PELUQUERIA = "peluqueria",
  TURISMO = "turismo",
  COWORKING = "coworking"
}

/** Definición de un sector económico con sus ponderaciones metodológicas del IOE */
export interface Sector {
  id: SectorId;
  name: string;
  description: string;
  iconName: string;
  weights: {
    v1_demanda: number;       // V1: Demanda potencial (Población ajustada por estructura)
    v2_deficit: number;       // V2: Déficit del servicio (Establecimientos por 1.000 hab)
    v3_competencia: number;   // V3: Competencia cercana (Establecimientos del sector)
    v4_demografia: number;    // V4: Evolución demográfica (Variación poblacional 5 años)
    v5_poblacion_obj: number; // V5: Población objetivo específica del sector
    v6_conectividad: number;  // V6: Conectividad (Cobertura y velocidad de banda ancha)
    v7_ayudas: number;        // V7: Disponibilidad de ayudas y subvenciones activas
    v8_turismo: number;       // V8: Entorno turístico (Plazas alojativas por habitante)
  };
  ageMin?: number;
  selectedAgeGroupLabel: string;
}

/** Información demográfica y socioeconómica de un municipio */
export interface Municipality {
  id: string;
  name: string;
  province: string;           // Ávila, Burgos, León, Palencia, Salamanca, Segovia, Soria, Valladolid, Zamora
  population: number;         // Población total
  populationGrowth5Y: number; // Variación poblacional en los últimos 5 años (porcentaje)
  avgAge: number;             // Edad media de la población
  age65PlusPct: number;       // Porcentaje de población mayor de 65 años
  age25To55Pct: number;       // Porcentaje de población en edad de trabajar (25-55 años)
  activeBusinesses: Record<SectorId, number>; // Número de negocios activos por sector
  connectivitySpeed: number;  // Velocidad media de conexión (Mbps)
  touristBeds: number;        // Plazas de alojamiento turístico disponibles
  distanceToCapital: number;  // Distancia a la capital de provincia o cabecera comarcal (km)
  description: string;        // Descripción general del municipio
}

/** Convocatoria de ayuda o subvención pública para emprendimiento rural */
export interface Grant {
  id: string;
  title: string;
  provider: string;           // Entidad convocante (Junta de Castilla y León, Fondo LEADER, etc.)
  description: string;
  subsidyAmount: string;      // Importe o porcentaje subvencionable
  compatibleSectors: SectorId[];
  scope: "provincial" | "regional" | "local";
  targetProvince?: string;    // Provincia específica (ej. Plan Soria)
  active: boolean;
}

/** Métricas calculadas para el Índice de Oportunidad Emprendedora (IOE) */
export interface IOEMetrics {
  v1_demanda: number;      // Puntuación 0-100 para Demanda Potencial
  v2_deficit: number;      // Puntuación 0-100 para Déficit del Servicio
  v3_competencia: number;  // Puntuación 0-100 para Competencia
  v4_demografia: number;   // Puntuación 0-100 para Evolución Demográfica
  v5_poblacion_obj: number;// Puntuación 0-100 para Población Objetivo
  v6_conectividad: number; // Puntuación 0-100 para Conectividad
  v7_ayudas: number;       // Puntuación 0-100 para Ayudas Disponibles
  v8_turismo: number;      // Puntuación 0-100 para Entorno Turístico
  score: number;           // Puntuación final ponderada (0-100)
  level: "Rojo" | "Naranja" | "Amarillo" | "Verde";
}

/** Métricas calculadas para el Índice de Necesidad Territorial (INT) */
export interface INTMetrics {
  u1_ausencia: number;     // U1: Ausencia del servicio (0-100)
  u2_distancia: number;    // U2: Distancia al servicio más cercano (0-100)
  u3_poblacion_af: number; // U3: Población afectada sin servicio (0-100)
  u4_envejecimiento: number; // U4: Envejecimiento y vulnerabilidad (0-100)
  u5_aislamiento: number;  // U5: Aislamiento territorial (0-100)
  score: number;           // Puntuación final ponderada (0-100)
  level: "Bajo" | "Medio" | "Alto" | "Muy Alto";
}

/** Métricas calculadas para el Índice de Impacto Social (IIS) */
export interface IISMetrics {
  s1_beneficiados: number; // S1: Población directamente beneficiada (0-100)
  s2_desplazamiento: number; // S2: Reducción de desplazamientos (0-100)
  s3_vulnerables: number;  // S3: Beneficio a colectivos vulnerables (0-100)
  s4_empleo: number;       // S4: Empleo local estimado (0-100)
  s5_cohesion: number;     // S5: Cohesión territorial y fijación de población (0-100)
  score: number;           // Puntuación final ponderada (0-100)
  level: "Bajo" | "Medio" | "Alto" | "Muy Alto";
}

