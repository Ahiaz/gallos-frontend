/*
Componente: HomeEventsContainer.jsx
Descripción: Contenedor principal del HomeEventsContainer que maneja los eventos de gallos
Autor: Jose Ahias Vargas
*/


import { useCallback, useEffect, useRef, useState } from "react";
import { useSecurity } from "../../../hooks/useSecurity";
import {useToast} from "../../../hooks/useToast";
import HomeEvents from "../../../components/client/Events/HomeEvents";
import EventService from "../../../services/eventService";
import NewsService from "../../../services/newsService";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { EVENT } from "../../../constants/eventConstants";

const HomeEventsContainer = () => {

  const { token } = useSecurity();
  const {setToastProps} = useToast();
  const [liveEvents, setLiveEvents] = useState([]);
  const [monthEvents, setMonthEvents] = useState([]);
  const [news, setNews] = useState([]);
  const isMounted = useRef(false);
  const [initialLoading, setInitialLoading] = useState(false);


    /*
     Funcion: loadInitialData
     Descripcion: carga los datos iniciales de los eventos
     Autor: Jose Ahias Vargas
     */

    const loadInitialData = useCallback(async () => {
        try {
            setInitialLoading(true);
            const eventRes = await EventService.fetchEvents({}, token);

            if (eventRes.code !== STATUS.OK) {
                setToastProps({ message: eventRes.message || "Error al cargar los eventos", type: TOAST.DANGER });
            }

            const newRes = await NewsService.findActiveNews({}, token);

          if (newRes.code !== STATUS.OK) {
                setToastProps({ message: eventRes.message || "Error al cargar las noticias", type: TOAST.DANGER });
            }

            const event = eventRes.data || [];

            const news = newRes.data || [];

            const liveEvent = event.filter(e => e.status === EVENT.LIVE); //Filtra los que estan en vivo

            const scheduledEvent = event.filter(e => e.status === EVENT.SCHEDULED);  //filtra los que estan programados


            setLiveEvents(liveEvent);
            setMonthEvents(scheduledEvent);
            setNews(news);

          

        } catch (error) {
            console.error("Error crítico cargando datos de los eventos:", error);
            setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
        }
        finally{

          setInitialLoading(false);

        }
    }, [setToastProps, token]);




    useEffect(() => {
        if(!isMounted.current){
        loadInitialData();
        isMounted.current = true; 
       }
    }, [loadInitialData]);

if (initialLoading) {
    return <div className="flex min-h-screen items-center justify-center animate__animated animate__fadeIn">
             <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
           </div>;
  }

  return (
 <HomeEvents
 liveEvents={liveEvents}
 monthEvents={monthEvents}
 news={news}
 />
  );
};

export default HomeEventsContainer;