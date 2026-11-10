import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Shield,
  Zap,
  MapPin,
  Users,
  CheckCircle,
  Loader,
  Sparkles,
  X,
  Link2,
  Building2,
} from 'lucide-react';
import { tiposDocumentos, datosExtraidosMock } from '../../data/legalMockData';
import SubidaPlanos from '../sim/SubidaPlanos';

const iconMap = {
  FileText,
  Shield,
  Zap,
  MapPin,
  Users,
};

export default function DocumentDropzone({ centroId, documentosSubidos, onUpload }) {
  // Inicializar procesados desde documentosSubidos (para demo pre-rellenado)
  const initialProcesados = documentosSubidos.reduce((acc, doc) => {
    if (doc.procesado) acc[doc.id] = true;
    return acc;
  }, {});
  
  const [procesando, setProcesando] = useState({});
  const [procesados, setProcesados] = useState(initialProcesados);
  const [conectando, setConectando] = useState(false);
  // Detectar si rrhh ya está conectado (nombre incluye "Acércate")
  const [conectado, setConectado] = useState(
    documentosSubidos.some(d => d.id === 'rrhh' && d.file?.name?.includes('Acércate'))
  );

  const handleFileSelect = (docId, event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular upload
      onUpload(docId, file);
      setProcesando((prev) => ({ ...prev, [docId]: true }));

      // Simular procesamiento IA
      setTimeout(() => {
        setProcesando((prev) => ({ ...prev, [docId]: false }));
        setProcesados((prev) => ({ ...prev, [docId]: true }));
      }, 2500);
    }
  };

  const handleConnectAcercate = () => {
    setConectando(true);
    // Simular conexión con Acércate Empresa
    setTimeout(() => {
      setConectando(false);
      setConectado(true);
      onUpload('rrhh', { name: 'Acércate Empresa - Sincronizado' });
      setProcesados((prev) => ({ ...prev, rrhh: true }));
    }, 2000);
  };

  const isUploaded = (docId) => documentosSubidos.some((d) => d.id === docId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
        <h3 className="text-lg font-bold text-vitaly-azul mb-2 flex items-center gap-2">
          <Upload size={20} className="text-halo-cyan" />
          Subida de Documentación
        </h3>
        <p className="text-gray-600 text-sm">
          Sube los documentos del establecimiento. Halo extraerá automáticamente la información
          relevante usando IA para pre-rellenar los campos del PAU.
        </p>
      </div>

      {/* Grid de Dropzones */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {tiposDocumentos.map((doc) => {
          const Icon = iconMap[doc.icono] || FileText;
          const uploaded = isUploaded(doc.id);
          const isProcesando = procesando[doc.id];
          const isProcesado = procesados[doc.id];

          return (
            <div
              key={doc.id}
              className={`relative rounded-xl border-2 border-dashed p-6 transition-all ${
                isProcesado
                  ? 'border-halo-emerald bg-halo-emerald/5'
                  : uploaded
                  ? 'border-halo-cyan bg-halo-cyan/5'
                  : 'border-gray-300 bg-white hover:border-halo-cyan/50 hover:bg-halo-cyan/5'
              }`}
            >
              {/* Status badge */}
              {isProcesado && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-halo-emerald text-white text-xs font-semibold rounded-full">
                    <Sparkles size={12} />
                    IA Procesado
                  </span>
                </div>
              )}

              <div className="text-center">
                <div
                  className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${
                    isProcesado
                      ? 'bg-halo-emerald/20'
                      : uploaded
                      ? 'bg-halo-cyan/20'
                      : 'bg-gray-100'
                  }`}
                >
                  {isProcesando ? (
                    <Loader
                      size={28}
                      className="text-halo-cyan animate-spin"
                    />
                  ) : isProcesado ? (
                    <CheckCircle size={28} className="text-halo-emerald" />
                  ) : (
                    <Icon
                      size={28}
                      className={uploaded ? 'text-halo-cyan' : 'text-gray-400'}
                    />
                  )}
                </div>

                <h4 className="font-semibold text-vitaly-azul text-sm mb-1">
                  {doc.nombre}
                </h4>
                <p className="text-xs text-gray-500 mb-4">{doc.descripcion}</p>

                {isProcesando || (doc.id === 'rrhh' && conectando) ? (
                  <div className="space-y-2">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-vitaly-azul rounded-full animate-pulse w-2/3" />
                    </div>
                    <p className="text-xs text-halo-cyan">
                      {doc.id === 'rrhh' && conectando ? 'Conectando con Acércate Empresa...' : 'Extrayendo datos con IA...'}
                    </p>
                  </div>
                ) : isProcesado ? (
                  <div className="space-y-2">
                    <p className="text-xs text-halo-emerald font-semibold">
                      {doc.id === 'rrhh' && conectado ? (
                        <span className="flex items-center justify-center gap-1">
                          <Link2 size={12} />
                          Sincronizado con Acércate
                        </span>
                      ) : (
                        `${doc.camposExtraidos.length} campos extraídos`
                      )}
                    </p>
                    <button className="text-xs text-halo-cyan hover:underline">
                      Ver datos extraídos
                    </button>
                  </div>
                ) : doc.id === 'rrhh' ? (
                  /* Opciones especiales para Listado de Personal */
                  <div className="space-y-2">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png,.xlsx,.csv"
                        onChange={(e) => handleFileSelect(doc.id, e)}
                        className="hidden"
                      />
                      <span className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-halo-cyan/10 hover:text-halo-cyan transition-colors">
                        <Upload size={14} />
                        Subir archivo
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400">o</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <button
                      onClick={handleConnectAcercate}
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-vitaly-primary to-vitaly-primary-light text-white hover:shadow-md transition-all"
                    >
                      <Building2 size={14} />
                      Conectar Acércate Empresa
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => handleFileSelect(doc.id, e)}
                      className="hidden"
                    />
                    <span
                      className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        uploaded
                          ? 'bg-halo-cyan/20 text-halo-cyan'
                          : 'bg-gray-100 text-gray-600 hover:bg-halo-cyan/10 hover:text-halo-cyan'
                      }`}
                    >
                      {uploaded ? 'Cambiar archivo' : 'Subir archivo'}
                    </span>
                  </label>
                )}
              </div>

              {/* Campos que se extraerán */}
              {!isProcesado && !isProcesando && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">Campos a extraer:</p>
                  <div className="flex flex-wrap gap-1">
                    {doc.camposExtraidos.slice(0, 3).map((campo, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded"
                      >
                        {campo}
                      </span>
                    ))}
                    {doc.camposExtraidos.length > 3 && (
                      <span className="px-2 py-0.5 text-gray-400 text-[10px]">
                        +{doc.camposExtraidos.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Planos del centro: plano normal (documental) y modelo IFC (gemelo digital de evacuación) */}
      {centroId && <SubidaPlanos centroId={centroId} />}

      {/* Panel de Datos Extraídos */}
      {Object.keys(procesados).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
          <h3 className="text-lg font-bold text-vitaly-azul mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-halo-emerald" />
            Datos Extraídos por IA
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {procesados.licencia && datosExtraidosMock.licencia && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-vitaly-azul text-sm mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-halo-cyan" />
                  Licencia de Actividad
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Uso principal:</span>
                    <span className="font-medium text-gray-800">
                      {datosExtraidosMock.licencia.usoPrincipal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Superficie:</span>
                    <span className="font-medium text-gray-800">
                      {datosExtraidosMock.licencia.superficieTotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plantas:</span>
                    <span className="font-medium text-gray-800">
                      {datosExtraidosMock.licencia.numeroPlantas}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {procesados.mantenimiento && datosExtraidosMock.mantenimiento && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-vitaly-azul text-sm mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-halo-emerald" />
                  Medios de Protección
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Extintores:</span>
                    <span className="font-medium text-gray-800">
                      {datosExtraidosMock.mantenimiento.extintores.cantidad} uds.
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">BIEs:</span>
                    <span className="font-medium text-gray-800">
                      {datosExtraidosMock.mantenimiento.bies.cantidad} uds.
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Detectores:</span>
                    <span className="font-medium text-gray-800">
                      {datosExtraidosMock.mantenimiento.deteccion.detectores} uds.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {procesados.boletines && datosExtraidosMock.boletines && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-vitaly-azul text-sm mb-3 flex items-center gap-2">
                  <Zap size={16} className="text-vitaly-azul" />
                  Instalaciones de Riesgo
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">CT:</span>
                    <span className="font-medium text-gray-800">
                      {datosExtraidosMock.boletines.centroTransformacion.potencia}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Climatización:</span>
                    <span className="font-medium text-gray-800">
                      {datosExtraidosMock.boletines.climatizacion.potenciaTermica}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {procesados.catastro && datosExtraidosMock.catastro && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-vitaly-azul text-sm mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  Datos Catastrales
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ref. Catastral:</span>
                    <span className="font-medium text-gray-800 text-xs">
                      {datosExtraidosMock.catastro.referenciaCatastral.slice(0, 14)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Coordenadas:</span>
                    <span className="font-medium text-gray-800 text-xs">
                      {datosExtraidosMock.catastro.coordenadasUTM}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {procesados.rrhh && datosExtraidosMock.rrhh && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-vitaly-azul text-sm mb-3 flex items-center gap-2">
                  <Users size={16} className="text-purple-500" />
                  Personal
                  {conectado && (
                    <span className="ml-auto px-2 py-0.5 bg-vitaly-primary/10 text-vitaly-primary text-[10px] font-semibold rounded-full flex items-center gap-1">
                      <Link2 size={10} />
                      Acércate
                    </span>
                  )}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total empleados:</span>
                    <span className="font-medium text-gray-800">
                      {datosExtraidosMock.rrhh.totalEmpleados}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Turnos:</span>
                    <span className="font-medium text-gray-800 text-xs">
                      {datosExtraidosMock.rrhh.turnos.length} turnos
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ocupación máx:</span>
                    <span className="font-medium text-gray-800">
                      {datosExtraidosMock.rrhh.ocupacionMaxima}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

