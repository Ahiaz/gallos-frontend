/*Componente: StoreProvider.jsx
Descripción: Este componente es un proveedor de contexto que se utiliza para manejar 
el almacenamiento global en la aplicación de los componentes, para persistir datos si se navega a otra ruta.
Con este patron evitamos renders innecesarios ya que el context solo notifica a los componentes que esten suscritos a la key 
que se esta modificando, ademas de que el valor del store se mantiene incluso si el componente que lo uso se desmonta, 
hasta que se modifique esa key o se reinicie la aplicación.
Fecha: 2025-07-08
*/


import React, { useRef, useCallback } from "react";
import { StoreContext } from "./StoreContext";

export const StoreProvider = ({ children }) => {

  const storesRef = useRef({});
  const listenersRef = useRef({});

  /*
  function getValue: 
  descripcion: recibe un componentId y una key, y devuelve el valor almacenado en el store para esa combinación.
  
  */

  const getValue = useCallback((componentId, key) => {
    return storesRef.current?.[componentId]?.[key];
  }, []);

  /*
  function setValue: 
  descripcion: recibe un componentId y una key, y establece el valor almacenado en el store para esa combinación.
  
  */

  const setValue = useCallback((componentId, key, value) => {

    const prevComponent = storesRef.current[componentId] || {};

    const resolvedValue =
      typeof value === "function"
        ? value(prevComponent[key])
        : value;

    storesRef.current = {
      ...storesRef.current,
      [componentId]: {
        ...prevComponent,
        [key]: resolvedValue
      }
    };

    const id = `${componentId}:${key}`;

    listenersRef.current[id]?.forEach(listener => listener());

  }, []);


  /*
  function subscribe: 
  descripcion: recibe un componentId, una key y un listener (funcion), 
  y suscribe ese listener a los cambios en el valor almacenado para esa combinación de componentId y key.
  Devuelve una función de limpieza que elimina el listener de la suscripción.
  */

  const subscribe = useCallback((componentId, key, listener) => {

    const id = `${componentId}:${key}`;

    if (!listenersRef.current[id]) {
      listenersRef.current[id] = new Set();
    }

    listenersRef.current[id].add(listener);

    return () => {
      listenersRef.current[id].delete(listener);
    };

  }, []);

  return (
    <StoreContext.Provider
      value={{
        getValue,
        setValue,
        subscribe
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
