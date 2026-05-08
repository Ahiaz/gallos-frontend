/*
Componente: RoundContainer.jsx
Descripción: Contenedor lógico para manejo de ronda
Autor: Jose Ahias Vargas
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { MODE } from "../../../constants/modeConstants";
import { STORAGE } from "../../../constants/storageConstants";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import { useModal } from "../../../hooks/useModal";
import { useSecurity } from "../../../hooks/useSecurity";
import { useSocket } from "../../../hooks/useSocket";
import { useToast } from "../../../hooks/useToast";
import EventService from "../../../services/eventService";
import { SOCKET_EVENTS } from "../../../constants/socketConstants";
import { EVENT } from "../../../constants/eventConstants";
import { useNavigate } from "react-router-dom";
import { ROUND, ROUND_FILTERS } from "../../../constants/roundConstants";
import RoundService from "../../../services/roundService";
import ChatService from "../../../services/chatService";
import RoundForm from "../../../components/admin/Rounds/RoundForm";
import RoundList from "../../../components/admin/Rounds/RoundList";
import RoundManager from "../../../components/admin/Rounds/RoundManager";
import fightService from "../../../services/fightService";

const RoundContainer = ({ currentRoundSelected = null, currentEventSelected = null, onRoundChange = () => { } }) => {

    const navigate = useNavigate();

    const [initialLoading, setInitialLoading] = useState(false);

    const isMounted = useRef(false);

    const lastSyncedEvent = useRef(null);

    const { socket } = useSocket();

    const { token, iduser } = useSecurity();

    const { setToastProps } = useToast();

    const { showConfirm } = useConfirmModal();

    const [loading, setLoading] = useState(false);

    const [selectIsLoading, setSelectIsLoading] = useState(false);

    const [rounds, setRounds] = useState([]);

    const [events, setEvents] = useState([]);

    const [currentEvent, setCurrentEvent] = useState(currentEventSelected);

    const [currentRound, setCurrentRound] = useState(currentRoundSelected);

    const [fights, setFights] = useState([]);

    const [galleriesEvent, setGalleriesEvent] = useState([]);

    const [activity, setActivity] = useState(null);

    const [roundFilter, setRoundFilter] = useState(ROUND_FILTERS.ALL);

    const showEventBar = currentRoundSelected ? false : true;



    const {
        toggleModal,
        setModalComponent,
        setModalProps,
        resetModalFormData,
        setConfirmModalCallback,
        setRequiredFields,
        setFieldRules,

    } = useModal();



    /* Función: loadFightsByRound
    Descripción: Carga los datos de las peleas de la ronda
    */
    const loadFightsByRound = useCallback(async (roundId) => {
        try {

            const fightRes = await fightService.fetchFightsByRoundId({ roundId: roundId }, token);
            if (fightRes.code === STATUS.OK) {
                const fightsData = fightRes.data || [];
                setFights(fightsData);
                console.log('fights', fightsData);

            }

        } catch (error) {
            console.error("Error crítico cargando datos de las peleas por ronda:", error);
            setToastProps({ message: "Error al cargar datos de las peleas por ronda", type: TOAST.DANGER });
        }
    }, [token, setToastProps]);



    /* Función: fetchGalleriesByEvent
    Descripción: Carga las gallerias de un evento
    */
    const fetchGalleriesByEvent = useCallback(async (eventId) => {
        try {


            const galleryRes = await EventService.fetchGalleriesByEvent({ eventId: eventId }, token);
            if (galleryRes.code === STATUS.OK) {
                const gData = galleryRes.data || [];
                setGalleriesEvent(gData);

            }


        } catch (error) {
            console.error("Error crítico cargando datos de gallerias por evento:", error);
            setToastProps({ message: "Error al cargar datos de las gallerias del evento", type: TOAST.DANGER });
        }

    }, [token, setToastProps]);



    /* Función: fetchActivityEvent
    Descripción: Obtiene validaciones para ver si puede modificar el matchMaking
    */
    const fetchActivityEvent = useCallback(async (eventId) => {
        try {

            const actRes = await EventService.fetchActivityEvent({ eventId: eventId }, token);


            if (actRes.code === STATUS.OK) {
                const aData = actRes.data || null;
                setActivity(aData);

            }

        } catch (error) {
            console.error("Error crítico cargando actividades por evento:", error);
            setToastProps({ message: "Error al cargar datos de las actividades del evento", type: TOAST.DANGER });
        }
    }, [token, setToastProps]);




    /*
        Funcion: fetchRoundsByEvent
        Descripcion: carga las rondas por el evento
        Autor: Jose Ahias Vargas
        */

    const fetchRoundsByEvent = useCallback(async (id, selectedRound = null) => {

        const roundRes = await RoundService.fetchRoundsByEvent({ eventId: id }, token);

        if (roundRes.code === STATUS.OK) {
            const roundsData = roundRes.data || [];
            setRounds(roundsData);

            const liveRound = roundsData.find(f => f.status === ROUND.LIVE);
            const pendingRound = roundsData.find(f => f.status === ROUND.PENDING);


            if (selectedRound) {
                setCurrentRound(selectedRound);
                setRoundFilter(selectedRound.status);
                loadFightsByRound(selectedRound.id);

            }

            else if (liveRound) {
                setCurrentRound(liveRound);
                setRoundFilter(ROUND.LIVE);
                loadFightsByRound(liveRound.id);


            } else if (pendingRound) {
                setCurrentRound(pendingRound);
                setRoundFilter(ROUND.PENDING);
                loadFightsByRound(pendingRound.id);
            } else {
                setCurrentRound(null);
                setFights([]);
                setRoundFilter(ROUND_FILTERS.ALL);
            }
        } else {
            setToastProps({
                message: roundRes.message || "No se pudieron obtener las rondas",
                type: TOAST.DANGER
            });
        }


    }, [loadFightsByRound, setCurrentRound, setToastProps, token])



    /*
     Funcion: loadInitialData
     Descripcion: carga los eventos y la pelea
     Autor: Jose Ahias Vargas
     */

    const loadInitialData = useCallback(async () => {

        try {

            setInitialLoading(true);

            const res = await EventService.fetchEvents({}, token);

            if (res.code === STATUS.OK) {
                const eventData = res.data || [];
                setEvents(eventData);

                if (eventData.length === 0) return;

                const liveEvent = eventData.find(e => e.status === EVENT.LIVE);
                const scheduledEvent = eventData.find(e => e.status === EVENT.SCHEDULED);

                //currentEvent , se puede dar el caso que ya exista un evento en el storage guardado, entonces recuperamos
                let evt = (currentEvent) ?? (liveEvent || scheduledEvent || eventData[0]);

                setCurrentEvent(evt);

                //Carga de rondas para ese evento, currentRound , se puede dar el caso que ya exista una ronda en el storage guardada, entonces recuperamos
                await fetchRoundsByEvent(evt.id, currentRound)
                //carga las gallerias si existen del evento
                await fetchGalleriesByEvent(evt.id)
                //carga las restricciones
                await fetchActivityEvent(evt.id);

            } else {
                setToastProps({ message: res.message || "No se pudo obtener los eventos", type: TOAST.DANGER });
            }
        } catch (error) {
            console.error("Error crítico cargando datos iniciales:", error);
            setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
        }
        finally {

            setInitialLoading(false);
        }
    }, [token, currentEvent, setCurrentEvent, fetchRoundsByEvent, currentRound, fetchGalleriesByEvent, fetchActivityEvent, setToastProps]);




    /*
     Funcion: loadRoundDashboard
     Descripcion: carga los datos de ronda para el dashboard
     Autor: Jose Ahias Vargas
     */

    const loadRoundDashboard = useCallback(async (event, round) => {

        try {
            setInitialLoading(true);

            setEvents([event]);
            setCurrentEvent(event);

            await fetchRoundsByEvent(event.id, round);
            await fetchGalleriesByEvent(event.id)
            await fetchActivityEvent(event.id);

        }
        finally {

            setInitialLoading(false);
        }
    }, [fetchRoundsByEvent, fetchGalleriesByEvent, fetchActivityEvent]);



    /*
     useEffect
     Descripcion: carga las rondas una sola vez, si no existe un evento seleccionado desde el principio
     Autor: Jose Ahias Vargas
     */

    useEffect(() => {

        if (!isMounted.current && !currentEventSelected) {

            console.log('carga inicial en roundContainer, fuera del dashboard')

            loadInitialData();
            isMounted.current = true;
        }
    }, [currentEventSelected, loadInitialData]);


    /*
     useEffect
     Descripcion: Solo entra si se le pasa un evento desde el comienzo
     la setea como ronda actual para mostrar su información
     Autor: Jose Ahias Vargas
     */

    useEffect(() => {

        const syncEvent = async () => {

            if (!currentEventSelected) return;

            if (lastSyncedEvent.current === currentEventSelected.id) return;

            console.log('carga por el dashboard evento')

            lastSyncedEvent.current = currentEventSelected.id;


            await loadRoundDashboard(currentEventSelected, currentRoundSelected)



        };

        syncEvent();

    }, [currentEventSelected, currentRoundSelected, loadRoundDashboard]);



    /*
     Funcion: syncRoundState
     Descripcion: sincroniza las rondas con los cambios
    */


    const syncRoundState = (updatedRound, mode = MODE.UPDATE) => {

        setCurrentRound(updatedRound);

        setRounds(prev => {
            if (mode === MODE.CREATE) {
                return [...prev, updatedRound];
            }

            return prev.map(f =>
                f.id === updatedRound.id ? updatedRound : f
            );
        });
    };



    /*
     Funcion: syncGalleryState
     Descripcion: sincroniza las gallerias con los cambios
    */


    const syncGalleryState = (updatedGallery, mode = MODE.UPDATE) => {

        setGalleriesEvent(updatedGallery);
        (prev => {
            if (mode === MODE.CREATE) {
                return [...prev, updatedGallery];
            }

            return prev.map(f =>
                f.id === updatedGallery.id ? updatedGallery : f
            );
        });
    };



    /*
     Funcion: insertGallery
     Descripcion: inserta la galleria al evento
    */

    const insertGalleryEvent = async (name) => {

        setLoading(true);

        try {
            const res = await EventService.insertGalleryEvent(
                { eventId: currentEvent.id, name: name },
                token
            );

            if (res.code === STATUS.OK) {

                syncGalleryState(res.data);

                return true;
            } else {
                setToastProps({
                    message: res.message || "Error al guardar la galleria",
                    type: TOAST.DANGER
                });

                return false;
            }

        } catch (error) {
            console.error(error);
            setToastProps({
                message: "Error de conexión al guardar la galleria",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };



    /*
     Funcion: removeGalleryEvent
     Descripcion: elimina la galleria del evento
    */

    const removeGalleryEvent = async (galleryId) => {

        setLoading(true);

        try {
            const res = await EventService.removeGalleryEvent(
                { eventId: currentEvent.id, galleryId: galleryId },
                token
            );

            if (res.code === STATUS.OK) {

                syncGalleryState(res.data);

                return true;
            } else {
                setToastProps({
                    message: res.message || "Error al eliminar la galleria",
                    type: TOAST.DANGER
                });

                return false;
            }

        } catch (error) {
            console.error(error);
            setToastProps({
                message: "Error de conexión al eliminar la galleria",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };




    /*
     Funcion: saveMatchMaking
     Descripcion: insert masivo de las peleas
    */

    const saveMatchMaking = async (matches) => {

        setLoading(true);

        try {
            const res = await fightService.saveMatchMaking(
                { roundId: currentRound.id, matches },
                token
            );

            if (res.code === STATUS.OK) {

                const updatedFights = res.data;

                setFights(updatedFights);

                socket.emit(SOCKET_EVENTS.EMIT.FIGHT_UPDATE, {
                    fightId: null
                });

                //para transmitir el cambio a las peleas en el dashboard si se paso el prop y  se pasa un _sync especial para que detecte una nueva carga
                onRoundChange({ ...currentRound, _sync: Date.now() });

                return true;
            } else {
                setToastProps({
                    message: res.message || "Error al guardar el pareo",
                    type: TOAST.DANGER
                });

                return false;
            }

        } catch (error) {
            console.error(error);
            setToastProps({
                message: "Error de conexión al guardar el pareo",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };


    /*
     Funcion: startRound
     Descripcion: inicia la ronda
    */

    const startRound = async () => {

        setLoading(true);

        try {
            const res = await RoundService.startRound(
                { eventId: currentEvent.id, roundId: currentRound.id },
                token
            );

            if (res.code === STATUS.OK) {

                const updatedRound = res.data;

                syncRoundState(updatedRound)

                setRoundFilter(ROUND.LIVE);

                socket.emit(SOCKET_EVENTS.EMIT.ROUND_START, {
                    roundId: updatedRound.id
                });


                const chat = await ChatService.sendChatMessage({userId: iduser, eventId: currentEvent.id, message: `La ronda #${currentRound.number} ha iniciado 🏁`}, token);
                if (chat.code === STATUS.OK){

                socket.emit(SOCKET_EVENTS.EMIT.CHAT_MESSAGE, {
                chatId: chat.data.id
                });

                }


                fetchActivityEvent(currentEvent.id);


                setToastProps({ message: "Ronda iniciada", type: TOAST.SUCCESS });
                return true;
            } else {
                setToastProps({
                    message: res.message || "Error al iniciar la Ronda",
                    type: TOAST.DANGER
                });

                return false;
            }

        } catch (error) {
            console.error(error);
            setToastProps({
                message: "Error de conexión al iniciar la Ronda",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };



    /*
     Funcion: finishRound
     Descripcion: Finaliza la ronda o la cancela
    */

    const finishRound = async () => {

        setLoading(true);


        try {

            const res = await RoundService.finishRound({ eventId: currentEvent.id, roundId: currentRound.id }, token);

            if (res.code === STATUS.OK) {

                const updatedRound = res.data;

                syncRoundState(updatedRound)

                setRoundFilter(ROUND.FINISHED);

                socket.emit(SOCKET_EVENTS.EMIT.ROUND_FINISH, {
                    roundId: updatedRound.id,
                    winner: updatedRound?.winner || null
                });

             const chat = await ChatService.sendChatMessage({userId: iduser, eventId: currentEvent.id, message: `La ronda #${currentRound.number} ha finalizado 🏁`}, token);
                if (chat.code === STATUS.OK){

                socket.emit(SOCKET_EVENTS.EMIT.CHAT_MESSAGE, {
                chatId: chat.data.id
                });

                }


                fetchActivityEvent(currentEvent.id);

                setToastProps({ message: "Se finalizo la ronda", type: TOAST.SUCCESS });


                return true;

            }
            else {

                setToastProps({
                    message: res.message || `No se pudo finalizar la ronda`,
                    type: TOAST.DANGER
                });
                return false;
            }




        } catch (error) {

            console.log(error);

            setToastProps({
                message: "Error de conexión al finalizar la ronda",
                type: TOAST.DANGER
            });

            return false;

        }
        finally {

            setLoading(false);
        }




    }


    /*
     Funcion: cancelRound
     Descripcion: Cancela la ronda
    */

    const cancelRound = async () => {

        setLoading(true);


        try {

            const res = await RoundService.cancelRound({ eventId: currentEvent.id, roundId: currentRound.id }, token);

            if (res.code === STATUS.OK) {

                const updatedRound = res.data;

                syncRoundState(updatedRound)

                setRoundFilter(ROUND.CANCELLED);

                socket.emit(SOCKET_EVENTS.EMIT.ROUND_CANCEL, {
                    roundId: updatedRound.id,
                    winner: updatedRound?.winner || null
                });

                const chat = await ChatService.sendChatMessage({userId: iduser, eventId: currentEvent.id, message: `La ronda #${currentRound.number} fue cancelada ❌, el dinero de las apuestas abiertas fue reembolsado 💰`}, token);
                if (chat.code === STATUS.OK){

                socket.emit(SOCKET_EVENTS.EMIT.CHAT_MESSAGE, {
                chatId: chat.data.id
                });

                }

                fetchActivityEvent(currentEvent.id);

                setToastProps({ message: "Se cancelo la ronda", type: TOAST.SUCCESS });

                return true;

            }
            else {

                setToastProps({
                    message: res.message || `No se pudo cancelar la ronda`,
                    type: TOAST.DANGER
                });
                return false;
            }





        } catch (error) {

            console.log(error);

            setToastProps({
                message: "Error de conexión al cancelar la ronda",
                type: TOAST.DANGER
            });

            return false;

        }
        finally {

            setLoading(false);
        }




    }



    /*
     Funcion: createRound
     Descripcion: crea la ronda
    */

    const createRound = async (props) => {

        setLoading(true);


        try {


            const res = await RoundService.createRound({ eventId: currentEvent.id, number: props["roundNumberInput"], gallo1: props["galloAInput"], gallo2: props["galloBInput"] }, token);

            if (res.code === STATUS.OK) {

                const newRound = res.data;


                syncRoundState(newRound, MODE.CREATE);

                setRoundFilter(ROUND.PENDING);



                socket.emit(SOCKET_EVENTS.EMIT.ROUND_CREATE, {
                });

                setToastProps({ message: "Se creo la ronda", type: TOAST.SUCCESS });

                return true;

            }
            else {

                setToastProps({ message: res.message || 'No se pudo crear la ronda', type: TOAST.DANGER });
                return false;
            }





        } catch (error) {

            console.log(error);

            setToastProps({
                message: "Error de conexión al crear la ronda",
                type: TOAST.DANGER
            });

            return false;

        }
        finally {

            setLoading(false);
        }




    }



    /*
     Funcion: updateRound
     Descripcion: actualiza la ronda
    */

    const updateRound = async (props) => {

        setLoading(true);


        try {


            const res = await RoundService.updateRound({ number: props["roundNumberInput"], gallo1: props["galloAInput"], gallo2: props["galloBInput"], roundId: props["idRoundInput"] }, token);

            if (res.code === STATUS.OK) {

                const updateRound = res.data;


                syncRoundState(updateRound);


                socket.emit(SOCKET_EVENTS.EMIT.ROUND_UPDATE, {
                    roundId: updateRound.id
                });

                setToastProps({ message: "Se actualizo la ronda", type: TOAST.SUCCESS });


                return true;

            }
            else {

                setToastProps({ message: res.message || 'No se pudo actualizar la ronda', type: TOAST.DANGER });
                return false;
            }





        } catch (error) {

            console.log(error);

            setToastProps({
                message: "Error de conexión al actualizar la ronda",
                type: TOAST.DANGER
            });

            return false;

        }
        finally {

            setLoading(false);
        }



    }



    /*
     Funcion: handleStartRound
     Descripcion: Cambia ronda a LIVE
    */
    const handleStartRound = async () => {

        if (!currentRound || !currentEvent) return;

        showConfirm({ title: 'Confirmación', message: '¿Deseas iniciar la ronda en vivo?', onConfirm: () => startRound() })

    };

    /*
     Funcion: handleFinishRound
     Descripcion: Finaliza cualquier ronda activa
    */
    const handleFinishRound = async (resultType) => {

        if (!currentRound || !currentEvent) return;

        showConfirm({ title: 'Confirmación', message: '¿Seguro que deseas finalizar esta ronda?', onConfirm: () => finishRound(resultType) })

    };

    /*
     Funcion: handleCancelRound
     Descripcion: Cancela cualquier ronda activa
    */
    const handleCancelRound = async () => {

        if (!currentRound || !currentEvent) return;

        showConfirm({ title: 'Confirmación', message: '¿Seguro que desea cancelar la ronda? el dinero de las apuestas de la pelea en curso se reembolsara', onConfirm: () => cancelRound() })

    };



    /*
     Funcion: handleDeleteGallery
     Descripcion: handler para eliminacion de galleria
    */
    const handleDeleteGallery = async (id) => {

        if (!id) return;

        showConfirm({ title: 'Confirmación', message: '¿Seguro que deseas eliminar esta galleria?', onConfirm: () => removeGalleryEvent(id) })

    };


    /*
 Funcion: handleMatchMaking
 Descripcion: handler para hacer los enfrentamientos de gallerias
*/
    const handleMatchMaking = async (matches) => {

        if (matches.length > 0)
            showConfirm({ title: 'Confirmación', message: '¿Seguro que deseas agregar estos enfrentamientos?', onConfirm: () => saveMatchMaking(matches) })
        else
            showConfirm({ title: 'Confirmación', message: '¿Seguro que deseas limpiar todos los enfrentamientos de la ronda?', onConfirm: () => saveMatchMaking([]) })

    };

    /*
 Funcion: handleSelected
 Descripcion: handler que se dispara cuando hay cambio de ronda en el listado
*/
    const handleSelected = async (round) => {
        setCurrentRound(round);
        onRoundChange(round);
        await loadFightsByRound(round.id);


    };



    /*
     Funcion: handleEventChange
     Descripcion: carga las peleas en base al evento
     Autor: Jose Ahias Vargas
     */

    const handleEventChange = (async (id) => {
        if (!id) return;

        const nextEvent = events.find(e => e.id === id);

        setCurrentEvent(nextEvent);


        setSelectIsLoading(true);

        try {

            await fetchRoundsByEvent(id);
            await fetchGalleriesByEvent(id);

        } catch (error) {
            console.error("Error crítico cargando datos de rondas:", error);
            setToastProps({ message: "Error crítico cargando datos de rondas", type: TOAST.DANGER });
        }
        finally {

            setSelectIsLoading(false);

        }
    });




    /*
    funcion: handleRoundModal
    Descripción: abre un modal para crear o editar una ronda
    Autor: Jose Ahias Vargas
    */

    const handleRoundModal = (currentRound) => {

        const title = currentRound ? "Editar Ronda" : "Crear Ronda";
        const confirmText = currentRound ? "Actualizar" : "Crear";

        resetModalFormData();

        setRequiredFields([
            "roundNumberInput",
        ]);

        setFieldRules({ roundNumberInput: { min: 1, max: 100 } });


        setModalComponent(() => () =>
            <RoundForm
                round={currentRound}
            />);

        setModalProps(
            {
                title: title,
                cancelText: "Cancelar",
                confirmText: confirmText,
            });


        const confirmCallback = currentRound ? updateRound.bind(null) : createRound.bind(null);

        setConfirmModalCallback(() => confirmCallback);

        toggleModal(true);


    }


    if (initialLoading) {
        return <div className="flex min-h-[420px] items-center justify-center bg-brand-950 animate__animated animate__fadeIn">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
        </div>;
    }


    return (
        <div className="space-y-4 animate__animated animate__fadeIn">
            {!currentEventSelected && (
                <div className="mb-4 flex flex-col gap-3  border border-white/10 bg-white/[0.05] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.24)] sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                                <li><a className="text-gold-300 hover:text-gold-400" href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }}>Dashboard</a></li>
                                <li className="text-white/30">/</li>
                                <li><a className="text-gold-300 hover:text-gold-400" href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/events'); }}>Eventos</a></li>
                                <li className="text-white/30">/</li>
                                <li className="text-white/45">Ronda</li>
                            </ol>
                        </nav>
                        <h4 className="mb-0 text-xl font-black text-white">
                            Evento: {currentEvent?.name || "Sin evento seleccionado"}
                        </h4>
                    </div>
                    <button className="!inline-flex !items-center !gap-2 ! !border !border-white/12 !bg-white/[0.06] !px-4 !py-2.5 !text-sm !font-black !text-white/75 transition hover:!bg-white/[0.1]" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left !text-current"></i>
                        Regresar
                    </button>
                </div>
            )}

            <div className="grid gap-3 lg:grid-cols-[0.82fr_1.18fr]">

                {/* ================= LEFT COLUMN ================= */}
                <div>

                    <div className="h-full bg-white/[0.04] p-3 shadow-[0_16px_45px_rgba(0,0,0,0.22)]">
                        <div className="flex h-full flex-col">

                            <div className="mb-3 flex items-center justify-between gap-3  border-white/10 pb-2.5">
                                <h5 className="mb-0 text-xs font-black uppercase tracking-[0.12em] text-white">
                                    Rondas del Evento
                                </h5>

                                <div>
                                    <button
                                        className="!inline-flex !items-center !gap-1.5 ! !border-0 !bg-[linear-gradient(180deg,#f4d77c,#b8860b)] !px-3 !py-1.5 !text-xs !font-black !text-black transition hover:!brightness-110"
                                        onClick={() => handleRoundModal(null)}
                                    >
                                        <i className="bi bi-plus-lg !text-current"></i>
                                        Crear
                                    </button>
                                </div>
                            </div>

                            <div className="min-h-0 flex-grow">

                                <RoundList
                                    rounds={rounds}
                                    currentRound={currentRound}
                                    onSelected={handleSelected}
                                    filter={roundFilter}
                                    setFilter={setRoundFilter}
                                    events={events}
                                    selectedEventId={currentEvent?.id}
                                    onEventChange={handleEventChange}
                                    selectIsLoading={selectIsLoading}
                                    showEventBar={showEventBar}
                                />
                            </div>

                        </div>
                    </div>

                </div>

                {/* ================= RIGHT COLUMN ================= */}
                <div>

<div className="h-full bg-white/[0.04] p-3 shadow-[0_16px_45px_rgba(0,0,0,0.22)]">

                        <div className="flex h-full flex-col">

                            {currentRound ? (
                                <div>

                                    <div className="mb-3 flex items-center justify-between gap-3  border-white/10 pb-2.5">
                                        <h5 className="mb-0 text-xs font-black uppercase tracking-[0.12em] text-white">
                                            Ronda #{currentRound.number}
                                        </h5>

                                        <div className="flex justify-end gap-2">
                                                {(currentRound.status === ROUND.PENDING || currentRound.status === ROUND.LIVE) && (
                                                    <button
                                                        className="!inline-flex !items-center !gap-1.5 ! !border !border-danger-soft/35 !bg-danger-soft/12 !px-2.5 !py-1.5 !text-[0.6rem] !font-black !uppercase !tracking-[0.1em] !text-danger-soft transition hover:!bg-danger-soft/20"
                                                        onClick={() => handleRoundModal(currentRound)}
                                                    >
                                                        <i className="bi bi-pencil-square !text-current"></i>
                                                        Editar
                                                    </button>
                                                )}
                                        </div>
                                    </div>

                                    <RoundManager
                                        round={currentRound}
                                        currentEvent={currentEvent}
                                        loading={loading}
                                        eventGalleries={galleriesEvent}
                                        fightsInRound={fights}
                                        activity={activity}
                                        onAddGallery={insertGalleryEvent}
                                        onRemoveGallery={handleDeleteGallery}
                                        onSaveMatchmaking={handleMatchMaking}
                                        onStart={handleStartRound}
                                        onFinish={handleFinishRound}
                                        onCancel={handleCancelRound}
                                        showEventBtn={!currentEventSelected}
                                    />


                                    {(currentRound.status === ROUND.PENDING || currentRound.status === ROUND.LIVE) && (!currentEventSelected) && (


                                        <button
                                            className="!mt-3 !inline-flex !items-center !gap-2 ! !border !border-info-soft/25 !bg-info-soft/12 !px-3 !py-2 !text-xs !font-black !text-info-soft transition hover:!bg-info-soft/20"
                                            onClick={() => navigate(`/admin/fights`, {
                                                state: currentRound

                                            })}
                                        >
                                            <i className="bi bi-trophy !text-current"></i>
                                            Administrar Peleas
                                        </button>

                                    )}


                                </div>
                            ) : (
                                <div className="flex flex-grow items-center justify-center bg-black/25 p-6 text-center text-xs text-white/50">
                                    Selecciona una ronda para administrarla
                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default RoundContainer;

