/**
 * Halo Sim: gemelo digital de evacuación del centro.
 * Plano IFC aprobado + plantilla y equipos del plan (Training) + medios con su mantenimiento (Connect)
 * → resultados de simulación JuPedSim (precalculados en esta demo) con su nivel de validación.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, Box, History, PlayCircle, Scale } from 'lucide-react';
import PanelSimular from './PanelSimular';
import PanelPlano from './PanelPlano';
import PanelValidacion from './PanelValidacion';
import { NivelValidacion } from './ResultadosSimulacion';
import { api } from '../../services/gemeloService';

const PESTANAS = [
  { id: 'simular', texto: 'Simular', icono: PlayCircle },
  { id: 'plano', texto: 'Plano', icono: Box },
  { id: 'validacion', texto: 'Simulacros y validación', icono: Scale },
  { id: 'historial', texto: 'Historial', icono: History },
];

export default function SimulationModule({ centroActual, centro }) {
  const [pestana, setPestana] = useState('simular');
  const [estado, setEstado] = useState(null);
  const [plano, setPlano] = useState(null);
  const [geo, setGeo] = useState(null);
  const [validacion, setValidacion] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      setEstado(await api.estado());
      const planos = await api.planos(centroActual);
      const activo = planos.find((p) => p.tipo === 'ifc' && p.activo && p.estado === 'aprobado') || null;
      setPlano(activo);
      setGeo(activo ? (await api.inspeccion(centroActual, activo.id).catch(() => null))?.geo || null : null);
      setValidacion((await api.calibracion(centroActual)).validacion);
      setHistorial(await api.simulaciones(centroActual));
    } catch (e) {
      setError(e.message);
    }
  }, [centroActual]);

  useEffect(() => { setResultado(null); cargar(); }, [cargar]);

  const abrir = async (id) => {
    try { setResultado(await api.resultado(centroActual, id)); setPestana('simular'); } catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vitaly-azul flex items-center gap-3">
            <Activity size={28} className="text-vitaly-azul" />
            Halo Sim
          </h1>
          <p className="text-gray-500 mt-1">Gemelo digital de evacuación · {centro?.nombre} · plano {plano ? `${plano.nombre} (${plano.planta || 'planta por defecto'})` : 'sin aprobar'} · resultados JuPedSim precalculados (demo)</p>
        </div>
        <div className="ml-auto"><NivelValidacion validacion={validacion} compacto /></div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex gap-2">
          <AlertTriangle size={16} className="mt-0.5" />
          <div>No se han podido cargar los datos de demostración del gemelo ({error}).</div>
        </div>
      )}
      {estado?.demo && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Modo demo:</strong> plano y resultados precalculados con JuPedSim para la Planta Industrial Barcelona (datos sintéticos). En esta versión online no se ejecuta el motor ni se envía nada a ningún servidor.
        </div>
      )}

      <div className="flex gap-1 border-b border-gray-200">
        {PESTANAS.map((p) => (
          <button key={p.id} type="button" onClick={() => setPestana(p.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px ${pestana === p.id ? 'border-halo-cyan text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            <p.icono size={16} /> {p.texto}
          </button>
        ))}
      </div>

      {pestana === 'simular' && (plano && geo ? (
        <PanelSimular key={centroActual} centroId={centroActual} centro={centro} geo={geo} validacion={validacion}
          onSimulado={cargar} resultadoInicial={resultado} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-card">
          <Box size={36} className="mx-auto text-gray-400 mb-3" />
          <h3 className="font-semibold text-vitaly-azul">Este centro aún no tiene un plano IFC aprobado</h3>
          <p className="text-sm text-gray-600 mt-1">Sube el modelo IFC (aquí o en Documentación del PAU), revisa las salidas y apruébalo para simular.</p>
          <button type="button" onClick={() => setPestana('plano')} className="mt-4 px-4 py-2 rounded-lg bg-vitaly-azul text-white text-sm">Ir a Plano</button>
        </div>
      ))}
      {pestana === 'plano' && <PanelPlano centroId={centroActual} onCambio={cargar} />}
      {pestana === 'validacion' && <PanelValidacion centroId={centroActual} centro={centro} geo={geo} validacion={validacion} onCalibrado={cargar} />}
      {pestana === 'historial' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card">
          <table className="w-full text-sm text-left">
            <thead><tr className="text-xs text-gray-500 uppercase"><th className="py-1">Fecha</th><th>Escenario</th><th>Turno</th><th>Personas</th><th>Tiempo (mediana y rango)</th><th>Nivel</th><th /></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {historial.map((h) => (
                <tr key={h.id}>
                  <td className="py-1.5">{new Date(h.fecha).toLocaleString('es-ES')}</td><td>{h.escenario}</td><td className="capitalize">{h.turno}</td><td>{h.personas}</td>
                  <td>{h.mediana_s ? `${Math.round(h.mediana_s)} s (${Math.round(h.rango_s[0])}–${Math.round(h.rango_s[1])})` : 'no termina'}</td><td>{h.nivel}</td>
                  <td className="text-right"><button type="button" onClick={() => abrir(h.id)} className="text-sky-700 hover:underline">Ver</button></td>
                </tr>
              ))}
              {!historial.length && <tr><td colSpan={7} className="py-3 text-gray-500">Aún no hay simulaciones en este centro.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
