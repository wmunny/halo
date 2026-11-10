/**
 * Contenido del Plan de Autoprotección (PAU) para Halo Training
 * Estructura basada en el PAU de Vitaly
 */

// Instrucciones de Actuación por tipo de emergencia
export const instruccionesActuacion = {
  incendio: {
    id: 'incendio',
    titulo: 'Incendio',
    icono: 'Flame',
    color: 'red',
    pasos: [
      'Si descubres un conato de incendio, mantén la calma.',
      'Avisa inmediatamente al Centro de Control o Responsable de Emergencia.',
      'Si es un fuego pequeño y sabes usar el extintor, intenta apagarlo.',
      'Si no puedes controlarlo, cierra puertas y ventanas para evitar propagación.',
      'Evacúa la zona siguiendo las rutas señalizadas.',
      'No uses los ascensores bajo ninguna circunstancia.',
      'Dirígete al Punto de Reunión designado.',
    ],
    importante: 'Nunca pongas en riesgo tu vida. Si el fuego es grande, evacúa inmediatamente.',
    telefonoEmergencia: '112',
  },
  emergenciaMedica: {
    id: 'emergencia_medica',
    titulo: 'Emergencia Médica',
    icono: 'Heart',
    color: 'blue',
    pasos: [
      'PROTEGER: Asegura la zona para evitar más accidentes.',
      'AVISAR: Llama al Centro de Control o al 112.',
      'SOCORRER: Si tienes formación, aplica primeros auxilios.',
      'No muevas al accidentado salvo peligro inminente.',
      'Mantén al accidentado abrigado y tranquilo.',
      'Espera a los servicios de emergencia.',
    ],
    importante: 'Recuerda el protocolo P.A.S.: Proteger, Avisar, Socorrer.',
    telefonoEmergencia: '112',
  },
  amenazaBomba: {
    id: 'amenaza_bomba',
    titulo: 'Amenaza de Bomba',
    icono: 'AlertTriangle',
    color: 'orange',
    pasos: [
      'No toques ningún objeto sospechoso.',
      'Avisa inmediatamente al Centro de Control.',
      'Aléjate de la zona sin correr.',
      'No uses teléfonos móviles cerca del objeto.',
      'Espera instrucciones del Responsable de Emergencia.',
      'Si se ordena evacuación, sigue las rutas designadas.',
    ],
    importante: 'Nunca manipules un paquete u objeto sospechoso.',
    telefonoEmergencia: '112',
  },
};

// Plan de Evacuación
export const planEvacuacion = {
  rutasEvacuacion: {
    titulo: 'Rutas de Evacuación',
    descripcion: 'Sigue siempre la señalización verde de salida de emergencia. Las rutas están marcadas en el suelo y las paredes.',
    consejos: [
      'Conoce las salidas más cercanas a tu puesto de trabajo.',
      'Mantén las rutas despejadas de obstáculos.',
      'En caso de humo, agáchate y avanza pegado a la pared.',
      'No retrocedas a recoger objetos personales.',
    ],
  },
  puntoReunion: {
    titulo: 'Punto de Reunión',
    descripcion: 'El Punto de Reunión es el lugar seguro donde debes dirigirte tras la evacuación.',
    ubicacion: 'Parking exterior - Zona marcada con señal verde "PUNTO DE REUNIÓN"',
    instrucciones: [
      'Dirígete al punto de reunión sin detenerte.',
      'Una vez allí, repórtate al Responsable de Recuento.',
      'No abandones el punto de reunión hasta recibir instrucciones.',
      'Ayuda a compañeros con movilidad reducida si es seguro.',
    ],
  },
  confinamiento: {
    titulo: 'Confinamiento',
    descripcion: 'En algunos casos (nube tóxica, amenaza exterior), se ordenará confinamiento en lugar de evacuación.',
    instrucciones: [
      'Permanece en el interior del edificio.',
      'Cierra puertas y ventanas herméticamente.',
      'Apaga sistemas de ventilación y aire acondicionado.',
      'Espera instrucciones del Responsable de Emergencia.',
      'Mantén la calma y permanece informado.',
    ],
    cuando: 'Se aplica en casos de: nube tóxica, incendio forestal cercano, amenaza exterior.',
  },
};

