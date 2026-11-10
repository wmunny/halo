import React, { useState } from 'react';
import {
  FileText,
  Upload,
  ClipboardList,
  UserCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Scale,
} from 'lucide-react';
import JurisdictionDetector from './JurisdictionDetector';
import DocumentDropzone from './DocumentDropzone';
import AdaptiveForm from './AdaptiveForm';
import ValidationChecklist from './ValidationChecklist';
import { normativasPorCCAA } from '../../data/legalMockData';

const steps = [
  { id: 1, nombre: 'Proyecto', icono: FileText, descripcion: 'Datos básicos y jurisdicción' },
  { id: 2, nombre: 'Documentos', icono: Upload, descripcion: 'Subida de documentación' },
  { id: 3, nombre: 'Datos PAU', icono: ClipboardList, descripcion: 'Información del plan' },
  { id: 4, nombre: 'Verificación', icono: UserCheck, descripcion: 'Revisión técnica' },
  { id: 5, nombre: 'Generación', icono: CheckCircle, descripcion: 'Validación y generación' },
];

// Datos pre-rellenados para demo (Planta Industrial Barcelona)
const datosPreRellenados = {
  nombre: 'PAU Planta Industrial Barcelona',
  direccion: 'Polígono Industrial Zona Franca, Sector B, Nave 12',
  codigoPostal: '08040',
  ciudad: 'Barcelona',
  ccaa: 'cataluna',
  normativa: normativasPorCCAA.cataluna,
};

// Documentos pre-procesados para demo
const documentosPreProcesados = [
  { id: 'licencia', file: { name: 'Licencia_Actividad_2024.pdf' }, procesado: true },
  { id: 'mantenimiento', file: { name: 'Certificados_RIPCI_2024.pdf' }, procesado: true },
  { id: 'boletines', file: { name: 'Boletines_Instalaciones.pdf' }, procesado: true },
  { id: 'catastro', file: { name: 'Referencia_Catastral.pdf' }, procesado: true },
  { id: 'rrhh', file: { name: 'Acércate Empresa - Sincronizado' }, procesado: true },
];

export default function LegalModule({ centroActual }) {
  // Iniciar con datos pre-rellenados para navegación rápida
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState(datosPreRellenados);
  const [documentosSubidos, setDocumentosSubidos] = useState(documentosPreProcesados);
  const [datosExtraidos, setDatosExtraidos] = useState({});

  const handleProjectDataChange = (data) => {
    setProjectData((prev) => ({ ...prev, ...data }));
  };

  const handleDocumentUpload = (docId, file) => {
    setDocumentosSubidos((prev) => [...prev, { id: docId, file, procesado: false }]);
    // Simular procesamiento después de 2 segundos
    setTimeout(() => {
      setDocumentosSubidos((prev) =>
        prev.map((doc) => (doc.id === docId ? { ...doc, procesado: true } : doc))
      );
    }, 2000);
  };

  const canProceed = () => {
    // Con datos pre-rellenados, siempre se puede avanzar
    return true;
  };

  // Permitir navegación libre a cualquier paso (demo mode)
  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <JurisdictionDetector
            projectData={projectData}
            onDataChange={handleProjectDataChange}
          />
        );
      case 2:
        return (
          <DocumentDropzone
            centroId={centroActual}
            documentosSubidos={documentosSubidos}
            onUpload={handleDocumentUpload}
          />
        );
      case 3:
        return (
          <AdaptiveForm
            ccaa={projectData.ccaa}
            datosExtraidos={datosExtraidos}
          />
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
              <h3 className="text-lg font-bold text-vitaly-azul mb-4 flex items-center gap-2">
                <UserCheck size={20} className="text-halo-cyan" />
                Verificación del Técnico
              </h3>
              <p className="text-gray-600 mb-6">
                Revisa los datos extraídos y añade observaciones de la inspección visual.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-halo-cyan/5 rounded-lg border border-halo-cyan/20">
                  <h4 className="font-semibold text-vitaly-azul mb-2">Observaciones de Campo</h4>
                  <textarea
                    className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
                    placeholder="Añade observaciones sobre la inspección visual: estado de las vías de evacuación, señalización, deficiencias detectadas..."
                  />
                </div>

                <div className="p-4 bg-halo-emerald/5 rounded-lg border border-halo-emerald/20">
                  <h4 className="font-semibold text-vitaly-azul mb-2">Verificación de Realidad vs Planos</h4>
                  <div className="space-y-2">
                    {[
                      'Salidas de emergencia accesibles y sin obstáculos',
                      'Señalización de evacuación visible y correcta',
                      'Extintores en ubicaciones según plano',
                      'BIEs accesibles y operativas',
                      'Alumbrado de emergencia funcional',
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-halo-emerald rounded" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <ValidationChecklist
            ccaa={projectData.ccaa}
            projectData={projectData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vitaly-azul flex items-center gap-3">
            <FileText size={28} className="text-vitaly-azul" />
            Halo Logic
          </h1>
          <p className="text-gray-500 mt-1">Generación del PAU con IA y análisis normativo</p>
        </div>
        {projectData.nombre && (
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-card">
            <p className="text-xs text-gray-500">Proyecto actual</p>
            <p className="font-semibold text-gray-800">{projectData.nombre}</p>
          </div>
        )}
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-card">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icono;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-vitaly-azul-10 border border-halo-cyan/30'
                      : isCompleted
                      ? 'bg-halo-emerald/10 hover:bg-halo-emerald/20'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-vitaly-azul text-white'
                        : isCompleted
                        ? 'bg-halo-emerald text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p
                      className={`text-sm font-semibold ${
                        isActive ? 'text-halo-cyan' : isCompleted ? 'text-halo-emerald' : 'text-gray-500'
                      }`}
                    >
                      {step.nombre}
                    </p>
                    <p className="text-xs text-gray-400">{step.descripcion}</p>
                  </div>
                </button>
                {!isLast && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      isCompleted ? 'bg-halo-emerald' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">{renderStepContent()}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 shadow-card">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={18} />
          Anterior
        </button>

        <div className="flex items-center gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentStep === step.id
                  ? 'bg-halo-cyan'
                  : currentStep > step.id
                  ? 'bg-halo-emerald'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {currentStep < 5 ? (
          <button
            onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              canProceed()
                ? 'bg-vitaly-azul text-white hover:bg-vitaly-azul-hover'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Siguiente
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold bg-vitaly-azul text-white hover:bg-vitaly-azul-hover transition-all"
          >
            <FileText size={18} />
            Generar PAU
          </button>
        )}
      </div>
    </div>
  );
}

