/*
Componente: NotificationProvider.jsx
Descripcion: Proveedor que centraliza las alertas y escucha eventos de socket globales
Autor: Jose Ahias Vargas Pacheco
*/
import { useState, useRef, useCallback, useMemo } from "react";
import { NotificationContext } from "./NotificationContext";
import { useSocket } from "../hooks/useSocket";
import { useLiveNotificationSockets } from "../hooks/socketEvents/useLiveNotificationSockets";
import { ALERT } from "../constants/alertConstants";

export const NotificationProvider = ({ children }) => {
  const { socket } = useSocket();

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ALERT.INFO,
    persistent: false
  });
  const timerRef = useRef(null);

  // Función para cerrar manualmente
  const closeNotification = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  // Función para disparar alertas desde cualquier componente
  const showNotification = useCallback((message, type, persistent = false) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setNotification({ show: true, message, type, persistent });

    const rootElement = document.getElementById('root');

      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Animación fluida
      });

      if (rootElement) {
        console.log("notification scroll")
        rootElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
          console.log("notification scroll fallback")
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    
  

    if (!persistent) {
      timerRef.current = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 8000);
    }
  }, []);

  /*
  useLiveNotificationSockets
  Descripcion: Maneja la conexión a sockets para notificaciones globales y actualiza el estado en tiempo real
  Autor: Jose Ahias Vargas
  */
  useLiveNotificationSockets(socket, {
    showNotification
  });

  const value = useMemo(() => ({
    notification,
    showNotification,
    closeNotification
  }), [notification, showNotification, closeNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};