import React, { useState } from 'react';
import {
  ClipboardList,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Building2,
  Users,
  Flame,
  Shield,
  Wrench,
  AlertCircle,
  Link,
  BookOpen,
  RefreshCw,
} from 'lucide-react';
import { capitulosPAU, normativasPorCCAA, datosExtraidosMock } from '../../data/legalMockData';

const chapterIcons = {
  1: Building2,
  2: Building2,
  3: Flame,
  4: Shield,
  5: Wrench,
  6: AlertCircle,
  7: Link,
  8: BookOpen,
  9: RefreshCw,
};

export default function AdaptiveForm({ ccaa, datosExtraidos }) {
  const [activeChapter, setActiveChapter] = useState(1);
  const normativa = normativasPorCCAA[ccaa] || normativasPorCCAA.default;

  const renderChapterContent = (chapterId) => {
    switch (chapterId) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Sección 1.1 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">1.1 Dirección Postal y Denominación</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Denominación del Establecimiento</label>
                  <input
                    type="text"
                    defaultValue="Nave Industrial Zona Franca"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Dirección Completa</label>
                  <input
                    type="text"
                    defaultValue="Polígono Industrial Zona Franca, Sector B, Nave 12"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
                  />
                </div>
              </div>
            </div>

            {/* Sección 1.2 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">1.2 Identificación de los Titulares</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Razón Social</label>
                  <input
                    type="text"
                    placeholder="Empresa S.L."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">CIF/NIF</label>
                  <input
                    type="text"
                    placeholder="B12345678"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Representante Legal</label>
                  <input
                    type="text"
                    placeholder="Nombre y Apellidos"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">DNI Representante</label>
                  <input
                    type="text"
                    placeholder="12345678A"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
                  />
                </div>
              </div>
            </div>

            {/* Campos extra según CCAA */}
            {ccaa === 'pais_vasco' && (
              <div className="p-4 bg-halo-emerald/10 rounded-lg border border-halo-emerald/30">
                <h4 className="font-semibold text-vitaly-azul mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Requisito País Vasco (Decreto 277/2010)
                </h4>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Nº Acreditación Técnico Gobierno Vasco *
                  </label>
                  <input
                    type="text"
                    placeholder="GV-XXXX-XXXX"
                    className="w-full px-3 py-2 border border-halo-emerald/30 rounded-lg text-sm focus:border-halo-emerald focus:ring-1 focus:ring-halo-emerald"
                  />
                </div>
              </div>
            )}

            {ccaa === 'canarias' && (
              <div className="p-4 bg-orange-100 rounded-lg border border-orange-300">
                <h4 className="font-semibold text-orange-700 mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Requisito Canarias (Decreto 67/2015)
                </h4>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Código de Registro del Técnico Redactor *
                  </label>
                  <input
                    type="text"
                    placeholder="CAN-XXXX-XXXX"
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">2.1 Descripción de la Actividad</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Uso Principal
                    <span className="ml-2 px-1.5 py-0.5 bg-halo-emerald/20 text-halo-emerald text-[10px] rounded">
                      IA
                    </span>
                  </label>
                  <input
                    type="text"
                    defaultValue={datosExtraidosMock.licencia.usoPrincipal}
                    className="w-full px-3 py-2 border border-halo-emerald/30 bg-halo-emerald/5 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Superficie Total
                    <span className="ml-2 px-1.5 py-0.5 bg-halo-emerald/20 text-halo-emerald text-[10px] rounded">
                      IA
                    </span>
                  </label>
                  <input
                    type="text"
                    defaultValue={datosExtraidosMock.licencia.superficieTotal}
                    className="w-full px-3 py-2 border border-halo-emerald/30 bg-halo-emerald/5 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Número de Plantas
                    <span className="ml-2 px-1.5 py-0.5 bg-halo-emerald/20 text-halo-emerald text-[10px] rounded">
                      IA
                    </span>
                  </label>
                  <input
                    type="text"
                    defaultValue={datosExtraidosMock.licencia.numeroPlantas}
                    className="w-full px-3 py-2 border border-halo-emerald/30 bg-halo-emerald/5 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Altura de Evacuación
                    <span className="ml-2 px-1.5 py-0.5 bg-halo-emerald/20 text-halo-emerald text-[10px] rounded">
                      IA
                    </span>
                  </label>
                  <input
                    type="text"
                    defaultValue={datosExtraidosMock.licencia.alturaEvacuacion}
                    className="w-full px-3 py-2 border border-halo-emerald/30 bg-halo-emerald/5 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {ccaa === 'cataluna' && (
              <div className="p-4 bg-amber-100 rounded-lg border border-amber-300">
                <h4 className="font-semibold text-amber-700 mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Clasificación Cataluña (Decreto 30/2015)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Clasificación Anexo *</label>
                    <select className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                      <option value="">Seleccionar...</option>
                      <option value="IA">Anexo I.A (Competencia Generalitat)</option>
                      <option value="IB">Anexo I.B (Competencia Local)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Código HERMES</label>
                    <input
                      type="text"
                      placeholder="Se generará automáticamente"
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm bg-amber-50"
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">4.1 Inventario de Medios Materiales</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Medio</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Tipo</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Cantidad</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Última Revisión</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">
                        <span className="px-1.5 py-0.5 bg-halo-emerald/20 text-halo-emerald text-[10px] rounded">
                          IA
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 bg-halo-emerald/5">
                      <td className="py-2 px-3">Extintores</td>
                      <td className="py-2 px-3">{datosExtraidosMock.mantenimiento.extintores.tipo}</td>
                      <td className="py-2 px-3">{datosExtraidosMock.mantenimiento.extintores.cantidad}</td>
                      <td className="py-2 px-3">{datosExtraidosMock.mantenimiento.extintores.ultimaRevision}</td>
                      <td className="py-2 px-3">
                        <Sparkles size={14} className="text-halo-emerald" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-halo-emerald/5">
                      <td className="py-2 px-3">BIEs</td>
                      <td className="py-2 px-3">{datosExtraidosMock.mantenimiento.bies.tipo}</td>
                      <td className="py-2 px-3">{datosExtraidosMock.mantenimiento.bies.cantidad}</td>
                      <td className="py-2 px-3">{datosExtraidosMock.mantenimiento.bies.ultimaRevision}</td>
                      <td className="py-2 px-3">
                        <Sparkles size={14} className="text-halo-emerald" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-halo-emerald/5">
                      <td className="py-2 px-3">Central Detección</td>
                      <td className="py-2 px-3">{datosExtraidosMock.mantenimiento.deteccion.central}</td>
                      <td className="py-2 px-3">{datosExtraidosMock.mantenimiento.deteccion.detectores} detectores</td>
                      <td className="py-2 px-3">{datosExtraidosMock.mantenimiento.deteccion.ultimaRevision}</td>
                      <td className="py-2 px-3">
                        <Sparkles size={14} className="text-halo-emerald" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* 3.1 Elementos peligrosos */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">3.1 Descripción y Localización de Elementos Peligrosos</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Instalación</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Ubicación</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Características</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Riesgo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 bg-halo-emerald/5">
                      <td className="py-2 px-3">Centro de Transformación</td>
                      <td className="py-2 px-3">Sótano - Sala CT</td>
                      <td className="py-2 px-3">630 kVA</td>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Alto</span></td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-halo-emerald/5">
                      <td className="py-2 px-3">Caldera Gas Natural</td>
                      <td className="py-2 px-3">Cubierta - Sala Calderas</td>
                      <td className="py-2 px-3">150 kW</td>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">Medio</span></td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Depósito Gasoil</td>
                      <td className="py-2 px-3">Exterior - Zona carga</td>
                      <td className="py-2 px-3">5.000 L</td>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">Medio</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3.2 Riesgos propios y externos */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">3.2 Identificación de Riesgos</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-2">
                    <Flame size={14} className="text-red-500" />
                    Riesgos Propios
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">• Incendio en zona de producción</li>
                    <li className="flex items-center gap-2">• Explosión en sala de calderas</li>
                    <li className="flex items-center gap-2">• Derrame de productos químicos</li>
                    <li className="flex items-center gap-2">• Fallo eléctrico</li>
                  </ul>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-2">
                    <AlertCircle size={14} className="text-blue-500" />
                    Riesgos Externos
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">• Inundación (Riesgo bajo)</li>
                    <li className="flex items-center gap-2">• Incendio forestal (No aplica)</li>
                    <li className="flex items-center gap-2">• Accidente en vía pública</li>
                    <li className="flex items-center gap-2">• Emergencia en instalación vecina</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3.3 Evaluación */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">3.3 Evaluación de Riesgos</h4>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { riesgo: 'Incendio', prob: 'Media', sev: 'Alta', nivel: 'Alto' },
                  { riesgo: 'Explosión', prob: 'Baja', sev: 'Muy Alta', nivel: 'Medio' },
                  { riesgo: 'Derrame', prob: 'Media', sev: 'Media', nivel: 'Medio' },
                  { riesgo: 'Inundación', prob: 'Baja', sev: 'Baja', nivel: 'Bajo' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                    <p className="font-semibold text-gray-700 text-sm">{item.riesgo}</p>
                    <p className="text-xs text-gray-500 mt-1">P: {item.prob} / S: {item.sev}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold ${
                      item.nivel === 'Alto' ? 'bg-red-100 text-red-700' :
                      item.nivel === 'Medio' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>{item.nivel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* 5.1 Mantenimiento preventivo */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">5.1 Programa de Mantenimiento Preventivo</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Instalación</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Periodicidad</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Responsable</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Última</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Próxima</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Extintores</td>
                      <td className="py-2 px-3">Trimestral</td>
                      <td className="py-2 px-3">Securitas Direct</td>
                      <td className="py-2 px-3">15/09/2024</td>
                      <td className="py-2 px-3 text-halo-cyan font-medium">15/12/2024</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">BIEs</td>
                      <td className="py-2 px-3">Trimestral</td>
                      <td className="py-2 px-3">Securitas Direct</td>
                      <td className="py-2 px-3">15/09/2024</td>
                      <td className="py-2 px-3 text-halo-cyan font-medium">15/12/2024</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Detección incendios</td>
                      <td className="py-2 px-3">Semestral</td>
                      <td className="py-2 px-3">Notifier España</td>
                      <td className="py-2 px-3">20/08/2024</td>
                      <td className="py-2 px-3 text-halo-cyan font-medium">20/02/2025</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Alumbrado emergencia</td>
                      <td className="py-2 px-3">Anual</td>
                      <td className="py-2 px-3">Mantenimiento interno</td>
                      <td className="py-2 px-3">01/03/2024</td>
                      <td className="py-2 px-3 text-halo-cyan font-medium">01/03/2025</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Grupo electrógeno</td>
                      <td className="py-2 px-3">Mensual</td>
                      <td className="py-2 px-3">Mantenimiento interno</td>
                      <td className="py-2 px-3">01/12/2024</td>
                      <td className="py-2 px-3 text-halo-cyan font-medium">01/01/2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5.2 Inspecciones */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">5.2 Inspecciones de Seguridad</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 text-sm mb-2">Inspección OCA</h5>
                  <p className="text-sm text-gray-600">Periodicidad: Cada 5 años</p>
                  <p className="text-sm text-gray-600">Última: 15/06/2022</p>
                  <p className="text-sm text-halo-cyan font-medium">Próxima: 15/06/2027</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 text-sm mb-2">Revisión RIPCI</h5>
                  <p className="text-sm text-gray-600">Periodicidad: Anual</p>
                  <p className="text-sm text-gray-600">Última: 15/09/2024</p>
                  <p className="text-sm text-halo-cyan font-medium">Próxima: 15/09/2025</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* 6.1 Clasificación de emergencias */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">6.1 Clasificación de Emergencias</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h5 className="font-semibold text-yellow-800 text-sm mb-2">Conato de Emergencia</h5>
                  <p className="text-xs text-yellow-700">Incidente que puede ser controlado de forma sencilla por el personal presente.</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h5 className="font-semibold text-orange-800 text-sm mb-2">Emergencia Parcial</h5>
                  <p className="text-xs text-orange-700">Requiere actuación de equipos de emergencia. Evacuación parcial.</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h5 className="font-semibold text-red-800 text-sm mb-2">Emergencia General</h5>
                  <p className="text-xs text-red-700">Requiere evacuación total y ayuda externa.</p>
                </div>
              </div>
            </div>

            {/* 6.3 Organigrama */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">6.3 Organigrama de Emergencias</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Users size={24} className="text-red-600" />
                  </div>
                  <h5 className="font-semibold text-red-800 text-sm">Jefe de Emergencia</h5>
                  <p className="text-xs text-red-600 mb-2">Máxima autoridad</p>
                  <div className="p-2 bg-white rounded border border-red-200 text-xs font-medium text-gray-700">
                    Carlos Martínez García
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Shield size={24} className="text-orange-600" />
                  </div>
                  <h5 className="font-semibold text-orange-800 text-sm">Jefe de Intervención</h5>
                  <p className="text-xs text-orange-600 mb-2">Coordina equipos</p>
                  <div className="p-2 bg-white rounded border border-orange-200 text-xs font-medium text-gray-700">
                    Ana López Fernández
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Flame size={24} className="text-yellow-600" />
                  </div>
                  <h5 className="font-semibold text-yellow-800 text-sm">EPI (4 personas)</h5>
                  <p className="text-xs text-yellow-600 mb-2">Primera Intervención</p>
                  <div className="p-2 bg-white rounded border border-yellow-200 text-xs text-gray-600">
                    Ver listado completo
                  </div>
                </div>
              </div>
            </div>

            {/* 6.4 Procedimientos */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">6.4 Procedimientos de Actuación</h4>
              <div className="space-y-2">
                {[
                  { paso: 1, accion: 'Detección de la emergencia', resp: 'Cualquier persona' },
                  { paso: 2, accion: 'Comunicación al Centro de Control', resp: 'Descubridor' },
                  { paso: 3, accion: 'Activación de alarma', resp: 'Centro de Control' },
                  { paso: 4, accion: 'Evaluación de la situación', resp: 'Jefe de Emergencia' },
                  { paso: 5, accion: 'Intervención / Evacuación', resp: 'Equipos de emergencia' },
                  { paso: 6, accion: 'Llamada a servicios externos', resp: 'Centro de Control' },
                ].map((item) => (
                  <div key={item.paso} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-halo-cyan/20 flex items-center justify-center text-halo-cyan font-bold text-sm">
                      {item.paso}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{item.accion}</p>
                      <p className="text-xs text-gray-500">Responsable: {item.resp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            {/* 7.1 Protocolos de notificación */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">7.1 Protocolos de Notificación</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    Emergencias (112)
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">• Identificarse y dar ubicación exacta</p>
                    <p className="text-gray-600">• Describir tipo de emergencia</p>
                    <p className="text-gray-600">• Indicar número de afectados</p>
                    <p className="text-gray-600">• Seguir instrucciones del operador</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-blue-500" />
                    Bomberos
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700 font-medium">080 (Barcelona)</p>
                    <p className="text-gray-600">Parque: Zona Franca</p>
                    <p className="text-gray-600">Tiempo estimado: 8-10 min</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 7.2 Coordinación */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">7.2 Coordinación con Planes Externos</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Plan</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Ámbito</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Activación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">PROCICAT</td>
                      <td className="py-2 px-3">Cataluña</td>
                      <td className="py-2 px-3">Emergencias graves</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">PLASEQCAT</td>
                      <td className="py-2 px-3">Cataluña</td>
                      <td className="py-2 px-3">Accidentes químicos</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Plan Municipal Barcelona</td>
                      <td className="py-2 px-3">Local</td>
                      <td className="py-2 px-3">Emergencias locales</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            {/* 8.1 Responsable */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">8.1 Responsable de la Implantación</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    defaultValue="Carlos Martínez García"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Cargo</label>
                  <input
                    type="text"
                    defaultValue="Director de Operaciones"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 8.2 Programa de formación */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">8.2 Programa de Formación</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Curso</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Destinatarios</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Duración</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Periodicidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Formación básica emergencias</td>
                      <td className="py-2 px-3">Todo el personal</td>
                      <td className="py-2 px-3">2 horas</td>
                      <td className="py-2 px-3">Anual</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Uso de extintores y BIEs</td>
                      <td className="py-2 px-3">EPI</td>
                      <td className="py-2 px-3">4 horas</td>
                      <td className="py-2 px-3">Anual</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Primeros auxilios</td>
                      <td className="py-2 px-3">EPA</td>
                      <td className="py-2 px-3">8 horas</td>
                      <td className="py-2 px-3">Bienal</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Dirección de emergencias</td>
                      <td className="py-2 px-3">JE / JI</td>
                      <td className="py-2 px-3">8 horas</td>
                      <td className="py-2 px-3">Bienal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 8.3 Simulacros */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">8.3 Programa de Ejercicios y Simulacros</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-halo-cyan">1</p>
                  <p className="text-sm text-gray-600">Simulacro general/año</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-halo-cyan">2</p>
                  <p className="text-sm text-gray-600">Ejercicios parciales/año</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-halo-cyan">4</p>
                  <p className="text-sm text-gray-600">Prácticas de evacuación/año</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-halo-cyan/10 rounded-lg">
                <p className="text-sm text-gray-700"><strong>Próximo simulacro:</strong> 20/02/2025</p>
                <p className="text-sm text-gray-600">Tipo: Evacuación general por incendio en zona de producción</p>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            {/* 9.1 Reciclaje formación */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">9.1 Programa de Reciclaje de Formación</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 text-sm mb-2">Personal General</h5>
                  <p className="text-sm text-gray-600">Reciclaje anual de 2 horas</p>
                  <p className="text-sm text-gray-600">Última sesión: 15/03/2024</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 text-sm mb-2">Equipos de Emergencia</h5>
                  <p className="text-sm text-gray-600">Reciclaje semestral de 4 horas</p>
                  <p className="text-sm text-gray-600">Última sesión: 10/09/2024</p>
                </div>
              </div>
            </div>

            {/* 9.2 Sustitución de medios */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">9.2 Programa de Sustitución de Medios</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Medio</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Vida útil</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Instalación</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Sustitución</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Extintores polvo</td>
                      <td className="py-2 px-3">20 años</td>
                      <td className="py-2 px-3">2015</td>
                      <td className="py-2 px-3">2035</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Extintores CO2</td>
                      <td className="py-2 px-3">20 años</td>
                      <td className="py-2 px-3">2018</td>
                      <td className="py-2 px-3">2038</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Mangueras BIE</td>
                      <td className="py-2 px-3">20 años</td>
                      <td className="py-2 px-3">2015</td>
                      <td className="py-2 px-3">2035</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 9.4 Revisión del Plan */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-vitaly-azul mb-4">9.4 Programa de Revisión del Plan</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">Revisión ordinaria</p>
                    <p className="text-xs text-gray-500">Actualización anual del PAU</p>
                  </div>
                  <span className="px-3 py-1 bg-halo-cyan/10 text-halo-cyan text-xs font-semibold rounded">Cada año</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">Revisión extraordinaria</p>
                    <p className="text-xs text-gray-500">Tras cambios significativos o incidentes</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">Según necesidad</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">Renovación completa</p>
                    <p className="text-xs text-gray-500">Revisión integral del documento</p>
                  </div>
                  <span className="px-3 py-1 bg-halo-emerald/10 text-halo-emerald text-xs font-semibold rounded">Cada 3 años</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center text-gray-500">
            <ClipboardList size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Contenido del capítulo {chapterId} en desarrollo.</p>
            <p className="text-sm mt-2">Este es un mockup visual del formulario.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
        <h3 className="text-lg font-bold text-vitaly-azul mb-2 flex items-center gap-2">
          <ClipboardList size={20} className="text-halo-cyan" />
          Datos del Plan de Autoprotección
        </h3>
        <p className="text-gray-600 text-sm">
          Estructura según <span className="font-semibold">{normativa.norma}</span> - {normativa.nombre}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar de capítulos */}
        <div className="col-span-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h4 className="font-semibold text-vitaly-azul text-sm">Capítulos del PAU</h4>
              <p className="text-xs text-gray-500">RD 393/2007 - Anexo II</p>
            </div>
            <div className="divide-y divide-gray-100">
              {capitulosPAU.map((cap) => {
                const Icon = chapterIcons[cap.id] || ClipboardList;
                const isActive = activeChapter === cap.id;

                return (
                  <button
                    key={cap.id}
                    onClick={() => setActiveChapter(cap.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                      isActive
                        ? 'bg-halo-cyan/10 border-l-4 border-halo-cyan'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-halo-cyan/20' : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        size={16}
                        className={isActive ? 'text-halo-cyan' : 'text-gray-500'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isActive ? 'text-halo-cyan' : 'text-gray-700'
                        }`}
                      >
                        Cap. {cap.id}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{cap.titulo}</p>
                    </div>
                    <ChevronRight
                      size={16}
                      className={isActive ? 'text-halo-cyan' : 'text-gray-400'}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenido del capítulo */}
        <div className="col-span-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-card">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-vitaly-azul">
                  Capítulo {activeChapter}: {capitulosPAU[activeChapter - 1]?.titulo}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {capitulosPAU[activeChapter - 1]?.subcapitulos.length} subcapítulos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-halo-emerald/10 text-halo-emerald text-xs font-semibold rounded flex items-center gap-1">
                  <Sparkles size={12} />
                  Datos IA disponibles
                </span>
              </div>
            </div>
            <div className="p-6">{renderChapterContent(activeChapter)}</div>
          </div>
        </div>
      </div>

      {/* Campos extra regionales */}
      {ccaa === 'galicia' && (
        <div className="bg-halo-cyan/10 rounded-xl border border-halo-cyan/30 p-6">
          <h3 className="text-lg font-bold text-halo-cyan mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Requisitos Galicia (Decreto 171/2010)
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-vitaly-azul mb-3">Certificación de Implantación (Anexo IV)</h4>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-halo-cyan rounded" />
                  <span className="text-sm text-gray-700">
                    Generar documento de Certificación de Implantación
                  </span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-vitaly-azul mb-3">Tasas Administrativas</h4>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Tasa calculada según superficie:</p>
                <p className="text-2xl font-bold text-halo-cyan">245,50 €</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {ccaa === 'madrid' && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Formularios RDPA Madrid
          </h3>
          <p className="text-sm text-blue-600 mb-4">
            Se generarán automáticamente los Formularios 0 a 5 requeridos por el RDPA de Madrid.
          </p>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className="px-3 py-1 bg-white border border-blue-200 rounded-lg text-sm text-blue-700"
              >
                Formulario {num}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

