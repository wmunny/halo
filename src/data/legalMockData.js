// Datos mock para el módulo Halo Logic

// Mapeo de códigos postales a Comunidades Autónomas
export const codigoPostalToCCAA = {
  '01': 'pais_vasco',
  '20': 'pais_vasco',
  '48': 'pais_vasco',
  '08': 'cataluna',
  '17': 'cataluna',
  '25': 'cataluna',
  '43': 'cataluna',
  '15': 'galicia',
  '27': 'galicia',
  '32': 'galicia',
  '36': 'galicia',
  '35': 'canarias',
  '38': 'canarias',
  '28': 'madrid',
  '05': 'castilla_leon',
  '09': 'castilla_leon',
  '24': 'castilla_leon',
  '34': 'castilla_leon',
  '37': 'castilla_leon',
  '40': 'castilla_leon',
  '42': 'castilla_leon',
  '47': 'castilla_leon',
  '49': 'castilla_leon',
};

// Normativas por Comunidad Autónoma
export const normativasPorCCAA = {
  pais_vasco: {
    nombre: 'País Vasco',
    norma: 'Decreto 277/2010',
    color: 'emerald',
    umbralOcupacion: 50,
    umbralAltura: 28,
    requisitos: [
      'Técnico Acreditado por Gobierno Vasco obligatorio',
      'Verificar ocupación > 50 personas (docente/vulnerable)',
      'Verificar altura > 28m',
    ],
    camposExtra: ['numeroAcreditacionTecnico'],
    formatoSalida: 'SOS Deiak',
    alertas: [
      {
        tipo: 'warning',
        mensaje: 'Normativa más estricta que la estatal. Verificar umbrales específicos.',
      },
    ],
  },
  cataluna: {
    nombre: 'Cataluña',
    norma: 'Decreto 30/2015',
    color: 'amber',
    requisitos: [
      'Clasificar actividad: Anexo I.A (Generalitat) o I.B (Local)',
      'Preparar estructura de datos para plataforma HERMES',
    ],
    camposExtra: ['clasificacionAnexo', 'codigoHERMES'],
    formatoSalida: 'HERMES',
    alertas: [
      {
        tipo: 'info',
        mensaje: 'La salida debe ser compatible con la plataforma HERMES de la Generalitat.',
      },
    ],
  },
  galicia: {
    nombre: 'Galicia',
    norma: 'Decreto 171/2010',
    color: 'cyan',
    requisitos: [
      'Generar Certificación de Implantación (Anexo IV)',
      'Calcular Tasas Administrativas según tarifas vigentes',
    ],
    camposExtra: ['certificacionImplantacion', 'tasasAdministrativas'],
    formatoSalida: 'PDF + Anexo IV',
    alertas: [
      {
        tipo: 'warning',
        mensaje: 'Requiere documento adicional: Certificación de Implantación (Anexo IV).',
      },
    ],
  },
  canarias: {
    nombre: 'Canarias',
    norma: 'Decreto 67/2015',
    color: 'orange',
    requisitos: [
      'Exigir Código de Registro del Técnico Redactor',
    ],
    camposExtra: ['codigoRegistroTecnico'],
    formatoSalida: 'PDF',
    alertas: [
      {
        tipo: 'warning',
        mensaje: 'El técnico debe tener Código de Registro válido en Canarias.',
      },
    ],
  },
  madrid: {
    nombre: 'Madrid',
    norma: 'RD 393/2007',
    color: 'blue',
    requisitos: [
      'Generar Formularios 0 a 5 para el RDPA',
    ],
    camposExtra: ['formulariosRDPA'],
    formatoSalida: 'RDPA (Formularios 0-5)',
    alertas: [],
  },
  default: {
    nombre: 'Resto de España',
    norma: 'RD 393/2007',
    color: 'gray',
    requisitos: [
      'Aplicar normativa base estatal',
    ],
    camposExtra: [],
    formatoSalida: 'PDF',
    alertas: [],
  },
};

