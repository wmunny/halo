import React, { useState } from 'react';
import { Camera, Loader, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { iaValidationScenarios } from '../../../data/connectMockData';

export default function IAValidation({ asset, validationType, onValidationComplete }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'analyzing' | 'success' | 'error' | 'fraude'
  const [result, setResult] = useState(null);

  const getScenario = () => {
    const scenarios = iaValidationScenarios[validationType];
    if (!scenarios) return null;
    
    const assetIndex = parseInt(asset.id.split('-')[1]) || 0;
    if (assetIndex % 3 === 0) return scenarios.ok;
    if (assetIndex % 3 === 1) return scenarios.error || scenarios.fraude;
    return scenarios.fraude || scenarios.error;
  };

  const handleValidate = async () => {
    setStatus('analyzing');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const scenario = getScenario();
    if (scenario) {
      setResult(scenario);
      setStatus(scenario.resultado);
      onValidationComplete(scenario);
    } else {
      setResult({ resultado: 'error', mensaje: 'No soportado', bloqueado: false });
      setStatus('error');
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'fraude':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-white border-gray-200 text-gray-700';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle2 size={14} className="text-green-600" />;
      case 'error':
        return <AlertTriangle size={14} className="text-amber-600" />;
      case 'fraude':
        return <XCircle size={14} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getButtonLabel = () => {
    switch (validationType) {
      case 'manometro':
        return '📷 Foto Manómetro';
      case 'etiqueta':
        return '📷 Foto Etiqueta';
      case 'entorno':
        return '📷 Foto Entorno';
      case 'geofencing':
        return '📍 Verificar GPS';
      default:
        return 'Validar';
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-vitaly-azul">Validación IA</h3>
      
      <button
        onClick={handleValidate}
        disabled={status === 'analyzing' || status === 'success'}
        className={`w-full py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 text-xs border ${
          status === 'analyzing'
            ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-not-allowed'
            : status === 'success'
            ? 'bg-green-50 border-green-200 text-green-700 cursor-not-allowed'
            : 'bg-halo-cyan hover:bg-halo-cyan-dark text-white border-halo-cyan'
        }`}
      >
        {status === 'analyzing' ? (
          <>
            <Loader size={14} className="animate-spin" />
            Analizando...
          </>
        ) : status === 'success' ? (
          <>
            {getIcon()}
            <span className="truncate">{result?.mensaje || 'OK'}</span>
          </>
        ) : (
          <>
            <Camera size={14} />
            {getButtonLabel()}
          </>
        )}
      </button>

      {result && status !== 'analyzing' && status !== 'success' && (
        <div className={`p-2 rounded-lg border ${getStatusBg()}`}>
          <div className="flex items-start gap-1.5 text-xs">
            {getIcon()}
            <div className="flex-1">
              <div className="font-semibold">{result.mensaje}</div>
              {result.bloqueado && (
                <div className="text-[9px] mt-0.5 text-red-600">
                  ⚠️ Certificación bloqueada
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
