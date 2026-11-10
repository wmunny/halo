/**
 * Dashboard de Auditoría
 * Logs de aceptación con trazabilidad completa
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ClipboardCheck, 
  Hash, 
  Globe, 
  Monitor,
  Calendar,
  User,
  FileText,
  Filter,
} from 'lucide-react';
import { getAllAuditLogs, getAuditLogsByCentro } from '../../data/trainingMockData';
import { formatTimestampUTC } from '../../utils/trainingTokenValidator';

export default function AuditDashboard({ centroActual }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [showAllCentros, setShowAllCentros] = useState(false);

  // Obtener logs
  const allLogs = useMemo(() => {
    return showAllCentros ? getAllAuditLogs() : getAuditLogsByCentro(centroActual);
  }, [centroActual, showAllCentros]);

  // Filtrar logs
  const logsFiltrados = useMemo(() => {
    return allLogs.filter(log => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesNombre = log.nombreCompleto.toLowerCase().includes(search);
        const matchesIP = log.ipAddress.toLowerCase().includes(search);
        const matchesId = log.trabajadorId.toLowerCase().includes(search);
        if (!matchesNombre && !matchesIP && !matchesId) return false;
      }
      
      if (actionFilter !== 'all' && log.accion !== actionFilter) {
        return false;
      }
      
      return true;
    });
  }, [allLogs, searchTerm, actionFilter]);

  // Exportar a CSV
  const handleExportCSV = () => {
    const headers = ['ID Usuario', 'Nombre', 'Timestamp UTC', 'Acción', 'IP', 'User Agent', 'Hash Documento', 'Versión PAU', 'Quiz Score'];
    const rows = logsFiltrados.map(log => [
      log.trabajadorId,
      log.nombreCompleto,
      formatTimestampUTC(log.timestamp),
      log.accion,
      log.ipAddress,
      log.userAgent,
      log.documentHash,
      log.metadata.versionPAU,
      log.metadata.quizScore,
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Badge de acción
  const getActionBadge = (accion) => {
    switch (accion) {
      case 'ACEPTACION_PAU':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <ClipboardCheck size={12} />
            Aceptación PAU
          </span>
        );
      case 'ENVIO_NOTIFICACION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            Envío Notificación
          </span>
        );
      case 'RECHAZO_PAU':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            Rechazo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {accion}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ID o IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-vitaly-amarillo/50 focus:border-vitaly-amarillo"
            />
          </div>

          {/* Filtro de acción */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-vitaly-amarillo/50 focus:border-vitaly-amarillo"
          >
            <option value="all">Todas las acciones</option>
            <option value="ACEPTACION_PAU">Aceptación PAU</option>
            <option value="ENVIO_NOTIFICACION">Envío Notificación</option>
            <option value="RECHAZO_PAU">Rechazo</option>
          </select>

          {/* Toggle todos los centros */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showAllCentros}
              onChange={(e) => setShowAllCentros(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-vitaly-azul focus:ring-vitaly-amarillo"
            />
            Mostrar todos los centros
          </label>
        </div>

        {/* Exportar */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Download size={18} />
          Exportar CSV
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Aceptaciones</span>
          </div>
          <div className="text-2xl font-bold text-vitaly-azul">
            {logsFiltrados.filter(l => l.accion === 'ACEPTACION_PAU').length}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <Hash size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Documentos Firmados</span>
          </div>
          <div className="text-2xl font-bold text-vitaly-azul">
            {new Set(logsFiltrados.map(l => l.documentHash)).size}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={18} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Quiz Aprobados</span>
          </div>
          <div className="text-2xl font-bold text-vitaly-azul">
            {logsFiltrados.filter(l => l.metadata.quizScore === '3/3').length}
          </div>
        </div>
      </div>

      {/* Tabla de logs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    Usuario
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    Timestamp UTC
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  <div className="flex items-center gap-1">
                    <ClipboardCheck size={14} />
                    Acción
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  <div className="flex items-center gap-1">
                    <Globe size={14} />
                    IP
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  <div className="flex items-center gap-1">
                    <Monitor size={14} />
                    User Agent
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  <div className="flex items-center gap-1">
                    <Hash size={14} />
                    Hash SHA-256
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Quiz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logsFiltrados.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-semibold text-gray-900">{log.nombreCompleto}</div>
                      <div className="text-xs text-gray-500 font-mono">{log.trabajadorId.toUpperCase()}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                    {formatTimestampUTC(log.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    {getActionBadge(log.accion)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[150px] truncate" title={log.userAgent}>
                    {log.userAgent}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                      {log.documentHash.substring(0, 16)}...
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-green-600">
                      {log.metadata.quizScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logsFiltrados.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ClipboardCheck size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No se encontraron logs de auditoría</p>
          </div>
        )}
      </div>

      {/* Información de compliance */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
        <div className="flex items-start gap-3">
          <Hash className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Cumplimiento RGPD</h4>
            <p className="text-sm text-blue-700 mt-1">
              Todos los registros incluyen hash SHA-256 del documento, timestamp UTC, IP de origen y User Agent. 
              Esta información es evidencia digital válida para auditorías de la AEPD y cumple con el principio de 
              Responsabilidad Proactiva del RGPD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


