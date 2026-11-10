import React, { useState } from 'react';
import { Package, ClipboardList, AlertTriangle, FileText } from 'lucide-react';
import InventoryPanel from './InventoryPanel';
import WorkOrdersPanel from './WorkOrdersPanel';
import IncidentsPanel from './IncidentsPanel';
import DocumentsPanel from './DocumentsPanel';

export default function ManagerDashboard({ inventory, workOrders, incidents, syncStatus, onInventoryUpdate }) {
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'workorders', label: 'Órdenes', icon: ClipboardList },
    { id: 'incidents', label: 'Incidencias', icon: AlertTriangle },
    { id: 'documents', label: 'Documentos', icon: FileText },
  ];

  const stats = {
    totalAssets: inventory.length,
    okAssets: inventory.filter(a => a.estado === 'ok').length,
    pendingAssets: inventory.filter(a => a.estado === 'pendiente_revision').length,
    incidentAssets: inventory.filter(a => a.estado === 'baja_temporal' || a.estado === 'incidencia').length,
    activeWorkOrders: workOrders.filter(wo => wo.estado === 'en_curso' || wo.estado === 'pendiente').length,
    activeIncidents: incidents.filter(i => !i.resuelto).length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header con stats */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-bold text-vitaly-azul mb-4">
          Dashboard de Gestión
        </h2>
        
        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Total Activos</div>
            <div className="text-2xl font-bold text-vitaly-azul">{stats.totalAssets}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-card">
            <div className="text-xs text-gray-600 mb-1">OK</div>
            <div className="text-2xl font-bold text-vitaly-azul">{stats.okAssets}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-card">
            <div className="text-xs text-gray-600 mb-1">Pendientes</div>
            <div className="text-2xl font-bold text-vitaly-azul">{stats.pendingAssets}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-card">
            <div className="text-xs text-gray-600 mb-1">Incidencias</div>
            <div className="text-2xl font-bold text-vitaly-azul">{stats.incidentAssets}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6 bg-white">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-vitaly-amarillo text-vitaly-azul bg-vitaly-amarillo/5'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeTab === 'inventory' && (
          <InventoryPanel inventory={inventory} onInventoryUpdate={onInventoryUpdate} />
        )}
        {activeTab === 'workorders' && (
          <WorkOrdersPanel workOrders={workOrders} />
        )}
        {activeTab === 'incidents' && (
          <IncidentsPanel incidents={incidents} inventory={inventory} />
        )}
        {activeTab === 'documents' && (
          <DocumentsPanel inventory={inventory} workOrders={workOrders} />
        )}
      </div>
    </div>
  );
}
