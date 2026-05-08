/*
Componente: Chat.jsx
Descripción: Componente que muestra el chat con textarea dinámico y selector de emojis.
Autor: Jose Ahias Vargas
*/

import { useState } from 'react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import styles from './styles/Chat.module.css';
import { ADMIN_ROLE } from '../../constants/userConstants';
import LoadingButton from '../common/LoadingButton';

const Chat = ({ messages, handleSend, input, setInput, chatBodyRef, cooldown, isLoading, userRole, handleBlockUser, isUserBlocked }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    // Opcional: setShowEmojiPicker(false);
  };

  const getUsernameColor = (username) => {
    const colors = ['#ff4a4a', '#30adff', '#2ecc71', '#f1c40f', '#e67e22', '#9b59b6', '#1abc9c', '#ff6b6b'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleTextareaChange = (e) => {
    const element = e.target;
    setInput(element.value);
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 120)+3}px`;
  };

  const onFormSubmit = (e) => {
    handleSend(e);
    // Resetear altura tras enviar
    const textarea = e.target.querySelector('textarea');
    if (textarea) textarea.style.height = 'auto';
  };

  return (
    <div className={styles.twitchChat}>
      {/* CUERPO DEL CHAT */}
      <div className={styles.chatBody} ref={chatBodyRef}>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((m, i) => (
            <div key={i} className={`${styles.chatLine} ${m.isBlocked ? styles.chatLineHasBlocked : ''} animate__animated animate__fadeIn`}>
              
              {userRole === ADMIN_ROLE && m.role !== ADMIN_ROLE && (
                <div className={styles.adminActions}>
                  <button className={styles.banBtn} onClick={() => handleBlockUser(m.userId, m.username, 1)} title="Bloquear">
                    <i className="bi bi-slash-circle text-red-500"></i>
                  </button>
                  <button className={styles.unbanBtn} onClick={() => handleBlockUser(m.userId, m.username, 0)} title="Desbloquear">
                    <i className="bi bi-check-circle text-green-500"></i>
                  </button>
                </div>
              )}

              <span
                className={`${styles.chatUser} ${m.role === ADMIN_ROLE ? styles.userAdmin : styles.userClient}`}
                style={m.role !== ADMIN_ROLE ? { color: getUsernameColor(m.username) } : {}}
              >
                {m.username}:
              </span>
              <span className={styles.chatMessage}>{m.message}</span>
            </div>
          ))
        ) : (
          <div className="text-white small text-center mt-4 opacity-50">
            ¡Bienvenido al chat en vivo! <br /> Sé el primero en escribir.
          </div>
        )}
      </div>

      {/* FOOTER Y CONTROLES */}
      <div className={styles.chatFooter}>
        
        {showEmojiPicker && !isUserBlocked && (
          <div className={styles.emojiPickerWrapper}>
            <div className={styles.emojiPickerHeader}>
              <span>Seleccionar Emoji</span>
              <button type="button" className={styles.closeEmojiBtn} onClick={() => setShowEmojiPicker(false)}>
                ✕
              </button>
            </div>
            <div className={styles.emojiPickerContainer}>
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                theme={Theme.DARK}
                cacheEmojis={false}
                searchPlaceholder="Buscar..."
                height={320}
                width="100%"
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </div>
          </div>
        )}

        <form onSubmit={onFormSubmit} className={styles.inputWrapper}>
          <div className={styles.inputWithActions}>
            <textarea
              className={styles.chatInputTextarea}
              placeholder={isUserBlocked ? "Chat inhabilitado" : (cooldown > 0 ? `Espera ${cooldown}s...` : "Enviar mensaje...")}
              value={input}
              onChange={handleTextareaChange}
              disabled={isUserBlocked}
              rows="1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading && cooldown <= 0) {
                    onFormSubmit(e);
                  }
                }
              }}
            />

            <button
              type="button"
              className={styles.emojiToggleBtn}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={isUserBlocked}
            >
              <i className={`bi bi-emoji-smile${showEmojiPicker ? '-fill' : ''}`}></i>
            </button>
          </div>

          <LoadingButton
            type="submit"
            className={styles.sendBtn}
            isLoading={isLoading}
            disabled={!input.trim() || isLoading || cooldown > 0 || isUserBlocked}
            loadingText=""
          >
            {cooldown > 0 ? `${cooldown}s` : "Chat"}
          </LoadingButton>
        </form>
      </div>
    </div>
  );
};

export default Chat;