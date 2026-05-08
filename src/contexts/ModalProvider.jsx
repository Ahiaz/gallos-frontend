/*Componente: ModalProvider.jsx
Descripción: Contexto para manejar modales globales en la aplicación.
Autor: Jose Ahias Vargas
*/

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { ModalContext } from "./ModalContext";
import { setShowAuthModal } from "../utils/modalUtils";
import styles from '../styles/General.module.css';


export const ModalProvider = ({ children }) => {
  const [props, setModalProps] = useState({});
  const [ModalComponent, setModalComponent] = useState(null);
  const [modalFormData, setModalFormData] = useState({});
  const [confirmModalCallback, setConfirmModalCallback] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [requiredFields, setRequiredFields] = useState([]);
  const [fieldRules, setFieldRules] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const toggleModal = useCallback((show) => setShowModal(show), []);

  const AuthModalContent = () => (
    <p className="text-sm text-white/70">Tu sesión ha expirado o no tienes los permisos necesarios. Por favor, inicia sesión de nuevo.</p>
  );

  const showAuthModal = useCallback(() => {
    setModalProps({
      title: 'Sesión Expirada',
      confirmText: 'Iniciar Sesión',
      cancelText: null,
    });
    setModalComponent(() => AuthModalContent);
    setConfirmModalCallback(() => () => {
      location.href = `/login`;
      return true;
    });
    toggleModal(true);
  }, [toggleModal]);

  const validateRequiredFields = () => {
    const errors = {};
    requiredFields.forEach((field) => {
      const fieldValue = modalFormData[field];
      const rules = fieldRules[field];
      const value =
        typeof fieldValue === "object" && fieldValue !== null
          ? fieldValue.value
          : fieldValue?.toString().trim();

      if (value === undefined || value === null || value === "") {
        errors[field] = "Este campo es obligatorio";
        return;
      }

      if (rules?.min !== undefined || rules?.max !== undefined) {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
          errors[field] = "Debe ser un número válido";
        } else {
          if (rules.min !== undefined && numericValue < rules.min) errors[field] = `Mínimo ${rules.min}`;
          if (rules.max !== undefined && numericValue > rules.max) errors[field] = `Máximo ${rules.max}`;
        }
      }

      if (!errors[field] && rules?.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errors[field] = "Correo electrónico no válido";
      }
    });
    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = useCallback((input, actionMeta) => {
    if (input && input.target) {
      const { name, type, value, checked } = input.target;
      const newValue = (type === "checkbox" || type === "switch") ? checked : value;
      setModalFormData((prev) => ({ ...prev, [name]: newValue }));
      setInputErrors((prev) => { const e = { ...prev }; delete e[name]; return e; });
    } else if (actionMeta && actionMeta.name) {
      const { name } = actionMeta;
      setModalFormData((prev) => ({ ...prev, [name]: input || null }));
      setInputErrors((prev) => { const e = { ...prev }; delete e[name]; return e; });
    }
  }, []);

  const resetModalFormData = useCallback(() => {
    setModalFormData({});
    setInputErrors({});
  }, []);

  const handleModalClose = () => { setShowModal(false); resetModalFormData(); };

  const handleModalConfirm = async () => {
    const originalText = props.confirmText;
    if (!validateRequiredFields()) return;
    setModalProps({ ...props, confirmText: "Enviando..." });
    setButtonLoading(true);
    const shouldClose = await confirmModalCallback?.(modalFormData);
    if (shouldClose) setShowModal(false);
    setButtonLoading(false);
    setModalProps((prev) => ({ ...prev, confirmText: originalText }));
  };

  const contextValue = useMemo(
    () => ({
      props,
      modalFormData,
      inputErrors,
      toggleModal,
      showAuthModal,
      setModalComponent,
      setModalProps,
      setConfirmModalCallback,
      setModalFormData,
      setInputErrors,
      handleInputChange,
      resetModalFormData,
      setRequiredFields,
      setFieldRules
    }),
    [props, modalFormData, inputErrors, toggleModal, showAuthModal, handleInputChange, resetModalFormData]
  );

  useEffect(() => {
    setShowAuthModal(showAuthModal);
  }, [showAuthModal]);

  const modalMarkup = showModal && createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={props.cancelText !== undefined && props.cancelText !== null ? handleModalClose : undefined}
      />
      {/* Panel */}
      <div className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-brand-900 shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate__animated animate__fadeInDown animate__faster">
        {/* Header */}
        <div className="relative flex items-center justify-center border-b border-white/10 bg-brand-950 px-4 py-3.5">
          <h5 className="mb-0 text-sm font-black uppercase tracking-[0.1em] text-white">{props.title}</h5>
          <button
            type="button"
            onClick={handleModalClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
          >
            <i className="bi bi-x-lg text-xs"></i>
          </button>
        </div>
        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {ModalComponent && <ModalComponent />}
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-white/10 bg-brand-950 px-4 py-3">
          {props.cancelText && (
            <button type="button" onClick={handleModalClose} className={`${styles.btnDanger} border-0`}>
              {props.cancelText}
            </button>
          )}
          {props.confirmText && (
            <button
              type="button"
              onClick={handleModalConfirm}
              className={`${styles.btnWarning} border-0`}
              disabled={buttonLoading}
            >
              {buttonLoading && (
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-black align-middle"></span>
              )}
              {props.confirmText}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {modalMarkup}
      {children}
    </ModalContext.Provider>
  );
};
