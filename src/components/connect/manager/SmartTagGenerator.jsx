import React, { useState } from 'react';
import { QrCode, Download, Printer, X, Copy, Check } from 'lucide-react';

export default function SmartTagGenerator({ asset, onClose, onTagAssigned }) {
  const [tagGenerated, setTagGenerated] = useState(false);
  const [tagUrl, setTagUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Generar URL única encriptada para el activo
  const generateSmartTag = () => {
    // Simular generación de UUID y URL encriptada
    const uuid = `550e8400-e29b-41d4-a716-${asset.id.replace(/-/g, '').substring(0, 12)}`;
    const encryptedUrl = `https://connect.halo.example/asset/${uuid}`;
    setTagUrl(encryptedUrl);
    setTagGenerated(true);
    
    // Actualizar activo con el QR code
    if (onTagAssigned) {
      onTagAssigned(asset.id, uuid, encryptedUrl);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tagUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    // Simular impresión de etiqueta
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-vitaly-azul">Smart Tag - {asset.nombre}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {!tagGenerated ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-700 mb-2">Etiqueta Inteligente Halo</h4>
              <p className="text-sm text-blue-600">
                Esta etiqueta QR creará un vínculo físico-digital único entre el activo y su gemelo digital en Halo.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500">Activo:</div>
              <div className="text-gray-900 font-semibold">{asset.nombre} ({asset.id})</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500">Ubicación:</div>
              <div className="text-gray-900">{asset.ubicacion} - {asset.sector}</div>
            </div>

            <button
              onClick={generateSmartTag}
              className="w-full py-3 px-4 bg-vitaly-azul hover:bg-vitaly-azul-hover text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <QrCode size={20} />
              Generar Smart Tag
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview de la etiqueta */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">HALO ID</div>
                  <div className="w-48 h-48 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-gray-200">
                    <QrCode size={120} className="text-gray-800" />
                  </div>
                  <div className="mt-3 text-lg font-bold text-gray-900">{asset.id}</div>
                  <div className="text-xs text-gray-500 mt-1">{asset.nombre}</div>
                </div>
              </div>
            </div>

            {/* Información técnica */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-2">URL Única:</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded text-vitaly-azul font-semibold text-xs break-all">
                  {tagUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors border border-gray-200"
                  title="Copiar URL"
                >
                  {copied ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-700 mb-2">Instrucciones de Uso:</h4>
              <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
                <li>Imprime esta etiqueta en vinilo de alta resistencia</li>
                <li>Pega la etiqueta en el cuerpo del activo (extintor, BIE, puerta)</li>
                <li>Escanea el QR con la app móvil para crear el vínculo</li>
                <li>El vínculo es permanente y único para este activo</li>
              </ol>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 px-4 bg-halo-cyan hover:bg-halo-cyan-dark text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Imprimir Etiqueta
              </button>
              <button
                onClick={() => {
                  // Simular descarga de PDF
                  const link = document.createElement('a');
                  link.href = '#';
                  link.download = `halo-tag-${asset.id}.pdf`;
                  link.click();
                }}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-200"
              >
                <Download size={18} />
                Descargar PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
