/**
 * Pruebas Unitarias del Motor Determinista del IOE
 * EmprendeRural CyL
 */

import { SECTORS } from "../../data/sectors";
import { MUNICIPALITIES } from "../../data/municipalities";
import { validateSectorWeights } from "../weights";
import { calculateIOE, calculateINT, calculateIIS } from "../ioe";
import { minMaxNormalize, sanitizeScore } from "../normalization";
import { evaluateDataReliability } from "../reliability";

function runTests() {
  console.log("==========================================");
  console.log("🧪 Iniciando Batería de Tests de EmprendeRural CyL");
  console.log("==========================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Comprobar que las matrices de todos los sectores suman exactamente 1.00 (100%)
  for (const sector of SECTORS) {
    const res = validateSectorWeights(sector);
    assert(res.valid, `Las ponderaciones del sector '${sector.name}' suman 100%`);
  }

  // Test 2: Rango y acotación del IOE (0-100)
  const testMun = MUNICIPALITIES[0];
  const testSec = SECTORS[0];
  const ioe = calculateIOE(testMun, testSec, MUNICIPALITIES);
  assert(ioe.score >= 0 && ioe.score <= 100, `IOE score de '${testMun.name}' está acotado entre 0 y 100 (obtenido: ${ioe.score})`);

  // Test 3: Ausencia de valores NaN o infinitos
  assert(!isNaN(ioe.score) && isFinite(ioe.score), "El resultado del IOE es un número finito válido");

  // Test 4: Comprobar la protección contra división por cero en minMaxNormalize
  const normZero = minMaxNormalize(50, 10, 10);
  assert(normZero === 50, "minMaxNormalize maneja correctamente rangos nulos (max === min)");

  // Test 5: Evaluación de Fiabilidad
  const rel = evaluateDataReliability(testMun);
  assert(rel.score >= 0 && rel.score <= 100, `El indicador de fiabilidad está acotado (obtenido: ${rel.score})`);

  // Test 6: Reproducibilidad determinista
  const ioe2 = calculateIOE(testMun, testSec, MUNICIPALITIES);
  assert(ioe.score === ioe2.score, "El cálculo del IOE es 100% determinista y reproducible");

  console.log("==========================================");
  console.log(`📊 Resultado Final: ${passed} pasados, ${failed} fallidos`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
