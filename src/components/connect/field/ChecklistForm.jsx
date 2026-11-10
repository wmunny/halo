import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { getChecklistForAsset } from '../../../data/connectMockData';

export default function ChecklistForm({ asset, onChecklistChange }) {
  const checklistItems = getChecklistForAsset(asset.tipo);
  const [checklist, setChecklist] = useState({});
  const [nonConformities, setNonConformities] = useState({});

  const handleCheck = (itemId, value) => {
    const newChecklist = { ...checklist, [itemId]: value };
    setChecklist(newChecklist);
    onChecklistChange(newChecklist);
  };

  const handleNonConformity = (itemId, isNonConformity) => {
    const newNonConformities = { ...nonConformities, [itemId]: isNonConformity };
    setNonConformities(newNonConformities);
    
    if (isNonConformity) {
      onChecklistChange({ ...checklist, [itemId]: false }, itemId);
    }
  };

  const isItemRelevant = (item) => {
    if (asset.tipo === 'extintor') {
      if (item.soloCO2 && !asset.ripci.tipo?.includes('CO2')) return false;
      if (item.soloPolvo && !asset.ripci.tipo?.includes('Polvo')) return false;
    }
    return true;
  };

  const relevantItems = checklistItems.filter(isItemRelevant);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-vitaly-azul">Checklist</h3>
      
      {relevantItems.slice(0, 4).map((item) => (
        <div
          key={item.id}
          className={`p-2 rounded-lg border ${
            nonConformities[item.id]
              ? 'bg-red-50 border-red-200'
              : checklist[item.id]
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <label className="text-gray-900 flex-1 cursor-pointer text-xs">
              {item.label}
              {item.obligatorio && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="flex items-center gap-1.5">
              {/* Botón No Conforme */}
              <button
                onClick={() => handleNonConformity(item.id, !nonConformities[item.id])}
                className={`p-1 rounded transition-colors ${
                  nonConformities[item.id]
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                }`}
                title="No conforme"
              >
                <X size={12} />
              </button>
              
              {/* Checkbox Conforme */}
              {!nonConformities[item.id] && (
                <button
                  onClick={() => handleCheck(item.id, !checklist[item.id])}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    checklist[item.id]
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {checklist[item.id] && <Check size={12} className="text-white" />}
                </button>
              )}
            </div>
          </div>
          
          {nonConformities[item.id] && (
            <div className="mt-1.5 p-1.5 bg-red-100 rounded text-[9px] text-red-600">
              ⚠️ No conformidad - Ticket generado
            </div>
          )}
        </div>
      ))}

      {relevantItems.length > 4 && (
        <div className="text-center text-[10px] text-gray-500">
          +{relevantItems.length - 4} items más
        </div>
      )}
    </div>
  );
}
