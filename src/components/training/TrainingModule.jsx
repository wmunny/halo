/**
 * Halo Training Module
 * Sistema de onboarding PAU con Magic Links
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  ClipboardCheck, 
  Settings,
  BookOpen,
  Shield,
  TrendingUp,
} from 'lucide-react';
import WorkersManagement from './WorkersManagement';
import AuditDashboard from './AuditDashboard';
import PAUAcceptance from './worker/PAUAcceptance';
import { getEstadisticasCentro } from '../../data/trainingMockData';

export default function TrainingModule({ centroActual }) {
  const [activeTab, setActiveTab] = useState('workers'); // 'workers' | 'audit' | 'preview'
  const [previewToken, setPreviewToken] = useState(null);
  const [version, setVersion] = useState(0); // cambia al importar un CSV para refrescar los datos
  
  const estadisticas = getEstadisticasCentro(centroActual);

  const tabs = [
    { id: 'workers', label: 'Trabajadores', icon: Users },
    { id: 'audit', label: 'Auditoría', icon: ClipboardCheck },
    { id: 'config', label: 'Configuración', icon: Settings, disabled: true },
  ];

  // Si hay un token de preview, mostrar la landing de aceptación
  if (previewToken) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <PAUAcceptance 
          token={previewToken} 
          onClose={() => setPreviewToken(null)}
          isPreview={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vitaly-azul flex items-center gap-3">
            <GraduationCap size={28} className="text-vitaly-azul" />
            Halo Training
          </h1>
          <p className="text-gray-500 mt-1">Formación de trabajadores y trazabilidad de la entrega del PAU</p>
        </div>

        {/* KPIs rápidos */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-card">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-vitaly-azul-10 flex items-center justify-center">
                <Users size={20} className="text-vitaly-azul" />
              </div>
              <div>
                <div className="text-2xl font-bold text-vitaly-azul">{estadisticas.total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
            
            <div className="h-10 w-px bg-gray-200" />
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-vitaly-azul-10 flex items-center justify-center">
                <Shield size={20} className="text-vitaly-azul" />
              </div>
              <div>
                <div className="text-2xl font-bold text-vitaly-azul">{estadisticas.aceptados}</div>
                <div className="text-xs text-gray-500">Formados</div>
              </div>
            </div>
            
            <div className="h-10 w-px bg-gray-200" />
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-vitaly-azul-10 flex items-center justify-center">
                <TrendingUp size={20} className="text-halo-cyan" />
              </div>
              <div>
                <div className="text-2xl font-bold text-vitaly-azul">{estadisticas.tasaCumplimiento}%</div>
                <div className="text-xs text-gray-500">Cumplimiento</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
        {/* Tab headers */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'text-vitaly-azul border-vitaly-amarillo bg-vitaly-amarillo/5'
                    : tab.disabled
                    ? 'text-gray-300 border-transparent cursor-not-allowed'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {tab.disabled && (
                  <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Próximamente</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'workers' && (
            <WorkersManagement 
              centroActual={centroActual}
              version={version}
              onDatosCambiados={() => setVersion((v) => v + 1)}
              onPreviewToken={(token) => setPreviewToken(token)}
            />
          )}
          {activeTab === 'audit' && (
            <AuditDashboard centroActual={centroActual} />
          )}
          {activeTab === 'config' && (
            <div className="text-center py-12 text-gray-500">
              <Settings size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Configuración de triggers y automatizaciones</p>
              <p className="text-sm text-gray-400 mt-2">Próximamente disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


