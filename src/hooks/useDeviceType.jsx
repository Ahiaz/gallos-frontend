/*
Hook: useDeviceType.jsx
Descripción: Hook personalizado para detectar el tipo de dispositivo (móvil, tablet, escritorio)
Autor: Jose Ahias Vargas
*/

import { useEffect, useState } from "react";

const useDeviceType = (tabletBreakpoint = 1200) => {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isTouch: false
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // 1. Detección por Hardware (Capacidad táctil)
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // 2. Detección por User Agent (Opcional, pero ayuda con iPads/Android Tablets)
      const ua = navigator.userAgent.toLowerCase();
      const isTabletUA = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);

      setDevice({
        isMobile: width < 768,
        // Es tablet si el ancho es menor al breakpoint Y (es táctil o el UA lo confirma)
        isTablet: width < tabletBreakpoint && (hasTouch || isTabletUA),
        isTouch: hasTouch
      });
    };

    // Ejecutar al montar
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [tabletBreakpoint]);

  return device;
};

export default useDeviceType;