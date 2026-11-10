/**
 * Plantilla SINTÉTICA para la demo del gemelo digital.
 *
 * Completa los trabajadores de cada centro hasta su número de empleados (mockData.centrosTrabajo), con turno,
 * departamento, rol en el plan de autoprotección y, para unas pocas personas, la necesidad de ayuda para evacuar
 * (plan personal de evacuación: solo "necesita ayuda" y la persona de apoyo asignada, nunca el diagnóstico).
 *
 * Es determinista (misma semilla → misma plantilla). Incluye a propósito algunos huecos de cobertura para que la
 * demo los detecte: turno de noche sin Jefe de Emergencia ni EPA, una zona sin EAE, una persona que necesita ayuda
 * sin apoyo asignado y otra cuyo apoyo trabaja en otro turno.
 */

const NOMBRES = ['Alba', 'Marc', 'Laia', 'Pol', 'Núria', 'Jordi', 'Irene', 'Sergi', 'Marta', 'Óscar', 'Clara', 'Àlex',
  'Paula', 'David', 'Sara', 'Hugo', 'Lucía', 'Iván', 'Elena', 'Raúl', 'Noelia', 'Adrián', 'Cristina', 'Víctor', 'Rocío',
  'Joan', 'Ainhoa', 'Gerard', 'Silvia', 'Rubén', 'Beatriz', 'Toni', 'Eva', 'Manel', 'Judit', 'Xavier'];
const APELLIDOS = ['Puig', 'Vidal', 'Serra', 'Font', 'Ruiz', 'Navarro', 'Romero', 'Torres', 'Domínguez', 'Gil', 'Moreno',
  'Castro', 'Ortega', 'Rubio', 'Molina', 'Delgado', 'Suárez', 'Ramos', 'Blanco', 'Medina', 'Sanz', 'Iglesias', 'Pons',
  'Soler', 'Ferrer', 'Roca', 'Prieto', 'Vega', 'Campos', 'Cano'];

// Reparto por departamento y turno según el tipo de centro.
const PERFILES_CENTRO = {
  industrial: {
    turnos: { 'mañana': 0.46, tarde: 0.35, noche: 0.19 },
    departamentos: [['Producción', 0.45, 'Operario/a de Línea'], ['Almacén', 0.14, 'Operario/a de Almacén'],
      ['Logística', 0.12, 'Técnico/a de Expediciones'], ['Mantenimiento', 0.07, 'Técnico/a de Mantenimiento'],
      ['Calidad', 0.07, 'Técnico/a de Calidad'], ['Administración', 0.15, 'Administrativo/a']],
    soloManana: ['Administración', 'Calidad'],
  },
  almacen: {
    turnos: { 'mañana': 0.5, tarde: 0.35, noche: 0.15 },
    departamentos: [['Almacén', 0.55, 'Operario/a de Almacén'], ['Logística', 0.25, 'Técnico/a de Expediciones'],
      ['Mantenimiento', 0.05, 'Técnico/a de Mantenimiento'], ['Administración', 0.15, 'Administrativo/a']],
    soloManana: ['Administración'],
  },
  oficinas: {
    turnos: { 'mañana': 0.8, tarde: 0.2 },
    departamentos: [['Administración', 0.3, 'Administrativo/a'], ['IT', 0.2, 'Técnico/a de Sistemas'],
      ['Finanzas', 0.15, 'Analista'], ['RRHH', 0.1, 'Técnico/a de RRHH'], ['Marketing', 0.15, 'Especialista'],
      ['Legal', 0.1, 'Asesor/a']],
    soloManana: [],
  },
};

// Roles del plan por turno (además de los que ya tienen los trabajadores con nombre de los datos de prueba).
// [departamento, rolPAU]
const ROLES_TURNO = {
  industrial: {
    'mañana': [['Producción', 'equipo_alarma_evacuacion'], ['Almacén', 'equipo_alarma_evacuacion'],
      ['Administración', 'equipo_alarma_evacuacion'], ['Logística', 'equipo_alarma_evacuacion'],
      ['Producción', 'equipo_primeros_auxilios']],
    tarde: [['Producción', 'jefe_emergencia'], ['Producción', 'equipo_primera_intervencion'],
      ['Almacén', 'equipo_primera_intervencion'], ['Producción', 'equipo_alarma_evacuacion'],
      ['Almacén', 'equipo_alarma_evacuacion'], ['Logística', 'equipo_primeros_auxilios'], ['Logística', 'responsable_recuento']],
    noche: [['Producción', 'equipo_primera_intervencion'], ['Producción', 'equipo_alarma_evacuacion'],
      ['Almacén', 'responsable_recuento']],
  },
  almacen: {
    'mañana': [['Almacén', 'jefe_emergencia'], ['Almacén', 'equipo_primera_intervencion'], ['Almacén', 'equipo_alarma_evacuacion'],
      ['Logística', 'equipo_alarma_evacuacion'], ['Administración', 'equipo_primeros_auxilios'], ['Administración', 'responsable_recuento']],
    tarde: [['Almacén', 'equipo_primera_intervencion'], ['Almacén', 'equipo_alarma_evacuacion'], ['Logística', 'equipo_primeros_auxilios']],
    noche: [['Almacén', 'equipo_alarma_evacuacion']],
  },
  oficinas: {
    'mañana': [['Administración', 'equipo_alarma_evacuacion'], ['IT', 'equipo_primera_intervencion'],
      ['Marketing', 'equipo_alarma_evacuacion'], ['Finanzas', 'equipo_primeros_auxilios']],
    tarde: [['IT', 'equipo_alarma_evacuacion'], ['Administración', 'equipo_primera_intervencion']],
  },
};