// Ficha de Riesgos
export const fichaRiesgos = {
  internos: [
    {
      id: 'incendio',
      nombre: 'Incendio',
      descripcion: 'Riesgo de fuego por materiales inflamables, instalaciones eléctricas o procesos industriales.',
      nivelRiesgo: 'medio',
      medidasPreventivas: [
        'Mantener orden y limpieza en el puesto de trabajo.',
        'No fumar en zonas no autorizadas.',
        'Reportar instalaciones eléctricas defectuosas.',
      ],
    },
    {
      id: 'derrame',
      nombre: 'Derrame Químico',
      descripcion: 'Riesgo de vertido de sustancias químicas peligrosas.',
      nivelRiesgo: 'medio',
      medidasPreventivas: [
        'Conocer las fichas de seguridad de los productos.',
        'Usar los EPIs adecuados.',
        'Reportar cualquier fuga o derrame.',
      ],
    },
    {
      id: 'explosion',
      nombre: 'Explosión',
      descripcion: 'Riesgo de explosión por gases, polvos o sustancias inflamables.',
      nivelRiesgo: 'bajo',
      medidasPreventivas: [
        'No acumular materiales inflamables.',
        'Mantener ventilación adecuada.',
        'Seguir procedimientos de trabajo seguro.',
      ],
    },
  ],
  externos: [
    {
      id: 'inundacion',
      nombre: 'Inundación',
      descripcion: 'Riesgo de inundación por lluvias torrenciales o desbordamiento de cauces.',
      nivelRiesgo: 'bajo',
      medidasPreventivas: [
        'Conocer las zonas inundables del centro.',
        'Seguir alertas meteorológicas.',
      ],
    },
    {
      id: 'sismico',
      nombre: 'Terremoto',
      descripcion: 'Riesgo sísmico según la zona geográfica.',
      nivelRiesgo: 'bajo',
      medidasPreventivas: [
        'Protegerse bajo muebles resistentes.',
        'Alejarse de ventanas y objetos que puedan caer.',
      ],
    },
    {
      id: 'incendio_forestal',
      nombre: 'Incendio Forestal',
      descripcion: 'Riesgo de incendio forestal en zonas cercanas.',
      nivelRiesgo: 'bajo',
      medidasPreventivas: [
        'Seguir instrucciones de confinamiento.',
        'Cerrar ventanas y puertas.',
      ],
    },
  ],
};

// Módulos de Microlearning
export const modulosMicrolearning = [
  {
    id: 'modulo-1',
    titulo: 'La Alarma y la Reacción',
    descripcion: 'Aprende a identificar los diferentes tipos de alarma y cómo reaccionar ante cada una.',
    duracion: '3 min',
    contenido: [
      'Sonido de la alarma de alerta (conato)',
      'Sonido de la alarma general (evacuación)',
      'Diferencias entre ambas y acciones a tomar',
      'Importancia de mantener la calma',
    ],
    videoPlaceholder: {
      titulo: 'Video: Reconocimiento de Alarmas',
      descripcion: 'Este video reproduce los sonidos reales de las alarmas del centro y explica la reacción adecuada.',
      duracion: '2:45',
    },
    videoUrl: import.meta.env.BASE_URL + 'videos/modulo-1-alarma-reaccion.mp4', // Video generado con Veo3 (mockup)
  },
  {
    id: 'modulo-2',
    titulo: 'Conducta PAS',
    descripcion: 'Protocolo de actuación ante emergencias médicas: Proteger, Avisar, Socorrer.',
    duracion: '4 min',
    contenido: [
      'P - Proteger: Asegurar la zona',
      'A - Avisar: Comunicar al Centro de Control',
      'S - Socorrer: Primeros auxilios básicos',
      'Uso de pulsadores de alarma',
    ],
    videoPlaceholder: {
      titulo: 'Video: Protocolo P.A.S.',
      descripcion: 'Demostración práctica del protocolo Proteger-Avisar-Socorrer con ejemplos reales.',
      duracion: '3:30',
    },
    videoUrl: import.meta.env.BASE_URL + 'videos/modulo-2-conducta-pas.mp4', // Video generado con Veo3 (mockup)
  },
  {
    id: 'modulo-3',
    titulo: 'Evacuación Segura',
    descripcion: 'Normas de actuación para una evacuación ordenada y segura.',
    duracion: '3 min',
    contenido: [
      'No usar ascensores',
      'No retroceder a recoger objetos',
      'Caminar pegado a la pared en caso de humo',
      'Dirigirse al Punto de Reunión',
      'Reportarse al Responsable de Recuento',
    ],
    videoPlaceholder: {
      titulo: 'Video: Evacuación del Edificio',
      descripcion: 'Recorrido visual por las rutas de evacuación hasta el punto de reunión.',
      duracion: '2:15',
    },
    videoUrl: import.meta.env.BASE_URL + 'videos/modulo-3-evacuacion-segura.mp4', // Video generado con Veo3 (mockup)
  },
  {
    id: 'modulo-4',
    titulo: 'Uso Básico de Extintores',
    descripcion: 'Nociones básicas sobre ubicación y uso de extintores.',
    duracion: '3 min',
    contenido: [
      'Tipos de extintores y su ubicación',
      'Técnica PASS: Pull, Aim, Squeeze, Sweep',
      'Quitar pasador de seguridad',
      'Apuntar a la base del fuego',
      'Apretar la palanca y barrer',
    ],
    videoPlaceholder: {
      titulo: 'Video: Uso del Extintor',
      descripcion: 'Demostración práctica de cómo usar un extintor siguiendo la técnica PASS.',
      duracion: '2:00',
    },
    videoUrl: import.meta.env.BASE_URL + 'videos/modulo-4-uso-extintores.mp4', // Video generado con Veo3 (mockup)
  },
];

