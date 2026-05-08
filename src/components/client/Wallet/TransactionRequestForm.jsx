/*
Componente: TransactionRequestForm.jsx
Descripción: Formulario para solicitudes de depósitos/retiros con resumen de saldos.
Autor: Jose Ahias Vargas
*/
import { useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import { useNumberValidation } from "../../../hooks/useNumberValidation";
import { useSecurity } from "../../../hooks/useSecurity";
import styles from '../../../styles/General.module.css';
import { WALLET } from "../../../constants/walletConstants";

const inputCls = (error) =>
  `w-full rounded-xl border bg-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-0 ${error ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/70'}`;
const labelCls = "mb-1 block text-xs font-semibold text-white/70";

const TransactionRequestForm = ({ type = WALLET.DEPOSIT, walletSummary = {}, onImmediateDebtPayment = null }) => {
  const { currency } = useSecurity();

  const {
    modalFormData,
    inputErrors,
    setModalFormData,
    handleInputChange,
    setInputErrors
  } = useModal();

  const { handleKeyDownInteger, validateRange } = useNumberValidation(setInputErrors);

  const {
    balance = 0,
    current_debt = 0,
    withdrawable = 0
  } = walletSummary || {};

  useEffect(() => {
    setModalFormData({
      amountInput: "",
      docRefInput: "",
      commentsInput: "",
      typeInput: type,
      isDebtPayment: false
    });
  }, [type, setModalFormData]);

  const onAmountChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/[^0-9]/g, '');
    e.target.value = cleanValue;
    handleInputChange(e);
    const numericValue = Number(cleanValue);
    if (type === WALLET.WITHDRAWAL && numericValue > Number(withdrawable)) {
      setInputErrors(prev => ({
        ...prev,
        amountInput: `El monto máximo retirable es ${currency}${Number(withdrawable).toLocaleString()}`
      }));
    } else {
      validateRange(name, cleanValue, 1, 1000000);
    }
  };

  const canPayDebtImmediately = current_debt > 0 && balance > 0;
  const amountToPay = Math.min(current_debt, balance);

  return (
    <div className="space-y-3 animate__animated animate__fadeIn">

      {/* LIQUIDACIÓN INSTANTÁNEA */}
      {canPayDebtImmediately && (
        <div className="rounded-xl border border-gold-400/40 bg-gold-400/5 p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <i className="bi bi-lightning-charge-fill text-xl text-gold-300"></i>
              <div>
                <h6 className="mb-0 text-sm font-bold text-white">Liquidación Instantánea</h6>
                <small className="text-white/45">Usa tu saldo del balance para pagar tu deuda o parte de la misma.</small>
                <p className="mb-0 text-xs text-white/55">Mientras tengas deuda, tus retiros están limitados.</p>
              </div>
            </div>
            <button
              type="button"
              className={`${styles.btnSuccess} ms-4 text-sm font-bold`}
              onClick={() => onImmediateDebtPayment(amountToPay, current_debt)}
            >
              Pagar {currency}{Number(amountToPay).toLocaleString()} ya
            </button>
          </div>
        </div>
      )}

      {/* ALERTA DE DEUDA ACTIVA */}
      {current_debt > 0 && !canPayDebtImmediately && (
        <div className="rounded-xl border border-gold-400/40 bg-gold-400/5 px-3 py-2.5 text-sm text-gold-300">
          <div className="flex items-start gap-2">
            <i className="bi bi-exclamation-triangle-fill text-lg mt-0.5"></i>
            <div>
              <h6 className="mb-1 text-sm font-bold text-gold-300">Nota sobre tu deuda</h6>
              <p className="mb-0 text-xs text-gold-300/80">
                Mientras tengas deuda, tus retiros están limitados.
                {type === WALLET.DEPOSIT && " Puedes usar este depósito para saldarla seleccionando el interruptor de abajo."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RESUMEN DE SALDOS */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04]">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-sm">
          <span className="text-white/55">Saldo Real:</span>
          <span className="font-bold text-white">{currency}{Number(balance).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-sm">
          <span className="text-white/55">Deuda Pendiente:</span>
          <span className="font-bold text-danger-soft">{currency}-{Number(current_debt).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2.5 text-sm">
          <span className="font-bold uppercase text-white/70">Disponible para Retirar:</span>
          <span className="text-base font-bold text-success-soft">{currency}{Number(withdrawable).toLocaleString()}</span>
        </div>
      </div>

      {/* SWITCH PAGO DE DEUDA */}
      {type === WALLET.DEPOSIT && current_debt > 0 && (
        <div className="rounded-xl border border-gold-400/40 bg-white/[0.04] p-3">
          <div className={styles.customSwitch}>
            <input
              type="checkbox"
              id="debt-payment-switch"
              name="isDebtPayment"
              checked={modalFormData.isDebtPayment || false}
              onChange={handleInputChange}
              role="switch"
            />
            <label htmlFor="debt-payment-switch" className={modalFormData.isDebtPayment ? styles.textActive : ""}>
              ¿Este depósito es para abonar/pagar mi deuda?
            </label>
          </div>
          {modalFormData.isDebtPayment && (
            <small className="mt-2 block text-xs text-info-soft animate__animated animate__fadeIn">
              <i className="bi bi-info-circle me-1"></i>
              Al aprobarse, descontará tu deuda actual.
            </small>
          )}
        </div>
      )}

      {/* Monto */}
      <div>
        <label className={labelCls} htmlFor="amountInput">
          Monto a {type === WALLET.DEPOSIT ? 'Depositar' : 'Retirar'} ({currency})
        </label>
        <input
          name="amountInput"
          id="amountInput"
          type="number"
          placeholder="0"
          value={modalFormData.amountInput || ''}
          onChange={onAmountChange}
          onKeyDown={handleKeyDownInteger}
          required
          className={inputCls(inputErrors.amountInput)}
        />
        {inputErrors.amountInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.amountInput}</p>}
      </div>

      {/* Referencia */}
      <div>
        <label className={labelCls} htmlFor="docRefInput">
          {type === WALLET.DEPOSIT ? "Referencia de Pago (Comprobante)" : "IBAN / Alias / Destino de fondos"}
        </label>
        <input
          name="docRefInput"
          id="docRefInput"
          type="text"
          placeholder="Referencia"
          value={modalFormData.docRefInput || ''}
          onChange={handleInputChange}
          required={type === WALLET.DEPOSIT}
          maxLength={30}
          className={inputCls(inputErrors.docRefInput)}
        />
        {inputErrors.docRefInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.docRefInput}</p>}
      </div>

      {/* Comentarios */}
      <div>
        <label className={labelCls} htmlFor="commentsInput">Observaciones adicionales</label>
        <textarea
          name="commentsInput"
          id="commentsInput"
          placeholder="Notas (opcional)"
          style={{ height: '80px' }}
          value={modalFormData.commentsInput || ''}
          onChange={handleInputChange}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-gold-400/70 focus:outline-none"
        />
      </div>

      {/* Nota informativa */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55">
        <i className="bi bi-info-circle-fill me-2 text-info-soft"></i>
        Tu solicitud será revisada por un administrador y te informaremos cuando finalice.
      </div>
    </div>
  );
};

export default TransactionRequestForm;
