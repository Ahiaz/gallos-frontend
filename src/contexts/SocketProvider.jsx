/*
Componente: SocketProvider.jsx
Descripcion: Este componente es un proveedor de contexto que maneja los sockets
Autor: Jose Ahias Vargas Pacheco
*/

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SocketContext } from "./SocketContext";
import { io } from "socket.io-client";
import { useSecurity } from "../hooks/useSecurity";

export const SocketProvider = ({ children }) => {
  const socketUrl = import.meta.env.VITE_API_URL;
  const { token, iduser, role } = useSecurity();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

// Función para unirse a un cuarto específico
  const joinRoom = useCallback((roomName) => {
    if (socket) {
      console.log(`Joining room: ${roomName}`);
      socket.emit("join_room", roomName);
    }
  }, [socket]);

  // Función para salir de un cuarto
  const leaveRoom = useCallback((roomName) => {
    if (socket) {
      console.log(`Leaving room: ${roomName}`);
      socket.emit("leave_room", roomName);
    }
  }, [socket]);




  useEffect(() => {
if (!token || !iduser) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    const socketInstance = io(socketUrl, {
      auth: { token, iduser }, //pasamos el iduser para unir al usuario a un cuarto automatico y el token para verificar que es valido
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("🟢 Socket conectado:", socketInstance.id);
      //apenas se conecta el usuario, en el api se une a su cuarto por id y a un cuarto de notificaciones
      //ademas en el LiveBetProvider se une al de LIVE_ROOM
      // Al setear el estado, notificamos a TODA la app que el socket ya existe

      setSocket(socketInstance);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔴 Socket desconectado:", reason);
      // Solo reconectar manualmente si el servidor forzó la desconexión
      if (reason === "io server disconnect") {
        socketInstance.connect();
      }
    });

    socketInstance.on("connect_error", (err) => {
      console.log("❌ Error socket:", err.message);
    });

    return () => {
      if (socketInstance) {
        // Importante: quitar listeners antes de desconectar para evitar fugas
        socketInstance.removeAllListeners();
        socketInstance.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
    };
  }, [iduser, role, socketUrl, token]);

  // Memoizamos el valor para que los hijos no se re-rendericen si el socket no cambia
  const contextValue = useMemo(() => ({ socket, joinRoom, leaveRoom }), [joinRoom, leaveRoom, socket]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};