// Módulos de Microlearning específicos por Rol del Equipo de Intervención
export const modulosIntervencion = {
  jefe_emergencia: [
    {
      id: 'je-modulo-1',
      titulo: 'Cadena de Mando y Coordinación',
      descripcion: 'Tu rol como Jefe de Emergencia: responsabilidades, toma de decisiones y coordinación con servicios externos.',
      duracion: '5 min',
      contenido: [
        'Estructura jerárquica del Plan de Autoprotección',
        'Responsabilidades del Jefe de Emergencia',
        'Comunicación con el Centro de Control',
        'Coordinación con servicios de emergencias externos (112)',
        'Declaración y finalización del estado de emergencia',
      ],
      videoPlaceholder: { titulo: 'Video: Rol del Jefe de Emergencia', descripcion: 'Responsabilidades y cadena de mando en emergencias.', duracion: '4:30' },
      videoUrl: null,
    },
    {
      id: 'je-modulo-2',
      titulo: 'Gestión del Centro de Control',
      descripcion: 'Operación del puesto de mando: comunicaciones, monitorización y toma de decisiones bajo presión.',
      duracion: '4 min',
      contenido: [
        'Activación del puesto de mando',
        'Uso de sistemas de comunicación interna',
        'Recepción y análisis de información de los equipos',
        'Toma de decisiones: evacuación, confinamiento o intervención',
        'Registro de acciones durante la emergencia',
      ],
      videoPlaceholder: { titulo: 'Video: Centro de Control en Emergencias', descripcion: 'Operación del puesto de mando durante una emergencia real.', duracion: '3:45' },
      videoUrl: null,
    },
    {
      id: 'je-modulo-3',
      titulo: 'Comunicación con Servicios Externos',
      descripcion: 'Cómo comunicarte eficazmente con el 112, bomberos, policía y servicios médicos.',
      duracion: '3 min',
      contenido: [
        'Información clave al llamar al 112',
        'Datos del centro: dirección, accesos, número de personas',
        'Descripción de la emergencia: tipo, magnitud, afectados',
        'Recepción y guía de servicios externos al llegar',
        'Transmisión del mando a los servicios profesionales',
      ],
      videoPlaceholder: { titulo: 'Video: Comunicación con el 112', descripcion: 'Protocolo de comunicación con servicios de emergencias.', duracion: '2:30' },
      videoUrl: null,
    },
  ],
  jefe_intervencion: [
    {
      id: 'ji-modulo-1',
      titulo: 'Dirección Técnica de la Intervención',
      descripcion: 'Liderazgo de los Equipos de Primera Intervención: coordinación táctica y seguridad operativa.',
      duracion: '5 min',
      contenido: [
        'Diferencias entre Jefe de Intervención y Jefe de Emergencia',
        'Coordinación de equipos EPI y ESI',
        'Evaluación rápida de la situación en campo',
        'Criterios para escalar la emergencia',
        'Protocolos de seguridad para el equipo de intervención',
      ],
      videoPlaceholder: { titulo: 'Video: Dirección de Intervención', descripcion: 'Liderazgo táctico de los equipos de intervención.', duracion: '4:15' },
      videoUrl: null,
    },
    {
      id: 'ji-modulo-2',
      titulo: 'Evaluación y Clasificación de Emergencias',
      descripcion: 'Metodología para evaluar la gravedad de una emergencia y activar los recursos adecuados.',
      duracion: '4 min',
      contenido: [
        'Clasificación: Conato, Emergencia Parcial, Emergencia General',
        'Criterios de evaluación: extensión, peligro, afectados',
        'Activación de recursos por nivel de emergencia',
        'Comunicación de la evaluación al Jefe de Emergencia',
        'Revisión y ajuste durante la evolución de la emergencia',
      ],
      videoPlaceholder: { titulo: 'Video: Evaluación de Emergencias', descripcion: 'Metodología de clasificación y respuesta por nivel.', duracion: '3:30' },
      videoUrl: null,
    },
  ],
  equipo_primera_intervencion: [
    {
      id: 'epi-modulo-1',
      titulo: 'Técnicas Avanzadas de Primera Intervención en Incendios',
      descripcion: 'Uso profesional de extintores, BIEs y técnicas de confinamiento de fuego como miembro del EPI.',
      duracion: '6 min',
      contenido: [
        'Tipos de fuego: clasificación A, B, C, D y K',
        'Selección del agente extintor adecuado',
        'Técnica correcta con extintor portátil (PASS extendido)',
        'Uso de Boca de Incendio Equipada (BIE)',
        'Técnicas de confinamiento: cierre de puertas cortafuego',
        'Cuándo abandonar la intervención y evacuar',
      ],
      videoPlaceholder: { titulo: 'Video: Intervención en Incendios - EPI', descripcion: 'Técnicas avanzadas de extinción y confinamiento para el EPI.', duracion: '5:00' },
      videoUrl: null,
    },
    {
      id: 'epi-modulo-2',
      titulo: 'Seguridad Personal en la Intervención',
      descripcion: 'EPIs obligatorios, límites de la intervención amateur y señales de peligro que obligan a retirarse.',
      duracion: '4 min',
      contenido: [
        'Equipos de Protección Individual (EPI) requeridos',
        'Condiciones bajo las que NO se debe intervenir',
        'Señales de peligro: humo negro, gases, temperatura extrema',
        'Trabajo en pareja: nunca intervenir solo',
        'Comunicación continua con el Jefe de Intervención',
      ],
      videoPlaceholder: { titulo: 'Video: Seguridad en la Intervención', descripcion: 'Límites y protección personal durante la intervención.', duracion: '3:30' },
      videoUrl: null,
    },
  ],
  equipo_segunda_intervencion: [
    {
      id: 'esi-modulo-1',
      titulo: 'Intervención en Emergencias Graves',
      descripcion: 'El Equipo de Segunda Intervención actúa cuando el EPI no puede controlar la situación. Técnicas y coordinación.',
      duracion: '5 min',
      contenido: [
        'Cuándo se activa el ESI: criterios y protocolos',
        'Coordinación con el EPI que se retira',
        'Uso de equipos de mayor capacidad (mangueras, sistemas fijos)',
        'Técnicas de búsqueda y rescate básico',
        'Preparación para la llegada de bomberos',
      ],
      videoPlaceholder: { titulo: 'Video: Rol del ESI', descripcion: 'Actuación del Equipo de Segunda Intervención en emergencias graves.', duracion: '4:30' },
      videoUrl: null,
    },
    {
      id: 'esi-modulo-2',
      titulo: 'Rescate y Apoyo a Evacuación',
      descripcion: 'Procedimientos de rescate de personas atrapadas y apoyo a la evacuación de personas con movilidad reducida.',
      duracion: '4 min',
      contenido: [
        'Búsqueda sistemática de personas en zonas afectadas',
        'Técnicas de rescate sin riesgo para el rescatador',
        'Apoyo a la evacuación: personas con movilidad reducida',
        'Zonas de refugio: uso y gestión',
        'Entrega de rescatados a los servicios sanitarios',
      ],
      videoPlaceholder: { titulo: 'Video: Rescate y Evacuación Asistida', descripcion: 'Técnicas de rescate y apoyo a personas vulnerables.', duracion: '3:45' },
      videoUrl: null,
    },
  ],
  equipo_primeros_auxilios: [
    {
      id: 'epa-modulo-1',
      titulo: 'RCP y Uso del DEA',
      descripcion: 'Reanimación Cardiopulmonar (RCP) básica y manejo del Desfibrilador Externo Automatizado (DEA).',
      duracion: '6 min',
      contenido: [
        'Reconocimiento de la parada cardiorrespiratoria',
        'Secuencia RCP: compresiones torácicas y ventilaciones',
        'Ratio y profundidad de las compresiones',
        'Uso del DEA: encendido, colocación de parches, descarga',
        'Alternancia RCP-DEA hasta llegada del SAMUR/112',
        'RCP en situaciones especiales: embarazada, niños',
      ],
      videoPlaceholder: { titulo: 'Video: RCP y DEA', descripcion: 'Protocolo completo de reanimación cardiopulmonar y uso del desfibrilador.', duracion: '5:15' },
      videoUrl: null,
    },
    {
      id: 'epa-modulo-2',
      titulo: 'Primeros Auxilios Avanzados en Emergencias',
      descripcion: 'Atención a politraumatizados, quemaduras, inhalación de humo y otras lesiones frecuentes en emergencias.',
      duracion: '5 min',
      contenido: [
        'Triage básico: clasificación de víctimas por gravedad',
        'Control de hemorragias: presión directa, torniquete improvisado',
        'Atención a quemaduras: enfriamiento y cobertura',
        'Inhalación de humo: síntomas y actuación',
        'Posición de seguridad y traslado correcto',
        'Registro de víctimas atendidas para los servicios médicos',
      ],
      videoPlaceholder: { titulo: 'Video: Primeros Auxilios en Emergencias', descripcion: 'Atención a lesiones graves en situaciones de emergencia colectiva.', duracion: '4:30' },
      videoUrl: null,
    },
  ],
  equipo_alarma_evacuacion: [
    {
      id: 'eae-modulo-1',
      titulo: 'Gestión de la Evacuación: Tu Zona Asignada',
      descripcion: 'Procedimientos de evacuación, asignación de zonas y gestión de flujos de personas hacia las salidas.',
      duracion: '5 min',
      contenido: [
        'Tu zona de responsabilidad según el PAU',
        'Activación de la alarma: manual y automática',
        'Instrucciones de evacuación: mensajes claros y tranquilizadores',
        'Gestión de flujos: evitar aglomeraciones en pasillos y escaleras',
        'Verificación de espacios: comprobar que la zona queda vacía',
        'Comunicación de incidencias al Jefe de Emergencia',
      ],
      videoPlaceholder: { titulo: 'Video: Gestión de Evacuación por Zonas', descripcion: 'Protocolo de evacuación y control de flujos para el EAE.', duracion: '4:15' },
      videoUrl: null,
    },
    {
      id: 'eae-modulo-2',
      titulo: 'Atención a Personas con Necesidades Especiales',
      descripcion: 'Protocolos para asistir a personas con movilidad reducida, discapacidad sensorial o situación de pánico.',
      duracion: '4 min',
      contenido: [
        'Identificación previa de personas con necesidades especiales',
        'Técnicas de asistencia sin agravar lesiones',
        'Zonas de refugio: qué son y cómo usarlas',
        'Comunicación con personas en pánico: técnicas de calma',
        'Gestión de visitantes y personal externo en evacuación',
      ],
      videoPlaceholder: { titulo: 'Video: Evacuación de Personas Vulnerables', descripcion: 'Asistencia especializada durante la evacuación.', duracion: '3:30' },
      videoUrl: null,
    },
  ],
  responsable_recuento: [
    {
      id: 'rr-modulo-1',
      titulo: 'Protocolo de Recuento en el Punto de Reunión',
      descripcion: 'Procedimientos de recuento de personal en el Punto de Reunión y reporte al Jefe de Emergencia.',
      duracion: '4 min',
      contenido: [
        'Tu posición en el Punto de Reunión',
        'Listado de personal por departamento/turno',
        'Técnica de recuento: llamada nominal vs. estimación',
        'Gestión de ausencias: desaparecidos vs. bajas previas',
        'Comunicación del resultado al Jefe de Emergencia',
        'Actuación si falta personal tras el recuento',
      ],
      videoPlaceholder: { titulo: 'Video: Recuento en Emergencias', descripcion: 'Procedimiento de recuento y reporte en el Punto de Reunión.', duracion: '3:30' },
      videoUrl: null,
    },
    {
      id: 'rr-modulo-2',
      titulo: 'Gestión del Punto de Reunión',
      descripcion: 'Control del Punto de Reunión: acceso, seguridad de la zona y coordinación con los servicios de emergencias.',
      duracion: '3 min',
      contenido: [
        'Delimitación y seguridad del Punto de Reunión',
        'Gestión de accesos: solo personal evacuado',
        'Recepción de personal de servicios externos',
        'Atención a familiares y medios de comunicación',
        'Mantenimiento del orden hasta cierre de la emergencia',
      ],
      videoPlaceholder: { titulo: 'Video: Gestión del Punto de Reunión', descripcion: 'Control y coordinación en el Punto de Reunión durante la emergencia.', duracion: '2:45' },
      videoUrl: null,
    },
  ],
};

