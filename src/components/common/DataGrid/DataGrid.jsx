/*
Componente: DataGrid.jsx
Descripción: Plugin ka-table para renderizar un DataGrid
React.memo se utiliza para evitar renderizados innecesarios que provoque el plugin de ka-table, por esta razon
el que lo use, debera pasarle las props que cambien constantemente como useMemo y las funciones como useCallback
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/
import React, { useState } from "react";
import { Table } from 'ka-table';
import 'ka-table/style.css';
import styles from './styles/Datagrid.module.css';
import { SortingMode } from 'ka-table/enums';

const DataGridComponent = ({props, childComponents = {}, format = ()=>{}, searchConditions = () => {}, searchBarVisible = true, toolBar = null, paging = null, loading = false}) => {

const { 
columns = [], 
data = [], 
rowKeyField = ""
} = props;

    
const [searchText, setSearchText] = useState('');

/*
funcion: handleFilterChange
descripcion: se encarga de realizar el filtro de la barra de busqueda
y toma en cuenta el filtro del ordenamiento
*/
  const handleFilterChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchText(searchTerm);

  };

  
  return (

     <div className={`container ${styles.containerDataGrid}`}>

      <div className={`d-flex align-items-center justify-content-between`}>
        <input type='search'
          value={searchText}
          onChange={handleFilterChange}
          className={`form-control search rounded-0 ${searchBarVisible ? '' : 'd-none'} ${styles.searchBar} `}
          placeholder="Buscar..."
        />

         {toolBar && (
        <div className="d-flex align-items-center">
          {toolBar}
        </div>
      )} 

      </div>

      <Table
        columns={columns}
        paging={paging}
        format={format}
        data={data}
        search={searchConditions}
        rowKeyField={rowKeyField}
        sortingMode={SortingMode.Single}
        searchText={searchText}
        loading={{
        enabled: loading,
        text: 'Cargando...',
        }} 
        noData={{ text: 'No se encontraron registros' }}        
        childComponents={childComponents}
      />
      </div>

  );



};

export default React.memo(DataGridComponent);