/**
 * Gemelo digital en MODO DEMO: imita la API del motor de evacuación sin servidor.
 *
 * - Plano, inspección, historial y resultados salen de /demo/sim (datos SINTÉTICOS precalculados con JuPedSim).
 * - "Simular" elige el resultado precalculado más parecido al escenario pedido (tipo y turno).
 * - El asistente de casos usa un intérprete por reglas que funciona en el navegador.
 * - No hay claves, ni backend, ni llamadas a servicios externos: solo se leen ficheros estáticos de la propia web.
 */

const BASE = `${import.meta.env.BASE_URL}demo/sim/`;
const CENTRO_DEMO = 'bcn-001';
const DURACION_TRABAJO_MS = 2500;

const cache = new Map();
async function estatico(ruta) {
  if (!cache.has(ruta)) {
    cache.set(ruta, fetch(`${BASE}${ruta}`).then((r) => {
      if (!r.ok) throw new Error(`Dato de demo no disponible (${ruta})`);
      return r.json();
    }).catch((e) => { cache.delete(ruta); throw e; }));
  }
  return structuredClone(await cache.get(ruta));
}

const clonar = (x) => structuredClone(x);
const esDemo = (c) => c === CENTRO_DEMO;
const noDisponible = (que) => Promise.reject(new Error(
  `${que} necesita el motor de simulación local. En esta demo online se trabaja con el plano y los resultados precalculados de la Planta Industrial Barcelona.`,
));

// ── Estado de la sesión (en memoria; se pierde al recargar) ────────────
const sesion = {
  planos: null,          // lista de planos de bcn-001 (con cambios de la sesión)
  simulaciones: null,    // historial (precalculadas + lanzadas en la sesión)
  simulacros: null,      // simulacros reales registrados
  alias: {},             // id de simulación de la sesión → id del resultado precalculado
  extras: {},            // id de simulación de la sesión → { nombre, aviso }
  trabajos: {},          // id → { inicio, texto }
};

async function planosDemo() {
  if (!sesion.planos) sesion.planos = await estatico('planos.json');
  return sesion.planos;
}
async function simulacionesDemo() {
  if (!sesion.simulaciones) sesion.simulaciones = await estatico('simulaciones.json');
  return sesion.simulaciones;
}
async function simulacrosDemo() {
  if (!sesion.simulacros) sesion.simulacros = await estatico('simulacros.json');
  return sesion.simulacros;
}

