/*
Hook: useLiveNotificationSockets
Descripción: Encapsula toda la escucha de eventos de socket para notificaciones globales.
Autor: Jose Ahias Vargas
*/
import { useEffect, useRef } from 'react';
import { SOCKET_EVENTS } from '../../constants/socketConstants';
import { ALERT } from '../../constants/alertConstants';
import { useSecurity } from "../useSecurity";

export const useLiveNotificationSockets = (socket, { showNotification }) => {
    const { setTheBalance } = useSecurity();
    const wasDisconnected = useRef(false);
    
    // 1. Referencia persistente para las funciones externas
    const handlersRef = useRef(null);

    // 2. Sincronizamos la referencia en cada render
    useEffect(() => {
        handlersRef.current = { showNotification, setTheBalance };
    });

    useEffect(() => {
        if (!socket) return;

        // Helper para obtener las funciones actuales
        const getHandlers = () => handlersRef.current;

        // --- HANDLERS INTERNOS ---
        const onNewLive = (data) => 
            getHandlers().showNotification(`¡${data.name} ha comenzado!`, ALERT.SUCCESS);

        const onFinish = (data) =>
            getHandlers().showNotification(`¡${data.name} ha finalizado!`, ALERT.DANGER);

        const onScheduled = () =>
            getHandlers().showNotification(`Nuevo evento programado`, ALERT.INFO);

        const onWalletUpdate = (data) => {
            if (data) {
                const balance = Number(data.balance || 0) + Number(data.bonus_balance || 0);
                if (balance > 0) {
                    getHandlers().setTheBalance(balance);
                }
                getHandlers().showNotification(data.message || `Actualización de billetera`, ALERT.INFO, true);
            }
        };

        const onDisconnect = () => {
            wasDisconnected.current = true;
            getHandlers().showNotification("Conexión perdida. Intentando reconectar...", ALERT.DANGER, true);
        };

        const onConnectError = () => {
            getHandlers().showNotification("Error de red. Por favor, refresque la página.", ALERT.DANGER, true);
        };

        const onConnect = () => {
            if (wasDisconnected.current) {
                getHandlers().showNotification("Conexión restablecida", ALERT.SUCCESS, false);
                wasDisconnected.current = false;
            }
        };

        // --- SUSCRIPCIÓN ---
        socket.on(SOCKET_EVENTS.GLOBAL.NEW_LIVE_EVENT, onNewLive);
        socket.on(SOCKET_EVENTS.GLOBAL.EVENT_FINISHED, onFinish);
        socket.on(SOCKET_EVENTS.GLOBAL.NEW_SCHEDULED_EVENT, onScheduled);
        socket.on(SOCKET_EVENTS.GLOBAL.WALLET_BALANCE_UPDATED, onWalletUpdate);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);
        socket.on("connect", onConnect);

        // --- LIMPIEZA ---
        return () => {
            socket.off(SOCKET_EVENTS.GLOBAL.NEW_LIVE_EVENT, onNewLive);
            socket.off(SOCKET_EVENTS.GLOBAL.EVENT_FINISHED, onFinish);
            socket.off(SOCKET_EVENTS.GLOBAL.NEW_SCHEDULED_EVENT, onScheduled);
            socket.off(SOCKET_EVENTS.GLOBAL.WALLET_BALANCE_UPDATED, onWalletUpdate);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
            socket.off("connect", onConnect);
        };
    }, [socket]); // Única dependencia: el socket
};