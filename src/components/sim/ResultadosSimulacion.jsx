/**
 * Resultados de una simulación: tiempos (mediana y rango, nunca un único número), equipos de emergencia,
 * cobertura del turno, medios, contraste hidráulico, comprobaciones orientativas y nivel de validación.
 */
import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, Clock, Flame, Info, ShieldAlert, ShieldCheck, Users, Wind } from 'lucide-react';

const fmt = (v, u = ' s') => (v === null || v === undefined ? '—' : `${Math.round(v)}${u}`);
const NIVEL_CLASE = ['bg-gray-100 text-gray-700 border-gray-300', 'bg-sky-50 text-sky-800 border-sky-200',
  'bg-amber-50 text-amber-800 border-amber-200', 'bg-emerald-50 text-emerald-800 border-emerald-200'];
const ALERTA = { alta: 'text-red-700 bg-red-50', media: 'text-amber-800 bg-amber-50', baja: 'text-gray-700 bg-gray-50' };
const RESULTADO = { 'Comprobación automática realizada': 'text-sky-700', 'Revisión técnica necesaria': 'text-amber-700', 'No evaluable con los datos disponibles': 'text-gray-500' };
const EVENTOS = {
  llega_extintor_s: 'coge el extintor', llega_foco_s: 'llega al foco', fin_intervencion_s: 'deja de intervenir',
  llega_a_asistido_s: 'llega a la persona', recibe_ayuda_s: 'recibe ayuda', fin_barrido_s: 'termina el barrido', sale_s: 'sale',
};
const TAREA = { intervencion: 'Intervención', asistencia: 'Asistencia', espera_ayuda: 'Espera ayuda', barrido: 'Barrido' };

export function NivelValidacion({ validacion, compacto = false }) {
  if (!validacion) return null;
  const n = validacion.nivel ?? 0;
  const I = n >= 3 ? ShieldCheck : ShieldAlert;
  return (
    <div className={`inline-flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm ${NIVEL_CLASE[n]}`}>
      <I size={16} />
      <span className="font-semibold">Nivel {n}</span>
      {!compacto && <span>· {validacion.nivel_texto}</span>}
      {validacion.demostracion && <span className="text-xs px-1.5 py-0.5 rounded bg-white/70 border border-current">con simulacros sintéticos</span>}
    </div>
  );
}

function Tarjeta({ icono: I, titulo, valor, detalle, tono = 'text-gray-900' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide"><I size={14} />{titulo}</div>
      <div className={`text-2xl font-bold mt-1 tabular-nums ${tono}`}>{valor}</div>
      {detalle && <div className="text-xs text-gray-500 mt-0.5">{detalle}</div>}
    </div>
  );
}

function Seccion({ titulo, children, abierta = true, extra }) {
  const [abierto, setAbierto] = useState(abierta);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card">
      <button type="button" onClick={() => setAbierto(!abierto)} className="w-full flex items-center gap-2 px-4 py-3 text-left">
        {abierto ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="font-semibold text-gray-800">{titulo}</span>
        {extra && <span className="ml-auto text-xs text-gray-500">{extra}</span>}
      </button>
      {abierto && <div className="px-4 pb-4 text-sm">{children}</div>}
    </div>
  );
}

