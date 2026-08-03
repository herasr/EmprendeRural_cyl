# Metodología del Índice de Oportunidad Emprendedora (IOE)

Este documento detalla la formulación matemática, ponderaciones y criterios deterministas utilizados por **EmprendeRural CyL** para calcular el riesgo e idoneidad territorial de proyectos en municipios rurales de Castilla y León.

---

## 📐 Estructura del Índice (IOE)

El **Índice de Oportunidad Emprendedora (IOE)** pondera tres subíndices clave en una escala normalizada de 0 a 100:

$$\text{IOE} = (\text{INT} \times 0.45) + (\text{IIS} \times 0.30) + (\text{IDC} \times 0.25)$$

Donde:
- **INT (Índice de Necesidad Territorial):** 45% del peso total.
- **IIS (Índice de Infraestructura y Conectividad):** 30% del peso total.
- **IDC (Índice de Densidad Comercial):** 25% del peso total.

---

## 1. Índice de Necesidad Territorial (INT) - 45%

Calcula el grado de demanda insatisfecha y la necesidad social del servicio en el municipio.

$$\text{INT} = f(\text{Población}, \text{Índice Envejecimiento}, \text{Aislamiento Distancia})$$

### Factores de Ponderación:
1. **Población Absoluta:** Municipios con una población crítica (entre 300 y 3.000 habitantes) reciben mayor puntuación al contar con demanda mínima solvente sin masificación de oferta.
2. **Tasa de Envejecimiento (% > 65 años):** Pondera positivamente la demanda de servicios a domicilio, farmacia, alimentación cercana y atención a la dependencia.
3. **Distancia a Cabecera de Comarca:** A mayor distancia (en km o tiempo) a un centro urbano principal, mayor es la necesidad de servicios locales de proximidad.

---

## 2. Índice de Infraestructura y Conectividad (IIS) - 30%

Mide la viabilidad operativa y tecnológica para que el negocio funcione con garantías.

$$\text{IIS} = f(\text{Cobertura Banda Ancha 100Mbps}, \text{Conectividad Móvil 4G/5G}, \text{Accesibilidad Viaria})$$

### Componentes:
- **Cobertura 100 Mbps (% viviendas conectadas):** Requisito crítico para facturación digital, cobro con tarjeta, gestión de inventarios y trámites con la administración.
- **Cobertura Móvil:** Garantiza la operativa de repartos y comunicaciones con clientes.

---

## 3. Índice de Densidad Comercial y Competencia (IDC) - 25%

Evalúa el nivel de competencia actual para la actividad seleccionada en el municipio.

$$\text{IDC} = 100 - \left( \frac{\text{Locales del sector}}{\text{Población} / 1000} \times K_{\text{sector}} \right)$$

### Interpretación:
- Si no existen locales del sector en el municipio o el ratio por 1.000 hab. es significativamente inferior a la media regional, el IDC se aproxima a 100 (alta oportunidad por hueco de mercado).
- Si existe saturación comercial, el subíndice disminuye para reflejar menor margen de cuota.

---

## 📊 Escala de Clasificación Final

| Rango IOE | Clasificación | Interpretación |
| :--- | :--- | :--- |
| **80 - 100** | **Prioridad Alta / Oportunidad Clara** | Alta necesidad insatisfecha, excelente conectividad y competencia baja o nula. |
| **60 - 79** | **Viabilidad Estimable** | Buenas condiciones para la implantación con seguimiento de variables de mercado. |
| **40 - 59** | **Viabilidad Moderada / Condicionada** | Requiere análisis detallado de costes fijos, transporte o especialización. |
| **0 - 39** | **Reserva Operativa / Riesgo Alto** | Limitaciones estructurales (demografía reducida, conectividad deficiente o saturación). |

---

## 🛡️ Principios Deterministas y Transparencia

1. **Sin Cajas Negras:** Todo valor de IOE mostrado en la plataforma deriva directamente de los datos censales y de infraestructura sin manipulación oculta.
2. **Carácter Orientativo:** El resultado constituye un primer filtro de oportunidad territorial y no sustituye un plan económico-financiero ni un estudio de mercado sobre el terreno.
