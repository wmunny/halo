import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Bell, Settings, Search } from 'lucide-react';

export default function Navbar({ centros, centroActual, onCentroChange, sidebarCollapsed }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const centroSeleccionado = centros.find((c) => c.id === centroActual);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'industrial':
        return '🏭';
      case 'almacen':
        return '📦';
      case 'oficinas':
        return '🏢';
      default:
        return '🏛️';
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-30 transition-all duration-300 shadow-sm ${
        sidebarCollapsed ? 'left-20' : 'left-72'
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Centro selector */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-vitaly-gris-claro transition-colors group"
            >
              <Building2 size={18} className="text-gray-500" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Centro de trabajo</p>
                <p className="text-sm font-semibold text-vitaly-azul">
                  {centroSeleccionado?.nombre || 'Seleccionar centro'}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-dropdown overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar centro..."
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-halo-cyan focus:ring-1 focus:ring-halo-cyan"
                    />
                  </div>
                </div>
                <ul className="py-2 max-h-64 overflow-y-auto">
                  {centros.map((centro) => (
                    <li key={centro.id}>
                      <button
                        onClick={() => {
                          onCentroChange(centro.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                          centro.id === centroActual ? 'bg-halo-cyan/5' : ''
                        }`}
                      >
                        <span className="text-xl">{getTipoIcon(centro.tipo)}</span>
                        <div className="text-left flex-1">
                          <p
                            className={`text-sm font-semibold ${
                              centro.id === centroActual
                                ? 'text-halo-cyan'
                                : 'text-gray-800'
                            }`}
                          >
                            {centro.nombre}
                          </p>
                          <p className="text-xs text-gray-500">{centro.direccion}</p>
                        </div>
                        {centro.id === centroActual && (
                          <div className="w-2 h-2 rounded-full bg-halo-cyan" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-halo-cyan transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-vitaly-danger rounded-full" />
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-halo-cyan transition-colors">
            <Settings size={20} />
          </button>
          <div className="ml-2 pl-4 border-l border-gray-200">
            <div className="w-9 h-9 rounded-full bg-vitaly-amarillo flex items-center justify-center text-sm font-normal text-white">
              JC
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
