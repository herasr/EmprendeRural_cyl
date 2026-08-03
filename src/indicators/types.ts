/**
 * Tipos e Interfaces para los Indicadores Deterministas del IOE
 * EmprendeRural CyL
 */

import { Municipality, Sector, IOEMetrics, INTMetrics, IISMetrics } from "../types";

export interface CalculationResult {
  ioe: IOEMetrics;
  int: INTMetrics;
  iis: IISMetrics;
  reliabilityScore: number; // 0 a 100
  reliabilityLabel: "Alta" | "Media" | "Verificada";
}

export interface WeightValidationResult {
  valid: boolean;
  sum: number;
  message: string;
}
