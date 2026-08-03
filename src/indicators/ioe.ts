/**
 * Motor Determinista de Cálculo del IOE, INT e IIS
 * EmprendeRural CyL
 */

import { Municipality, Sector, IOEMetrics, INTMetrics, IISMetrics } from "../types";
import { minMaxNormalize, sanitizeScore } from "./normalization";

export function calculateIOE(
  municipality: Municipality,
  sector: Sector,
  allMunicipalities: Municipality[]
): IOEMetrics {
  const maxPop = Math.max(...allMunicipalities.map(m => m.population), 1000);
  const maxBeds = Math.max(...allMunicipalities.map(m => m.touristBeds), 100);
  const maxDist = Math.max(...allMunicipalities.map(m => m.distanceToCapital), 50);

  // V1: Demanda Potencial
  const v1_demanda = minMaxNormalize(municipality.population, 50, Math.min(maxPop, 10000));

  // V2: Déficit del Servicio
  const activeCount = municipality.activeBusinesses[sector.id] || 0;
  const ratioPer1000 = (activeCount / Math.max(municipality.population, 1)) * 1000;
  const v2_deficit = minMaxNormalize(ratioPer1000, 0, 5, true);

  // V3: Competencia
  const v3_competencia = minMaxNormalize(activeCount, 0, 10, true);

  // V4: Evolución Demográfica
  const v4_demografia = minMaxNormalize(municipality.populationGrowth5Y, -10, 5);

  // V5: Población Objetivo
  let targetPct = municipality.age25To55Pct;
  if (sector.id === "peluqueria" || sector.id === "panaderia") {
    targetPct = municipality.age65PlusPct;
  }
  const v5_poblacion_obj = minMaxNormalize(targetPct, 10, 60);

  // V6: Conectividad
  const v6_conectividad = minMaxNormalize(municipality.connectivitySpeed, 10, 300);

  // V7: Ayudas Disponibles
  const v7_ayudas = municipality.population < 2000 ? 85 : 60;

  // V8: Entorno Turístico
  const v8_turismo = minMaxNormalize(municipality.touristBeds, 0, maxBeds);

  // Ponderación final segun matriz del sector
  const w = sector.weights;
  const rawScore =
    v1_demanda * w.v1_demanda +
    v2_deficit * w.v2_deficit +
    v3_competencia * w.v3_competencia +
    v4_demografia * w.v4_demografia +
    v5_poblacion_obj * w.v5_poblacion_obj +
    v6_conectividad * w.v6_conectividad +
    v7_ayudas * w.v7_ayudas +
    v8_turismo * w.v8_turismo;

  const score = sanitizeScore(rawScore);

  let level: "Rojo" | "Naranja" | "Amarillo" | "Verde" = "Amarillo";
  if (score >= 75) level = "Verde";
  else if (score >= 55) level = "Amarillo";
  else if (score >= 35) level = "Naranja";
  else level = "Rojo";

  return {
    v1_demanda: sanitizeScore(v1_demanda),
    v2_deficit: sanitizeScore(v2_deficit),
    v3_competencia: sanitizeScore(v3_competencia),
    v4_demografia: sanitizeScore(v4_demografia),
    v5_poblacion_obj: sanitizeScore(v5_poblacion_obj),
    v6_conectividad: sanitizeScore(v6_conectividad),
    v7_ayudas: sanitizeScore(v7_ayudas),
    v8_turismo: sanitizeScore(v8_turismo),
    score,
    level
  };
}

export function calculateINT(
  municipality: Municipality,
  sector: Sector,
  allMunicipalities: Municipality[]
): INTMetrics {
  const activeCount = municipality.activeBusinesses[sector.id] || 0;
  const maxDist = Math.max(...allMunicipalities.map(m => m.distanceToCapital), 50);

  const u1_ausencia = activeCount === 0 ? 100 : Math.max(0, 100 - activeCount * 25);
  const u2_distancia = minMaxNormalize(municipality.distanceToCapital, 0, maxDist);
  const u3_poblacion_af = minMaxNormalize(municipality.population, 50, 5000);
  const u4_envejecimiento = minMaxNormalize(municipality.age65PlusPct, 15, 60);
  const u5_aislamiento = minMaxNormalize(municipality.distanceToCapital * (municipality.age65PlusPct / 100), 0, 30);

  const rawScore =
    u1_ausencia * 0.35 +
    u2_distancia * 0.20 +
    u3_poblacion_af * 0.20 +
    u4_envejecimiento * 0.15 +
    u5_aislamiento * 0.10;

  const score = sanitizeScore(rawScore);

  let level: "Bajo" | "Medio" | "Alto" | "Muy Alto" = "Medio";
  if (score >= 75) level = "Muy Alto";
  else if (score >= 55) level = "Alto";
  else if (score >= 35) level = "Medio";
  else level = "Bajo";

  return {
    u1_ausencia: sanitizeScore(u1_ausencia),
    u2_distancia: sanitizeScore(u2_distancia),
    u3_poblacion_af: sanitizeScore(u3_poblacion_af),
    u4_envejecimiento: sanitizeScore(u4_envejecimiento),
    u5_aislamiento: sanitizeScore(u5_aislamiento),
    score,
    level
  };
}

export function calculateIIS(
  municipality: Municipality,
  sector: Sector,
  allMunicipalities: Municipality[]
): IISMetrics {
  const s1_beneficiados = minMaxNormalize(municipality.population, 50, 3000);
  const s2_desplazamiento = minMaxNormalize(municipality.distanceToCapital, 0, 60);
  const s3_vulnerables = minMaxNormalize(municipality.age65PlusPct, 15, 60);
  const s4_empleo = sector.id === "taller" || sector.id === "coworking" ? 80 : 60;
  const s5_cohesion = minMaxNormalize(municipality.populationGrowth5Y + 10, 0, 20);

  const rawScore =
    s1_beneficiados * 0.30 +
    s2_desplazamiento * 0.25 +
    s3_vulnerables * 0.20 +
    s4_empleo * 0.15 +
    s5_cohesion * 0.10;

  const score = sanitizeScore(rawScore);

  let level: "Bajo" | "Medio" | "Alto" | "Muy Alto" = "Medio";
  if (score >= 75) level = "Muy Alto";
  else if (score >= 55) level = "Alto";
  else if (score >= 35) level = "Medio";
  else level = "Bajo";

  return {
    s1_beneficiados: sanitizeScore(s1_beneficiados),
    s2_desplazamiento: sanitizeScore(s2_desplazamiento),
    s3_vulnerables: sanitizeScore(s3_vulnerables),
    s4_empleo: sanitizeScore(s4_empleo),
    s5_cohesion: sanitizeScore(s5_cohesion),
    score,
    level
  };
}
