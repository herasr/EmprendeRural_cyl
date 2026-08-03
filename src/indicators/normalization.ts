/**
 * Utilidades de Normalización y Gestión de Valores Ausentes
 * EmprendeRural CyL
 */

/**
 * Escalado Min-Max acotado de 0 a 100 con protección contra división por cero y NaN
 */
export function minMaxNormalize(
  value: number | undefined | null,
  min: number,
  max: number,
  invert: boolean = false
): number {
  if (value === undefined || value === null || isNaN(value)) {
    return 50; // Valor neutro por defecto para datos no informados
  }

  if (max === min) {
    return 50;
  }

  let normalized = ((value - min) / (max - min)) * 100;
  normalized = Math.max(0, Math.min(100, normalized));

  return invert ? 100 - normalized : normalized;
}

/**
 * Garantiza que una puntuación numérica no devuelva NaN ni infinitos
 */
export function sanitizeScore(score: number): number {
  if (isNaN(score) || !isFinite(score)) {
    return 0;
  }
  return Math.round(Math.max(0, Math.min(100, score)));
}
