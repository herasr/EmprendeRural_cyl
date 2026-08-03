import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Initialize Gemini client with proper User-Agent header for telemetry.
 */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "emprenderural-cyl",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Route: AI Copilot Consultant
  app.post("/api/consultant", async (req, res) => {
    try {
      const { sector, municipality, metrics, userQuestion } = req.body;

      if (!sector || !municipality || !metrics) {
        return res.status(400).json({ error: "Faltan parámetros obligatorios (sector, municipality, metrics)." });
      }

      const prompt = `
Eres un analista técnico sénior y consultor de la red de Agentes de Desarrollo Local y Cárceles de Empresas rurales de Castilla y León. Tu función es elaborar un dictamen técnico riguroso, realista y estrictamente objetivo sobre la viabilidad del proyecto comercial propuesto.

CRÍTICO - ESTILO FORMAL Y TÉCNICO:
- NO des saludos ni introducciones informales como "¡Hola!" o "Espero que este informe te sirva".
- NO uses adjetivos vacíos de marketing ("maravilloso", "revolucionario", "fascinante", "el éxito está garantizado"). Sin tono de autoayuda o entusiasmo impostado.
- Redacta de forma directa, analítica y técnica (empleando vocabulario administrativo y económico común en informes de viabilidad municipales, similar al de un técnico de la Junta de Castilla y León o de una Cámara de Comercio).
- El informe DEBE iniciar directamente con el título de la sección, sin explicaciones previas ni preámbulos robóticos.

DATOS DEL ENTORNO LOCALIZADO:
- Municipio dador: ${municipality.name} (${municipality.province}, Castilla y León)
- Censo poblacional: ${municipality.population} habitantes (Tasa de variación 5 años: ${municipality.populationGrowth5Y}%)
- Edad media calculada: ${municipality.avgAge} años (Población mayor de 65 años: ${municipality.age65PlusPct}%, Cohorte activa 25-55 años: ${municipality.age25To55Pct}%)
- Capacidad de banda ancha: ${municipality.connectivitySpeed} Mbps de velocidad máxima de fibra o similar
- Recursos alojativos: ${municipality.touristBeds} plazas hoteleras/rurales registradas
- Número de operadores del mismo sector vigentes en el núcleo: ${municipality.activeBusinesses[sector.id]}

PROYECTO SUBYACENTE:
- Sector: ${sector.name}
- Concepto de oferta: ${sector.description}

MODELO DE CÁLCULO DE OPORTUNIDAD EMPRENDEDORA (ÍNDICE IOE - Escala 0-100):
- PUNTUACIÓN GENERAL RESULTANTE: ${metrics.score}/100 (Catalogación de oportunidad: "${metrics.level}")
- Desglose detallado de variables de entrada del índice:
  * Valor de Demanda Potencial estimada (V1): ${metrics.v1_demanda}/100
  * Coeficiente de Déficit Comercial local (V2): ${metrics.v2_deficit}/100
  * Nivel de Competencia (V3): ${metrics.v3_competencia}/100
  * Tendencia Poblacional ponderada (V4): ${metrics.v4_demografia}/100
  * Ajuste Demográfico del tipo de usuario (V5): ${metrics.v5_poblacion_obj}/100
  * Infraestructura Digital (V6): ${metrics.v6_conectividad}/100
  * Puntuación de Ayudas (V7): ${metrics.v7_ayudas}/100
  * Tracción del Entorno Turístico (V8): ${metrics.v8_turismo}/100

${userQuestion ? `CONSULTA ADICIONAL ESPECÍFICA FORMULADA POR EL SOLICITANTE:\n"${userQuestion}"\n` : ""}

ESTRUCTURA OBLIGATORIA DEL DICTAMEN (Usa Markdown):

## 1. Informe Técnico de Viabilidad y Diagnóstico de Demanda
Explica desde un punto de vista puramente técnico por qué el proyecto obtiene un IOE de ${metrics.score}/100 basándote en los datos de población, tasa demográfica (${municipality.populationGrowth5Y}%), edad promedio de ${municipality.avgAge} años y el nivel competitivo existente (${municipality.activeBusinesses[sector.id]} competidores). Justifica las debilidades y fortalezas físicas de la ubicación de forma razonada.

## 2. Recomendaciones de Adaptación Local de la Oferta
Establece modificaciones concretas que la iniciativa comercial debería contemplar para encajar con la realidad socioeconómica local. Si el envejecimiento es elevado (${municipality.age65PlusPct}%), detalla servicios asistidos o logística domiciliaria. Si cuenta con tracción turística (${municipality.touristBeds} plazas), asocia ideas para capturar parte de ese flujo estacional.

## 3. Posicionamiento ante Operadores Preexistentes
Propón una estrategia de diferenciación realista considerando los ${municipality.activeBusinesses[sector.id]} operadores activos en el término municipal. Si no hay ninguno, advierte de las razones por las cuales otros pudieron cerrar y cómo mitigar ese riesgo.

## 4. Secuencia Administrativa y Ayudas Sugeridas
Indica subvenciones autonómicas reales o consorcios de desarrollo (ej. LEADER, ayudas al autoempleo de la Junta / ECYL) viables para este perfil. Define un plan de acción pragmático de 3 tareas iniciales en el terreno físico para validar la iniciativa antes de incurrir en gastos de constitución.
`;

      let response;
      const maxRetries = 3;
      let lastError = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
              temperature: 0.7,
            },
          });
          break; // Success
        } catch (err: any) {
          lastError = err;
          console.warn(`[Gemini API] Attempt ${attempt} failed:`, err?.message || err);
          if (attempt < maxRetries) {
            // Wait 1.5s * attempt before retrying
            await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
          }
        }
      }

      if (!response) {
        throw lastError || new Error("No response from Gemini model after retries.");
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Processing Error:", error);
      res.status(500).json({ error: "Error interno al comunicarse con el servicio de procesamiento." });
    }
  });

  // Serve static UI assets under Vite vs Production fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EmprendeRural CyL] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
