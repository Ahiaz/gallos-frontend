/*
Hook: useNumberValidation.jsx
Descripción: Hook personalizado para permitir solo enteros en los inputs del modal y dentro de un rango
Autor: Jose Ahias Vargas
*/

import { useCallback } from "react";

export const useNumberValidation = (setInputErrors) => {
  
  // 1. Bloqueo de teclas prohibidas (e, +, -, ., ,)
  const handleKeyDownInteger = useCallback((e) => {
    if (["-", "+", "e", "E", ".", ","].includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  // 2. Validación lógica de rango
  const validateRange = useCallback((name, value, min, max) => {
    let error = "";
    const numericValue = value === "" ? null : Number(value);

    if (numericValue !== null) {
      if (min !== undefined && numericValue < min) {
        error = `El valor mínimo es ${min}`;
      } else if (max !== undefined && numericValue > max) {
        error = `El valor máximo es ${max}`;
      }
    }

    // Actualizamos el estado de errores del useModal
    setInputErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });

    return error === ""; // Retorna true si es válido
  }, [setInputErrors]);

  return { handleKeyDownInteger, validateRange };
};