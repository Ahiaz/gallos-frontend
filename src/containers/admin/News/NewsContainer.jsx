/*
Componente: NewsContainer.jsx
Descripción: Contenedor lógico para manejo de noticias
Autor: Jose Ahias Vargas
*/

import { useCallback, useEffect, useRef, useState } from "react";
import NewsService from "../../../services/newsService";
import NewsManager from "../../../components/admin/News/NewsManager";
import NewsList from "../../../components/admin/News/NewsList";
import NewsForm from "../../../components/admin/News/NewsForm";
import { useSocket } from "../../../hooks/useSocket";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { useModal } from "../../../hooks/useModal";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { NEWS, NEWS_FILTERS } from "../../../constants/newConstants";
import { MODE } from "../../../constants/modeConstants";
import { SOCKET_EVENTS } from "../../../constants/socketConstants";

import styles from '../../../styles/General.module.css';

const NewsContainer = () => {
    const isMounted = useRef(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const { socket } = useSocket();
    const { token } = useSecurity();
    const { setToastProps } = useToast();
    const [news, setNews] = useState([]);
    const [currentNews, setCurrentNews] = useState(null);
    const [newsFilter, setNewsFilter] = useState(NEWS_FILTERS.ALL);

    const {
        toggleModal,
        setModalComponent,
        setModalProps,
        resetModalFormData,
        setConfirmModalCallback,
        setRequiredFields
    } = useModal();

    /*
     Funcion: loadNews
     Descripcion: carga todas las noticias desde la DB
     */
    const loadNews = useCallback(async () => {
        try {

            setInitialLoading(true);

            const res = await NewsService.findAllNews({}, token);

            if (res.code === STATUS.OK) {
                const data = res.data || [];
                setNews(data);
                
                const activeNew = data.find(e => e.status === NEWS.ACTIVE);
                

                if (activeNew) {
                    setCurrentNews(activeNew);
                    setNewsFilter(NEWS.ACTIVE);
                }
                else{

                    if(data.length > 0){
                    setCurrentNews(data[0]);
                    setNewsFilter(NEWS.INACTIVE);
                    }


                }


            } else {
                setNews([]);
                setCurrentNews(null);
                setToastProps({ message: res.message || "No se pudieron obtener las noticias", type: TOAST.DANGER });
            }
        } catch (error) {
            console.error(error);
            setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
        } finally {
            setInitialLoading(false);
        }
    }, [token, setToastProps]);


    useEffect(() => {
        if (!isMounted.current) {
            loadNews();
            isMounted.current = true;
        }
    }, [loadNews]);

    /*
     Funcion: syncNewsState
     Descripcion: sincroniza el listado local tras crear o editar
    */
    const syncNewsState = (updatedItem, mode = MODE.UPDATE) => {

        setCurrentNews(updatedItem);
        setNews(prev => {
            if (mode === MODE.CREATE) {
                return [updatedItem, ...prev];
            }
            return prev.map(n => n.id === updatedItem.id ? updatedItem : n);
        });
    };

    /*
     Funcion: createNews
     Descripcion: procesa la creación de una noticia (con imagen)
    */
    const createNews = async (props) => {

        try {
            const formData = new FormData();
            formData.append("title", props["titleInput"]);
            formData.append("description", props["descriptionInput"]);
            formData.append("status", props["statusInput"]);

            if (props["imageInput"]) {
                formData.append("banner", props["imageInput"]);
            }

            const res = await NewsService.createNew(formData, token);

            if (res.code === STATUS.OK) {
                syncNewsState(res.data, MODE.CREATE);
                setNewsFilter(NEWS.ACTIVE);
                socket.emit(SOCKET_EVENTS.EMIT.NEWS_CREATE, {
                    newsId: res.id
                });
                setToastProps({ message: "Noticia publicada con éxito", type: TOAST.SUCCESS });

                return true;
            } else {
                setToastProps({ message: res.message || "No se pudo publicar la noticia", type: TOAST.DANGER });
                return false;
            }
        } catch (error) {
            console.error(error);
            setToastProps({ message: "Error al crear noticia", type: TOAST.DANGER });
            return false;
        }
      
    };

    /*
     Funcion: updateNews
     Descripcion: procesa la actualización de una noticia existente
    */
    const updateNews = async (props) => {
        try {
            const formData = new FormData();
            formData.append("id", props["idNewsInput"]);
            formData.append("title", props["titleInput"]);
            formData.append("description", props["descriptionInput"]);
            formData.append("status", props["statusInput"]);

            if (props["imageInput"] instanceof File) {
                formData.append("banner", props["imageInput"]);
            }

            const res = await NewsService.updateNew(formData, token);

            if (res.code === STATUS.OK) {

                syncNewsState(res.data, MODE.UPDATE);
                setToastProps({ message: "Noticia actualizada", type: TOAST.SUCCESS });
                return true;
            } else {
                setToastProps({ message: res.message || "No se pudo actualizar la noticia", type: TOAST.DANGER });
                return false;
            }
        } catch (error) {
            console.error(error);
            setToastProps({ message: "Error al actualizar noticia", type: TOAST.DANGER });
            return false;
        } 
    };

    /*
     Funcion: handleNewsModal
     Descripcion: Configura y abre el modal para crear o editar
    */
    const handleNewsModal = (item) => {
        const title = item ? "Editar Noticia" : "Publicar Noticia";
        const confirmText = item ? "Actualizar" : "Publicar";

        resetModalFormData();
        setRequiredFields(["titleInput", "statusInput"]);

        setModalComponent(() => () => <NewsForm news={item} />);

        setModalProps({
            title,
            cancelText: "Cancelar",
            confirmText: confirmText
        });

        const confirmCallback = item ? updateNews.bind(null) : createNews.bind(null);
        setConfirmModalCallback(() => confirmCallback);
        toggleModal(true);
    };

if (initialLoading) {
    return <div className="flex min-h-screen items-center justify-center animate__animated animate__fadeIn">
             <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
           </div>;
  }


    return (

        
        <div className="w-[92%] mx-auto mt-6 space-y-4 animate__animated animate__fadeIn">
            <div className="grid gap-4 md:grid-cols-[5fr_7fr]">

                {/* COLUMNA IZQUIERDA: Listado */}
                <div className="flex flex-col rounded-xl border border-white/10 bg-[#111111]">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <h5 className="mb-0 text-sm font-black text-white">Listado de Noticias</h5>
                        <button
                            className={styles.btnWarning}
                            onClick={() => handleNewsModal(null)}
                        >
                            Crear
                        </button>
                    </div>
                    <div className="flex-1 p-3">
                        <NewsList
                            news={news}
                            currentNews={currentNews}
                            onSelect={setCurrentNews}
                            filter={newsFilter}
                            setFilter={setNewsFilter}
                        />
                    </div>
                </div>

                {/* COLUMNA DERECHA: Detalle */}
                <div className="flex flex-col rounded-xl border border-white/10 bg-[#111111]">
                    {currentNews ? (
                        <>
                            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                                <h5 className="mb-0 truncate text-sm font-black text-white">
                                    {currentNews.title}
                                </h5>
                                <button
                                    className={styles.btnDanger}
                                    onClick={() => handleNewsModal(currentNews)}
                                >
                                    Editar
                                </button>
                            </div>
                            <div className="flex-1 p-4">
                                <NewsManager news={currentNews} />
                                {currentNews.image_url && (
                                    <div className="mt-4">
                                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/45">Imagen destacada</p>
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${currentNews.image_url}`}
                                            alt="News"
                                            className="w-full rounded-xl object-cover"
                                            style={{ maxHeight: '300px' }}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 items-center justify-center p-10">
                            <div className="text-center">
                                <i className="bi bi-newspaper mb-3 block text-3xl text-white/20" />
                                <p className="text-sm text-white/35">Selecciona una noticia para ver su detalle</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsContainer;