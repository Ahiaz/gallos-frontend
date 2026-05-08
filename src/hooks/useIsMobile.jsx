/*
Hook: useIsMobile.jsx
Descripción: Hook personalizado que determina si la pantalla es móvil o no.
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useEffect, useState } from "react";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); //se ejecuta cuando se desmonta el componente
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;