/* Hook: este hook permite que el contexto del Modal pueda ser reutilizado con solo importalo en los componentes 
Descripción: mediante useModal podemos acceder a los metodos y states del contexto especificamente a estos:
<ModalContext.Provider value={{ props, showModal, modalContent, setModalComponent, setShowModal, setModalProps etc }}>
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';

export const useModal = () => useContext(ModalContext);