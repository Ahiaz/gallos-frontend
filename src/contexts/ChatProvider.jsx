/*
ChatProvider
Descripcion: permite utilizar el chat de forma global
*/

import { useState, useMemo } from 'react';
import { ChatContext } from './ChatContext';

export const ChatProvider = ({ children }) => {


 const [chatOpen, setChatOpen] = useState(false);

 const toggleChat = () => setChatOpen(prev => !prev);

  const contextValue = useMemo(() => ({
    chatOpen,
    toggleChat

  }), [chatOpen]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>

  );
};