// Estructura del PAU según RD 393/2007 (9 capítulos)
export const capitulosPAU = [
  {
    id: 1,
    titulo: 'Identificación de los titulares y del emplazamiento',
    subcapitulos: [
      { id: '1.1', nombre: 'Dirección Postal y denominación' },
      { id: '1.2', nombre: 'Identificación de los titulares' },
      { id: '1.3', nombre: 'Director del PAU y del Plan de Actuación' },
    ],
  },
  {
    id: 2,
    titulo: 'Descripción detallada de la actividad',
    subcapitulos: [
      { id: '2.1', nombre: 'Descripción de cada una de las actividades' },
      { id: '2.2', nombre: 'Descripción del establecimiento' },
      { id: '2.3', nombre: 'Clasificación y descripción de usuarios' },
      { id: '2.4', nombre: 'Descripción del entorno urbano' },
      { id: '2.5', nombre: 'Descripción de los accesos' },
    ],
  },
  {
    id: 3,
    titulo: 'Inventario, análisis y evaluación de riesgos',
    subcapitulos: [
      { id: '3.1', nombre: 'Descripción y localización de elementos peligrosos' },
      { id: '3.2', nombre: 'Identificación de riesgos propios y externos' },
      { id: '3.3', nombre: 'Evaluación de riesgos' },
    ],
  },
  {
    id: 4,
    titulo: 'Inventario y descripción de medios y medidas',
    subcapitulos: [
      { id: '4.1', nombre: 'Inventario de medios materiales' },
      { id: '4.2', nombre: 'Medidas humanas y organizativas' },
    ],
  },
  {
    id: 5,
    titulo: 'Programa de mantenimiento de instalaciones',
    subcapitulos: [
      { id: '5.1', nombre: 'Mantenimiento preventivo' },
      { id: '5.2', nombre: 'Inspecciones de seguridad' },
    ],
  },
  {
    id: 6,
    titulo: 'Plan de actuación ante emergencias',
    subcapitulos: [
      { id: '6.1', nombre: 'Identificación y clasificación de emergencias' },
      { id: '6.2', nombre: 'Procedimientos de actuación' },
      { id: '6.3', nombre: 'Identificación del responsable de emergencia' },
      { id: '6.4', nombre: 'Esquemas operacionales' },
    ],
  },
  {
    id: 7,
    titulo: 'Integración en planes de ámbito superior',
    subcapitulos: [
      { id: '7.1', nombre: 'Protocolos de notificación' },
      { id: '7.2', nombre: 'Coordinación con planes externos' },
    ],
  },
  {
    id: 8,
    titulo: 'Implantación del Plan de Autoprotección',
    subcapitulos: [
      { id: '8.1', nombre: 'Responsable de la implantación' },
      { id: '8.2', nombre: 'Programa de formación' },
      { id: '8.3', nombre: 'Programa de ejercicios y simulacros' },
      { id: '8.4', nombre: 'Programa de revisión y actualización' },
    ],
  },
  {
    id: 9,
    titulo: 'Mantenimiento de la eficacia del Plan',
    subcapitulos: [
      { id: '9.1', nombre: 'Programa de reciclaje de formación' },
      { id: '9.2', nombre: 'Programa de sustitución de medios' },
      { id: '9.3', nombre: 'Programa de ejercicios y simulacros' },
      { id: '9.4', nombre: 'Programa de revisión del Plan' },
    ],
  },
];

// Tipos de documentos para ingesta
export const tiposDocumentos = [
  {
    id: 'licencia',
    nombre: 'Licencia de Actividad / Proyecto',
    descripcion: 'Proyecto de actividad o licencia de apertura',
    icono: 'FileText',
    camposExtraidos: ['usoPrincipal', 'superficieTotal', 'numeroPlantas', 'sectoresIncendio'],
  },
  {
    id: 'mantenimiento',
    nombre: 'Certificados de Mantenimiento (RIPCI)',
    descripcion: 'Certificados de revisión de medios de protección',
    icono: 'Shield',
    camposExtraidos: ['extintores', 'bies', 'deteccion', 'empresaMantenedora'],
  },
  {
    id: 'boletines',
    nombre: 'Boletines de Instalaciones',
    descripcion: 'Boletines eléctricos, de gas, climatización',
    icono: 'Zap',
    camposExtraidos: ['centroTransformacion', 'potenciaTermica', 'combustibles'],
  },
  {
    id: 'catastro',
    nombre: 'Referencia Catastral / IBI',
    descripcion: 'Datos de emplazamiento y referencia catastral',
    icono: 'MapPin',
    camposExtraidos: ['coordenadasUTM', 'referenciaCatastral', 'colindantes'],
  },
  {
    id: 'rrhh',
    nombre: 'Listado de Personal',
    descripcion: 'Lista de empleados para asignación de roles',
    icono: 'Users',
    camposExtraidos: ['empleados', 'turnos', 'ocupacionMaxima'],
  },
];

