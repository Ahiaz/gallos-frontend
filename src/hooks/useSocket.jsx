/* Hook: este hook permite que el contexto del Socket pueda ser reutilizado con solo importalo en los componentes 
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export const useSocket = () => useContext(SocketContext);