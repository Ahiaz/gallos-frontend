/*
Hook: useDateFormatter.jsx
Descripción: Hook personalizado para formatear la fecha
Autor: Jose Ahias Vargas
*/

import { useCallback } from 'react';

export const useDateFormatter = () => {
  
  // Convierte ISO (API) a yyyy-MM-dd (Input HTML)
  const formatToInput = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Usamos split para obtener solo la parte de la fecha YYYY-MM-DD
    return date.toISOString().split('T')[0];
  }, []);

  // Convierte yyyy-MM-dd a dd/mm/yy (Visualización)
  const formatToDisplay = useCallback((dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    
    // Sumamos el offset si la fecha se desfasa por la zona horaria al crear el objeto Date
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2); // Últimos 2 dígitos

    return `${day}/${month}/${year}`;
  }, []);

  return { formatToInput, formatToDisplay };
};