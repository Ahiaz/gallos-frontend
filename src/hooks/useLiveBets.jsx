/* Hook: este hook permite que el contexto del LiveBets pueda ser reutilizado con solo importalo en los componentes 
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useContext } from 'react';
import { LiveBetsContext } from '../contexts/LiveBetsContext';

export const useLiveBets = () => useContext(LiveBetsContext);