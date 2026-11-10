/**
 * Datos mock para Halo Training
 * Trabajadores por centro de trabajo, notificaciones y logs de auditoría
 */

import { generateTrainingToken, calculateExpiryDate } from '../utils/trainingTokenValidator';
import { centrosTrabajo } from './mockData';
import { completarPlantilla } from './plantillaSintetica';

// Estados de notificación
export const notificationStatus = {
  PENDING: 'pending',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

// Tipos de notificación
export const notificationType = {
  ONBOARDING: 'onboarding_pau',
  UPDATE: 'update_pau',
  REFRESH: 'refresh_training',
};

// Roles del Equipo de Intervención PAU
export const rolesPAU = {
  TRABAJADOR: 'trabajador',
  JEFE_EMERGENCIA: 'jefe_emergencia',
  JEFE_INTERVENCION: 'jefe_intervencion',
  EQUIPO_PRIMERA_INTERVENCION: 'equipo_primera_intervencion',
  EQUIPO_SEGUNDA_INTERVENCION: 'equipo_segunda_intervencion',
  EQUIPO_PRIMEROS_AUXILIOS: 'equipo_primeros_auxilios',
  EQUIPO_ALARMA_EVACUACION: 'equipo_alarma_evacuacion',
  RESPONSABLE_RECUENTO: 'responsable_recuento',
};

// Etiquetas legibles para los roles PAU
export const etiquetasRolPAU = {
  trabajador: 'Trabajador',
  jefe_emergencia: 'Jefe de Emergencia',
  jefe_intervencion: 'Jefe de Intervención',
  equipo_primera_intervencion: 'EPI',
  equipo_segunda_intervencion: 'ESI',
  equipo_primeros_auxilios: 'EPA',
  equipo_alarma_evacuacion: 'EAE',
  responsable_recuento: 'Resp. Recuento',
};

// Helper: determina si un rolPAU pertenece al equipo de intervención
export const esEquipoIntervencion = (rolPAU) => {
  return rolPAU && rolPAU !== rolesPAU.TRABAJADOR;
};

// Trabajadores por centro de trabajo
export const trabajadoresPorCentro = {
  'bcn-001': [
    {
      id: 'w001',
      dni: '12345678A',
      nombre: 'Juan',
      apellidos: 'García Martínez',
      email: 'juan.garcia@empresa-demo.es',
      telefono: '+34 600 111 222',
      departamento: 'Producción',
      puesto: 'Operario de Línea',
      fechaAlta: '2020-03-15',
      estado: 'activo',
      rolPAU: rolesPAU.TRABAJADOR,
    },
    {
      id: 'w002',
      dni: '23456789B',
      nombre: 'María',
      apellidos: 'López Fernández',
      email: 'maria.lopez@empresa-demo.es',
      telefono: '+34 600 222 333',
      departamento: 'Logística',
      puesto: 'Jefa de Almacén',
      fechaAlta: '2019-07-22',
      estado: 'activo',
      rolPAU: rolesPAU.JEFE_EMERGENCIA,
    },
    {
      id: 'w003',
      dni: '34567890C',
      nombre: 'Carlos',
      apellidos: 'Rodríguez Sánchez',
      email: 'carlos.rodriguez@empresa-demo.es',
      telefono: '+34 600 333 444',
      departamento: 'Mantenimiento',
      puesto: 'Técnico de Mantenimiento',
      fechaAlta: '2021-01-10',
      estado: 'activo',
      rolPAU: rolesPAU.EQUIPO_PRIMERA_INTERVENCION,
    },
    {
      id: 'w004',
      dni: '45678901D',
      nombre: 'Ana',
      apellidos: 'Martín González',
      email: 'ana.martin@empresa-demo.es',
      telefono: '+34 600 444 555',
      departamento: 'Producción',
      puesto: 'Supervisora de Calidad',
      fechaAlta: '2018-11-05',
      estado: 'activo',
      rolPAU: rolesPAU.EQUIPO_PRIMEROS_AUXILIOS,
    },
    {
      id: 'w005',
      dni: '56789012E',
      nombre: 'Pedro',
      apellidos: 'Jiménez Ruiz',
      email: 'pedro.jimenez@empresa-demo.es',
      telefono: '+34 600 555 666',
      departamento: 'Almacén',
      puesto: 'Carretillero',
      fechaAlta: '2022-05-18',
      estado: 'activo',
      rolPAU: rolesPAU.TRABAJADOR,
    },
    {
      id: 'w006',
      dni: '67890123F',
      nombre: 'Laura',
      apellidos: 'Hernández Díaz',
      email: 'laura.hernandez@empresa-demo.es',
      telefono: '+34 600 666 777',
      departamento: 'Calidad',
      puesto: 'Técnica de Calidad',
      fechaAlta: '2020-09-12',
      estado: 'activo',
      rolPAU: rolesPAU.EQUIPO_ALARMA_EVACUACION,
    },
    {
      id: 'w007',
      dni: '78901234G',
      nombre: 'Francisco',
      apellidos: 'Moreno Torres',
      email: 'francisco.moreno@empresa-demo.es',
      telefono: '+34 600 777 888',
      departamento: 'Producción',
      puesto: 'Operario Especialista',
      fechaAlta: '2017-03-20',
      estado: 'activo',
      rolPAU: rolesPAU.EQUIPO_PRIMERA_INTERVENCION,
    },
    {
      id: 'w008',
      dni: '89012345H',
      nombre: 'Elena',
      apellidos: 'Navarro Pérez',
      email: 'elena.navarro@empresa-demo.es',
      telefono: '+34 600 888 999',
      departamento: 'Administración',
      puesto: 'Administrativa',
      fechaAlta: '2019-02-28',
      estado: 'activo',
      rolPAU: rolesPAU.RESPONSABLE_RECUENTO,
    },
  ],
  'mad-002': [
    {
      id: 'w009',
      dni: '90123456I',
      nombre: 'Miguel',
      apellidos: 'Sánchez López',
      email: 'miguel.sanchez@empresa-demo.es',
      telefono: '+34 601 111 222',
      departamento: 'Logística',
      puesto: 'Jefe de Turno',
      fechaAlta: '2020-06-15',
      estado: 'activo',
      rolPAU: rolesPAU.JEFE_INTERVENCION,
    },
    {
      id: 'w010',
      dni: '01234567J',
      nombre: 'Carmen',
      apellidos: 'Ruiz García',
      email: 'carmen.ruiz@empresa-demo.es',
      telefono: '+34 601 222 333',
      departamento: 'Almacén',
      puesto: 'Operaria de Picking',
      fechaAlta: '2021-03-10',
      estado: 'activo',
      rolPAU: rolesPAU.TRABAJADOR,
    },
    {
      id: 'w011',
      dni: '11234567K',
      nombre: 'David',
      apellidos: 'Fernández Martín',
      email: 'david.fernandez@empresa-demo.es',
      telefono: '+34 601 333 444',
      departamento: 'Transporte',
      puesto: 'Conductor',
      fechaAlta: '2019-11-20',
      estado: 'activo',
      rolPAU: rolesPAU.TRABAJADOR,
    },
    {
      id: 'w012',
      dni: '22345678L',
      nombre: 'Isabel',
      apellidos: 'González Pérez',
      email: 'isabel.gonzalez@empresa-demo.es',
      telefono: '+34 601 444 555',
      departamento: 'Administración',
      puesto: 'Contable',
      fechaAlta: '2018-07-05',
      estado: 'activo',
      rolPAU: rolesPAU.EQUIPO_ALARMA_EVACUACION,
    },
  ],
  'vlc-003': [
    {
      id: 'w013',
      dni: '33456789M',
      nombre: 'Antonio',
      apellidos: 'Martínez Sánchez',
      email: 'antonio.martinez@empresa-demo.es',
      telefono: '+34 602 111 222',
      departamento: 'IT',
      puesto: 'Desarrollador Senior',
      fechaAlta: '2019-04-15',
      estado: 'activo',
      rolPAU: rolesPAU.JEFE_EMERGENCIA,
    },
    {
      id: 'w014',
      dni: '44567890N',
      nombre: 'Patricia',
      apellidos: 'López Ruiz',
      email: 'patricia.lopez@empresa-demo.es',
      telefono: '+34 602 222 333',
      departamento: 'RRHH',
      puesto: 'Técnica de Selección',
      fechaAlta: '2020-08-20',
      estado: 'activo',
      rolPAU: rolesPAU.EQUIPO_SEGUNDA_INTERVENCION,
    },
    {
      id: 'w015',
      dni: '55678901O',
      nombre: 'Roberto',
      apellidos: 'García Hernández',
      email: 'roberto.garcia@empresa-demo.es',
      telefono: '+34 602 333 444',
      departamento: 'Finanzas',
      puesto: 'Controller',
      fechaAlta: '2018-01-10',
      estado: 'activo',
      rolPAU: rolesPAU.TRABAJADOR,
    },
    {
      id: 'w016',
      dni: '66789012P',
      nombre: 'Lucía',
      apellidos: 'Sánchez Torres',
      email: 'lucia.sanchez@empresa-demo.es',
      telefono: '+34 602 444 555',
      departamento: 'Marketing',
      puesto: 'Especialista Digital',
      fechaAlta: '2021-06-01',
      estado: 'activo',
      rolPAU: rolesPAU.TRABAJADOR,
    },
    {
      id: 'w017',
      dni: '77890123Q',
      nombre: 'Javier',
      apellidos: 'Díaz Moreno',
      email: 'javier.diaz@empresa-demo.es',
      telefono: '+34 602 555 666',
      departamento: 'IT',
      puesto: 'Administrador de Sistemas',
      fechaAlta: '2019-09-15',
      estado: 'activo',
      rolPAU: rolesPAU.EQUIPO_PRIMEROS_AUXILIOS,
    },
    {
      id: 'w018',
      dni: '88901234R',
      nombre: 'Sara',
      apellidos: 'Navarro López',
      email: 'sara.navarro@empresa-demo.es',
      telefono: '+34 602 666 777',
      departamento: 'Legal',
      puesto: 'Abogada',
      fechaAlta: '2020-02-28',
      estado: 'activo',
      rolPAU: rolesPAU.RESPONSABLE_RECUENTO,
    },
  ],
};

// Plantilla sintética: completa cada centro hasta su número de empleados, con turnos, roles del plan y
// necesidades de ayuda para evacuar. La usan Training y el gemelo digital (Sim).
completarPlantilla(trabajadoresPorCentro, centrosTrabajo);

// --- Listados importados desde CSV ------------------------------------------------------------
// Se guardan solo en el navegador (localStorage) y sustituyen o amplían la plantilla de demo.
const plantillaDemo = Object.fromEntries(Object.entries(trabajadoresPorCentro).map(([k, v]) => [k, [...v]]));
const CLAVE_CSV = (centroId) => `halo.trabajadores.${centroId}`;

function leerGuardado(centroId) {
  try {
    const raw = window.localStorage.getItem(CLAVE_CSV(centroId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function guardar(centroId, lista) {
  try {
    if (lista) window.localStorage.setItem(CLAVE_CSV(centroId), JSON.stringify(lista));
    else window.localStorage.removeItem(CLAVE_CSV(centroId));
  } catch {
    // Sin almacenamiento disponible: la importación dura hasta recargar la página.
  }
}

if (typeof window !== 'undefined') {
  for (const c of centrosTrabajo) {
    const guardado = leerGuardado(c.id);
    if (Array.isArray(guardado)) trabajadoresPorCentro[c.id] = guardado;
  }
}

/** Sustituye ('reemplazar') o amplía ('anadir') la plantilla del centro con los trabajadores importados. */
export function importarTrabajadores(centroId, nuevos, modo = 'reemplazar') {
  const lista = modo === 'anadir' ? [...(trabajadoresPorCentro[centroId] || []), ...nuevos] : [...nuevos];
  trabajadoresPorCentro[centroId] = lista;
  guardar(centroId, lista);
  return lista.length;
}

/** Vuelve a la plantilla de demostración del centro. */
export function restaurarPlantillaDemo(centroId) {
  trabajadoresPorCentro[centroId] = [...(plantillaDemo[centroId] || [])];
  guardar(centroId, null);
}

export const tieneListadoImportado = (centroId) => leerGuardado(centroId) !== null
  || (trabajadoresPorCentro[centroId] || []).some((t) => t.origen === 'csv');

// Notificaciones mock (algunas ya enviadas/aceptadas para demo)
export const notificacionesMock = [
  // Barcelona - 2 aceptadas, 2 enviadas, resto pendientes
  {
    id: 'notif-001',
    trabajadorId: 'w001',
    centroId: 'bcn-001',
    tipo: notificationType.ONBOARDING,
    estado: notificationStatus.ACCEPTED,
    fechaCreacion: '2024-03-10T09:00:00Z',
    fechaEnvio: '2024-03-10T09:05:00Z',
    fechaAceptacion: '2024-03-10T10:30:00Z',
    fechaExpiracion: '2024-03-11T09:05:00Z',
    magicLinkToken: 'mlt_accepted_w001_abc123xyz78901234567890',
    documentHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    versionPAU: 'v3.2',
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    quizScore: 3,
  },
  {
    id: 'notif-002',
    trabajadorId: 'w002',
    centroId: 'bcn-001',
    tipo: notificationType.ONBOARDING,
    estado: notificationStatus.ACCEPTED,
    fechaCreacion: '2024-03-10T09:00:00Z',
    fechaEnvio: '2024-03-10T09:05:00Z',
    fechaAceptacion: '2024-03-10T11:15:00Z',
    fechaExpiracion: '2024-03-11T09:05:00Z',
    magicLinkToken: 'mlt_accepted_w002_def456uvw78901234567890',
    documentHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    versionPAU: 'v3.2',
    ipAddress: '192.168.1.67',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    quizScore: 3,
  },
  {
    id: 'notif-003',
    trabajadorId: 'w003',
    centroId: 'bcn-001',
    tipo: notificationType.ONBOARDING,
    estado: notificationStatus.SENT,
    fechaCreacion: '2024-03-14T08:00:00Z',
    fechaEnvio: '2024-03-14T08:05:00Z',
    fechaAceptacion: null,
    fechaExpiracion: calculateExpiryDate(),
    magicLinkToken: 'mlt_sent_w003_ghi789xyz78901234567890',
    documentHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    versionPAU: 'v3.2',
    ipAddress: null,
    userAgent: null,
    quizScore: null,
  },
  {
    id: 'notif-004',
    trabajadorId: 'w004',
    centroId: 'bcn-001',
    tipo: notificationType.ONBOARDING,
    estado: notificationStatus.SENT,
    fechaCreacion: '2024-03-14T08:00:00Z',
    fechaEnvio: '2024-03-14T08:05:00Z',
    fechaAceptacion: null,
    fechaExpiracion: calculateExpiryDate(),
    magicLinkToken: 'mlt_sent_w004_jkl012xyz78901234567890',
    documentHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    versionPAU: 'v3.2',
    ipAddress: null,
    userAgent: null,
    quizScore: null,
  },
  // Madrid - 1 aceptada
  {
    id: 'notif-005',
    trabajadorId: 'w009',
    centroId: 'mad-002',
    tipo: notificationType.ONBOARDING,
    estado: notificationStatus.ACCEPTED,
    fechaCreacion: '2024-03-08T10:00:00Z',
    fechaEnvio: '2024-03-08T10:05:00Z',
    fechaAceptacion: '2024-03-08T14:20:00Z',
    fechaExpiracion: '2024-03-09T10:05:00Z',
    magicLinkToken: 'mlt_accepted_w009_mno345xyz78901234567890',
    documentHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
    versionPAU: 'v2.1',
    ipAddress: '10.0.0.123',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0',
    quizScore: 3,
  },
  // Valencia - 2 aceptadas
  {
    id: 'notif-006',
    trabajadorId: 'w013',
    centroId: 'vlc-003',
    tipo: notificationType.ONBOARDING,
    estado: notificationStatus.ACCEPTED,
    fechaCreacion: '2024-03-05T09:00:00Z',
    fechaEnvio: '2024-03-05T09:05:00Z',
    fechaAceptacion: '2024-03-05T09:45:00Z',
    fechaExpiracion: '2024-03-06T09:05:00Z',
    magicLinkToken: 'mlt_accepted_w013_pqr678xyz78901234567890',
    documentHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
    versionPAU: 'v2.8',
    ipAddress: '172.16.0.50',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
    quizScore: 3,
  },
  {
    id: 'notif-007',
    trabajadorId: 'w014',
    centroId: 'vlc-003',
    tipo: notificationType.ONBOARDING,
    estado: notificationStatus.ACCEPTED,
    fechaCreacion: '2024-03-05T09:00:00Z',
    fechaEnvio: '2024-03-05T09:05:00Z',
    fechaAceptacion: '2024-03-05T10:30:00Z',
    fechaExpiracion: '2024-03-06T09:05:00Z',
    magicLinkToken: 'mlt_accepted_w014_stu901xyz78901234567890',
    documentHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
    versionPAU: 'v2.8',
    ipAddress: '172.16.0.78',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) Safari/605.1.15',
    quizScore: 3,
  },
];

// Logs de auditoría
export const auditLogsMock = [
  {
    id: 'log-001',
    trabajadorId: 'w001',
    nombreCompleto: 'Juan García Martínez',
    timestamp: '2024-03-10T10:30:15Z',
    accion: 'ACEPTACION_PAU',
    ipAddress: '192.168.1.45',
    userAgent: 'Chrome/120.0.0.0',
    documentHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    metadata: {
      versionPAU: 'v3.2',
      centroId: 'bcn-001',
      quizScore: '3/3',
    },
  },
  {
    id: 'log-002',
    trabajadorId: 'w002',
    nombreCompleto: 'María López Fernández',
    timestamp: '2024-03-10T11:15:22Z',
    accion: 'ACEPTACION_PAU',
    ipAddress: '192.168.1.67',
    userAgent: 'Safari/605.1.15',
    documentHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    metadata: {
      versionPAU: 'v3.2',
      centroId: 'bcn-001',
      quizScore: '3/3',
    },
  },
  {
    id: 'log-003',
    trabajadorId: 'w009',
    nombreCompleto: 'Miguel Sánchez López',
    timestamp: '2024-03-08T14:20:45Z',
    accion: 'ACEPTACION_PAU',
    ipAddress: '10.0.0.123',
    userAgent: 'Firefox/121.0',
    documentHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
    metadata: {
      versionPAU: 'v2.1',
      centroId: 'mad-002',
      quizScore: '3/3',
    },
  },
  {
    id: 'log-004',
    trabajadorId: 'w013',
    nombreCompleto: 'Antonio Martínez Sánchez',
    timestamp: '2024-03-05T09:45:10Z',
    accion: 'ACEPTACION_PAU',
    ipAddress: '172.16.0.50',
    userAgent: 'Edge/120.0.0.0',
    documentHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
    metadata: {
      versionPAU: 'v2.8',
      centroId: 'vlc-003',
      quizScore: '3/3',
    },
  },
  {
    id: 'log-005',
    trabajadorId: 'w014',
    nombreCompleto: 'Patricia López Ruiz',
    timestamp: '2024-03-05T10:30:33Z',
    accion: 'ACEPTACION_PAU',
    ipAddress: '172.16.0.78',
    userAgent: 'Safari/605.1.15 (iPhone)',
    documentHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
    metadata: {
      versionPAU: 'v2.8',
      centroId: 'vlc-003',
      quizScore: '3/3',
    },
  },
];

// Funciones helper
export const getTrabajadoresByCentro = (centroId) => {
  return trabajadoresPorCentro[centroId] || [];
};

export const getTrabajadorById = (trabajadorId) => {
  for (const centroId in trabajadoresPorCentro) {
    const trabajador = trabajadoresPorCentro[centroId].find(t => t.id === trabajadorId);
    if (trabajador) return { ...trabajador, centroId };
  }
  return null;
};

export const getNotificacionByTrabajador = (trabajadorId) => {
  return notificacionesMock.find(n => n.trabajadorId === trabajadorId) || null;
};

export const getNotificacionByToken = (token) => {
  return notificacionesMock.find(n => n.magicLinkToken === token) || null;
};

export const getTrabajadoresConEstado = (centroId) => {
  const trabajadores = getTrabajadoresByCentro(centroId);
  return trabajadores.map(t => {
    const notificacion = getNotificacionByTrabajador(t.id);
    return {
      ...t,
      notificacion,
      estadoNotificacion: notificacion?.estado || 'sin_notificar',
    };
  });
};

export const getEstadisticasCentro = (centroId) => {
  const trabajadores = getTrabajadoresConEstado(centroId);
  const total = trabajadores.length;
  const aceptados = trabajadores.filter(t => t.estadoNotificacion === notificationStatus.ACCEPTED).length;
  const enviados = trabajadores.filter(t => t.estadoNotificacion === notificationStatus.SENT).length;
  const pendientes = trabajadores.filter(t => t.estadoNotificacion === 'sin_notificar' || t.estadoNotificacion === notificationStatus.PENDING).length;
  const expirados = trabajadores.filter(t => t.estadoNotificacion === notificationStatus.EXPIRED).length;
  
  return {
    total,
    aceptados,
    enviados,
    pendientes,
    expirados,
    tasaCumplimiento: total > 0 ? Math.round((aceptados / total) * 100) : 0,
  };
};

export const getAuditLogsByCentro = (centroId) => {
  return auditLogsMock.filter(log => log.metadata.centroId === centroId);
};

export const getAllAuditLogs = () => {
  return auditLogsMock.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};