// Quiz de validación específico por rol de intervención
export const quizIntervencion = {
  jefe_emergencia: {
    titulo: 'Quiz: Jefe de Emergencia',
    descripcion: 'Valida tus conocimientos como Jefe de Emergencia.',
    preguntas: [
      {
        id: 'je-q1',
        pregunta: '¿Cuál es la primera acción del Jefe de Emergencia al declararse una emergencia?',
        opciones: [
          { id: 'a', texto: 'Llamar al 112 inmediatamente' },
          { id: 'b', texto: 'Activar el Centro de Control y evaluar la situación con los equipos' },
          { id: 'c', texto: 'Ordenar la evacuación general del edificio' },
          { id: 'd', texto: 'Acudir al punto de la emergencia personalmente' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'El Jefe de Emergencia debe activar el Centro de Control y recibir información de los equipos antes de tomar decisiones como la evacuación general o llamar al 112.',
      },
      {
        id: 'je-q2',
        pregunta: '¿Quién tiene autoridad para ordenar una evacuación general del edificio?',
        opciones: [
          { id: 'a', texto: 'Cualquier miembro del equipo de intervención' },
          { id: 'b', texto: 'El Jefe de Intervención desde campo' },
          { id: 'c', texto: 'El Jefe de Emergencia desde el Centro de Control' },
          { id: 'd', texto: 'El primer responsable de área que detecte el peligro' },
        ],
        respuestaCorrecta: 'c',
        explicacion: 'Solo el Jefe de Emergencia tiene autoridad para ordenar una evacuación general. El Jefe de Intervención puede solicitar la evacuación pero la orden final la emite el Jefe de Emergencia.',
      },
      {
        id: 'je-q3',
        pregunta: '¿Qué información es imprescindible transmitir al 112 al realizar la llamada?',
        opciones: [
          { id: 'a', texto: 'Solo el nombre de la empresa y el tipo de emergencia' },
          { id: 'b', texto: 'Dirección exacta, tipo de emergencia, magnitud estimada y número de afectados' },
          { id: 'c', texto: 'El número de teléfono del Jefe de Seguridad' },
          { id: 'd', texto: 'El listado completo de trabajadores del centro' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'Al llamar al 112 debes proporcionar: dirección exacta del centro, tipo de emergencia, magnitud estimada y número aproximado de afectados para que los servicios de emergencias puedan responder adecuadamente.',
      },
    ],
  },
  jefe_intervencion: {
    titulo: 'Quiz: Jefe de Intervención',
    descripcion: 'Valida tus conocimientos como Jefe de Intervención.',
    preguntas: [
      {
        id: 'ji-q1',
        pregunta: '¿Cuándo debe el Jefe de Intervención ordenar la retirada del EPI de la zona de intervención?',
        opciones: [
          { id: 'a', texto: 'Cuando el fuego supera 1 metro de altura' },
          { id: 'b', texto: 'Cuando el extintor se agota' },
          { id: 'c', texto: 'Cuando la seguridad del equipo está en riesgo o la emergencia supera la capacidad del EPI' },
          { id: 'd', texto: 'Siempre que lleguen los bomberos' },
        ],
        respuestaCorrecta: 'c',
        explicacion: 'La seguridad del equipo es prioritaria. Se debe ordenar retirada cuando el riesgo supera la capacidad de intervención segura, no por criterios de tamaño del fuego exclusivamente.',
      },
      {
        id: 'ji-q2',
        pregunta: '¿Qué clasificación corresponde a una emergencia que afecta a todo el edificio y requiere evacuación general?',
        opciones: [
          { id: 'a', texto: 'Conato' },
          { id: 'b', texto: 'Emergencia Parcial' },
          { id: 'c', texto: 'Emergencia General' },
          { id: 'd', texto: 'Situación de Alerta' },
        ],
        respuestaCorrecta: 'c',
        explicacion: 'Una Emergencia General es aquella que afecta a todo el edificio o no puede ser controlada con los medios propios, requiriendo evacuación general y apoyo de servicios externos.',
      },
      {
        id: 'ji-q3',
        pregunta: '¿A quién reporta directamente el Jefe de Intervención durante una emergencia?',
        opciones: [
          { id: 'a', texto: 'A los bomberos cuando llegan' },
          { id: 'b', texto: 'Al director de la empresa' },
          { id: 'c', texto: 'Al Jefe de Emergencia en el Centro de Control' },
          { id: 'd', texto: 'Al Responsable de Recuento' },
        ],
        respuestaCorrecta: 'c',
        explicacion: 'El Jefe de Intervención reporta directamente al Jefe de Emergencia, manteniéndolo informado de la situación en campo para que pueda tomar las decisiones oportunas.',
      },
    ],
  },
  equipo_primera_intervencion: {
    titulo: 'Quiz: Equipo de Primera Intervención',
    descripcion: 'Valida tus conocimientos como miembro del EPI.',
    preguntas: [
      {
        id: 'epi-q1',
        pregunta: '¿Qué tipo de extintor debes usar en un fuego eléctrico (Clase C)?',
        opciones: [
          { id: 'a', texto: 'Extintor de agua' },
          { id: 'b', texto: 'Extintor de espuma' },
          { id: 'c', texto: 'Extintor de CO₂ o polvo seco' },
          { id: 'd', texto: 'Cualquier extintor, todos sirven' },
        ],
        respuestaCorrecta: 'c',
        explicacion: 'Los fuegos eléctricos requieren extintores de CO₂ o polvo seco. El agua y la espuma son conductores eléctricos y pueden provocar electrocución.',
      },
      {
        id: 'epi-q2',
        pregunta: '¿Bajo qué condición un miembro del EPI NUNCA debe intervenir?',
        opciones: [
          { id: 'a', texto: 'Si el fuego lleva más de 2 minutos activo' },
          { id: 'b', texto: 'Si está solo sin compañero de intervención' },
          { id: 'c', texto: 'Si no hay luz natural en la zona' },
          { id: 'd', texto: 'Si el extintor tiene más de un año' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'El EPI nunca debe intervenir en solitario. El trabajo en pareja es un requisito de seguridad fundamental: mientras uno interviene, el otro mantiene la ruta de escape despejada.',
      },
      {
        id: 'epi-q3',
        pregunta: '¿Cuál es la técnica correcta para avanzar por un pasillo con humo hacia la zona de intervención?',
        opciones: [
          { id: 'a', texto: 'Correr para minimizar el tiempo de exposición' },
          { id: 'b', texto: 'Agacharse y avanzar pegado a la pared, con la boca cubierta' },
          { id: 'c', texto: 'Caminar erguido para mantener la visión' },
          { id: 'd', texto: 'Esperar a que el humo se disipe antes de avanzar' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'El humo caliente sube. Agacharse mantiene al interviniente en la zona de aire más limpio y fresco. Avanzar pegado a la pared ayuda a mantener la orientación.',
      },
    ],
  },
  equipo_segunda_intervencion: {
    titulo: 'Quiz: Equipo de Segunda Intervención',
    descripcion: 'Valida tus conocimientos como miembro del ESI.',
    preguntas: [
      {
        id: 'esi-q1',
        pregunta: '¿Cuándo se activa el Equipo de Segunda Intervención?',
        opciones: [
          { id: 'a', texto: 'Simultáneamente al EPI desde el inicio' },
          { id: 'b', texto: 'Solo si hay víctimas atrapadas' },
          { id: 'c', texto: 'Cuando el EPI no puede controlar la emergencia o requiere apoyo' },
          { id: 'd', texto: 'Siempre antes de llamar al 112' },
        ],
        respuestaCorrecta: 'c',
        explicacion: 'El ESI se activa como refuerzo cuando la emergencia supera la capacidad del EPI o cuando el Jefe de Intervención determina que se necesita mayor capacidad de respuesta.',
      },
      {
        id: 'esi-q2',
        pregunta: '¿Qué son las zonas de refugio y para qué sirven?',
        opciones: [
          { id: 'a', texto: 'Zonas seguras fuera del edificio para el personal evacuado' },
          { id: 'b', texto: 'Espacios protegidos dentro del edificio para personas que no pueden evacuar' },
          { id: 'c', texto: 'Almacenes de material contra incendios' },
          { id: 'd', texto: 'Puntos de reunión del equipo de intervención' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'Las zonas de refugio son espacios protegidos dentro del edificio (generalmente con puertas RF) donde pueden esperar las personas que no pueden evacuar por las escaleras, hasta ser rescatadas.',
      },
      {
        id: 'esi-q3',
        pregunta: '¿Cuál es el principio fundamental en una operación de rescate de personas atrapadas?',
        opciones: [
          { id: 'a', texto: 'Rescatar al mayor número de personas lo más rápido posible' },
          { id: 'b', texto: 'No poner en riesgo al rescatador: si el rescate es inseguro, esperar a los profesionales' },
          { id: 'c', texto: 'Actuar siempre antes de la llegada de bomberos' },
          { id: 'd', texto: 'Mover a las víctimas al exterior del edificio en todos los casos' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'La seguridad del rescatador es prioritaria. Un rescatador herido se convierte en otra víctima. Si el rescate implica riesgo elevado, se debe esperar a los bomberos y comunicar la ubicación de las víctimas.',
      },
    ],
  },
  equipo_primeros_auxilios: {
    titulo: 'Quiz: Equipo de Primeros Auxilios',
    descripcion: 'Valida tus conocimientos como miembro del EPA.',
    preguntas: [
      {
        id: 'epa-q1',
        pregunta: '¿Cuál es el ritmo correcto de compresiones torácicas en RCP para adultos?',
        opciones: [
          { id: 'a', texto: '60 compresiones por minuto' },
          { id: 'b', texto: '100-120 compresiones por minuto' },
          { id: 'c', texto: '140-160 compresiones por minuto' },
          { id: 'd', texto: '30 compresiones por minuto' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'El ritmo recomendado por el ERC (European Resuscitation Council) es de 100-120 compresiones por minuto, con una profundidad de 5-6 cm en el centro del tórax.',
      },
      {
        id: 'epa-q2',
        pregunta: '¿Qué debes hacer inmediatamente ante una quemadura química (ácido o base)?',
        opciones: [
          { id: 'a', texto: 'Aplicar pasta de dientes o bicarbonato para neutralizar' },
          { id: 'b', texto: 'Cubrir con un vendaje seco' },
          { id: 'c', texto: 'Lavar con abundante agua fría durante al menos 20 minutos' },
          { id: 'd', texto: 'Reventar las ampollas que se formen' },
        ],
        respuestaCorrecta: 'c',
        explicacion: 'La irrigación con abundante agua fría durante un mínimo de 20 minutos es el tratamiento inmediato para cualquier quemadura química, eliminando el agente causante y enfriando el tejido.',
      },
      {
        id: 'epa-q3',
        pregunta: '¿Qué es el triage y por qué es importante en una emergencia con múltiples víctimas?',
        opciones: [
          { id: 'a', texto: 'Un tipo de vendaje para heridas graves' },
          { id: 'b', texto: 'La clasificación de víctimas por gravedad para priorizar la atención' },
          { id: 'c', texto: 'El registro de víctimas para comunicarlo al 112' },
          { id: 'd', texto: 'La evaluación del edificio para decidir si evacuar' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'El triage es la clasificación rápida de víctimas según su gravedad para dar la mejor atención posible con los recursos disponibles. Permite tratar primero a quienes más se pueden beneficiar de la atención inmediata.',
      },
    ],
  },
  equipo_alarma_evacuacion: {
    titulo: 'Quiz: Equipo de Alarma y Evacuación',
    descripcion: 'Valida tus conocimientos como miembro del EAE.',
    preguntas: [
      {
        id: 'eae-q1',
        pregunta: '¿Cuál es tu responsabilidad principal como miembro del EAE antes de dirigirte al Punto de Reunión?',
        opciones: [
          { id: 'a', texto: 'Llamar al 112 desde tu puesto' },
          { id: 'b', texto: 'Verificar que tu zona asignada ha quedado completamente vacía' },
          { id: 'c', texto: 'Desconectar todos los equipos eléctricos del edificio' },
          { id: 'd', texto: 'Esperar instrucciones del Jefe de Emergencia en tu puesto' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'El EAE es responsable de verificar que su zona asignada queda vacía durante la evacuación. Solo tras confirmar que no hay nadie en la zona, debe dirigirse al Punto de Reunión e informar al Jefe de Emergencia.',
      },
      {
        id: 'eae-q2',
        pregunta: '¿Cómo debes actuar con una persona en pánico que se niega a evacuar?',
        opciones: [
          { id: 'a', texto: 'Obligarle físicamente a salir del edificio' },
          { id: 'b', texto: 'Dejarla y continuar con el resto de la evacuación' },
          { id: 'c', texto: 'Hablar con calma, usar su nombre, dar instrucciones claras y acompañarla' },
          { id: 'd', texto: 'Llamar a sus familiares para que la convenzan' },
        ],
        respuestaCorrecta: 'c',
        explicacion: 'Ante una persona en pánico, la calma es tu herramienta principal. Usa su nombre, habla despacio, da instrucciones simples y acompáñala físicamente. Si no responde, comunícalo al Jefe de Emergencia.',
      },
      {
        id: 'eae-q3',
        pregunta: '¿Qué debes hacer si al barrer tu zona encuentras una puerta cerrada y no sabes si hay alguien dentro?',
        opciones: [
          { id: 'a', texto: 'Forzar la puerta y entrar' },
          { id: 'b', texto: 'Ignorarla y continuar con la evacuación' },
          { id: 'c', texto: 'Tocar la puerta, gritar el aviso de evacuación y comunicarlo al Jefe de Emergencia' },
          { id: 'd', texto: 'Colocar una señal y volver después' },
        ],
        respuestaCorrecta: 'c',
        explicacion: 'Ante una puerta cerrada, debes tocar y gritar el aviso de evacuación. Si no responde nadie, comunicar al Jefe de Emergencia la existencia de una zona no verificada para que decida si enviar al equipo de intervención.',
      },
    ],
  },
  responsable_recuento: {
    titulo: 'Quiz: Responsable de Recuento',
    descripcion: 'Valida tus conocimientos como Responsable de Recuento.',
    preguntas: [
      {
        id: 'rr-q1',
        pregunta: '¿Qué información debes tener preparada antes de un simulacro o emergencia real?',
        opciones: [
          { id: 'a', texto: 'El teléfono personal de todos los trabajadores' },
          { id: 'b', texto: 'El listado actualizado de personal por departamento y turno' },
          { id: 'c', texto: 'El plano del edificio con todas las salidas' },
          { id: 'd', texto: 'Los números de los servicios de emergencias' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'El Responsable de Recuento debe tener siempre actualizado el listado de personal por departamento y turno. Sin esta información, el recuento en el Punto de Reunión no puede realizarse correctamente.',
      },
      {
        id: 'rr-q2',
        pregunta: '¿Qué debes comunicar al Jefe de Emergencia si tras el recuento falta una persona?',
        opciones: [
          { id: 'a', texto: 'Únicamente el número de personas que faltan' },
          { id: 'b', texto: 'Nombre de la persona, departamento y última ubicación conocida' },
          { id: 'c', texto: 'Esperar 5 minutos por si llega tarde antes de informar' },
          { id: 'd', texto: 'Comunicarlo directamente a los bomberos' },
        ],
        respuestaCorrecta: 'b',
        explicacion: 'Debes comunicar al Jefe de Emergencia el nombre completo de la persona que falta, su departamento y la última ubicación conocida. Esta información es crítica para organizar una posible búsqueda.',
      },
      {
        id: 'rr-q3',
        pregunta: '¿Cuándo se puede dar por finalizado el recuento y permitir que el personal abandone el Punto de Reunión?',
        opciones: [
          { id: 'a', texto: 'Cuando hayan pasado 30 minutos desde la evacuación' },
          { id: 'b', texto: 'Cuando el Responsable de Recuento lo considere oportuno' },
          { id: 'c', texto: 'Solo cuando el Jefe de Emergencia declare el fin de la emergencia' },
          { id: 'd', texto: 'Cuando todos los departamentos hayan confirmado su recuento' },
        ],
        respuestaCorrecta: 'c',
        explicacion: 'Nadie puede abandonar el Punto de Reunión hasta que el Jefe de Emergencia declare oficialmente el fin de la emergencia. El Responsable de Recuento debe mantener el control del Punto de Reunión hasta ese momento.',
      },
    ],
  },
};

// Quiz de Validación
export const quizValidacion = {
  titulo: 'Quiz de Validación',
  descripcion: 'Responde correctamente las 3 preguntas para completar la formación.',
  preguntas: [
    {
      id: 'q1',
      pregunta: '¿Dónde está ubicado el Punto de Reunión?',
      opciones: [
        { id: 'a', texto: 'En la cafetería del edificio' },
        { id: 'b', texto: 'En el parking exterior, zona marcada con señal verde' },
        { id: 'c', texto: 'En la recepción principal' },
        { id: 'd', texto: 'En el sótano del edificio' },
      ],
      respuestaCorrecta: 'b',
      explicacion: 'El Punto de Reunión está en el parking exterior, en la zona marcada con la señal verde "PUNTO DE REUNIÓN".',
    },
    {
      id: 'q2',
      pregunta: '¿A qué número debes llamar en caso de emergencia?',
      opciones: [
        { id: 'a', texto: '091 - Policía Nacional' },
        { id: 'b', texto: '092 - Policía Local' },
        { id: 'c', texto: '112 - Emergencias' },
        { id: 'd', texto: '080 - Bomberos' },
      ],
      respuestaCorrecta: 'c',
      explicacion: 'El 112 es el número único de emergencias que coordina todos los servicios de auxilio.',
    },
    {
      id: 'q3',
      pregunta: '¿Puedo usar el ascensor durante una evacuación?',
      opciones: [
        { id: 'a', texto: 'Sí, es más rápido' },
        { id: 'b', texto: 'Solo si el fuego está lejos' },
        { id: 'c', texto: 'No, nunca debo usar el ascensor en una evacuación' },
        { id: 'd', texto: 'Solo si tengo movilidad reducida' },
      ],
      respuestaCorrecta: 'c',
      explicacion: 'NUNCA se deben usar los ascensores durante una evacuación. Pueden quedarse bloqueados o llenarse de humo.',
    },
  ],
};

// Información del documento legal
export const documentoLegal = {
  version: 'v3.2',
  fechaActualizacion: '2024-03-15',
  titulo: 'Información sobre el Plan de Autoprotección',
  subtitulo: 'Formación obligatoria en emergencias y evacuación',
  clausulaAceptacion: `He leído, comprendido y acepto la información contenida en este documento sobre el Plan de Autoprotección (PAU) del centro de trabajo. Me comprometo a seguir las instrucciones de actuación ante emergencias y a participar en los simulacros de evacuación programados. Entiendo que esta formación es obligatoria según la Ley 31/1995 de Prevención de Riesgos Laborales y el RD 393/2007 de Norma Básica de Autoprotección.`,
  avisoLegal: `Este documento forma parte del Plan de Autoprotección registrado en la plataforma oficial de la Comunidad Autónoma correspondiente. La información contenida es confidencial y su aceptación queda registrada de forma segura con hash SHA-256 para cumplimiento del RGPD.`,
};

// Configuración de emails
export const emailConfig = {
  asunto: 'Formación obligatoria: Plan de Autoprotección',
  remitente: 'Halo Training <training@halo.example>',
  saludo: 'Estimado/a',
  cuerpo: `
Como parte de nuestro compromiso con la seguridad laboral, es necesario que completes la formación obligatoria sobre el Plan de Autoprotección (PAU) de tu centro de trabajo.

Esta formación incluye:
• Instrucciones de actuación ante emergencias (incendio, emergencia médica, amenaza)
• Plan de evacuación y confinamiento
• Identificación de riesgos del centro
• Formación en vídeo interactiva
• Quiz de validación

Tienes 24 horas para completar esta formación. Una vez finalizada, recibirás un certificado de cumplimiento.
  `,
  despedida: 'Atentamente,\nDepartamento de Prevención de Riesgos Laborales\nVitaly Seguridad',
  expiracion: '24 horas',
};


