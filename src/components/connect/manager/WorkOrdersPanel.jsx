import React, { useState } from 'react';
import { ClipboardList, Calendar, User, CheckCircle2, Clock, XCircle, Link as LinkIcon, X } from 'lucide-react';
import { workOrderStatus } from '../../../data/connectMockData';

export default function WorkOrdersPanel({ workOrders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case workOrderStatus.COMPLETADA:
        return <CheckCircle2 size={16} className="text-green-600" />;
      case workOrderStatus.EN_CURSO:
        return <Clock size={16} className="text-amber-600" />;
      case workOrderStatus.PENDIENTE:
        return <Clock size={16} className="text-blue-600" />;
      case workOrderStatus.CANCELADA:
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case workOrderStatus.COMPLETADA:
        return 'Completada';
      case workOrderStatus.EN_CURSO:
        return 'En Curso';
      case workOrderStatus.PENDIENTE:
        return 'Pendiente';
      case workOrderStatus.CANCELADA:
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case workOrderStatus.COMPLETADA:
        return 'bg-green-50 border-green-200 text-green-700';
      case workOrderStatus.EN_CURSO:
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case workOrderStatus.PENDIENTE:
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case workOrderStatus.CANCELADA:
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-vitaly-azul">Órdenes de Trabajo</h3>
        <button className="px-4 py-2 bg-vitaly-azul hover:bg-vitaly-azul-hover text-white font-semibold rounded-lg transition-colors">
          Nueva Orden
        </button>
      </div>

      <div className="space-y-3">
        {workOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-vitaly-amarillo/10 flex items-center justify-center">
                  <ClipboardList size={20} className="text-vitaly-azul" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{order.numero}</div>
                  <div className="text-sm text-gray-500">{order.id}</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg border text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.estado)}`}>
                {getStatusIcon(order.estado)}
                {getStatusLabel(order.estado)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Fecha</div>
                <div className="text-gray-900 flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" />
                  {order.fechaCreacion}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Técnico</div>
                <div className="text-gray-900 flex items-center gap-1">
                  <User size={14} className="text-gray-400" />
                  {order.tecnico || 'Sin asignar'}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Progreso</div>
                <div className="text-gray-900">
                  {order.activosCompletados.length} / {order.activos.length} activos
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-vitaly-amarillo h-2 rounded-full transition-all"
                    style={{ width: `${(order.activosCompletados.length / order.activos.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {order.magicLink && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <LinkIcon size={14} />
                  <span>Magic Link: {order.magicLink}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-vitaly-azul">{selectedOrder.numero}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Estado</div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${getStatusColor(selectedOrder.estado)}`}>
                    {getStatusIcon(selectedOrder.estado)}
                    {getStatusLabel(selectedOrder.estado)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Técnico</div>
                  <div className="text-gray-900">{selectedOrder.tecnico || 'Sin asignar'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Fecha Creación</div>
                  <div className="text-gray-900">{selectedOrder.fechaCreacion}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Activos</div>
                  <div className="text-gray-900">{selectedOrder.activos.length}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-2">Activos Completados</div>
                <div className="space-y-1">
                  {selectedOrder.activosCompletados.map(assetId => (
                    <div key={assetId} className="text-green-600 text-sm font-medium">✓ {assetId}</div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-2">Activos Pendientes</div>
                <div className="space-y-1">
                  {selectedOrder.activosPendientes.map(assetId => (
                    <div key={assetId} className="text-amber-600 text-sm">○ {assetId}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
