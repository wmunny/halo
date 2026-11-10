import React, { useState } from 'react';
import MagicLinkScreen from './MagicLinkScreen';
import WorkRouteScreen from './WorkRouteScreen';
import AssetScanScreen from './AssetScanScreen';

export default function TechnicianMobile({ workOrder, onAction, actions, selectedAsset }) {
  const [currentScreen, setCurrentScreen] = useState('magicLink'); // 'magicLink' | 'workRoute' | 'assetScan'
  const [currentAsset, setCurrentAsset] = useState(null);

  const handleStartRoute = () => {
    setCurrentScreen('workRoute');
  };

  const handleScanAsset = (asset) => {
    setCurrentAsset(asset);
    setCurrentScreen('assetScan');
    onAction('scanned', asset);
  };

  const handleBackToRoute = () => {
    setCurrentScreen('workRoute');
    setCurrentAsset(null);
  };

  const handleBackToStart = () => {
    setCurrentScreen('magicLink');
    setCurrentAsset(null);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-3">
      {/* Marco de iPhone - Más estrecho, proporción 9:19.5 (iPhone moderno) */}
      <div 
        className="relative bg-gray-800 rounded-[2rem] p-[3px] shadow-xl" 
        style={{ 
          width: '240px', 
          maxWidth: '100%',
          height: '100%',
          maxHeight: '520px',
        }}
      >
        {/* Notch/Dynamic Island */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-gray-800 rounded-b-2xl z-10 flex items-center justify-center">
          <div className="w-12 h-3 bg-gray-900 rounded-full"></div>
        </div>
        
        {/* Pantalla */}
        <div className="bg-white rounded-[1.8rem] overflow-hidden h-full w-full flex flex-col">
          {/* Status Bar */}
          <div className="bg-gray-50 px-4 py-1 flex items-center justify-between text-[10px] text-gray-600 border-b border-gray-100">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-2 bg-gray-600 rounded-full"></div>
                <div className="w-0.5 h-2.5 bg-gray-600 rounded-full"></div>
                <div className="w-0.5 h-3 bg-gray-600 rounded-full"></div>
                <div className="w-0.5 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <div className="w-4 h-2 border border-gray-600 rounded-sm ml-1">
                <div className="w-2.5 h-1 bg-gray-600 rounded-sm m-0.5"></div>
              </div>
            </div>
          </div>

          {/* Contenido de la App */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {currentScreen === 'magicLink' && (
              <MagicLinkScreen 
                workOrder={workOrder}
                onStartRoute={handleStartRoute}
              />
            )}
            
            {currentScreen === 'workRoute' && (
              <WorkRouteScreen 
                workOrder={workOrder}
                onScanAsset={handleScanAsset}
                onBack={handleBackToStart}
              />
            )}
            
            {currentScreen === 'assetScan' && currentAsset && (
              <AssetScanScreen 
                asset={currentAsset}
                workOrder={workOrder}
                onBack={handleBackToRoute}
                onAction={onAction}
                actions={actions}
              />
            )}
          </div>

          {/* Home Indicator */}
          <div className="bg-white py-2 flex justify-center">
            <div className="w-24 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
