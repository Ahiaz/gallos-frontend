/*
MenuProvider
Descripcion: permite utilizar el Menu de forma global
*/

import { useState, useMemo } from 'react';
import { MenuContext } from './MenuContext';

export const MenuProvider = ({ children }) => {


 const [menuOpen, setMenuOpen] = useState(false);

 const toggleMenu = () => setMenuOpen(prev => !prev);

  const contextValue = useMemo(() => ({
    menuOpen,
    toggleMenu

  }), [menuOpen]);

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>

  );
};


