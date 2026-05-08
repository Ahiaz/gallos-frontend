/* Hook: este hook permite que el contexto del Stream pueda ser reutilizado con solo importalo en los componentes 
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useContext } from 'react';
import { StreamContext } from '../contexts/StreamContext';

export const useStream = () => useContext(StreamContext);