import React from 'react';
import { Eye, Wifi, HardDrive, MonitorPlay } from 'lucide-react';
import CameraGrid from './CameraGrid';
import { camaras } from '../../data/visionMockData';

function Stat({ etiqueta, valor, Icono }) {
  return (
    <div className="bg-white rounded-xl shadow-card p-4 border border-halo-border-dark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{etiqueta}</p>
          <p className="text-2xl font-bold text-vitaly-azul">{valor}</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-vitaly-azul-10 flex items-center justify-center">
          <Icono size={24} className="text-vitaly-azul" />
        </div>
      </div>
    </div>
  );
}

export default function VisionModule() {
  const online = camaras.filter((c) => c.estado === 'online').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vitaly-azul flex items-center gap-3">
            <Eye size={28} className="text-vitaly-azul" />
            Halo Vision
          </h1>
          <p className="text-gray-500 mt-1">Visionado de las cámaras del centro</p>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-vitaly-amarillo/10 border border-vitaly-amarillo/30 text-amber-700">
          Maqueta · vídeos de demostración
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat etiqueta="Cámaras online" valor={`${online}/${camaras.length}`} Icono={Wifi} />
        <Stat etiqueta="Grabación" valor="Continua" Icono={HardDrive} />
        <Stat etiqueta="Calidad" valor="1080p · 25 fps" Icono={MonitorPlay} />
      </div>

      <div className="bg-white rounded-xl shadow-card p-4 border border-halo-border-dark">
        <CameraGrid camaras={camaras} />
      </div>
    </div>
  );
}