function aleatorio(semilla) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashTexto(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function quitarAcentos(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Añade a `trabajadoresPorCentro` los trabajadores sintéticos de cada centro. Los que ya existen conservan sus
 * datos y reciben turno de mañana si no lo tenían.
 */
export function completarPlantilla(trabajadoresPorCentro, centros) {
  for (const centro of centros) {
    const lista = trabajadoresPorCentro[centro.id] || (trabajadoresPorCentro[centro.id] = []);
    lista.forEach((t) => { if (!t.turno) t.turno = 'mañana'; });
    const perfil = PERFILES_CENTRO[centro.tipo] || PERFILES_CENTRO.industrial;
    const rnd = aleatorio(hashTexto(centro.id));
    const faltan = Math.max(0, (centro.empleados || 0) - lista.length);
    const prefijo = centro.id.split('-')[0];
    const nuevos = [];
    const turnos = Object.entries(perfil.turnos);
    for (let i = 0; i < faltan; i += 1) {
      // Turno según su peso.
      let r = rnd(); let turno = turnos[0][0];
      for (const [t, p] of turnos) { if (r < p) { turno = t; break; } r -= p; }
      // Departamento según su peso (los de oficina, solo de mañana).
      let dep; let puesto;
      for (let intento = 0; intento < 10; intento += 1) {
        let q = rnd();
        for (const [d, p, pu] of perfil.departamentos) { if (q < p) { dep = d; puesto = pu; break; } q -= p; }
        if (!dep) [dep, , puesto] = perfil.departamentos[0];
        if (turno === 'mañana' || !perfil.soloManana.includes(dep)) break;
        dep = undefined;
      }
      if (!dep) [dep, , puesto] = perfil.departamentos[0];
      const nombre = NOMBRES[Math.floor(rnd() * NOMBRES.length)];
      const ap1 = APELLIDOS[Math.floor(rnd() * APELLIDOS.length)];
      const ap2 = APELLIDOS[Math.floor(rnd() * APELLIDOS.length)];
      const n = String(i + 1).padStart(3, '0');
      nuevos.push({
        id: `${prefijo}-s${n}`, dni: `SINT-${prefijo.toUpperCase()}${n}`, nombre, apellidos: `${ap1} ${ap2}`,
        email: `${quitarAcentos(nombre)}.${quitarAcentos(ap1)}${n}@demo.halo.example`, telefono: '',
        departamento: dep, puesto, fechaAlta: `20${String(15 + Math.floor(rnd() * 10))}-0${1 + Math.floor(rnd() * 9)}-15`,
        estado: 'activo', rolPAU: 'trabajador', turno, sintetico: true,
      });
    }
    // Roles del plan por turno.
    const usados = new Set();
    for (const [turno, roles] of Object.entries(ROLES_TURNO[centro.tipo] || {})) {
      for (const [dep, rol] of roles) {
        const cand = nuevos.find((t) => t.turno === turno && t.departamento === dep && t.rolPAU === 'trabajador' && !usados.has(t.id))
          || nuevos.find((t) => t.turno === turno && t.rolPAU === 'trabajador' && !usados.has(t.id));
        if (cand) { cand.rolPAU = rol; usados.add(cand.id); }
      }
    }
    // Personas que necesitan ayuda para evacuar (plan personal de evacuación).
    const elegir = (turno, deps) => nuevos.find((t) => t.turno === turno && deps.includes(t.departamento) && t.rolPAU === 'trabajador' && !t.necesidadEvacuacion);
    const apoyo = (turno, dep) => nuevos.find((t) => t.turno === turno && t.rolPAU === 'equipo_primeros_auxilios')
      || nuevos.find((t) => t.turno === turno && t.departamento === dep && t.rolPAU === 'trabajador' && !t.necesidadEvacuacion);
    const casos = [
      ['mañana', ['Administración', 'Finanzas'], 'asignado'],
      ['mañana', ['Producción', 'Almacén', 'IT'], 'sin_apoyo'],
      ['tarde', ['Almacén', 'Logística', 'Administración'], 'apoyo_otro_turno'],
    ];
    for (const [turno, deps, tipo] of casos) {
      const p = elegir(turno, deps);
      if (!p) continue;
      let ap = null;
      if (tipo === 'asignado') ap = apoyo(turno, p.departamento);
      if (tipo === 'apoyo_otro_turno') ap = nuevos.find((t) => t.turno === 'mañana' && t.departamento === p.departamento && t.rolPAU === 'trabajador');
      p.necesidadEvacuacion = { ayuda: true, movilidad: 'reducida', apoyo: ap ? ap.id : null,
        nota: 'Plan personal de evacuación (sintético). No se registra el diagnóstico.' };
    }
    lista.push(...nuevos);
  }
  return trabajadoresPorCentro;
}