export default function ResultadosSimulacion({ res, local = {} }) {
  if (!res) return null;
  const nombre = (id) => (local[id] ? `${local[id].nombre}` : id);
  const mc = res.mc || {};
  const hid = res.hidraulico || {};
  const p = res.principal || {};
  const dif = mc.mediana && hid.tiempo_total_s ? Math.abs(mc.mediana - hid.tiempo_total_s) / mc.mediana : null;
  const cob = res.equipos?.cobertura || {};
  const salidas = Object.entries(mc.evacuados_por_salida_media || {});
  const maxSalida = Math.max(1, ...salidas.map(([, v]) => v));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <NivelValidacion validacion={res.validacion} />
        <span className="text-xs text-gray-500">{res.validacion?.fecha ? `Calibración del ${res.validacion.fecha}` : 'Sin calibrar con simulacros del centro'}</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tarjeta icono={Clock} titulo="Tiempo total (mediana)" valor={fmt(mc.mediana)} detalle={`Rango ${fmt(mc.minimo, '')}–${fmt(mc.maximo)} en ${mc.n} realizaciones`} />
        <Tarjeta icono={Users} titulo="95 % evacuado" valor={fmt(mc.t95_mediana)} detalle={`${mc.personas} personas en el turno`} />
        <Tarjeta icono={AlertTriangle} titulo="Sin evacuar" valor={mc.no_evacuados_max || 0} tono={mc.no_evacuados_max ? 'text-red-600' : 'text-emerald-600'}
          detalle={mc.no_evacuados_max ? 'En la peor realización, al terminar el tiempo máximo' : 'En todas las realizaciones'} />
        <Tarjeta icono={res.escenario?.incendio ? Wind : Flame} titulo="Expuestos al humo" valor={res.escenario?.incendio ? (mc.expuestos_mediana ?? 0) : '—'}
          detalle={res.escenario?.incendio ? 'Más de 5 s dentro del humo esquemático (mediana)' : 'Sin incendio en este escenario'} />
      </div>

      {res.equipos?.notas?.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 space-y-1">
          {res.equipos.notas.map((n, i) => <div key={i} className="flex gap-2"><Info size={14} className="mt-0.5 shrink-0" />{n.replace(/P-[0-9A-F]{6}/g, (m) => nombre(m))}</div>)}
        </div>
      )}

      <Seccion titulo="Equipos de emergencia del plan" extra={`${res.equipos?.tareas?.length || 0} tareas · medianas de ${mc.n} realizaciones`}>
        {!res.equipos?.tareas?.length ? <p className="text-gray-500">No hay tareas de equipos en este turno.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="text-xs text-gray-500 uppercase"><th className="py-1 pr-3">Persona</th><th className="pr-3">Rol</th><th className="pr-3">Tarea</th><th>Secuencia (mediana)</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {res.equipos.tareas.map((t) => (
                  <tr key={t.id} className="align-top">
                    <td className="py-1.5 pr-3"><div className="font-medium text-gray-800">{nombre(t.id)}</div><div className="text-xs text-gray-400 font-mono">{t.id}</div></td>
                    <td className="pr-3 text-gray-700">{t.rol}</td>
                    <td className="pr-3 text-gray-700">
                      {TAREA[t.tipo] || t.tipo}
                      <div className="text-xs text-gray-500">
                        {t.detalle?.extintor && `${t.detalle.extintor} (${t.detalle.estado_extintor?.replace('_', ' ')}, a ${t.detalle.distancia_extintor_foco_m} m del foco)`}
                        {t.detalle?.asistido && `a ${nombre(t.detalle.asistido)} · ${t.detalle.motivo}`}
                        {t.detalle?.ayudante && `le asiste ${nombre(t.detalle.ayudante)}${t.detalle.herido ? ' · herido' : ''}`}
                        {t.detalle?.zona && `zona ${t.detalle.zona}`}
                      </div>
                    </td>
                    <td className="text-gray-700">
                      {Object.entries(t.mediana_s).sort((a, b) => a[1] - b[1]).map(([k, v]) => `${EVENTOS[k] || k} ${Math.round(v)} s`).join(' → ')}
                      {t.sin_salir > 0 && <span className="text-red-600"> · no sale en {t.sin_salir} de {t.realizaciones}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-3">Consignas modeladas: {cob.consignas?.join(' ')}</p>
      </Seccion>

      <Seccion titulo="Cobertura del turno y medios de protección" extra={`${cob.alertas?.length || 0} alertas`}>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(cob.roles || {}).map(([k, v]) => <span key={k} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{k}: {v}</span>)}
        </div>
        <ul className="space-y-1">
          {(cob.alertas || []).map((a, i) => <li key={i} className={`rounded-md px-2 py-1 ${ALERTA[a.nivel]}`}>{a.texto.replace(/P-[0-9A-F]{6}/g, (m) => nombre(m))}</li>)}
        </ul>
      </Seccion>

      <div className="grid lg:grid-cols-2 gap-4">
        <Seccion titulo="Reparto por salida">
          <ul className="space-y-1.5">
            {salidas.map(([sid, v]) => {
              const s = p.por_salida?.[sid] || {};
              return (
                <li key={sid} className="flex items-center gap-2">
                  <span className="w-40 truncate text-gray-700" title={s.nombre}>{sid} · {s.nombre}</span>
                  <span className="flex-1 h-3 bg-gray-100 rounded">
                    <span className={`block h-3 rounded ${s.bloqueada ? 'bg-red-300' : 'bg-vitaly-azul'}`} style={{ width: `${(100 * v) / maxSalida}%` }} />
                  </span>
                  <span className="w-24 text-right tabular-nums text-gray-600">{s.bloqueada ? 'bloqueada' : `${v} pers.`}</span>
                </li>
              );
            })}
          </ul>
        </Seccion>
        <Seccion titulo="Últimos en salir (realización mostrada)">
          <ul className="space-y-1">
            {(p.ultimos || []).map((u) => (
              <li key={u.id} className="flex gap-2">
                <span className="tabular-nums w-14 text-right font-semibold">{u.tiempo_s === null ? 'no sale' : `${Math.round(u.tiempo_s)} s`}</span>
                <span className="text-gray-700">{nombre(u.id)} · {u.rol}{u.necesita_ayuda ? (u.herido ? ' · herido' : ' · necesita ayuda') : ''} · {u.zona || 'sin zona'} → {u.salida || '—'}</span>
              </li>
            ))}
          </ul>
          {p.reubicaciones > 0 && <p className="text-xs text-amber-700 mt-2">{p.reubicaciones} persona(s) atascadas en una esquina se adelantaron por su ruta: es una limitación conocida del modelo.</p>}
        </Seccion>
      </div>

      <Seccion titulo="Contraste hidráulico (SFPE)" abierta={false} extra={hid.tiempo_total_s ? `${fmt(hid.tiempo_total_s)} frente a ${fmt(mc.mediana)}` : ''}>
        <p className="text-gray-600 mb-2">{hid.metodo}</p>
        {dif !== null && dif > 0.3 && (
          <p className="text-amber-700 mb-2">El cálculo hidráulico y la simulación difieren un {Math.round(100 * dif)} %: suele deberse a las tareas de los equipos, a las personas que necesitan ayuda o a colas que el método simplificado no recoge. Revisa la geometría y las hipótesis.</p>
        )}
        <table className="w-full text-left">
          <thead><tr className="text-xs text-gray-500 uppercase"><th>Salida</th><th>Personas</th><th>Ancho efectivo</th><th>Recorrido máx.</th><th>Tiempo</th><th>Limita</th></tr></thead>
          <tbody>{(hid.salidas || []).map((s) => (
            <tr key={s.salida} className="border-t border-gray-100"><td className="py-1">{s.salida}</td><td>{s.personas}</td><td>{s.ancho_efectivo_m ?? '—'} m</td><td>{s.recorrido_max_m ?? '—'} m</td><td>{fmt(s.tiempo_s)}</td><td>{s.limitante || '—'}</td></tr>
          ))}</tbody>
        </table>
      </Seccion>

      <Seccion titulo="Comprobaciones normativas orientativas" abierta={false} extra={res.normativa?.marco}>
        <ul className="space-y-2">
          {(res.normativa?.requisitos || []).map((r, i) => (
            <li key={i}><div className="font-medium text-gray-800">{r.requisito} <span className="text-xs text-gray-500">· {r.referencia}</span></div>
              <div className={`text-xs ${RESULTADO[r.resultado] || 'text-gray-600'}`}>{r.resultado}</div><div className="text-gray-600">{r.detalle}</div></li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-3">{res.normativa?.nota}</p>
      </Seccion>

      <Seccion titulo="Hipótesis, avisos y trazabilidad" abierta={false}>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>Plantilla: {res.ocupacion?.origen}. {res.ocupacion?.personas} personas colocadas en su zona.</li>
          <li>Premovimiento: {res.parametros?.personas?.premovimiento?.fuente}</li>
          <li>Equipos: {res.parametros?.equipos?.fuente} Intervención del EPI: {res.parametros?.equipos?.intervencion_s} s.</li>
          {res.escenario?.incendio && <li>Humo: {res.parametros?.humo?.fuente}</li>}
          {(res.validacion?.avisos || []).map((a, i) => <li key={`v${i}`} className="text-amber-700">{a}</li>)}
          {(res.ocupacion?.avisos || []).slice(0, 8).map((a, i) => <li key={`o${i}`} className="text-gray-500">{a}</li>)}
        </ul>
        <p className="text-xs text-gray-400 mt-3 font-mono">
          Motor {res.trazabilidad?.motor} · JuPedSim {res.trazabilidad?.jupedsim} · IfcOpenShell {res.trazabilidad?.ifcopenshell} · IFC {res.trazabilidad?.ifc_sha256} · plantilla {res.trazabilidad?.personas_sha256} · semillas {res.trazabilidad?.semillas?.join(',')} · {res.trazabilidad?.duracion_calculo_s} s de cálculo
        </p>
      </Seccion>

      <p className="text-xs text-gray-500 border-t border-gray-200 pt-3">{res.aviso}</p>
    </div>
  );
}
