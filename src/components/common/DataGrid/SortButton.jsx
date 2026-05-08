/*
Componente: SortButton.jsx
Descripción: Plugin ka-table para renderizar flechas en las columnas del grid
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { SortDirection } from "ka-table/enums";

export const sortButton = (column) => {
  if (!column.sortDirection) return null;

  return (
    <>
      {column.sortDirection === SortDirection.Ascend ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          className="bi bi-caret-up-fill sort-arrow-table"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 
             3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 
             0 0 0-.708 0l-4 4a.5.5 0 1 0 
             .708.708L7.5 2.707V14.5a.5.5 
             0 0 0 .5.5"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          className="bi bi-caret-down-fill sort-arrow-table"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 1a.5.5 0 0 1 
             .5.5v11.793l3.146-3.147a.5.5 
             0 0 1 .708.708l-4 4a.5.5 
             0 0 1-.708 0l-4-4a.5.5 
             0 0 1 .708-.708L7.5 
             13.293V1.5A.5.5 0 0 1 8 1"
          />
        </svg>
      )}
    </>
  );
};