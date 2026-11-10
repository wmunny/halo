// Cámaras de la demo de Halo Vision (vídeos locales, sin análisis ni llamadas externas)
const v = (archivo) => `${import.meta.env.BASE_URL}videos/${archivo}`;

export const camaras = [
  {
    id: 'cam1',
    nombre: 'CAM-01 Almacén Motores',
    ubicacion: 'Almacén de Motores - Zona A',
    videoSrc: v('cam1_produccion.mp4'),
    estado: 'online',
    resolucion: '1920x1080',
    fps: 25,
  },
  {
    id: 'cam2',
    nombre: 'CAM-02 Almacén Recambios',
    ubicacion: 'Almacén de Recambios - Zona B',
    videoSrc: v('cam2_almacen.mp4'),
    estado: 'online',
    resolucion: '1920x1080',
    fps: 25,
  },
  {
    id: 'cam3',
    nombre: 'CAM-03 Almacén Electrónica',
    ubicacion: 'Almacén de Electrónica - Zona C',
    videoSrc: v('cam3_exterior.mp4'),
    estado: 'online',
    resolucion: '1920x1080',
    fps: 25,
  },
  {
    id: 'cam4',
    nombre: 'CAM-04 Planta Robots Soldadura',
    ubicacion: 'Planta de Producción - Robots de Soldadura',
    videoSrc: v('cam4_oficinas.mp4'),
    estado: 'online',
    resolucion: '1920x1080',
    fps: 25,
  },
];
