/*
Hook: useIsTablet.jsx
Descripción: Hook personalizado que determina si la pantalla es tablet o no.
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useEffect, useState } from "react";

const useIsTablet = (breakpoint = 1200) => {
  const [isTablet, setIsTablet] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsTablet(window.innerWidth < breakpoint);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); //se ejecuta cuando se desmonta el componente
  }, [breakpoint]);

  return isTablet;
};

export default useIsTablet;