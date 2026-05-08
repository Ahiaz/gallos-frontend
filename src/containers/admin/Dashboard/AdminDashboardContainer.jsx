/*
Componente: AdminDashboardContainer.jsx
Descripción: Contenedor principal del dashboard del administrador
Autor: Jose Ahias Vargas
*/


import { useCallback, useEffect, useRef, useState } from "react";
import AdminDashboard from "../../../components/admin/Dashboard/AdminDashboard";
import EventService from "../../../services/eventService";
import { useSecurity } from "../../../hooks/useSecurity";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { useToast } from "../../../hooks/useToast";
import { useStorage } from "../../../hooks/useStorage";
import { STORAGE } from "../../../constants/storageConstants";
import RoundService from "../../../services/roundService";

const AdminDashboardContainer = () => {
    const [initialLoading, setInitialLoading] = useState(false);
    const { setToastProps } = useToast();
    const { token } = useSecurity();
    const isMounted = useRef(false);
    const [currentEvent, setCurrentEvent] = useStorage(STORAGE.ROUND_VIEW, "currentEvent", null);
    const [currentRound, setCurrentRound] = useStorage(STORAGE.ROUND_VIEW, "currentRound", null);



    /*
     Funcion: loadInitialData
     Descripcion: carga los datos iniciales
     Autor: Jose Ahias Vargas
     */

    const loadInitialData = useCallback(async () => {
        try {
            // 1. Obtener Evento en vivo
            setInitialLoading(true);
            const eventRes = await EventService.fetchLiveEvent({}, token);

            if (eventRes.code !== STATUS.OK) {
                setToastProps({ message: eventRes.message || "Error al cargar evento", type: TOAST.DANGER });
                return;
            }

            const event = eventRes.data;

            if (!event) return;

            setCurrentEvent(event);

            // 2. Obtener la ronda activa (Depende del evento)
            const roundRes = await RoundService.fetchLiveRoundByEventId({ eventId: event.id }, token);

            if (roundRes.code !== STATUS.OK && roundRes.data) {
                setToastProps({ message: roundRes.message || "No se pudo obtener la ronda", type: TOAST.DANGER });
                return;
            }

            const round = roundRes.data;

            if (!round) return;

            setCurrentRound(round);



        } catch (error) {
            console.error("Error crítico cargando datos admin:", error);
            setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
        }
        finally{

            setInitialLoading(false);
        }
    }, [setCurrentEvent, setCurrentRound, setToastProps, token]);


    /*
     useEffect
     Descripcion: Carga los datos iniciales del evento, evento y ronda, siempre y cuando no exista una guardada en el storage, 
     para evitar recargas innecesarias, y solo se ejecute en la primera carga del componente
     Autor: Jose Ahias Vargas
     */
   
    useEffect(() => {
        if(!isMounted.current && !currentEvent){
        console.log('...cargando datos iniciales admin-dashboard')
        loadInitialData();
        isMounted.current = true; 
       }
 

    }, [currentEvent, currentRound, loadInitialData]);


    /*
     setCurrentEvent
     Descripcion: Handlers para propagar cambios desde el event al roundContainer
     Autor: Jose Ahias Vargas
     */
    const handleEventChange = (event) => {

        const isDifferentEvent = currentEvent?.id !== event?.id;

        setCurrentEvent(event);

        if(isDifferentEvent)
        setCurrentRound(null); // Resetear ronda si el evento cambia y es diferente al que estaba seleccionado
        
    };

    /*
     handleRoundChange
     Descripcion: Handler para propagar cambios desde el round hacia fightContainer
     Autor: Jose Ahias Vargas
     */

     const handleRoundChange = (round) => {
        setCurrentRound(round);
    };


    return (
        <AdminDashboard
            componentLoading={initialLoading}
            currentEvent={currentEvent}
            currentRound={currentRound}
            handleSetCurrentEvent={handleEventChange}
            handleSetCurrentRound={handleRoundChange}
        />
    );
};

export default AdminDashboardContainer;