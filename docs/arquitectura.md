# Especificaciones de Arquitectura del Sistema

## 🏗️ Resumen Arquitectónico

**EmprendeRural CyL** está estructurada como una aplicación web full-stack moderna construida en TypeScript, optimizada para rendimiento, accesibilidad y facilidad de despliegue.

```text
[ Cliente Navegador (React 18 + SPA) ]
       │
       ├── Operaciones de Mapeo y UI (Leaflet, Recharts, Tailwind)
       ├── Motor Determinista de IOE (Cálculo cliente para 2,248 municipios)
       │
       ▼
[ Servidor API (Node.js + Express en server.ts) ]
       │
       ├── Endpoint /api/diagnostico-viabilidad (Generación de dictamen asistido)
       └── Proxy seguro y gestión de cabeceras de producción
```

---

## 💻 Capa Frontend

- **React 18 & TypeScript:** Estructura modular y tipado estricto (`/src/types.ts`).
- **Tailwind CSS:** Diseño accesible y adaptativo sin dependencias pesadas de UI externas.
- **Leaflet & React-Leaflet:** Renderizado coroplético de municipios y provincias de Castilla y León.
- **Recharts:** Visualizaciones interactivas de población, brecha comercial e indicadores de infraestructura.

---

## ⚙️ Capa Backend y Servidor

- **Entry Point:** `server.ts` ejecutado mediante Node.js / Express.
- **Producción:** Empaquetado en un archivo único `dist/server.cjs` mediante ESBuild (`npm run build`).
- **Modo Desarrollo:** Ejecución ágil con `tsx server.ts` y middleware integrado de Vite.

---

## 📦 Scripts de Compilación (`package.json`)

- `npm run dev`: Inicia el servidor de desarrollo en puerto 3000.
- `npm run build`: Ejecuta `vite build` y compila `server.ts` con ESBuild a CommonJS (`dist/server.cjs`).
- `npm run start`: Inicia el servidor de producción compilado (`node dist/server.cjs`).
- `npm run lint`: Valida tipos TypeScript con `tsc --noEmit`.
