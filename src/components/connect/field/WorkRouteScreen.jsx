import React from 'react';
import { ArrowLeft, QrCode, MapPin, Navigation } from 'lucide-react';
import { calculateOptimalRoute, inventory } from '../../../data/connectMockData';

export default function WorkRouteScreen({ workOrder, onScanAsset, onBack }) {
  // Obtener activos pendientes y ordenarlos por proximidad
  const pendingAssetIds = workOrder?.activosPendientes || [];
  const pendingAssets = inventory.filter(asset => pendingAssetIds.includes(asset.id));
  const optimizedRoute = calculateOptimalRoute(pendingAssets);

  const calculateDistance = (asset1, asset2) => {
    const dx = asset1.coordenadas.x - asset2.coordenadas.x;
    const dy = asset1.coordenadas.y - asset2.coordenadas.y;
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={onBack}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200"
        >
          <ArrowLeft size={16} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-base font-bold text-vitaly-azul">Ruta de Trabajo</h2>
          <p className="text-[10px] text-gray-500">Ordenada por proximidad</p>
        </div>
      </div>

      {/* Lista de activos optimizada */}
      <div className="space-y-2">
        {optimizedRoute.slice(0, 4).map((asset, index) => {
          const nextAsset = optimizedRoute[index + 1];
          const distance = nextAsset ? calculateDistance(asset, nextAsset) : null;
          
          return (
            <div
              key={asset.id}
              className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-vitaly-amarillo/10 flex items-center justify-center">
                    <span className="text-vitaly-amarillo font-bold text-xs">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-xs">{asset.nombre}</div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-0.5">
                      <MapPin size={8} />
                      {asset.ubicacion}
                    </div>
                  </div>
                </div>
                {distance && (
                  <div className="text-[9px] text-gray-400 flex items-center gap-0.5">
                    <Navigation size={8} />
                    {distance}m
                  </div>
                )}
              </div>

              <button
                onClick={() => onScanAsset(asset)}
                className="w-full py-1.5 px-3 bg-vitaly-azul hover:bg-vitaly-azul-hover text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
              >
                <QrCode size={14} />
                Escanear QR
              </button>
            </div>
          );
        })}
      </div>

      {optimizedRoute.length > 4 && (
        <div className="text-center text-xs text-gray-500">
          +{optimizedRoute.length - 4} activos más
        </div>
      )}

      {/* Indicador offline (simulado) */}
      <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-1.5 text-[10px] text-blue-600">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Modo offline disponible
        </div>
      </div>
    </div>
  );
}
