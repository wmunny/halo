import React, { useState, useEffect } from 'react';
import {
  MapPin,
  AlertTriangle,
  Info,
  CheckCircle,
  FileText,
  Building2,
  Scale,
} from 'lucide-react';
import { codigoPostalToCCAA, normativasPorCCAA } from '../../data/legalMockData';

export default function JurisdictionDetector({ projectData, onDataChange }) {
  const [showToast, setShowToast] = useState(false);
  const [detectedNormativa, setDetectedNormativa] = useState(null);

  // Detectar CCAA al cambiar código postal
  useEffect(() => {
    if (projectData.codigoPostal && projectData.codigoPostal.length >= 2) {
      const prefix = projectData.codigoPostal.substring(0, 2);
      const ccaa = codigoPostalToCCAA[prefix] || 'default';
      const normativa = normativasPorCCAA[ccaa] || normativasPorCCAA.default;

      if (ccaa !== projectData.ccaa) {
        onDataChange({ ccaa, normativa });
        setDetectedNormativa(normativa);
        setShowToast(true);

        // Ocultar toast después de 8 segundos
        setTimeout(() => setShowToast(false), 8000);
      }
    }
  }, [projectData.codigoPostal]);

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'bg-halo-emerald/10 border-halo-emerald/30 text-halo-emerald',
      amber: 'bg-amber-100 border-amber-300 text-amber-700',
      cyan: 'bg-halo-cyan/10 border-halo-cyan/30 text-halo-cyan',
      orange: 'bg-orange-100 border-orange-300 text-orange-700',
      blue: 'bg-blue-100 border-blue-300 text-blue-700',
      gray: 'bg-gray-100 border-gray-300 text-gray-700',
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-6">
      {/* Toast de Jurisdicción Detectada */}
      {showToast && detectedNormativa && (
        <div
          className={`p-4 rounded-xl border-2 ${getColorClasses(detectedNormativa.color)} animate-fade-in`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/50 flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Jurisdicción Detectada
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{detectedNormativa.nombre}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Scale size={16} />
                  <span className="font-semibold">Normativa Activa:</span>
                  <span>{detectedNormativa.norma}</span>
                </div>
                {detectedNormativa.umbralOcupacion && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle size={14} />
                    <span>Umbral PAU: &gt; {detectedNormativa.umbralOcupacion} personas</span>
                  </div>
                )}
                {detectedNormativa.formatoSalida && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText size={14} />
                    <span>Formato Salida: {detectedNormativa.formatoSalida}</span>
                  </div>
                )}
              </div>
              {detectedNormativa.alertas?.map((alerta, idx) => (
                <div
                  key={idx}
                  className="mt-3 p-2 bg-white/30 rounded-lg flex items-start gap-2 text-sm"
                >
                  {alerta.tipo === 'warning' ? (
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info size={16} className="flex-shrink-0 mt-0.5" />
                  )}
                  <span>{alerta.mensaje}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-current opacity-50 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Formulario de Proyecto */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
        <h3 className="text-lg font-bold text-vitaly-azul mb-6 flex items-center gap-2">
          <FileText size={20} className="text-halo-cyan" />
          Nuevo Proyecto de Plan de Autoprotección
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {/* Nombre del Proyecto */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              value={projectData.nombre}
              onChange={(e) => onDataChange({ nombre: e.target.value })}
              placeholder="Ej: PAU Nave Industrial Zona Franca"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
            />
          </div>

          {/* Dirección */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dirección del Emplazamiento *
            </label>
            <div className="relative">
              <Building2
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={projectData.direccion}
                onChange={(e) => onDataChange({ direccion: e.target.value })}
                placeholder="Calle, número, polígono..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
              />
            </div>
          </div>

          {/* Código Postal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Código Postal *
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={projectData.codigoPostal}
                onChange={(e) => onDataChange({ codigoPostal: e.target.value })}
                placeholder="08001"
                maxLength={5}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              La normativa se detectará automáticamente según el código postal
            </p>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              type="text"
              value={projectData.ciudad}
              onChange={(e) => onDataChange({ ciudad: e.target.value })}
              placeholder="Barcelona"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
            />
          </div>
        </div>
      </div>

      {/* Resumen de Normativa Detectada */}
      {projectData.normativa && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
          <h3 className="text-lg font-bold text-vitaly-azul mb-4 flex items-center gap-2">
            <Scale size={20} className="text-halo-cyan" />
            Normativa Aplicable
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Comunidad Autónoma</p>
              <p className="font-semibold text-gray-800">{projectData.normativa.nombre}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Normativa</p>
              <p className="font-semibold text-gray-800">{projectData.normativa.norma}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Formato de Salida</p>
              <p className="font-semibold text-gray-800">{projectData.normativa.formatoSalida}</p>
            </div>
          </div>

          {/* Requisitos específicos */}
          {projectData.normativa.requisitos?.length > 0 && (
            <div className="mt-4 p-4 bg-halo-cyan/5 rounded-lg border border-halo-cyan/20">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Requisitos específicos de {projectData.normativa.nombre}:
              </p>
              <ul className="space-y-1">
                {projectData.normativa.requisitos.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-halo-emerald mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Campos extra requeridos */}
          {projectData.normativa.camposExtra?.length > 0 && (
            <div className="mt-4 p-4 bg-vitaly-amarillo/10 rounded-lg border border-vitaly-amarillo/30">
              <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} />
                Campos adicionales requeridos:
              </p>
              <div className="flex flex-wrap gap-2">
                {projectData.normativa.camposExtra.map((campo, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white rounded text-xs font-medium text-amber-700"
                  >
                    {campo}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

