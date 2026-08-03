import { Municipality, Sector, SectorId, IOEMetrics, INTMetrics, IISMetrics, Grant } from "../types";
import { GRANTS } from "../data/grants";

/**
 * Escala un valor numérico al rango 0-100 basándose en los límites mínimo y máximo.
 * @param valor - Valor real a normalizar
 * @param min - Límite inferior de la muestra
 * @param max - Límite superior de la muestra
 * @param invertir - Si es true, invierte el resultado (a menor valor real, mayor puntuación)
 */
function normalizar(valor: number, min: number, max: number, invertir = false): number {
  if (max === min) return 50;
  const proporcion = (valor - min) / (max - min);
  const puntuacion = Math.max(0, Math.min(100, proporcion * 100));
  return invertir ? 100 - puntuacion : puntuacion;
}

/**
 * Calcula el Índice de Oportunidad Emprendedora (IOE) para un municipio y sector específicos.
 * Metodología oficial (Sección 10):
 * IOE = w1·V1 + w2·V2 + w3·V3 + w4·V4 + w5·V5 + w6·V6 + w7·V7 + w8·V8
 */
export function calculateIOE(
  municipio: Municipality,
  sector: Sector,
  todosMunicipios: Municipality[]
): IOEMetrics {
  // Muestras globales para normalización relativa
  const demografiaPoblaciones = todosMunicipios.map(m => m.population / m.avgAge);

  // V1: Demanda Potencial (Población total ajustada por la edad media del municipio)
  const demandaRaw = municipio.population / municipio.avgAge;
  const minV1 = Math.min(...demografiaPoblaciones);
  const maxV1 = Math.max(...demografiaPoblaciones);
  const v1_demanda = normalizar(demandaRaw, minV1, maxV1);

  // V2: Déficit del Servicio (Establecimientos del sector por cada 1.000 habitantes)
  const ratiosDeficit = todosMunicipios.map(m => (m.activeBusinesses[sector.id] * 1000) / m.population);
  const deficitRaw = (municipio.activeBusinesses[sector.id] * 1000) / municipio.population;
  const minV2 = Math.min(...ratiosDeficit);
  const maxV2 = Math.max(...ratiosDeficit);
  // Se invierte: a menor presencia de competidores por habitante, mayor oportunidad por déficit
  const v2_deficit = normalizar(deficitRaw, minV2, maxV2, true);

  // V3: Competencia Cercana (Número absoluto de establecimientos existentes)
  const competidores = municipio.activeBusinesses[sector.id];
  let v3_competencia = 100;
  if (competidores === 1) v3_competencia = 70;
  else if (competidores === 2) v3_competencia = 45;
  else if (competidores > 2) v3_competencia = Math.max(10, 100 - competidores * 12);

  // V4: Evolución Demográfica (Tasa de variación poblacional a 5 años)
  const variacionesDemograficas = todosMunicipios.map(m => m.populationGrowth5Y);
  const demografiaRaw = municipio.populationGrowth5Y;
  const minV4 = Math.min(...variacionesDemograficas);
  const maxV4 = Math.max(...variacionesDemograficas);
  const v4_demografia = normalizar(demografiaRaw, minV4, maxV4);

  // V5: Población Objetivo (Tramo demográfico clave según el sector elegido)
  let pobObjetivoRaw = 35.0;
  if (sector.id === SectorId.PELUQUERIA) {
    pobObjetivoRaw = municipio.age65PlusPct; // Público sénior
  } else if (sector.id === SectorId.COWORKING) {
    pobObjetivoRaw = municipio.age25To55Pct; // Población activa / teletrabajadores
  } else {
    pobObjetivoRaw = 100 - municipio.age65PlusPct; // Población joven y adulta general
  }

  const muestrasPoblacionObj = todosMunicipios.map(m => {
    if (sector.id === SectorId.PELUQUERIA) return m.age65PlusPct;
    if (sector.id === SectorId.COWORKING) return m.age25To55Pct;
    return 100 - m.age65PlusPct;
  });
  const minV5 = Math.min(...muestrasPoblacionObj);
  const maxV5 = Math.max(...muestrasPoblacionObj);
  const v5_poblacion_obj = normalizar(pobObjetivoRaw, minV5, maxV5);

  // V6: Conectividad Digital (Velocidad de banda ancha disponible)
  const velocidadesConexion = todosMunicipios.map(m => m.connectivitySpeed);
  const velocidadRaw = municipio.connectivitySpeed;
  const minV6 = Math.min(...velocidadesConexion);
  const maxV6 = Math.max(...velocidadesConexion);
  const v6_conectividad = normalizar(velocidadRaw, minV6, maxV6);

  // V7: Ayudas Disponibles (Volumen de convocatorias públicas compatibles)
  const ayudasCompatibles = getCompatibleGrantsForTown(municipio, sector.id);
  const numAyudas = ayudasCompatibles.length;
  let v7_ayudas = 20;
  if (numAyudas === 1) v7_ayudas = 55;
  else if (numAyudas === 2) v7_ayudas = 85;
  else if (numAyudas >= 3) v7_ayudas = 100;

  // V8: Entorno Turístico (Ratio de plazas de alojamiento por habitante)
  const ratiosTurismo = todosMunicipios.map(m => m.touristBeds / m.population);
  const turismoRaw = municipio.touristBeds / municipio.population;
  const minV8 = Math.min(...ratiosTurismo);
  const maxV8 = Math.max(...ratiosTurismo);
  const v8_turismo = normalizar(turismoRaw, minV8, maxV8);

  // Cálculo de la suma ponderada del sector
  const pesos = sector.weights;
  const sumaPonderada =
    v1_demanda * pesos.v1_demanda +
    v2_deficit * pesos.v2_deficit +
    v3_competencia * pesos.v3_competencia +
    v4_demografia * pesos.v4_demografia +
    v5_poblacion_obj * pesos.v5_poblacion_obj +
    v6_conectividad * pesos.v6_conectividad +
    v7_ayudas * pesos.v7_ayudas +
    v8_turismo * pesos.v8_turismo;

  const score = Math.round(sumaPonderada);

  // Categorización semafórica por rangos de oportunidad
  let level: "Rojo" | "Naranja" | "Amarillo" | "Verde" = "Naranja";
  if (score <= 25) level = "Rojo";
  else if (score <= 50) level = "Naranja";
  else if (score <= 75) level = "Amarillo";
  else level = "Verde";

  return {
    v1_demanda: Math.round(v1_demanda),
    v2_deficit: Math.round(v2_deficit),
    v3_competencia: Math.round(v3_competencia),
    v4_demografia: Math.round(v4_demografia),
    v5_poblacion_obj: Math.round(v5_poblacion_obj),
    v6_conectividad: Math.round(v6_conectividad),
    v7_ayudas: Math.round(v7_ayudas),
    v8_turismo: Math.round(v8_turismo),
    score,
    level
  };
}

