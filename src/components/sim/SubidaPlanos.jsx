/**
 * Subida de planos del centro: plano normal (PDF/imagen/DWG, documental) y modelo IFC (lo usa el gemelo).
 * Se usa en Documentación (Legal) y en Sim.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, CheckCircle, FileImage, Loader, AlertTriangle, Trash2, ExternalLink, Upload } from 'lucide-react';
import { api, esperarTrabajo } from '../../services/gemeloService';

const ESTADOS = {
  aprobado: { texto: 'Aprobado para simular', clase: 'bg-emerald-100 text-emerald-700' },
  pendiente_revision: { texto: 'Pendiente de revisión', clase: 'bg-amber-100 text-amber-700' },
  documental: { texto: 'Documental', clase: 'bg-gray-100 text-gray-600' },
};

export function usePlanos(centroId) {
  const [lista, setLista] = useState([]);
  const [error, setError] = useState(null);
  const recargar = useCallback(async () => {
    try { setLista(await api.planos(centroId)); setError(null); } catch (e) { setError(e.message); }
  }, [centroId]);
  useEffect(() => { recargar(); }, [recargar]);
  return { lista, error, recargar };
}

function Zona({ tipo, titulo, descripcion, acepta, icono: Icono, onArchivo, ocupado }) {
  const ref = useRef(null);
  const [encima, setEncima] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setEncima(true); }}
      onDragLeave={() => setEncima(false)}
      onDrop={(e) => { e.preventDefault(); setEncima(false); const f = e.dataTransfer.files?.[0]; if (f) onArchivo(f, tipo); }}
      className={`rounded-xl border-2 border-dashed p-5 text-center transition-all ${encima ? 'border-halo-cyan bg-halo-cyan/5' : 'border-gray-300 bg-white hover:border-halo-cyan/50'}`}
    >
      <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 flex items-center justify-center mb-3">
        {ocupado ? <Loader size={24} className="text-halo-cyan animate-spin" /> : <Icono size={24} className="text-gray-500" />}
      </div>
      <h4 className="font-semibold text-vitaly-azul text-sm">{titulo}</h4>
      <p className="text-xs text-gray-500 mt-1 mb-3">{descripcion}</p>
      <input ref={ref} type="file" accept={acepta} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onArchivo(f, tipo); e.target.value = ''; }} />
      <button type="button" disabled={ocupado} onClick={() => ref.current?.click()}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-vitaly-azul text-white hover:bg-vitaly-azul-hover disabled:opacity-50">
        <Upload size={14} /> Seleccionar archivo
      </button>
    </div>
  );
}

export default function SubidaPlanos({ centroId, compacto = false, onCambio }) {
  const { lista, error, recargar } = usePlanos(centroId);
  const [ocupado, setOcupado] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const subir = async (archivo, tipo) => {
    setOcupado(tipo);
    setMensaje(null);
    try {
      const r = await api.subirPlano(centroId, archivo, tipo);
      await recargar();
      if (r.trabajo) {
        setMensaje({ tipo: 'info', texto: 'Analizando el IFC: muros, puertas, salidas y recintos…' });
        await esperarTrabajo(r.trabajo.id);
        await recargar();
        setMensaje({ tipo: 'ok', texto: 'IFC analizado. Revísalo en Sim → Plano antes de simular.' });
      } else {
        setMensaje({ tipo: 'ok', texto: 'Plano guardado en la documentación del centro.' });
      }
      onCambio?.();
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    } finally {
      setOcupado(null);
    }
  };

  const borrar = async (p) => {
    if (!window.confirm(`¿Eliminar el plano ${p.nombre}? Esta acción no se puede deshacer.`)) return;
    try { await api.borrarPlano(centroId, p.id); await recargar(); onCambio?.(); } catch (e) { setMensaje({ tipo: 'error', texto: e.message }); }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card space-y-4">
      {!compacto && (
        <div>
          <h3 className="text-lg font-bold text-vitaly-azul flex items-center gap-2"><Box size={20} className="text-halo-cyan" /> Planos del centro</h3>
          <p className="text-sm text-gray-600">El plano normal queda como documentación del PAU. El modelo IFC alimenta el gemelo digital de evacuación (Sim).</p>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <Zona tipo="plano" titulo="Plano del centro (PDF, imagen o DWG)" descripcion="Plano de planta o de evacuación para la documentación del plan."
          acepta=".pdf,.png,.jpg,.jpeg,.dwg,.dxf,.svg,.webp" icono={FileImage} onArchivo={subir} ocupado={ocupado === 'plano'} />
        <Zona tipo="ifc" titulo="Modelo BIM en IFC" descripcion="IFC2x3 o IFC4 con muros, puertas y recintos. Se analiza en local; no sale del equipo."
          acepta=".ifc" icono={Box} onArchivo={subir} ocupado={ocupado === 'ifc'} />
      </div>
      {mensaje && (
        <div className={`text-sm rounded-lg px-3 py-2 ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-700' : mensaje.tipo === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
          {mensaje.texto}
        </div>
      )}
      {error && <div className="text-sm text-red-600">No se han podido cargar los planos: {error}</div>}
      {lista.length > 0 && (
        <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
          {lista.map((p) => {
            const est = ESTADOS[p.estado] || ESTADOS.documental;
            return (
              <li key={p.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                {p.tipo === 'ifc' ? <Box size={16} className="text-gray-500" /> : <FileImage size={16} className="text-gray-500" />}
                <span className="font-medium text-gray-800 truncate">{p.nombre}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${est.clase}`}>{est.texto}</span>
                {p.activo && <span className="text-xs text-emerald-700 inline-flex items-center gap-1"><CheckCircle size={12} /> En uso</span>}
                {p.demo && <span className="text-xs text-gray-500">(demo)</span>}
                {p.inspeccion && (
                  <span className="text-xs text-gray-500 hidden md:inline">
                    {p.inspeccion.salidas} salidas · {Math.round(p.inspeccion.superficie_m2)} m²
                    {p.inspeccion.errores > 0 && <span className="text-red-600 inline-flex items-center gap-1 ml-2"><AlertTriangle size={12} />{p.inspeccion.errores} error(es)</span>}
                  </span>
                )}
                <span className="ml-auto flex items-center gap-2">
                  <a href={api.urlArchivo(centroId, p.id)} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-800" aria-label="Abrir archivo"><ExternalLink size={15} /></a>
                  {!p.demo && <button type="button" onClick={() => borrar(p)} className="text-gray-400 hover:text-red-600" aria-label="Eliminar plano"><Trash2 size={15} /></button>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
