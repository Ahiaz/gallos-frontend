/*
Hook: useSort.jsx
Descripción: Hook personalizado para permitir ordenamientos por columnas
Autor: Jose Ahias Vargas
*/

import { useState, useMemo } from 'react';

export const useSort = (items, config = { key: 'id', direction: 'desc' }, activeColor = 'text-gold-400') => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Normalización para fechas (moment u objetos Date)
        if (sortConfig.key === 'created_at' || sortConfig.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Normalización para números
        if (typeof aValue === 'string' && !isNaN(aValue) && aValue.trim() !== "") {
            aValue = Number(aValue);
            bValue = Number(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <i className="bi bi-arrow-down-up ms-1 opacity-20 transition-opacity"></i>;
    }
    return sortConfig.direction === 'asc' 
      ? <i className={`bi bi-sort-up ms-1 ${activeColor} animate__animated animate__fadeInIn`}></i> 
      : <i className={`bi bi-sort-down ms-1 ${activeColor} animate__animated animate__fadeInIn`}></i>;
  };


  return { items: sortedItems, requestSort, sortConfig, renderSortIcon };
};