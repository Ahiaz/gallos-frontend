/* Hook: este hook permite que el contexto del storage pueda ser reutilizado con solo importalo en los componentes 
y hace renderizados por componente y key, es decir, cada componente puede tener su propio espacio de almacenamiento 
sin interferir con otros componentes,
Descripción: mediante useStorage podemos acceder a los metodos y states del contexto:
<StoreContext.Provider value={contextValue}>
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useContext } from "react";
import { useSyncExternalStore } from "react";
import { StoreContext } from "../contexts/StoreContext";

export const useStorage = (componentId, key, initialValue) => {

  const { getValue, setValue, subscribe } = useContext(StoreContext);

  const value = useSyncExternalStore(
    (listener) => subscribe(componentId, key, listener),
    () => getValue(componentId, key) ?? initialValue
  );

  const set = (v) => setValue(componentId, key, v);

  return [value, set];
};