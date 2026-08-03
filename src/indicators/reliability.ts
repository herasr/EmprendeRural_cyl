/**
 * Evaluación de Fiabilidad y Cobertura de Datos (Semáforo de Calidad)
 * EmprendeRural CyL
 */

import { Municipality } from "../types";

export interface ReliabilityResult {
  score: number; // 0 - 100
  label: "Excelente" | "Buena" | "Aceptable";
  sourcesChecked: string[];
  missingFieldsCount: number;
}

export function evaluateDataReliability(municipality: Municipality): ReliabilityResult {
  let score = 100;
  let missing = 0;

  if (!municipality.population || municipality.population <= 0) {
    score -= 30;
    missing++;
  }
  if (municipality.connectivitySpeed === undefined || municipality.connectivitySpeed === null) {
    score -= 20;
    missing++;
  }
  if (municipality.age65PlusPct === undefined) {
    score -= 15;
    missing++;
  }
  if (municipality.distanceToCapital === undefined) {
    score -= 10;
    missing++;
  }

  score = Math.max(0, score);

  let label: "Excelente" | "Buena" | "Aceptable" = "Excelente";
  if (score < 70) {
    label = "Aceptable";
  } else if (score < 90) {
    label = "Buena";
  }

  return {
    score,
    label,
    sourcesChecked: [
      "Padrón Municipal INE",
      "Datos Abiertos JCyL (Comercio y Servicios)",
      "Ministerio Transformación Digital (Banda Ancha)"
    ],
    missingFieldsCount: missing
  };
}
