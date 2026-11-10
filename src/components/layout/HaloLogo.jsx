import React from 'react';

/**
 * Marca de Vítaly Halo, con el estilo de los iconos de producto de Vítaly Workspace
 * (formas geométricas planas en azul corporativo y amarillo): un halo (anillo grueso)
 * partido en un arco azul y un arco amarillo.
 */
export function HaloMark({ size = 32, className = '' }) {
  // Circunferencia de r=15: 94,25. Arco azul ~245°, arco amarillo ~85°, con dos cortes.
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g transform="rotate(-20 24 24)" fill="none" strokeWidth="8.5">
        <circle cx="24" cy="24" r="15" stroke="#002F82" strokeDasharray="64 30.25" />
        <circle cx="24" cy="24" r="15" stroke="#FFB700" strokeDasharray="22 72.25" strokeDashoffset="-68" />
      </g>
    </svg>
  );
}

export default function HaloLogo({ collapsed = false }) {
  if (collapsed) return <HaloMark size={34} />;
  return (
    <div className="flex items-center gap-3">
      <HaloMark size={34} />
      <div className="leading-tight">
        <p className="text-[19px] font-bold text-vitaly-azul tracking-tight">
          <span className="font-light">Vítaly</span> Halo
        </p>
        <p className="text-[11px] text-gray-500">Seguridad orquestada por IA</p>
      </div>
    </div>
  );
}
