/**
 * Landing Page de Aceptación PAU
 * Formación completa con información, microlearning, quiz y firma
 */

import { HaloMark } from '../../layout/HaloLogo';
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Flame,
  Heart,
  MapPin,
  Play,
  Lock,
  Loader2,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { 
  instruccionesActuacion, 
  planEvacuacion, 
  fichaRiesgos, 
  modulosMicrolearning,
  modulosIntervencion,
  quizIntervencion,
  documentoLegal,
} from '../../../data/pauContent';
import { getNotificacionByToken, getTrabajadorById, esEquipoIntervencion, etiquetasRolPAU } from '../../../data/trainingMockData';
import { validateNotification, getClientIP, getUserAgent, generateDocumentHash } from '../../../utils/trainingTokenValidator';
import MicrolearningModule from './MicrolearningModule';
import ValidationQuiz from './ValidationQuiz';

export default function PAUAcceptance({ token, onClose, isPreview = false }) {
  // 'info' | 'microlearning' | 'quiz' | 'intervencion' | 'quiz_intervencion' | 'sign' | 'success'
  const [step, setStep] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trabajador, setTrabajador] = useState(null);
  const [notificacion, setNotificacion] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [completedIntervencionModules, setCompletedIntervencionModules] = useState([]);
  const [quizPassed, setQuizPassed] = useState(false);
  const [intervencionQuizPassed, setIntervencionQuizPassed] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    instrucciones: true,
    evacuacion: false,
    riesgos: false,
  });

  // Validar token al cargar
  useEffect(() => {
    const validate = async () => {
      setLoading(true);
      
      // Para demo/preview, usar datos mock
      if (isPreview) {
        setTrabajador({
          id: 'demo',
          nombre: 'Usuario',
          apellidos: 'Demo',
          email: 'demo@empresa-demo.es',
          departamento: 'Demostración',
          puesto: 'Visitante',
        });
        setNotificacion({
          versionPAU: documentoLegal.version,
          magicLinkToken: token,
        });
        setLoading(false);
        return;
      }

      const notif = getNotificacionByToken(token);
      if (!notif) {
        setError('Token inválido o no encontrado');
        setLoading(false);
        return;
      }

      const validation = validateNotification(notif);
      if (!validation.isValid) {
        setError(validation.error);
        setLoading(false);
        return;
      }

      const trab = getTrabajadorById(notif.trabajadorId);
      if (!trab) {
        setError('Trabajador no encontrado');
        setLoading(false);
        return;
      }

      setNotificacion(notif);
      setTrabajador(trab);
      setLoading(false);
    };

    validate();
  }, [token, isPreview]);

  // Manejar completar módulo de microlearning (general)
  const handleModuleComplete = (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  // Manejar completar módulo de microlearning (intervención)
  const handleIntervencionModuleComplete = (moduleId) => {
    if (!completedIntervencionModules.includes(moduleId)) {
      setCompletedIntervencionModules([...completedIntervencionModules, moduleId]);
    }
  };

  // Manejar quiz general completado
  const handleQuizComplete = (score) => {
    const totalGeneralQuestions = 3;
    if (score === totalGeneralQuestions) {
      setQuizPassed(true);
      // Si el trabajador es del equipo de intervención, ir a formación específica
      if (trabajador && esEquipoIntervencion(trabajador.rolPAU)) {
        setStep('intervencion');
      } else {
        setStep('sign');
      }
    }
  };

  // Manejar quiz de intervención completado
  const handleIntervencionQuizComplete = (score) => {
    if (score > 0) {
      setIntervencionQuizPassed(true);
      setStep('sign');
    }
  };

  // Manejar firma y aceptación
  const handleAccept = async () => {
    if (!isChecked) return;
    
    setIsSubmitting(true);
    
    try {
      const ipAddress = getClientIP();
      const userAgent = getUserAgent();
      const documentHash = generateDocumentHash(documentoLegal.version);
      
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Aceptación registrada:', {
        trabajadorId: trabajador.id,
        timestamp: new Date().toISOString(),
        ipAddress,
        userAgent,
        documentHash,
        versionPAU: documentoLegal.version,
        quizScore: '3/3',
      });
      
      setStep('success');
    } catch (err) {
      console.error('Error al aceptar:', err);
      setIsSubmitting(false);
    }
  };

  // Toggle secciones
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Página de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-vitaly-azul mx-auto mb-4" />
          <p className="text-gray-500">Validando acceso...</p>
        </div>
      </div>
    );
  }

  // Página de error
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-vitaly-azul mb-2">Acceso No Válido</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-vitaly-gris-claro text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Página de éxito
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-vitaly-azul mb-2">¡Formación Completada!</h2>
          <p className="text-gray-500 mb-6">
            Tu aceptación ha sido registrada correctamente. Ahora estás formado en el Plan de Autoprotección
            {trabajador?.rolPAU && esEquipoIntervencion(trabajador.rolPAU) && (
              <span> incluyendo la formación específica como <strong className="text-orange-800">{etiquetasRolPAU[trabajador.rolPAU]}</strong></span>
            )}.
          </p>
          <div className="bg-vitaly-gris-claro rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-500 mb-1">Certificado de Cumplimiento</div>
            <div className="text-gray-900 font-semibold">{trabajador.nombre} {trabajador.apellidos}</div>
            <div className="text-sm text-gray-500">{new Date().toLocaleDateString('es-ES')}</div>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-vitaly-azul text-white font-semibold rounded-lg hover:bg-vitaly-azul-hover transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-500 hover:text-vitaly-azul transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>
            
            <div className="flex items-center gap-3">
              <HaloMark size={32} />
              <div>
                <h1 className="text-lg font-bold text-vitaly-azul">Halo Training</h1>
                <p className="text-xs text-gray-500">Formación PAU - {documentoLegal.version}</p>
              </div>
            </div>

            {isPreview && (
              <span className="px-3 py-1 bg-vitaly-amarillo/20 text-vitaly-azul text-sm font-medium rounded-full">
                Vista Previa
              </span>
            )}
          </div>

          {/* Progress bar */}
          {(() => {
            const isIntervencion = trabajador && esEquipoIntervencion(trabajador.rolPAU);
            const baseSteps = ['info', 'microlearning', 'quiz'];
            const intervencionSteps = isIntervencion ? ['intervencion', 'quiz_intervencion'] : [];
            const allSteps = [...baseSteps, ...intervencionSteps, 'sign'];
            const currentIdx = allSteps.indexOf(step);
            return (
              <div className="flex items-center gap-2 mt-4">
                {allSteps.map((s, idx) => (
                  <div key={s} className="flex-1">
                    <div className={`h-1.5 rounded-full transition-colors ${
                      currentIdx === idx
                        ? 'bg-vitaly-amarillo'
                        : currentIdx > idx
                        ? 'bg-green-500'
                        : s === 'intervencion' || s === 'quiz_intervencion'
                        ? 'bg-orange-900/50'
                        : 'bg-gray-200'
                    }`} />
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Saludo */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-vitaly-azul mb-2">
            Formación en Plan de Autoprotección
          </h2>
          <p className="text-gray-500">
            {trabajador.nombre} {trabajador.apellidos} - {trabajador.departamento}
          </p>
          {trabajador.rolPAU && esEquipoIntervencion(trabajador.rolPAU) && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-orange-500/15 border border-orange-500/40 rounded-full">
              <Shield className="h-4 w-4 text-orange-700" />
              <span className="text-sm font-semibold text-orange-800">
                Equipo de Intervención · {etiquetasRolPAU[trabajador.rolPAU]}
              </span>
            </div>
          )}
        </div>

        {/* Step: Información PAU */}
        {step === 'info' && (
          <div className="space-y-6">
            {/* Instrucciones de Actuación */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('instrucciones')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-vitaly-azul">Instrucciones de Actuación</h3>
                    <p className="text-sm text-gray-500">Incendio, Emergencia Médica, Amenaza</p>
                  </div>
                </div>
                {expandedSections.instrucciones ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
              </button>
              
              {expandedSections.instrucciones && (
                <div className="px-4 pb-4 grid gap-4 md:grid-cols-3">
                  {Object.values(instruccionesActuacion).map((instruccion) => (
                    <div key={instruccion.id} className="bg-vitaly-gris-claro rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {instruccion.id === 'incendio' && <Flame className="h-5 w-5 text-red-500" />}
                        {instruccion.id === 'emergencia_medica' && <Heart className="h-5 w-5 text-blue-500" />}
                        {instruccion.id === 'amenaza_bomba' && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                        <h4 className="font-semibold text-vitaly-azul">{instruccion.titulo}</h4>
                      </div>
                      <ul className="space-y-2">
                        {instruccion.pasos.slice(0, 4).map((paso, idx) => (
                          <li key={idx} className="text-sm text-gray-500 flex items-start gap-2">
                            <span className="text-vitaly-azul">•</span>
                            {paso}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          <strong className="text-vitaly-azul">Teléfono:</strong> {instruccion.telefonoEmergencia}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan de Evacuación */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('evacuacion')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-vitaly-azul">Plan de Evacuación</h3>
                    <p className="text-sm text-gray-500">Rutas, Punto de Reunión, Confinamiento</p>
                  </div>
                </div>
                {expandedSections.evacuacion ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
              </button>
              
              {expandedSections.evacuacion && (
                <div className="px-4 pb-4 space-y-4">
                  <div className="bg-vitaly-gris-claro rounded-lg p-4">
                    <h4 className="font-semibold text-vitaly-azul mb-2">{planEvacuacion.puntoReunion.titulo}</h4>
                    <p className="text-gray-500 mb-3">{planEvacuacion.puntoReunion.descripcion}</p>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-700 font-semibold">{planEvacuacion.puntoReunion.ubicacion}</p>
                    </div>
                  </div>
                  
                  <div className="bg-vitaly-gris-claro rounded-lg p-4">
                    <h4 className="font-semibold text-vitaly-azul mb-2">{planEvacuacion.rutasEvacuacion.titulo}</h4>
                    <ul className="space-y-2">
                      {planEvacuacion.rutasEvacuacion.consejos.map((consejo, idx) => (
                        <li key={idx} className="text-sm text-gray-500 flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-500 mt-0.5" />
                          {consejo}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Ficha de Riesgos */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('riesgos')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-vitaly-azul">Ficha de Riesgos</h3>
                    <p className="text-sm text-gray-500">Riesgos internos y externos del centro</p>
                  </div>
                </div>
                {expandedSections.riesgos ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
              </button>
              
              {expandedSections.riesgos && (
                <div className="px-4 pb-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold text-vitaly-azul mb-3">Riesgos Internos</h4>
                    <div className="space-y-2">
                      {fichaRiesgos.internos.map((riesgo) => (
                        <div key={riesgo.id} className="bg-vitaly-gris-claro rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{riesgo.nombre}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              riesgo.nivelRiesgo === 'alto' ? 'bg-red-500/20 text-red-700' :
                              riesgo.nivelRiesgo === 'medio' ? 'bg-yellow-500/20 text-amber-700' :
                              'bg-green-500/20 text-green-700'
                            }`}>
                              {riesgo.nivelRiesgo}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{riesgo.descripcion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-vitaly-azul mb-3">Riesgos Externos</h4>
                    <div className="space-y-2">
                      {fichaRiesgos.externos.map((riesgo) => (
                        <div key={riesgo.id} className="bg-vitaly-gris-claro rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{riesgo.nombre}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              riesgo.nivelRiesgo === 'alto' ? 'bg-red-500/20 text-red-700' :
                              riesgo.nivelRiesgo === 'medio' ? 'bg-yellow-500/20 text-amber-700' :
                              'bg-green-500/20 text-green-700'
                            }`}>
                              {riesgo.nivelRiesgo}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{riesgo.descripcion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botón continuar */}
            <div className="text-center pt-4">
              <button
                onClick={() => setStep('microlearning')}
                className="px-8 py-3 bg-vitaly-azul text-white font-bold rounded-xl hover:bg-vitaly-azul-hover transition-colors"
              >
                Continuar a Formación en Video
              </button>
            </div>
          </div>
        )}

        {/* Step: Microlearning */}
        {step === 'microlearning' && (
          <MicrolearningModule
            modules={modulosMicrolearning}
            completedModules={completedModules}
            onModuleComplete={handleModuleComplete}
            onContinue={() => setStep('quiz')}
          />
        )}

        {/* Step: Quiz general */}
        {step === 'quiz' && (
          <ValidationQuiz onComplete={handleQuizComplete} />
        )}

        {/* Step: Formación específica Equipo de Intervención */}
        {step === 'intervencion' && trabajador?.rolPAU && (
          <div className="space-y-6">
            {/* Banner de rol */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6 text-orange-700" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-800 text-lg">
                    Formación Específica: {etiquetasRolPAU[trabajador.rolPAU]}
                  </h3>
                  <p className="text-sm text-orange-700/80">
                    Como miembro del Equipo de Intervención, debes completar esta formación adicional según tu rol en el PAU.
                  </p>
                </div>
              </div>
            </div>

            <MicrolearningModule
              modules={modulosIntervencion[trabajador.rolPAU] || []}
              completedModules={completedIntervencionModules}
              onModuleComplete={handleIntervencionModuleComplete}
              onContinue={() => setStep('quiz_intervencion')}
            />
          </div>
        )}

        {/* Step: Quiz de intervención */}
        {step === 'quiz_intervencion' && trabajador?.rolPAU && (
          <div className="space-y-6">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center gap-3">
              <Shield className="h-5 w-5 text-orange-700 shrink-0" />
              <p className="text-sm text-orange-800 font-medium">
                Quiz de validación específico para el rol de <strong>{etiquetasRolPAU[trabajador.rolPAU]}</strong>
              </p>
            </div>
            <ValidationQuiz
              onComplete={handleIntervencionQuizComplete}
              quizData={quizIntervencion[trabajador.rolPAU]}
            />
          </div>
        )}

        {/* Step: Firma */}
        {step === 'sign' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-vitaly-amarillo/20 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-vitaly-azul" />
                </div>
                <div>
                  <h3 className="font-semibold text-vitaly-azul">Firma Digital</h3>
                  <p className="text-sm text-gray-500">Confirma que has comprendido la formación</p>
                </div>
              </div>

              {/* Resumen */}
              <div className="bg-vitaly-gris-claro rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-vitaly-azul mb-3">Resumen de la Formación</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Módulos generales:</span>
                    <span className="text-gray-900 ml-2">{completedModules.length}/{modulosMicrolearning.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Quiz general:</span>
                    <span className="text-green-700 ml-2">3/3 correctas</span>
                  </div>
                  {trabajador?.rolPAU && esEquipoIntervencion(trabajador.rolPAU) && (
                    <>
                      <div>
                        <span className="text-gray-500">Módulos {etiquetasRolPAU[trabajador.rolPAU]}:</span>
                        <span className="text-orange-800 ml-2">
                          {completedIntervencionModules.length}/{(modulosIntervencion[trabajador.rolPAU] || []).length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Quiz intervención:</span>
                        <span className="text-orange-800 ml-2">Superado</span>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-gray-500">Versión PAU:</span>
                    <span className="text-gray-900 ml-2">{documentoLegal.version}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha:</span>
                    <span className="text-gray-900 ml-2">{new Date().toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>

              {/* Cláusula */}
              <div className="bg-vitaly-gris-claro rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {documentoLegal.clausulaAceptacion}
                </p>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-vitaly-amarillo/10 border border-vitaly-amarillo/30 rounded-lg mb-6">
                <input
                  type="checkbox"
                  id="accept"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-vitaly-azul focus:ring-vitaly-amarillo"
                />
                <label htmlFor="accept" className="text-sm text-gray-800 cursor-pointer">
                  He leído, comprendido y acepto la información sobre el Plan de Autoprotección. 
                  Me comprometo a seguir las instrucciones de actuación ante emergencias y a participar 
                  en los simulacros programados.
                </label>
              </div>

              {/* Botón de aceptación */}
              <button
                onClick={handleAccept}
                disabled={!isChecked || isSubmitting}
                className={`w-full py-4 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                  isChecked && !isSubmitting
                    ? 'bg-vitaly-azul text-white hover:bg-vitaly-azul-hover'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Confirmar y Finalizar
                  </>
                )}
              </button>

              {!isChecked && (
                <p className="text-xs text-center text-gray-500 mt-3">
                  Marca la casilla para activar el botón de confirmación
                </p>
              )}
            </div>

            {/* Info de seguridad */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock size={14} />
              <span>Tu aceptación será registrada con hash SHA-256</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


