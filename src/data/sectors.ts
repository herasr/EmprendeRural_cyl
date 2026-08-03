import { Sector, SectorId } from "../types";

export const SECTORS: Sector[] = [
  {
    id: SectorId.PANADERIA,
    name: "Panadería / Alimentación",
    description: "Servicio básico de primera necesidad para abastecimiento cotidiano en el medio rural.",
    iconName: "Bread",
    selectedAgeGroupLabel: "Población general (Todas las edades)",
    weights: {
      v1_demanda: 0.20,     // 20%
      v2_deficit: 0.25,     // 25%
      v3_competencia: 0.20, // 20%
      v4_demografia: 0.10,  // 10%
      v5_poblacion_obj: 0.15,// 15%
      v6_conectividad: 0.00,// 0%
      v7_ayudas: 0.05,      // 5%
      v8_turismo: 0.05       // 5%
    }
  },
  {
    id: SectorId.TALLER,
    name: "Taller Mecánico",
    description: "Servicio esencial para mantenimiento de vehículos rurales, tractores y maquinaria agrícola.",
    iconName: "Wrench",
    selectedAgeGroupLabel: "Población activa (Conductores y profesionales)",
    weights: {
      v1_demanda: 0.15,     // 15% (Memoria pág. 22)
      v2_deficit: 0.20,     // 20%
      v3_competencia: 0.25, // 25%
      v4_demografia: 0.05,  // 5%
      v5_poblacion_obj: 0.10,// 10%
      v6_conectividad: 0.05,// 5%
      v7_ayudas: 0.05,      // 5%
      v8_turismo: 0.15       // 15% (Tráfico turístico)
    }
  },
  {
    id: SectorId.PELUQUERIA,
    name: "Peluquería / Estética",
    description: "Servicio de proximidad muy valorado, especialmente por la población mayor con dificultades de movilidad.",
    iconName: "Scissors",
    selectedAgeGroupLabel: "Población Senior (>65 años)",
    weights: {
      v1_demanda: 0.20,     // 20% (Memoria pág. 23)
      v2_deficit: 0.30,     // 30%
      v3_competencia: 0.15, // 15%
      v4_demografia: 0.05,  // 5%
      v5_poblacion_obj: 0.25,// 25% (Foco en mayores de 65)
      v6_conectividad: 0.00,// 0%
      v7_ayudas: 0.05,      // 5%
      v8_turismo: 0.00       // 0%
    }
  },
  {
    id: SectorId.TURISMO,
    name: "Alojamiento Rural",
    description: "Establecimiento rural para captar flujos turísticos, ecoturismo y senderismo.",
    iconName: "Hotel",
    selectedAgeGroupLabel: "Entorno turístico y plazas",
    weights: {
      v1_demanda: 0.05,     // 5% (Memoria pág. 24)
      v2_deficit: 0.15,     // 15%
      v3_competencia: 0.15, // 15%
      v4_demografia: 0.05,  // 5%
      v5_poblacion_obj: 0.00,// 0%
      v6_conectividad: 0.15,// 15% (Wifi para turistas/teletrabajo)
      v7_ayudas: 0.15,      // 15% (Ayudas LEADER / rehabilitación)
      v8_turismo: 0.30       // 30% (Factor más crítico: entorno turístico)
    }
  },
  {
    id: SectorId.COWORKING,
    name: "Coworking / Servicios Digitales",
    description: "Espacio de trabajo compartido y soporte de telecomunicaciones para nómadas digitales y emprendedores.",
    iconName: "Laptop",
    selectedAgeGroupLabel: "Población Activa y Jóvenes (25-55 años)",
    weights: {
      v1_demanda: 0.10,     // 10% (Memoria pág. 25)
      v2_deficit: 0.20,     // 20%
      v3_competencia: 0.10, // 10%
      v4_demografia: 0.20,  // 20%
      v5_poblacion_obj: 0.10,// 10% (Jóvenes y adultos 25-50 años)
      v6_conectividad: 0.25,// 25% (Factor crítico: fibra / banda ancha)
      v7_ayudas: 0.05,      // 5%
      v8_turismo: 0.00       // 0%
    }
  }
];
