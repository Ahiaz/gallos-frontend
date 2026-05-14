/*
Hook: useLiveEventSockets
Descripción: Encapsula toda la escucha de eventos de socket para el evento en vivo.
*/

import { useEffect, useRef } from 'react';
import { SOCKET_EVENTS } from '../../constants/socketConstants';
import { ALERT } from '../../constants/alertConstants';
import { SYSTEM } from '../../constants/systemConstants';
import { useGlobalNotifications } from '../useGlobalNotifications';
import { useSecurity } from "../useSecurity";
import { useModal } from '../useModal';

export const useLiveEventSockets = (socket, props) => {
    const { showNotification } = useGlobalNotifications();
    const { setUserInfo } = useSecurity();
    const { toggleModal } = useModal();

    // 1. Referencia para mantener las funciones/props actualizadas sin disparar el useEffect
    const propsRef = useRef(null);

    // 2. Sincronizamos la referencia en cada render
    useEffect(() => {
        propsRef.current = {
            ...props,
            showNotification,
            setUserInfo,
            toggleModal
        };
    });

    useEffect(() => {
        // Solo ejecutamos si hay socket. 
        // Este efecto solo se REINICIARÁ si el objeto 'socket' cambia.
        if (!socket) return;

        // Función auxiliar para acceder a la versión más reciente de las funciones
        const getProps = () => propsRef.current;

        //ANALIZA QUE DEBE RENDERIZAR , YA QUE TENEMOS EVENTO - RONDAS - PELEAS

        const onHierarchyUpdate = (payload) => {

            const {
                liveEvent, liveRound, activeFight,
                setLiveRound, setActiveFight, loadInitialData
            } = getProps();

            // 1. EL "KILL SWITCH": Si el evento cambió, no intentamos parchar, recargamos todo.
            if (payload.event && payload.event.id !== liveEvent?.id) {

                console.log("Sync: Evento cambió, recargando todo");

                return loadInitialData();
            }

            // 2. ACTUALIZACIÓN ATÓMICA DE RONDA
            // Si viene una ronda y es distinta a la que tengo (ID o Status)
            if (payload.round && (payload.round.id !== liveRound?.id || payload.round.status !== liveRound?.status)) {
                console.log("Sync: Actualizando Ronda");
                setLiveRound(payload.round);
            }

            // 3. ACTUALIZACIÓN ATÓMICA DE PELEA
            if (payload.fight && (payload.fight.id !== activeFight?.id || payload.fight.status !== activeFight?.status)) {
                console.log("Sync: Actualizando Pelea");
                setActiveFight(payload.fight);
            }
        };



        // HANDLERS INTERNOS (No dependen de dependencias externas)

        const onPoolUpdate = (data) => {
            const { setPoolTotals } = getProps();
            console.log('pool updated', data)
            setPoolTotals(data);
        };


        const onFightOpen = (data) => {
            const { showNotification } = getProps();
            console.log('useLiveEventSockets: fight-open', data)
            onHierarchyUpdate(data);
            showNotification(`Apuestas abiertas: Pelea #${data?.fight?.number}`, ALERT.INFO, true);

        };


        const onFightUpdate = (data) => {
            const { setActiveFight, loadInitialData, activeFight } = getProps();
            console.log('useLiveEventSockets: fight-update', data);

            if (data) {
                //si no son iguales el admin actualizo una pelea que no es la activa;
                if (activeFight.id == data.id) {
                    setActiveFight(data);
                }
                else {

                    console.log("actualizo una pelea que no es la activa");

                }
            }
            else {

                loadInitialData();

            }
        };


        const onFightInProgress = (data) => {
            const {showNotification, toggleModal, setOpenBet } = getProps();
            console.log('useLiveEventSockets: fight-progress', data)
            onHierarchyUpdate(data);
            showNotification(`Apuestas cerradas: Pelea #${data?.fight?.number}`, ALERT.WARNING, true);
            setOpenBet(false);
            toggleModal(false);

        };

        const onResolvedFight = (data) => {
            const { showNotification, setUserInfo } = getProps();
            console.log('useLiveEventSockets: fight-resolve', data)
            onHierarchyUpdate(data);
            showNotification(`Pelea #${data?.fight?.number} resuelta`, ALERT.SUCCESS, true);
            setUserInfo(SYSTEM.KEY.BALANCE);
        };


        const onCancelFight = (data) => {
            const { setActiveFight, setOpenBet, toggleModal, showNotification, loadInitialData, activeFight } = getProps();
            console.log('useLiveEventSockets: fight-cancel', data)
            if (data) {

                //si no son iguales, el admin cancelo una pelea que no es la activa
                if (activeFight.id == data.id) {

                    setActiveFight(data);
                    setOpenBet(false);
                    toggleModal(false);
                    showNotification(`Pelea #${data?.number} cancelada — dinero apostado reembolsado`, ALERT.DANGER, true);
                }
                else {

                    console.log("cancelo una pelea que no es la activa");

                }

            }
            else {

                loadInitialData();
            }

            setUserInfo(SYSTEM.KEY.BALANCE);
        };


        const onRoundStart = (data) => {

            const { showNotification } = getProps();
            console.log('useLiveEventSockets: round-start', data)
            onHierarchyUpdate(data);
            showNotification(`Ronda #${data?.round?.number} ha comenzado`, ALERT.INFO, true);

        };

        const onRoundFinish= (data) => {

            const { showNotification } = getProps();
            console.log('useLiveEventSockets: round-finish', data)
            onHierarchyUpdate(data);
            showNotification(`Ronda #${data?.round?.number} ha finalizado`, ALERT.INFO, true);

        };

         const onRoundCancel= (data) => {

            const { setLiveRound, setOpenBet, toggleModal, showNotification, loadInitialData, liveRound } = getProps();
            console.log('useLiveEventSockets: round-cancel', data)
            if (data) {

                //si no son iguales, el admin cancelo una ronda que no es la activa
                if (liveRound.id == data.id) {

                    setLiveRound(data);
                    setOpenBet(false);
                    toggleModal(false);
                    showNotification(`Ronda #${data?.number} cancelada — dinero apostado reembolsado`, ALERT.DANGER, true);
                }
                else {

                    console.log("cancelo una ronda que no es la activa");

                }

            }
            else {

                loadInitialData();
            }

            setUserInfo(SYSTEM.KEY.BALANCE);

        };



        /*
        Funcion: handleScoreBoard
        Descripcion: Actualiza el tablero de puntuación en tiempo real
        Autor: Jose Ahias Vargas
        */

        const onScoreBoard = (data) => {
            console.log('useLiveEventSockets: score-board', data)
            const { setScoreBoard } = getProps();
            setScoreBoard(data);
        };


        const onGenericReload = () => { console.log('useLiveEventSockets: round event - reload'); getProps().loadInitialData() };

        socket.on(SOCKET_EVENTS.GLOBAL.POOL_UPDATED, onPoolUpdate);
        socket.on(SOCKET_EVENTS.GLOBAL.FIGHT_OPENED, onFightOpen);
        socket.on(SOCKET_EVENTS.GLOBAL.FIGHT_PROGRESSED, onFightInProgress);
        socket.on(SOCKET_EVENTS.GLOBAL.FIGHT_RESOLVED, onResolvedFight);
        socket.on(SOCKET_EVENTS.GLOBAL.FIGHT_CANCELLED, onCancelFight);
        socket.on(SOCKET_EVENTS.GLOBAL.FIGHT_UPDATED, onFightUpdate);
        socket.on(SOCKET_EVENTS.GLOBAL.SCORE_BOARD, onScoreBoard);
        socket.on(SOCKET_EVENTS.GLOBAL.ROUND_STARTED, onRoundStart);
        socket.on(SOCKET_EVENTS.GLOBAL.ROUND_CANCELLED, onRoundCancel);
        socket.on(SOCKET_EVENTS.GLOBAL.ROUND_FINISHED, onRoundFinish);
        socket.on("reconnect", onGenericReload);

        // LIMPIEZA
        return () => {
            socket.off(SOCKET_EVENTS.GLOBAL.POOL_UPDATED, onPoolUpdate);
            socket.off(SOCKET_EVENTS.GLOBAL.FIGHT_OPENED, onFightOpen);
            socket.off(SOCKET_EVENTS.GLOBAL.FIGHT_PROGRESSED, onFightInProgress);
            socket.off(SOCKET_EVENTS.GLOBAL.FIGHT_RESOLVED, onResolvedFight);
            socket.off(SOCKET_EVENTS.GLOBAL.FIGHT_CANCELLED, onCancelFight);
            socket.off(SOCKET_EVENTS.GLOBAL.FIGHT_UPDATED, onFightUpdate);
            socket.off(SOCKET_EVENTS.GLOBAL.SCORE_BOARD, onScoreBoard);
            socket.off(SOCKET_EVENTS.GLOBAL.ROUND_STARTED, onRoundStart);
            socket.off(SOCKET_EVENTS.GLOBAL.ROUND_CANCELLED, onRoundCancel);
            socket.off(SOCKET_EVENTS.GLOBAL.ROUND_FINISHED, onRoundFinish);
            socket.off("reconnect", onGenericReload);

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
};



