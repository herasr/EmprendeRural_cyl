import { Sector, SectorId } from "../types";

export const SECTORS: Sector[] = [
  {
    id: SectorId.PANADERIA,
    name: "Panadería / Alimentación",
    description: "Servicio básico de primera necesidad para abastecimiento cotidiano en el medio rural.",
    iconName: "Bread",
    selectedAgeGroupLabel: "Población general (Todas las edades)",
    weights: {
      v1_demanda: 0.20,     // Mayor población incrementa demanda de pan
      v2_deficit: 0.25,     // Ausencia de panadería es determinante
      v3_competencia: 0.20, // Proximidad de competidores es crítica (canibalización)
      v4_demografia: 0.10,  // Evolución demográfica (estabilización)
      v5_poblacion_obj: 0.15,// Población general
      v6_conectividad: 0.00,// Irrelevante para panadería tradicional física
      v7_ayudas: 0.05,      // Factor de apoyo complementario
      v8_turismo: 0.05       // Turismo aporta consumo estacional
    }
  },
  {
    id: SectorId.TALLER,
    name: "Taller Mecánico",
    description: "Servicio esencial para mantenimiento de vehículos rurales, tractores y maquinaria agrícola.",
    iconName: "Wrench",
    selectedAgeGroupLabel: "Población activa (Conductores y profesionales)",
    weights: {
      v1_demanda: 0.25,
      v2_deficit: 0.25,
      v3_competencia: 0.15,
      v4_demografia: 0.10,
      v5_poblacion_obj: 0.15,
      v6_conectividad: 0.00,
      v7_ayudas: 0.05,
      v8_turismo: 0.05
    }
  },
  {
    id: SectorId.PELUQUERIA,
    name: "Peluquería / Estética",
    description: "Servicio de proximidad muy valorado, especialmente por la población mayor con dificultades de movilidad.",
    iconName: "Scissors",
    selectedAgeGroupLabel: "Población Senior (>65 años)",
    weights: {
      v1_demanda: 0.20,
      v2_deficit: 0.25,
      v3_competencia: 0.15,
      v4_demografia: 0.10,
      v5_poblacion_obj: 0.20, // 20% peso al tramo de edad clave (los mayores consumen mucha estética de proximidad)
      v6_conectividad: 0.00,
      v7_ayudas: 0.05,
      v8_turismo: 0.05
    }
  },
  {
    id: SectorId.TURISMO,
    name: "Alojamiento Rural",
    description: "Establecimiento rural para captar flujos turísticos, ecoturismo y senderismo.",
    iconName: "Hotel",
    selectedAgeGroupLabel: "Entorno turístico y plazas",
    weights: {
      v1_demanda: 0.10,      // Menos dependiente de residentes locales
      v2_deficit: 0.10,      // Un déficit indica que hay espacio para nuevas experiencias
      v3_competencia: 0.15,  // Oferta hotelera cercana
      v4_demografia: 0.05,
      v5_poblacion_obj: 0.05,
      v6_conectividad: 0.15, // Muy importante wifi para turistas/teletrabajo
      v7_ayudas: 0.10,       // Alto volumen de ayudas a rehabilitación rural
      v8_turismo: 0.30       // Crítico: Entorno natural, cultural y plazas turísticas actuales
    }
  },
  {
    id: SectorId.COWORKING,
    name: "Coworking / Servicios Digitales",
    description: "Espacio de trabajo compartido y soporte de telecomunicaciones para nómadas digitales y emprendedores.",
    iconName: "Laptop",
    selectedAgeGroupLabel: "Población Activa y Jóvenes (25-55 años)",
    weights: {
      v1_demanda: 0.10,
      v2_deficit: 0.10,
      v3_competencia: 0.10,
      v4_demografia: 0.10,
      v5_poblacion_obj: 0.20, // Peso a los rangos 25-55
      v6_conectividad: 0.25, // Bandas anchas de velocidad óptimas (alta importancia!)
      v7_ayudas: 0.10,       // Bonificaciones por digitalización y agenda digital
      v8_turismo: 0.05
    }
  }
];
