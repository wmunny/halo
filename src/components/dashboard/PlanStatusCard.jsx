import React from 'react';
import { FileText, Calendar, Clock, AlertTriangle, ExternalLink } from 'lucide-react';

export default function PlanStatusCard({ plan }) {
  const getEstadoConfig = (estado) => {
    switch (estado) {
      case 'vigente':
        return {
          label: 'Vigente',
          color: 'bg-halo-emerald/10 text-halo-emerald border-halo-emerald/30',
          borderColor: 'border-halo-emerald',
        };
      case 'proximo_vencer':
        return {
          label: 'Próximo a caducar',
          color: 'bg-vitaly-amarillo/10 text-amber-600 border-vitaly-amarillo/30',
          borderColor: 'border-vitaly-amarillo',
        };
      case 'caducado':
        return {
          label: 'Expirado',
          color: 'bg-vitaly-danger/10 text-vitaly-danger border-vitaly-danger/30',
          borderColor: 'border-vitaly-danger',
        };
      default:
        return {
          label: 'Sin estado',
          color: 'bg-gray-100 text-gray-500 border-gray-200',
          borderColor: 'border-gray-300',
        };
    }
  };

  const estadoConfig = getEstadoConfig(plan.estado);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysUntil = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntil(plan.fechaValidez);
  const isExpiringSoon = daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry <= 0;

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-card`}>
      {/* Header */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-vitaly-azul-10 flex items-center justify-center">
              <FileText size={24} className="text-halo-cyan" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-vitaly-azul">Plan de Autoprotección</h3>
              <p className="text-sm text-gray-500">Edición {plan.edicion}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${estadoConfig.color}`}>
            {(isExpiringSoon || isExpired) && <AlertTriangle size={16} />}
            <span className="text-sm font-semibold">{estadoConfig.label}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          {/* Válido hasta */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar size={14} />
              <span className="text-sm">Válido hasta</span>
            </div>
            <p className="text-xl font-bold text-gray-800">{formatDate(plan.fechaValidez)}</p>
            {isExpired && (
              <span className="text-sm font-semibold text-vitaly-danger">Expirado</span>
            )}
            {isExpiringSoon && !isExpired && (
              <span className="text-sm font-semibold text-vitaly-azul">
                Caduca en {daysUntilExpiry} días
              </span>
            )}
          </div>

          {/* Próxima actualización */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock size={14} />
              <span className="text-sm">Próxima actualización</span>
            </div>
            <p className="text-xl font-bold text-gray-800">{formatDate(plan.proximaRevision)}</p>
            <span className="text-sm text-gray-500">
              Última revisión: {formatDate(plan.ultimaRevision || plan.fechaAprobacion)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer con botones */}
      <div className="flex border-t border-gray-100">
        <button className="flex-1 py-4 bg-vitaly-azul hover:bg-vitaly-azul-hover text-white font-semibold text-sm transition-all flex items-center justify-center gap-2">
          Ver Plan Completo
        </button>
        <button className="px-6 py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-colors border-l border-gray-100">
          Historial
        </button>
      </div>
    </div>
  );
}
