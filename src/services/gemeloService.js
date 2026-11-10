/**
 * Gemelo digital de evacuación: reúne los datos de Halo (plantilla y equipos del plan, medios de protección de
 * Connect, plano IFC aprobado) y, en esta demo, sirve resultados precalculados con el motor JuPedSim (sin backend ni llamadas externas).
 *
 * Privacidad: al motor solo llegarían SEUDÓNIMOS. La correspondencia seudónimo → persona se calcula aquí, en el
 * navegador del técnico, para mostrar nombres en los resultados sin que salgan de Halo.
 */
import { trabajadoresPorCentro, etiquetasRolPAU } from '../data/trainingMockData';
import { inventory } from '../data/connectMockData';

// API del gemelo en modo demo (sin servidor): mismas funciones que la API local original.
export { api, esperarTrabajo } from './gemeloDemo';


// Inventario de Connect: en la demo pertenece a la Planta Industrial Barcelona.
const INVENTARIO_POR_CENTRO = { 'bcn-001': inventory };

export const TURNOS = ['mañana', 'tarde', 'noche'];

export const normalizar = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

function fnv(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function seudonimo(centroId, trabajadorId) {
  return `P-${fnv(`${centroId}|${trabajadorId}`).slice(0, 6).toUpperCase()}`;
}

// Departamento → posibles nombres de recinto en el IFC.
const SINONIMOS = {
  'producción': ['produccion', 'fabricacion', 'taller', 'nave'],
  'logística': ['expediciones', 'logistica', 'muelle'],
  transporte: ['expediciones', 'logistica', 'muelle'],
  'almacén': ['almacen'],
  mantenimiento: ['mantenimiento', 'taller'],
  calidad: ['calidad', 'laboratorio'],
  'administración': ['oficina', 'administracion'],
};
const OFICINA = ['oficina', 'despacho', 'administracion'];

export function recintoDeDepartamento(departamento, recintos) {
  const claves = SINONIMOS[departamento.toLowerCase()] || [normalizar(departamento), ...OFICINA];
  for (const k of claves) {
    const r = recintos.find((x) => normalizar(x.nombre).includes(k) || normalizar(x.uso).includes(k));
    if (r) return r.nombre;
  }
  return '';
}

function perfilDe(recinto, departamento) {
  const t = normalizar(`${recinto} ${departamento}`);
  if (/almacen|expedicion|logistic|muelle/.test(t)) return 'almacen';
  if (/mantenimiento|taller/.test(t)) return 'taller';
  if (/produccion|fabric|nave/.test(t)) return 'produccion';
  if (/vestuario/.test(t)) return 'vestuario';
  return 'oficina';
}

/** Trabajadores del centro con su correspondencia local (para mostrar nombres en pantalla). */
export function trabajadoresCentro(centroId) {
  return (trabajadoresPorCentro[centroId] || []).filter((t) => t.estado !== 'baja');
}

export function resumenTurnos(centroId) {
  const out = {};
  for (const t of trabajadoresCentro(centroId)) {
    const k = t.turno || 'mañana';
    out[k] = out[k] || { personas: 0, equipo: 0, ayuda: 0 };
    out[k].personas += 1;
    if (t.rolPAU && t.rolPAU !== 'trabajador') out[k].equipo += 1;
    if (t.necesidadEvacuacion?.ayuda) out[k].ayuda += 1;
  }
  return out;
}

/**
 * Plantilla del turno lista para el motor: solo seudónimo, zona, turno, perfil, movilidad, ayuda, apoyo y rol.
 * Devuelve también el diccionario local seudónimo → {nombre, rol} para pintar los resultados.
 */
export function plantillaSeudonimizada(centroId, turno, recintos) {
  const todos = trabajadoresCentro(centroId);
  const lista = turno ? todos.filter((t) => (t.turno || 'mañana') === turno) : todos;
  const local = {};
  const registros = lista.map((t) => {
    const id = seudonimo(centroId, t.id);
    const zona = recintoDeDepartamento(t.departamento || '', recintos || []);
    local[id] = { nombre: `${t.nombre} ${t.apellidos || ''}`.trim(), rol: etiquetasRolPAU[t.rolPAU] || 'Trabajador',
      departamento: t.departamento, puesto: t.puesto };
    const ne = t.necesidadEvacuacion;
    return {
      id, zona, turno: t.turno || 'mañana', perfil: perfilDe(zona, t.departamento || ''),
      movilidad: ne?.movilidad === 'reducida' ? 'reducida' : 'normal',
      necesita_ayuda: !!ne?.ayuda, apoyo: ne?.apoyo ? seudonimo(centroId, ne.apoyo) : null,
      rol: t.rolPAU || 'trabajador',
    };
  });
  return { registros, local };
}

/** Medios de protección (Connect) con su estado de mantenimiento, en coordenadas del plano. */
export function mediosProteccion(centroId) {
  return (INVENTARIO_POR_CENTRO[centroId] || []).filter((a) => a.coordenadas).map((a) => ({
    id: a.id, tipo: a.tipo, nombre: a.nombre, estado: a.estado, x: a.coordenadas.x, y: a.coordenadas.y,
    ubicacion: a.ubicacion, proxima_revision: a.proximaRevision,
  }));
}

export const USO_CENTRO = { industrial: 'industrial', almacen: 'industrial', oficinas: 'administrativo' };
