import React, { useState, useMemo } from "react";
import { GRANTS } from "../data/grants";
import { SECTORS } from "../data/sectors";
import { SectorId } from "../types";
import { Award, CheckCircle, HelpCircle, Tag, Layers } from "lucide-react";

interface GrantsPanelProps {
  currentSectorId?: SectorId;
}

export const GrantsPanel: React.FC<GrantsPanelProps> = ({ currentSectorId }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const currentSector = useMemo(() => {
    return SECTORS.find(s => s.id === currentSectorId);
  }, [currentSectorId]);

  const filteredGrants = useMemo(() => {
    return GRANTS.filter(g => {
      const matchSector = !currentSectorId || g.compatibleSectors.includes(currentSectorId);
      const matchText = 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSector && matchText;
    });
  }, [currentSectorId, searchQuery]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-[#8c1d40]" />
            Panel de Ayudas y Subvenciones Activas
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Convocatorias oficiales aplicables para emprender en el medio rural de Castilla y León.
          </p>
        </div>

        {currentSector && (
          <div className="flex items-center gap-2 bg-indigo-50/60 border border-indigo-150/40 py-1.5 px-3.5 rounded-xl text-[11px] text-indigo-900 shrink-0 shadow-3xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shrink-0"></span>
            <span>Sector general activo: <strong>{currentSector.name}</strong></span>
          </div>
        )}
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        {/* Text search */}
        <div>
          <input
            type="text"
            placeholder="Buscar subvención por palabra clave o provincia (ej: LEADER, ECYL, Soria)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl placeholder-slate-400"
            id="search-grants-input"
          />
        </div>
      </div>      {/* Grants items list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGrants.length > 0 ? (
          filteredGrants.map(g => (
            <div
              key={g.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs bg-white flex flex-col justify-between transition gap-3"
              id={`grant-card-${g.id}`}
            >
              <div className="space-y-2">
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5 font-sans">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">
                      {g.provider}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">
                      {g.title}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full select-none shrink-0 ${
                    g.scope === "provincial"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : g.scope === "local"
                      ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}>
                    {g.scope === "provincial" ? `Ám. ${g.targetProvince || "Provincial"}` : g.scope === "local" ? "Ám. Comarcal" : "Autonómica"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {g.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 font-sans">
                {/* Amount */}
                <div className="flex items-center justify-between text-xs bg-indigo-50/40 text-indigo-950 px-2.5 py-1.5 rounded-lg font-semibold border border-indigo-100/40">
                  <span className="text-indigo-700">Dotaciones:</span>
                  <span className="font-extrabold font-mono">{g.subsidyAmount}</span>
                </div>

                {/* Compatible list tags */}
                <div className="flex flex-wrap gap-1 items-center">
                  <span className="text-[9px] text-slate-400 font-medium flex items-center gap-0.5 mr-1 font-mono">
                    <Layers className="h-2.5 w-2.5 text-slate-400" /> Compatibilidad:
                  </span>
                  {g.compatibleSectors.map(secId => {
                    const foundSec = SECTORS.find(s => s.id === secId);
                    return (
                      <span
                        key={secId}
                        className="text-[9px] font-medium bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded-md border border-slate-200/50"
                      >
                        {foundSec ? foundSec.name.split("/")[0] : secId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs font-sans">
            <HelpCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            No se han encontrado subvenciones que coincidan con los filtros y la búsqueda actual.
          </div>
        )}
      </div>

      <div className="p-4 bg-indigo-50/20 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-normal font-sans shadow-3xs">
        📌 <strong>Nota sobre compatibilidad automática:</strong> Al seleccionar un municipio en el radar de la pantalla principal, el sistema cruzará activamente su perfil demográfico y sectorial para pre-evaluar si califica en estas líneas de financiación regional castellano-leonesas.
      </div>
    </div>
  );
};
