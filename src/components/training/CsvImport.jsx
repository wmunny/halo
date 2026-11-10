/**
 * Importar listado de trabajadores desde un CSV.
 * El archivo se lee en el navegador; no se envía a ningún servidor.
 */
import React, { useRef, useState } from 'react';
import { AlertTriangle, CheckCircle, Download, FileSpreadsheet, Upload, X } from 'lucide-react';
import { leerCsvTrabajadores, plantillaCsv } from '../../utils/csvTrabajadores';
import { etiquetasRolPAU, importarTrabajadores } from '../../data/trainingMockData';

function descargarPlantilla() {
  const blob = new Blob([plantillaCsv()], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'plantilla_trabajadores_halo.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function CsvImport({ centroId, centroNombre, onClose, onImported }) {
  const inputRef = useRef(null);
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [modo, setModo] = useState('reemplazar');
  const [arrastrando, setArrastrando] = useState(false);

  const procesar = (file) => {
    if (!file) return;
    if (!/\.(csv|txt)$/i.test(file.name)) {
      setArchivo(file);
      setResultado({ trabajadores: [], avisos: ['El archivo debe ser .csv'], columnas: [], ignoradas: [] });
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      let texto = String(lector.result);
      // Si no es UTF-8 válido (CSV de Excel en Windows), releer como Windows-1252
      if (texto.includes('�')) {
        const l2 = new FileReader();
        l2.onload = () => { setArchivo(file); setResultado(leerCsvTrabajadores(String(l2.result), centroId)); };
        l2.readAsText(file, 'windows-1252');
        return;
      }
      setArchivo(file);
      setResultado(leerCsvTrabajadores(texto, centroId));
    };
    lector.readAsText(file, 'utf-8');
  };

  const confirmar = () => {
    const total = importarTrabajadores(centroId, resultado.trabajadores, modo);
    onImported?.(resultado.trabajadores.length, total);
  };

  const validos = resultado?.trabajadores.length || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-dropdown w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-vitaly-azul flex items-center gap-2">
              <FileSpreadsheet size={20} /> Importar listado de trabajadores
            </h2>
            <p className="text-sm text-gray-500">Centro: {centroNombre}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Zona de subida */}
          <div
            onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={(e) => { e.preventDefault(); setArrastrando(false); procesar(e.dataTransfer.files?.[0]); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              arrastrando ? 'border-vitaly-amarillo bg-vitaly-amarillo/5' : 'border-gray-300 hover:border-vitaly-azul hover:bg-gray-50'
            }`}
          >
            <Upload size={32} className="mx-auto mb-3 text-gray-400" />
            <p className="font-semibold text-gray-700">
              {archivo ? archivo.name : 'Arrastra aquí el CSV o haz clic para seleccionarlo'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Separador ; o , · Primera fila con cabeceras · Columnas: nombre (obligatoria), apellidos, dni, email, teléfono, departamento, puesto, turno, rol, fecha_alta
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => { procesar(e.target.files?.[0]); e.target.value = ''; }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <button onClick={descargarPlantilla} className="flex items-center gap-2 text-vitaly-azul hover:underline">
              <Download size={16} /> Descargar plantilla CSV
            </button>
            <span className="text-gray-400">Los datos se quedan en este navegador; no se envían a ningún servidor.</span>
          </div>

          {/* Resultado */}
          {resultado && (
            <div className="space-y-4">
              <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
                validos ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {validos ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                {validos
                  ? `${validos} trabajadores listos para importar`
                  : 'No se ha podido leer ningún trabajador'}
                {resultado.columnas.length > 0 && (
                  <span className="text-xs text-gray-500 ml-auto">Columnas reconocidas: {resultado.columnas.join(', ')}</span>
                )}
              </div>

              {resultado.ignoradas.length > 0 && (
                <p className="text-xs text-gray-500">Columnas ignoradas: {resultado.ignoradas.join(', ')}</p>
              )}

              {resultado.avisos.length > 0 && (
                <ul className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1 max-h-28 overflow-y-auto">
                  {resultado.avisos.map((a) => <li key={a}>• {a}</li>)}
                </ul>
              )}

              {validos > 0 && (
                <>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="px-3 py-2 text-left">Nombre</th>
                          <th className="px-3 py-2 text-left">Departamento</th>
                          <th className="px-3 py-2 text-left">Puesto</th>
                          <th className="px-3 py-2 text-left">Turno</th>
                          <th className="px-3 py-2 text-left">Rol PAU</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {resultado.trabajadores.slice(0, 8).map((t) => (
                          <tr key={t.id}>
                            <td className="px-3 py-2">
                              <div className="font-medium text-gray-900">{t.nombre} {t.apellidos}</div>
                              <div className="text-xs text-gray-500">{t.email}</div>
                            </td>
                            <td className="px-3 py-2 text-gray-600">{t.departamento}</td>
                            <td className="px-3 py-2 text-gray-600">{t.puesto}</td>
                            <td className="px-3 py-2 text-gray-600 capitalize">{t.turno}</td>
                            <td className="px-3 py-2 text-gray-600">{etiquetasRolPAU[t.rolPAU]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {validos > 8 && (
                      <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50">… y {validos - 8} más</div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={modo === 'reemplazar'} onChange={() => setModo('reemplazar')} />
                      Reemplazar la plantilla del centro
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={modo === 'anadir'} onChange={() => setModo('anadir')} />
                      Añadir a la plantilla actual
                    </label>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            Cancelar
          </button>
          <button
            onClick={confirmar}
            disabled={!validos}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-vitaly-azul rounded-lg hover:bg-vitaly-azul-hover disabled:opacity-40"
          >
            <Upload size={16} /> Importar {validos ? validos : ''} trabajadores
          </button>
        </div>
      </div>
    </div>
  );
}
