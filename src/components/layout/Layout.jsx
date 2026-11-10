import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({
  children,
  sidebarCollapsed,
  onSidebarToggle,
  activeModule,
  onModuleChange,
  centros,
  centroActual,
  onCentroChange,
}) {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={onSidebarToggle}
        activeModule={activeModule}
        onModuleChange={onModuleChange}
      />
      <Navbar
        centros={centros}
        centroActual={centroActual}
        onCentroChange={onCentroChange}
        sidebarCollapsed={sidebarCollapsed}
      />
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'pl-20' : 'pl-72'
        } ${activeModule === 'sim' ? 'p-0' : ''}`}
      >
        <div className={activeModule === 'sim' ? 'h-[calc(100vh-4rem)]' : 'p-6'}>
          {children}
        </div>
      </main>
    </div>
  );
}
