import { Grant, SectorId } from "../types";

export const GRANTS: Grant[] = [
  {
    id: "g_leader",
    title: "Ayudas de los Grupos de Acción Local (Fondos LEADER)",
    provider: "Unión Europea y Junta de Castilla y León",
    description: "Subvenciones a fondo perdido para la creación, ampliación o modernización de PYMEs y servicios de proximidad en el medio rural profundo.",
    subsidyAmount: "Hasta el 45% del total de la inversión elegible",
    compatibleSectors: [SectorId.PANADERIA, SectorId.TALLER, SectorId.PELUQUERIA, SectorId.TURISMO, SectorId.COWORKING],
    scope: "local",
    active: true
  },
  {
    id: "g_rehabitare",
    title: "Programa Rehabitare de Alquiler y Alojamientos Rurales",
    provider: "Consejería de Medio Ambiente y Vivienda CyL",
    description: "Ayudas específicas para la recuperación de antiguas casas consistoriales, escuelas o viviendas parroquiales para destinarlas al alquiler o turismo rural.",
    subsidyAmount: "Hasta el 70% de las obras de acondicionamiento",
    compatibleSectors: [SectorId.TURISMO],
    scope: "regional",
    active: true
  },
  {
    id: "g_autoempleo",
    title: "Subvenciones al Fomento del Autoempleo en CyL",
    provider: "Servicio Público de Empleo de Castilla y León (ECYL)",
    description: "Ayudas directas orientadas a personas desempleadas que se establezcan por cuenta propia como autónomos en municipios de menos de 5.000 habitantes.",
    subsidyAmount: "Entre 6.000 € y 10.000 € directos de inicio",
    compatibleSectors: [SectorId.PANADERIA, SectorId.TALLER, SectorId.PELUQUERIA, SectorId.COWORKING],
    scope: "regional",
    active: true
  },
  {
    id: "g_plansoria",
    title: "Plan Soria Conectada y Saludable - Emprende",
    provider: "Diputación de Soria",
    description: "Subvención especial y compensación de impuestos de instalación física para paliar la despoblación en cualquier municipio soria.",
    subsidyAmount: "Deducción de hasta 15.000 € o 60% de cuotas de seguridad social",
    compatibleSectors: [SectorId.PANADERIA, SectorId.TALLER, SectorId.PELUQUERIA, SectorId.TURISMO, SectorId.COWORKING],
    scope: "provincial",
    targetProvince: "Soria",
    active: true
  },
  {
    id: "g_comercio",
    title: "Ayudas a la Modernización de Comercios Minoristas de Proximidad",
    provider: "Consejería de Industria, Comercio y Empleo CyL",
    description: "Apoyo a la reforma física de locales comerciales de alimentación, talleres de reparación o peluquerías locales para mejora energética o digital.",
    subsidyAmount: "Hasta 20.000 € (75% de la inversión justificada)",
    compatibleSectors: [SectorId.PANADERIA, SectorId.TALLER, SectorId.PELUQUERIA],
    scope: "regional",
    active: true
  },
  {
    id: "g_kit_digital",
    title: "Bono Kit Digital para Autónomos Rurales",
    provider: "Ministerio de Asuntos Económicos y Transformación Digital",
    description: "Financiación de soluciones de digitalización de comercios, implantaciones de páginas web, facturas electrónicas o espacios remotos de coworking.",
    subsidyAmount: "De 2.000 € a 12.000 € canjeables por servicios digitales",
    compatibleSectors: [SectorId.COWORKING, SectorId.TURISMO, SectorId.TALLER],
    scope: "regional",
    active: true
  }
];
