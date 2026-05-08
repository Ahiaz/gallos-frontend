/*Componente: LiveBetsProvider.jsx
Descripción: Contexto para ver las apuestas de la pelea en vivo de forma global en la aplicación.
Se utiliza React.memo para evitar renderizados innecesarios cuando las props no cambian.
Se le saca utilidad si los componentes que van usar este hook usan react.memo
UseCallback para evitar renderizados innecesarios en funciones que se pasan como props.
El context permite manejar el estado del modal, los datos del formulario y la validación de campos requeridos
a nivel global en la aplicación.
Solo se le saca ganancia si se usa en componentes que usan React.memo para memoizar
y no se le saca ganancia en setters de estado o funciones que cambian constantemente.
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/


import { LiveBetsContext } from "./LiveBetsContext";
import LiveFightBetsContainer from "../containers/Bets/LiveFightBetsContainer";
import { useEffect, useMemo, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { ROOMS } from "../constants/socketConstants";


export const LiveBetsProvider = ({ children }) => {


 const [open, setOpen] = useState(false);
 const [monitorRefresh, setMonitorRefresh] = useState(true);
 const { socket, joinRoom, leaveRoom } = useSocket();

 const toggleBets = () => setOpen(prev => !prev);

//MANEJA LA CONEXION AL CUARTO DEL EN VIVO
useEffect(() => {
  const handleJoin = () => {
    console.log("Provider: Uniendo al cuarto LIVE_ROOM");
    joinRoom(ROOMS.LIVE_ROOM);
  };

  if (socket?.connected) {
    handleJoin();
  }

  // Si el socket se desconecta y vuelve a conectar solo, el Provider lo re-une
  socket?.on("connect", handleJoin);

  return () => {
    socket?.off("connect", handleJoin);
    console.log("Provider: Saliendo del cuarto LIVE_ROOM");
    leaveRoom(ROOMS.LIVE_ROOM);
  };
}, [socket, joinRoom, leaveRoom]);


  const contextValue = useMemo(() => ({
    open,
    toggleBets,
    monitorRefresh,
    setMonitorRefresh
  }), [open, monitorRefresh]);
  
  return (
<LiveBetsContext.Provider value={contextValue}>
{children}
  <LiveFightBetsContainer open={open} setOpen={toggleBets} refresh={monitorRefresh} setRefresh={setMonitorRefresh} />
  </LiveBetsContext.Provider>
  );
};
