/**
 * Módulo de Microlearning
 * Videos formativos con placeholders
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Volume2,
  Maximize2,
  AlertTriangle,
  Heart,
  MapPin,
  Flame,
} from 'lucide-react';

export default function MicrolearningModule({ modules, completedModules, onModuleComplete, onContinue }) {
  const [activeModule, setActiveModule] = useState(null);
  const [watchProgress, setWatchProgress] = useState({});
  const [videoErrors, setVideoErrors] = useState({});
  const videoRefs = useRef({});

  const allCompleted = completedModules.length >= modules.length;

  const getModuleIcon = (index) => {
    const icons = [AlertTriangle, Heart, MapPin, Flame];
    const Icon = icons[index] || AlertTriangle;
    return Icon;
  };

  const getModuleColor = (index) => {
    const colors = ['orange', 'blue', 'green', 'red'];
    return colors[index] || 'gray';
  };

  const getColorClasses = (color) => {
    const colorMap = {
      orange: {
        bg: 'bg-orange-500/20',
        text: 'text-orange-500',
      },
      blue: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-500',
      },
      green: {
        bg: 'bg-green-500/20',
        text: 'text-green-500',
      },
      red: {
        bg: 'bg-red-500/20',
        text: 'text-red-500',
      },
      gray: {
        bg: 'bg-gray-500/20',
        text: 'text-gray-500',
      },
    };
    return colorMap[color] || colorMap.gray;
  };

  // Manejar reproducción de video
  const handleWatchVideo = (moduleId) => {
    // Si ya hay un error, mostrar el mensaje de error
    if (videoErrors[moduleId]) {
      setActiveModule(moduleId);
      return;
    }
    
    setActiveModule(moduleId);
    setWatchProgress(prev => ({ ...prev, [moduleId]: 0 }));
  };

  // Efecto para reproducir automáticamente cuando el video está listo
  useEffect(() => {
    if (activeModule && !videoErrors[activeModule]) {
      const videoElement = videoRefs.current[activeModule];
      if (videoElement) {
        let timeoutId = null;
        
        // Función para intentar reproducir
        const tryPlay = () => {
          if (videoElement.readyState >= 2) {
            // Video tiene datos suficientes, intentar reproducir
            videoElement.play().catch(err => {
              // Solo mostrar error en desarrollo
              if (import.meta.env.DEV) {
                console.warn('No se pudo reproducir el video:', activeModule, err);
              }
              setVideoErrors(prev => ({ ...prev, [activeModule]: true }));
            });
          } else if (videoElement.readyState >= 1) {
            // Video tiene metadatos, esperar un poco más
            timeoutId = setTimeout(tryPlay, 100);
          } else if (videoElement.error) {
            // Error al cargar
            setVideoErrors(prev => ({ ...prev, [activeModule]: true }));
          } else {
            // Esperar a que el video cargue
            timeoutId = setTimeout(tryPlay, 100);
          }
        };

        // Handlers para eventos del video
        const handleLoadedData = () => tryPlay();
        const handleCanPlay = () => tryPlay();

        // Si el video ya está cargado, reproducir inmediatamente
        if (videoElement.readyState >= 2) {
          videoElement.play().catch(err => {
            if (import.meta.env.DEV) {
              console.warn('No se pudo reproducir el video:', activeModule, err);
            }
            setVideoErrors(prev => ({ ...prev, [activeModule]: true }));
          });
        } else {
          // Esperar a que el video cargue
          videoElement.addEventListener('loadeddata', handleLoadedData, { once: true });
          videoElement.addEventListener('canplay', handleCanPlay, { once: true });
          
          // Si después de 2 segundos no se ha cargado, intentar de todos modos
          timeoutId = setTimeout(() => {
            if (videoElement.readyState >= 1) {
              tryPlay();
            }
          }, 2000);
        }

        // Limpieza
        return () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          videoElement.removeEventListener('loadeddata', handleLoadedData);
          videoElement.removeEventListener('canplay', handleCanPlay);
        };
      }
    }
  }, [activeModule, videoErrors]);

  // Marcar como visto manualmente si el video falla
  const handleMarkAsWatched = (moduleId) => {
    setWatchProgress(prev => ({ ...prev, [moduleId]: 100 }));
    onModuleComplete(moduleId);
    setActiveModule(null);
  };

  // Manejar progreso del video
  const handleVideoTimeUpdate = (moduleId, event) => {
    const video = event.target;
    if (video.duration) {
      const progress = (video.currentTime / video.duration) * 100;
      setWatchProgress(prev => ({ ...prev, [moduleId]: progress }));
    }
  };

  // Manejar finalización del video
  const handleVideoEnded = (moduleId) => {
    setWatchProgress(prev => ({ ...prev, [moduleId]: 100 }));
    onModuleComplete(moduleId);
    setActiveModule(null);
  };

  // Callback ref para video - solo actualiza si cambia
  const setVideoRef = (moduleId) => (ref) => {
    if (ref && videoRefs.current[moduleId] !== ref) {
      videoRefs.current[moduleId] = ref;
    } else if (!ref && videoRefs.current[moduleId]) {
      delete videoRefs.current[moduleId];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-vitaly-azul mb-2">Formación en Video</h3>
        <p className="text-gray-500">
          Completa los 4 módulos de microlearning para continuar
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <CheckCircle size={16} className={completedModules.length > 0 ? 'text-green-500' : 'text-gray-400'} />
            <span>{completedModules.length}/{modules.length} completados</span>
          </div>
        </div>
      </div>

      {/* Grid de módulos */}
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module, index) => {
          const Icon = getModuleIcon(index);
          const color = getModuleColor(index);
          const colorClasses = getColorClasses(color);
          const isCompleted = completedModules.includes(module.id);
          const isActive = activeModule === module.id;
          const progress = watchProgress[module.id] || 0;

          return (
            <div
              key={module.id}
              className={`bg-white rounded-xl border overflow-hidden transition-all ${
                isCompleted 
                  ? 'border-green-500/30' 
                  : isActive 
                  ? 'border-vitaly-amarillo/50' 
                  : 'border-gray-200'
              }`}
            >
              {/* Video player */}
              <div className="relative aspect-video bg-vitaly-gris-claro overflow-hidden">
                {module.videoUrl ? (
                  <>
                    {/* Video element */}
                    {!videoErrors[module.id] ? (
                      <video
                        ref={setVideoRef(module.id)}
                        src={isActive ? module.videoUrl : undefined}
                        className={`w-full h-full object-cover ${isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}
                        onTimeUpdate={(e) => handleVideoTimeUpdate(module.id, e)}
                        onEnded={() => handleVideoEnded(module.id)}
                        onError={(e) => {
                          // Solo mostrar error detallado en desarrollo
                          if (import.meta.env.DEV) {
                            console.warn('Video no disponible:', module.videoUrl);
                          }
                          setVideoErrors(prev => ({ ...prev, [module.id]: true }));
                          // NO marcar como completado automáticamente
                          // Solo mostrar el error y esperar acción del usuario
                        }}
                        playsInline
                        controls={isActive}
                        preload="metadata"
                      />
                    ) : (
                      /* Fallback cuando hay error de carga */
                      <div className="absolute inset-0 flex items-center justify-center bg-vitaly-gris-claro z-20">
                        <div className="text-center p-6">
                          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                          <p className="text-sm text-gray-700 mb-2 font-semibold">No se pudo cargar el video</p>
                          <p className="text-xs text-gray-500 mb-4">
                            El archivo de video no está disponible en este momento.
                          </p>
                          {isActive && (
                            <button
                              onClick={() => handleMarkAsWatched(module.id)}
                              className="px-4 py-2 bg-vitaly-amarillo/20 text-vitaly-azul rounded-lg hover:bg-vitaly-amarillo/30 transition-colors text-sm font-medium"
                            >
                              Marcar como visto
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay cuando no está activo */}
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                        {isCompleted ? (
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                              <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                            <p className="text-sm text-green-700">Módulo completado</p>
                          </div>
                        ) : videoErrors[module.id] ? (
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                              <AlertTriangle className="h-8 w-8 text-orange-500" />
                            </div>
                            <p className="text-sm text-orange-700">Error al cargar</p>
                            <p className="text-xs text-gray-500 mt-1">Haz clic para ver opciones</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className={`w-16 h-16 rounded-full ${colorClasses.bg} flex items-center justify-center mx-auto mb-3`}>
                              <Icon className={`h-8 w-8 ${colorClasses.text}`} />
                            </div>
                            <p className="text-sm text-gray-500">{module.videoPlaceholder.duracion}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Progress bar */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/60">
                        <div 
                          className="h-full bg-vitaly-amarillo transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}

                    {/* Badge de completado */}
                    {isCompleted && !isActive && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          ✓ Visto
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  /* Fallback si no hay video URL */
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isActive ? (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-vitaly-amarillo/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                          <Volume2 className="h-8 w-8 text-vitaly-azul" />
                        </div>
                        <p className="text-sm text-gray-500">Reproduciendo video...</p>
                        <div className="mt-2 text-2xl font-bold text-vitaly-azul">{Math.round(progress)}%</div>
                      </div>
                    ) : isCompleted ? (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <p className="text-sm text-green-700">Módulo completado</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-full ${colorClasses.bg} flex items-center justify-center mx-auto mb-3`}>
                          <Icon className={`h-8 w-8 ${colorClasses.text}`} />
                        </div>
                        <p className="text-sm text-gray-500">{module.videoPlaceholder.duracion}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info del módulo */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-vitaly-azul">{module.titulo}</h4>
                    <p className="text-sm text-gray-500 mt-1">{module.descripcion}</p>
                  </div>
                </div>

                {/* Lista de contenidos */}
                <div className="mt-3 space-y-1">
                  {module.contenido.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                      <ChevronRight size={12} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Botón de acción */}
                <div className="mt-4">
                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                      <CheckCircle size={16} />
                      <span>Completado</span>
                    </div>
                  ) : videoErrors[module.id] ? (
                    <button
                      onClick={() => handleMarkAsWatched(module.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-700 rounded-lg hover:bg-orange-500/30 transition-colors text-sm font-medium"
                    >
                      <AlertTriangle size={16} />
                      Marcar como visto
                    </button>
                  ) : isActive ? (
                    <div className="flex items-center gap-2 text-vitaly-azul text-sm">
                      <Clock size={16} className="animate-pulse" />
                      <span>En reproducción...</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleWatchVideo(module.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-vitaly-amarillo/10 text-vitaly-azul rounded-lg hover:bg-vitaly-amarillo/20 transition-colors text-sm font-medium"
                    >
                      <Play size={16} />
                      Ver Video
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón continuar */}
      <div className="text-center pt-6">
        <button
          onClick={onContinue}
          disabled={!allCompleted}
          className={`px-8 py-3 font-bold rounded-xl transition-colors ${
            allCompleted
              ? 'bg-vitaly-azul text-white hover:bg-vitaly-azul-hover'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {allCompleted ? 'Continuar al Quiz' : `Completa ${modules.length - completedModules.length} módulos más`}
        </button>
      </div>
    </div>
  );
}


