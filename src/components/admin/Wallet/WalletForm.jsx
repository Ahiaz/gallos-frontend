/*
Componente: WalletForm.jsx
Descripción: Formulario para depósitos, bonos, créditos y retiros.
Autor: Jose Ahias Vargas
*/
import { useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import { useSecurity } from "../../../hooks/useSecurity";
import { useNumberValidation } from "../../../hooks/useNumberValidation";
import styles from '../../../styles/General.module.css';
import { WALLET_ACTION, WALLET_MODE } from "../../../constants/walletConstants";

const inputCls = (error) =>
  `w-full rounded-xl border bg-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-0 ${error ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/70'}`;

const alertCls = {
  info:    "mb-3 rounded-xl border border-info-soft/30 bg-info-soft/10 px-3 py-2 text-xs text-info-soft animate__animated animate__fadeIn",
  success: "mb-3 rounded-xl border border-success-soft/30 bg-success-soft/10 px-3 py-2 text-xs text-success-soft animate__animated animate__fadeIn",
  warning: "mb-3 rounded-xl border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-xs text-gold-300 animate__animated animate__fadeIn",
  danger:  "mb-3 rounded-xl border border-danger-soft/30 bg-danger-soft/10 px-3 py-2 text-xs text-danger-soft animate__animated animate__fadeIn",
  primary: "mb-3 rounded-xl border border-info-soft/30 bg-info-soft/10 px-3 py-2 text-xs text-info-soft animate__animated animate__fadeIn",
};

const WalletForm = ({ type, currentBalance, currentLimit }) => {
  const {
    modalFormData,
    inputErrors,
    setModalFormData,
    handleInputChange,
    setInputErrors
  } = useModal();

  const { currency } = useSecurity();
  const { handleKeyDownInteger, validateRange } = useNumberValidation(setInputErrors);
  const isDebtMode = !!modalFormData.isDebtPayment;

  useEffect(() => {
    const formattedLimit = currentLimit ? String(Number(currentLimit)) : "";
    setModalFormData({
      amountInput: type === WALLET_ACTION.CREDIT_LIMIT ? formattedLimit : "",
      descriptionInput: type === WALLET_ACTION.CREDIT_LIMIT ? "Se limito el credito del usuario" : "",
      operationType: type,
      isDebtPayment: false
    });
  }, [type, setModalFormData, currentLimit]);

  const handleSwitchChange = (e) => {
    const checked = e.target.checked;
    setModalFormData(prev => ({
      ...prev,
      isDebtPayment: checked,
      operationType: checked ? WALLET_ACTION.CREDIT_PAYMENT : WALLET_ACTION.DEPOSIT
    }));
  };

  const onAmountChange = (e) => {
    let { name, value } = e.target;
    const cleanValue = value.replace(/[^0-9]/g, '');
    e.target.value = cleanValue;
    handleInputChange(e);
    const numericValue = Number(cleanValue);
    if (type === WALLET_ACTION.WITHDRAWAL && numericValue > Number(currentBalance)) {
      setInputErrors(prev => ({ ...prev, amountInput: `Saldo insuficiente (${currentBalance})` }));
    } else {
      const min = type === WALLET_ACTION.CREDIT_LIMIT ? 0 : 1;
      validateRange(name, cleanValue, min, 1000000);
    }
  };

  return (
    <div className="animate__animated animate__fadeIn">
      {/* Modo badge */}
      <div className="mb-4 text-center">
        <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-white/70">
          MODO: {WALLET_MODE[type]}
        </span>
      </div>

      {/* Switch depósito → pago de deuda */}
      {type === WALLET_ACTION.DEPOSIT && (
        <div className="mb-4 rounded-xl border border-gold-400/20 bg-gold-400/5 p-3 animate__animated animate__fadeIn">
          <label className={`${styles.customSwitch} cursor-pointer`}>
            <input
              type="checkbox"
              id="isDebtPayment"
              name="isDebtPayment"
              checked={isDebtMode}
              onChange={handleSwitchChange}
            />
            <span className="text-sm font-semibold text-white/70">¿Este depósito es para abonar/pagar deudas?</span>
          </label>
          {isDebtMode && (
            <p className="mt-2 text-xs text-danger-soft animate__animated animate__fadeIn">
              <i className="bi bi-info-circle-fill me-1"></i>
              Al procesarse, el monto descontará la deuda actual del usuario.
            </p>
          )}
        </div>
      )}

      {/* Alertas de contexto */}
      {type === WALLET_ACTION.DEPOSIT && (
        <div className={alertCls[isDebtMode ? 'info' : 'success']}>
          <i className={`bi ${isDebtMode ? 'bi-bank' : 'bi-cash-coin'} me-2`}></i>
          <strong>{isDebtMode ? "PAGO DE DEUDA:" : "INGRESO DE DINERO REAL:"}</strong>
          {isDebtMode ? " Estás registrando un abono al saldo deudor." : " Verifica que el usuario haya entregado el efectivo."}
        </div>
      )}
      {type === WALLET_ACTION.CREDIT_LOAD && (
        <div className={alertCls.warning}>
          <i className="bi bi-bank me-2"></i>
          <strong>PRÉSTAMO DE SALDO:</strong> Estás cargando saldo "fíado". El usuario generará una deuda.
        </div>
      )}
      {type === WALLET_ACTION.BONUS_LOAD && (
        <div className={alertCls.primary}>
          <i className="bi bi-gift me-2"></i>
          <strong>REGALO DE BONO:</strong> Este saldo no es retirable y se cargará a la billetera de bonos.
        </div>
      )}
      {type === WALLET_ACTION.WITHDRAWAL && (
        <div className={alertCls.danger}>
          <i className="bi bi-box-arrow-up me-2"></i>
          <strong>SALIDA DE DINERO:</strong> Estás restando saldo real. Asegúrate de entregar el dinero.
        </div>
      )}

      {/* Monto */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-semibold text-white/70" htmlFor="amountInput">
          {type === WALLET_ACTION.CREDIT_LIMIT ? `Nuevo Límite de Crédito (${currency})` : `Monto (${currency})`}
        </label>
        <input
          name="amountInput"
          id="amountInput"
          type="number"
          placeholder="Monto"
          value={modalFormData.amountInput || ''}
          onChange={onAmountChange}
          onKeyDown={handleKeyDownInteger}
          required
          className={inputCls(inputErrors.amountInput)}
        />
        {inputErrors.amountInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.amountInput}</p>}
      </div>

      {/* Descripción */}
      {type !== WALLET_ACTION.CREDIT_LIMIT && (
        <div className="mb-3">
          <label className="mb-1 block text-xs font-semibold text-white/70" htmlFor="descriptionInput">
            Concepto / Motivo / Comprobante
          </label>
          <textarea
            name="descriptionInput"
            id="descriptionInput"
            style={{ height: '80px' }}
            placeholder="Descripción"
            value={modalFormData.descriptionInput || ''}
            onChange={handleInputChange}
            maxLength={255}
            required
            className={`${inputCls(inputErrors.descriptionInput)} resize-none`}
          />
          {inputErrors.descriptionInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.descriptionInput}</p>}
        </div>
      )}

      {type === WALLET_ACTION.CREDIT_LIMIT && (
        <div className={alertCls.info}>
          <i className="bi bi-info-circle me-2"></i>
          El límite actual es de <strong>{currency}{Number(currentLimit).toLocaleString()}</strong>.
          Este cambio no afecta el saldo actual, solo la cantidad que se le presta.
        </div>
      )}
    </div>
  );
};

export default WalletForm;
