/**
 * Gestión de Ponderaciones y Validación Matricial del IOE
 * EmprendeRural CyL
 */

import { Sector } from "../types";
import { WeightValidationResult } from "./types";

/**
 * Valida que los pesos de un sector sumen exactamente 100% (1.00)
 */
export function validateSectorWeights(sector: Sector): WeightValidationResult {
  const w = sector.weights;
  const sum = 
    w.v1_demanda +
    w.v2_deficit +
    w.v3_competencia +
    w.v4_demografia +
    w.v5_poblacion_obj +
    w.v6_conectividad +
    w.v7_ayudas +
    w.v8_turismo;

  const roundedSum = Math.round(sum * 100) / 100;
  const valid = roundedSum === 1.00;

  return {
    valid,
    sum: roundedSum,
    message: valid
      ? `Las ponderaciones del sector '${sector.name}' son válidas y suman 100%.`
      : `Error: Las ponderaciones del sector '${sector.name}' suman ${roundedSum * 100}%, no 100%.`
  };
}
