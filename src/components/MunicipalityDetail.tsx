import React, { useState, useEffect } from "react";
import { Municipality, Sector, IOEMetrics, Grant } from "../types";
import { calculateIOE, calculateINT, calculateIIS, getCompatibleGrantsForTown } from "../utils/calculations";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Wifi,
  Sparkles,
  Building,
  HelpCircle,
  Briefcase,
  AlertCircle,
  Coins,
  Send,
  Loader2,
  FileText,
  Compass,
  CheckCircle,
  Scale
} from "lucide-react";

interface MunicipalityDetailProps {
  municipality: Municipality;
  selectedSector: Sector;
  allMunicipalities: Municipality[];
  onAddToComparison: (m: Municipality) => void;
  isInComparison: boolean;
}

export const MunicipalityDetail: React.FC<MunicipalityDetailProps> = ({
  municipality,
  selectedSector,
  allMunicipalities,
  onAddToComparison,
  isInComparison
}) => {
  const [userQuestion, setUserQuestion] = useState("");
  const [consultantResponse, setConsultantResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Progressive loading messages to keep user engaged
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Consultando la base demográfica consolidada de Castilla y León...",
    "Analizando el déficit comercial localizado y nivel de competencia local...",
    "Cruzando convocatorias de subvenciones activas (fondos LEADER, ECYL)...",
    "Compilando dictamen técnico de viabilidad y adaptaciones comerciales específicas..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Reset consulting answer on town or sector change
  useEffect(() => {
    setConsultantResponse(null);
    setUserQuestion("");
    setErrorMsg(null);
  }, [municipality, selectedSector]);

  const metrics: IOEMetrics = calculateIOE(municipality, selectedSector, allMunicipalities);
  const intMetrics = calculateINT(municipality, selectedSector, allMunicipalities);
  const iisMetrics = calculateIIS(municipality, selectedSector, allMunicipalities);
  const compatibleGrants: Grant[] = getCompatibleGrantsForTown(municipality, selectedSector.id);

  const handleConsult = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setConsultantResponse(null);

    try {
      const response = await fetch("/api/consultant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sector: selectedSector,
          municipality,
          metrics,
          userQuestion: userQuestion.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Algo salió mal al generar el dictamen técnico.");
      }

      setConsultantResponse(data.text);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || "Error al conectar con la pasarela de análisis. Asegúrese de que la clave del motor de procesamiento esté correctamente configurada en el panel de control."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Assign background styles according to IOE rating level
  let badgeBg = "bg-orange-50 text-orange-700 border-orange-200";
  let ioeText = "Riesgo Moderado";
  if (metrics.level === "Verde") {
    badgeBg = "bg-emerald-50 text-emerald-800 border-emerald-255";
    ioeText = "Excelente Oportunidad";
  } else if (metrics.level === "Amarillo") {
    badgeBg = "bg-yellow-50 text-yellow-800 border-yellow-255";
    ioeText = "Favorable Oportunidad";
  } else if (metrics.level === "Rojo") {
    badgeBg = "bg-red-50 text-red-800 border-red-255";
    ioeText = "Baja Viabilidad Inicial";
  }

  return (
    <div className="space-y-6">
      {/* Primary header card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="h-3.5 w-3.5 text-indigo-500" />
              <span>Castilla y León</span>
              <span>&middot;</span>
              <span>Provincia de {municipality.province}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight" id="detail-m-name">
              {municipality.name}
            </h2>
            <p className="text-xs text-slate-600 max-w-xl italic">
              "{municipality.description}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {/* IOE */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                IOE (Oportunidad)
              </span>
              <div className="flex items-center justify-center gap-1 font-mono font-extrabold text-slate-900 text-2xl">
                <span>{metrics.score}</span>
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block mt-0.5 ${badgeBg}`}>
                {metrics.level}
              </span>
            </div>

            {/* INT */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                INT (Necesidad)
              </span>
              <div className="flex items-center justify-center gap-1 font-mono font-extrabold text-[#8c1d40] text-2xl">
                <span>{intMetrics.score}</span>
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-800 inline-block mt-0.5">
                {intMetrics.level}
              </span>
            </div>

            {/* IIS */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                IIS (Impacto Social)
              </span>
              <div className="flex items-center justify-center gap-1 font-mono font-extrabold text-emerald-700 text-2xl">
                <span>{iisMetrics.score}</span>
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 inline-block mt-0.5">
                {iisMetrics.level}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons tray */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => onAddToComparison(municipality)}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
              isInComparison
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300"
            }`}
            id="comp-toggle-btn"
          >
            <Scale className="h-3.5 w-3.5" />
            {isInComparison ? "✓ En Comparativa" : "Añadir a Comparar"}
          </button>
        </div>
      </div>

      {/* Grid: Demographics vs IOE variables checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demographics Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Building className="h-4.5 w-4.5 text-indigo-500" />
            Perfil Demográfico Compuesto
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Población Total</span>
              <span className="font-mono text-base font-extrabold text-slate-800">
                {municipality.population.toLocaleString()} habs
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Evolución (5a)</span>
              <div className="flex items-center justify-center gap-1 text-base font-extrabold font-mono">
                {municipality.populationGrowth5Y >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={municipality.populationGrowth5Y >= 0 ? "text-emerald-700" : "text-red-700"}>
                  {municipality.populationGrowth5Y >= 0 ? "+" : ""}{municipality.populationGrowth5Y}%
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center col-span-2 flex justify-around items-center">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Edad Media</span>
                <span className="font-mono text-sm font-extrabold text-slate-700">{municipality.avgAge} años</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Seniors (&gt;65a)</span>
                <span className="font-mono text-sm font-extrabold text-slate-700">{municipality.age65PlusPct}%</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Activos (25-55a)</span>
                <span className="font-mono text-sm font-extrabold text-slate-700">{municipality.age25To55Pct}%</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 space-y-2">
              <span className="text-[10px] text-slate-450 uppercase font-bold block font-mono">Conectividad e Infraestructura</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5 text-indigo-400" /> Banda ancha fija:
                </span>
                <span className="font-mono font-bold text-slate-800">{municipality.connectivitySpeed} Mbps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-indigo-400" /> Distancia capital:
                </span>
                <span className="font-mono font-bold text-slate-800">{municipality.distanceToCapital} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-indigo-400" /> Plazas hoteleras:
                </span>
                <span className="font-mono font-bold text-slate-800">{municipality.touristBeds} plazas</span>
              </div>
            </div>
          </div>
        </div>

        {/* IOE Variables drilldown progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Compass className="h-4.5 w-4.5 text-indigo-500" />
            Desglose de Factores del IOE
          </h3>

          <div className="space-y-3.5">
            {[
              { label: "V1: Demanda Potencial general", value: metrics.v1_demanda, weight: selectedSector.weights.v1_demanda },
              { label: "V2: Déficit del servicio", value: metrics.v2_deficit, weight: selectedSector.weights.v2_deficit },
              { label: "V3: Reducción de competencia local", value: metrics.v3_competencia, weight: selectedSector.weights.v3_competencia },
              { label: "V4: Estabilización Demográfica", value: metrics.v4_demografia, weight: selectedSector.weights.v4_demografia },
              { label: "V5: Cobertura demografía objetivo", value: metrics.v5_poblacion_obj, weight: selectedSector.weights.v5_poblacion_obj },
              { label: "V6: Infraestructura de telecomunicaciones", value: metrics.v6_conectividad, weight: selectedSector.weights.v6_conectividad },
              { label: "V7: Apoyo de subvenciones", value: metrics.v7_ayudas, weight: selectedSector.weights.v7_ayudas },
              { label: "V8: Tracción turística invernal/estival", value: metrics.v8_turismo, weight: selectedSector.weights.v8_turismo }
            ].map((v, idx) => {
              if (v.weight === 0) return null; // Only render variables with weight in the current sector

              let barColor = "bg-amber-500";
              if (v.value > 75) barColor = "bg-indigo-600";
              else if (v.value <= 25) barColor = "bg-red-500";

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xxs font-medium text-slate-655">
                    <span>{v.label}</span>
                    <span className="font-mono text-slate-800">{v.value}/100 <span className="text-[10px] text-slate-400 font-mono">(Peso: {Math.round(v.weight * 100)}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-150 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${v.value}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerta de ayudas section */}
      <div className="bg-indigo-50/20 p-5 rounded-2xl border border-indigo-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-sm">
            <CheckCircle className="h-4 w-4 text-indigo-600" />
            Alerta de Ayudas Públicas Compatibles
          </div>
          <p className="text-xs text-slate-655 max-w-xl leading-normal">
            Hemos identificado <strong>{compatibleGrants.length} convocatorias activas</strong> compatibles con la apertura de un <strong>{selectedSector.name}</strong> en <strong>{municipality.name}</strong>.
          </p>
        </div>
        <div className="flex gap-1 flex-wrap shrink-0">
          {compatibleGrants.map(cg => (
            <span key={cg.id} className="text-[10px] bg-white border border-indigo-150 text-indigo-700 font-bold px-2.5 py-1 rounded-md">
              {cg.id === "g_plansoria" ? "Plan Soria Directo" : cg.title.substring(0, 16) + "..."}
            </span>
          ))}
        </div>
      </div>

      {/* Simulador de Dictamen de Idoneidad de la Consejería */}
      <div className="bg-slate-50 border-2 border-indigo-100/80 text-slate-800 rounded-2xl p-6 space-y-5 shadow-3xs relative overflow-hidden">
        {/* Physical document watermark decor */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="text-[10px] tracking-wider font-extrabold text-indigo-600 uppercase block font-mono">
              Servicio de Apoyo al Emprendimiento y Desarrollo Local
            </span>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Dictamen de Viabilidad e Implantación
            </h3>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              Expida el dictamen técnico de viabilidad comercial y adaptación económica para <strong>{municipality.name}</strong> basándose en el censo actual de <strong>{selectedSector.name}</strong> (Índice de Oportunidad IOE: {metrics.score}/100).
            </p>
          </div>
        </div>

        {/* Core panel interface - Styled professionally like an administrative form wizard */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          {consultantResponse ? (
            <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-600 max-h-[450px] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-[10px] font-black tracking-wider text-indigo-700 uppercase flex items-center gap-1.5 font-mono">
                  <CheckCircle className="h-4 w-4 text-indigo-600" />
                  Informe Técnico de Viabilidad y Campo Oficial - {municipality.name}
                </span>
                <button
                  onClick={() => setConsultantResponse(null)}
                  className="text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer underline decoration-indigo-300 underline-offset-4"
                >
                  Nueva Evaluación
                </button>
              </div>
              <div className="text-xs text-slate-705 leading-relaxed font-sans space-y-3">
                {/* Visual rendering of the report with a clean paper document styling */}
                {consultantResponse.split("\n").map((line, i) => {
                  if (line.startsWith("### ")) {
                    return <h4 key={i} className="text-[#8c1d40] font-black text-xs pt-2 pb-0.5 tracking-tight uppercase">{line.replace("### ", "")}</h4>;
                  }
                  if (line.startsWith("## ")) {
                    return <h3 key={i} className="text-indigo-700 font-extrabold text-sm pt-4 pb-1 border-b border-slate-100 uppercase tracking-tight">{line.replace("## ", "")}</h3>;
                  }
                  if (line.startsWith("**")) {
                    return <p key={i} className="mb-2 text-slate-800 font-semibold">{line.replace(/\*\*/g, "")}</p>;
                  }
                  if (line.trim().startsWith("- ")) {
                    return <li key={i} className="ml-4 list-disc mb-1 text-slate-600 pl-1">{line.replace("- ", "")}</li>;
                  }
                  return <p key={i} className="mb-1 text-slate-650">{line}</p>;
                })}
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-xs font-extrabold text-slate-800">
                  {loadingMessages[loadingStep]}
                </p>
                <p className="text-[10px] text-slate-400 animate-pulse font-mono uppercase tracking-widest">
                  Evaluando variables y calculadores...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Optional Custom Input Question */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Criterios adicionales de simulación u observaciones del Técnico Local (Opcional)
                </label>
                <textarea
                  placeholder="Ej: Análisis específico para reparto a domicilio, viabilidad de asociarse a cooperativa local, o disponibilidad de local en propiedad en el núcleo..."
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-22 resize-none font-sans shadow-3xs"
                  id="consultant-question-box"
                />
              </div>

              {/* Error messages if any */}
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-snug">{errorMsg}</span>
                </div>
              )}

              {/* CTA button */}
              <button
                onClick={handleConsult}
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-slate-900 disabled:bg-slate-205 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-sans uppercase tracking-wider hover:scale-[1.005] active:scale-[0.995]"
                id="generate-consultant-btn"
              >
                <FileText className="h-4 w-4 text-indigo-200" />
                Expedir Dictamen de Idoneidad y Diagnósticos del Municipio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
