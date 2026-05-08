/*
Hook: useConfirmModal.jsx
Descripción: Hook personalizado para mostrar un mensaje de confirmacion
Autor: Jose Ahias Vargas
*/

import { useModal } from './useModal';

export const useConfirmModal = () => {
  const { setModalProps, setModalComponent, setConfirmModalCallback, toggleModal, resetModalFormData, setRequiredFields} = useModal();

  const showConfirm = ({ title = 'Información', message, onConfirm, confirmText = 'Aceptar' }) => {
    
    resetModalFormData();
    
    setRequiredFields([]);


    setModalProps({
      title,
      confirmText,
      cancelText: 'Cancelar',
    });

    setModalComponent(() => () => <p className='text-white text-center'>{message}</p>);

    setConfirmModalCallback(() => onConfirm);

    toggleModal(true);
  };

  return { showConfirm};
};