/*
Componente: LiveEventContainer.jsx
Descripción: Contenedor principal para manejar el evento en vivo con sus apuestas
Autor: Jose Ahias Vargas
*/


import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { useLiveEventSockets } from '../../../hooks/socketEvents/useLiveEventSockets';
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { SYSTEM } from "../../../constants/systemConstants";
import EventService from "../../../services/eventService";
import RoundService from "../../../services/roundService";
import FightService from "../../../services/fightService";
import LiveEvent from "../../../components/client/Events/LiveEvent";
import SystemService from "../../../services/systemService";
import UserService from "../../../services/userService";
import BetService from "../../../services/betService";

const LiveEventContainer = () => {

  const { socket } = useSocket();
  const { token, iduser, setUserInfo } = useSecurity();
  const { setToastProps } = useToast();
  const [liveEvent, setLiveEvent] = useState(null);
  const [liveRound, setLiveRound] = useState(null);
  const [activeFight, setActiveFight] = useState(null);
  const [scoreBoard, setScoreBoard] = useState(null);
  const isMounted = useRef(false);
  const [amountParams, setAmountParams] = useState([]);
  const [bettingParams, setBettingParams] = useState([]);
  const [poolTotals, setPoolTotals] = useState([]);
  const [openBet, setOpenBet] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  /*
   Funcion: loadParamData
   Descripcion: carga parametros necesarios para el evento en vivo y las apuestas
   Autor: Jose Ahias Vargas
   */

  const loadParamData = useCallback(async () => {
    try {
      const bettingParams = await SystemService.findParamsByGroup({ groupName: SYSTEM.BETTING }, token);

      if (bettingParams.code !== STATUS.OK) {
        setToastProps({ message: bettingParams.message || "Error al obtener los parametros de apuestas", type: TOAST.DANGER });
        return;
      }

      setBettingParams(bettingParams?.data);


      const amountParams = await UserService.findAmountsByUser({ userId: iduser }, token);


      if (amountParams.code !== STATUS.OK) {
        setToastProps({ message: amountParams.message || "Error al obtener los montos del usuario", type: TOAST.DANGER });
        return;
      }

      setAmountParams(amountParams?.data);


    } catch (error) {
      console.error("Error crítico cargando datos de las apuestas en vivo:", error);
      setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
    }
  }, [iduser, setToastProps, token]);



  /*
   Funcion: fetchPoolTotals
   Descripcion: obtiene el pool de las apuestas
   Autor: Jose Ahias Vargas
   */

  const fetchPoolTotals = useCallback(async (fightId) => {
    try {

      const pool = await BetService.fetchPools({ fightId: fightId }, token);

      if (pool?.code !== STATUS.OK) {
        setToastProps({ message: pool?.message || "Error al obtener los totales de las apuestas", type: TOAST.DANGER });
        return;
      }

      setPoolTotals(pool?.data);


    } catch (error) {
      console.error("Error crítico cargando los totales de las apuestas en vivo:", error);
      setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
    }
  }, [setToastProps, token]);


  /*
   Funcion: loadInitialData
   Descripcion: carga los datos iniciales para el evento en vivo
   Autor: Jose Ahias Vargas
   */

  const loadInitialData = useCallback(async () => {
    try {

      setInitialLoading(true);

      await loadParamData();

      const eventRes = await EventService.fetchLiveEvent({}, token);

      if (eventRes?.code !== STATUS.OK) {
        setToastProps({ message: eventRes?.message || "Error al obtener el evento en vivo", type: TOAST.DANGER });
        return;
      }

      const liveEv = eventRes?.data;

      setLiveEvent(liveEv);

      const liveRoundRes = await RoundService.fetchLiveRoundByEventId({ eventId: liveEv?.id }, token);


      if (liveRoundRes?.code !== STATUS.OK) {
        setToastProps({ message: liveRoundRes?.message || "Error al obtener la ronda en vivo", type: TOAST.DANGER });
        return;
      }


      const liveRd = liveRoundRes?.data;

      setLiveRound(liveRd);

      const activeFightRes = await FightService.fetchLiveFightByRoundId({ roundId: liveRd?.id }, token);

      if (activeFightRes?.code !== STATUS.OK) {
        setToastProps({ message: activeFightRes?.message || "Error al obtener la pelea activa", type: TOAST.DANGER });
      }


      const activeFightData = activeFightRes?.data;

      setActiveFight(activeFightData);


      if (activeFightData) {

        await fetchPoolTotals(activeFightData?.id)

      }


      const boardRes = await FightService.fetchScoreBoardByFightId({ fightId: activeFightData?.id }, token);


      if (boardRes?.code !== STATUS.OK) {
        setToastProps({ message: boardRes?.message || "Error al obtener el scoreboard", type: TOAST.DANGER });
      }

      setScoreBoard(boardRes?.data);

      await setUserInfo(SYSTEM.KEY.BALANCE);


    } catch (error) {
      console.error("Error crítico cargando datos del evento en vivo:", error);
      setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
    }
    finally{

      setInitialLoading(false);


    }
  }, [fetchPoolTotals, loadParamData, setToastProps, setUserInfo, token]);


  /*
  useLiveEventSockets
  Descripcion: Maneja la conexión a sockets para el evento en vivo y actualiza el estado en tiempo real
  Autor: Jose Ahias Vargas
   */
  useLiveEventSockets(socket, {
    setScoreBoard,
    loadInitialData,
    setActiveFight,
    fetchPoolTotals,
    setOpenBet,
    setPoolTotals,
    setLiveRound,
    liveEvent,
    liveRound,
    activeFight
  });


  /*
useEffect
Descripcion: ejecuta la primera vez que entra en la pagina
Autor: Jose Ahias Vargas
   */
  useEffect(() => {
    if (!isMounted.current) {
      loadInitialData();
      isMounted.current = true;
    }
  }, [loadInitialData]);

  /*
  useEffect
  Descripcion: se ejecuta si cambia de pestaña y deja la aplicacion en segundo plano
  Autor: Jose Ahias Vargas
       */

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("👁️ Usuario volvió a la pestaña. Actualizando...");
        loadInitialData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [loadInitialData]);


  return (
    <LiveEvent
      componentLoading = {initialLoading}
      event={liveEvent}
      fight={activeFight}
      scoreBoard={scoreBoard}
      amountParams={amountParams}
      setAmountParams={setAmountParams}
      bettingParams={bettingParams}
      poolTotals={poolTotals}
      openBet={openBet}
      setOpenBet={setOpenBet}
    />
  );
};

export default LiveEventContainer;