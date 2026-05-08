/*
Hook: useLiveBetSockets
Descripción: Encapsula toda la escucha de eventos de apuestas en vivo.
*/
import { useEffect, useRef } from 'react';
import { SOCKET_EVENTS } from '../../constants/socketConstants';

export const useLiveBetSockets = (socket, props) => {
    // 1. Referencia persistente para las props (setBets, setStats, loadLiveBets)
    const propsRef = useRef(null);

    // 2. Sincronizamos la referencia en cada renderizado
    useEffect(() => {
        propsRef.current = props;
    });

    useEffect(() => {
        if (!socket) {
            console.log("⏳ Esperando instancia reactiva del socket...");
            return;
        }

        // Helper para acceder a las funciones actuales sin disparar el efecto
        const getProps = () => propsRef.current;

        console.log("Suscribiendo a eventos de las apuestas en vivo (Monitor)");


        // --- HANDLERS INTERNOS ---

        const onLiveBets = (data) => {
            console.log("cambios detectado, actualizado monitor de apuestas...", data);
            const { setBets, setStats } = getProps();
            if (setBets) setBets(data.bets || []);
            if (setStats) setStats(data.stats || {});
        };

        const onReconnect = () => {
            console.log("🔄 Re-conectado en Monitor. Sincronizando apuestas...");
            const { loadLiveBets } = getProps();
            if (loadLiveBets) loadLiveBets();
        };

        socket.on(SOCKET_EVENTS.GLOBAL.LIVE_MONITOR_UPDATED, onLiveBets);
        socket.on("reconnect", onReconnect);

        // --- LIMPIEZA ---

        return () => {
            socket.off(SOCKET_EVENTS.GLOBAL.LIVE_MONITOR_UPDATED, onLiveBets);
            socket.off("reconnect", onReconnect);

        };
    }, [socket]);
};