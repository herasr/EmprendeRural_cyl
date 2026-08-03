/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import { MUNICIPALITIES } from "./data/municipalities";
import { SECTORS } from "./data/sectors";
import { Sector, SectorId, Municipality } from "./types";
import { calculateIOE } from "./utils/calculations";
import { MapSection } from "./components/MapSection";
import { MunicipalityDetail } from "./components/MunicipalityDetail";
import { ComparisonTable } from "./components/ComparisonTable";
import { GrantsPanel } from "./components/GrantsPanel";
import { MethodologyModal } from "./components/MethodologyModal";
import {
  Search,
  BookOpen,
  Filter,
  FileSpreadsheet,
  Grid,
  Info,
  Scale,
  Sparkles,
  Award,
  List,
  ChevronDown,
  Mail,
  PenTool,
  Menu,
  AlertTriangle
} from "lucide-react";

export default function App() {
  const [selectedSector, setSelectedSector] = useState<Sector>(SECTORS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Advanced filters state
  const [popFilter, setPopFilter] = useState<string>("ALL"); // ALL, <500, 500-1500, >1500
  const [connFilter, setConnFilter] = useState<boolean>(false); // Has fiber > 300 Mbps or not

  // Main navigation tabs between Ficha, Comparar, Subvenciones list
  const [activeTab, setActiveTab] = useState<"ficha" | "comparador" | "subvenciones">("ficha");

  // Selected municipality for detailed card profile
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);

  // States for modal and comparison basket
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [comparisonList, setComparisonList] = useState<Municipality[]>([]);

  // Automatically select the first municipality in Castile and Leon on launch
  useEffect(() => {
    if (MUNICIPALITIES.length > 0) {
      setSelectedMunicipality(MUNICIPALITIES[0]);
    }
  }, []);

  // Soft accents/tildes and lowercase normalization helper for robust Spanish searching
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // strip accents/diacritics
  };

  const normalizedQuery = useMemo(() => normalizeText(searchQuery.trim()), [searchQuery]);

  // Derive up to 5 rich partial suggestions as the user typingly fills the query
  const searchSuggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    return MUNICIPALITIES.filter(m => {
      return normalizeText(m.name).includes(normalizedQuery) ||
             normalizeText(m.province).includes(normalizedQuery) ||
             normalizeText(m.description).includes(normalizedQuery);
    }).slice(0, 5);
  }, [normalizedQuery]);

  // Calculate and sort municipalities by their weighted IOE score (highest first = best opportunity signals)
  const sortedMunicipalities = useMemo(() => {
    return MUNICIPALITIES.map(m => {
      const metrics = calculateIOE(m, selectedSector, MUNICIPALITIES);
      return { ...m, calculatedIOE: metrics.score, calculatedIOELevel: metrics.level };
    })
      .filter(m => {
        // Filter by Province
        const matchProvince = !selectedProvinceFilter || m.province === selectedProvinceFilter;
        
        // Filter by text query - robust normalized accent and description inclusive
        const matchText = !normalizedQuery || 
                          normalizeText(m.name).includes(normalizedQuery) || 
                          normalizeText(m.province).includes(normalizedQuery) ||
                          normalizeText(m.description).includes(normalizedQuery);
        
        // Filter by population range
        let matchPop = true;
        if (popFilter === "<500") matchPop = m.population < 500;
        else if (popFilter === "500-1500") matchPop = m.population >= 500 && m.population <= 1500;
        else if (popFilter === ">1500") matchPop = m.population > 1500;

        // Filter by speed
        const matchSpeed = !connFilter || m.connectivitySpeed >= 300;

        return matchProvince && matchText && matchPop && matchSpeed;
      })
      .sort((a, b) => b.calculatedIOE - a.calculatedIOE);
  }, [selectedSector, normalizedQuery, selectedProvinceFilter, popFilter, connFilter]);

  // Handle adding to comparison basket
  const handleToggleComparison = (m: Municipality) => {
    setComparisonList(prev => {
      const exists = prev.some(item => item.id === m.id);
      if (exists) {
        return prev.filter(item => item.id !== m.id);
      } else {
        if (prev.length >= 3) {
          alert("Por favor, compara un máximo de 3 municipios simultáneamente para mejor visualización.");
          return prev;
        }
        return [...prev, m];
      }
    });
  };

  // Export filtered options list as formatted CSV dataset for the jury page 13
  const handleExportCSV = () => {
    const headers = ["Municipio", "Provincia", "Poblacion", "Edad_Media", "Velocidad_Banda_Ancha_Mbps", "Competidores_Activos", "Puntuacion_IOE", "Nivel_IOE"];
    const rows = sortedMunicipalities.map(m => [
      m.name,
      m.province,
      m.population,
      m.avgAge,
      m.connectivitySpeed,
      m.activeBusinesses[selectedSector.id],
      m.calculatedIOE,
      m.calculatedIOELevel
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EmprendeRural_CyL_Oportunidades_${selectedSector.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col antialiased">
      {/* 1. Cabecera Oficial de la Junta de Castilla y León (White bar) */}
      <div className="bg-white border-b border-slate-200 shrink-0 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex justify-between items-center gap-4">
          
          {/* Official JCyL Logo with SVG Shield */}
          <div className="flex items-center gap-3">
            <svg className="h-11 w-11 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Shield outer boundary */}
              <path d="M15 15 H85 V60 C85 75, 50 90, 50 90 C50 90, 15 75, 15 60 Z" fill="#8c1d40" stroke="#f59e0b" strokeWidth="2.5" />
              {/* Quarter lines */}
              <line x1="50" y1="15" x2="50" y2="90" stroke="#f59e0b" strokeWidth="2" />
              <line x1="15" y1="52.5" x2="85" y2="52.5" stroke="#f59e0b" strokeWidth="2" />
              
              {/* Q1 & Q4 (Castile Castle) */}
              <path d="M25 45 H40 V35 H37 V30 H34 V35 H31 V30 H28 V35 H25 Z" fill="#f59e0b" />
              <rect x="31" y="40" width="3" height="5" fill="#8c1d40" />
              
              <path d="M60 80 H75 V70 H72 V65 H69 V70 H66 V65 H63 V70 H60 Z" fill="#f59e0b" />
              <rect x="66" y="75" width="3" height="5" fill="#8c1d40" />

              {/* Q2 & Q3 (Leon Lion) */}
              <path d="M51 16 H84 V51.5 H51 Z" fill="#ffffff" />
              <path d="M62 44 C61 41, 65 31, 70 26 C72 24, 76 26, 74 29 C72 32, 75 36, 78 33 C80 31, 78 41, 75 43 C72 45, 73 48, 62 44 Z" fill="#c084fc" />
              <circle cx="73" cy="25" r="1.2" fill="#f59e0b" />

              <path d="M16 53.5 H49 V82 C49 83, 30 78, 16 71 Z" fill="#ffffff" />
              <path d="M27 75 C26 72, 30 62, 35 57 C37 55, 41 57, 39 60 C37 63, 40 67, 43 64 C45 62, 43 72, 40 74 C37 76, 38 79, 27 75 Z" fill="#c084fc" />
            </svg>
            <div className="flex flex-col text-left leading-none shrink-0">
              <span className="font-sans text-[10px] font-bold text-slate-500 tracking-wider uppercase">Junta de</span>
              <span className="font-serif text-[17px] font-black text-[#8c1d40] tracking-tight leading-4">Castilla y León</span>
            </div>
          </div>

          {/* Quick Mock Search & Utilities to match page 1 of PDF */}
          <div className="hidden md:flex items-center gap-4 grow max-w-md justify-end">
            <div className="relative w-48">
              <input 
                type="text" 
                placeholder="Texto de búsqueda"
                disabled
                className="w-full text-[11px] bg-slate-50 border border-slate-200 px-2.5 py-1.5 pr-8 rounded-md text-slate-400 select-none cursor-not-allowed"
              />
              <Search className="h-3.5 w-3.5 text-[#8c1d40] absolute right-2.5 top-2" />
            </div>
            
            <div className="flex items-center gap-3">
              <button title="Peticiones" className="text-slate-400 hover:text-[#8c1d40] transition cursor-pointer">
                <PenTool className="h-4 w-4" />
              </button>
              <button title="Suscripciones / Contacto" className="text-slate-400 hover:text-[#8c1d40] transition cursor-pointer">
                <Mail className="h-4 w-4" />
              </button>
              <span className="text-[11px] font-bold text-slate-500 border-l border-slate-200 pl-3">
                Otros temas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Royal Crimson Navigation Ribbon (Official JCyL #8c1d40) */}
      <header className="bg-[#8c1d40] text-white shrink-0 sticky top-0 z-40 shadow-sm border-t border-amber-400/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            {/* White bold MENÚ text matching the screenshot */}
            <button 
              id="menu-ribbon-btn"
              onClick={() => setIsMethodologyOpen(true)}
              className="flex items-center gap-2 font-black text-xs text-white hover:bg-black/20 px-3 py-1.5 rounded-lg border border-white/20 transition cursor-pointer uppercase tracking-wider"
            >
              <Menu className="h-4 w-4 text-amber-300" />
              Menú
            </button>
            
            <span className="hidden sm:inline-block h-4 w-px bg-white/25"></span>
            
            <span className="text-[11px] font-semibold text-amber-100 tracking-wider hidden sm:block">
              CONCURSO DE DATOS ABIERTOS DE CASTILLA Y LEÓN | Categoría: Productos y Servicios | IX Edición
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="text-[11px] bg-black/20 hover:bg-black/40 text-amber-100 font-bold px-3 py-1.5 rounded border border-amber-400/30 flex items-center gap-1.5 transition cursor-pointer select-none"
              id="open-methodology-btn"
            >
              <Info className="h-3.5 w-3.5 text-amber-300" />
              Metodología (IOE + INT + IIS)
            </button>
          </div>
        </div>
      </header>

      {/* Official Mandatory Disclaimer Banner (AVISO IMPORTANTE - Memoria de Candidatura) */}
      <div className="bg-amber-50 text-slate-800 border-b border-amber-200 px-4 py-2 text-[11px] text-center flex items-center justify-center gap-2 shadow-inner font-sans shrink-0">
        <AlertTriangle className="h-4 w-4 text-[#8c1d40] shrink-0" />
        <span>
          <strong className="text-[#8c1d40] font-black uppercase font-mono">AVISO IMPORTANTE:</strong> EmprendeRural CyL es una herramienta orientativa. No garantiza rentabilidad económica ni sustituye estudios de mercado, asesoramiento profesional ni validación local.
        </span>
      </div>

      {/* 3. Hero Banner: Styled as "DATOS ABIERTOS de Castilla y León" from the PDF screen */}
      <div className="bg-slate-900 border-b border-indigo-900 overflow-hidden relative shrink-0">
        {/* Abstract vector arrows to replicate the Datos Abiertos hero graphic */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M 120 280 L 190 120 L 260 280" fill="none" stroke="#fff" strokeWidth="6" />
            <path d="M 175 140 L 190 120 L 205 140" fill="none" stroke="#fff" strokeWidth="6" />
            <path d="M 320 240 L 370 140 L 420 240" fill="none" stroke="#fff" strokeWidth="5" />
            <path d="M 360 160 L 370 140 L 380 160" fill="none" stroke="#fff" strokeWidth="5" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-9 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-bold px-2 py-0.5 rounded uppercase tracking-widest font-mono">
                Territorio inteligente
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white select-none uppercase">
              EmprendeRural CyL
            </h1>
            <p className="text-xl text-indigo-300 font-serif italic font-semibold">
              El radar de oportunidades de negocio
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-700/80 p-4 rounded-xl max-w-md backdrop-blur-sm shadow-lg">
            <h2 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              Plataforma de Viabilidad Territorial CyL
            </h2>
            <p className="text-xs text-slate-100 font-medium leading-relaxed">
              Herramienta técnica para Agentes de Desarrollo Local y Emprendedores. Detectamos prioridades insatisfechas emparejando censo de población, velocidad de telecomunicaciones y comercios existentes.
            </p>
          </div>
        </div>
      </div>

      {/* Área Principal de Trabajo */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex flex-col">
        {/* Banner de encuadre metodológico regional */}
        <div className="bg-white p-5 rounded-none border-l-4 border-l-[#8c1d40] border-y border-r border-slate-200 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-indigo-600 block rounded-xs"></span>
              Diagnóstico de Viabilidad Comercial para el Emprendimiento Rural
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Análisis territorial de Castilla y León para detectar vacíos de cobertura. Cruza los censos de actividades, histórico de población y conectividad en los 2.248 municipios de la región.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded border border-slate-950 transition flex items-center gap-1.5 shrink-0 select-none cursor-pointer hover:shadow-xs"
          >
            <FileSpreadsheet className="h-4 w-4 text-indigo-300" />
            Descargar como CSV
          </button>
        </div>

        {/* Sectors Selector Tray */}
        <div className="space-y-2">
          <span className="text-xxs font-extrabold text-slate-450 uppercase tracking-wider block font-mono">
            Paso 1: Selecciona la Idea o Sector Comercial Rural que planeas ofrecer:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {SECTORS.map(s => {
              const isSelected = selectedSector.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSector(s);
                  }}
                  className={`p-3.5 rounded-xl text-left border transition relative flex flex-col gap-2 cursor-pointer hover:shadow-sm ${
                    isSelected
                      ? "bg-[#8c1d40] text-white border-[#8c1d40] shadow-sm"
                      : "bg-white text-slate-850 border-slate-200 hover:bg-slate-50"
                  }`}
                  id={`sector-card-${s.id}`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold leading-tight">{s.name}</span>
                  </div>
                  <span className={`text-[10px] leading-tight ${isSelected ? "text-amber-100" : "text-slate-500"}`}>
                    {s.description.split(".")[0]}.
                  </span>
                  {isSelected && (
                    <span className="absolute bottom-2 right-2 flex h-2 w-2 rounded-full bg-amber-400"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Column split screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start grow">
          
          {/* LEFT SIDEBAR: List of municipalities sorted by calculated IOE */}
          <div className="lg:col-span-5 space-y-4 flex flex-col h-full lg:max-h-[750px] overflow-hidden">
            {/* List Header and filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <List className="h-4 w-4 text-indigo-500" />
                  Listado de Oportunidades ({sortedMunicipalities.length})
                </span>
                {selectedProvinceFilter && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md font-bold select-none">
                    Provincia: {selectedProvinceFilter}
                  </span>
                )}
              </div>

              {/* Text Search Input */}
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar municipio o comarca..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                    className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl placeholder-slate-400"
                    id="search-towns-input"
                    autoComplete="off"
                  />
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setShowSuggestions(false);
                      }}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-650 cursor-pointer font-bold font-mono"
                      title="Limpiar búsqueda"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Autocomplete Propuestas Parciales Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 divide-y divide-slate-100 overflow-hidden font-sans">
                    <div className="bg-slate-50/70 px-3 py-1.5 text-[9px] font-bold text-slate-450 uppercase tracking-wider font-mono">
                      Propuestas Parciales Encontradas:
                    </div>
                    {searchSuggestions.map(suggestion => (
                      <div
                        key={suggestion.id}
                        onMouseDown={() => {
                          setSearchQuery(suggestion.name);
                          setSelectedMunicipality(suggestion);
                          setShowSuggestions(false);
                          if (activeTab === "subvenciones") {
                            setActiveTab("ficha");
                          }
                        }}
                        className="px-3.5 py-2 hover:bg-indigo-50/50 transition flex justify-between items-center cursor-pointer text-left"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {suggestion.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            Provincia de {suggestion.province} &middot; {suggestion.population.toLocaleString()} habs
                          </p>
                        </div>
                        <span className="text-[9px] bg-slate-100 font-bold px-1.5 py-0.5 rounded text-indigo-700 shrink-0 select-none font-mono">
                          IOE: {suggestion.calculatedIOE}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Advanced multi-filters panel grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/50 p-2.5 rounded-xl border border-slate-200">
                {/* Population Limit Selection */}
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold block">Rango de Censo:</label>
                  <select
                    value={popFilter}
                    onChange={(e) => setPopFilter(e.target.value)}
                    className="w-full p-1 bg-white border border-slate-200 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="filter-population-select"
                  >
                    <option value="ALL">Cualquier tamaño</option>
                    <option value="<500">Menos de 500 habs (Pequeños)</option>
                    <option value="500-1500">500 a 1.500 habs (Medios)</option>
                    <option value=">1500">Más de 1.500 habs (Pueblos grandes)</option>
                  </select>
                </div>

                {/* Connectivity filter toggle */}
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold block">Infraestructura:</label>
                  <button
                    onClick={() => setConnFilter(prev => !prev)}
                    className={`w-full p-1 border rounded font-semibold text-center transition ${
                      connFilter
                        ? "bg-indigo-600 border-indigo-750 text-white shadow-xs"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                    id="filter-connectivity-toggle"
                  >
                    {connFilter ? "Solo Fibra (>300Mbps)" : "Cualquier velocidad"}
                  </button>
                </div>
              </div>
            </div>

            {/* List items rendering (Scrollable container list) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm grow overflow-y-auto divide-y divide-slate-100 max-h-[300px] lg:max-h-[500px]">
              {sortedMunicipalities.length > 0 ? (
                sortedMunicipalities.map(m => {
                  const isSelected = selectedMunicipality?.id === m.id;
                  
                  let ratingLabelColor = "text-orange-700 bg-orange-50";
                  if (m.calculatedIOELevel === "Verde") ratingLabelColor = "text-emerald-700 bg-emerald-50";
                  else if (m.calculatedIOELevel === "Amarillo") ratingLabelColor = "text-yellow-700 bg-yellow-50";
                  else if (m.calculatedIOELevel === "Rojo") ratingLabelColor = "text-red-700 bg-red-50";

                  const isInComparison = comparisonList.some(item => item.id === m.id);

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMunicipality(m);
                        if (activeTab === "subvenciones") {
                          setActiveTab("ficha"); // auto-switch to details to observe the metrics
                        }
                      }}
                      className={`p-3.5 transition-all text-left cursor-pointer flex justify-between items-center gap-3 relative ${
                        isSelected
                          ? "bg-indigo-50/20 border-l-4 border-l-indigo-600"
                          : "hover:bg-slate-50 border-l-4 border-l-transparent"
                      }`}
                      id={`municipality-item-${m.id}`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 text-xs md:text-sm truncate">
                            {m.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium font-serif shrink-0">
                            ({m.province})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span>{m.population.toLocaleString()} habs</span>
                          <span>&middot;</span>
                          <span className={`${m.populationGrowth5Y >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                            {m.populationGrowth5Y >= 0 ? "Estable" : `${m.populationGrowth5Y}% despob.`}
                          </span>
                        </div>
                        {/* Download formats aligned to matching JCyL web search page style */}
                        <div className="flex items-center gap-1 pt-1.5">
                          <span className="text-[8px] leading-none bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 px-1.5 py-0.5 rounded font-black font-mono tracking-wide uppercase shadow-4xs transition" title="Descargar datos en formato CSV">CSV</span>
                          <span className="text-[8px] leading-none bg-indigo-50 text-[#8c1d40] hover:bg-indigo-100/50 border border-indigo-200/50 px-1.5 py-0.5 rounded font-black font-mono tracking-wide uppercase shadow-4xs transition" title="Consultas automatizadas vía JSON API">JSON</span>
                          <span className="text-[8px] leading-none bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60 px-1.5 py-0.5 rounded font-black font-mono tracking-wide uppercase shadow-4xs transition" title="Exportar matriz Excel de ponderación">XLS</span>
                        </div>
                      </div>

                      {/* Display calculations index and comparison checkbox */}
                      <div className="shrink-0 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleComparison(m)}
                          className={`p-1.5 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer select-none text-[9px] sm:text-xs shrink-0 ${
                            isInComparison
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                              : "bg-white hover:bg-slate-50 text-slate-550 border-slate-200 hover:text-indigo-650 hover:border-indigo-250"
                          }`}
                          title={isInComparison ? "Quitar de la comparativa" : "Añadir a la comparativa"}
                        >
                          <Scale className="h-3 w-3 shrink-0 text-indigo-500" />
                          <span className="font-semibold text-[10px]">
                            {isInComparison ? "✓ Comparando" : "Comparar"}
                          </span>
                        </button>

                        <div className={`font-mono font-extrabold text-xs px-2 py-1 rounded-md shrink-0 ${ratingLabelColor}`}>
                          IOE: {m.calculatedIOE}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No hay poblaciones rurales que cumplan los criterios aplicados. Pruebe a restablecer filtros o buscar otra comarca.
                </div>
              )}
            </div>

            {/* Render Map Section component inside Left Sidebar directly */}
            <MapSection
              selectedProvince={selectedProvinceFilter}
              onSelectProvince={setSelectedProvinceFilter}
              selectedSector={selectedSector}
              municipalities={sortedMunicipalities}
              allMunicipalities={MUNICIPALITIES}
              selectedMunicipality={selectedMunicipality}
              onSelectMunicipality={(m) => {
                setSelectedMunicipality(m);
                if (activeTab === "subvenciones") {
                  setActiveTab("ficha");
                }
              }}
            />
          </div>

          {/* RIGHT SCREEN VIEWPORT: Tabs for Details, Comparison Basket, and Active Subsidies catalog */}
          <div className="lg:col-span-7 space-y-4">
            {/* View selectors tabs - Styled like Destacados / Novedades in JCyL portal */}
            <div className="flex border-b border-slate-200 select-none items-end gap-1.5 overflow-x-auto">
              <button
                onClick={() => setActiveTab("ficha")}
                className={`py-2.5 px-4 rounded-t-lg text-xs font-black transition-all cursor-pointer flex items-center gap-2 -mb-[1px] ${
                  activeTab === "ficha"
                    ? "bg-white text-[#8c1d40] border-x border-t border-slate-200 border-t-[4px] border-t-[#8c1d40] z-10 font-extrabold"
                    : "bg-slate-50 hover:bg-slate-100/80 text-slate-500 hover:text-slate-800 border-b border-slate-200"
                }`}
                id="tab-ficha-trigger"
              >
                <BookOpen className="h-4 w-4 shrink-0 text-[#8c1d40]" />
                <span>
                  Ficha Municipal {selectedMunicipality ? `(${selectedMunicipality.name})` : ""}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("comparador")}
                className={`py-2.5 px-4 rounded-t-lg text-xs font-black transition-all cursor-pointer flex items-center gap-2 -mb-[1px] relative ${
                  activeTab === "comparador"
                    ? "bg-white text-[#8c1d40] border-x border-t border-slate-200 border-t-[4px] border-t-[#8c1d40] z-10 font-extrabold"
                    : "bg-slate-50 hover:bg-slate-100/80 text-slate-500 hover:text-slate-800 border-b border-slate-200"
                }`}
                id="tab-comparador-trigger"
              >
                <Scale className="h-4 w-4 shrink-0 text-[#8c1d40]" />
                <span>Comparador Territorial</span>
                {comparisonList.length > 0 ? (
                  <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#8c1d40] text-[9px] font-mono font-bold text-white leading-none">
                    {comparisonList.length}
                  </span>
                ) : null}
              </button>

              <button
                onClick={() => setActiveTab("subvenciones")}
                className={`py-2.5 px-4 rounded-t-lg text-xs font-black transition-all cursor-pointer flex items-center gap-2 -mb-[1px] ${
                  activeTab === "subvenciones"
                    ? "bg-white text-[#8c1d40] border-x border-t border-slate-200 border-t-[4px] border-t-[#8c1d40] z-10 font-extrabold"
                    : "bg-slate-50 hover:bg-slate-100/80 text-slate-500 hover:text-slate-800 border-b border-slate-200"
                }`}
                id="tab-grants-trigger"
              >
                <Award className="h-4 w-4 shrink-0 text-[#8c1d40]" />
                <span>Catálogo de Ayudas JCyL</span>
              </button>
            </div>

            {/* TAB CONTENTS SWITCHER RENDERINGS */}
            <div className="transition-all duration-300">
              {activeTab === "ficha" && selectedMunicipality && (
                <MunicipalityDetail
                  municipality={selectedMunicipality}
                  selectedSector={selectedSector}
                  allMunicipalities={MUNICIPALITIES}
                  onAddToComparison={handleToggleComparison}
                  isInComparison={comparisonList.some(item => item.id === selectedMunicipality.id)}
                />
              )}

              {activeTab === "comparador" && (
                <ComparisonTable
                  comparisonList={comparisonList}
                  onRemoveFromComparison={(mId) => {
                    setComparisonList(prev => prev.filter(item => item.id !== mId));
                  }}
                  onClearComparison={() => setComparisonList([])}
                  selectedSector={selectedSector}
                  allMunicipalities={MUNICIPALITIES}
                  onSelectMunicipality={(m) => {
                    setSelectedMunicipality(m);
                    setActiveTab("ficha");
                  }}
                />
              )}

              {activeTab === "subvenciones" && (
                <GrantsPanel currentSectorId={selectedSector.id} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 4. Enlaces de Interés - Thematic JCyL Banners Grid (Page 3 of PDF) */}
      <section className="bg-slate-100/50 border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Banner 1: Cuéntanos tu idea */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-3xs hover:shadow-xs transition relative overflow-hidden group cursor-pointer">
              <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition">
                <Sparkles className="h-16 w-16 text-[#8c1d40]" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">PARTICIPACIÓN</span>
              <h4 className="text-sm font-black text-slate-800 uppercase mb-2">Cuéntanos tu idea</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                ¿Tienes una propuesta o proyecto basado en datos rurales? Te proporcionamos asesoramiento sobre fuentes públicas.
              </p>
            </div>

            {/* Banner 2: IDECyL */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-3xs hover:shadow-xs transition relative overflow-hidden group cursor-pointer">
              <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition">
                <Grid className="h-16 w-16 text-[#8c1d40]" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">GEOPORTAL</span>
              <h4 className="text-sm font-black text-slate-800 uppercase mb-2">IDECyL</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Infraestructura de Datos Espaciales de Castilla y León. Cartografía oficial y descargas de capas catastrales.
              </p>
            </div>

            {/* Banner 3: Guías Open Data */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-3xs hover:shadow-xs transition relative overflow-hidden group cursor-pointer">
              <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition">
                <BookOpen className="h-16 w-16 text-[#8c1d40]" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">RECURSOS</span>
              <h4 className="text-sm font-black text-slate-800 uppercase mb-2">Guías Open Data</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Documentación técnica, esquemas de interoperabilidad y buenas prácticas para reutilizar datos del sector público.
              </p>
            </div>

            {/* Banner 4: Portal Gobierno Abierto */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-3xs hover:shadow-xs transition relative overflow-hidden group cursor-pointer">
              <div className="absolute right-3 top-3 opacity-15 group-hover:opacity-25 transition">
                {/* Hand-sketched like icon for government portal */}
                <svg className="h-16 w-16 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">TRANSPARENCIA</span>
              <h4 className="text-sm font-black text-slate-800 uppercase mb-2">Gobierno Abierto</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Transparencia, consultas previas, participación ciudadana y rendición de cuentas de la Comunidad Autónoma.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Cabecera de Enlace y Catálogo Completo (Multi-column administrative index) */}
      <footer className="bg-[#1e293b] text-slate-300 border-t border-slate-800 select-none font-sans shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h5 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase border-b border-slate-750 pb-2">
              Iniciativa de Datos Abiertos
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-350">
              <li><span className="hover:text-white transition cursor-pointer">¿Qué son los datos abiertos?</span></li>
              <li><span className="hover:text-white transition cursor-pointer">El proyecto en Castilla y León</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Normativa aplicable</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Guías Open Data y formatos</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Enlaces de interés y repositorios</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Catálogo de Buenas prácticas</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase border-b border-slate-750 pb-2">
              Catálogo de Datos
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-350">
              <li><span className="hover:text-white transition cursor-pointer">Buscador global de conjuntos de datos</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Listado temático de fuentes</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Términos de uso de la información</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Formatos estructurados de descarga</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase border-b border-slate-750 pb-2">
              Análisis e Impacto
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-350">
              <li><span className="hover:text-white transition cursor-pointer">Visualizaciones sobre contratos</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Estudio sobre eficiencia energética</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Directorios de administración regional</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Catálogo de aplicaciones móviles</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase border-b border-slate-750 pb-2">
              Participa y Concursos
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-350">
              <li><span className="hover:text-white transition cursor-pointer">Danos tu opinión / Comentarios</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Solicitud de apertura de datos públicos</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Solicitud de difusión de aplicaciones</span></li>
              <li><span className="text-indigo-300 font-bold hover:text-white transition cursor-pointer">IX Concurso de Datos Abiertos 2026</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Ediciones anteriores del certamen</span></li>
            </ul>
          </div>

        </div>

        {/* Notice of Institutional Independence */}
        <div className="bg-[#111827] border-t border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-300">
          <div className="max-w-5xl mx-auto space-y-1">
            <p className="text-slate-200 font-medium">
              <strong>EmprendeRural CyL</strong> es una herramienta independiente basada en datos abiertos. Utiliza conjuntos publicados por la Junta de Castilla y León y otras fuentes públicas, pero no es un servicio oficial de la Administración autonómica ni sus resultados representan un pronunciamiento de esta.
            </p>
            <p className="text-[11px] text-slate-400">
              <strong>Procedencia de los datos:</strong> Portal de Datos Abiertos de la Junta de Castilla y León y otras fuentes públicas identificadas en la plataforma. La mención de los organismos productores no implica su participación, respaldo o validación del análisis realizado.
            </p>
          </div>
        </div>

        {/* Legal links, micro-capsules and certification badges (Page 4 of PDF) */}
        <div className="bg-[#0f172a] border-t border-slate-900 py-6 text-slate-450 border-b border-indigo-950/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px]">
            
            {/* Legal bar row list */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-400 font-medium">
              <span className="hover:text-white transition cursor-pointer">Aviso Legal</span>
              <span className="text-slate-700">|</span>
              <span className="hover:text-white transition cursor-pointer">Protección de datos</span>
              <span className="text-slate-700">|</span>
              <span className="hover:text-white transition cursor-pointer">Política de cookies</span>
              <span className="text-slate-700">|</span>
              <span className="hover:text-white transition cursor-pointer">Accesibilidad</span>
              <span className="text-slate-700">|</span>
              <span className="hover:text-white transition cursor-pointer">Contacto</span>
              <span className="text-slate-700">|</span>
              <span className="hover:text-white transition cursor-pointer font-bold text-indigo-400">Guía de estilos web</span>
            </div>

            {/* Simulated standards logos matching PDF bottom row precisely */}
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 border border-slate-800 text-[9px] font-mono rounded bg-slate-900 text-slate-350">
                W3C <span className="text-emerald-400 font-bold">css ✓</span>
              </span>
              <span className="px-2 py-0.5 border border-slate-800 text-[9px] font-mono rounded bg-slate-900 text-slate-350">
                W3C <span className="text-emerald-400 font-bold">HTML 5.0 ✓</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-900/50 text-indigo-300 font-bold text-[8px] uppercase tracking-wider">
                ILUNION AA
              </span>
              <span className="text-[10px] text-slate-550 font-semibold font-mono pl-2">
                &copy; 2026 JCyL
              </span>
            </div>

          </div>
        </div>
      </footer>

      {/* Methodology Modal screen */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}
