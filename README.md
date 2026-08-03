# EmprendeRural CyL 🌾📊

**Plataforma de Viabilidad Territorial y Radar de Oportunidades para Emprendedores Rurales en Castilla y León.**

Herramienta técnica de análisis territorial que reutiliza conjuntos de datos abiertos de Castilla y León para detectar prioridades no cubiertas y evaluar la viabilidad inicial de implantación de negocios en municipios rurales.

---

## 🌐 Aplicación Pública

- **Despliegue Principal:** [https://emprenderural-cyl.pages.dev/](https://emprenderural-cyl.pages.dev/)

---

## ℹ️ Aviso de Independencia Institucional y Atribución

> **EmprendeRural CyL es una herramienta independiente basada en datos abiertos.** Utiliza conjuntos publicados por la Junta de Castilla y León, el Instituto Nacional de Estadística (INE) y otras fuentes públicas, pero **no es un servicio oficial de la Administración autonómica ni sus resultados representan un pronunciamiento de esta**.
> 
> **Procedencia de los datos:** Portal de Datos Abiertos de la Junta de Castilla y León y otras fuentes públicas identificadas en cada ficha. La mención de los organismos productores no implica su participación, respaldo o validación del análisis realizado por EmprendeRural CyL.

---

## 🚀 Funcionalidades Principales

- 🗺️ **Mapa Interactivo de Viabilidad (IOE):** Visualización coroplética por provincias y municipios con el *Índice de Oportunidad Emprendedora (IOE)*.
- 🏬 **Análisis por Sectores:** Clasificación y filtrado de municipios según la actividad (Comercio y Alimentación, Hostelería, Servicios a Personas, Cuidados y Senior, Servicios Técnicos, Turismo Rural).
- 📊 **Calculadora Determinista de IOE:** Cálculo transparente compuesto por:
  - **INT (Índice de Necesidad Territorial - 45%):** Censo de población, índice de envejecimiento y distancia a cabeceras de comarca.
  - **IIS (Índice de Infraestructura y Conectividad - 30%):** Cobertura de banda ancha a 100 Mbps y accesibilidad digital.
  - **IDC (Índice de Densidad Comercial - 25%):** Ratio de comercios existentes por cada 1.000 habitantes.
- 📑 **Ficha Detallada Municipal:** Análisis exhaustivo por municipio con recomendaciones de implantación, factores favorables, reservas operativas y ayudas autonómicas aplicables.
- ⚖️ **Comparador Municipal:** Herramienta multitabla para contrastar hasta 4 municipios simultáneamente.
- 💶 **Buscador de Subvenciones y Ayudas (SGCyL):** Integración con líneas de ayudas de emprendimiento rural de la Junta de Castilla y León (LINEA EMPRENDE, PENSIONES / COMERCIO RURAL, BANDA ANCHA).
- 📑 **Generador de Dictamen de Viabilidad Técnico:** Generación asistida de diagnósticos detallados para agentes de desarrollo local.

---

## 🛠️ Arquitectura Técnica

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts (gráficos), Leaflet (mapeo territorial).
- **Backend Service:** Node.js / Express con `server.ts` para servir la API de diagnóstico y proxy de datos.
- **Build Tooling:** Vite, ESBuild, PostCSS, TypeScript (`tsc`).

---

## 📂 Estructura del Proyecto

```text
Emprende_cyl/
├── README.md                 # Documentación principal del repositorio
├── LICENSE                   # Licencia de código (MIT)
├── .env.example              # Plantilla de variables de entorno
├── server.ts                 # Servidor API / Express
├── src/
│   ├── components/           # Componentes UI (MapSection, MunicipalityDetail, ComparisonTable, GrantsPanel, MethodologyModal)
│   ├── data/                 # Datos censales, provincias, municipios, sectores y subvenciones
│   ├── types.ts              # Definiciones de tipos TypeScript
│   ├── index.css             # Estilos globales con Tailwind CSS
│   └── App.tsx               # Componente principal de la aplicación
├── docs/                     # Documentación técnica detallada
│   ├── metodologia-ioe.md    # Formulación matemática del IOE
│   ├── datasets.md           # Trazabilidad de fuentes de datos abiertas
│   ├── arquitectura.md       # Arquitectura del sistema y flujo de datos
│   ├── accesibilidad.md      # Criterios de accesibilidad y UI
│   └── identidad-visual.md   # Criterios de independencia e identidad propia
```

---

## ⚙️ Variables de Entorno e Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/Emprende_cyl.git
   cd Emprende_cyl
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo `.env.example` a `.env` y configura los parámetros según tu entorno:
   ```bash
   cp .env.example .env
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

## 📜 Licencia

- **Código fuente:** [Licencia MIT](LICENSE)
- **Documentación y Metodología:** Creative Commons Atribución 4.0 Internacional (CC BY 4.0)

---

## 📄 Documentación Adicional

Consulta la carpeta [`docs/`](./docs/) para revisar en detalle la metodología del IOE, los datasets utilizados y las especificaciones arquitectónicas.
