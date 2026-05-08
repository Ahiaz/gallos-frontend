/*
Componente: FightContainer.jsx
Descripción: Contenedor lógico para la gestión de peleas
Autor: Jose Ahias Vargas
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MODE } from "../../../constants/modeConstants";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import { useModal } from "../../../hooks/useModal";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { SOCKET_EVENTS } from "../../../constants/socketConstants";
import { useSocket } from "../../../hooks/useSocket";
import fightService from "../../../services/fightService";
import chatService from "../../../services/chatService";
import { FIGHT, FIGHT_FILTERS } from "../../../constants/fightConstants";
import FightForm from "../../../components/admin/Fight/FightForm";
import FightList from "../../../components/admin/Fight/FightList";
import FightManager from "../../../components/admin/Fight/FightManager";

const FightContainer = ({ currentRoundSelected = null }) => {
    const navigate = useNavigate();
    const location = useLocation()
    const isMounted = useRef(false);
    const { socket } = useSocket();
    const { token, iduser } = useSecurity();
    const { setToastProps } = useToast();
    const { showConfirm } = useConfirmModal();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [fights, setFights] = useState([]);
    const [currentFight, setCurrentFight] = useState(null);
    const [fightFilter, setFightFilter] = useState(FIGHT_FILTERS.ALL);
    const [currentRound, setCurrentRound] = useState(location.state || currentRoundSelected || null);
    const lastSyncedRound = useRef(null);
    const lastSyncedVersion = useRef(null);
    const {
        toggleModal,
        setModalComponent,
        setModalProps,
        resetModalFormData,
        setConfirmModalCallback,
        setRequiredFields,
        setFieldRules,
    } = useModal();


    /* Función: loadInitialData
    Descripción: Carga los datos de las peleas
    */
    const loadInitialData = useCallback(async (selectedRound = null) => {

        if (!selectedRound?.id) return;

        setInitialLoading(true);
        try {

            const fightRes = await fightService.fetchFightsByRoundId({ roundId: selectedRound?.id }, token);

            if (fightRes.code === STATUS.OK) {
                const fightsData = (fightRes.data || []).sort((a, b) => a.number - b.number);

                setFights(fightsData);
                // Seleccionar automáticamente la pelea en progreso si existe
                const inProgressFight = fightsData.find(r => r.status === FIGHT.IN_PROGRESS);
                const openFight = fightsData.find(r => r.status === FIGHT.OPEN);
                const pendingFight = fightsData.find(r => r.status === FIGHT.PENDING);
                const resolvedFight = fightsData.find(r => r.status === FIGHT.RESOLVED);

                if (inProgressFight) {
                    setCurrentFight(inProgressFight)
                    setFightFilter(FIGHT.IN_PROGRESS);

                } else if (openFight) {
                    setCurrentFight(openFight)
                    setFightFilter(FIGHT.OPEN);

                }
                else if (pendingFight) {
                    setCurrentFight(pendingFight)
                    setFightFilter(FIGHT.PENDING);

                }
                else if (resolvedFight) {
                    setCurrentFight(resolvedFight)
                    setFightFilter(FIGHT.RESOLVED);

                }
                else {

                    setCurrentFight(null);
                    setFightFilter(FIGHT_FILTERS.ALL);
                }

            }
        } catch (error) {
            console.error("Error crítico cargando datos iniciales:", error);
            setToastProps({ message: "Error al cargar datos de la pelea", type: TOAST.DANGER });
        } finally {
            setInitialLoading(false);
        }
    }, [token, setToastProps]);

    /*
     useEffect
     Descripcion: carga las rondas  una sola vez, si no hay ronda ni pelea seleccionada previamente
     Autor: Jose Ahias Vargas
     */
    useEffect(() => {


        if (!isMounted.current && !currentRoundSelected) {
            loadInitialData(currentRound);
            isMounted.current = true;
        }
    }, [currentRound, currentRoundSelected, loadInitialData]);



    /* useEffect
    Descripción: hace un scroll al top al cargar el componente
    */
    useEffect(() => {
        // El timeout de 0 permite que el renderizado termine antes de mover el scroll
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    /* useEffect
    Descripción: sincroniza la ronda seleccionada desde el dashboard, evitando recargas innecesarias si ya está sincronizada
    */

    useEffect(() => {

        const syncRound = async () => {

            if (!currentRoundSelected) return;

            if (lastSyncedRound.current === currentRoundSelected.id && 
            lastSyncedVersion.current === currentRoundSelected._sync) return;


            const round = currentRoundSelected;

            lastSyncedRound.current = round.id;

            try {

                console.log("cargando datos del fightContainer por el dashboard ronda", round.id)

                await loadInitialData(round);

                lastSyncedRound.current = currentRoundSelected.id;
                lastSyncedVersion.current = currentRoundSelected._sync;

                setCurrentRound(round);


            } catch (error) {

                console.error("Error al sincronizar la ronda:", error);

            }
        };

        syncRound();

    }, [currentRoundSelected, loadInitialData]);



    /*
     Funcion: syncFightState
     Descripcion: sincroniza las peleas con los cambios
    */

    const syncFightState = (updatedFight, mode = MODE.UPDATE) => {
        setCurrentFight(updatedFight);
        setFights(prev => {
            if (mode === MODE.CREATE) return [...prev, updatedFight];
            return prev.map(r => r.id === updatedFight.id ? updatedFight : r);
        });
    };


    /*
     Funcion: openFight
     Descripcion: Cambia la pelea a estado OPEN, habilitando las apuestas
    */

    const openFight = async () => {

        setLoading(true);

        try {
            const res = await fightService.openFight(
                { roundId: currentRound.id, fightId: currentFight.id },
                token
            );

            if (res.code === STATUS.OK) {

                const openFight = res.data;

                syncFightState(openFight);

                setFightFilter(FIGHT.OPEN);

                socket.emit(SOCKET_EVENTS.EMIT.FIGHT_OPEN, {
                    fightId: openFight.id,
                    eventId: currentRound.event_id,
                    roundId: currentRound.id,
                });

                const chat = await chatService.sendChatMessage({userId: iduser, eventId: currentRound.event_id, message: `Las apuestas estan abiertas 📝`}, token);
                if (chat.code === STATUS.OK){

                socket.emit(SOCKET_EVENTS.EMIT.CHAT_MESSAGE, {
                chatId: chat.data.id
                });

                }


                setToastProps({ message: "Pelea abierta", type: TOAST.SUCCESS });
                return true;
            } else {
                setToastProps({
                    message: res.message || "Error al abrir la pelea",
                    type: TOAST.DANGER
                });

                return false;
            }

        } catch (error) {
            console.error(error);
            setToastProps({
                message: "Error de conexión al abrir la pelea",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };


    /*
     Funcion: inProgressFight
     Descripcion: Cambia la pelea a estado OPEN, habilitando las apuestas
    */

    const inProgressFight = async () => {

        setLoading(true);

        try {
            const res = await fightService.inProgressFight(
                { fightId: currentFight.id },
                token
            );

            if (res.code === STATUS.OK) {

                const progressFight = res.data;

                syncFightState(progressFight);

                setFightFilter(FIGHT.IN_PROGRESS);

                socket.emit(SOCKET_EVENTS.EMIT.FIGHT_PROGRESS, {
                    roundId: currentRound.id,
                    eventId: currentRound.event_id,
                    fightId: progressFight.id,
                });

                const chat = await chatService.sendChatMessage({userId: iduser, eventId: currentRound.event_id, message: `Las apuestas fueron cerradas 🚫`}, token);
                if (chat.code === STATUS.OK){


                socket.emit(SOCKET_EVENTS.EMIT.CHAT_MESSAGE, {
                chatId: chat.data.id
                });

                }


                setToastProps({ message: "Pelea en progreso", type: TOAST.SUCCESS });
                return true;
            } else {
                setToastProps({
                    message: res.message || "Error al colocar en progreso la pelea",
                    type: TOAST.DANGER
                });

                return false;
            }

        } catch (error) {
            console.error(error);
            setToastProps({
                message: "Error de conexión al progreso de la pelea",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };


    /*
     Funcion: resolveFight
     Descripcion: Cambia la pelea a estado RESOLVED, ingresando los puntos y finalizando la ronda
    */

    const resolveFight = async (scoreA, scoreB) => {

        setLoading(true);

        try {
            const res = await fightService.resolveFight(
                { fightId: currentFight.id, scoreA: scoreA, scoreB: scoreB },
                token
            );

            if (res.code === STATUS.OK) {

                const resolvedFight = res.data;

                syncFightState(resolvedFight);

                setFightFilter(FIGHT.RESOLVED);

                socket.emit(SOCKET_EVENTS.EMIT.FIGHT_RESOLVE, {
                    roundId: currentRound.id,
                    eventId: currentRound.event_id,
                    fightId: resolvedFight.id,

                });

                const chat = await chatService.sendChatMessage({userId: iduser, eventId: currentRound.event_id, message: `La pelea ha finalizado, el dinero fue repartido 💰`}, token);
                if (chat.code === STATUS.OK){


                socket.emit(SOCKET_EVENTS.EMIT.CHAT_MESSAGE, {
                chatId: chat.data.id
                });

                }

                setToastProps({ message: "Pelea resuelta", type: TOAST.SUCCESS });
                return true;
            } else {
                setToastProps({
                    message: res.message || "Error al resolver la pelea",
                    type: TOAST.DANGER
                });

                return false;
            }

        } catch (error) {
            console.error(error);
            setToastProps({
                message: "Error de conexión al resolver la pelea",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };




    /*
     Funcion: cancelFight
     Descripcion: Cambia la pelea a estado CANCELLED, cancelando la pelea
    */

    const cancelFight = async () => {

        setLoading(true);

        try {
            const res = await fightService.cancelFight(
                { fightId: currentFight.id },
                token
            );

            if (res.code === STATUS.OK) {

                const cancelledFight = res.data;

                syncFightState(cancelledFight);

                setFightFilter(FIGHT.CANCELLED);

                socket.emit(SOCKET_EVENTS.EMIT.FIGHT_CANCEL, {
                    roundId: currentRound.id,
                    eventId: currentRound.event_id,
                    fightId: cancelledFight.id,
                });

                const chat = await chatService.sendChatMessage({userId: iduser, eventId: currentRound.event_id, message: `La pelea se ha cancelado, el dinero fue devuelto 💰`}, token);
                if (chat.code === STATUS.OK){

                socket.emit(SOCKET_EVENTS.EMIT.CHAT_MESSAGE, {
                chatId: chat.data.id
                });

                }

                setToastProps({ message: "Pelea cancelada", type: TOAST.SUCCESS });
                return true;
            } else {
                setToastProps({
                    message: res.message || "Error al cancelar la ronda",
                    type: TOAST.DANGER
                });

                return false;
            }

        } catch (error) {
            console.error(error);
            setToastProps({
                message: "Error de conexión al cancelar la pelea",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };



    /*
     Funcion: createFight
     Descripcion: crea la pelea
    */
    /*const createFight = async (props) => {

        setLoading(true);


        try {

            const res = await fightService.createFight({ roundId: currentRound.id, number: props["fightNumberInput"], weight1: props["weight1Input"], weight2: props["weight2Input"]}, token);

            if (res.code === STATUS.OK) {

                const newFight = res.data;

                syncFightState(newFight, MODE.CREATE);

                setFightFilter(FIGHT.PENDING);

                socket.emit(SOCKET_EVENTS.EMIT.FIGHT_CREATE, {
                    fightId: newFight.id
                });

                setToastProps({ message: "Se creo la pelea", type: TOAST.SUCCESS });

                return true;

            }
            else {

                setToastProps({ message: res.message || 'No se pudo crear la pelea', type: TOAST.DANGER });
                return false;
            }



        } catch (error) {

            console.log(error);

            setToastProps({
                message: "Error de conexión al crear la pelea",
                type: TOAST.DANGER
            });

            return false;

        }
        finally {

            setLoading(false);
        }

    }

*/

    /*
     Funcion: updateFight
     Descripcion: actualiza la pelea
    */

    const updateFight = async (props) => {

        setLoading(true);


        try {

            const res = await fightService.updateFight({ number: props["fightNumberInput"], weight1: props["weight1Input"], weight2: props["weight2Input"], fightId: props["idFightInput"] }, token);

            if (res.code === STATUS.OK) {

                const updatedFight = res.data;


                syncFightState(updatedFight);

                socket.emit(SOCKET_EVENTS.EMIT.FIGHT_UPDATE, {
                    fightId: updatedFight.id
                });

                setToastProps({ message: "Se actualizo la pelea", type: TOAST.SUCCESS });


                return true;

            }
            else {

                setToastProps({ message: res.message || 'No se pudo actualizar la pelea', type: TOAST.DANGER });
                return false;
            }





        } catch (error) {

            console.log(error);

            setToastProps({
                message: "Error de conexión al actualizar la pelea",
                type: TOAST.DANGER
            });

            return false;

        }
        finally {

            setLoading(false);
        }



    }


    /*
     Funcion: handleOpenFight
     Descripcion: Cambia la pelea a estado OPEN, habilitando las apuestas
    */

    const handleOpenFight = async () => {


        if (!currentFight || !currentRound) return;

        showConfirm({ title: 'Confirmación', message: '¿Deseas abrir la pelea? esto iniciará las apuestas de la pelea', onConfirm: () => openFight() })

    };



    /*
     Funcion: handleInProgressFight
     Descripcion: Cambia la pelea a estado IN_PROGRESS, terminando las apuestas
    */

    const handleInProgressFight = async () => {


        if (!currentFight || !currentRound) return;

        showConfirm({ title: 'Confirmación', message: '¿Deseas iniciar la pelea? esto cerrará las apuestas de la pelea', onConfirm: () => inProgressFight() })

    };

    /*
    Funcion: handleResolveFight
    Descripcion: Cambia la pelea a estado RESOLVED, ingresando los puntos y finalizando la pelea
   */

    const handleResolveFight = async (scoreA, scoreB) => {

        if (!currentFight || !currentRound) return;

        showConfirm({ title: 'Confirmación', message: '¿Deseas resolver la pelea? esto repartirá las ganancias de la pelea', onConfirm: () => resolveFight(scoreA, scoreB) })

    };

    /*
    Funcion: handleCancelFight
    Descripcion: Cambia la pelea a estado CANCELLED, cancelando la pelea y las apuestas asociadas
   */

    const handleCancelFight = async () => {

        if (!currentFight || !currentRound) return;

        showConfirm({ title: 'Confirmación', message: '¿Deseas cancelar la pelea? esto devolverá los fondos de las apuestas que existan de la pelea', onConfirm: () => cancelFight() })

    };


    /*
    funcion: handleFightModal
    Descripción: abre un modal para crear o editar la pelea
    Autor: Jose Ahias Vargas
    */

    const handleFightModal = (currentFight) => {


        const title = currentFight ? "Editar Pelea" : "Crear Pelea";
        const confirmText = currentFight ? "Actualizar" : "Crear";

        resetModalFormData();

        setRequiredFields(["fightNumberInput", "weight1Input", "weight2Input"]);

        setFieldRules({ fightNumberInput: { min: 1, max: 100 } });
        setFieldRules({ weight1Input: { min: 0.1, max: 10000 } });
        setFieldRules({ weight2Input: { min: 0.1, max: 10000 } });

        setModalComponent(() => () => <FightForm fight={currentFight} />);

        setModalProps({
            title: title,
            cancelText: "Cancelar",
            confirmText: confirmText,
        });

        const confirmCallback =/* currentFight ?*/ updateFight.bind(null) /*: createFight.bind(null);*/

        setConfirmModalCallback(() => confirmCallback);

        toggleModal(true);
    };

    // ─── RENDER ──────────────────────────────────────────────────────────────

    if (initialLoading) {
        return (
            <div className="flex min-h-[420px] items-center justify-center bg-brand-950 animate__animated animate__fadeIn">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
            </div>
        );
    }

    return (
        <div className="space-y-4 animate__animated animate__fadeIn">
            {/* ================= BREADCRUMBS & NAVIGATION ================= */}
            {!currentRoundSelected && (
                <div className="mb-4 flex flex-col gap-3  border border-white/10 bg-white/[0.05] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.24)] lg:flex-row lg:items-center lg:justify-between">
                    <nav aria-label="breadcrumb">
                        <ol className="mb-1 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                            <li><a className="text-gold-300 hover:text-gold-400" href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }}>Dashboard</a></li>
                            <li className="text-white/30">/</li>
                            <li><a className="text-gold-300 hover:text-gold-400" href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/events'); }}>Eventos</a></li>
                            <li className="text-white/30">/</li>
                            <li><a className="text-gold-300 hover:text-gold-400" href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/rounds'); }}>Ronda</a></li>
                            <li className="text-white/30">/</li>
                            <li className="text-white/45">Peleas</li>
                        </ol>
                    </nav>
                    {currentFight && (
                        <h4 className="mb-0 text-lg font-black text-white lg:text-center">
                            Ronda #{currentRound?.number} — Pelea #{currentFight.number}: {currentFight.gallo_a} vs {currentFight.gallo_b}
                        </h4>
                    )}
                    <button className="!inline-flex !items-center !gap-2 !border !border-white/12 !bg-white/[0.06] !px-4 !py-2.5 !text-sm !font-black !text-white/75 transition hover:!bg-white/[0.1]" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left !text-current"></i>
                        Regresar
                    </button>
                </div>
            )}

            {fights.length === 0 ? (
                <div className="w-full  border border-white/10 bg-white/[0.04] p-6 text-center text-white/55 shadow-[0_16px_45px_rgba(0,0,0,0.22)]">
                    <i className="bi bi-shield-x mb-3 block text-4xl !text-white/30"></i>
                    <p className="mb-1 text-sm font-black text-white/70">No hay peleas configuradas para esta ronda.</p>
                    {currentRoundSelected && (
                        <p className="mb-0 text-xs text-white/40">Configura el pareo en el paso de Rondas para crearlas.</p>
                    )}
                </div>
            ) : (
                <div className="grid gap-3 lg:grid-cols-[0.82fr_1.18fr]">
                    {/* COLUMNA IZQUIERDA: LISTA */}
                    <div>
                        <div className="h-full bg-white/[0.04] p-3 shadow-[0_16px_45px_rgba(0,0,0,0.22)]">
                            <div className="flex h-full flex-col">
                                <div className="mb-3 flex items-center justify-between gap-3  border-white/10 pb-2.5">
                                    <h5 className="mb-0 text-xs font-black uppercase tracking-[0.12em] text-white">
                                        Peleas
                                    </h5>
                                </div>
                                <FightList
                                    round={currentRound}
                                    fights={fights}
                                    currentFight={currentFight}
                                    onSelected={setCurrentFight}
                                    filter={fightFilter}
                                    setFilter={setFightFilter}
                                />
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: MANAGER */}
                    <div>
                        <div className="h-full p-3 shadow-[0_16px_45px_rgba(0,0,0,0.22)] bg-white/[0.04]">
                            <div className="flex h-full flex-col">
                                {currentFight ? (
                                    <div>
                                        <div className="mb-3 flex items-center justify-between gap-3  border-white/10 pb-2.5">
                                            <h5 className="mb-0 text-xs font-black uppercase tracking-[0.12em] text-white">
                                                Control — Pelea #{currentFight.number}
                                            </h5>
                                            {(currentFight.status === FIGHT.PENDING || currentFight.status === FIGHT.OPEN) && (
                                                <button
                                                    className="!inline-flex !items-center !gap-1.5 ! !border !border-danger-soft/35 !bg-danger-soft/12 !px-2.5 !py-1.5 !text-[0.6rem] !font-black !uppercase !tracking-[0.1em] !text-danger-soft transition hover:!bg-danger-soft/20"
                                                    onClick={() => handleFightModal(currentFight)}
                                                >
                                                    <i className="bi bi-pencil-square !text-current"></i>
                                                    Editar
                                                </button>
                                            )}
                                        </div>
                                        <FightManager
                                            fight={currentFight}
                                            currentRound={currentRound}
                                            loading={loading}
                                            onOpen={() => handleOpenFight()}
                                            onProgress={() => handleInProgressFight()}
                                            onResolve={(scoreA, scoreB) => handleResolveFight(scoreA, scoreB)}
                                            onCancel={() => handleCancelFight()}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-grow flex-col items-center justify-center  border border-white/10 bg-black/25 p-6 text-center text-white/50">
                                        <i className="bi bi-cursor mb-2 block text-3xl !text-white/25"></i>
                                        <p className="mb-0 text-xs">Selecciona una pelea para administrarla</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FightContainer;
