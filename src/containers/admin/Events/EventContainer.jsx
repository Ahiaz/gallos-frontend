/*
Componente: EventContainer.jsx
Descripción: Contenedor lógico para manejo de eventos
Autor: Jose Ahias Vargas Pacheco
*/

import { useCallback, useEffect, useRef, useState } from "react";
import EventService from "../../../services/eventService";
import EventManager from "../../../components/admin/Events/EventManager";
import EventList from "../../../components/admin/Events/EventList";
import EventForm from "../../../components/admin/Events/EventForm";

import { useSocket } from "../../../hooks/useSocket";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { useModal } from "../../../hooks/useModal";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import { useStream } from "../../../hooks/useStream";

import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { EVENT, EVENT_FILTERS } from "../../../constants/eventConstants";
import { MODE } from "../../../constants/modeConstants";
import { useNavigate } from "react-router-dom";
import { SOCKET_EVENTS } from "../../../constants/socketConstants";

const EventContainer = ({ currentEventSelected = null, setCurrentEventSelected = () => { } }) => {

    const isMounted = useRef(false);

    const { socket } = useSocket();
    const { token } = useSecurity();
    const { setToastProps } = useToast();
    const { showConfirm } = useConfirmModal();
    const { playStream, stopStream } = useStream();
    const navigate = useNavigate();

    const [initialLoading, setInitialLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [activity, setActivity] = useState(null);
    const [currentEvent, setCurrentEvent] = useState(currentEventSelected);
    const [eventFilter, setEventFilter] = useState(EVENT_FILTERS.ALL);

    const {
        toggleModal,
        setModalComponent,
        setModalProps,
        resetModalFormData,
        setConfirmModalCallback,
        setRequiredFields,
        setFieldRules
    } = useModal();



    /* Función: fetchActivityEvent
    Descripción: Obtiene validaciones para ver si puede modificar el tipo o la cantidad de gallos
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
     Funcion: loadEvents
     Descripcion: carga todos los eventos
     Autor: Jose Ahias Vargas
     */

    const loadEvents = useCallback(async () => {
        try {

            setInitialLoading(true);

            const res = await EventService.fetchEvents({}, token);

            console.log("Eventos cargados:", res);

            if (res.code === STATUS.OK) {

                const data = res.data || [];
                setEvents(data);

                if (!currentEventSelected && data.length > 0) {
                    const liveEvent = data.find(e => e.status === EVENT.LIVE);
                    const scheduledEvent = data.find(e => e.status === EVENT.SCHEDULED);
                    const firstEvent = data[0];

                    const target = liveEvent || scheduledEvent || firstEvent;


                    setCurrentEvent(target);
                    setEventFilter(target.status);
                    setCurrentEventSelected(target);
                }
                else {

                    if(currentEventSelected)
                    setEventFilter(currentEventSelected.status);


                }


            } else {
                setEvents([]);
                setCurrentEvent(null);
                setToastProps({ message: res.message || "No se pudieron obtener los eventos", type: TOAST.DANGER });
            }

        } catch (error) {
            console.error(error);
            setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
        }
        finally {

            setInitialLoading(false);

        }

    }, [token, currentEventSelected, setCurrentEvent, setCurrentEventSelected, setToastProps]);



    /*
     Funcion: loadEventDashboard
     Descripcion: carga evento para el dashboard
     Autor: Jose Ahias Vargas
     */

    const loadEventDashboard = useCallback(async (event) => {
        try {

            setInitialLoading(true);
            setCurrentEvent(event);
            setEventFilter(event.status);
            await fetchActivityEvent(event.id);
        }

        catch (error) {
            console.error(error);
            setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
        }
        finally {

            setInitialLoading(false);

        }

    }, [fetchActivityEvent, setToastProps]);





    /*
     useEffect
     Descripcion: carga los eventos una sola vez
     Autor: Jose Ahias Vargas
     */

    useEffect(() => {
        if (!isMounted.current) {
            loadEvents();
            isMounted.current = true;
        }
    }, [loadEvents]);

    /*
     useEffect
     Descripcion: Sincronizar el estado interno (storage) con el prop del padre (Dashboard)
    // Si tenemos algo en el storage (currentEvent) pero el padre no lo sabe (currentEventSelected es nulo)
    // o si son diferentes, notificamos al padre.
     Autor: Jose Ahias Vargas
     */
    useEffect(() => {
        if (currentEventSelected && (!currentEvent || currentEvent.id !== currentEventSelected.id)) {

            loadEventDashboard(currentEventSelected);
            console.log("carga por el dashboard en el eventContainer")
        }
    }, [currentEvent, currentEventSelected, loadEventDashboard]);


    /*
     Funcion: syncEventState
     Descripcion: sincroniza los eventos con los cambios
    */

    const syncEventState = (updatedEvent, mode = MODE.UPDATE) => {
        // Actualiza storage interno
        setCurrentEvent(updatedEvent);

        // Transmite al Dashboard para que RoundContainer sepa el nuevo estado
        setCurrentEventSelected(updatedEvent);

        setEvents(prev => {
            if (mode === MODE.CREATE) {
                return [...prev, updatedEvent];
            }
            return prev.map(e =>
                e.id === updatedEvent.id ? updatedEvent : e
            );
        });
    };





    /*
     Funcion: startEvent
     Descripcion: inicia el evento
    */

    const startEvent = async () => {

        setLoading(true);

        try {

            const res = await EventService.startEvent(
                { eventId: currentEvent.id },
                token
            );

            if (res.code === STATUS.OK) {

                const updatedEvent = res.data;

                syncEventState(updatedEvent);

                setEventFilter(EVENT.LIVE);

                socket.emit(SOCKET_EVENTS.EMIT.EVENT_START, {
                    eventId: updatedEvent.id
                });

                setToastProps({ message: "Evento iniciado", type: TOAST.SUCCESS });

                playStream(updatedEvent.stream_url, updatedEvent.status, updatedEvent.banner, updatedEvent.name);


                return true;

            } else {
                setToastProps({ message: res.message || "No se pudo iniciar el evento", type: TOAST.DANGER });
                return false;
            }

        } catch (error) {

            console.error(error);


            setToastProps({
                message: "Error de conexión al iniciar el evento",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };

    /*
     Funcion: finishEvent
     Descripcion: Finaliza el evento
    */

    const finishEvent = async () => {

        setLoading(true);

        try {

            const res = await EventService.finishEvent(
                {},
                token
            );

            if (res.code === STATUS.OK) {

                const updatedEvent = res.data;

                syncEventState(updatedEvent);

                setEventFilter(EVENT.FINISHED);

                socket.emit(SOCKET_EVENTS.EMIT.EVENT_FINISH, {
                    eventId: updatedEvent.id
                });

                setToastProps({ message: "Evento finalizado", type: TOAST.SUCCESS });


                return true;

            } else {

                setToastProps({ message: res.message || "No se pudo finalizar el evento", type: TOAST.DANGER });
                return false;
            }

        } catch (error) {

            console.error(error);

            setToastProps({
                message: "Error de conexión al finalizar el evento",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };


    /*
     Funcion: cancelEvent
     Descripcion: Cancela el evento
    */

    const cancelEvent = async () => {

        setLoading(true);

        try {


            const res = await EventService.cancelEvent(
                { eventId: currentEvent.id },
                token
            );

            if (res.code === STATUS.OK) {

                const updatedEvent = res.data;

                syncEventState(updatedEvent);

                setEventFilter(EVENT.CANCELLED);

                socket.emit(SOCKET_EVENTS.EMIT.EVENT_CANCEL, {
                    eventId: updatedEvent.id
                });

                setToastProps({ message: "Evento cancelado", type: TOAST.SUCCESS });

                stopStream();


                return true;

            } else {

                setToastProps({ message: res.message || "No se pudo cancelar el evento", type: TOAST.DANGER });
                return false;
            }

        } catch (error) {

            console.error(error);

            setToastProps({
                message: "Error de conexión al cancelar el evento",
                type: TOAST.DANGER
            });

            return false;
        } finally {

            setLoading(false);
        }
    };


    /*
     Funcion: createEvent
     Descripcion: crea el evento
    */

    const createEvent = async (props) => {

        setLoading(true);

        try {


            const formData = new FormData();
            formData.append("name", props["nameInput"]);
            formData.append("startsAt", props["startsAtInput"]);
            formData.append("streamUrl", props["streamUrlInput"]);
            formData.append("type", props["typeInput"]);
            formData.append("gallosAmount", props["totalRoundsInput"]);

            if (props["bannerInput"]) {
                formData.append("banner", props["bannerInput"]);
            }


            const res = await EventService.createEvent(
                formData,
                token
            );

            if (res.code === STATUS.OK) {

                const newEvent = res.data;


                syncEventState(newEvent, MODE.CREATE);

                setEventFilter(EVENT.SCHEDULED);

                socket.emit(SOCKET_EVENTS.EMIT.EVENT_SCHEDULE, {
                    eventId: newEvent.id
                });

                setToastProps({ message: "Evento creado", type: TOAST.SUCCESS });


                return true;

            } else {

                setToastProps({ message: res.message || "No se pudo crear el evento", type: TOAST.DANGER });
                return false;
            }

        } catch (error) {

            console.error(error);

            setToastProps({
                message: "Error de conexión al crear el evento",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }

    };

    /*
     Funcion: updateEvent
     Descripcion: actualiza el evento
    */

    const updateEvent = async (props) => {

        setLoading(true);

        try {

            const formData = new FormData();
            formData.append("eventId", props["idEventInput"]);
            formData.append("name", props["nameInput"]);
            formData.append("startsAt", props["startsAtInput"]);
            formData.append("streamUrl", props["streamUrlInput"]);
            formData.append("type", props["typeInput"]);
            formData.append("gallosAmount", props["totalRoundsInput"]);

            if (props["bannerInput"] instanceof File) {
                formData.append("banner", props["bannerInput"]);
            }

            const res = await EventService.updateEvent(
                formData,
                token
            );

            if (res.code === STATUS.OK) {

                const updatedEvent = res.data;

                syncEventState(updatedEvent);

                setToastProps({ message: "Evento actualizado", type: TOAST.SUCCESS });

                socket.emit(SOCKET_EVENTS.EMIT.EVENT_UPDATE, {
                    eventId: updatedEvent.id
                });

                playStream(updatedEvent.stream_url, updatedEvent.status, updatedEvent.banner, updatedEvent.name);


                return true;

            } else {

                setToastProps({ message: res.message || "No se pudo actualizar el evento", type: TOAST.DANGER });
                return false;
            }

        } catch (error) {

            console.error(error);

            setToastProps({
                message: "Error de conexión al actualizar el evento",
                type: TOAST.DANGER
            });

            return false;
        }
        finally {

            setLoading(false);
        }
    };

    /*
     Funcion: handleEventModal
     Descripcion: Cambia pelea a LIVE
     Autor: Jose Ahias Vargas
    */

    const handleEventModal = (event) => {

        const title = event ? "Editar Evento" : "Crear Evento";
        const confirmText = event ? "Actualizar" : "Crear";

        if(currentEvent?.id)
        fetchActivityEvent(currentEvent.id);

        resetModalFormData();

        setRequiredFields(["nameInput", "startsAtInput", "totalRoundsInput", "typeInput"]);

        setFieldRules({ totalRoundsInput: { min: 1, max: 100 } });


        setModalComponent(() => () =>
            <EventForm event={event} activity={activity} />
        );

        setModalProps({
            title,
            cancelText: "Cancelar",
            confirmText: confirmText
        });

        const confirmCallback = event ? updateEvent.bind(null) : createEvent.bind(null);

        setConfirmModalCallback(() => confirmCallback);

        toggleModal(true);
    };


    /*
     Funcion: handleCurrentEventSelected
     Descripcion: Setea el evento seleccionado
     Autor: Jose Ahias Vargas
    */

    const handleCurrentEventSelected = (event) => {

        setCurrentEventSelected(event);
        setCurrentEvent(event);

        if (event) {
            setEventFilter(event.status);
        }

    };

    if (initialLoading) {
        return <div className="flex min-h-[420px] items-center justify-center bg-brand-950 animate__animated animate__fadeIn">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
        </div>;
    }

    return (
        <div className="space-y-4 animate__animated animate__fadeIn">

            {!currentEventSelected && (

                <div className="mb-4 flex flex-col gap-3 bg-black/25 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.24)] sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                                <li><a className="text-gold-300 hover:text-gold-400" href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }}>Dashboard</a></li>
                                <li className="text-white/30">/</li>
                                <li className="text-white/45">Evento</li>
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


            <div className="grid gap-4 animate__animated animate__fadeIn lg:grid-cols-[0.82fr_1.18fr]">

     
                <div>
          
                    <div className="h-full bg-white/[0.04] p-3 shadow-[0_16px_45px_rgba(0,0,0,0.22)]">
                        <div className="flex h-full flex-col">

                            <div className="mb-3 flex items-center justify-between gap-3 border-white/10 pb-2.5">
                                <h5 className="mb-0 text-xs font-black uppercase tracking-[0.12em] text-white">
                                    Eventos
                                </h5>

                                <div>
                                    <button
                                        className="!inline-flex !items-center !gap-1.5 ! !border-0 !bg-[linear-gradient(180deg,#f4d77c,#b8860b)] !px-3 !py-1.5 !text-xs !font-black !text-black transition hover:!brightness-110"
                                        onClick={() => handleEventModal(null)}
                                    >
                                        <i className="bi bi-plus-lg !text-current"></i>
                                        CREAR
                                    </button>
                                </div>
                            </div>


                            <div className="min-h-0 flex-grow">
                                <EventList
                                    events={events}
                                    currentEvent={currentEvent}
                                    onSelect={handleCurrentEventSelected}
                                    filter={eventFilter}
                                    setFilter={setEventFilter}
                                />
                            </div>

                        </div>
                    </div>
                </div>



                {/* ================= RIGHT COLUMN ================= */}
                <div>
                    <div className="h-full bg-white/[0.04] p-3 shadow-[0_16px_45px_rgba(0,0,0,0.22)]">
                        <div className="flex h-full flex-col">

                            {currentEvent ? (
                                <div>
                                    <div className="mb-3 flex items-center justify-between gap-3 pb-2.5">
                                        <h5 className="mb-0 text-xs font-black uppercase tracking-[0.12em] text-white">
                                            Administración
                                        </h5>
                                        {(currentEvent.status === EVENT.LIVE || currentEvent.status === EVENT.SCHEDULED) && (
                                            <button
                                                className="!inline-flex !items-center !gap-1.5 ! !border !border-danger-soft/35 !bg-danger-soft/10 !px-2.5 !py-1.5 !text-xs !font-black !uppercase !tracking-[0.08em] !text-danger-soft transition hover:!bg-danger-soft/20"
                                                onClick={() => handleEventModal(currentEvent)}
                                            >
                                                <i className="bi bi-pencil-square !text-current"></i>
                                                Editar
                                            </button>
                                        )}
                                    </div>

                                    <EventManager
                                        event={currentEvent}
                                        loading={loading}
                                        onStart={() => showConfirm({ title: "Confirmación", message: "¿Deseas iniciar el evento en vivo?", onConfirm: () => startEvent() })}
                                        onFinish={() => showConfirm({ title: "Confirmación", message: "¿Deseas finalizar el evento?", onConfirm: () => finishEvent() })}
                                        onCancel={() => showConfirm({ title: "Confirmación", message: "¿Deseas cancelar el evento?", onConfirm: () => cancelEvent() })}
                                        showAdminRoundBtn={!currentEventSelected}
                                    />

                                </div>
                            ) : (
                                <div className="flex flex-grow items-center justify-center bg-black/25 p-4 text-center text-white/50">
                                    Selecciona un evento para administrarlo
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EventContainer;
