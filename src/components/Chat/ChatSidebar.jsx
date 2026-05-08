/*
Componente: ChatSidebar.jsx
Descripción: Componente que muestra la barra lateral de chat
Autor: Jose Ahias Vargas
*/

import ReactDOM from 'react-dom';   
import { useChat } from "../../hooks/useChat";
import styles from "./styles/Chat.module.css";
import ChatContainer from '../../containers/Chat/ChatContainer';

const ChatSidebar = () => {
  const { chatOpen, toggleChat } = useChat();

  const sideBarContent = (
    <>
      {/* Overlay: Mantiene tu clase original */}
      {chatOpen && (
        <div
          className={styles.overlay}
          onClick={toggleChat}
        />
      )}

      {/* Sidebar: Mantiene tus clases de estado y posicionamiento */}
      <div
        className={`${styles.chatSidebar} ${
          chatOpen ? styles.open : styles.closed
        } flex flex-col`}
      >

        {/* Header: Mantiene tu contenedor de botón de cierre */}
        <div className={styles.closeBtnContainer}>
          <span className={styles.sidebarTitle}>CHAT EN VIVO</span>
          
          {/* Botón nativo: Reemplaza a <Button> pero conserva tu estilo original */}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={toggleChat}
            aria-label="Cerrar chat"
          >
            ✕
          </button>
        </div>

        {/* Contenedor del ChatContainer */}
        <div className={styles.chatContainerWrapper}>
          <ChatContainer />
        </div>

      </div>
    </>
  );

  return ReactDOM.createPortal(sideBarContent, document.body);
};

export default ChatSidebar;