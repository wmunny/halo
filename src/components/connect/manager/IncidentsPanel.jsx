import React, { useState } from 'react';
import { AlertTriangle, DollarSign, CheckCircle2, Clock, XCircle, TrendingDown, X } from 'lucide-react';
import { assetTypes } from '../../../data/connectMockData';

export default function IncidentsPanel({ incidents, inventory }) {
  const [selectedIncident, setSelectedIncident] = useState(null);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critica':
        return 'bg-red-100 border-red-300 text-red-700';
      case 'alta':
        return 'bg-orange-100 border-orange-300 text-orange-700';
      case 'media':
        return 'bg-amber-100 border-amber-300 text-amber-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getStatusIcon = (incident) => {
    if (incident.resuelto) return <CheckCircle2 size={16} className="text-green-600" />;
    if (incident.enReparacion) return <Clock size={16} className="text-blue-600" />;
    if (incident.aprobado) return <CheckCircle2 size={16} className="text-amber-600" />;
    return <Clock size={16} className="text-orange-600" />;
  };

  const getStatusLabel = (incident) => {
    if (incident.resuelto) return 'Resuelto';
    if (incident.enReparacion) return 'En Reparación';
    if (incident.aprobado) return 'Aprobado';
    return 'Pendiente Presupuesto';
  };

  // Calcular cobertura de extinción
  const calculateCoverage = () => {
    const totalAssets = inventory.filter(a => a.tipo === assetTypes.EXTINTOR || a.tipo === assetTypes.BIE).length;
    const activeAssets = inventory.filter(a => 
      (a.tipo === assetTypes.EXTINTOR || a.tipo === assetTypes.BIE) && 
      (a.estado === 'ok' || a.estado === 'pendiente_revision')
    ).length;
    return totalAssets > 0 ? Math.round((activeAssets / totalAssets) * 100) : 100;
  };

  const coverage = calculateCoverage();
  const isCoverageLow = coverage < 100;

  return (
    <div className="space-y-4">
      {/* Alerta de cobertura */}
      {isCoverageLow && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <TrendingDown size={24} className="text-red-600" />
          <div>
            <div className="font-semibold text-red-700">Atención: Cobertura de Extinción Inferior al 100%</div>
            <div className="text-sm text-red-600 mt-1">
              El sector tiene una cobertura de {coverage}%. Algunos activos están en baja temporal.
            </div>
            <div className="text-xs text-red-500 mt-2">
              Halo Logic ha sido notificado automáticamente.
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-vitaly-azul">Incidencias y Tickets Correctivos</h3>
        <div className="text-sm text-gray-500">
          {incidents.filter(i => !i.resuelto).length} activas
        </div>
      </div>

      <div className="space-y-3">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            onClick={() => setSelectedIncident(incident)}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{incident.id}</div>
                  <div className="text-sm text-gray-500">{incident.activoNombre}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded border text-xs font-semibold ${getSeverityColor(incident.severidad)}`}>
                  {incident.severidad.toUpperCase()}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  {getStatusIcon(incident)}
                  <span className="font-medium">{getStatusLabel(incident)}</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-700 mb-2">{incident.descripcion}</div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Fecha: {incident.fechaCreacion}</span>
              <span>Técnico: {incident.tecnico}</span>
              {incident.presupuesto && (
                <span className="flex items-center gap-1 font-medium text-gray-700">
                  <DollarSign size={12} />
                  {incident.presupuesto.toFixed(2)} €
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedIncident(null)}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-vitaly-azul">{selectedIncident.id}</h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Activo</div>
                  <div className="text-gray-900">{selectedIncident.activoNombre}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Severidad</div>
                  <div className={`inline-block px-3 py-1 rounded-lg border ${getSeverityColor(selectedIncident.severidad)}`}>
                    {selectedIncident.severidad.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Estado</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    {getStatusIcon(selectedIncident)}
                    {getStatusLabel(selectedIncident)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Fecha</div>
                  <div className="text-gray-900">{selectedIncident.fechaCreacion}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Descripción</div>
                <div className="text-gray-900">{selectedIncident.descripcion}</div>
              </div>

              {selectedIncident.presupuesto && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Presupuesto</div>
                  <div className="text-gray-900 text-lg font-semibold">{selectedIncident.presupuesto.toFixed(2)} €</div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 flex gap-3">
                {!selectedIncident.aprobado && (
                  <button className="px-4 py-2 bg-vitaly-azul hover:bg-vitaly-azul-hover text-white font-semibold rounded-lg transition-colors">
                    Aprobar Presupuesto
                  </button>
                )}
                {selectedIncident.aprobado && !selectedIncident.enReparacion && (
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                    Iniciar Reparación
                  </button>
                )}
                {selectedIncident.enReparacion && (
                  <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors">
                    Marcar como Resuelto
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
