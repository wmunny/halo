/**
 * Visor 2D del gemelo: dibuja el plano deducido del IFC, los medios de protección con su estado, el humo
 * esquemático y reproduce las trayectorias CALCULADAS por el motor (no simula en el navegador).
 * En modo selección, un clic sobre el plano devuelve el punto en coordenadas del IFC (metros).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

export const COLORES_ROL = {
  0: { color: '#6683B4', nombre: 'Trabajador' },
  1: { color: '#029968', nombre: 'EAE (barrido)' },
  2: { color: '#990066', nombre: 'EPA / apoyo' },
  3: { color: '#F7901F', nombre: 'EPI / ESI' },
  4: { color: '#002F82', nombre: 'Mando (JE, JI, recuento)' },
  5: { color: '#111827', nombre: 'Necesita ayuda / herido' },
};
const COLOR_MEDIO = { ok: '#029968', pendiente_revision: '#FFB700', baja_temporal: '#DC3545', incidencia: '#DC3545' };

function buscarFrame(frames, t) {
  let lo = 0; let hi = frames.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (frames[mid][0] <= t) lo = mid; else hi = mid - 1;
  }
  return lo;
}

export default function VisorPlano({
  geo, medios = [], frames = null, humo = null, fuego = null, accidente = null, bloqueadas = [],
  posiciones = null, modo = 'ver', onPunto = null, marcas = [], mostrarPuertas = false, altoMax = 560,
}) {
  const contRef = useRef(null);
  const canvasRef = useRef(null);
  const humoCanvas = useRef(null);
  const [ancho, setAncho] = useState(800);
  const [t, setT] = useState(0);
  const [play, setPlay] = useState(false);
  const [vel, setVel] = useState(8);
  const tRef = useRef(0);
  const tFin = frames && frames.length ? frames[frames.length - 1][0] : 0;

  useEffect(() => {
    const ro = new ResizeObserver((e) => setAncho(Math.max(320, e[0].contentRect.width)));
    if (contRef.current) ro.observe(contRef.current);
    return () => ro.disconnect();
  }, []);

  // Nueva simulación: reproducir desde el principio.
  useEffect(() => { tRef.current = 0; setT(0); setPlay(!!(frames && frames.length)); }, [frames]);

  // Imagen del humo: celdas de la rejilla con su instante de llegada.
  useEffect(() => {
    if (!humo) { humoCanvas.current = null; return; }
    const c = document.createElement('canvas');
    c.width = humo.nx; c.height = humo.ny;
    humoCanvas.current = { canvas: c, ctx: c.getContext('2d'), img: c.getContext('2d').createImageData(humo.nx, humo.ny) };
  }, [humo]);

  const vista = useMemo(() => {
    if (!geo) return null;
    const [x0, y0, x1, y1] = geo.bounds;
    const m = 3;
    const w = x1 - x0 + 2 * m; const h = y1 - y0 + 2 * m;
    const esc = Math.min(ancho / w, altoMax / h);
    return { x0: x0 - m, y0: y0 - m, w, h, esc, pw: Math.round(w * esc), ph: Math.round(h * esc) };
  }, [geo, ancho, altoMax]);

  const aPantalla = useCallback((x, y) => [(x - vista.x0) * vista.esc, (vista.y0 + vista.h - y) * vista.esc], [vista]);

  const dibujar = useCallback((tiempo) => {
    const cv = canvasRef.current;
    if (!cv || !vista) return;
    const dpr = window.devicePixelRatio || 1;
    if (cv.width !== vista.pw * dpr) { cv.width = vista.pw * dpr; cv.height = vista.ph * dpr; }
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, vista.pw, vista.ph);
    g.fillStyle = '#F8FAFC';
    g.fillRect(0, 0, vista.pw, vista.ph);
    const poligono = (anillo) => {
      anillo.forEach(([x, y], i) => { const [px, py] = aPantalla(x, y); if (i) g.lineTo(px, py); else g.moveTo(px, py); });
      g.closePath();
    };
    // Suelo transitable (con huecos).
    g.beginPath();
    geo.suelo.forEach(poligono);
    geo.huecos.forEach(poligono);
    g.fillStyle = '#FFFFFF';
    g.fill('evenodd');
    // Humo.
    if (humo && humoCanvas.current && tiempo > 0) {
      const { canvas, ctx, img } = humoCanvas.current;
      const d = img.data;
      for (let j = 0; j < humo.ny; j += 1) {
        for (let i = 0; i < humo.nx; i += 1) {
          const ll = humo.llegada[j * humo.nx + i];
          const k = ((humo.ny - 1 - j) * humo.nx + i) * 4;
          const nivel = ll < 0 ? 0 : Math.min(1, Math.max(0, (tiempo - ll / 10) / humo.rampa));
          d[k] = 90; d[k + 1] = 90; d[k + 2] = 100; d[k + 3] = Math.round(150 * nivel);
        }
      }
      ctx.putImageData(img, 0, 0);
      const [px, py] = aPantalla(humo.x0, humo.y0 + humo.ny * humo.celda);
      g.imageSmoothingEnabled = true;
      g.save();
      g.beginPath(); geo.suelo.forEach(poligono); geo.huecos.forEach(poligono); g.clip('evenodd');
      g.drawImage(canvas, px, py, humo.nx * humo.celda * vista.esc, humo.ny * humo.celda * vista.esc);
      g.restore();
    }
    // Recintos (etiquetas).
    g.font = `${Math.max(10, Math.min(13, vista.esc * 1.6))}px Inter, system-ui, sans-serif`;
    g.textAlign = 'center';
    g.fillStyle = '#94A3B8';
    (geo.recintos || []).forEach((r) => { const [px, py] = aPantalla(r.centro[0], r.centro[1]); g.fillText(r.nombre, px, py); });
    // Obstáculos y muros.
    g.fillStyle = '#E2E8F0';
    geo.obst.forEach((a) => { g.beginPath(); poligono(a); g.fill(); });
    g.fillStyle = '#334155';
    geo.muros.forEach((a) => { g.beginPath(); poligono(a); g.fill(); });
    // Salidas.
    geo.salidas.forEach((s) => {
      const bloq = bloqueadas.includes(s.id) || bloqueadas.includes(s.nombre);
      g.beginPath(); poligono(s.pol);
      g.fillStyle = bloq ? '#F1AEB5' : '#A3DFC8';
      g.fill();
      const [px, py] = aPantalla(s.centro[0], s.centro[1]);
      if (bloq) {
        g.strokeStyle = '#A52834'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(px - 5, py - 5); g.lineTo(px + 5, py + 5); g.moveTo(px + 5, py - 5); g.lineTo(px - 5, py + 5); g.stroke();
      }
      g.fillStyle = bloq ? '#A52834' : '#027A53';
      g.font = '600 10px Inter, system-ui, sans-serif';
      g.fillText(s.id, px, py - 8);
    });
    // Puertas del IFC (revisión del plano).
    if (mostrarPuertas) {
      (geo.puertas || []).forEach((p) => {
        const [px, py] = aPantalla(p.centro[0], p.centro[1]);
        g.fillStyle = p.exterior ? '#029968' : '#64748B';
        g.fillRect(px - 2.5, py - 2.5, 5, 5);
      });
    }
    // Medios de protección.
    medios.forEach((m) => {
      const [px, py] = aPantalla(m.x, m.y);
      const col = COLOR_MEDIO[m.estado] || '#64748B';
      g.lineWidth = 2;
      g.strokeStyle = col;
      g.fillStyle = '#FFFFFF';
      g.beginPath();
      if (m.tipo === 'bie') g.rect(px - 4, py - 4, 8, 8);
      else if (m.tipo === 'puerta_rf') { g.moveTo(px, py - 5); g.lineTo(px + 5, py + 4); g.lineTo(px - 5, py + 4); g.closePath(); }
      else g.arc(px, py, 4, 0, Math.PI * 2);
      g.fill(); g.stroke();
      if (!m.operativo && m.operativo !== undefined) {
        g.beginPath(); g.moveTo(px - 4, py - 4); g.lineTo(px + 4, py + 4); g.stroke();
      }
    });
    // Marcas (salidas manuales, puntos elegidos).
    marcas.forEach((mk) => {
      const [px, py] = aPantalla(mk.x, mk.y);
      g.fillStyle = mk.color || '#002F82';
      g.beginPath(); g.arc(px, py, 6, 0, Math.PI * 2); g.fill();
      if (mk.texto) { g.fillStyle = '#0F172A'; g.font = '600 11px Inter, system-ui, sans-serif'; g.fillText(mk.texto, px, py - 9); }
    });
    // Foco del incendio y accidente.
    if (fuego) {
      const [px, py] = aPantalla(fuego.x, fuego.y);
      const rg = g.createRadialGradient(px, py, 1, px, py, 14);
      rg.addColorStop(0, 'rgba(255,200,0,1)'); rg.addColorStop(0.5, 'rgba(255,90,0,0.9)'); rg.addColorStop(1, 'rgba(255,60,0,0)');
      g.fillStyle = rg; g.beginPath(); g.arc(px, py, 14, 0, Math.PI * 2); g.fill();
    }
    if (accidente) {
      const [px, py] = aPantalla(accidente.x, accidente.y);
      g.fillStyle = '#DC3545';
      g.fillRect(px - 7, py - 2.5, 14, 5); g.fillRect(px - 2.5, py - 7, 5, 14);
    }
    // Personas.
    const r = Math.max(2.2, 0.24 * vista.esc);
    const pintar = (x, y, cod, estado, enHumo) => {
      const [px, py] = aPantalla(x, y);
      let col = COLORES_ROL[cod]?.color || '#6683B4';
      if (cod === 0 && estado === 2) col = '#FFB700';
      if (cod === 0 && estado === 0 && tiempo > 0) col = '#CCD6E6';
      g.beginPath(); g.arc(px, py, r, 0, Math.PI * 2);
      g.fillStyle = col; g.fill();
      if (cod === 5) { g.lineWidth = 2; g.strokeStyle = '#FFB700'; g.stroke(); }
      if (enHumo) { g.lineWidth = 1.5; g.strokeStyle = '#111827'; g.stroke(); }
    };
    if (frames && frames.length) {
      const f = frames[buscarFrame(frames, tiempo)][1];
      for (let k = 0; k < f.length; k += 6) pintar(f[k + 1] / 100, f[k + 2] / 100, f[k + 5], f[k + 3], f[k + 4]);
    } else if (posiciones) {
      const codigo = { equipo_alarma_evacuacion: 1, equipo_primeros_auxilios: 2, equipo_primera_intervencion: 3,
        equipo_segunda_intervencion: 3, jefe_emergencia: 4, jefe_intervencion: 4, responsable_recuento: 4 };
      posiciones.forEach((p) => pintar(p.x, p.y, p.necesita_ayuda ? 5 : (codigo[p.rol] || 0), 1, 0));
    }
  }, [vista, geo, humo, medios, bloqueadas, marcas, fuego, accidente, frames, posiciones, aPantalla, mostrarPuertas]);

  // Bucle de reproducción.
  useEffect(() => {
    if (!play || !frames) return undefined;
    let raf; let previo = performance.now();
    const paso = (ahora) => {
      const nuevo = Math.min(tFin, tRef.current + ((ahora - previo) / 1000) * vel);
      previo = ahora;
      tRef.current = nuevo;
      setT(nuevo);
      dibujar(nuevo);
      if (nuevo >= tFin) { setPlay(false); return; }
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [play, frames, vel, tFin, dibujar]);

  useEffect(() => { dibujar(tRef.current); }, [dibujar]);

  const clic = (e) => {
    if (modo === 'ver' || !onPunto || !vista) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left; const py = e.clientY - rect.top;
    const x = px / vista.esc + vista.x0;
    const y = vista.y0 + vista.h - py / vista.esc;
    onPunto(Math.round(x * 100) / 100, Math.round(y * 100) / 100);
  };

  const nPersonas = frames && frames.length ? frames[buscarFrame(frames, t)][1].length / 6 : null;

  return (
    <div ref={contRef} className="w-full">
      {!geo ? (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">Sin plano</div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            onClick={clic}
            style={{ width: vista.pw, height: vista.ph, cursor: modo === 'ver' ? 'default' : 'crosshair' }}
            className="rounded-lg border border-gray-200 mx-auto block"
          />
          {frames && frames.length > 0 && (
            <div className="flex items-center gap-3 mt-3 text-sm">
              <button type="button" onClick={() => { if (tRef.current >= tFin) { tRef.current = 0; } setPlay(!play); }}
                className="p-2 rounded-lg bg-vitaly-azul text-white hover:bg-vitaly-azul-hover" aria-label={play ? 'Pausar' : 'Reproducir'}>
                {play ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button type="button" onClick={() => { tRef.current = 0; setT(0); dibujar(0); }}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50" aria-label="Volver al inicio"><RotateCcw size={16} /></button>
              <input type="range" min={0} max={tFin} step={0.5} value={t} className="flex-1 accent-vitaly-azul"
                onChange={(e) => { const v = Number(e.target.value); tRef.current = v; setT(v); dibujar(v); }} aria-label="Instante" />
              <span className="tabular-nums w-28 text-right text-gray-700">{t.toFixed(0)} s / {tFin.toFixed(0)} s</span>
              <select value={vel} onChange={(e) => setVel(Number(e.target.value))} className="border border-gray-300 rounded-md px-2 py-1" aria-label="Velocidad">
                {[2, 4, 8, 16, 32].map((v) => <option key={v} value={v}>×{v}</option>)}
              </select>
              <span className="text-gray-500 w-28 text-right">{nPersonas} dentro</span>
            </div>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
            {Object.values(COLORES_ROL).map((c) => (
              <span key={c.nombre} className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c.color }} />{c.nombre}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block bg-amber-500" />En cola</span>
            {medios.length > 0 && (
              <span className="inline-flex items-center gap-1.5">Medios: <span className="text-emerald-600">● ok</span>
                <span className="text-amber-500">● revisión pendiente</span><span className="text-red-500">● fuera de servicio</span></span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
