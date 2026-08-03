import React, { useEffect, useRef } from "react";
import { Municipality, Sector } from "../types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Compass } from "lucide-react";
import castillaYLeonGeoJSON from "../data/castilla_y_leon_provinces.json";

interface MapSectionProps {
  selectedProvince: string | null;
  onSelectProvince: (province: string | null) => void;
  selectedSector: Sector;
  municipalities: Municipality[];
  allMunicipalities: Municipality[];
  selectedMunicipality?: Municipality | null;
  onSelectMunicipality?: (m: Municipality) => void;
}

interface ProvinceMeta {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: string;
}

// Manual centroids as safe fallbacks (will be overridden by exact mathematical GeoJSON centroids)
const PROVINCES_DATA: ProvinceMeta[] = [
  {
    id: "Leon",
    name: "León",
    lat: 42.75,
    lng: -5.85,
    severity: "2.8%"
  },
  {
    id: "Palencia",
    name: "Palencia",
    lat: 42.45,
    lng: -4.60,
    severity: "40.3%"
  },
  {
    id: "Burgos",
    name: "Burgos",
    lat: 42.40,
    lng: -3.65,
    severity: "45.5%"
  },
  {
    id: "Soria",
    name: "Soria",
    lat: 41.75,
    lng: -2.70,
    severity: "63.9%"
  },
  {
    id: "Segovia",
    name: "Segovia",
    lat: 41.15,
    lng: -4.00,
    severity: "38.8%"
  },
  {
    id: "Avila",
    name: "Ávila",
    lat: 40.65,
    lng: -4.95,
    severity: "41.1%"
  },
  {
    id: "Salamanca",
    name: "Salamanca",
    lat: 40.85,
    lng: -5.95,
    severity: "26.0%"
  },
  {
    id: "Zamora",
    name: "Zamora",
    lat: 41.75,
    lng: -6.00,
    severity: "14.1%"
  },
  {
    id: "Valladolid",
    name: "Valladolid",
    lat: 41.65,
    lng: -4.78,
    severity: "26.7%"
  }
];

