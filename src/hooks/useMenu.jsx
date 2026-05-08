/* Hook: este hook permite que el contexto del Menu pueda ser reutilizado con solo importalo en los componentes 
Descripción: mediante useMenu podemos acceder a los metodos y states del contexto:
<MenuContext.Provider value={contextValue}>
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useContext } from 'react';
import { MenuContext } from '../contexts/MenuContext';

export const useMenu = () => useContext(MenuContext);