import React, { useState } from 'react';
import { Search, MapPin, AlertCircle, CheckCircle2, Clock, XCircle, QrCode, Map, X } from 'lucide-react';
import { assetTypes, assetStatus } from '../../../data/connectMockData';
import SmartTagGenerator from './SmartTagGenerator';
import GeoMapView from './GeoMapView';

export default function InventoryPanel({ inventory, onInventoryUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showTagGenerator, setShowTagGenerator] = useState(false);
  const [assetForTag, setAssetForTag] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  const getStatusIcon = (status) => {
    switch (status) {
      case assetStatus.OK:
        return <CheckCircle2 size={16} className="text-green-600" />;
      case assetStatus.PENDIENTE_REVISION:
        return <Clock size={16} className="text-amber-600" />;
      case assetStatus.BAJA_TEMPORAL:
      case assetStatus.INCIDENCIA:
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case assetStatus.OK:
        return 'OK';
      case assetStatus.PENDIENTE_REVISION:
        return 'Pendiente';
      case assetStatus.BAJA_TEMPORAL:
        return 'Baja Temporal';
      case assetStatus.INCIDENCIA:
        return 'Incidencia';
      default:
        return status;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case assetTypes.EXTINTOR:
        return 'Extintor';
      case assetTypes.BIE:
        return 'BIE';
      case assetTypes.PUERTA_RF:
        return 'Puerta RF';
      case assetTypes.DETECTOR:
        return 'Detector';
      case assetTypes.CENTRALITA:
        return 'Centralita';
      default:
        return type;
    }
  };

  const filteredInventory = inventory.filter(asset => {
    const matchesSearch = asset.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || asset.tipo === filterType;
    const matchesStatus = filterStatus === 'all' || asset.estado === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleGenerateTag = (asset) => {
    setAssetForTag(asset);
    setShowTagGenerator(true);
  };

  const handleTagAssigned = (assetId, uuid, url) => {
    if (onInventoryUpdate) {
      onInventoryUpdate(prev => 
        prev.map(asset => 
          asset.id === assetId
            ? { ...asset, qrCode: uuid, smartTagUrl: url }
            : asset
        )
      );
    }
    setShowTagGenerator(false);
    setAssetForTag(null);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Filtros, búsqueda y vista */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, ID o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vitaly-amarillo/50 focus:border-vitaly-amarillo"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-vitaly-amarillo/50 focus:border-vitaly-amarillo"
        >
          <option value="all">Todos los tipos</option>
          <option value={assetTypes.EXTINTOR}>Extintores</option>
          <option value={assetTypes.BIE}>BIE</option>
          <option value={assetTypes.PUERTA_RF}>Puertas RF</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-vitaly-amarillo/50 focus:border-vitaly-amarillo"
        >
          <option value="all">Todos los estados</option>
          <option value={assetStatus.OK}>OK</option>
          <option value={assetStatus.PENDIENTE_REVISION}>Pendiente</option>
          <option value={assetStatus.BAJA_TEMPORAL}>Baja Temporal</option>
          <option value={assetStatus.INCIDENCIA}>Incidencia</option>
        </select>
        
        {/* Toggle vista */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
              viewMode === 'list'
                ? 'bg-vitaly-azul text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors flex items-center gap-1 ${
              viewMode === 'map'
                ? 'bg-vitaly-azul text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Map size={14} />
            Mapa
          </button>
        </div>
      </div>

      {/* Vista según modo */}
      {viewMode === 'map' ? (
        <div className="flex-1 min-h-0">
          <GeoMapView inventory={filteredInventory} onAssetClick={setSelectedAsset} />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Tabla de activos */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ubicación</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Coordenadas</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Última Revisión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInventory.map((asset) => (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-mono text-vitaly-azul font-semibold">{asset.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{getTypeLabel(asset.tipo)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{asset.nombre}</span>
                          {!asset.qrCode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateTag(asset);
                              }}
                              className="p-1 bg-vitaly-amarillo/10 hover:bg-vitaly-amarillo/20 rounded text-amber-600 transition-colors"
                              title="Generar Smart Tag"
                            >
                              <QrCode size={14} />
                            </button>
                          )}
                          {asset.qrCode && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium" title="Smart Tag asignada">
                              ✓ QR
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {asset.ubicacion}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                        ({asset.coordenadas.x}, {asset.coordenadas.y})
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(asset.estado)}
                          <span className={`text-sm font-medium ${
                            asset.estado === assetStatus.OK ? 'text-green-700' :
                            asset.estado === assetStatus.PENDIENTE_REVISION ? 'text-amber-700' :
                            'text-red-700'
                          }`}>
                            {getStatusLabel(asset.estado)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{asset.ultimaRevision || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel de detalles del activo seleccionado */}
          {selectedAsset && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAsset(null)}>
              <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-vitaly-azul">{selectedAsset.nombre}</h3>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">ID</div>
                      <div className="text-gray-900 font-mono font-semibold">{selectedAsset.id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Tipo</div>
                      <div className="text-gray-900">{getTypeLabel(selectedAsset.tipo)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Ubicación</div>
                      <div className="text-gray-900">{selectedAsset.ubicacion}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Sector</div>
                      <div className="text-gray-900">{selectedAsset.sector}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Coordenadas</div>
                      <div className="text-gray-900 font-mono">X: {selectedAsset.coordenadas.x}, Y: {selectedAsset.coordenadas.y}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Estado</div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedAsset.estado)}
                        <span className="text-gray-900">{getStatusLabel(selectedAsset.estado)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Datos RIPCI */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-vitaly-azul mb-3">Datos RIPCI</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedAsset.ripci).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-sm text-gray-500 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          <div className="text-gray-900">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      
          {/* Generador de Smart Tag */}
          {showTagGenerator && assetForTag && (
            <SmartTagGenerator
              asset={assetForTag}
              onClose={() => {
                setShowTagGenerator(false);
                setAssetForTag(null);
              }}
              onTagAssigned={handleTagAssigned}
            />
          )}
        </div>
      )}
    </div>
  );
}
