// Datos mock para Halo Connect

// Tipos de activos según RIPCI
export const assetTypes = {
  EXTINTOR: 'extintor',
  BIE: 'bie',
  PUERTA_RF: 'puerta_rf',
  DETECTOR: 'detector',
  CENTRALITA: 'centralita',
};

// Estados de activos
export const assetStatus = {
  OK: 'ok',
  PENDIENTE_REVISION: 'pendiente_revision',
  BAJA_TEMPORAL: 'baja_temporal',
  INCIDENCIA: 'incidencia',
};

// Estados de órdenes de trabajo
export const workOrderStatus = {
  PENDIENTE: 'pendiente',
  EN_CURSO: 'en_curso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
};

// Inventario de activos con geolocalización
// Coordenadas distribuidas en nave rectangular de almacén (100m x 60m)
// Estructura: Pasillos principales cada 20m, estanterías laterales
export const inventory = [
  // Extintores - Nave A (Sector 1: 0-50m x, 0-30m y)
  {
    id: 'EXT-001',
    uid: 'uid-ext-001',
    qrCode: 'QR-EXT-001',
    tipo: assetTypes.EXTINTOR,
    nombre: 'Extintor P-23',
    ubicacion: 'Nave A - Pasillo 1',
    sector: 'Sector 1',
    coordenadas: { x: 10, y: 15 }, // Entrada principal
    estado: assetStatus.PENDIENTE_REVISION,
    ripci: {
      tipo: 'Polvo ABC 6kg',
      carga: '6 kg',
      fechaFabricacion: '2022-03-15',
      fechaUltimoRetimbrado: '2024-01-10',
      vidaUtilRestante: '2027-03-15',
    },
    ultimaRevision: '2024-01-10',
    proximaRevision: '2025-01-10',
    tecnico: null,
  },
  {
    id: 'EXT-002',
    uid: 'uid-ext-002',
    qrCode: 'QR-EXT-002',
    tipo: assetTypes.EXTINTOR,
    nombre: 'Extintor CO2-12',
    ubicacion: 'Nave A - Pasillo 1',
    sector: 'Sector 1',
    coordenadas: { x: 30, y: 15 }, // Medio del pasillo 1
    estado: assetStatus.OK,
    ripci: {
      tipo: 'CO2 12kg',
      carga: '12 kg',
      fechaFabricacion: '2021-08-20',
      fechaUltimoRetimbrado: '2024-02-15',
      vidaUtilRestante: '2026-08-20',
    },
    ultimaRevision: '2024-02-15',
    proximaRevision: '2025-02-15',
    tecnico: 'Juan Pérez',
  },
  {
    id: 'EXT-003',
    uid: 'uid-ext-003',
    qrCode: 'QR-EXT-003',
    tipo: assetTypes.EXTINTOR,
    nombre: 'Extintor P-50',
    ubicacion: 'Nave A - Pasillo 2',
    sector: 'Sector 2',
    coordenadas: { x: 50, y: 25 }, // Pasillo 2, zona media
    estado: assetStatus.BAJA_TEMPORAL,
    ripci: {
      tipo: 'Polvo ABC 50kg',
      carga: '50 kg',
      fechaFabricacion: '2020-11-05',
      fechaUltimoRetimbrado: '2023-11-05',
      vidaUtilRestante: '2025-11-05',
    },
    ultimaRevision: '2023-11-05',
    proximaRevision: '2024-11-05',
    tecnico: null,
    incidencia: 'INC-001',
  },
  // BIE
  {
    id: 'BIE-001',
    uid: 'uid-bie-001',
    qrCode: 'QR-BIE-001',
    tipo: assetTypes.BIE,
    nombre: 'BIE 25mm',
    ubicacion: 'Nave A - Pasillo Principal',
    sector: 'Sector 1',
    coordenadas: { x: 20, y: 5 }, // Entrada, lado izquierdo
    estado: assetStatus.PENDIENTE_REVISION,
    ripci: {
      presionEstatica: '4.5 bar',
      presionDinamica: '3.8 bar',
      estadoManguera: 'OK',
      valvula: 'OK',
    },
    ultimaRevision: '2024-01-05',
    proximaRevision: '2025-01-05',
    tecnico: null,
  },
  {
    id: 'BIE-002',
    uid: 'uid-bie-002',
    qrCode: 'QR-BIE-002',
    tipo: assetTypes.BIE,
    nombre: 'BIE 25mm',
    ubicacion: 'Nave A - Pasillo 3',
    sector: 'Sector 3',
    coordenadas: { x: 70, y: 45 }, // Pasillo 3, fondo
    estado: assetStatus.INCIDENCIA,
    ripci: {
      presionEstatica: '2.1 bar',
      presionDinamica: '1.5 bar',
      estadoManguera: 'Agrietada',
      valvula: 'OK',
    },
    ultimaRevision: '2024-01-20',
    proximaRevision: '2025-01-20',
    tecnico: null,
    incidencia: 'INC-002',
  },
  // Puertas RF
  {
    id: 'RF-001',
    uid: 'uid-rf-001',
    qrCode: 'QR-RF-001',
    tipo: assetTypes.PUERTA_RF,
    nombre: 'Puerta RF Sector 1',
    ubicacion: 'Nave A - Pasillo Evacuación',
    sector: 'Sector 1',
    coordenadas: { x: 0, y: 30 }, // Salida de emergencia, lado izquierdo
    estado: assetStatus.PENDIENTE_REVISION,
    ripci: {
      cierreAutomatico: 'OK',
      integridadHoja: 'OK',
      obstaculos: 'Sin obstáculos',
      etiqueta: 'OK',
    },
    ultimaRevision: '2024-01-12',
    proximaRevision: '2025-01-12',
    tecnico: null,
  },
  // Más activos para completar 48 - Distribuidos en nave rectangular
  // Estructura: 4 pasillos principales (x: 0, 20, 40, 60, 80), 3 filas (y: 10, 30, 50)
  ...Array.from({ length: 42 }, (_, i) => {
    const pasillo = (i % 5); // 0-4 pasillos
    const fila = Math.floor(i / 5) % 3; // 0-2 filas
    const nave = i < 14 ? 'Nave A' : i < 28 ? 'Nave B' : 'Nave C';
    const sector = `Sector ${(i % 4) + 1}`;
    
    // Coordenadas distribuidas en plano rectangular
    const x = pasillo * 20 + 10; // Pasillos cada 20m, activos a 10m del inicio
    const y = fila * 20 + 10; // Filas cada 20m
    
    return {
      id: `EXT-${String(i + 4).padStart(3, '0')}`,
      uid: `uid-ext-${i + 4}`,
      qrCode: `QR-EXT-${i + 4}`,
      tipo: assetTypes.EXTINTOR,
      nombre: `Extintor P-23-${i + 4}`,
      ubicacion: `${nave} - Pasillo ${pasillo + 1}`,
      sector: sector,
      coordenadas: { x: x, y: y },
      estado: i % 4 === 0 ? assetStatus.OK : assetStatus.PENDIENTE_REVISION,
      ripci: {
        tipo: 'Polvo ABC 6kg',
        carga: '6 kg',
        fechaFabricacion: '2022-03-15',
        fechaUltimoRetimbrado: '2024-01-10',
        vidaUtilRestante: '2027-03-15',
      },
      ultimaRevision: '2024-01-10',
      proximaRevision: '2025-01-10',
      tecnico: i % 4 === 0 ? 'Juan Pérez' : null,
    };
  }),
];

