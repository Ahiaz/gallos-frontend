/*
Hook: useLiveChatSockets
Descripción: Encapsula toda la escucha de eventos del chat en vivo.
*/
import { useEffect, useRef } from 'react';
import { SOCKET_EVENTS } from '../../constants/socketConstants';
import { useSecurity } from "../useSecurity";

export const useLiveChatSockets = (socket, props) => {
    // 1. Referencia persistente para las props (setBets, setStats, loadLiveBets)
    const propsRef = useRef(null);
    const { iduser, setChatBlock } = useSecurity();

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

        console.log("Suscribiendo a eventos del chat");


        // --- HANDLERS INTERNOS ---

        const onNewMessage = (data) => {
            console.log("nuevo mensaje", data);
            const {setMessages} = getProps();
            setMessages(prev => [...prev.slice(-100), data]);
            
        };

        const onChatBlocked = (data) => {
            console.log("nuevo blockeado", data);
            const {setMessages} = getProps();
            setMessages(data.messages);

            if(iduser == data.userBlockId){

            setChatBlock(data.blocked);

            }
            
        };

        const onReconnect = () => {
            console.log("🔄 Re-conectado chat. Sincronizando mensajes...");
            const { loadLiveChats } = getProps();
            if (loadLiveChats) loadLiveChats();
        };

        socket.on(SOCKET_EVENTS.GLOBAL.CHAT_NEW, onNewMessage);
        socket.on(SOCKET_EVENTS.GLOBAL.CHAT_BLOCKED, onChatBlocked);
        socket.on("reconnect", onReconnect);

        // --- LIMPIEZA ---

        return () => {
           socket.off(SOCKET_EVENTS.GLOBAL.CHAT_NEW, onNewMessage);
            socket.off(SOCKET_EVENTS.GLOBAL.CHAT_BLOCKED, onChatBlocked);
            socket.off("reconnect", onReconnect);

        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
};