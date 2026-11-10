import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, QrCode, MapPin, TrendingUp } from 'lucide-react';
import ManagerDashboard from './manager/ManagerDashboard';
import TechnicianMobile from './field/TechnicianMobile';
import { inventory, assetStatus, workOrders, incidents } from '../../data/connectMockData';

export default function ConnectModule() {
  const [syncStatus, setSyncStatus] = useState('connected'); // 'connected' | 'syncing' | 'offline'
  const [currentInventory, setCurrentInventory] = useState(inventory);
  const [currentWorkOrders, setCurrentWorkOrders] = useState(workOrders);
  const [currentIncidents, setCurrentIncidents] = useState(incidents);
  const [activeWorkOrder, setActiveWorkOrder] = useState(workOrders[0]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [technicianActions, setTechnicianActions] = useState({
    scanned: false,
    certified: false,
    incidentDetected: false,
  });

  // Calcular KPIs
  const totalActivos = currentInventory.length;
  const activosOk = currentInventory.filter(a => a.estado === assetStatus.OK).length;
  const activosPendientes = currentInventory.filter(a => a.estado === assetStatus.PENDIENTE_REVISION).length;
  const tasaCumplimiento = Math.round((activosOk / totalActivos) * 100);

  // Sincronización en tiempo real cuando el técnico certifica
  useEffect(() => {
    if (technicianActions.certified && selectedAsset) {
      setSyncStatus('syncing');
      
      // Simular sincronización
      setTimeout(() => {
        // Actualizar estado del activo en inventario
        setCurrentInventory(prev => 
          prev.map(asset => 
            asset.id === selectedAsset.id 
              ? { ...asset, estado: assetStatus.OK, ultimaRevision: new Date().toISOString().split('T')[0] }
              : asset
          )
        );
        
        // Actualizar orden de trabajo
        setCurrentWorkOrders(prev =>
          prev.map(wo => {
            if (wo.id === activeWorkOrder.id) {
              const newCompleted = [...wo.activosCompletados, selectedAsset.id];
              const newPending = wo.activosPendientes.filter(id => id !== selectedAsset.id);
              return {
                ...wo,
                activosCompletados: newCompleted,
                activosPendientes: newPending,
                estado: newPending.length === 0 ? 'completada' : wo.estado,
              };
            }
            return wo;
          })
        );
        
        setSyncStatus('connected');
        setSelectedAsset(null);
        setTechnicianActions({ scanned: false, certified: false, incidentDetected: false });
      }, 1500);
    }
  }, [technicianActions.certified, selectedAsset, activeWorkOrder]);


  const handleTechnicianAction = (action, asset = null) => {
    if (asset) {
      setSelectedAsset(asset);
    }
    setTechnicianActions(prev => ({
      ...prev,
      [action]: true,
    }));
    
    // Si es incidente, actualizar inmediatamente
    if (action === 'incidentDetected') {
      setSyncStatus('syncing');
      setTimeout(() => {
        const newIncident = {
          id: `INC-${Date.now()}`,
          activoId: asset.id,
          activoNombre: asset.nombre,
          tipo: 'correctivo',
          severidad: 'alta',
          estado: 'pendiente_presupuesto',
          fechaCreacion: new Date().toISOString().split('T')[0],
          descripcion: 'No conformidad detectada durante revisión',
          checklistItem: 'manguera',
          tecnico: 'Técnico Campo',
          presupuesto: null,
          aprobado: false,
          enReparacion: false,
          resuelto: false,
        };
        
        setCurrentIncidents(prev => [newIncident, ...prev]);
        setCurrentInventory(prev =>
          prev.map(a =>
            a.id === asset.id
              ? { ...a, estado: 'baja_temporal', incidencia: newIncident.id }
              : a
          )
        );
        setSyncStatus('connected');
      }, 1000);
    }
  };

  const handleReset = () => {
    setCurrentInventory(inventory);
    setCurrentWorkOrders(workOrders);
    setCurrentIncidents(incidents);
    setSelectedAsset(null);
    setTechnicianActions({ scanned: false, certified: false, incidentDetected: false });
    setSyncStatus('connected');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vitaly-azul flex items-center gap-3">
            <QrCode size={28} className="text-vitaly-azul" />
            Halo Connect
          </h1>
          <p className="text-gray-500 mt-1">Mantenimiento de activos (QR, RIPCI) y exportación a registros</p>
        </div>

        {/* KPIs rápidos */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-card">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-vitaly-azul-10 flex items-center justify-center">
                <QrCode size={20} className="text-vitaly-azul" />
              </div>
              <div>
                <div className="text-2xl font-bold text-vitaly-azul">{totalActivos}</div>
                <div className="text-xs text-gray-500">Activos</div>
              </div>
            </div>
            
            <div className="h-10 w-px bg-gray-200" />
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-vitaly-azul-10 flex items-center justify-center">
                <MapPin size={20} className="text-vitaly-azul" />
              </div>
              <div>
                <div className="text-2xl font-bold text-vitaly-azul">{activosOk}</div>
                <div className="text-xs text-gray-500">Revisados</div>
              </div>
            </div>
            
            <div className="h-10 w-px bg-gray-200" />
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-vitaly-azul-10 flex items-center justify-center">
                <TrendingUp size={20} className="text-halo-cyan" />
              </div>
              <div>
                <div className="text-2xl font-bold text-vitaly-azul">{tasaCumplimiento}%</div>
                <div className="text-xs text-gray-500">Cumplimiento</div>
              </div>
            </div>
          </div>

          {/* Estado de sincronización */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
            syncStatus === 'connected'
              ? 'bg-green-50 border-green-200 text-green-700'
              : syncStatus === 'syncing'
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {syncStatus === 'connected' ? (
              <>
                <Wifi size={18} />
                <span className="text-sm font-semibold">Sincronizado</span>
              </>
            ) : syncStatus === 'syncing' ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span className="text-sm font-semibold">Sincronizando...</span>
              </>
            ) : (
              <>
                <WifiOff size={18} />
                <span className="text-sm font-semibold">Offline</span>
              </>
            )}
          </div>

          {/* Botón reset para demo */}
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {/* Layout de dos columnas: 70% Gestor / 30% Móvil */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-[calc(100vh-220px)]">
        {/* Columna Izquierda: Gestor (70%) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden flex flex-col">
          <ManagerDashboard 
            inventory={currentInventory}
            workOrders={currentWorkOrders}
            incidents={currentIncidents}
            syncStatus={syncStatus}
            onInventoryUpdate={setCurrentInventory}
          />
        </div>

        {/* Columna Derecha: Técnico (30%) - Mantiene estilo oscuro para simular móvil */}
        <div className="lg:col-span-3 bg-gray-100 rounded-xl border border-gray-200 p-2 flex items-center justify-center overflow-hidden">
          <TechnicianMobile 
            workOrder={activeWorkOrder}
            onAction={handleTechnicianAction}
            actions={technicianActions}
            selectedAsset={selectedAsset}
          />
        </div>
      </div>
    </div>
  );
}