// Checklists normativos por tipo de activo (UNE 23580)
export const checklistsByType = {
  [assetTypes.EXTINTOR]: [
    { id: 'precinto', label: 'Precinto', obligatorio: true },
    { id: 'manguera', label: 'Manguera', obligatorio: true },
    { id: 'senal', label: 'Señal', obligatorio: true },
    { id: 'peso', label: 'Peso (CO2)', obligatorio: false, soloCO2: true },
    { id: 'carga', label: 'Carga (Polvo)', obligatorio: false, soloPolvo: true },
    { id: 'manometro', label: 'Manómetro', obligatorio: true },
    { id: 'etiqueta', label: 'Etiqueta de identificación', obligatorio: true },
    { id: 'accesibilidad', label: 'Accesibilidad sin obstáculos', obligatorio: true },
  ],
  [assetTypes.BIE]: [
    { id: 'presion_estatica', label: 'Presión estática', obligatorio: true },
    { id: 'presion_dinamica', label: 'Presión dinámica', obligatorio: true },
    { id: 'manguera', label: 'Estado de manguera', obligatorio: true },
    { id: 'valvula', label: 'Válvula', obligatorio: true },
    { id: 'senal', label: 'Señalización', obligatorio: true },
    { id: 'manometro', label: 'Manómetro', obligatorio: true },
  ],
  [assetTypes.PUERTA_RF]: [
    { id: 'cierre_automatico', label: 'Cierre automático', obligatorio: true },
    { id: 'integridad_hoja', label: 'Integridad de la hoja', obligatorio: true },
    { id: 'obstaculos', label: 'Obstáculos', obligatorio: true },
    { id: 'etiqueta', label: 'Etiqueta RF', obligatorio: true },
    { id: 'cerradura', label: 'Cerradura', obligatorio: true },
  ],
};

// Órdenes de trabajo
export const workOrders = [
  {
    id: 'WO-001',
    numero: 'WO-2024-001',
    estado: workOrderStatus.EN_CURSO,
    fechaCreacion: '2024-03-15',
    fechaInicio: '2024-03-15',
    fechaFin: null,
    tecnico: 'Juan Pérez',
    activos: ['EXT-001', 'EXT-002', 'BIE-001', 'RF-001'],
    activosCompletados: ['EXT-002'],
    activosPendientes: ['EXT-001', 'BIE-001', 'RF-001'],
    magicLink: 'https://halo.example/magic/abc123xyz',
  },
  {
    id: 'WO-002',
    numero: 'WO-2024-002',
    estado: workOrderStatus.PENDIENTE,
    fechaCreacion: '2024-03-20',
    fechaInicio: null,
    fechaFin: null,
    tecnico: null,
    activos: ['EXT-003', 'BIE-002'],
    activosCompletados: [],
    activosPendientes: ['EXT-003', 'BIE-002'],
    magicLink: 'https://halo.example/magic/def456uvw',
  },
];