function nuevoTrabajo(texto) {
  const id = `job-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  sesion.trabajos[id] = { inicio: Date.now(), texto };
  return { id, estado: 'en_curso', progreso: 0, texto };
}

function tipoDeEscenario(esc = {}) {
  if (esc.tipo && esc.tipo !== 'personalizado') return esc.tipo;
  if (esc.incendio) return 'incendio';
  if (esc.accidente) return 'accidente';
  if ((esc.salidas_bloqueadas || []).length) return 'bloqueo';
  return 'ordinaria';
}

// ── Intérprete de casos por reglas (portado del motor local) ───────────
const normalizar = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

function buscar(lista, texto) {
  const t = normalizar(texto);
  return [...lista].sort((a, b) => b.length - a.length).find((n) => t.includes(normalizar(n))) || null;
}

function porPalabras(lista, fragmento) {
  const palabras = normalizar(fragmento).split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  let mejor = null;
  let puntos = 0;
  for (const n of lista) {
    const nn = normalizar(n);
    const p = palabras.filter((w) => nn.includes(w)).length;
    if (p > puntos) { mejor = n; puntos = p; }
  }
  return mejor;
}

function interpretarReglas(texto, ctx) {
  const t = normalizar(texto);
  const recintos = ctx.recintos || [];
  const salidas = ctx.salidas || [];
  const esc = { tipo: 'personalizado', salidas_bloqueadas: [] };
  const explicacion = [];
  const tras = (claves) => {
    for (const c of claves) {
      const i = t.indexOf(c);
      if (i >= 0) return t.slice(i + c.length, i + c.length + 60);
    }
    return null;
  };
  if (/incendio|fuego|humo|llamas/.test(t)) {
    const frag = tras(['incendio en', 'fuego en', 'incendio del', 'incendio de', 'humo en']) || t;
    const zona = buscar(recintos, frag) || porPalabras(recintos, frag);
    if (zona) {
      esc.incendio = { zona };
      explicacion.push(`Incendio en ${zona}.`);
    } else {
      explicacion.push('Hay un incendio, pero no reconozco el recinto: márcalo en el plano.');
      esc.incendio = { pendiente_punto: true };
    }
    if (/rapido|propagacion rapida|mucho humo/.test(t)) {
      esc.incendio.velocidad_humo_m_s = 0.5;
      explicacion.push('Propagación de humo rápida (0,5 m/s, esquemática).');
    }
  }
  for (const s of salidas) {
    const ns = normalizar(s);
    const frases = [`${ns} bloqueada`, `${ns} cerrada`, `${ns} inutilizada`, `bloqueada la ${ns}`, `bloqueo de la ${ns}`, `sin la ${ns}`];
    if (frases.some((f) => t.includes(f))) esc.salidas_bloqueadas.push(s);
  }
  if (!esc.salidas_bloqueadas.length && /bloquead|cerrad|inutiliz|obstruid/.test(t)) {
    const frag = tras(['bloqueada la', 'bloqueada', 'cerrada la', 'salida']) || t;
    const s = porPalabras(salidas, `salida ${frag}`);
    if (s) esc.salidas_bloqueadas.push(s);
  }
  if (esc.salidas_bloqueadas.length) explicacion.push(`Salidas bloqueadas: ${esc.salidas_bloqueadas.join(', ')}.`);
  if (/herid|accident|atrapad|desmay|lesionad|caid|inconscien/.test(t)) {
    const frag = tras(['herido en', 'accidente en', 'atrapado en', 'lesionado en', 'caida en', 'herida en']) || t;
    const zona = buscar(recintos, frag) || porPalabras(recintos, frag);
    const m = t.match(/(\d+)\s+herid/);
    const heridos = m ? Math.min(5, Number(m[1])) : (/dos herid/.test(t) ? 2 : 1);
    esc.accidente = zona ? { zona, heridos } : { pendiente_punto: true, heridos };
    explicacion.push(zona ? `${heridos} herido(s) en ${zona}: lo atiende el EPA más cercano.` : 'Hay un herido: marca en el plano dónde está.');
  }
  const ma = t.match(/alarma[^0-9]{0,30}(\d+)\s*(s|seg|segundos|min|minutos)/);
  if (ma) {
    const seg = Number(ma[1]) * (ma[2].startsWith('min') ? 60 : 1);
    if (esc.incendio) esc.incendio.alarma_s = seg; else esc.alarma_s = seg;
    explicacion.push(`La alarma suena ${seg} s después de iniciarse el suceso.`);
  }
  if (!esc.incendio && !esc.accidente && !esc.salidas_bloqueadas.length) {
    esc.tipo = 'ordinaria';
    explicacion.push('No reconozco incendio, bloqueo ni accidente: se simula una evacuación ordinaria.');
  }
  esc.nombre = texto.length > 70 ? `${texto.slice(0, 67)}…` : texto;
  return { escenario: esc, explicacion, motor: 'reglas' };
}

// ── API (misma forma que la del motor local) ───────────────────────────
export const api = {
  estado: async () => ({ motor: true, demo: true, asistente: 'reglas' }),

  planos: async (c) => (esDemo(c) ? clonar(await planosDemo()) : []),
  subirPlano: () => noDisponible('Subir e inspeccionar un plano'),
  urlArchivo: (c, id) => (esDemo(c) && id === 'demo-ifc' ? `${BASE}planta_barcelona.ifc` : '#'),
  inspeccion: async (c, id) => {
    if (!esDemo(c) || id !== 'demo-ifc') throw new Error('Inspección no disponible en la demo');
    return estatico('inspeccion-demo-ifc.json');
  },
  revisar: async (c, id, cambios = {}) => {
    const corrige = cambios.planta !== undefined || cambios.salidas_manuales || cambios.salidas_descartadas;
    if (corrige) return noDisponible('Corregir el plano y volver a inspeccionarlo');
    const lista = await planosDemo();
    const p = lista.find((x) => x.id === id);
    if (!p) throw new Error('Plano IFC no encontrado');
    if (cambios.aprobar) Object.assign(p, { estado: 'aprobado', activo: true, aprobado: new Date().toISOString() });
    return { plano: clonar(p), trabajo: null };
  },
  borrarPlano: () => noDisponible('Borrar el plano de demostración'),

  simular: async (c, cuerpo = {}) => {
    if (!esDemo(c)) throw new Error('El centro no tiene un plano IFC aprobado. La demo incluye el de la Planta Industrial Barcelona.');
    const lista = await simulacionesDemo();
    const precalc = lista.filter((s) => !sesion.alias[s.id]);
    const tipo = tipoDeEscenario(cuerpo.escenario);
    const turno = cuerpo.turno || 'mañana';
    const puntuar = (s) => (s.tipo === tipo ? 2 : 0) + (s.turno === turno ? 1 : 0);
    const elegido = [...precalc].sort((a, b) => puntuar(b) - puntuar(a))[0];
    if (!elegido) throw new Error('No hay resultados precalculados en la demo.');

    const id = `sim-demo-${Date.now().toString(36)}`;
    sesion.alias[id] = elegido.id;
    const exacto = elegido.tipo === tipo && elegido.turno === turno;
    sesion.extras[id] = {
      aviso: `DEMO: resultado precalculado con JuPedSim para el escenario «${elegido.escenario}» (turno de ${elegido.turno})${
        exacto ? '' : ', el más parecido al caso pedido'}. La demo online no ejecuta el motor.`,
    };
    lista.unshift({ ...elegido, id, fecha: new Date().toISOString() });
    return { id, trabajo: nuevoTrabajo('Preparando la simulación…') };
  },
  simulaciones: async (c) => (esDemo(c) ? clonar(await simulacionesDemo()) : []),
  resultado: async (c, id) => {
    if (!esDemo(c)) throw new Error('Resultado no disponible');
    const origen = sesion.alias[id] || id;
    const res = await estatico(`resultados/${origen}.json`);
    const extra = sesion.extras[id];
    if (extra) res.aviso = `${extra.aviso} ${res.aviso || ''}`.trim();
    return res;
  },

  simulacros: async (c) => (esDemo(c) ? clonar(await simulacrosDemo()) : []),
  guardarSimulacro: async (c, s) => {
    if (!s?.fecha || !s?.tiempo_total_s) throw new Error('Un simulacro necesita al menos fecha y tiempo total medido (s).');
    if (JSON.stringify(s).match(/"(dni|email|telefono|apellidos)"/)) throw new Error('El simulacro no puede contener datos personales.');
    const nuevo = { ...s, id: s.id || `SIM-${s.fecha}-${Math.random().toString(16).slice(2, 6)}`, centro: c, registrado: new Date().toISOString() };
    if (esDemo(c)) (await simulacrosDemo()).push(nuevo);
    return clonar(nuevo);
  },
  borrarSimulacro: async (c, id) => {
    if (esDemo(c)) sesion.simulacros = (await simulacrosDemo()).filter((s) => s.id !== id);
    return { ok: true };
  },
  calibrar: () => noDisponible('Calibrar el modelo con simulacros'),
  calibracion: async () => ({
    parametros: {},
    validacion: { nivel: 0, nivel_texto: 'Parámetros ilustrativos (sin simulacros)', demostracion: false, contraste: [], avisos: [] },
  }),
  referencia: async () => ({ simulacros: 0, centros: 0, usos: [] }),

  interpretar: async (texto, contexto) => {
    if (!texto || !String(texto).trim()) throw new Error('Describe el caso que quieres simular.');
    return interpretarReglas(String(texto).slice(0, 2000), contexto || {});
  },

  trabajo: async (id) => {
    const t = sesion.trabajos[id];
    if (!t) throw new Error('Trabajo no encontrado');
    const progreso = Math.min(100, Math.round(((Date.now() - t.inicio) / DURACION_TRABAJO_MS) * 100));
    if (progreso >= 100) {
      delete sesion.trabajos[id];
      return { id, estado: 'terminado', progreso: 100, texto: 'Simulación terminada' };
    }
    const texto = progreso < 30 ? 'Cargando plano y plantilla seudonimizada…'
      : progreso < 75 ? 'Calculando realizaciones Monte Carlo…' : 'Preparando resultados…';
    return { id, estado: 'en_curso', progreso, texto };
  },
};

/** Espera a que termine un trabajo, informando del progreso. */
export async function esperarTrabajo(id, alProgreso) {
  for (;;) {
    const t = await api.trabajo(id);
    if (alProgreso) alProgreso(t);
    if (t.estado === 'terminado') return t;
    if (t.estado === 'error') throw new Error(t.error || 'Error en el motor');
    await new Promise((r) => setTimeout(r, 300));
  }
}
