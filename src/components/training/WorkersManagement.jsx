/**
 * Panel de Gestión de Trabajadores
 * Envío de Magic Links para formación PAU
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Send, 
  Eye, 
  Mail, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  XCircle,
  Users,
  RefreshCw,
  Shield,
  Upload,
  RotateCcw,
} from 'lucide-react';
import {
  getTrabajadoresConEstado,
  getEstadisticasCentro,
  notificationStatus,
  etiquetasRolPAU,
  esEquipoIntervencion,
  restaurarPlantillaDemo,
  tieneListadoImportado,
} from '../../data/trainingMockData';
import { centrosTrabajo } from '../../data/mockData';
import { generateTrainingToken } from '../../utils/trainingTokenValidator';
import EmailPreview from './EmailPreview';
import CsvImport from './CsvImport';

export default function WorkersManagement({ centroActual, version = 0, onDatosCambiados, onPreviewToken }) {
  const [showImport, setShowImport] = useState(false);
  const [aviso, setAviso] = useState(null);
  const centroNombre = centrosTrabajo.find((c) => c.id === centroActual)?.nombre || centroActual;
  const importado = useMemo(() => tieneListadoImportado(centroActual), [centroActual, version]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'intervencion' | 'trabajador'
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Obtener trabajadores con estado
  const trabajadores = useMemo(() => {
    return getTrabajadoresConEstado(centroActual);
  }, [centroActual, version]);

  const estadisticas = getEstadisticasCentro(centroActual);

  // Departamentos únicos
  const departamentos = useMemo(() => {
    const deps = new Set(trabajadores.map(t => t.departamento));
    return Array.from(deps).sort();
  }, [trabajadores]);

  // Filtrar trabajadores
  const trabajadoresFiltrados = useMemo(() => {
    return trabajadores.filter(t => {
      // Filtro de búsqueda
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesNombre = `${t.nombre} ${t.apellidos}`.toLowerCase().includes(search);
        const matchesEmail = t.email.toLowerCase().includes(search);
        const matchesDni = t.dni.toLowerCase().includes(search);
        if (!matchesNombre && !matchesEmail && !matchesDni) return false;
      }
      
      // Filtro de departamento
      if (departmentFilter !== 'all' && t.departamento !== departmentFilter) {
        return false;
      }
      
      // Filtro de estado
      if (statusFilter !== 'all' && t.estadoNotificacion !== statusFilter) {
        return false;
      }

      // Filtro de rol PAU
      if (roleFilter === 'intervencion' && !esEquipoIntervencion(t.rolPAU)) {
        return false;
      }
      if (roleFilter === 'trabajador' && esEquipoIntervencion(t.rolPAU)) {
        return false;
      }
      
      return true;
    });
  }, [trabajadores, searchTerm, departmentFilter, statusFilter, roleFilter]);

  // Simular envío de notificación
  const handleEnviarNotificacion = (trabajador) => {
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      alert(`✅ Magic Link enviado a ${trabajador.nombre} ${trabajador.apellidos}\n📧 ${trabajador.email}`);
    }, 1000);
  };

  // Envío masivo
  const handleEnvioMasivo = () => {
    const pendientes = trabajadoresFiltrados.filter(t => 
      t.estadoNotificacion === 'sin_notificar' || t.estadoNotificacion === notificationStatus.PENDING
    );
    
    if (pendientes.length === 0) {
      alert('No hay trabajadores pendientes de notificar');
      return;
    }
    
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      alert(`✅ Enviando ${pendientes.length} Magic Links...\nLos trabajadores recibirán el email en breve.`);
    }, 1500);
  };

  // Ver preview del email
  const handleVerPreview = (trabajador) => {
    setSelectedWorker(trabajador);
    setShowEmailPreview(true);
  };

  // Ver landing de aceptación (demo)
  const handleVerLanding = (trabajador) => {
    const token = trabajador.notificacion?.magicLinkToken || generateTrainingToken();
    onPreviewToken(token);
  };

  // Badge de rol PAU
  const getRolPAUBadge = (rolPAU) => {
    if (!rolPAU || rolPAU === 'trabajador') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
          Trabajador
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
        🛡 {etiquetasRolPAU[rolPAU] || rolPAU}
      </span>
    );
  };

  // Badge de estado
  const getStatusBadge = (estado) => {
    switch (estado) {
      case notificationStatus.ACCEPTED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle size={12} />
            Formado
          </span>
        );
      case notificationStatus.SENT:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            <Clock size={12} />
            Enviado
          </span>
        );
      case notificationStatus.EXPIRED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
            <AlertCircle size={12} />
            Expirado
          </span>
        );
      case notificationStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <XCircle size={12} />
            Rechazado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            <Clock size={12} />
            Pendiente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Total</span>
          </div>
          <div className="text-2xl font-bold text-vitaly-azul">{estadisticas.total}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-600">Formados</span>
          </div>
          <div className="text-2xl font-bold text-vitaly-azul">{estadisticas.aceptados}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Enviados</span>
          </div>
          <div className="text-2xl font-bold text-vitaly-azul">{estadisticas.enviados}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Pendientes</span>
          </div>
          <div className="text-2xl font-bold text-vitaly-azul">{estadisticas.pendientes}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-vitaly-azul" />
            <span className="text-sm font-medium text-gray-600">Cumplimiento</span>
          </div>
          <div className="text-2xl font-bold text-vitaly-azul">{estadisticas.tasaCumplimiento}%</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={18} className="text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Eq. Intervención</span>
          </div>
          <div className="text-2xl font-bold text-vitaly-azul">
            {trabajadores.filter(t => esEquipoIntervencion(t.rolPAU)).length}
          </div>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-vitaly-amarillo/50 focus:border-vitaly-amarillo"
            />
          </div>

          {/* Filtro departamento */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-vitaly-amarillo/50 focus:border-vitaly-amarillo"
          >
            <option value="all">Todos los departamentos</option>
            {departamentos.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>

          {/* Filtro estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-vitaly-amarillo/50 focus:border-vitaly-amarillo"
          >
            <option value="all">Todos los estados</option>
            <option value="sin_notificar">Pendientes</option>
            <option value="sent">Enviados</option>
            <option value="accepted">Formados</option>
            <option value="expired">Expirados</option>
          </select>

          {/* Filtro rol PAU */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-vitaly-azul/20 focus:border-vitaly-azul bg-white text-gray-700"
          >
            <option value="all">Todos los roles</option>
            <option value="intervencion">🛡 Equipo de Intervención</option>
            <option value="trabajador">Trabajadores</option>
          </select>
        </div>

        {/* Importar CSV */}
        {importado && (
          <button
            onClick={() => {
              restaurarPlantillaDemo(centroActual);
              setAviso('Se ha restaurado la plantilla de demostración del centro.');
              onDatosCambiados?.();
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            title="Descartar el listado importado y volver a los datos de demo"
          >
            <RotateCcw size={18} />
            Restaurar demo
          </button>
        )}
        <button
          onClick={() => setShowImport(true)}
          className="flex items-center gap-2 px-5 py-2.5 border border-vitaly-azul text-vitaly-azul font-semibold rounded-lg hover:bg-vitaly-azul-10 transition-colors"
        >
          <Upload size={18} />
          Importar CSV
        </button>

        {/* Botón envío masivo */}
        <button
          onClick={handleEnvioMasivo}
          disabled={enviando}
          className="flex items-center gap-2 px-5 py-2.5 bg-vitaly-azul text-white font-semibold rounded-lg hover:bg-vitaly-azul-hover transition-colors disabled:opacity-50"
        >
          {enviando ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          Envío Masivo
        </button>
      </div>

      {aviso && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg text-sm bg-green-50 text-green-800 border border-green-200">
          <span className="flex items-center gap-2"><CheckCircle size={16} /> {aviso}</span>
          <button onClick={() => setAviso(null)} className="text-green-700 hover:text-green-900" aria-label="Cerrar aviso">
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Tabla de trabajadores */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trabajador</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Departamento</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Puesto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rol PAU</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trabajadoresFiltrados.map((trabajador) => (
              <tr key={trabajador.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {trabajador.nombre} {trabajador.apellidos}
                    </div>
                    <div className="text-sm text-gray-500">{trabajador.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{trabajador.departamento}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{trabajador.puesto}</td>
                <td className="px-4 py-3">{getRolPAUBadge(trabajador.rolPAU)}</td>
                <td className="px-4 py-3">{getStatusBadge(trabajador.estadoNotificacion)}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {trabajador.notificacion?.fechaAceptacion 
                    ? new Date(trabajador.notificacion.fechaAceptacion).toLocaleDateString('es-ES')
                    : trabajador.notificacion?.fechaEnvio
                    ? new Date(trabajador.notificacion.fechaEnvio).toLocaleDateString('es-ES')
                    : '-'
                  }
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {/* Ver preview email */}
                    <button
                      onClick={() => handleVerPreview(trabajador)}
                      className="p-2 text-gray-500 hover:text-halo-cyan hover:bg-halo-cyan/10 rounded-lg transition-colors"
                      title="Ver preview del email"
                    >
                      <Eye size={16} />
                    </button>
                    
                    {/* Ver landing (demo) */}
                    <button
                      onClick={() => handleVerLanding(trabajador)}
                      className="p-2 text-gray-500 hover:text-vitaly-amarillo hover:bg-vitaly-amarillo/10 rounded-lg transition-colors"
                      title="Ver landing de aceptación"
                    >
                      <Mail size={16} />
                    </button>
                    
                    {/* Enviar notificación */}
                    {trabajador.estadoNotificacion !== notificationStatus.ACCEPTED && (
                      <button
                        onClick={() => handleEnviarNotificacion(trabajador)}
                        disabled={enviando}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-halo-cyan hover:bg-halo-cyan-dark rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Send size={14} />
                        Enviar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {trabajadoresFiltrados.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No se encontraron trabajadores</p>
          </div>
        )}
      </div>

      {showImport && (
        <CsvImport
          centroId={centroActual}
          centroNombre={centroNombre}
          onClose={() => setShowImport(false)}
          onImported={(importados, total) => {
            setShowImport(false);
            setAviso(`${importados} trabajadores importados desde CSV. La plantilla del centro tiene ahora ${total} personas.`);
            onDatosCambiados?.();
          }}
        />
      )}

      {/* Modal de preview de email */}
      {showEmailPreview && selectedWorker && (
        <EmailPreview
          trabajador={selectedWorker}
          onClose={() => {
            setShowEmailPreview(false);
            setSelectedWorker(null);
          }}
        />
      )}
    </div>
  );
}


