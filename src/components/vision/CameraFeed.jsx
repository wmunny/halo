import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Pause, Play, VideoOff } from 'lucide-react';

const hora = () => new Date().toLocaleTimeString('es-ES');

export default function CameraFeed({ camara, onExpand, isExpanded }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reloj, setReloj] = useState(hora());

  useEffect(() => {
    const id = setInterval(() => setReloj(hora()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    videoRef.current?.play().catch(() => setIsPlaying(false));
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const online = camara.estado === 'online';

  return (
    <div className="relative h-full bg-black rounded-lg overflow-hidden group">
      {online ? (
        <video
          ref={videoRef}
          src={camara.videoSrc}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          autoPlay
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <VideoOff size={32} />
        </div>
      )}

      {/* Barra superior */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {online ? (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                REC
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">OFFLINE</span>
            )}
            <span className="text-white text-sm font-semibold">{camara.nombre}</span>
          </div>
          <span className="text-white/80 text-xs font-mono">{reloj}</span>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-xs truncate max-w-[60%]">
            {camara.ubicacion} · {camara.resolucion} · {camara.fps} fps
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={() => onExpand(camara.id)}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
              aria-label={isExpanded ? 'Volver a la cuadrícula' : 'Ampliar'}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
