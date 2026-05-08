/*Componente: StreamProvider.jsx
Descripción: Contexto para manejar el streaming global en la aplicación.
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


import React, {
  useState,
  useMemo,
  useCallback,
} from "react";
import { StreamContext } from "./StreamContext";
import StreamPlayer from "../components/Streaming/StreamPlayer";


export const StreamProvider = ({ children }) => {

  const [streamInfo, setStreamInfo] = useState({
        url: null,
        type: null,
        status: null,
        banner: null,
        title: ""
    });


  const [openPanel, setOpenPanel] = useState(false);

  const [isPaused, setIsPaused] = useState(false);


  /*
  Función: setOpenPanelVideo
  Descripción: abre o cierra el panel del video
  */
  const setOpenPanelVideo = useCallback((val) => {

        if(val){
        setOpenPanel(true);
        setIsPaused(false);
        }
        else{

        setOpenPanel(false);
        setIsPaused(true);
        }
        
    }, []);


  /*
  Función: playStream
  Descripción: setea la información del stream para que el componente de reproducción pueda mostrarlo.
  */
  const playStream = useCallback((url, status, banner, title = "") => {
        setStreamInfo({ url, status, banner, title });
        setOpenPanelVideo(true);
    }, [setOpenPanelVideo]);

  /*
  Función: stopStream
  Descripción: limpia la información del stream para detener la reproducción y ocultar el componente relacionado.
  */
const stopStream = useCallback(() => {
        setStreamInfo({ url: null, status: null, banner: null, title: "" });
        setOpenPanelVideo(false);
    }, [setOpenPanelVideo]);


  // Memoiza el valor para evitar re-renderizados innecesarios y el usecallback evita que se renderice nuevamente la funcion 
  //y debe ser utilizado si se pasa la funcion en el context como parametro ya que es una forma eficiente de evitar re-renderizados
  
  const contextValue = useMemo(
    () => ({
      streamInfo,
      openPanel,
      isPaused,
      setStreamInfo,
      playStream,
      stopStream,
      setOpenPanelVideo
    }),
    [isPaused, openPanel, setOpenPanelVideo, playStream, stopStream, streamInfo]
  );

  return (
<StreamContext.Provider value={contextValue}>
{children}
{/* El reproductor se renderiza aquí para ser persistente en toda la App */}
  <StreamPlayer />
  </StreamContext.Provider>
  );
};