// Datos mock de extracción simulada
export const datosExtraidosMock = {
  licencia: {
    usoPrincipal: 'Industrial',
    superficieTotal: '2.500 m²',
    numeroPlantas: '2 sobre rasante, 1 bajo rasante',
    alturaEvacuacion: '8 m',
    sectoresIncendio: [
      { nombre: 'Sector 1 - Producción', superficie: '1.200 m²' },
      { nombre: 'Sector 2 - Almacén', superficie: '800 m²' },
      { nombre: 'Sector 3 - Oficinas', superficie: '500 m²' },
    ],
    tipologiaConstructiva: 'Hormigón armado',
  },
  mantenimiento: {
    extintores: { cantidad: 24, tipo: 'Polvo ABC 6kg', ultimaRevision: '2024-09-15' },
    bies: { cantidad: 4, tipo: 'BIE 25mm', ultimaRevision: '2024-09-15' },
    deteccion: { central: 'Notifier NFS-320', detectores: 48, ultimaRevision: '2024-08-20' },
    empresaMantenedora: 'Securitas Direct S.A.',
  },
  boletines: {
    centroTransformacion: { potencia: '630 kVA', ubicacion: 'Sótano' },
    climatizacion: { potenciaTermica: '150 kW', combustible: 'Gas Natural' },
    depositos: null,
  },
  catastro: {
    referenciaCatastral: '1234567VK1234A0001BM',
    coordenadasUTM: '41.3851° N, 2.1734° E',
    colindantes: {
      norte: 'Vial público',
      sur: 'Parcela industrial',
      este: 'Zona verde',
      oeste: 'Nave industrial',
    },
  },
  rrhh: {
    totalEmpleados: 45,
    turnos: ['Mañana (7:00-15:00)', 'Tarde (15:00-23:00)'],
    ocupacionMaxima: 52,
  },
};

// Roles de emergencia
export const rolesEmergencia = [
  { id: 'je', nombre: 'Jefe de Emergencia (JE)', descripcion: 'Máxima autoridad en emergencia', requerido: true },
  { id: 'ji', nombre: 'Jefe de Intervención (JI)', descripcion: 'Coordina equipos de intervención', requerido: true },
  { id: 'epi', nombre: 'Equipo Primera Intervención (EPI)', descripcion: 'Actuación inicial ante emergencia', requerido: true, multiple: true },
  { id: 'esi', nombre: 'Equipo Segunda Intervención (ESI)', descripcion: 'Apoyo a equipos externos', requerido: false, multiple: true },
  { id: 'eae', nombre: 'Equipo de Alarma y Evacuación', descripcion: 'Guía evacuación', requerido: true, multiple: true },
  { id: 'epa', nombre: 'Equipo de Primeros Auxilios', descripcion: 'Atención sanitaria inicial', requerido: false, multiple: true },
];

// Checklist de validación
export const checklistValidacion = [
  { id: 'datos_generales', grupo: 'Datos Generales', items: [
    { id: 'titular', nombre: 'Datos del titular', requerido: true },
    { id: 'emplazamiento', nombre: 'Dirección y emplazamiento', requerido: true },
    { id: 'actividad', nombre: 'Descripción de la actividad', requerido: true },
  ]},
  { id: 'medios_proteccion', grupo: 'Medios de Protección', items: [
    { id: 'extintores', nombre: 'Inventario de extintores', requerido: true },
    { id: 'bies', nombre: 'Inventario de BIEs', requerido: false },
    { id: 'deteccion', nombre: 'Sistema de detección', requerido: false },
    { id: 'mantenimiento', nombre: 'Programa de mantenimiento', requerido: true },
  ]},
  { id: 'organizacion', grupo: 'Organización', items: [
    { id: 'roles', nombre: 'Asignación de roles de emergencia', requerido: true },
    { id: 'procedimientos', nombre: 'Procedimientos de actuación', requerido: true },
    { id: 'formacion', nombre: 'Programa de formación', requerido: true },
  ]},
  { id: 'normativa', grupo: 'Requisitos Normativos', items: [
    { id: 'tecnico', nombre: 'Validación del técnico redactor', requerido: true },
    { id: 'formato', nombre: 'Formato de salida correcto', requerido: true },
    { id: 'anexos', nombre: 'Documentación anexa requerida', requerido: false },
  ]},
];

// Proyecto de ejemplo
export const proyectoEjemplo = {
  id: 'PAU-2024-001',
  nombre: 'Plan de Autoprotección - Nave Industrial Zona Franca',
  direccion: 'Polígono Industrial Zona Franca, Sector B, Nave 12',
  codigoPostal: '08040',
  ciudad: 'Barcelona',
  ccaa: 'cataluna',
  estado: 'en_progreso',
  progreso: 65,
  fechaCreacion: '2024-12-01',
  fechaModificacion: '2024-12-10',
  tecnicoAsignado: 'María García López',
};

