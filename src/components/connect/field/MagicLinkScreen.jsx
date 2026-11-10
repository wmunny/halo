import React from 'react';
import { CheckCircle2, QrCode, ArrowRight } from 'lucide-react';

export default function MagicLinkScreen({ workOrder, onStartRoute }) {
  const pendingAssets = workOrder?.activosPendientes?.length || 0;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-vitaly-amarillo/10 flex items-center justify-center mx-auto">
          <CheckCircle2 size={28} className="text-vitaly-amarillo" />
        </div>
        <h2 className="text-lg font-bold text-vitaly-azul">Bienvenido, Técnico</h2>
        <p className="text-gray-500 text-xs px-2">
          Enlace seguro activo
        </p>
        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 font-semibold text-base">{pendingAssets} Activos</p>
          <p className="text-blue-600 text-xs">pendientes de revisión</p>
        </div>
      </div>

      <div className="w-full space-y-2">
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <div className="text-[10px] text-gray-500 mb-0.5">Orden de Trabajo</div>
          <div className="text-gray-900 font-semibold text-sm">{workOrder?.numero || 'WO-2024-001'}</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <div className="text-[10px] text-gray-500 mb-0.5">Progreso</div>
          <div className="text-gray-900 font-semibold text-sm">
            {workOrder?.activosCompletados?.length || 0} / {workOrder?.activos?.length || 0} completados
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
            <div
              className="bg-vitaly-amarillo h-1.5 rounded-full transition-all"
              style={{ 
                width: `${workOrder?.activos?.length > 0 
                  ? ((workOrder.activosCompletados?.length || 0) / workOrder.activos.length) * 100 
                  : 0}%` 
              }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={onStartRoute}
        className="w-full py-3 px-4 bg-vitaly-azul hover:bg-vitaly-azul-hover text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <QrCode size={18} />
        Iniciar Ruta
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
