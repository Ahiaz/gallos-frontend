/*Componente: StreamPlayer.jsx
Descripción: Botón fijo en bottom-right que abre un monitor de streaming arrastrable.
Autor: Jose Ahias Vargas
*/

import { useCallback, useEffect, useRef, useState } from "react";
import Player from "./Player";
import { useStream } from "../../hooks/useStream";
import useDeviceType from "../../hooks/useDeviceType";
import EventService from "../../services/eventService";
import { useSecurity } from "../../hooks/useSecurity";
import { useToast } from "../../hooks/useToast";
import { TOAST } from "../../constants/toastConstants";
import { STATUS } from "../../constants/statusConstants";
import { EVENT } from "../../constants/eventConstants";

const MODAL_W = 380;
const MODAL_H = 270;

const StreamPlayer = () => {
    const { streamInfo, isPaused, openPanel, setOpenPanelVideo, playStream } = useStream();
    const { isMobile, isTablet } = useDeviceType(1200);
    const hidePopOut = isMobile || isTablet;
    const { token } = useSecurity();
    const { setToastProps } = useToast();

    const initialPos = useRef({
        x: window.innerWidth - MODAL_W - 50,
        y: window.innerHeight - MODAL_H - 50,
    });
    const positionRef = useRef(initialPos.current);
    const [position, setPosition] = useState(initialPos.current);

    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    /*Función: loadLiveEvent
    Descripción: Consulta el evento en vivo activo y carga su stream en el contexto.
    Autor: Jose Ahias Vargas
    */
    const loadLiveEvent = useCallback(async () => {
        try {
            const res = await EventService.fetchLiveEvent({}, token);
            if (res.code === STATUS.OK) {
                const url = res.data?.stream_url || null;
                const status = res.data?.status || EVENT.LIVE;
                const banner = res.data?.banner || null;
                const title = res.data?.name || 'No hay eventos en vivo';
                if (res.data) {
                    playStream(url, status, banner, title);
                } else {
                    setOpenPanelVideo(false);
                }
            } else {
                setToastProps({ message: res.message || "No se pudo cargar el video del evento en vivo", type: TOAST.DANGER });
            }
        } catch {
            setToastProps({ message: "Error al consultar el evento en vivo", type: TOAST.DANGER });
        }
    }, [playStream, setOpenPanelVideo, setToastProps, token]);

    /*useEffect: carga inicial
    Descripción: Si no hay URL de stream al montar el componente, intenta cargar el evento en vivo.
    Autor: Jose Ahias Vargas
    */
    useEffect(() => {
        if (!streamInfo.url) loadLiveEvent();
    }, [loadLiveEvent, streamInfo?.url]);

    /*useEffect: listeners de arrastre globales
    Descripción: Registra mousemove/mouseup y touchmove/touchend en window para mover el modal.
    Se monta una sola vez para evitar registros duplicados.
    Autor: Jose Ahias Vargas
    */
    useEffect(() => {
        const onMove = (e) => {
            if (!isDragging.current) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const newX = Math.max(0, Math.min(window.innerWidth - MODAL_W, clientX - dragOffset.current.x));
            const newY = Math.max(0, Math.min(window.innerHeight - 48, clientY - dragOffset.current.y));
            positionRef.current = { x: newX, y: newY };
            setPosition({ x: newX, y: newY });
        };
        const onUp = () => { isDragging.current = false; };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onUp);
        };
    }, []);

    /*Función: onDragStart
    Descripción: Inicia el arrastre del modal al presionar la cabecera. Guarda el offset entre
    el cursor y la esquina del modal para mantener la posición relativa durante el movimiento.
    Autor: Jose Ahias Vargas
    */
    const onDragStart = (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        e.preventDefault();
        isDragging.current = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        dragOffset.current = {
            x: clientX - positionRef.current.x,
            y: clientY - positionRef.current.y,
        };
    };

    /*Función: openPopOut
    Descripción: Abre el reproductor en una ventana emergente centrada de 800x600 independiente del navegador.
    Autor: Jose Ahias Vargas
    */
    const openPopOut = () => {
        const width = 800;
        const height = 600;
        const left = Math.round((window.screen.width / 2) - (width / 2));
        const top = Math.round((window.screen.height / 2) - (height / 2));
        window.open(
            `/stream-popout?url=${encodeURIComponent(streamInfo.url)}&title=${encodeURIComponent(streamInfo.title)}`,
            'StreamPopOut',
            `width=${width},height=${height},left=${left},top=${top},menubar=no,status=no,toolbar=no`
        );
    };

    if (!streamInfo.url) return null;

    return (
        <>
  
            {!openPanel && (
                <button
                    type="button"
                    className="fixed bottom-25 right-5 z-[9000] flex items-center gap-2.5 border border-danger-soft/45 bg-black/92 px-4 py-2.5 text-[0.68rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-sm transition hover:border-danger-soft/80 hover:bg-black animate__animated animate__fadeInUp"
                    onClick={() => setOpenPanelVideo(true)}
                    title="Abrir monitor de transmisión"
                >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-danger-soft shadow-[0_0_0_5px_rgba(239,71,111,0.15)] animate-pulse" />
                    Monitor en vivo
                    <i className="bi bi-chevron-up text-white/50" />
                </button>
            )}


            {openPanel && (
                <div
                    className="fixed z-[9000] overflow-hidden border border-white/15 bg-[#0a0a0a] shadow-[0_20px_70px_rgba(0,0,0,0.75)] animate__animated animate__fadeIn"
                    style={{ left: position.x, top: position.y, width: MODAL_W }}
                >
             
                    <div
                        className="flex cursor-grab select-none items-center justify-between gap-2 border-b border-white/10 bg-black/60 px-3 py-2 active:cursor-grabbing"
                        onMouseDown={onDragStart}
                        onTouchStart={onDragStart}
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-danger-soft shadow-[0_0_0_5px_rgba(239,71,111,0.13)] animate-pulse" />
                            <div className="min-w-0">
                                <p className="mb-0 text-[0.58rem] font-black uppercase tracking-[0.16em] text-gold-300/70">
                                    Monitor de transmisión
                                </p>
                                <p className="mb-0 truncate text-[0.68rem] font-black uppercase tracking-[0.08em] text-white">
                                    {streamInfo.title || "En vivo"}
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
               
                            {!hidePopOut && streamInfo.url && (
                                <button
                                    type="button"
                                    className="flex h-6 w-6 items-center justify-center border border-gold-400/25 bg-gold-400/10 text-gold-300 transition hover:bg-gold-400/22"
                                    title="Abrir en ventana"
                                    onClick={(e) => { e.stopPropagation(); openPopOut(); }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <i className="bi bi-window-stack" style={{ fontSize: '0.62rem' }} />
                                </button>
                            )}
           
                            <button
                                type="button"
                                className="flex h-6 w-6 items-center justify-center border border-white/15 bg-white/[0.06] text-white/65 transition hover:bg-white/[0.13]"
                                title="Minimizar"
                                onClick={(e) => { e.stopPropagation(); setOpenPanelVideo(false); }}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <i className="bi bi-dash-lg" style={{ fontSize: '0.62rem' }} />
                            </button>
      
                        </div>
                    </div>

                    <div className="bg-black/40 p-2">
                        <Player
                            streamUrl={streamInfo?.url}
                            status={streamInfo?.status}
                            bannerUrl={streamInfo?.banner}
                            isPaused={isPaused}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default StreamPlayer;
