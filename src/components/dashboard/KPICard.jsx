import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

export default function KPICard({
  titulo,
  valor,
  subtitulo,
  icono: Icon,
  tendencia,
  porcentaje,
  alerta,
  colorIcono = 'text-vitaly-azul',
  bgIcono = 'bg-vitaly-azul/10',
}) {
  const getTendenciaIcon = () => {
    if (tendencia === 'up') return <TrendingUp size={14} className="text-vitaly-success" />;
    if (tendencia === 'down') return <TrendingDown size={14} className="text-vitaly-danger" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  return (
    <div className="bg-white border border-vitaly-gris-oscuro/20 rounded-xl p-5 hover:shadow-card-hover hover:border-vitaly-azul/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgIcono} group-hover:scale-110 transition-transform`}
        >
          <Icon size={20} className={colorIcono} />
        </div>
        {alerta && (
          <div className="flex items-center gap-1 px-2 py-1 bg-vitaly-warning/10 rounded-full">
            <AlertTriangle size={12} className="text-vitaly-warning" />
            <span className="text-xs font-semibold text-vitaly-warning">{alerta}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{titulo}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-vitaly-azul">{valor}</span>
          {porcentaje !== undefined && (
            <span className="text-sm text-gray-500 font-medium">/ {porcentaje}%</span>
          )}
        </div>
        {subtitulo && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            {tendencia && getTendenciaIcon()}
            <span>{subtitulo}</span>
          </div>
        )}
      </div>
    </div>
  );
}
