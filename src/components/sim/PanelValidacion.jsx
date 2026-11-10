/**
 * Simulacros reales y validación progresiva del gemelo de cada centro: registrar simulacros medidos, calibrar el
 * premovimiento y contrastar el modelo con simulacros independientes. El procedimiento completo está en
 * docs/VALIDACION.md.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { ClipboardList, FlaskConical, Loader, Plus, Scale, Trash2 } from 'lucide-react';
import { NivelValidacion } from './ResultadosSimulacion';
import { api, esperarTrabajo, mediosProteccion, plantillaSeudonimizada, TURNOS, USO_CENTRO } from '../../services/gemeloService';

const PASOS = [
  ['0', 'Parámetros ilustrativos', 'Valores por defecto de la demo. Sirven para comparar escenarios, no para dar tiempos.'],
  ['1', 'Referencia', 'Premovimiento ajustado con el repositorio de simulacros reales de otros centros del mismo uso.'],
  ['2', 'Calibrado en el centro', 'Premovimiento ajustado con simulacros medidos en este centro.'],
  ['3', 'Contrastado', 'Un simulacro independiente (no usado para calibrar) queda dentro del ±20 % en el tiempo total.'],
];

const VACIO = { fecha: '', turno: 'mañana', tipo: 'ordinaria', bloqueada: '', personas: '', tiempo_total_s: '', tiempo_recuento_s: '',
  uso_para: '', fuente: 'Observadores en zonas y conteo en puertas', observaciones: '', zonas: [{ zona: '', perfil: 'produccion', mediana_s: '', p90_s: '' }] };

export default function PanelValidacion({ centroId, centro, geo, validacion, onCalibrado }) {
  const [sims, setSims] = useState([]);
  const [ref, setRef] = useState(null);
  const [form, setForm] = useState(null);
  const [trabajo, setTrabajo] = useState(null);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setSims(await api.simulacros(centroId));
      setRef(await api.referencia(USO_CENTRO[centro?.tipo]));
    } catch (e) { setError(e.message); }
  }, [centroId, centro?.tipo]);
  useEffect(() => { cargar(); }, [cargar]);

  const guardar = async () => {
    setError(null);
    try {
      const s = {
        fecha: form.fecha, turno: form.turno, uso: USO_CENTRO[centro?.tipo] || 'industrial',
        escenario: { tipo: form.tipo, salidas_bloqueadas: form.tipo === 'bloqueo' && form.bloqueada ? [form.bloqueada] : [] },
        personas: Number(form.personas) || null, tiempo_total_s: Number(form.tiempo_total_s), tiempo_recuento_s: Number(form.tiempo_recuento_s) || null,
        fuente: form.fuente, observaciones: form.observaciones, sintetico: false,
        premovimiento: form.zonas.filter((z) => z.mediana_s).map((z) => ({ zona: z.zona, perfil: z.perfil, mediana_s: Number(z.mediana_s), p90_s: Number(z.p90_s) || undefined })),
      };
      if (form.uso_para) s.uso_para = form.uso_para;
      await api.guardarSimulacro(centroId, s);
      setForm(null);
      cargar();
    } catch (e) { setError(e.message); }
  };

  const borrar = async (s) => {
    if (!window.confirm(`¿Eliminar el simulacro ${s.id}?`)) return;
    try { await api.borrarSimulacro(centroId, s.id); cargar(); } catch (e) { setError(e.message); }
  };

  const calibrar = async () => {
    setError(null);
    try {
      const porTurno = {};
      for (const t of TURNOS) {
        const { registros } = plantillaSeudonimizada(centroId, t, geo?.recintos || []);
        if (registros.length) porTurno[t] = registros;
      }
      const r = await api.calibrar(centroId, { personas_por_turno: porTurno, equipos_pci: mediosProteccion(centroId),
        centro: { nombre: centro?.nombre, uso: USO_CENTRO[centro?.tipo] || 'industrial' } });
      setTrabajo(r.trabajo);
      await esperarTrabajo(r.trabajo.id, setTrabajo);
      onCalibrado?.();
    } catch (e) { setError(e.message); } finally { setTrabajo(null); }
  };

  const v = validacion || {};
  const zonaCambio = (i, k, val) => setForm({ ...form, zonas: form.zonas.map((z, j) => (j === i ? { ...z, [k]: val } : z)) });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h3 className="font-bold text-vitaly-azul flex items-center gap-2"><Scale size={18} className="text-halo-cyan" /> Validación del gemelo de este centro</h3>
          <NivelValidacion validacion={v} />
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          {PASOS.map(([n, t, d]) => (
            <div key={n} className={`rounded-lg border p-3 text-sm ${Number(n) <= (v.nivel ?? 0) ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'}`}>
              <div className="font-semibold text-gray-800">Nivel {n} · {t}</div><div className="text-gray-600 text-xs mt-1">{d}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Repositorio de referencia: {ref ? `${ref.simulacros} simulacros de ${ref.centros} centros` : '—'}. En la demo no se incluye repositorio de referencia.
          El procedimiento completo de validación está en docs/VALIDACION.md.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="font-bold text-vitaly-azul flex items-center gap-2"><ClipboardList size={18} /> Simulacros medidos del centro</h3>
          <button type="button" onClick={() => setForm(form ? null : { ...VACIO, zonas: [{ ...VACIO.zonas[0], zona: geo?.recintos?.[0]?.nombre || '' }] })}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"><Plus size={14} /> Registrar simulacro</button>
          <button type="button" disabled={!sims.length || !!trabajo} onClick={calibrar}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vitaly-azul text-white text-sm hover:bg-vitaly-azul-hover disabled:opacity-40">
            {trabajo ? <Loader size={14} className="animate-spin" /> : <FlaskConical size={14} />} Calibrar y contrastar
          </button>
        </div>
        {trabajo && (
          <div className="mb-3"><div className="h-2 bg-gray-100 rounded"><div className="h-2 bg-halo-cyan rounded transition-all" style={{ width: `${trabajo.progreso || 2}%` }} /></div>
            <div className="text-xs text-gray-500 mt-1">{trabajo.texto}</div></div>
        )}
        {error && <div className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</div>}
        {form && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4 text-sm space-y-3">
            <div className="grid md:grid-cols-4 gap-3">
              <label>Fecha<input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="mt-1 w-full border border-gray-300 rounded px-2 py-1" /></label>
              <label>Turno<select value={form.turno} onChange={(e) => setForm({ ...form, turno: e.target.value })} className="mt-1 w-full border border-gray-300 rounded px-2 py-1">{TURNOS.map((t) => <option key={t}>{t}</option>)}</select></label>
              <label>Escenario<select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="mt-1 w-full border border-gray-300 rounded px-2 py-1">
                <option value="ordinaria">Evacuación ordinaria</option><option value="bloqueo">Con salida bloqueada</option></select></label>
              {form.tipo === 'bloqueo' && (
                <label>Salida bloqueada<select value={form.bloqueada} onChange={(e) => setForm({ ...form, bloqueada: e.target.value })} className="mt-1 w-full border border-gray-300 rounded px-2 py-1">
                  <option value="">—</option>{(geo?.salidas || []).map((s) => <option key={s.id}>{s.nombre}</option>)}</select></label>
              )}
              <label>Personas presentes<input type="number" value={form.personas} onChange={(e) => setForm({ ...form, personas: e.target.value })} className="mt-1 w-full border border-gray-300 rounded px-2 py-1" /></label>
              <label>Tiempo total medido (s)<input type="number" value={form.tiempo_total_s} onChange={(e) => setForm({ ...form, tiempo_total_s: e.target.value })} className="mt-1 w-full border border-gray-300 rounded px-2 py-1" /></label>
              <label>Recuento completo (s)<input type="number" value={form.tiempo_recuento_s} onChange={(e) => setForm({ ...form, tiempo_recuento_s: e.target.value })} className="mt-1 w-full border border-gray-300 rounded px-2 py-1" /></label>
              <label>Uso<select value={form.uso_para} onChange={(e) => setForm({ ...form, uso_para: e.target.value })} className="mt-1 w-full border border-gray-300 rounded px-2 py-1">
                <option value="">Automático</option><option value="calibracion">Calibración</option><option value="validacion">Validación (independiente)</option></select></label>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Premovimiento observado por zona (desde la alarma hasta que la persona empieza a moverse)</div>
              {form.zonas.map((z, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 mb-1">
                  <select value={z.zona} onChange={(e) => zonaCambio(i, 'zona', e.target.value)} className="border border-gray-300 rounded px-2 py-1">{(geo?.recintos || []).map((r) => <option key={r.nombre}>{r.nombre}</option>)}</select>
                  <select value={z.perfil} onChange={(e) => zonaCambio(i, 'perfil', e.target.value)} className="border border-gray-300 rounded px-2 py-1">{['produccion', 'almacen', 'oficina', 'taller', 'vestuario'].map((p) => <option key={p}>{p}</option>)}</select>
                  mediana <input type="number" value={z.mediana_s} onChange={(e) => zonaCambio(i, 'mediana_s', e.target.value)} className="w-20 border border-gray-300 rounded px-2 py-1" /> s
                  p90 <input type="number" value={z.p90_s} onChange={(e) => zonaCambio(i, 'p90_s', e.target.value)} className="w-20 border border-gray-300 rounded px-2 py-1" /> s
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, zonas: [...form.zonas, { ...VACIO.zonas[0], zona: geo?.recintos?.[0]?.nombre || '' }] })} className="text-xs text-sky-700 hover:underline">+ otra zona</button>
            </div>
            <label className="block">Fuente de los datos<input value={form.fuente} onChange={(e) => setForm({ ...form, fuente: e.target.value })} className="mt-1 w-full border border-gray-300 rounded px-2 py-1" /></label>
            <label className="block">Observaciones<textarea value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} rows={2} className="mt-1 w-full border border-gray-300 rounded px-2 py-1" /></label>
            <p className="text-xs text-gray-500">No incluyas nombres ni datos personales: solo tiempos agregados.</p>
            <button type="button" disabled={!form.fecha || !form.tiempo_total_s} onClick={guardar} className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium disabled:opacity-40">Guardar simulacro</button>
          </div>
        )}
        <table className="w-full text-sm text-left">
          <thead><tr className="text-xs text-gray-500 uppercase"><th className="py-1">Simulacro</th><th>Turno</th><th>Escenario</th><th>Personas</th><th>Tiempo total</th><th>Uso</th><th /></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {sims.map((s) => (
              <tr key={s.id}>
                <td className="py-1.5">{s.fecha} {s.sintetico && <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">sintético</span>}<div className="text-xs text-gray-400 font-mono">{s.id}</div></td>
                <td className="capitalize">{s.turno}</td>
                <td>{s.escenario?.tipo}{s.escenario?.salidas_bloqueadas?.length ? ` (${s.escenario.salidas_bloqueadas.join(', ')})` : ''}</td>
                <td>{s.personas ?? '—'}</td><td>{s.tiempo_total_s} s</td>
                <td>{s.uso_para || 'automático'}</td>
                <td className="text-right"><button type="button" onClick={() => borrar(s)} className="text-gray-400 hover:text-red-600" aria-label="Eliminar"><Trash2 size={14} /></button></td>
              </tr>
            ))}
            {!sims.length && <tr><td colSpan={7} className="py-3 text-gray-500">Aún no hay simulacros registrados para este centro.</td></tr>}
          </tbody>
        </table>
      </div>

      {v.contraste?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card text-sm space-y-4">
          <h3 className="font-bold text-vitaly-azul">Última calibración ({v.fecha})</h3>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Premovimiento ajustado</div>
            <table className="w-full text-left">
              <thead><tr className="text-xs text-gray-500"><th>Perfil</th><th>Mediana</th><th>Dispersión (σ)</th><th>Datos</th><th>Origen</th></tr></thead>
              <tbody>{Object.entries(v.ajuste_premovimiento || {}).map(([k, a]) => (
                <tr key={k} className="border-t border-gray-100"><td className="py-1">{k}</td><td>{a.mediana_s} s</td><td>{a.sigma}</td><td>{a.n} · {a.metodo}</td><td>{a.fuente}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Contraste simulado frente a medido (criterio ±{v.criterio_error_pct} %)</div>
            <table className="w-full text-left">
              <thead><tr className="text-xs text-gray-500"><th>Simulacro</th><th>Uso</th><th>Medido</th><th>Simulado (mediana y rango)</th><th>Error</th><th /></tr></thead>
              <tbody>{v.contraste.map((c) => (
                <tr key={c.simulacro} className="border-t border-gray-100">
                  <td className="py-1">{c.fecha}{c.sintetico && <span className="ml-1 text-xs text-amber-700">(sintético)</span>}</td>
                  <td>{c.uso === 'validacion' ? 'validación' : 'calibración'}</td>
                  <td>{c.medido_s} s</td><td>{c.simulado_mediana_s} s ({c.simulado_rango_s?.[0]}–{c.simulado_rango_s?.[1]})</td>
                  <td className={c.dentro_criterio ? 'text-emerald-700' : 'text-red-700'}>{c.error_pct > 0 ? '+' : ''}{c.error_pct} %</td>
                  <td className="text-xs text-gray-500">{c.uso === 'calibracion' ? 'no cuenta para validar' : c.dentro_criterio ? 'dentro' : 'fuera'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {(v.avisos || []).map((a, i) => <p key={i} className="text-amber-700">{a}</p>)}
          {v.nota && <p className="text-xs text-gray-500">{v.nota}</p>}
        </div>
      )}
    </div>
  );
}
