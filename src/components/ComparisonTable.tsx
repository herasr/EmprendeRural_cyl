import React from "react";
import { Municipality, Sector } from "../types";
import { calculateIOE } from "../utils/calculations";
import { Scale, Trash2, GitCompare } from "lucide-react";

interface ComparisonTableProps {
  comparisonList: Municipality[];
  onRemoveFromComparison: (mId: string) => void;
  onClearComparison: () => void;
  selectedSector: Sector;
  allMunicipalities: Municipality[];
  onSelectMunicipality: (m: Municipality) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  comparisonList,
  onRemoveFromComparison,
  onClearComparison,
  selectedSector,
  allMunicipalities,
  onSelectMunicipality
}) => {
  if (comparisonList.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center py-12 space-y-3">
        <GitCompare className="h-10 w-10 text-slate-300 mx-auto" />
        <h3 className="font-semibold text-slate-750 text-sm">Comparador Territorial Rural</h3>
        <p className="text-xs text-slate-450 max-w-sm mx-auto leading-normal">
          No hay municipios seleccionados para comparar. Añade poblaciones pulsando el botón <strong>"Añadir a Comparar"</strong> en el listado de municipios.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 overflow-hidden font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#8c1d40]" />
            Comparador Territorial Multivariable
          </h3>
          <p className="text-xs text-slate-550 mt-0.5">
            Contraste de indicadores, demografía y señales de oportunidad para <strong>{selectedSector.name}</strong>.
          </p>
        </div>
        <button
          onClick={onClearComparison}
          className="text-xs text-red-600 bg-red-50/50 hover:bg-red-50 font-semibold px-3 py-1.5 rounded-lg border border-red-200 transition cursor-pointer"
          id="clear-comparison-btn"
        >
          Limpiar Todo
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs min-w-[500px]">
          <thead>
            <tr className="bg-slate-50 text-slate-800 border-b border-slate-200">
              <th className="p-3 font-semibold w-1/4">Indicador / Municipio</th>
              {comparisonList.map(m => {
                const ioe = calculateIOE(m, selectedSector, allMunicipalities);
                
                let ratingColor = "bg-orange-55 text-orange-700";
                if (ioe.level === "Verde") ratingColor = "bg-emerald-50 text-emerald-850";
                else if (ioe.level === "Amarillo") ratingColor = "bg-yellow-50 text-yellow-700";
                else if (ioe.level === "Rojo") ratingColor = "bg-red-50 text-red-700";

                return (
                  <th key={m.id} className="p-3 font-semibold border-l border-slate-200 text-center relative max-w-[200px]">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="text-slate-900 font-bold leading-tight">{m.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{m.province}</div>
                      
                      {/* Calculated score badge */}
                      <div className={`mt-1 font-mono text-base font-bold px-3 py-1 rounded-lg ${ratingColor}`} id={`comp-score-${m.id}`}>
                        IOE: {ioe.score}
                      </div>

                      <div className="flex gap-1.5 mt-2">
                        <button
                          onClick={() => onSelectMunicipality(m)}
                          className="text-[10px] bg-indigo-600 hover:bg-indigo-750 text-white px-2 py-0.5 rounded transition font-semibold cursor-pointer border border-indigo-700 shadow-xs"
                        >
                          Ver Detalle
                        </button>
                        <button
                          onClick={() => onRemoveFromComparison(m.id)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded transition cursor-pointer"
                          title="Quitar de la lista"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-slate-600">
            {/* Demographics section */}
            <tr className="bg-slate-50/50 font-semibold text-slate-800">
              <td colSpan={comparisonList.length + 1} className="p-2 font-bold text-slate-700 select-none font-mono text-[10px]">
                DATOS CENSO & DEMOGRAFÍA
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Población de Censo</td>
              {comparisonList.map(m => (
                <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                  {m.population.toLocaleString()} habs
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Var. Censo (5 años)</td>
              {comparisonList.map(m => (
                <td
                  key={m.id}
                  className={`p-3 text-center border-l border-slate-150 font-mono font-bold ${
                    m.populationGrowth5Y >= 0 ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {m.populationGrowth5Y >= 0 ? "+" : ""}{m.populationGrowth5Y}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Edad Media Habitante</td>
              {comparisonList.map(m => (
                <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                  {m.avgAge} años
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Población Senior (&gt;65 años)</td>
              {comparisonList.map(m => (
                <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                  {m.age65PlusPct}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Población Activa (25-55 años)</td>
              {comparisonList.map(m => (
                <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                  {m.age25To55Pct}%
                </td>
              ))}
            </tr>

            {/* Infrastructure Section */}
            <tr className="bg-slate-50/50 font-semibold text-slate-800">
              <td colSpan={comparisonList.length + 1} className="p-2 font-bold text-slate-700 select-none font-mono text-[10px]">
                INFRAESTRUCTURA & SERVICIOS
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Velocidad Banda Ancha</td>
              {comparisonList.map(m => (
                <td
                  key={m.id}
                  className={`p-3 text-center border-l border-slate-150 font-mono font-bold ${
                    m.connectivitySpeed >= 300 ? "text-emerald-700" : "text-yellow-700"
                  }`}
                >
                  {m.connectivitySpeed} Mbps
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Competencia Activa (Mismo Sector)</td>
              {comparisonList.map(m => {
                const competes = m.activeBusinesses[selectedSector.id];
                return (
                  <td
                    key={m.id}
                    className={`p-3 text-center border-l border-slate-150 font-mono font-bold ${
                      competes === 0 ? "text-indigo-700 bg-indigo-50/30 font-extrabold" : "text-amber-700"
                    }`}
                  >
                    {competes === 0 ? "NINGUNO (Déficit Total)" : `${competes} locales`}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Plazas Turísticas</td>
              {comparisonList.map(m => (
                <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                  {m.touristBeds} plazas
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Distancia a la Capital</td>
              {comparisonList.map(m => (
                <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                  {m.distanceToCapital} km
                </td>
              ))}
            </tr>

            {/* Calculations Breakdown */}
            <tr className="bg-slate-50/50 font-semibold text-slate-800">
              <td colSpan={comparisonList.length + 1} className="p-2 font-bold text-slate-700 select-none font-mono text-[10px]">
                DESGLOSE INDICADORES IOE (Puntuación 0-100)
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Demanda Potencial (V1)</td>
              {comparisonList.map(m => {
                const metrics = calculateIOE(m, selectedSector, allMunicipalities);
                return (
                  <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                    {metrics.v1_demanda}/100
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Déficit de Oferta (V2)</td>
              {comparisonList.map(m => {
                const metrics = calculateIOE(m, selectedSector, allMunicipalities);
                return (
                  <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                    {metrics.v2_deficit}/100
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Competencia (V3)</td>
              {comparisonList.map(m => {
                const metrics = calculateIOE(m, selectedSector, allMunicipalities);
                return (
                  <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                    {metrics.v3_competencia}/100
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Conectividad Digital (V6)</td>
              {comparisonList.map(m => {
                const metrics = calculateIOE(m, selectedSector, allMunicipalities);
                return (
                  <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                    {metrics.v6_conectividad}/100
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-800">Tracción Turística (V8)</td>
              {comparisonList.map(m => {
                const metrics = calculateIOE(m, selectedSector, allMunicipalities);
                return (
                  <td key={m.id} className="p-3 text-center border-l border-slate-150 font-mono">
                    {metrics.v8_turismo}/100
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
