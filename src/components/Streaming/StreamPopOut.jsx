/*Componente: StreamPopOut.jsx
Descripción: muestra un popup con el reproductor de video para el streaming. Se centra en la pantalla y tiene un tamaño de 800x600. 
Se utiliza para mostrar el streaming en una ventana aparte cuando se hace clic en el botón de popout en el StreamPlayer. 
Se muestra en la parte inferior derecha de la pantalla cuando hay un streaming activo. 
Permite abrir el reproductor en una ventana aparte y cerrar el streaming.
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Player from './Player'; 
import { EVENT } from '../../constants/eventConstants';

const StreamPopOut = () => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const streamUrl = query.get('url');
    const title = query.get('title') || 'Streaming en Vivo';

    useEffect(() => {
        document.title = title;
    }, [title]);

    if (!streamUrl) return <div className="flex min-h-screen items-center justify-center bg-brand-950 p-4 text-danger-soft">Error: No se proporcionó una URL de transmisión.</div>;

    return (
        <div className="min-h-screen w-screen overflow-hidden bg-brand-950 p-4">
            <div className="mb-3  border border-white/10 bg-white/[0.04] px-4 py-3 text-white">
                <p className="mb-1 text-[0.66rem] font-black uppercase tracking-[0.18em] text-gold-300/70">Monitor de transmisión</p>
                <h1 className="mb-0 truncate text-base font-black uppercase tracking-[0.1em]">{title}</h1>
            </div>
            <Player 
                streamUrl={streamUrl} 
                status={EVENT.LIVE}
            />
        </div>
    );
};

export default StreamPopOut;