/**
 * Calcula el Índice de Necesidad Territorial (INT)
 * Metodología oficial (Sección 11):
 * INT = 0.30·U1 + 0.25·U2 + 0.20·U3 + 0.15·U4 + 0.10·U5
 */
export function calculateINT(
  municipio: Municipality,
  sector: Sector,
  todosMunicipios: Municipality[]
): INTMetrics {
  const competidores = municipio.activeBusinesses[sector.id];
  
  // U1: Ausencia del servicio en la localidad
  const u1_ausencia = competidores === 0 ? 100 : competidores === 1 ? 40 : 10;

  // U2: Distancia geográfica a la cabecera / servicio más cercano
  const distancias = todosMunicipios.map(m => m.distanceToCapital);
  const u2_distancia = Math.round(normalizar(municipio.distanceToCapital, Math.min(...distancias), Math.max(...distancias)));

  // U3: Población afectada sin cobertura directa
  const poblaciones = todosMunicipios.map(m => m.population);
  const u3_poblacion_af = Math.round(normalizar(municipio.population, Math.min(...poblaciones), Math.max(...poblaciones)));

  // U4: Índice de envejecimiento y vulnerabilidad social
  const porcentajesMayor65 = todosMunicipios.map(m => m.age65PlusPct);
  const u4_envejecimiento = Math.round(normalizar(municipio.age65PlusPct, Math.min(...porcentajesMayor65), Math.max(...porcentajesMayor65)));

  // U5: Aislamiento territorial
  const u5_aislamiento = Math.round(normalizar(municipio.distanceToCapital, 5, 80));

  const sumaPonderada =
    0.30 * u1_ausencia +
    0.25 * u2_distancia +
    0.20 * u3_poblacion_af +
    0.15 * u4_envejecimiento +
    0.10 * u5_aislamiento;

  const score = Math.round(sumaPonderada);

  let level: "Bajo" | "Medio" | "Alto" | "Muy Alto" = "Medio";
  if (score < 40) level = "Bajo";
  else if (score < 60) level = "Medio";
  else if (score < 80) level = "Alto";
  else level = "Muy Alto";

  return {
    u1_ausencia,
    u2_distancia,
    u3_poblacion_af,
    u4_envejecimiento,
    u5_aislamiento,
    score,
    level
  };
}

