/*
Componente: ToastProvider.jsx
Descripcion: Proveedor de contexto para toasts (notificaciones) globales.
Autor: Jose Ahias Vargas Pacheco
*/

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext } from "./ToastContext";

const toastVariantCls = {
  success: 'border-success-soft/40 bg-success-soft/15 text-success-soft',
  danger:  'border-danger-soft/40 bg-danger-soft/15 text-danger-soft',
  warning: 'border-gold-400/40 bg-gold-400/15 text-gold-300',
  info:    'border-info-soft/40 bg-info-soft/15 text-info-soft',
};

export const ToastProvider = ({ children }) => {
  const [properties, setToastProps] = useState(null);

  useEffect(() => {
    if (!properties) return;
    const timer = setTimeout(() => setToastProps(null), 6000);
    return () => clearTimeout(timer);
  }, [properties]);

  const contextValue = useMemo(() => ({ properties, setToastProps }), [properties]);

  const toastMarkup = properties && createPortal(
    <div className="fixed bottom-4 right-4 z-[10000] animate__animated animate__fadeInUp">
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl ${toastVariantCls[properties.type] || toastVariantCls.info}`}>
        <span className="text-sm font-medium">{properties.message}</span>
        <button
          type="button"
          onClick={() => setToastProps(null)}
          className="shrink-0 opacity-60 transition hover:opacity-100"
        >
          <i className="bi bi-x-lg text-xs"></i>
        </button>
      </div>
    </div>,
    document.body
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {toastMarkup}
      {children}
    </ToastContext.Provider>
  );
};
