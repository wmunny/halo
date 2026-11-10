/**
 * Revisión del plano IFC por el técnico antes de simular: diagnóstico, planta, salidas detectadas,
 * salidas que hay que marcar a mano (p. ej. un IFC de Revit sin puertas exteriores reconocibles) y aprobación.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, Info, Loader, MousePointerClick, RefreshCw, ShieldCheck, Trash2, XCircle } from 'lucide-react';
import VisorPlano from './VisorPlano';
import SubidaPlanos, { usePlanos } from './SubidaPlanos';
import { api, esperarTrabajo } from '../../services/gemeloService';

const ICONO = { error: XCircle, aviso: AlertTriangle, info: Info };
const COLOR = { error: 'text-red-600', aviso: 'text-amber-600', info: 'text-sky-600' };

export default function PanelPlano({ centroId, onCambio }) {
  const { lista, recargar } = usePlanos(centroId);
  const ifcs = useMemo(() => lista.filter((p) => p.tipo === 'ifc'), [lista]);
  const [selId, setSelId] = useState(null);
  const [ins, setIns] = useState(null);
  const [manuales, setManuales] = useState([]);
  const [descartadas, setDescartadas] = useState([]);
  const [planta, setPlanta] = useState('');
  const [ancho, setAncho] = useState(1.2);
  const [marcando, setMarcando] = useState(false);
  const [ocupado, setOcupado] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const sel = ifcs.find((p) => p.id === selId) || ifcs.find((p) => p.activo) || ifcs[ifcs.length - 1];

  const cargar = useCallback(async () => {
    if (!sel) { setIns(null); return; }
    setManuales(sel.salidas_manuales || []);
    setDescartadas(sel.salidas_descartadas || []);
    setPlanta(sel.planta || '');
    try { setIns(await api.inspeccion(centroId, sel.id)); } catch { setIns(null); }
  }, [centroId, sel?.id, sel?.inspeccionado]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { cargar(); }, [cargar]);

  const cambiado = sel && (JSON.stringify(manuales) !== JSON.stringify(sel.salidas_manuales || [])
    || JSON.stringify(descartadas) !== JSON.stringify(sel.salidas_descartadas || []) || (planta || '') !== (sel.planta || ''));

  const guardar = async (aprobar) => {
    setOcupado(aprobar ? 'aprobar' : 'guardar');
    setMensaje(null);
    try {
      const r = await api.revisar(centroId, sel.id, aprobar ? { aprobar: true }
        : { planta: planta || null, salidas_manuales: manuales, salidas_descartadas: descartadas });
      if (r.trabajo) await esperarTrabajo(r.trabajo.id);
      await recargar();
      setMensaje({ tipo: 'ok', texto: aprobar ? 'Plano aprobado: el gemelo lo usará en las simulaciones.' : 'Correcciones guardadas y plano analizado de nuevo.' });
      onCambio?.();
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    } finally {
      setOcupado(null);
    }
  };

  const alPunto = (x, y) => {
    if (!marcando) return;
    // Si hay una puerta del IFC a menos de 2 m, se toma su posición y su ancho.
    const puerta = (ins?.geo?.puertas || []).map((p) => ({ ...p, d: Math.hypot(p.centro[0] - x, p.centro[1] - y) }))
      .sort((a, b) => a.d - b.d)[0];
    const usar = puerta && puerta.d < 2;
    setManuales([...manuales, {
      nombre: usar ? `${puerta.nombre} (marcada)` : `Salida marcada ${manuales.length + 1}`,
      x: usar ? puerta.centro[0] : x, y: usar ? puerta.centro[1] : y, ancho: usar && puerta.ancho ? Number(puerta.ancho.toFixed(2)) : ancho,
    }]);
  };

  const resumen = ins?.resumen;
  return (
    <div className="space-y-6">
      <SubidaPlanos centroId={centroId} onCambio={() => { recargar(); onCambio?.(); }} />
      {!ifcs.length ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-600">Este centro no tiene ningún modelo IFC. Súbelo arriba para poder simular.</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-bold text-vitaly-azul">Revisión del plano</h3>
              {ifcs.length > 1 && (
                <select value={sel?.id} onChange={(e) => setSelId(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                  {ifcs.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              )}
              <button type="button" onClick={() => setMarcando(!marcando)}
                className={`ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${marcando ? 'bg-sky-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>
                <MousePointerClick size={15} /> {marcando ? 'Haz clic en la fachada…' : 'Marcar salida en el plano'}
              </button>
            </div>
            {ins?.geo ? (
              <VisorPlano geo={ins.geo} modo={marcando ? 'punto' : 'ver'} onPunto={alPunto} mostrarPuertas
                marcas={manuales.map((m, i) => ({ x: m.x, y: m.y, texto: `M${i + 1}`, color: '#002F82' }))} bloqueadas={descartadas} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm gap-2"><Loader size={16} className="animate-spin" /> Esperando el análisis del IFC…</div>
            )}
            <p className="text-xs text-gray-500 mt-2">Cuadrados verdes: puertas del IFC en fachada; grises: puertas interiores. Al marcar cerca de una puerta se toma su posición y su ancho.</p>
          </div>
          <div className="space-y-4">
            {resumen && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-card text-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{resumen.esquema} · {resumen.superficie_transitable_m2} m² transitables</span>
                </div>
                <label className="block">
                  <span className="text-xs text-gray-500">Planta simulada</span>
                  <select value={planta || resumen.planta} onChange={(e) => setPlanta(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1">
                    {resumen.plantas_disponibles.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </label>
                <ul className="space-y-1">
                  {resumen.diagnostico.map((d, i) => {
                    const I = ICONO[d.nivel] || Info;
                    return <li key={i} className={`flex gap-2 ${COLOR[d.nivel]}`}><I size={14} className="mt-0.5 shrink-0" /><span className="text-gray-700">{d.texto}</span></li>;
                  })}
                </ul>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Salidas ({resumen.salidas.length})</div>
                  <ul className="space-y-1">
                    {resumen.salidas.map((s) => (
                      <li key={s.id} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-emerald-700 w-6">{s.id}</span>
                        <span className="flex-1 text-gray-700">{s.nombre} · {s.ancho_m} m</span>
                        {!manuales.some((m) => m.nombre === s.nombre) && (
                          <label className="text-xs text-gray-500 inline-flex items-center gap-1">
                            <input type="checkbox" checked={descartadas.includes(s.nombre)}
                              onChange={(e) => setDescartadas(e.target.checked ? [...descartadas, s.nombre] : descartadas.filter((x) => x !== s.nombre))} />
                            descartar
                          </label>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Salidas marcadas a mano</div>
                  {manuales.length === 0 && <p className="text-xs text-gray-500">Ninguna.</p>}
                  <ul className="space-y-1">
                    {manuales.map((m, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-sky-700 w-6">M{i + 1}</span>
                        <input value={m.nombre} onChange={(e) => setManuales(manuales.map((x, k) => (k === i ? { ...x, nombre: e.target.value } : x)))}
                          className="flex-1 border border-gray-200 rounded px-1.5 py-0.5 text-xs" aria-label="Nombre de la salida" />
                        <input type="number" step="0.1" min="0.6" value={m.ancho}
                          onChange={(e) => setManuales(manuales.map((x, k) => (k === i ? { ...x, ancho: Number(e.target.value) } : x)))}
                          className="w-14 border border-gray-200 rounded px-1.5 py-0.5 text-xs" aria-label="Ancho (m)" />
                        <button type="button" onClick={() => setManuales(manuales.filter((_, k) => k !== i))} className="text-gray-400 hover:text-red-600" aria-label="Quitar"><Trash2 size={13} /></button>
                      </li>
                    ))}
                  </ul>
                  <label className="text-xs text-gray-500 mt-2 inline-flex items-center gap-2">Ancho por defecto de las nuevas
                    <input type="number" step="0.1" min="0.6" value={ancho} onChange={(e) => setAncho(Number(e.target.value))} className="w-16 border border-gray-200 rounded px-1.5 py-0.5" /> m
                  </label>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button type="button" disabled={!cambiado || !!ocupado} onClick={() => guardar(false)}
                className="inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-40">
                {ocupado === 'guardar' ? <Loader size={15} className="animate-spin" /> : <RefreshCw size={15} />} Guardar correcciones y volver a analizar
              </button>
              <button type="button" disabled={cambiado || !!ocupado || !resumen?.salidas.length || (sel?.estado === 'aprobado' && sel?.activo)} onClick={() => guardar(true)}
                className="inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40">
                {ocupado === 'aprobar' ? <Loader size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                {sel?.estado === 'aprobado' && sel?.activo ? 'Plano aprobado y en uso' : 'Aprobar para simular'}
              </button>
              {sel?.estado === 'aprobado' && sel?.activo && <p className="text-xs text-emerald-700 inline-flex items-center gap-1"><CheckCircle size={12} /> Revisado el {new Date(sel.aprobado || sel.subido).toLocaleDateString('es-ES')}</p>}
              {mensaje && <div className={`text-sm rounded-lg px-3 py-2 ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{mensaje.texto}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