/**
 * Calcula el Índice de Impacto Social (IIS)
 * Metodología oficial (Sección 12):
 * IIS = 0.25·S1 + 0.20·S2 + 0.25·S3 + 0.15·S4 + 0.15·S5
 */
export function calculateIIS(
  municipio: Municipality,
  sector: Sector,
  todosMunicipios: Municipality[]
): IISMetrics {
  const intMetrics = calculateINT(municipio, sector, todosMunicipios);

  // S1: Población directamente beneficiada
  const poblaciones = todosMunicipios.map(m => m.population);
  const s1_beneficiados = Math.round(normalizar(municipio.population, Math.min(...poblaciones), Math.max(...poblaciones)));

  // S2: Reducción de desplazamientos (vinculado a la distancia evitada)
  const s2_desplazamiento = intMetrics.u2_distancia;

  // S3: Beneficio a colectivos vulnerables (foco en personas mayores e insulares)
  const s3_vulnerables = intMetrics.u4_envejecimiento;

  // S4: Estimación de empleo local directo e indirecto generado
  let s4_empleo = 65;
  if (sector.id === SectorId.PANADERIA || sector.id === SectorId.TALLER) s4_empleo = 85;
  else if (sector.id === SectorId.TURISMO) s4_empleo = 75;

  // S5: Cohesión territorial (fijación de población activa en municipios <1.000 hab)
  const s5_cohesion = municipio.population < 1000 ? 90 : 60;

  const sumaPonderada =
    0.25 * s1_beneficiados +
    0.20 * s2_desplazamiento +
    0.25 * s3_vulnerables +
    0.15 * s4_empleo +
    0.15 * s5_cohesion;

  const score = Math.round(sumaPonderada);

  let level: "Bajo" | "Medio" | "Alto" | "Muy Alto" = "Medio";
  if (score < 40) level = "Bajo";
  else if (score < 60) level = "Medio";
  else if (score < 80) level = "Alto";
  else level = "Muy Alto";

  return {
    s1_beneficiados,
    s2_desplazamiento,
    s3_vulnerables,
    s4_empleo,
    s5_cohesion,
    score,
    level
  };
}

/**
 * Obtiene las convocatorias públicas de ayudas compatibles para un municipio y sector dado.
 */
export function getCompatibleGrantsForTown(municipio: Municipality, sectorId: SectorId): Grant[] {
  return GRANTS.filter(ayuda => {
    if (!ayuda.active || !ayuda.compatibleSectors.includes(sectorId)) return false;
    
    // Filtrado geográfico si la ayuda es provincial (ej. Plan Soria)
    if (ayuda.scope === "provincial" && ayuda.targetProvince) {
      return municipio.province.toLowerCase() === ayuda.targetProvince.toLowerCase();
    }
    
    return true;
  });
}

