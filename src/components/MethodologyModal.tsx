import React from "react";
import { SECTORS } from "../data/sectors";
import { Info, HelpCircle, Variable, ShieldAlert } from "lucide-react";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 flex flex-col font-sans">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Info className="h-5 w-5 text-[#8c1d40]" />
              Metodología Transparente y Tríada de Indicadores (IOE + INT + IIS)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fórmula y ponderaciones del Índice de Oportunidad Emprendedora rural.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-semibold w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            id="close-methodology-modal"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Formula section */}
          <section className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-[#8c1d40] mb-2 flex items-center gap-1.5 text-base uppercase tracking-tight">
              <Variable className="h-5 w-5 text-[#8c1d40]" />
              Fórmulas de los 3 Índices Combinados (IOE, INT, IIS)
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">1. IOE — Índice de Oportunidad Emprendedora (0-100):</span>
                <div className="font-mono text-xs text-[#8c1d40] font-bold bg-slate-50 p-2 rounded border border-slate-100">
                  IOE = w1*V1 + w2*V2 + w3*V3 + w4*V4 + w5*V5 + w6*V6 + w7*V7 + w8*V8
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">2. INT — Índice de Necesidad Territorial (0-100):</span>
                <div className="font-mono text-xs text-amber-800 font-bold bg-slate-50 p-2 rounded border border-slate-100">
                  INT = 0.30*U1 (Ausencia) + 0.25*U2 (Distancia) + 0.20*U3 (Población) + 0.15*U4 (Envejecimiento) + 0.10*U5 (Aislamiento)
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">3. IIS — Índice de Impacto Social (0-100):</span>
                <div className="font-mono text-xs text-emerald-800 font-bold bg-slate-50 p-2 rounded border border-slate-100">
                  IIS = 0.25*S1 (Beneficiados) + 0.20*S2 (Desplazamiento) + 0.25*S3 (Vulnerables) + 0.15*S4 (Empleo) + 0.15*S5 (Cohesión)
                </div>
              </div>
            </div>
          </section>

          {/* Description of variables */}
          <section>
            <h4 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-1">
              Las 8 Variables del Radar (V1 - V8)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-mono text-slate-800 font-bold block mb-1">V1: DEMANDA_POTENCIAL</span>
                <span className="text-slate-600">Población residente total ajustada inversamente por la edad media. A mayor población y menor edad media, mayor demanda potencial.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-mono text-slate-800 font-bold block mb-1">V2: DEFICIT_SERVICIO</span>
                <span className="text-slate-600">Ratio de comercios o servicios activos del sector por cada 1.000 habitantes. Un ratio inferior a la media regional otorga un mayor déficit y eleva la oportunidad.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-mono text-slate-800 font-bold block mb-1">V3: COMPETENCIA local</span>
                <span className="text-slate-600">Cuantifica el solapamiento directo en el núcleo. La ausencia de competidores locales directos otorga 100 puntos de oportunidad de mercado inmediato.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-mono text-slate-800 font-bold block mb-1">V4: EVOLUCON_DEMOGRAFICA</span>
                <span className="text-slate-650">Tasa de variación del censo municipal en los últimos 5 años. Refleja si el pueblo se está estabilizando o sufre despoblación acelerada.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-mono text-slate-800 font-bold block mb-1">V5: POBLACION_OBJETIVO</span>
                <span className="text-slate-600">Porcentaje de población en la franja de mayor consumo del sector (ej. mayores de 65 para peluquerías locales, activos de 25-55 para coworking digital).</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-mono text-slate-800 font-bold block mb-1">V6: CONECTIVIDAD DIGITAL</span>
                <span className="text-slate-600">Velocidad de banda ancha residencial disponible. Variable crítica de corte técnico para espacios de coworking (hasta 1.000 Mbps).</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-mono text-slate-800 font-bold block mb-1">V7: AYUDAS_DISPONIBLES</span>
                <span className="text-slate-600">Involucra la disponibilidad geográfica de subvenciones locales o provinciales activas compatibles (ej. fondos LEADER locales o incentivos del Plan Soria).</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-mono text-slate-800 font-bold block mb-1">V8: ENTORNO_TURISTICO</span>
                <span className="text-slate-600">Plazas turísticas oficiales de alojamiento rural por habitante. Importante para alojamientos vacacionales o servicios con tracción estacional.</span>
              </div>
            </div>
          </section>

          {/* Matrix of Sectoral Weights */}
          <section>
            <h4 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-1">
              Matriz Adaptativa Sectorial de Pesos (wi)
            </h4>
            <div className="overflow-x-auto border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800">
                  <tr>
                    <th className="p-2.5 font-semibold">Sector</th>
                    <th className="p-2.5 font-semibold text-center font-mono">V1</th>
                    <th className="p-2.5 font-semibold text-center font-mono">V2</th>
                    <th className="p-2.5 font-semibold text-center font-mono">V3</th>
                    <th className="p-2.5 font-semibold text-center font-mono">V4</th>
                    <th className="p-2.5 font-semibold text-center font-mono">V5</th>
                    <th className="p-2.5 font-semibold text-center font-mono">V6</th>
                    <th className="p-2.5 font-semibold text-center font-mono">V7</th>
                    <th className="p-2.5 font-semibold text-center font-mono">V8</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SECTORS.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-medium text-slate-800">{s.name}</td>
                      <td className="p-2.5 text-center font-mono">{(s.weights.v1_demanda * 100).toFixed(0)}%</td>
                      <td className="p-2.5 text-center font-mono">{(s.weights.v2_deficit * 100).toFixed(0)}%</td>
                      <td className="p-2.5 text-center font-mono">{(s.weights.v3_competencia * 100).toFixed(0)}%</td>
                      <td className="p-2.5 text-center font-mono">{(s.weights.v4_demografia * 100).toFixed(0)}%</td>
                      <td className="p-2.5 text-center font-mono">{(s.weights.v5_poblacion_obj * 100).toFixed(0)}%</td>
                      <td className="p-2.5 text-center font-mono">{(s.weights.v6_conectividad * 100).toFixed(0)}%</td>
                      <td className="p-2.5 text-center font-mono">{(s.weights.v7_ayudas * 100).toFixed(0)}%</td>
                      <td className="p-2.5 text-center font-mono">{(s.weights.v8_turismo * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sourcing / References */}
          <section className="bg-slate-50 p-4 rounded-xl text-xs space-y-2.5">
            <h4 className="font-semibold text-slate-800 flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
              Fuentes de Datos Oficiales y Reutilización
            </h4>
            <p className="text-slate-600 leading-normal">
              <strong>Procedencia de los datos:</strong> Portal de Datos Abiertos de la Junta de Castilla y León y otras fuentes públicas identificadas en cada ficha. La mención de los organismos productores no implica su participación, respaldo o validación del análisis realizado por EmprendeRural CyL.
            </p>
            <ul className="list-disc pl-5 mt-1 text-slate-500 space-y-0.5">
              <li><strong>Censo e Indicadores Demográficos:</strong> Instituto Nacional de Estadística (INE) e Indicadores Demográficos del SIE (Junta de Castilla y León).</li>
              <li><strong>Establecimientos y Albergues turísticos:</strong> Registro de Turismo de Castilla y León y Registro de Establecimientos de Turismo Rural.</li>
              <li><strong>Estadísticas de Paro Registrado y Subvenciones:</strong> Portal de Datos Abiertos de Castilla y León y Base de Datos Nacional de Subvenciones (BDNS).</li>
              <li><strong>Banda Ancha y Conectividad:</strong> Mapas de Banda Ancha de Cobertura del Ministerio de Transformación Digital de España.</li>
            </ul>
          </section>

          {/* Institutional Independence Notice & Disclaimer */}
          <section className="bg-amber-50 rounded-xl p-4 border border-amber-200 space-y-2">
            <h5 className="font-semibold text-amber-900 flex items-center gap-1.5 text-xs">
              <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0" />
              Aviso de Independencia Institucional y Descargo de Responsabilidad
            </h5>
            <p className="text-xs text-amber-900 font-medium leading-relaxed bg-amber-100/60 p-2.5 rounded-lg border border-amber-200">
              <strong>EmprendeRural CyL es una herramienta independiente basada en datos abiertos.</strong> Utiliza conjuntos publicados por la Junta de Castilla y León y otras fuentes públicas, pero no es un servicio oficial de la Administración autonómica ni sus resultados representan un pronunciamiento de esta.
            </p>
            <p className="text-[11px] text-amber-800 leading-normal">
              Esta plataforma es de carácter estrictamente informativo y orientativo. No garantiza rentabilidad comercial ni sustituye el asesoramiento legal, financiero, arquitectónico o normativo especializado. El emprendedor asume bajo su propio riesgo el estudio final de viabilidad en el terreno.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#8c1d40] hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer font-sans"
            id="close-methodology-btn"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
