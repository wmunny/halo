/**
 * Importación de listados de trabajadores desde CSV (todo en el navegador, nada sale del equipo).
 * Acepta separador ";" (Excel en español) o ",", comillas dobles y cabeceras con o sin tildes.
 */
import { etiquetasRolPAU, rolesPAU } from '../data/trainingMockData';

const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Cabecera del CSV → campo del trabajador
const ALIAS = {
  nombre: ['nombre', 'name', 'nombre completo'],
  apellidos: ['apellidos', 'apellido', 'surname', 'apellido1 apellido2'],
  dni: ['dni', 'nif', 'nie', 'documento', 'id'],
  email: ['email', 'e-mail', 'correo', 'correo electronico', 'mail'],
  telefono: ['telefono', 'tel', 'movil', 'phone'],
  departamento: ['departamento', 'area', 'seccion', 'department'],
  puesto: ['puesto', 'cargo', 'puesto de trabajo', 'categoria', 'job'],
  turno: ['turno', 'shift'],
  rolPAU: ['rol', 'rol pau', 'rolpau', 'equipo', 'equipo de emergencia'],
  fechaAlta: ['fecha alta', 'fechaalta', 'alta', 'fecha de alta', 'antiguedad'],
};

export const COLUMNAS_PLANTILLA = ['nombre', 'apellidos', 'dni', 'email', 'telefono', 'departamento', 'puesto', 'turno', 'rol', 'fecha_alta'];

/** Divide el texto en filas y celdas respetando comillas. */
function parsear(texto, sep) {
  const filas = [];
  let fila = [];
  let celda = '';
  let comillas = false;
  for (let i = 0; i < texto.length; i += 1) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { celda += '"'; i += 1; }
      else if (c === '"') comillas = false;
      else celda += c;
    } else if (c === '"') comillas = true;
    else if (c === sep) { fila.push(celda); celda = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i += 1;
      fila.push(celda); filas.push(fila); fila = []; celda = '';
    } else celda += c;
  }
  if (celda !== '' || fila.length) { fila.push(celda); filas.push(fila); }
  return filas.filter((f) => f.some((x) => x.trim() !== ''));
}

function detectarSeparador(primeraLinea) {
  const cuenta = (ch) => primeraLinea.split(ch).length - 1;
  return [';', ',', '\t'].sort((a, b) => cuenta(b) - cuenta(a))[0];
}

function campoDeCabecera(cab) {
  const n = norm(cab).replace(/[_.]/g, ' ').replace(/\s+/g, ' ');
  return Object.keys(ALIAS).find((campo) => ALIAS[campo].includes(n)) || null;
}

function rolDesdeTexto(txt) {
  const n = norm(txt);
  if (!n) return rolesPAU.TRABAJADOR;
  const porClave = Object.values(rolesPAU).find((r) => r === n.replace(/\s+/g, '_'));
  if (porClave) return porClave;
  const porEtiqueta = Object.entries(etiquetasRolPAU).find(([, et]) => norm(et) === n);
  if (porEtiqueta) return porEtiqueta[0];
  if (n.includes('jefe') && n.includes('emergencia')) return rolesPAU.JEFE_EMERGENCIA;
  if (n.includes('jefe') && n.includes('intervencion')) return rolesPAU.JEFE_INTERVENCION;
  if (n.includes('primera')) return rolesPAU.EQUIPO_PRIMERA_INTERVENCION;
  if (n.includes('segunda')) return rolesPAU.EQUIPO_SEGUNDA_INTERVENCION;
  if (n.includes('auxilio')) return rolesPAU.EQUIPO_PRIMEROS_AUXILIOS;
  if (n.includes('alarma') || n.includes('evacuacion')) return rolesPAU.EQUIPO_ALARMA_EVACUACION;
  if (n.includes('recuento')) return rolesPAU.RESPONSABLE_RECUENTO;
  return rolesPAU.TRABAJADOR;
}

function turnoDesdeTexto(txt) {
  const n = norm(txt);
  if (n.startsWith('t')) return 'tarde';
  if (n.startsWith('n')) return 'noche';
  return 'mañana';
}

/**
 * Convierte el texto de un CSV en trabajadores.
 * @returns {{ trabajadores: object[], avisos: string[], columnas: string[], ignoradas: string[] }}
 */
export function leerCsvTrabajadores(texto, centroId) {
  const limpio = String(texto || '').replace(/^﻿/, '');
  const primera = limpio.split(/\r?\n/)[0] || '';
  const filas = parsear(limpio, detectarSeparador(primera));
  if (filas.length < 2) {
    return { trabajadores: [], avisos: ['El archivo no tiene filas de datos (se espera una cabecera y al menos una fila).'], columnas: [], ignoradas: [] };
  }

  const cabecera = filas[0];
  const mapa = cabecera.map(campoDeCabecera);
  const columnas = cabecera.filter((_, i) => mapa[i]);
  const ignoradas = cabecera.filter((_, i) => !mapa[i]);
  const avisos = [];

  if (!mapa.includes('nombre')) {
    return { trabajadores: [], avisos: ['Falta la columna "nombre". Descarga la plantilla para ver el formato.'], columnas, ignoradas };
  }

  const sello = Date.now().toString(36);
  const trabajadores = [];
  filas.slice(1).forEach((fila, idx) => {
    const r = {};
    mapa.forEach((campo, i) => { if (campo) r[campo] = (fila[i] ?? '').trim(); });
    if (!r.nombre) { avisos.push(`Fila ${idx + 2}: sin nombre, se omite.`); return; }

    // Si viene el nombre completo en una sola columna, separar nombre y apellidos
    let { nombre, apellidos = '' } = r;
    if (!apellidos && nombre.includes(' ')) {
      const partes = nombre.split(/\s+/);
      nombre = partes.shift();
      apellidos = partes.join(' ');
    }
    if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) avisos.push(`Fila ${idx + 2}: email no válido (${r.email}).`);

    trabajadores.push({
      id: `csv-${centroId}-${sello}-${idx + 1}`,
      dni: r.dni || '',
      nombre,
      apellidos,
      email: r.email || '',
      telefono: r.telefono || '',
      departamento: r.departamento || 'Sin departamento',
      puesto: r.puesto || '—',
      fechaAlta: r.fechaAlta || '',
      estado: 'activo',
      turno: turnoDesdeTexto(r.turno),
      rolPAU: rolDesdeTexto(r.rolPAU),
      origen: 'csv',
    });
  });

  return { trabajadores, avisos, columnas, ignoradas };
}

/** CSV de ejemplo para descargar como plantilla. */
export function plantillaCsv() {
  const filas = [
    COLUMNAS_PLANTILLA.join(';'),
    'Lucía;Pérez Gómez;00000000T;lucia.perez@empresa-demo.es;600000001;Producción;Operaria;mañana;Trabajador;2023-02-01',
    'Andrés;Ruiz Sanz;00000001R;andres.ruiz@empresa-demo.es;600000002;Mantenimiento;Técnico;tarde;EPI;2021-09-15',
    'Marta;Vidal Costa;00000002W;marta.vidal@empresa-demo.es;600000003;Administración;Responsable RRHH;mañana;Jefe de Emergencia;2019-05-20',
  ];
  return `﻿${filas.join('\r\n')}\r\n`;
}
