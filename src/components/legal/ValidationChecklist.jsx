import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  Loader,
  Shield,
  Users,
  Scale,
  Sparkles,
} from 'lucide-react';
import { checklistValidacion, normativasPorCCAA } from '../../data/legalMockData';

export default function ValidationChecklist({ ccaa, projectData }) {
  const [generando, setGenerando] = useState(false);
  const [generado, setGenerado] = useState(false);
  const normativa = normativasPorCCAA[ccaa] || normativasPorCCAA.default;

  // Mock de estado de validación
  const [validationState] = useState({
    datos_generales: { titular: true, emplazamiento: true, actividad: true },
    medios_proteccion: { extintores: true, bies: true, deteccion: false, mantenimiento: true },
    organizacion: { roles: false, procedimientos: true, formacion: true },
    normativa: { tecnico: ccaa !== 'canarias', formato: true, anexos: true },
  });

  const getGroupStatus = (groupId) => {
    const group = validationState[groupId];
    if (!group) return 'pending';
    
    const items = Object.values(group);
    const allTrue = items.every((v) => v === true);
    const someTrue = items.some((v) => v === true);
    
    if (allTrue) return 'success';
    if (someTrue) return 'warning';
    return 'error';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} className="text-halo-emerald" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-vitaly-azul" />;
      case 'error':
        return <XCircle size={20} className="text-vitaly-danger" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-halo-emerald bg-halo-emerald/5';
      case 'warning':
        return 'border-vitaly-amarillo bg-vitaly-amarillo/5';
      case 'error':
        return 'border-vitaly-danger bg-vitaly-danger/5';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const overallStatus = () => {
    const statuses = checklistValidacion.map((g) => getGroupStatus(g.id));
    if (statuses.every((s) => s === 'success')) return 'success';
    if (statuses.some((s) => s === 'error')) return 'error';
    return 'warning';
  };

  const handleGenerar = () => {
    setGenerando(true);
    setTimeout(() => {
      setGenerando(false);
      setGenerado(true);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
        <h3 className="text-lg font-bold text-vitaly-azul mb-2 flex items-center gap-2">
          <CheckCircle size={20} className="text-halo-cyan" />
          Validación y Generación del PAU
        </h3>
        <p className="text-gray-600 text-sm">
          Revisa el checklist de validación antes de generar el documento final.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Checklist */}
        <div className="col-span-8 space-y-4">
          {checklistValidacion.map((grupo) => {
            const status = getGroupStatus(grupo.id);
            
            return (
              <div
                key={grupo.id}
                className={`bg-white rounded-xl border-2 p-5 shadow-card ${getStatusColor(status)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-vitaly-azul flex items-center gap-2">
                    {getStatusIcon(status)}
                    {grupo.grupo}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      status === 'success'
                        ? 'bg-halo-emerald/20 text-halo-emerald'
                        : status === 'warning'
                        ? 'bg-vitaly-amarillo/20 text-amber-700'
                        : 'bg-vitaly-danger/20 text-vitaly-danger'
                    }`}
                  >
                    {status === 'success' ? 'Completo' : status === 'warning' ? 'Parcial' : 'Pendiente'}
                  </span>
                </div>

                <div className="space-y-2">
                  {grupo.items.map((item) => {
                    const isValid = validationState[grupo.id]?.[item.id];
                    
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isValid ? 'bg-halo-emerald/10' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isValid ? (
                            <CheckCircle size={16} className="text-halo-emerald" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          )}
                          <span className={`text-sm ${isValid ? 'text-gray-700' : 'text-gray-500'}`}>
                            {item.nombre}
                          </span>
                          {item.requerido && (
                            <span className="text-[10px] text-vitaly-danger font-semibold">*</span>
                          )}
                        </div>
                        {isValid && (
                          <span className="text-xs text-halo-emerald">Validado</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Alerta específica por región */}
          {ccaa === 'canarias' && !validationState.normativa?.tecnico && (
            <div className="bg-vitaly-danger/10 rounded-xl border-2 border-vitaly-danger/30 p-5">
              <div className="flex items-start gap-3">
                <XCircle size={24} className="text-vitaly-danger flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-vitaly-danger">Validación Técnica Bloqueada</h4>
                  <p className="text-sm text-vitaly-danger/80 mt-1">
                    El técnico asignado no tiene el Código de Registro requerido para Canarias
                    (Decreto 67/2015). Por favor, asigne un técnico local acreditado antes de generar
                    el PAU.
                  </p>
                  <button className="mt-3 px-4 py-2 bg-vitaly-danger text-white text-sm font-semibold rounded-lg hover:bg-vitaly-danger/90 transition-colors">
                    Asignar Técnico Acreditado
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel de Resumen */}
        <div className="col-span-4 space-y-4">
          {/* Score de Cumplimiento */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={overallStatus() === 'success' ? '#029968' : overallStatus() === 'warning' ? '#FFB700' : '#DC3545'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - 0.78)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-vitaly-azul">78%</span>
                <span className="text-xs text-gray-500">Completado</span>
              </div>
            </div>
            <p className={`font-semibold ${
              overallStatus() === 'success' ? 'text-halo-emerald' :
              overallStatus() === 'warning' ? 'text-amber-600' : 'text-vitaly-danger'
            }`}>
              {overallStatus() === 'success' ? 'Listo para generar' :
               overallStatus() === 'warning' ? 'Requiere atención' : 'Faltan datos críticos'}
            </p>
          </div>

          {/* Info del Proyecto */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card">
            <h4 className="font-bold text-vitaly-azul mb-4 flex items-center gap-2">
              <FileText size={18} className="text-halo-cyan" />
              Resumen del Proyecto
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Normativa:</span>
                <span className="font-semibold text-gray-800">{normativa.norma}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Formato:</span>
                <span className="font-semibold text-gray-800">{normativa.formatoSalida}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Capítulos:</span>
                <span className="font-semibold text-gray-800">9 / 9</span>
              </div>
            </div>
          </div>

          {/* Botón de Generación */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card">
            {generado ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-halo-emerald/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-halo-emerald" />
                </div>
                <h4 className="font-bold text-vitaly-azul mb-2">PAU Generado</h4>
                <p className="text-sm text-gray-600 mb-4">
                  El documento se ha generado correctamente.
                </p>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-halo-emerald text-white font-semibold rounded-lg hover:bg-halo-emerald-dark transition-colors">
                  <Download size={18} />
                  Descargar PAU
                </button>
              </div>
            ) : (
              <>
                <h4 className="font-bold text-vitaly-azul mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-halo-cyan" />
                  Generar Documento
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Se generará el PAU completo en formato {normativa.formatoSalida}.
                </p>
                <button
                  onClick={handleGenerar}
                  disabled={generando || overallStatus() === 'error'}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    generando
                      ? 'bg-gray-200 text-gray-500 cursor-wait'
                      : overallStatus() === 'error'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-vitaly-azul text-white hover:bg-vitaly-azul-hover'
                  }`}
                >
                  {generando ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Generando PAU...
                    </>
                  ) : (
                    <>
                      <FileText size={18} />
                      Generar PAU
                    </>
                  )}
                </button>
                {overallStatus() === 'error' && (
                  <p className="mt-2 text-xs text-vitaly-danger text-center">
                    Completa los campos requeridos para generar
                  </p>
                )}
              </>
            )}
          </div>

          {/* Documentos adicionales por región */}
          {ccaa === 'galicia' && (
            <div className="bg-halo-cyan/10 rounded-xl border border-halo-cyan/30 p-4">
              <h4 className="font-semibold text-halo-cyan text-sm mb-2">
                Documentos Galicia
              </h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-halo-emerald" />
                  Certificación Implantación (Anexo IV)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-halo-emerald" />
                  Modelo Tasas Administrativas
                </li>
              </ul>
            </div>
          )}

          {ccaa === 'madrid' && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <h4 className="font-semibold text-blue-700 text-sm mb-2">
                Formularios RDPA
              </h4>
              <div className="flex flex-wrap gap-1">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    className="px-2 py-0.5 bg-white border border-blue-200 rounded text-xs text-blue-700"
                  >
                    F{num}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ccaa === 'cataluna' && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
              <h4 className="font-semibold text-amber-700 text-sm mb-2">
                Integración HERMES
              </h4>
              <p className="text-xs text-amber-600">
                Los datos se exportarán en formato compatible con la plataforma HERMES de la Generalitat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

