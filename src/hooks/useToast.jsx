/* Hook: este hook permite que el contexto del Toast pueda ser reutilizado con solo importalo en los componentes 
Descripción: mediante useToast podemos acceder a los metodos y states del contexto especificamente a estos:
<ToastContext.Provider value={{ children etc..}}>
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';

export const useToast = () => useContext(ToastContext);