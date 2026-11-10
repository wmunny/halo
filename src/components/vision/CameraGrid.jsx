import React, { useState } from 'react';
import CameraFeed from './CameraFeed';
import { Grid2X2, Minimize } from 'lucide-react';

export default function CameraGrid({ camaras }) {
  const [expandida, setExpandida] = useState(null);

  const alternar = (id) => setExpandida((actual) => (actual === id ? null : id));
  const visibles = expandida ? camaras.filter((c) => c.id === expandida) : camaras;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandida(null)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              !expandida ? 'bg-vitaly-azul text-white' : 'bg-bg-tertiary text-gray-600 hover:text-vitaly-azul'
            }`}
          >
            <Grid2X2 size={16} />
            Mosaico 2x2
          </button>
          {expandida && (
            <button
              onClick={() => setExpandida(null)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-bg-tertiary text-gray-600 hover:text-vitaly-azul transition-colors"
            >
              <Minimize size={16} />
              Volver al mosaico
            </button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {camaras.filter((c) => c.estado === 'online').length} de {camaras.length} cámaras online
        </div>
      </div>

      <div
        className={`grid gap-4 ${expandida ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}
        style={{ height: expandida ? 'calc(100vh - 280px)' : 'auto' }}
      >
        {visibles.map((camara) => (
          <div key={camara.id} className={expandida ? 'h-full' : 'aspect-video'}>
            <CameraFeed camara={camara} onExpand={alternar} isExpanded={expandida === camara.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
