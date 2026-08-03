# EmprendeRural CyL 🌾📊

**Plataforma de Viabilidad Territorial y Radar de Oportunidades para Emprendedores Rurales en Castilla y León.**

Herramienta técnica de análisis territorial que reutiliza conjuntos de datos abiertos de Castilla y León para detectar prioridades no cubiertas y evaluar la viabilidad inicial de implantación de negocios en municipios rurales.

---

## 🌐 Aplicación Pública

- **Despliegue Principal:** [https://emprenderural-cyl.pages.dev/](https://emprenderural-cyl.pages.dev/)

---

## 📊 Estado de Funciones y Acreditación del MVP

| Componente / Función | Estado de Implementación | Fuente / Evidencia |
| :--- | :--- | :--- |
| **Selector de Actividad (5 sectores CNAE)** | **Implementado (100%)** | `src/data/sectors.ts` |
| **Mapa Interactivo Coroplético por Municipios** | **Implementado (100%)** | `src/components/MapSection.tsx` |
| **Cálculo Determinista del IOE (INT + IIS + IDC)** | **Implementado (100%)** | `src/indicators/ioe.ts` |
| **Ficha Detallada Municipal** | **Implementado (100%)** | `src/components/MunicipalityDetail.tsx` |
| **Comparador Multimunicipal (hasta 4 municipios)** | **Implementado (100%)** | `src/components/ComparisonTable.tsx` |
| **Buscador de Subvenciones y Ayudas (SGCyL)** | **Implementado (100%)** | `src/components/GrantsPanel.tsx` |
| **Batería de Pruebas Unitarias** | **Implementado (100%)** | `src/indicators/__tests__/ioe.test.ts` (`npm test`) |
| **Declaración y Auditoría de IA** | **Comprobado (Sin IA en ejecución)** | `docs/inteligencia-artificial.md` |
| **Criterios de Accesibilidad y Usabilidad** | **Comprobado (WCAG AA / Responsivo)** | `docs/accesibilidad.md` |
| **Licencia de Código y Documentación** | **Publicada (MIT / CC BY 4.0)** | `LICENSE` y `LICENSE-DOCS` |

---

## ℹ️ Aviso de Independencia Institucional y Atribución

> **EmprendeRural CyL es una herramienta independiente basada en datos abiertos.** Utiliza conjuntos publicados por la Junta de Castilla y León, el Instituto Nacional de Estadística (INE) y otras fuentes públicas, pero **no es un servicio oficial de la Administración autonómica ni sus resultados representan un pronunciamiento de esta**.
> 
> **Procedencia de los datos:** Portal de Datos Abiertos de la Junta de Castilla y León y otras fuentes públicas identificadas en cada ficha. La mención de los organismos productores no implica su participación, respaldo o validación del análisis realizado por EmprendeRural CyL.

---

## 🚀 Funcionalidades Principales

- 🗺️ **Mapa Interactivo de Viabilidad (IOE):** Visualización coroplética por provincias y municipios con el *Índice de Oportunidad Emprendedora (IOE)*.
- 🏬 **Análisis por Sectores:** Clasificación y filtrado de municipios según la actividad (Comercio y Alimentación, Taller Mecánico, Peluquería/Estética, Turismo Rural, Coworking/Servicios Digitales).
- 📊 **Calculadora Determinista de IOE:** Cálculo transparente compuesto por:
  - **INT (Índice de Necesidad Territorial - 45%):** Censo de población, índice de envejecimiento y distancia a cabeceras de comarca.
  - **IIS (Índice de Infraestructura y Conectividad - 30%):** Cobertura de banda ancha a 100 Mbps y accesibilidad digital.
  - **IDC (Índice de Densidad Comercial - 25%):** Ratio de comercios existentes por cada 1.000 habitantes.
- 📑 **Ficha Detallada Municipal:** Análisis exhaustivo por municipio con recomendaciones de implantación, factores favorables, reservas operativas y ayudas autonómicas aplicables.
- ⚖️ **Comparador Municipal:** Herramienta multitabla para contrastar hasta 4 municipios simultáneamente.
- 💶 **Buscador de Subvenciones y Ayudas (SGCyL):** Integración con líneas de ayudas de emprendimiento rural de la Junta de Castilla y León (LINEA EMPRENDE, PENSIONES / COMERCIO RURAL, BANDA ANCHA).
- 🧪 **Suite de Pruebas Automáticas:** Validación determinista de rangos, matrices de peso al 100% y ausencia de NaN.

---

## 🤖 Declaración Sobre la Inteligencia Artificial

> **Cálculo 100% Determinista:** La aplicación no utiliza inteligencia artificial ni llamadas a APIs generativas externas para calcular los índices, ordenar municipios o emitir recomendaciones. Las puntuaciones resultan de fórmulas matemáticas explícitas, auditables y transparentes.

Para más detalles, consulte [`docs/inteligencia-artificial.md`](docs/inteligencia-artificial.md).

---

## 🛠️ Arquitectura Técnica

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts (gráficos), Leaflet (mapeo territorial).
- **Backend Service:** Node.js / Express con `server.ts` para servir la API de diagnóstico y proxy de datos.
- **Engine Indicadores:** Módulos TypeScript puros bajo `src/indicators/` para cálculo y validación.
- **Build Tooling:** Vite, ESBuild, PostCSS, TypeScript (`tsc`).

---

## 📂 Estructura del Proyecto

```text
Emprende_cyl/
├── README.md                 # Documentación principal del repositorio
├── LICENSE                   # Licencia de código fuente (MIT)
├── LICENSE-DOCS              # Licencia de documentación (CC BY 4.0)
├── .env.example              # Plantilla de variables de entorno
├── server.ts                 # Servidor API / Express
├── src/
│   ├── components/           # Componentes UI (MapSection, MunicipalityDetail, ComparisonTable, GrantsPanel)
│   ├── indicators/           # Motor determinista de cálculo del IOE y pruebas
│   │   ├── ioe.ts            # Cálculo de IOE, INT e IIS
│   │   ├── weights.ts        # Validación de ponderaciones
│   │   ├── normalization.ts  # Escalado y protección contra división por cero
│   │   ├── reliability.ts    # Calibración de fiabilidad de fuentes
│   │   └── __tests__/        # Batería de pruebas unitarias
│   ├── data/                 # Datos censales, provincias, municipios, sectores y subvenciones
│   ├── types.ts              # Definiciones de tipos TypeScript
│   └── App.tsx               # Componente principal de la aplicación
├── docs/                     # Documentación técnica detallada
│   ├── metodologia-ioe.md    # Formulación matemática del IOE
│   ├── datasets.md           # Trazabilidad de fuentes de datos abiertas
│   ├── arquitectura.md       # Arquitectura del sistema
│   ├── accesibilidad.md      # Criterios de accesibilidad y UI
│   ├── limitaciones.md       # Límites de alcance del diagnóstico
│   ├── identidad-visual.md   # Criterios de independencia visual
│   └── inteligencia-artificial.md # Declaración de no dependencia generativa
```

---

## ⚙️ Variables de Entorno, Instalación y Pruebas Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/Emprende_cyl.git
   cd Emprende_cyl
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar Batería de Tests Automáticos:**
   ```bash
   npm test
   ```

4. **Ejecutar en entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:3000`.

5. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 📜 Licencias

- **Código fuente:** [Licencia MIT](LICENSE)
- **Documentación y Metodología:** [Creative Commons Atribución 4.0 Internacional (CC BY 4.0)](LICENSE-DOCS)

---

## 📄 Documentación Adicional

Consulta la carpeta [`docs/`](./docs/) para revisar en detalle la metodología del IOE, los datasets utilizados y las especificaciones arquitectónicas.
