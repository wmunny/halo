import React, { useState } from 'react';
import { FileText, Download, FileCheck, Calendar, User, CheckCircle2 } from 'lucide-react';
import { maintenanceHistory } from '../../../data/connectMockData';

export default function DocumentsPanel({ inventory, workOrders }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentGenerated, setDocumentGenerated] = useState(false);

  const handleGenerateActa = async () => {
    setIsGenerating(true);
    
    // Simular generación de PDF
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDocumentGenerated(true);
    setIsGenerating(false);
  };

  const completedWorkOrders = workOrders.filter(wo => wo.estado === 'completada');
  const reviewedAssets = inventory.filter(a => a.estado === 'ok');

  return (
    <div className="space-y-6">
      {/* Generador de Actas RIPCI */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-vitaly-amarillo/10 flex items-center justify-center">
            <FileText size={20} className="text-vitaly-azul" />
          </div>
          <h3 className="text-lg font-bold text-vitaly-azul">Generador de Actas RIPCI</h3>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Genera el Certificado de Mantenimiento Oficial en PDF con todos los activos revisados,
            checklists completados y firmas digitales.
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Activos Revisados</div>
              <div className="text-2xl font-bold text-vitaly-azul">{reviewedAssets.length}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Órdenes Completadas</div>
              <div className="text-2xl font-bold text-vitaly-azul">{completedWorkOrders.length}</div>
            </div>
          </div>

          <button
            onClick={handleGenerateActa}
            disabled={isGenerating || documentGenerated}
            className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all ${
              !isGenerating && !documentGenerated
                ? 'bg-vitaly-azul hover:bg-vitaly-azul-hover text-white shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                Generando PDF...
              </span>
            ) : documentGenerated ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                Acta Generada - Descargar PDF
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FileText size={18} />
                Generar Acta de Mantenimiento
              </span>
            )}
          </button>

          {documentGenerated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 size={20} />
                <span className="font-semibold">Acta generada correctamente</span>
              </div>
              <div className="text-sm text-green-600 mt-2">
                El documento incluye: Listado de activos, Checklists completados, Firma del técnico, Firma del titular.
              </div>
              <button className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                <Download size={18} />
                Descargar PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Libro de Mantenimiento Digital */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileCheck size={20} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-vitaly-azul">Libro de Mantenimiento Digital</h3>
        </div>

        <div className="space-y-3">
          {maintenanceHistory.map((revision) => (
            <div
              key={revision.id}
              className="bg-gray-50 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileCheck size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{revision.activoId}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar size={14} />
                      {revision.fecha}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg border ${
                  revision.resultado === 'OK' 
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {revision.resultado}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">Técnico</div>
                  <div className="text-gray-900 flex items-center gap-1">
                    <User size={14} className="text-gray-400" />
                    {revision.tecnico}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Firmas</div>
                  <div className="flex items-center gap-2">
                    {revision.firmaTecnico && (
                      <span className="text-green-600 text-xs font-medium">✓ Técnico</span>
                    )}
                    {revision.firmaTitular && (
                      <span className="text-green-600 text-xs font-medium">✓ Titular</span>
                    )}
                  </div>
                </div>
              </div>

              {revision.observaciones && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-500">Observaciones</div>
                  <div className="text-gray-900 text-sm mt-1">{revision.observaciones}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 font-semibold transition-colors flex items-center justify-center gap-2">
            <Download size={18} />
            Exportar Historial Completo a PDF
          </button>
        </div>
      </div>
    </div>
  );
}
