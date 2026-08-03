# Declaración de Uso de Inteligencia Artificial

Este documento define con precisión el rol y alcance de las tecnologías en **EmprendeRural CyL**.

---

## 🔒 Ausencia de Dependencias Generativas en Ejecución

1. **Cálculo Determinista y Auditable:** El *Índice de Oportunidad Emprendedora (IOE)*, sus tres subíndices (INT, IIS, IDC) y los filtros por sectores económicos se calculan mediante fórmulas matemáticas puras y matrices de ponderación estáticas.
2. **Sin Llamadas a API de Modelos de Lenguaje (LLMs):** La aplicación no ejecuta llamadas a modelos como Gemini, GPT o Claude durante el uso por parte del usuario. No existen dependencias como `@google/genai` ni claves secretas de API en ejecución.
3. **Reproducibilidad Garantizada:** Ante los mismos datos de censo, banda ancha y densidad comercial, el resultado del IOE para cualquier municipio de Castilla y León es 100% idéntico y verificable de forma determinista.
4. **Plantilla de Desarrollo:** Aunque el repositorio proviene de una plantilla estándar de desarrollo compatible con herramientas asistidas, la versión candidata publicada funciona en su totalidad de forma independiente, autónoma y sin servicios generativos externos.
