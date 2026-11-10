/**
 * Asistente de simulación: el técnico elige turno y escenario con "pastillas" (evacuación ordinaria, incendio en
 * un punto del plano, salida bloqueada, accidente) o describe un caso al asistente de Halo, y lanza el gemelo.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Ambulance, Ban, Bot, DoorOpen, Flame, Loader, MapPin, Play, Sparkles, Users } from 'lucide-react';
import VisorPlano from './VisorPlano';
import ResultadosSimulacion from './ResultadosSimulacion';
import { api, esperarTrabajo, mediosProteccion, plantillaSeudonimizada, resumenTurnos, TURNOS, USO_CENTRO } from '../../services/gemeloService';

const PASTILLAS = [
  { id: 'ordinaria', texto: 'Evacuación ordinaria', icono: DoorOpen, ayuda: 'Alarma general y evacuación por todas las salidas.' },
  { id: 'incendio', texto: 'Incendio en un punto', icono: Flame, ayuda: 'Haz clic en el plano donde empieza el fuego.' },
  { id: 'bloqueo', texto: 'Salida bloqueada', icono: Ban, ayuda: 'Elige qué salidas no se pueden usar.' },
  { id: 'accidente', texto: 'Accidente con herido', icono: Ambulance, ayuda: 'Haz clic donde está el herido: le atiende el EPA más cercano.' },
  { id: 'asistente', texto: 'Caso con el asistente', icono: Bot, ayuda: 'Describe el caso con tus palabras.' },
];
const HUMO = { lenta: 0.2, media: 0.3, rapida: 0.5 };

export default function PanelSimular({ centroId, centro, geo, validacion, onSimulado, resultadoInicial }) {
  const turnos = useMemo(() => resumenTurnos(centroId), [centroId]);
  const turnosDisponibles = TURNOS.filter((t) => turnos[t]);
  const [turno, setTurno] = useState(turnosDisponibles[0] || 'mañana');
  const [tipo, setTipo] = useState('ordinaria');
  const [fuego, setFuego] = useState(null);
  const [accidente, setAccidente] = useState(null);
  const [heridos, setHeridos] = useState(1);
  const [humo, setHumo] = useState('media');
  const [alarma, setAlarma] = useState(0);
  const [bloqueadas, setBloqueadas] = useState([]);
  const [texto, setTexto] = useState('');
  const [caso, setCaso] = useState(null);
  const [realizaciones, setRealizaciones] = useState(6);
  const [trabajo, setTrabajo] = useState(null);
  const [error, setError] = useState(null);
  const [res, setRes] = useState(resultadoInicial || null);
  const [local, setLocal] = useState({});
  const [interpretando, setInterpretando] = useState(false);

  const medios = useMemo(() => mediosProteccion(centroId), [centroId]);
  useEffect(() => { if (resultadoInicial) setRes(resultadoInicial); }, [resultadoInicial]);
  useEffect(() => { setLocal(plantillaSeudonimizada(centroId, null, geo?.recintos || []).local); }, [centroId, geo]);

  // El caso del asistente puede pedir un punto en el plano (incendio o herido sin recinto reconocido).
  const pidePunto = tipo === 'incendio' ? 'fuego' : tipo === 'accidente' ? 'accidente'
    : tipo === 'asistente' && caso ? (caso.escenario.incendio?.pendiente_punto && !fuego ? 'fuego'
      : caso.escenario.accidente?.pendiente_punto && !accidente ? 'accidente' : null) : null;

  const alPunto = (x, y) => {
    if (pidePunto === 'fuego') setFuego({ x, y });
    if (pidePunto === 'accidente') setAccidente({ x, y });
  };

  const salidasConIncidencia = useMemo(() => {
    if (!geo) return [];
    return geo.salidas.filter((s) => medios.some((m) => m.tipo === 'puerta_rf' && m.estado !== 'ok'
      && Math.hypot(m.x - s.centro[0], m.y - s.centro[1]) < 6)).map((s) => s.nombre);
  }, [geo, medios]);

  const preparar = async () => {
    setInterpretando(true);
    setError(null);
    try {
      const contexto = {
        recintos: (geo?.recintos || []).map((r) => r.nombre), salidas: (geo?.salidas || []).map((s) => s.nombre),
        medios: medios.map((m) => ({ id: m.id, tipo: m.tipo, estado: m.estado })),
        perfiles: ['produccion', 'almacen', 'oficina', 'taller'],
      };
      const r = await api.interpretar(texto, contexto);
      setCaso(r);
      setFuego(null);
      setAccidente(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setInterpretando(false);
    }
  };

  const escenario = () => {
    const base = { id: tipo, tipo, salidas_bloqueadas: [] };
    if (tipo === 'ordinaria') return { ...base, nombre: 'Evacuación ordinaria' };
    if (tipo === 'incendio') {
      return { ...base, nombre: 'Incendio en el punto marcado', incendio: { ...fuego, velocidad_humo_m_s: HUMO[humo], alarma_s: Number(alarma) || 0 } };
    }
    if (tipo === 'bloqueo') return { ...base, nombre: `Salida bloqueada: ${bloqueadas.join(', ')}`, salidas_bloqueadas: bloqueadas };
    if (tipo === 'accidente') return { ...base, nombre: 'Accidente con herido y evacuación', accidente: { ...accidente, heridos: Number(heridos) || 1 } };
    const e = { ...caso.escenario, id: 'asistente', tipo: caso.escenario.tipo || 'personalizado' };
    if (e.incendio) {
      const { pendiente_punto: _p, ...inc } = e.incendio;
      e.incendio = fuego ? { ...inc, ...fuego, zona: undefined } : inc;
    }
    if (e.accidente) {
      const { pendiente_punto: _p, ...acc } = e.accidente;
      e.accidente = accidente ? { ...acc, ...accidente, zona: undefined } : acc;
    }
    if (!e.premovimiento_por_perfil) delete e.premovimiento_por_perfil;
    return e;
  };

  const listo = geo && !trabajo && (tipo === 'ordinaria' || (tipo === 'incendio' && fuego) || (tipo === 'bloqueo' && bloqueadas.length)
    || (tipo === 'accidente' && accidente) || (tipo === 'asistente' && caso && !pidePunto));

  const simular = async () => {
    setError(null);
    try {
      const { registros, local: loc } = plantillaSeudonimizada(centroId, turno, geo.recintos);
      setLocal(loc);
      const esc = escenario();
      const r = await api.simular(centroId, {
        turno, escenario: esc, personas: registros, equipos_pci: medios, realizaciones,
        centro: { nombre: centro?.nombre, uso: USO_CENTRO[centro?.tipo] || 'industrial' },
      });
      setTrabajo(r.trabajo);
      await esperarTrabajo(r.trabajo.id, setTrabajo);
      setRes(await api.resultado(centroId, r.id));
      onSimulado?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setTrabajo(null);
    }
  };

  const verResultado = res && res.principal;
  const pintaFuego = verResultado ? (res.escenario?.incendio ? { x: res.escenario.incendio.x, y: res.escenario.incendio.y } : null) : fuego;
  const pintaAcc = verResultado ? null : accidente;

  return (
    <div className="grid xl:grid-cols-5 gap-6">
      <div className="xl:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-card space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">1 · Turno (plantilla de Halo)</div>
          <div className="flex flex-wrap gap-2">
            {turnosDisponibles.map((t) => (
              <button key={t} type="button" onClick={() => setTurno(t)}
                className={`px-3 py-1.5 rounded-lg text-sm border ${turno === t ? 'bg-vitaly-azul text-white border-vitaly-azul' : 'border-gray-300 hover:bg-gray-50'}`}>
                <span className="capitalize">{t}</span> <span className="opacity-70">· {turnos[t].personas}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1.5"><Users size={13} />
            {turnos[turno]?.personas || 0} personas, {turnos[turno]?.equipo || 0} en equipos del plan, {turnos[turno]?.ayuda || 0} necesitan ayuda. Viajan al motor seudonimizadas.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-card space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">2 · Escenario</div>
          <div className="flex flex-wrap gap-2">
            {PASTILLAS.map((p) => (
              <button key={p.id} type="button" onClick={() => { setTipo(p.id); setRes(null); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition ${tipo === p.id ? 'bg-halo-cyan/15 border-halo-cyan text-gray-900 font-semibold' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                <p.icono size={14} /> {p.texto}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">{PASTILLAS.find((p) => p.id === tipo)?.ayuda}</p>

          {tipo === 'incendio' && (
            <div className="space-y-2 text-sm">
              <div className={`flex items-center gap-2 ${fuego ? 'text-gray-700' : 'text-amber-700'}`}><MapPin size={14} />{fuego ? `Foco en (${fuego.x.toFixed(1)}, ${fuego.y.toFixed(1)}) m` : 'Marca el foco en el plano'}</div>
              <label className="flex items-center gap-2">Propagación del humo
                <select value={humo} onChange={(e) => setHumo(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1">
                  <option value="lenta">lenta</option><option value="media">media</option><option value="rapida">rápida</option>
                </select>
              </label>
              <label className="flex items-center gap-2">La alarma suena a los
                <input type="number" min="0" max="600" value={alarma} onChange={(e) => setAlarma(e.target.value)} className="w-20 border border-gray-300 rounded-md px-2 py-1" /> s
              </label>
            </div>
          )}
          {tipo === 'bloqueo' && geo && (
            <div className="grid grid-cols-1 gap-1 text-sm">
              {geo.salidas.map((s) => (
                <label key={s.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={bloqueadas.includes(s.nombre)} onChange={(e) => setBloqueadas(e.target.checked ? [...bloqueadas, s.nombre] : bloqueadas.filter((x) => x !== s.nombre))} />
                  <span className="font-mono text-xs text-emerald-700">{s.id}</span> {s.nombre} · {s.ancho} m
                  {salidasConIncidencia.includes(s.nombre) && <span className="text-xs text-amber-700">· puerta RF pendiente en Connect</span>}
                </label>
              ))}
            </div>
          )}
          {tipo === 'accidente' && (
            <div className="space-y-2 text-sm">
              <div className={`flex items-center gap-2 ${accidente ? 'text-gray-700' : 'text-amber-700'}`}><MapPin size={14} />{accidente ? `Herido en (${accidente.x.toFixed(1)}, ${accidente.y.toFixed(1)}) m` : 'Marca en el plano dónde está el herido'}</div>
              <label className="flex items-center gap-2">Heridos <input type="number" min="1" max="5" value={heridos} onChange={(e) => setHeridos(e.target.value)} className="w-16 border border-gray-300 rounded-md px-2 py-1" /></label>
            </div>
          )}
          {tipo === 'asistente' && (
            <div className="space-y-2">
              <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={3}
                placeholder="Ej.: Incendio en el almacén a media tarde, con la salida norte producción bloqueada por un camión y un operario herido en expediciones."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <button type="button" disabled={!texto.trim() || interpretando} onClick={preparar}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-vitaly-azul text-white text-sm hover:bg-vitaly-azul-hover disabled:opacity-40">
                {interpretando ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />} Preparar el caso
              </button>
              <p className="text-xs text-gray-500">El caso se interpreta en tu navegador con reglas; no se envía a ningún servicio externo.</p>
              {caso && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm space-y-1">
                  <div className="font-semibold text-gray-800">{caso.escenario.nombre}</div>
                  {caso.explicacion.map((x, i) => <div key={i} className="text-gray-700">· {x}</div>)}
                  {(caso.preguntas || []).length > 0 && <div className="text-amber-800 pt-1">Para afinar el caso: {caso.preguntas.join(' ')}</div>}
                  {caso.aviso && <div className="text-xs text-amber-700">{caso.aviso}</div>}
                  {pidePunto && <div className="text-amber-700 font-medium">Marca en el plano {pidePunto === 'fuego' ? 'el foco del incendio' : 'dónde está el herido'}.</div>}
                  <div className="text-xs text-gray-400">Interpretado por: intérprete local por reglas (en tu navegador)</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-card space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">3 · Simular</div>
          <label className="flex items-center gap-2 text-sm">Realizaciones (Monte Carlo)
            <input type="range" min="3" max="12" value={realizaciones} onChange={(e) => setRealizaciones(Number(e.target.value))} className="flex-1 accent-vitaly-azul" />
            <span className="w-6 tabular-nums">{realizaciones}</span>
          </label>
          <button type="button" disabled={!listo} onClick={simular}
            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg bg-vitaly-azul text-white font-semibold hover:bg-vitaly-azul-hover disabled:opacity-40">
            {trabajo ? <Loader size={16} className="animate-spin" /> : <Play size={16} />} {trabajo ? 'Simulando…' : 'Simular escenario'}
          </button>
          {trabajo && (
            <div>
              <div className="h-2 bg-gray-100 rounded"><div className="h-2 bg-halo-cyan rounded transition-all" style={{ width: `${trabajo.progreso || 2}%` }} /></div>
              <div className="text-xs text-gray-500 mt-1">{trabajo.texto}</div>
            </div>
          )}
          {error && <div className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</div>}
          {validacion && <p className="text-xs text-gray-500">Parámetros: nivel {validacion.nivel} · {validacion.nivel_texto}{validacion.demostracion ? ' (con simulacros sintéticos de demo)' : ''}.</p>}
        </div>
      </div>

      <div className="xl:col-span-3 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-card">
          {verResultado && <div className="text-sm font-semibold text-gray-800 mb-2">{res.escenario?.nombre} · turno {res.turno}</div>}
          <VisorPlano geo={verResultado ? res.geo : geo} medios={verResultado ? res.medios : medios.map((m) => ({ ...m, operativo: !['baja_temporal', 'incidencia'].includes(m.estado) }))}
            frames={verResultado ? res.principal.frames : null} humo={verResultado ? res.principal.humo : null}
            fuego={pintaFuego} accidente={pintaAcc} bloqueadas={verResultado ? (res.escenario?.salidas_bloqueadas || []) : (tipo === 'bloqueo' ? bloqueadas : caso?.escenario?.salidas_bloqueadas || [])}
            modo={pidePunto && !verResultado ? 'punto' : 'ver'} onPunto={alPunto} />
        </div>
        {verResultado && <ResultadosSimulacion res={res} local={local} />}
      </div>
    </div>
  );
}
