/* Hook: este hook permite que el contexto del Chat pueda ser reutilizado con solo importalo en los componentes 
Descripción: mediante useChat podemos acceder a los metodos y states del contexto:
<ChatContext.Provider value={contextValue}>
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';

export const useChat = () => useContext(ChatContext);