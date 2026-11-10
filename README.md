# Halo

Maqueta navegable de **Vítaly Halo**, plataforma de autoprotección y emergencias para centros de trabajo.

**Demo online:** https://wmunny.github.io/halo/

Es una aplicación **solo frontend** (React + Vite + Tailwind): no tiene backend ni claves de API y no hace llamadas a servicios de IA ni a ningún otro servicio externo. Todos los datos son ficticios o sintéticos.

## Módulos

| Módulo | Qué muestra |
| --- | --- |
| Dashboard | Visión global del centro: KPIs, cumplimiento y alertas. |
| Halo Logic | Generación del PAU y análisis normativo por CCAA (simulado). |
| Halo Sim | Gemelo digital de evacuación. En la demo, el plano IFC y los resultados están **precalculados** con JuPedSim (Planta Industrial Barcelona). El asistente de casos funciona con reglas en el navegador. |
| Halo Connect | Mantenimiento de medios de protección (QR, RIPCI). |
| Halo Training | Formación y entrega del PAU. Permite **importar el listado de trabajadores desde un CSV**. |
| Halo Vision | Visionado de las cámaras del centro, con vídeos de demostración y sin análisis. |

### Importar trabajadores (CSV)

En *Halo Training → Trabajadores → Importar CSV*:

- Primera fila con cabeceras; separador `;` o `,`; UTF-8 o Windows-1252 (Excel).
- Columnas: `nombre` (obligatoria), `apellidos`, `dni`, `email`, `telefono`, `departamento`, `puesto`, `turno` (mañana/tarde/noche), `rol` (Trabajador, Jefe de Emergencia, EPI, ESI, EPA, EAE…), `fecha_alta`.
- Hay un botón para descargar una plantilla de ejemplo.
- El archivo se lee en el navegador y el listado se guarda solo en ese navegador (`localStorage`). No se sube a ningún servidor. Con *Restaurar demo* vuelves a los datos de ejemplo.

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ (con base /halo/ para GitHub Pages)
```

## Publicación

Cada push a `main` compila la web y la publica en GitHub Pages con el workflow `.github/workflows/pages.yml`.