// Incidencias y tickets correctivos
export const incidents = [
  {
    id: 'INC-001',
    activoId: 'EXT-003',
    activoNombre: 'Extintor P-50',
    tipo: 'correctivo',
    severidad: 'alta',
    estado: 'pendiente_presupuesto',
    fechaCreacion: '2024-03-10',
    descripcion: 'Manguera agrietada detectada durante revisión',
    checklistItem: 'manguera',
    tecnico: 'Juan Pérez',
    presupuesto: null,
    aprobado: false,
    enReparacion: false,
    resuelto: false,
  },
  {
    id: 'INC-002',
    activoId: 'BIE-002',
    activoNombre: 'BIE 25mm',
    tipo: 'correctivo',
    severidad: 'critica',
    estado: 'aprobado',
    fechaCreacion: '2024-03-12',
    descripcion: 'Presión estática baja (2.1 bar). Requiere revisión de bomba.',
    checklistItem: 'presion_estatica',
    tecnico: 'Juan Pérez',
    presupuesto: 450.00,
    aprobado: true,
    enReparacion: true,
    resuelto: false,
  },
];

// Escenarios de validación IA
export const iaValidationScenarios = {
  manometro: {
    ok: {
      resultado: 'success',
      mensaje: '✅ Presión correcta (4.5 bar)',
      bloqueado: false,
    },
    error: {
      resultado: 'error',
      mensaje: '⚠️ DISCREPANCIA: Manómetro en zona roja. Bloqueado.',
      bloqueado: true,
    },
    fraude: {
      resultado: 'fraude',
      mensaje: '🚨 FRAUDE DETECTADO: Imagen no válida o manipulada',
      bloqueado: true,
    },
  },
  etiqueta: {
    ok: {
      resultado: 'success',
      mensaje: '✅ Fecha de fabricación: 2022-03-15 (Válida)',
      bloqueado: false,
    },
    error: {
      resultado: 'error',
      mensaje: '⚠️ ALERTA: Extintor fuera de vida útil',
      bloqueado: true,
    },
    fraude: {
      resultado: 'fraude',
      mensaje: '🚨 FRAUDE: No se puede validar etiqueta. OCR fallido.',
      bloqueado: true,
    },
  },
  entorno: {
    ok: {
      resultado: 'success',
      mensaje: '✅ Accesibilidad correcta',
      bloqueado: false,
    },
    error: {
      resultado: 'error',
      mensaje: '⚠️ Obstáculos detectados: Cajas bloqueando acceso',
      bloqueado: false, // No bloquea pero alerta
    },
  },
  geofencing: {
    ok: {
      resultado: 'success',
      mensaje: '✅ Ubicación GPS verificada',
      bloqueado: false,
    },
    fraude: {
      resultado: 'fraude',
      mensaje: '🚨 FRAUDE: Ubicación GPS no coincide con activo. Diferencia: 45m',
      bloqueado: true,
    },
  },
};

// Historial de revisiones
export const maintenanceHistory = [
  {
    id: 'REV-001',
    activoId: 'EXT-002',
    fecha: '2024-02-15',
    tecnico: 'Juan Pérez',
    resultado: 'OK',
    checklist: { precinto: true, manguera: true, senal: true, manometro: true },
    observaciones: 'Revisión completa sin incidencias',
    firmaTecnico: true,
    firmaTitular: true,
  },
  {
    id: 'REV-002',
    activoId: 'EXT-001',
    fecha: '2024-01-10',
    tecnico: 'María García',
    resultado: 'OK',
    checklist: { precinto: true, manguera: true, senal: true, manometro: true },
    observaciones: null,
    firmaTecnico: true,
    firmaTitular: true,
  },
];

// Función helper para obtener activos pendientes de revisión
export const getPendingAssets = () => {
  return inventory.filter(asset => asset.estado === assetStatus.PENDIENTE_REVISION);
};

// Función helper para calcular ruta optimizada
export const calculateOptimalRoute = (assets) => {
  // Algoritmo simple de ordenación por proximidad (distancia euclidiana)
  const sorted = [...assets].sort((a, b) => {
    const distA = Math.sqrt(a.coordenadas.x ** 2 + a.coordenadas.y ** 2);
    const distB = Math.sqrt(b.coordenadas.x ** 2 + b.coordenadas.y ** 2);
    return distA - distB;
  });
  return sorted;
};

// Función helper para obtener checklist según tipo de activo
export const getChecklistForAsset = (assetType) => {
  return checklistsByType[assetType] || [];
};

