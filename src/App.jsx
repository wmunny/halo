import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import DashboardGrid from './components/dashboard/DashboardGrid';
import LegalModule from './components/legal/LegalModule';
import VisionModule from './components/vision/VisionModule';
import ConnectModule from './components/connect/ConnectModule';
import TrainingModule from './components/training/TrainingModule';
import SimulationModule from './components/sim/SimulationModule';
import { centrosTrabajo, kpisPorCentro } from './data/mockData';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [centroActual, setCentroActual] = useState(centrosTrabajo[0].id);

  const kpisActuales = kpisPorCentro[centroActual];
  const centroSeleccionado = centrosTrabajo.find((c) => c.id === centroActual);

  const renderModulo = () => {
    switch (activeModule) {
      case 'legal':
        return <LegalModule centroActual={centroActual} />;
      case 'vision':
        return <VisionModule />;
      case 'sim':
        return <SimulationModule centroActual={centroActual} centro={centroSeleccionado} />;
      case 'connect':
        return <ConnectModule />;
      case 'training':
        return <TrainingModule centroActual={centroActual} />;
      case 'dashboard':
      default:
        return <DashboardGrid kpis={kpisActuales} centroNombre={centroSeleccionado.nombre} centroData={centroSeleccionado} />;
    }
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      centros={centrosTrabajo}
      centroActual={centroActual}
      onCentroChange={setCentroActual}
    >
      {renderModulo()}
    </Layout>
  );
}
