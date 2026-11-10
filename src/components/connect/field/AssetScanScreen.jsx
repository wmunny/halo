import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import ChecklistForm from './ChecklistForm';
import IAValidation from './IAValidation';
import { assetTypes } from '../../../data/connectMockData';

export default function AssetScanScreen({ asset, workOrder, onBack, onAction, actions }) {
  const [checklist, setChecklist] = useState({});
  const [validations, setValidations] = useState({});
  const [certified, setCertified] = useState(false);
  const [hasNonConformity, setHasNonConformity] = useState(false);

  const handleChecklistChange = (newChecklist, nonConformityItem = null) => {
    setChecklist(newChecklist);
    if (nonConformityItem) {
      setHasNonConformity(true);
      onAction('incidentDetected', asset);
    }
  };

  const handleValidationComplete = (result) => {
    const validationType = asset.tipo === assetTypes.EXTINTOR || asset.tipo === assetTypes.BIE
      ? 'manometro'
      : 'entorno';
    
    setValidations(prev => ({
      ...prev,
      [validationType]: result,
    }));
  };

  const canCertify = () => {
    const requiredItems = asset.tipo === assetTypes.EXTINTOR 
      ? ['precinto', 'manguera', 'senal', 'manometro', 'etiqueta', 'accesibilidad']
      : asset.tipo === assetTypes.BIE
      ? ['presion_estatica', 'presion_dinamica', 'manguera', 'valvula', 'senal', 'manometro']
      : ['cierre_automatico', 'integridad_hoja', 'obstaculos', 'etiqueta', 'cerradura'];
    
    const allRequiredChecked = requiredItems.every(item => checklist[item] === true);
    const hasFraude = Object.values(validations).some(v => v?.bloqueado === true);
    
    return allRequiredChecked && !hasFraude && !hasNonConformity && !certified;
  };

  const handleCertify = () => {
    if (canCertify()) {
      setCertified(true);
      onAction('certified', asset);
    }
  };

  const getRequiredValidations = () => {
    if (asset.tipo === assetTypes.EXTINTOR || asset.tipo === assetTypes.BIE) {
      return ['manometro'];
    }
    return ['entorno'];
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={onBack}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200"
        >
          <ArrowLeft size={16} className="text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-vitaly-azul truncate">{asset.nombre}</h2>
          <div className="text-[10px] text-gray-500 flex items-center gap-0.5">
            <MapPin size={10} />
            {asset.ubicacion}
          </div>
        </div>
      </div>

      {/* Info del activo */}
      <div className="bg-white rounded-lg border border-gray-200 p-2.5 space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">ID</span>
          <span className="text-gray-900 font-mono text-[10px]">{asset.id}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Sector</span>
          <span className="text-gray-900">{asset.sector}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Última Rev.</span>
          <span className="text-gray-900 flex items-center gap-0.5">
            <Calendar size={10} />
            {asset.ultimaRevision || 'N/A'}
          </span>
        </div>
      </div>

      {/* Checklist */}
      <ChecklistForm 
        asset={asset}
        onChecklistChange={handleChecklistChange}
      />

      {/* Validaciones IA */}
      {getRequiredValidations().map(validationType => (
        <IAValidation
          key={validationType}
          asset={asset}
          validationType={validationType}
          onValidationComplete={handleValidationComplete}
        />
      ))}

      {/* Alerta de no conformidad */}
      {hasNonConformity && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
          <div className="flex items-center gap-1.5 text-red-700 text-xs">
            <AlertTriangle size={14} />
            <span className="font-semibold">No conformidad</span>
          </div>
          <div className="text-[10px] text-red-600 mt-0.5">
            Ticket de correctivo generado
          </div>
        </div>
      )}

      {/* Botón Certificar */}
      <div className="pt-2">
        <button
          onClick={handleCertify}
          disabled={!canCertify() || certified}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
            canCertify() && !certified
              ? 'bg-vitaly-azul hover:bg-vitaly-azul-hover text-white shadow-lg'
              : certified
              ? 'bg-green-50 border-2 border-green-500 text-green-700 cursor-not-allowed'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          {certified ? (
            <span className="flex items-center justify-center gap-1.5">
              <CheckCircle2 size={18} />
              Certificado
            </span>
          ) : (
            'CERTIFICAR'
          )}
        </button>
        
        {!canCertify() && !certified && (
          <p className="text-[9px] text-gray-400 text-center mt-1">
            Complete checklist y validaciones
          </p>
        )}
      </div>
    </div>
  );
}
