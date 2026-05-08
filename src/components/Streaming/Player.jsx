/*
Componente: Player.jsx
Descripción: Reproductor de video para el streaming de los eventos
Autor: Jose Ahias Vargas
*/
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { EVENT } from "../../constants/eventConstants";

const Player = ({ streamUrl, status, bannerUrl, isPaused}) => {

    const videoRef = useRef(null);
    const hlsRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [error, setError] = useState(null);
    const [levels, setLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(-1); // -1 = AUTO



/*
useEffect: Control de pausa externo
Descripción: Pausa o reanuda el video según el parámetro isPaused
*/
useEffect(() => {
    if (!videoRef.current) return;

    if (isPaused) {
        videoRef.current.pause();
        console.log("Streaming pausado por parámetro");
    } else {
        // Solo intentamos reproducir si el evento está LIVE
        if (status === EVENT.LIVE) {
            videoRef.current.play().catch(err => {
                console.warn("La reproducción automática fue bloqueada o falló:", err);
            });
        }
    }
}, [isPaused, status]); // Se dispara cada vez que cambie isPaused



    /*
    useEffect
    Descripción: Configuracion del player
    Autor: Jose Ahias Vargas Pacheco
    */
    useEffect(() => {

if (hlsRef.current && hlsRef.current.url === streamUrl) return;

if (!streamUrl || !videoRef.current) {
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }
        setIsLoading(false);
        return;
    }

        setIsLoading(true);
        setError(null);

        if (Hls.isSupported()) {

            //Version baja latencia
            const hls = new Hls({
            enableWorker: false,
            autoStartLoad: true,
            startLevel: -1,
            capLevelToPlayerSize: true,
            xhrSetup: function(xhr) {
            xhr.withCredentials = false; 
           },
            // --- OPTIMIZACIÓN PARA APUESTAS (BAJA LATENCIA) ---
            maxBufferLength: 10,       // reduce el retraso
            maxMaxBufferLength: 20,    // Límite máximo de buffer
            backBufferLength: 0,       // No necesitamos guardar lo que ya pasó en un directo
            
            // Crucial: Qué tan cerca del "vivo" empezamos
            // Intentamos empezar a 3 segundos del borde final del stream
            liveSyncDurationCount: 3, 
            
            // Si hay un hueco en el buffer, saltar rápido para no quedar atrás
            maxBufferHole: 0.1, 
            highBufferWatchdogPeriod: 2,

            // --- REINTENTOS MÁS AGRESIVOS ---
            manifestLoadingMaxRetry: 10,
            manifestLoadingRetryDelay: 500, // Reintentar rápido si el manifiesto falla
            levelLoadingMaxRetry: 10,
            levelLoadingRetryDelay: 500,
            });

            hlsRef.current = hls;

            hls.loadSource(streamUrl);
            hls.attachMedia(videoRef.current);

            /*
            Eventos del player
            Descripción: Eventos
            Hls.Events.MANIFEST_PARSED: Se dispara cuando la librería termina de leer y procesar el archivo maestro .m3u8
            levels son las calidades disponibles
            Hls.Events.LEVEL_SWITCHED: Cuando la calidad del video cambia, porque el usuario eligio otra calidad
            Hls.Events.ERROR : errores fatales, se intenta reconectar dependiendo del error
            Autor: Jose Ahias Vargas Pacheco
            */

            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                setLevels(data.levels);
                setIsLoading(false);
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
                setCurrentLevel(data.level);
            });

            hls.on(Hls.Events.ERROR, (_, data) => {

                if (data.fatal) {

                    switch (data.type) {

                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.warn("Error de red, intentando reconectar...");
                            hls.startLoad();
                            break;

                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.warn("Error de media, intentando recuperar...");
                            hls.recoverMediaError();
                            break;

                        default:
                            console.error("Error fatal no recuperable");
                            setError("La transmisión no está disponible");
                            hls.destroy();
                            break;
                    }
                }
            });
            /*
            Eventos del video
            Muestra spinner mientras esta haciendo buffer y cargando
            Autor: Jose Ahias Vargas Pacheco
            */


            const video = videoRef.current;

            const handleWaiting = () => setIsBuffering(true);
            const handlePlaying = () => {
                setIsBuffering(false);
                setIsLoading(false);
            };


            const handlePlay = () => {
                console.log("Reproducción iniciada manualmente");

                if (hls) {
                    // 1. Recargamos el manifiesto para traer los últimos segmentos
                    hls.startLoad();

                    // 2. Buscamos la posición real del directo (Live Edge)
                    // Usamos liveSyncPosition de HLS.js, si no, caemos en duration
                    const targetTime = hls.liveSyncPosition ?? video.duration;

                    if (targetTime && targetTime !== Infinity) {
                        video.currentTime = targetTime;
                        console.log("Sincronizando con el directo en:", targetTime);
                    }
                }

                setIsLoading(false);
            };

            video.addEventListener("waiting", handleWaiting);
            video.addEventListener("playing", handlePlaying);
            video.addEventListener("play", handlePlay);

            return () => {
                video.removeEventListener("waiting", handleWaiting);
                video.removeEventListener("playing", handlePlaying);
                video.removeEventListener("play", handlePlay);
                if (hlsRef.current) hlsRef.current.destroy();
            };

        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = streamUrl;
            setIsLoading(false);
        }

    }, [streamUrl, status]);


    /*
    Funcion: handleQualityChange
    Cambio manual de calidad
    Autor: Jose Ahias Vargas Pacheco
    */

    const handleQualityChange = (levelIndex) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = levelIndex;
            setCurrentLevel(levelIndex);
        }
    };

    /*
    ============================
    Render por estado del evento
    ============================
    */


    const renderStatusBadge = () => {
        if (status === EVENT.LIVE) {
            return (
                <div className="rounded-full border border-emerald-400/30 bg-black/70 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-300 shadow-md">
                    ● EN VIVO
                </div>
            );
        }

        if (status === EVENT.FINISHED) {
            return (
                <div className="rounded-full border border-danger-soft/25 bg-black/70 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-danger-soft shadow-md">
                    ■ FINALIZADO
                </div>
            );
        }

        if (status === EVENT.CANCELLED) {
            return (
                <div className="rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white/75 shadow-md">
                    ■ CANCELADO
                </div>
            );
        }

        return (
            <div className="rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white/75 shadow-md">
                ○ PROGRAMADO
            </div>
        );
    };

    const renderQualityControls = () => {
        if (status !== EVENT.LIVE || levels.length <= 1) return null;

        return (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/90  text-right shadow-lg backdrop-blur-sm">
                <select
                    className="rounded-full border border-white/10 bg-black px-3 py-1 text-sm font-bold text-white outline-none focus:border-gold-400/70"
                    value={currentLevel}
                    onChange={(e) => handleQualityChange(Number(e.target.value))}
                >
                    <option value={-1}>Auto</option>
                    {levels.map((level, index) => (
                        <option key={index} value={index}>
                            {level.height ? `${level.height}p` : `Nivel ${index}`}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <div className="relative w-full text-center animate__animated animate__fadeIn">

            {/* 1. Video (Siempre arriba) nodownload noremoteplayback permite que no adelante o atrase el video*/}
            <div className="relative overflow-hidden border border-white/10 bg-black shadow-[0_22px_70px_rgba(0,0,0,0.5)]" style={{ zIndex: 4000 }}>
                <video
                    ref={videoRef}
                    controls
                    muted
                    autoPlay={status === EVENT.LIVE}
                    playsInline
                    controlsList="nodownload noremoteplayback"
                    width="100%"
                    style={{ height: 'auto', maxHeight: '520px', backgroundColor: 'black', zIndex: 4010 }}
                    poster={bannerUrl ? `${import.meta.env.VITE_API_URL}${bannerUrl}` : null}
                    className="block w-full object-contain"
                />

                <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-end p-3">
                    <div className="pointer-events-auto flex flex-col items-end gap-2">
                        {renderStatusBadge()}
                        {renderQualityControls()}
                    </div>
                </div>

                {(isLoading || isBuffering) && streamUrl && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20" style={{ zIndex: 4005 }}>
                        <div className="rounded-full border border-gold-400/25 bg-black/70 px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-gold-300">
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            {isLoading ? "Conectando" : "Buffer"}
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Sección de Mensajes (Debajo del video) */}
            <div className="absolute top-0 left-0 z-20 bg-white/[0.04] px-4 py-3 text-start">
                {error ? (
                    <div className="font-black text-danger-soft">
                        <i className="bi bi-exclamation-circle-fill me-2 !text-current"></i>
                        {error}
                    </div>
                ) : (
                    <>
                        {isLoading && streamUrl && (
                            <div className="mt-1 text-success-soft">
                                <small className="spinner-border spinner-border-sm me-2" role="status"></small>
                                <small>Conectando transmisión...</small>
                            </div>
                        )}

                        {status === EVENT.LIVE && !streamUrl && (
                            <div className="mt-1 text-danger-soft">
                                <small>Esperando señal de origen...</small>
                            </div>
                        )}

                        {status === EVENT.SCHEDULED && (
                            <div className="mt-1 text-white/45">
                                <small><i>El reproductor se activará al iniciar el evento</i></small>
                            </div>
                        )}

                        {isBuffering && !isLoading && (
                            <div className="mt-1 text-danger-soft">
                                <small>Cargando buffer...</small>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Player;

