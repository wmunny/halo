import React from 'react';
import HaloLogo from './HaloLogo';
import {
  LayoutDashboard,
  FileText,
  Activity,
  QrCode,
  GraduationCap,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const iconMap = { LayoutDashboard, FileText, Activity, QrCode, GraduationCap, Eye };

// Módulos de Vítaly Halo agrupados por bloque
export const MODULOS = [
  { id: 'dashboard', nombre: 'Dashboard', subtitulo: 'Visión global', icono: 'LayoutDashboard', bloque: null },
  { id: 'legal', nombre: 'Halo Logic', subtitulo: 'PAU con IA y análisis normativo', icono: 'FileText', bloque: 'Core' },
  { id: 'sim', nombre: 'Halo Sim', subtitulo: 'Gemelo digital y evacuación', icono: 'Activity', bloque: 'Core' },
  { id: 'connect', nombre: 'Halo Connect', subtitulo: 'Mantenimiento de activos (QR, RIPCI)', icono: 'QrCode', bloque: 'Core' },
  { id: 'training', nombre: 'Halo Training', subtitulo: 'Formación y entrega del PAU', icono: 'GraduationCap', bloque: 'Core' },
  { id: 'vision', nombre: 'Halo Vision', subtitulo: 'Visionado de cámaras', icono: 'Eye', bloque: 'Avanzado' },
];

export default function Sidebar({ collapsed, onToggle, activeModule, onModuleChange }) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white transition-all duration-300 z-40 flex flex-col border-r border-gray-200 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Marca: tarjeta pequeña como los productos de Vítaly Workspace */}
      <div className={`h-16 flex items-center border-b border-gray-200 ${collapsed ? 'justify-center px-3' : 'px-5'}`}>
        <HaloLogo collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {MODULOS.map((modulo, i) => {
            const Icon = iconMap[modulo.icono];
            const isActive = activeModule === modulo.id;
            const nuevoBloque = modulo.bloque && modulo.bloque !== MODULOS[i - 1]?.bloque;

            return (
              <li key={modulo.id}>
                {nuevoBloque && (
                  collapsed
                    ? <div className="mx-3 my-2 border-t border-gray-200" />
                    : <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{modulo.bloque}</p>
                )}
                <button
                  onClick={() => onModuleChange(modulo.id)}
                  className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 group ${
                    isActive
                      ? 'bg-vitaly-azul-10 text-vitaly-azul'
                      : 'text-gray-600 hover:bg-vitaly-gris-claro hover:text-vitaly-azul'
                  }`}
                  title={collapsed ? modulo.nombre : undefined}
                >
                  {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-vitaly-amarillo" />}
                  <Icon
                    size={20}
                    className={`flex-shrink-0 transition-colors ${
                      isActive ? 'text-vitaly-azul' : 'text-gray-400 group-hover:text-vitaly-azul'
                    }`}
                  />
                  {!collapsed && (
                    <div className="flex flex-col items-start text-left">
                      <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                        {modulo.nombre}
                      </span>
                      <span className={`text-[11px] ${isActive ? 'text-vitaly-azul-80' : 'text-gray-400'}`}>
                        {modulo.subtitulo}
                      </span>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with collapse button and branding */}
      <div className="p-3 border-t border-gray-200">
        {!collapsed && (
          <p className="mb-2 text-[11px] text-gray-400 text-center">
            Un producto de <span className="font-semibold text-vitaly-azul">Vítaly</span>
          </p>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-gray-500 hover:bg-vitaly-gris-claro hover:text-vitaly-azul transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-sm">Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
