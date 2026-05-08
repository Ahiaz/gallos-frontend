/*Componente: ScreenCapture.jsx
Descripción: Contexto para manejar capturas de elementos en la aplicación.
Se utiliza React.memo para evitar renderizados innecesarios cuando las props no cambian.
Se le saca utilidad si los componentes que van usar este hook usan react.memo
UseCallback para evitar renderizados innecesarios en funciones que se pasan como props.
El context permite manejar el estado del modal, los datos del formulario y la validación de campos requeridos
a nivel global en la aplicación.
Solo se le saca ganancia si se usa en componentes que usan React.memo para memoizar
y no se le saca ganancia en setters de estado o funciones que cambian constantemente.
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/


import React, {
  useMemo,
  useCallback,
} from "react";
import { ScreenCaptureContext } from "./ScreenCaptureContext";
import html2canvas from "html2canvas";

export const ScreenCaptureProvider = ({ children }) => {
  
  /*
  Función: generateImageFile
  Descripción: Genera una captura de pantalla del elemento referenciado y lo retorna como file;
  */
const generateImageFile = useCallback((elementRef) => {
  if (!elementRef?.current) return null;

  try{
  return html2canvas(elementRef.current, {
    useCORS: true, // Permite capturar imágenes externas si el servidor lo permite
    scale: window.devicePixelRatio || 1, // Mejora la calidad en pantallas retina
    allowTaint: false, // No permite "taint" de canvas si la imagen no tiene CORS
    logging: false, //para que la libreria no haga logs en consola
  }).then((canvas) => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "screenshot.png", { type: "image/png" });
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/png");
    });
  });
} catch (error) {
  console.error("Error generando el archivo de imagen:", error);
  return null;
}
}, []);

  /*
  Función: downloadFile
  Descripción: Descarga el archivo de imagen en dispositivos iOS y Android/Escritorio.;
  */

const downloadFile = useCallback((file) => {

  if (!file) return;

  const fileURL = URL.createObjectURL(file);

  // Detectar iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isIOS) {
    // Abrir en nueva pestaña para que el usuario pueda guardar
    window.open(fileURL, "_blank");
  } else {
    // Android / Desktop: descarga directa
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = file.name || "archivo.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Liberar memoria
  URL.revokeObjectURL(fileURL);
}, []);

  
  // Memoiza el valor para evitar re-renderizados innecesarios y el usecallback evita que se renderice nuevamente la funcion 
  //y debe ser utilizado si se pasa la funcion en el context como parametro ya que es una forma eficiente de evitar re-renderizados
  
  const contextValue = useMemo(
    () => ({
      generateImageFile,
      downloadFile
    }),
    [generateImageFile, downloadFile]
  );


  return (
 <ScreenCaptureContext.Provider value={contextValue}>
      {children}
    </ScreenCaptureContext.Provider>
  );
};
