/*
Componente: ChatContainer.jsx
Descripción: Contenedor para el chat.
Autor: Jose Ahias Vargas
Fecha: 2026-04-27
*/
import ChatService from '../../services/chatService';
import EventService from '../../services/eventService';
import { useToast } from '../../hooks/useToast';
import { useSecurity } from '../../hooks/useSecurity';
import { useLiveChatSockets } from '../../hooks/socketEvents/useLiveChatSockets';
import { useSocket } from "../../hooks/useSocket";
import {
  TOAST
} from "../../constants/toastConstants";

import { STATUS } from "../../constants/statusConstants";

import { useCallback, useEffect, useRef, useState } from 'react';
import { SOCKET_EVENTS } from '../../constants/socketConstants';
import Chat from '../../components/Chat/Chat';
import { useConfirmModal } from "../../hooks/useConfirmModal";
import styles from '../../components/Chat/styles/Chat.module.css';

const ChatContainer = () => {

  const { setToastProps } = useToast();

  const { showConfirm } = useConfirmModal();

  const { socket } = useSocket();

  const { token, iduser, role, chatBlocked } = useSecurity();

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [liveEvent, setLiveEvent] = useState(null);

  const [cooldown, setCooldown] = useState(0);

  const chatBlock = chatBlocked == 1 ? true : false

  const chatBodyRef = useRef(null);
  const isMounted = useRef(false);


  /*
  Función: loadLiveChats
  Descripcion: obtiene los chats del evento activo
  Autor: Jose Ahias Vargas

  */

  const loadLiveChats = useCallback(async () => {

    try {
      setLoading(true);

      const result = await EventService.fetchLiveEvent({}, token);

      if (STATUS.OK === result.code) {

        if (result.data) {

          const chat = await ChatService.fetchChatMessagesByEvent({ eventId: result.data.id }, token);

          setLiveEvent(result.data);
          setMessages(chat.data);
        }

      } else {

        setToastProps({ message: result.message, type: TOAST.DANGER });

      }

    } catch (error) {
      console.error("Error crítico cargando datos del chat:", error);
      setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
    }
    finally {

      setLoading(false);
    }


  }, [setToastProps, token]);




  /*
  Función: handleSend
  Descripcion: envia un mensaje desde el chat
  Autor: Jose Ahias Vargas

  */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || cooldown > 0) return;
    if(!liveEvent) {
      setToastProps({ message: "No hay un evento en vivo activo para enviar mensajes", type: TOAST.DANGER });
      return;
    }

    try {
      setLoading(true);

      const result = await ChatService.sendChatMessage({ userId: iduser, eventId: liveEvent.id, message: input }, token);

      if (STATUS.OK === result.code) {

        socket.emit(SOCKET_EVENTS.EMIT.CHAT_MESSAGE, {
          chatId: result.data.id,
          userId: iduser
        });

        setInput("");
        setCooldown(5);

      } else {

        setToastProps({ message: result.message, type: TOAST.DANGER });

      }

    } catch (error) {
      console.error("Error crítico enviando mensaje del chat:", error);
      setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
    }
    finally {

      setLoading(false);
    }



  }


  /*
  Función: blockUser
  Descripcion: bloquea el usuario
  Autor: Jose Ahias Vargas

  */
  const blockUser = async (userId, block) => {

    try {
      setLoading(true);

      const result = await ChatService.blockChatUser({ userId, block}, token);

      if (STATUS.OK === result.code) {

        socket.emit(SOCKET_EVENTS.EMIT.CHAT_BLOCK, {
          userId: userId
        });


        setToastProps({ message: 'Bloqueado correctamente!', type: TOAST.SUCCESS });


        return true;

      } else {

        setToastProps({ message: result.message, type: TOAST.DANGER });

        return false;


      }

    } catch (error) {
      console.error("Error crítico al procesar el bloqueo", error);
      setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
      return false;

    }
    finally {

      setLoading(false);
    }



  }

  /*
  Función: handleBlock
  Descripcion: bloquea un usuario del chat
  Autor: Jose Ahias Vargas
  */

  const handleBlock = async (userid, username, block) => {

        const isBlocking = Number(block) === 1;

        const actionMessage = isBlocking 
        ? `¿Estás seguro de **bloquear** a ${username}? Sus mensajes dejarán de ser visibles para todos inmediatamente. Podra volverlo habilitar en el apartado de Usuarios`
        : `¿Deseas **desbloquear** a a ${username}? Sus mensajes previos volverán a ser visibles en el chat.`;

        showConfirm({ title: 'Confirmación', message: actionMessage, onConfirm: () => blockUser(userid, block) })

    };


  /*
useEffect
Descripcion: ejecuta la primera vez que entra en la pagina
Autor: Jose Ahias Vargas
   */
  useEffect(() => {
    if (!isMounted.current) {
      loadLiveChats();
      isMounted.current = true;
    }
  }, [loadLiveChats]);



  /*
  useEffect
  Descripcion: AutoScroll al final cuando cambia los mensaJes
  Autor: Jose Ahias Vargas
    */
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);


  /*
  useEffect
  Descripcion: cooldown de cada envio de mensaje del chat
  Autor: Jose Ahias Vargas
    */
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);


  /*
  useLiveEventSockets
  Descripcion: Maneja la conexión a sockets para el evento en vivo y actualiza el estado en tiempo real
  Autor: Jose Ahias Vargas
   */
  useLiveChatSockets(socket, {
    setMessages,
    loadLiveChats
  });


  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

    {chatBlock && (
          <div className={styles.chatContainer}>
            <span className={styles.blockedBadgeHeader}>
              SISTEMA: CHAT RESTRINGIDO
            </span>
          </div>
        )}

      <Chat
        messages={messages}
        handleSend={handleSend}
        input={input}
        setInput={setInput}
        chatBodyRef={chatBodyRef}
        cooldown={cooldown}
        isLoading={loading}
        userRole={role}
        handleBlockUser={handleBlock}
        isUserBlocked={chatBlock} 

      />

    </div>
  );

}
export default ChatContainer;