export const MapSection: React.FC<MapSectionProps> = ({
  selectedProvince,
  onSelectProvince
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonsGroupRef = useRef<L.FeatureGroup | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);

  // Initialize Map centering on Valladolid
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Create Leaflet Map centered in Valladolid
    const map = L.map(mapContainerRef.current, {
      center: [41.65, -4.72],
      zoom: 7,
      minZoom: 6,
      maxZoom: 10,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false
    });
    
    mapRef.current = map;
    
    // Use CartoDB Voyager / Light basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      subdomains: 'abcd'
    }).addTo(map);

    // Subtle vector boundary outlines
    const boundaryGroup = L.featureGroup().addTo(map);
    polygonsGroupRef.current = boundaryGroup;

    // Overlay markers layer
    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update vectors and pill markers when selection changes
  useEffect(() => {
    const map = mapRef.current;
    const boundaryGroup = polygonsGroupRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !boundaryGroup || !markersGroup) return;

    // Clear previous geometries and overlays
    boundaryGroup.clearLayers();
    markersGroup.clearLayers();

    // Render faint, aesthetic province limits using real GeoJSON boundaries
    const geoJsonLayer = L.geoJSON(castillaYLeonGeoJSON as any, {
      style: (feature) => {
        const name = feature?.properties?.name;
        const isSelected = selectedProvince === name;

        return {
          fillColor: isSelected ? "#8c1d40" : "#94a3b8",
          fillOpacity: isSelected ? 0.15 : 0.04,
          color: isSelected ? "#8c1d40" : "#64748b",
          weight: isSelected ? 2.5 : 1.2,
          dashArray: isSelected ? "" : "3, 4"
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature?.properties?.name;
        layer.on("click", () => {
          onSelectProvince(selectedProvince === name ? null : name);
        });

        // Add native hover tooltip for boundary layer
        layer.bindTooltip(`
          <div style="font-family: system-ui, sans-serif; padding: 2px 4px; font-size: 11px; color: #1e293b;">
            <strong style="font-weight: 700;">Provincia de ${name}</strong>
          </div>
        `, {
          sticky: true,
          direction: "top"
        });
      }
    });

    geoJsonLayer.addTo(boundaryGroup);

    // Mathematically calculate precise centroids directly from the GeoJSON features
    const provinceCentroids: Record<string, [number, number]> = {};
    castillaYLeonGeoJSON.features.forEach((feature: any) => {
      const name = feature.properties.name;
      const geom = feature.geometry;
      let sumLat = 0;
      let sumLng = 0;
      let count = 0;

      const addCoords = (ring: number[][]) => {
        ring.forEach(([lng, lat]) => {
          sumLat += lat;
          sumLng += lng;
          count++;
        });
      };

      if (geom.type === "Polygon") {
        addCoords(geom.coordinates[0]);
      } else if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach((poly: number[][][]) => {
          addCoords(poly[0]);
        });
      }

      if (count > 0) {
        provinceCentroids[name] = [sumLat / count, sumLng / count];
      }
    });

    // Render precise light-mode floating pill markers for each province
    PROVINCES_DATA.forEach(p => {
      const isSelected = selectedProvince === p.name;
      const coord = provinceCentroids[p.name] || [p.lat, p.lng];

      // Severity badge styling
      let badgeClass = "bg-[#8c1d40] text-white border-[#8c1d40]";
      if (p.id === "Leon") {
        badgeClass = "bg-slate-200 border-slate-300 text-slate-700";
      } else if (p.id === "Zamora") {
        badgeClass = "bg-amber-100 border-amber-300 text-amber-800";
      } else if (p.id === "Soria") {
        badgeClass = "bg-rose-700 border-rose-800 text-white font-bold";
      }

      // Selected card styling
      const activeBorderClass = isSelected
        ? "border-[#8c1d40] bg-white ring-2 ring-[#8c1d40]/30 shadow-lg scale-105"
        : "border-slate-200 bg-white/95 hover:border-slate-400 hover:shadow-md";

      const activeTextClass = isSelected ? "text-[#8c1d40] font-black" : "text-slate-800 font-bold";

      const htmlContent = `
        <div class="flex flex-col items-center justify-end w-[100px] h-[50px] relative">
          <!-- Main pill container -->
          <div class="px-2.5 py-1.5 rounded-lg border text-center flex flex-col items-center gap-0.5 min-w-[78px] shadow-sm transition-all ${activeBorderClass} mb-1.5">
            <div class="text-[9px] uppercase tracking-wider ${activeTextClass} font-sans leading-none">${p.name}</div>
            <div class="text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold leading-none ${badgeClass} mt-1">${p.severity}</div>
          </div>
          <!-- Anchor point circle -->
          <div class="absolute bottom-0 flex items-center justify-center h-2 w-2">
            <div class="w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#8c1d40]" : "bg-slate-600"} relative z-10"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: htmlContent,
        className: "custom-leaflet-pill-icon",
        iconSize: [100, 50],
        iconAnchor: [50, 48]
      });

      const marker = L.marker(coord, { icon: customIcon });

      marker.on("click", () => {
        onSelectProvince(isSelected ? null : p.name);
      });

      marker.bindTooltip(`
        <div style="font-family: system-ui, sans-serif; padding: 4px 6px; font-size: 11px; line-height: 1.3; color: #1e293b;">
          <strong style="font-weight: 800; font-size: 12px; display: block; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; margin-bottom: 3px;">
            Provincia de ${p.name}
          </strong>
          <div>Nivel de Atomización: <span style="font-weight: 800; color: #8c1d40;">${p.severity}</span></div>
          <div style="font-size: 9px; color: #64748b; margin-top: 1px;">Click para ${isSelected ? "quitar filtro" : "filtrar provincia"}</div>
        </div>
      `, {
        sticky: true,
        direction: "top"
      });

      marker.addTo(markersGroup);
    });
  }, [selectedProvince, onSelectProvince]);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center font-sans text-slate-800 w-full select-none" id="leaflet-map-section">
      
      {/* Outer Card Header matching scientific dashboard style */}
      <div className="w-full flex justify-between items-center mb-3 shrink-0">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold">Filtro métrico activo:</div>
          <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#8c1d40]"></span>
            % Atomización Crítica (&lt;100 hab)
          </h3>
        </div>
      </div>

      {/* Main Map Box container */}
      <div className="relative w-full aspect-[4/3] min-h-[320px] bg-slate-100 border border-slate-200 rounded-2xl p-1 overflow-hidden shadow-inner">
        
        {/* Top Left Title Overlay */}
        <div className="absolute top-4 left-4 z-40 pointer-events-none select-none bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold tracking-wider text-slate-800 font-sans">MAPA PROVINCIAL DE CASTILLA Y LEÓN</div>
          <div className="text-[9px] font-sans text-slate-500">Datos Abiertos JCyL</div>
        </div>

        {/* Top Right Selected Focus Box */}
        <div className="absolute top-4 right-4 z-40 pointer-events-none select-none">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/95 border border-slate-200 rounded-full text-[10px] font-bold text-slate-700 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8c1d40]"></span>
            Provincia: <span className="text-[#8c1d40] font-bold">{selectedProvince || "Todas"}</span>
          </div>
        </div>

        {/* Leaflet Map Div */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-full rounded-xl z-10" 
          style={{ minHeight: "312px" }} 
        />

        {/* Floating Action Buttons inside map bottom overlay */}
        <div className="absolute bottom-4 right-4 z-40">
          <button
            onClick={() => onSelectProvince(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 shadow-md cursor-pointer transition active:scale-[0.98]"
            title="Resetear filtros de provincia"
          >
            <Compass className="w-3.5 h-3.5 text-[#8c1d40]" />
            Vista General
          </button>
        </div>
      </div>

      {/* Grid footer scale graphics */}
      <div className="w-full flex justify-between items-center mt-2.5 px-1 select-none pointer-events-none text-[8px] font-mono text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-10 h-1 border-b border-r border-l border-slate-300"></div>
          <span>Escala: 0 40 80 km</span>
        </div>
      </div>

      {/* Legend Area */}
      <div className="w-full mt-4 pt-3.5 border-t border-slate-200">
        <div className="space-y-2">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider text-left font-sans">
            Nivel de Severidad Territorial (Atomización %):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] text-slate-700">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 justify-start">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span className="font-bold text-slate-600">Moderado</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200 justify-start">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="font-bold text-amber-800">Alto / Alerta</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-200 justify-start">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8c1d40]"></span>
              <span className="font-bold text-[#8c1d40]">Crítico</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 rounded-lg border border-rose-300 justify-start">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-700"></span>
              <span className="font-bold text-rose-800">Extremo</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 mt-4 text-center leading-relaxed font-sans">
        Seleccione cualquier provincia en el mapa para filtrar los datos municipales correspondientes.
      </p>
    </div>
  );
};
