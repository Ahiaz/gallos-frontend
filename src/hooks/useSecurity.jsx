/* Hook: este hook permite que el contexto del Security pueda ser reutilizado con solo importalo en los componentes 
Descripción: mediante useSecurity podemos acceder a los metodos y states del contexto:
<SecurityContext.Provider value={contextValue}>
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useContext } from 'react';
import { SecurityContext } from '../contexts/SecurityContext';

export const useSecurity = () => useContext(SecurityContext);