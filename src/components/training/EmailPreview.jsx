/**
 * Vista previa del email con Magic Link
 * Diseño profesional para formación PAU
 */

import React from 'react';
import { X, Shield, Clock, GraduationCap, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { emailConfig, documentoLegal } from '../../data/pauContent';
import { generateTrainingToken } from '../../utils/trainingTokenValidator';

export default function EmailPreview({ trabajador, onClose }) {
  const magicLinkToken = trabajador.notificacion?.magicLinkToken || generateTrainingToken();
  const magicLink = `${window.location.origin}/training/accept/${magicLinkToken}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-vitaly-azul">Vista Previa del Email</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido del email */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Email Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-10 w-10 text-vitaly-azul" />
              <div>
                <h2 className="text-xl font-bold">Halo Training</h2>
                <p className="text-sm text-gray-300">Formación en Emergencias y PAU</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Metadata del email */}
            <div className="text-sm text-gray-600 space-y-1 pb-4 border-b border-gray-200">
              <p><strong>De:</strong> {emailConfig.remitente}</p>
              <p><strong>Para:</strong> {trabajador.email}</p>
              <p><strong>Asunto:</strong> {emailConfig.asunto}</p>
            </div>

            {/* Saludo */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl">
              <p className="text-xl">
                {emailConfig.saludo} <strong>{trabajador.nombre}</strong>,
              </p>
              <p className="text-gray-300 mt-2 text-sm">
                Es necesario que completes la formación obligatoria sobre el Plan de Autoprotección de tu centro de trabajo.
              </p>
            </div>

            {/* Contenido */}
            <div className="space-y-4">
              <p className="text-gray-700">
                Como parte de nuestro compromiso con la seguridad laboral, debes completar la formación sobre el 
                <strong> Plan de Autoprotección (PAU)</strong> de tu centro de trabajo.
              </p>

              {/* Tarjetas de contenido */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Instrucciones de Emergencia</h4>
                  </div>
                  <p className="text-sm text-blue-700">Incendio, emergencia médica, amenaza de bomba</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Plan de Evacuación</h4>
                  </div>
                  <p className="text-sm text-green-700">Rutas, punto de reunión, confinamiento</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">Microlearning</h4>
                  </div>
                  <p className="text-sm text-purple-700">4 vídeos formativos interactivos</p>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-900">Quiz de Validación</h4>
                  </div>
                  <p className="text-sm text-amber-700">3 preguntas para verificar comprensión</p>
                </div>
              </div>

              {/* Expiración */}
              <div className="flex items-center gap-2 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Clock className="h-5 w-5 text-orange-600" />
                <p className="text-sm text-orange-700">
                  <strong>Importante:</strong> Este enlace expira en {emailConfig.expiracion}. Completa la formación antes de que caduque.
                </p>
              </div>

              {/* Botón CTA */}
              <div className="text-center py-4">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-vitaly-azul text-white font-bold text-lg rounded-xl hover:bg-vitaly-azul-hover transition-colors shadow-lg">
                  <GraduationCap size={24} />
                  Completar Formación PAU
                  <ExternalLink size={20} />
                </button>
              </div>

              {/* Magic Link para demo */}
              <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-700 mb-2 text-sm">🔗 Magic Link (para demo):</p>
                <p className="text-xs text-gray-500 break-all font-mono bg-white p-2 rounded border">
                  {magicLink}
                </p>
              </div>

              {/* Despedida */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {emailConfig.despedida}
                </p>
              </div>
            </div>
          </div>

          {/* Footer del email */}
          <div className="bg-gray-100 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Shield size={14} />
                <span>Versión PAU: {documentoLegal.version}</span>
              </div>
              <span>© 2024 Vitaly Seguridad | Halo Training</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


