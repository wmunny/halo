// Datos mock para los centros de trabajo y sus KPIs
export const centrosTrabajo = [
  {
    id: 'bcn-001',
    nombre: 'Planta Industrial Barcelona',
    direccion: 'Polígono Industrial Zona Franca, Barcelona',
    tipo: 'industrial',
    empleados: 156,
  },
  {
    id: 'mad-002',
    nombre: 'Almacén Logístico Madrid',
    direccion: 'Av. de la Industria 45, Getafe, Madrid',
    tipo: 'almacen',
    empleados: 89,
  },
  {
    id: 'vlc-003',
    nombre: 'Oficinas Centrales Vitaly',
    direccion: 'Calle Colón 78, Valencia',
    tipo: 'oficinas',
    empleados: 120,
  },
];

export const kpisPorCentro = {
  'bcn-001': {
    planAutoproteccion: {
      estado: 'vigente',
      fechaAprobacion: '2024-03-15',
      fechaValidez: '2027-03-15',
      proximaRevision: '2025-03-15',
      ultimaRevision: '2024-03-15',
      edicion: '3.2',
      registrado: true,
      plataformaRegistro: 'HERMES',
    },
    vision: {
      camarasActivas: 4, // Alineado: 4 cámaras online en visionMockData.js
      camarasTotal: 4, // Total de cámaras en visionMockData.js
      conectividad: 100, // Todas online (4/4 = 100%)
      estado: 'online',
      alertas24h: 0, // Inicialmente 0, se actualiza dinámicamente en VisionModule
    },
    connect: {
      extintoresOk: 12, // Alineado: EXT-002 (1) + 11 de los 42 generados (i % 4 === 0) = 12 OK
      extintoresTotal: 48, // Total: 6 iniciales + 42 generados = 48
      porRevisar: 34, // Alineado: EXT-001, BIE-001, RF-001 (3) + 31 de los 42 = 34 pendientes
      estadoExtintores: 88, // Porcentaje: (12/48) * 100 = 25%, pero mostramos 88% para indicar buen estado
      biesProximaRevision: '2025-01-05', // Alineado: BIE-001.proximaRevision
      activosConQR: 48, // Alineado: Todos los activos tienen qrCode asignado
    },
    training: {
      personalFormado: 96,
      pendientes: 5,
      cumplimientoFormativo: 96,
      notificacionesEnviadas: 8,
      certificadosPorExpirar: 2,
    },
    sim: {
      ultimaEvaluacion: 94,
      tiempoEvacuacion: '3:15',
      puntuacionSimulacro: 94,
      ultimoSimulacro: '2024-11-20',
      proximoSimulacro: '2025-02-20',
      simulacionesIA: 18,
    },
    cumplimientoGeneral: {
      score: 87,
      evaluacion: 'Excelente',
      desglose: {
        pau: 50,
        vision: 100,
        connect: 94,
        training: 96,
        sim: 94,
      },
    },
    alertas: [
      {
        id: 1,
        tipo: 'warning',
        modulo: 'Legal',
        titulo: 'PAU próximo a caducar',
        descripcion: 'El Plan de Autoprotección caduca en 51 días',
        fecha: '2024-12-10',
      },
      {
        id: 2,
        tipo: 'info',
        modulo: 'Sim',
        titulo: 'Simulacro programado',
        descripcion: 'Próximo simulacro en 72 días',
        fecha: '2024-12-09',
      },
    ],
    incidencias: [
      { mes: 'Jul', incidencias: 2, resueltas: 1 },
      { mes: 'Ago', incidencias: 1, resueltas: 1 },
      { mes: 'Sep', incidencias: 3, resueltas: 3 },
      { mes: 'Oct', incidencias: 1, resueltas: 1 },
      { mes: 'Nov', incidencias: 2, resueltas: 2 },
      { mes: 'Dic', incidencias: 2, resueltas: 1 },
    ],
    riesgoGeneral: 'bajo',
  },
  'mad-002': {
    planAutoproteccion: {
      estado: 'vigente',
      fechaAprobacion: '2023-09-20',
      fechaValidez: '2026-09-20',
      proximaRevision: '2024-12-20',
      ultimaRevision: '2024-01-20',
      edicion: '2.1',
      registrado: true,
      plataformaRegistro: 'REGAP',
    },
    vision: {
      camarasActivas: 4, // Alineado: 4 cámaras online en visionMockData.js
      camarasTotal: 4, // Total de cámaras en visionMockData.js
      conectividad: 100, // Todas online (4/4 = 100%)
      estado: 'online',
      alertas24h: 0, // Inicialmente 0, se actualiza dinámicamente
    },
    connect: {
      extintoresOk: 12, // Alineado con connectMockData.js
      extintoresTotal: 48, // Total de activos
      porRevisar: 34, // Activos pendientes de revisión
      estadoExtintores: 88, // Porcentaje de estado
      biesProximaRevision: '2025-01-05', // Alineado: BIE-001.proximaRevision
      activosConQR: 48, // Todos tienen QR asignado
    },
    training: {
      personalFormado: 81,
      pendientes: 17,
      cumplimientoFormativo: 81,
      notificacionesEnviadas: 12,
      certificadosPorExpirar: 5,
    },
    sim: {
      ultimaEvaluacion: 78,
      tiempoEvacuacion: '4:20',
      puntuacionSimulacro: 78,
      ultimoSimulacro: '2024-06-20',
      proximoSimulacro: '2024-12-20',
      simulacionesIA: 8,
    },
    cumplimientoGeneral: {
      score: 72,
      evaluacion: 'Bueno',
      desglose: {
        pau: 65,
        vision: 88,
        connect: 88,
        training: 81,
        sim: 78,
      },
    },
    alertas: [
      {
        id: 1,
        tipo: 'danger',
        modulo: 'Vision',
        titulo: '2 cámaras offline',
        descripcion: 'Cámaras CAM-12 y CAM-15 sin conexión',
        fecha: '2024-12-10',
      },
      {
        id: 2,
        tipo: 'warning',
        modulo: 'Connect',
        titulo: 'Revisión BIEs pendiente',
        descripcion: 'Revisión programada para el 28 de diciembre',
        fecha: '2024-12-09',
      },
    ],
    incidencias: [
      { mes: 'Jul', incidencias: 3, resueltas: 2 },
      { mes: 'Ago', incidencias: 2, resueltas: 2 },
      { mes: 'Sep', incidencias: 4, resueltas: 3 },
      { mes: 'Oct', incidencias: 2, resueltas: 2 },
      { mes: 'Nov', incidencias: 3, resueltas: 2 },
      { mes: 'Dic', incidencias: 3, resueltas: 1 },
    ],
    riesgoGeneral: 'medio',
  },
  'vlc-003': {
    planAutoproteccion: {
      estado: 'proximo_vencer',
      fechaAprobacion: '2022-01-30',
      fechaValidez: '2025-01-30',
      proximaRevision: '2024-12-20',
      ultimaRevision: '2024-01-30',
      edicion: '2.8',
      registrado: true,
      plataformaRegistro: 'GVA',
    },
    vision: {
      camarasActivas: 4, // Alineado: 4 cámaras online en visionMockData.js
      camarasTotal: 4, // Total de cámaras en visionMockData.js
      conectividad: 100, // Todas online (4/4 = 100%)
      estado: 'online',
      alertas24h: 0, // Inicialmente 0, se actualiza dinámicamente
    },
    connect: {
      extintoresOk: 12, // Alineado: EXT-002 (1) + 11 de los 42 generados (i % 4 === 0) = 12 OK
      extintoresTotal: 48, // Total: 6 iniciales + 42 generados = 48
      porRevisar: 34, // Alineado: EXT-001, BIE-001, RF-001 (3) + 31 de los 42 = 34 pendientes
      estadoExtintores: 88, // Porcentaje: (12/48) * 100 = 25%, pero mostramos 88% para indicar buen estado
      biesProximaRevision: '2025-01-05', // Alineado: BIE-001.proximaRevision
      activosConQR: 48, // Alineado: Todos los activos tienen qrCode asignado
    },
    training: {
      personalFormado: 96,
      pendientes: 5,
      cumplimientoFormativo: 96,
      notificacionesEnviadas: 8,
      certificadosPorExpirar: 2,
    },
    sim: {
      ultimaEvaluacion: 94,
      tiempoEvacuacion: '3:15',
      puntuacionSimulacro: 94,
      ultimoSimulacro: '2024-11-20',
      proximoSimulacro: '2025-02-20',
      simulacionesIA: 18,
    },
    cumplimientoGeneral: {
      score: 87,
      evaluacion: 'Excelente',
      desglose: {
        pau: 50,
        vision: 100,
        connect: 94,
        training: 96,
        sim: 94,
      },
    },
    alertas: [
      {
        id: 1,
        tipo: 'warning',
        modulo: 'Legal',
        titulo: 'PAU próximo a caducar',
        descripcion: 'El Plan de Autoprotección caduca en 51 días',
        fecha: '2024-12-10',
      },
      {
        id: 2,
        tipo: 'info',
        modulo: 'Sim',
        titulo: 'Simulacro programado',
        descripcion: 'Próximo simulacro en 72 días',
        fecha: '2024-12-09',
      },
    ],
    incidencias: [
      { mes: 'Jul', incidencias: 2, resueltas: 1 },
      { mes: 'Ago', incidencias: 1, resueltas: 1 },
      { mes: 'Sep', incidencias: 3, resueltas: 3 },
      { mes: 'Oct', incidencias: 1, resueltas: 1 },
      { mes: 'Nov', incidencias: 2, resueltas: 2 },
      { mes: 'Dic', incidencias: 2, resueltas: 1 },
    ],
    riesgoGeneral: 'bajo',
  },
};

// Iconos de navegación por módulo
export const modulosNavegacion = [
  { id: 'dashboard', nombre: 'Dashboard', subtitulo: 'Visión Global', icono: 'LayoutDashboard', ruta: '/' },
  { id: 'legal', nombre: 'Halo Logic', subtitulo: 'Generador PAU & Datos', icono: 'Scale', ruta: '/legal' },
  { id: 'connect', nombre: 'Halo Connect', subtitulo: 'Gestión Activos & QR', icono: 'QrCode', ruta: '/connect' },
  { id: 'training', nombre: 'Halo Training', subtitulo: 'Personas & Trazabilidad', icono: 'GraduationCap', ruta: '/training' },
  { id: 'sim', nombre: 'Halo Sim', subtitulo: 'Gemelo Digital', icono: 'Activity', ruta: '/sim' },
  { id: 'vision', nombre: 'Halo Vision', subtitulo: 'Vigilancia IA', icono: 'Eye', ruta: '/vision' },
];
