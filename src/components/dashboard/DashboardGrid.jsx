import React from 'react';
import {
  Eye,
  QrCode,
  GraduationCap,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Info,
  Users,
  Camera,
  Building2,
  MapPin,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PlanStatusCard from './PlanStatusCard';

// Componente de tarjeta de módulo
function ModuleCard({ modulo, titulo, subtitulo, children, borderColor = 'border-halo-cyan' }) {
  const getModuleConfig = (mod) => {
    switch (mod) {
      case 'vision':
        return { icon: <Eye size={20} className="text-vitaly-azul" /> };
      case 'connect':
        return { icon: <QrCode size={20} className="text-vitaly-azul" /> };
      case 'training':
        return { icon: <GraduationCap size={20} className="text-vitaly-azul" /> };
      case 'sim':
        return { icon: <Activity size={20} className="text-vitaly-azul" /> };
      default:
        return { icon: null };
    }
  };

  const config = getModuleConfig(modulo);

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-5 shadow-card hover:shadow-card-hover transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-vitaly-azul-10`}>
          {config.icon}
        </div>
        <div>
          <h3 className="font-bold text-vitaly-azul">{titulo}</h3>
          <p className="text-xs text-gray-500">{subtitulo}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// Componente del indicador circular de cumplimiento
function CumplimientoCircular({ score, evaluacion, desglose }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle size={20} className="text-vitaly-azul" />
        <h3 className="font-bold text-vitaly-azul">Cumplimiento General</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Círculo de progreso */}
        <div className="relative">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#002F82" />
                <stop offset="100%" stopColor="#335999" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-vitaly-azul">{score}%</span>
            <span className="text-xs text-gray-500">Score</span>
          </div>
        </div>

        {/* Desglose */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-halo-emerald" />
            <span className="text-sm font-semibold text-halo-emerald">{evaluacion}</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">Cumplimiento óptimo en todos los módulos</p>
          
          <div className="space-y-2">
            {Object.entries(desglose).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-16 uppercase">{key}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      value >= 90 ? 'bg-vitaly-azul' :
                      value >= 70 ? 'bg-vitaly-amarillo' :
                      'bg-vitaly-danger'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-10 text-right">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de alertas
function AlertasActivas({ alertas }) {
  const getAlertIcon = (tipo) => {
    switch (tipo) {
      case 'danger': return <AlertCircle size={16} className="text-vitaly-danger" />;
      case 'warning': return <AlertTriangle size={16} className="text-vitaly-azul" />;
      case 'info': return <Info size={16} className="text-halo-cyan" />;
      default: return <Info size={16} className="text-gray-500" />;
    }
  };

  const getModuloBadgeColor = (modulo) => {
    switch (modulo.toLowerCase()) {
      case 'legal': return 'bg-vitaly-amarillo/20 text-amber-700';
      case 'sim': return 'bg-halo-cyan/10 text-halo-cyan';
      case 'vision': return 'bg-halo-cyan/10 text-halo-cyan';
      case 'connect': return 'bg-halo-emerald/10 text-halo-emerald';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-vitaly-azul" />
          <h3 className="font-bold text-vitaly-azul">Alertas Activas</h3>
        </div>
        <span className="px-2 py-1 bg-vitaly-amarillo/20 text-amber-700 text-xs font-semibold rounded-full">
          {alertas.length} avisos
        </span>
      </div>

      <div className="space-y-3">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getAlertIcon(alerta.tipo)}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-800">{alerta.titulo}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${getModuloBadgeColor(alerta.modulo)}`}>
                      {alerta.modulo}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{alerta.descripcion}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <Clock size={10} />
                    <span>{new Date(alerta.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-halo-cyan transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-halo-cyan border border-gray-200 hover:border-halo-cyan/30 rounded-lg transition-colors">
        Ver todas las alertas
      </button>
    </div>
  );
}

// Componente gráfico de incidencias
function GraficoIncidencias({ data }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={20} className="text-halo-cyan" />
        <h3 className="font-bold text-vitaly-azul">Tendencia de Incidencias</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">Últimos 6 meses</p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="incidencias" name="Incidencias" fill="#002F82" radius={[4, 4, 0, 0]} />
          <Bar dataKey="resueltas" name="Resueltas" fill="#FFB700" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardGrid({ kpis, centroNombre, centroData }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header con info del centro */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vitaly-azul">Dashboard</h1>
          <p className="text-gray-500 mt-1">Visión global de autoprotección</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-card">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-halo-cyan" />
            <span className="font-semibold text-gray-800">{centroNombre}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={14} />
            <span>{centroData?.empleados || 120} empleados</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={14} />
            <span>Oficinas</span>
          </div>
        </div>
      </div>

      {/* Plan de Autoprotección */}
      <PlanStatusCard plan={kpis.planAutoproteccion} />

      {/* Grid de módulos */}
      <div className="grid grid-cols-3 gap-4">
        {/* Halo Vision */}
        <ModuleCard modulo="vision" titulo="Halo Vision" subtitulo="Visionado de cámaras">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-vitaly-azul">{kpis.vision.camarasActivas}</span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Camera size={14} />
                <span>{kpis.vision.camarasTotal}</span>
                <span className="text-xs">Total</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Cámaras activas</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Conectividad</span>
              <span className="font-semibold text-vitaly-azul">{kpis.vision.conectividad}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-vitaly-azul rounded-full"
                style={{ width: `${kpis.vision.conectividad}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Estado:</span>
              <span className={`font-semibold ${kpis.vision.estado === 'online' ? 'text-halo-emerald' : 'text-vitaly-azul'}`}>
                {kpis.vision.estado === 'online' ? 'Online' : 'Parcial'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alertas 24h:</span>
              <span className={`font-semibold ${kpis.vision.alertas24h === 0 ? 'text-halo-emerald' : 'text-vitaly-danger'}`}>
                {kpis.vision.alertas24h}
              </span>
            </div>
          </div>
        </ModuleCard>

        {/* Halo Connect */}
        <ModuleCard modulo="connect" titulo="Halo Connect" subtitulo="Mantenimiento de activos (QR, RIPCI)">
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <div className="flex items-center gap-1">
                <CheckCircle size={16} className="text-halo-emerald" />
                <span className="text-3xl font-bold text-vitaly-azul">{kpis.connect.extintoresOk}</span>
              </div>
              <span className="text-gray-500">/ {kpis.connect.extintoresTotal}</span>
              <span className={`ml-auto text-sm font-semibold ${kpis.connect.porRevisar > 0 ? 'text-vitaly-danger' : 'text-halo-emerald'}`}>
                {kpis.connect.porRevisar > 0 && kpis.connect.porRevisar}
                {kpis.connect.porRevisar > 0 && <span className="text-xs font-normal text-gray-500 ml-1">Por revisar</span>}
              </span>
            </div>
            <p className="text-xs text-gray-500">Extintores OK</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estado extintores</span>
              <span className="font-semibold text-vitaly-azul">{kpis.connect.estadoExtintores}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-vitaly-azul rounded-full"
                style={{ width: `${kpis.connect.estadoExtintores}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">BIEs próxima revisión:</span>
              <span className="font-semibold text-gray-800">
                {new Date(kpis.connect.biesProximaRevision).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Activos con QR:</span>
              <span className="font-semibold text-gray-800">{kpis.connect.activosConQR}</span>
            </div>
          </div>
        </ModuleCard>

        {/* Halo Training */}
        <ModuleCard modulo="training" titulo="Halo Training" subtitulo="Formación y entrega del PAU">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-vitaly-azul">{kpis.training.personalFormado}%</span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users size={14} />
                <span>{kpis.training.pendientes}</span>
                <span className="text-xs">Pendientes</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Personal formado</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Cumplimiento formativo</span>
              <span className="font-semibold text-vitaly-azul">{kpis.training.cumplimientoFormativo}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-vitaly-azul rounded-full"
                style={{ width: `${kpis.training.cumplimientoFormativo}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Notificaciones enviadas:</span>
              <span className="font-semibold text-gray-800">{kpis.training.notificacionesEnviadas}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Certificados por expirar:</span>
              <span className={`font-semibold ${kpis.training.certificadosPorExpirar > 0 ? 'text-vitaly-danger' : 'text-halo-emerald'}`}>
                {kpis.training.certificadosPorExpirar}
              </span>
            </div>
          </div>
        </ModuleCard>
      </div>

      {/* Segunda fila de módulos */}
      <div className="grid grid-cols-2 gap-4">
        {/* Halo Sim */}
        <ModuleCard modulo="sim" titulo="Halo Sim" subtitulo="Gemelo digital y evacuación">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-vitaly-azul">{kpis.sim.ultimaEvaluacion}%</span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock size={14} />
                <span>{kpis.sim.tiempoEvacuacion}</span>
                <span className="text-xs">T. Evacuación</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Última evaluación</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Puntuación simulacro</span>
              <span className="font-semibold text-vitaly-azul">{kpis.sim.puntuacionSimulacro}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-vitaly-amarillo rounded-full"
                style={{ width: `${kpis.sim.puntuacionSimulacro}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Último simulacro:</span>
              <span className="font-semibold text-gray-800">{formatDate(kpis.sim.ultimoSimulacro)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Próximo simulacro:</span>
              <span className="font-semibold text-gray-800">{formatDate(kpis.sim.proximoSimulacro)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Simulaciones IA:</span>
              <span className="font-semibold text-gray-800">{kpis.sim.simulacionesIA}</span>
            </div>
          </div>
        </ModuleCard>

        {/* Cumplimiento General */}
        <CumplimientoCircular
          score={kpis.cumplimientoGeneral.score}
          evaluacion={kpis.cumplimientoGeneral.evaluacion}
          desglose={kpis.cumplimientoGeneral.desglose}
        />
      </div>

      {/* Tercera fila: Gráfico y Alertas */}
      <div className="grid grid-cols-2 gap-6">
        <GraficoIncidencias data={kpis.incidencias} />
        <AlertasActivas alertas={kpis.alertas} />
      </div>
    </div>
  );
}
