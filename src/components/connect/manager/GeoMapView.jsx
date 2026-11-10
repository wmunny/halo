import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { assetTypes, assetStatus } from '../../../data/connectMockData';

export default function GeoMapView({ inventory, onAssetClick }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Calcular dimensiones del plano (nave rectangular de almacén)
  const maxX = Math.max(...inventory.map(a => a.coordenadas.x), 0);
  const maxY = Math.max(...inventory.map(a => a.coordenadas.y), 0);
  const minX = Math.min(...inventory.map(a => a.coordenadas.x), 0);
  const minY = Math.min(...inventory.map(a => a.coordenadas.y), 0);
  
  // Dimensiones típicas de nave de almacén: 100m x 60m
  const width = Math.max(maxX - minX, 100) + 20; // Margen adicional
  const height = Math.max(maxY - minY, 60) + 20;

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const getAssetColor = (asset) => {
    switch (asset.estado) {
      case assetStatus.OK:
        return 'bg-green-500';
      case assetStatus.PENDIENTE_REVISION:
        return 'bg-amber-500';
      case assetStatus.BAJA_TEMPORAL:
      case assetStatus.INCIDENCIA:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAssetIcon = (asset) => {
    switch (asset.tipo) {
      case assetTypes.EXTINTOR:
        return '🔥';
      case assetTypes.BIE:
        return '🚰';
      case assetTypes.PUERTA_RF:
        return '🚪';
      default:
        return '📍';
    }
  };

  // Normalizar coordenadas al viewport
  const normalizeX = (x) => ((x - minX) / width) * 100;
  const normalizeY = (y) => ((y - minY) / height) * 100;

  return (
    <div className="relative bg-gray-100 rounded-lg border border-gray-200 h-full overflow-hidden">
      {/* Controles de zoom */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white/95 rounded-lg p-2 border border-gray-200 shadow-lg">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
          className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-gray-700 transition-colors border border-gray-200"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
          className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-gray-700 transition-colors border border-gray-200"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-gray-700 transition-colors border border-gray-200"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Leyenda */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 rounded-lg p-3 border border-gray-200 shadow-lg">
        <div className="text-xs font-semibold text-gray-700 mb-2">Estados</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">OK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Incidencia</span>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div
        className="w-full h-full relative cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Grid de fondo con estructura de nave */}
        <svg className="absolute inset-0 w-full h-full" style={{ minWidth: `${width}px`, minHeight: `${height}px` }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          {/* Fondo de nave */}
          <rect width="100%" height="100%" fill="rgba(249, 250, 251, 1)" />
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Pasillos principales (cada 20m) */}
          {Array.from({ length: Math.ceil(width / 20) + 1 }, (_, i) => (
            <line
              key={`pasillo-v-${i}`}
              x1={i * 20}
              y1="0"
              x2={i * 20}
              y2="100%"
              stroke="rgba(245, 158, 11, 0.2)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          ))}
          {Array.from({ length: Math.ceil(height / 20) + 1 }, (_, i) => (
            <line
              key={`pasillo-h-${i}`}
              x1="0"
              y1={i * 20}
              x2="100%"
              y2={i * 20}
              stroke="rgba(245, 158, 11, 0.2)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          ))}
        </svg>

        {/* Activos */}
        {inventory.map((asset) => {
          const x = normalizeX(asset.coordenadas.x);
          const y = normalizeY(asset.coordenadas.y);
          
          return (
            <div
              key={asset.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => {
                setSelectedAsset(asset);
                if (onAssetClick) onAssetClick(asset);
              }}
            >
              <div className={`${getAssetColor(asset)} rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-bold shadow-lg hover:scale-125 transition-transform border-2 border-white`}>
                {getAssetIcon(asset)}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-lg">
                  <div className="font-semibold">{asset.nombre}</div>
                  <div className="text-gray-300">{asset.ubicacion}</div>
                  <div className="text-gray-400 text-[10px]">({asset.coordenadas.x}, {asset.coordenadas.y})</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Líneas de conexión (opcional, para mostrar rutas) */}
        {selectedAsset && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: `${width}px`, minHeight: `${height}px` }}>
            {inventory
              .filter(a => a.id !== selectedAsset.id && a.sector === selectedAsset.sector)
              .map(asset => {
                const x1 = normalizeX(selectedAsset.coordenadas.x);
                const y1 = normalizeY(selectedAsset.coordenadas.y);
                const x2 = normalizeX(asset.coordenadas.x);
                const y2 = normalizeY(asset.coordenadas.y);
                
                return (
                  <line
                    key={asset.id}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="rgba(245, 158, 11, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                );
              })}
          </svg>
        )}
      </div>

      {/* Info del activo seleccionado */}
      {selectedAsset && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 rounded-lg p-4 border border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-semibold text-gray-900">{selectedAsset.nombre}</div>
              <div className="text-sm text-gray-500">{selectedAsset.ubicacion} - {selectedAsset.sector}</div>
            </div>
            <button
              onClick={() => setSelectedAsset(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Coordenadas:</span>
              <span className="text-gray-900 ml-2 font-mono">
                ({selectedAsset.coordenadas.x}, {selectedAsset.coordenadas.y})
              </span>
            </div>
            <div>
              <span className="text-gray-500">Estado:</span>
              <span className={`ml-2 font-medium ${
                selectedAsset.estado === assetStatus.OK ? 'text-green-600' :
                selectedAsset.estado === assetStatus.PENDIENTE_REVISION ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {selectedAsset.estado}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
