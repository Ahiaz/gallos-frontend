/*
Componente: CreditRequestForm.jsx
Descripción: Formulario especializado para solicitar adelantos de saldo (créditos).
Autor: Jose Ahias Vargas
*/
import { useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import { useNumberValidation } from "../../../hooks/useNumberValidation";
import styles from '../../../styles/General.module.css';
import { WALLET } from "../../../constants/walletConstants";
import { useSecurity } from "../../../hooks/useSecurity";

const inputCls = (error) =>
  `w-full rounded-xl border bg-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-0 ${error ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/70'}`;
const labelCls = "mb-1 block text-xs font-semibold text-white/70";

const CreditRequestForm = ({ walletSummary = {} }) => {
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
    credit_limit = 0
  } = walletSummary || {};

  const calc = credit_limit - current_debt;
  const availableCredit = calc < 0 ? 0 : calc;

  useEffect(() => {
    setModalFormData({
      amountInput: "",
      docRefInput: "SOLICITUD_CREDITO",
      commentsInput: "",
      typeInput: WALLET.CREDIT_LOAD,
      isDebtPayment: false
    });
  }, [setModalFormData]);

  const onAmountChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/[^0-9]/g, '');
    e.target.value = cleanValue;
    handleInputChange(e);
    const numericValue = Number(cleanValue);
    if (numericValue > availableCredit) {
      setInputErrors(prev => ({
        ...prev,
        amountInput: `El monto excede tu crédito disponible (${currency}${availableCredit.toLocaleString()})`
      }));
    } else {
      validateRange(name, cleanValue, 1, availableCredit);
    }
  };

  return (
    <div className="space-y-3 animate__animated animate__fadeIn">

      {/* ESTADO DE CRÉDITO */}
      <div className="grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-black/40 py-3 text-center">
        <div className="px-2">
          <small className="block text-[0.65rem] font-bold uppercase text-danger-soft">Límite Total</small>
          <div className="font-bold text-danger-soft">{currency}{Number(walletSummary.credit_limit || 0).toLocaleString()}</div>
        </div>
        <div className="px-2">
          <small className="block text-[0.65rem] font-bold uppercase text-gold-300">Deuda Actual</small>
          <div className="font-bold text-gold-300">{currency}{Number(current_debt).toLocaleString()}</div>
        </div>
        <div className="px-2">
          <small className="block text-[0.65rem] font-bold uppercase text-success-soft">Disponible</small>
          <div className="font-bold text-success-soft">{currency}{Number(availableCredit).toLocaleString()}</div>
        </div>
      </div>

      {/* INFO */}
      <div className="rounded-xl border border-info-soft/30 bg-info-soft/10 px-3 py-2.5 text-xs text-info-soft animate__animated animate__fadeIn">
        <i className="bi bi-info-circle-fill me-2 text-base"></i>
        Al solicitar un crédito, el monto se sumará a tu <strong>Saldo Real</strong> inmediatamente después de la aprobación, pero aumentará tu <strong>Deuda Pendiente</strong>.
      </div>

      {/* Monto */}
      <div>
        <label className={labelCls} htmlFor="amountInput">
          Monto del Crédito a solicitar ({currency})
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

      {/* Motivo */}
      <div>
        <label className={labelCls} htmlFor="commentsInput">Justificación / Motivo del adelanto</label>
        <textarea
          name="commentsInput"
          id="commentsInput"
          placeholder="Notas"
          style={{ height: '120px' }}
          value={modalFormData.commentsInput || ''}
          onChange={handleInputChange}
          className={`resize-none ${inputCls(inputErrors.commentsInput)}`}
        />
        {inputErrors.commentsInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.commentsInput}</p>}
      </div>

      {/* Impacto estimado */}
      {modalFormData.amountInput > 0 && !inputErrors.amountInput && (
        <div className="rounded-xl border border-gold-400/40 bg-gold-400/5 p-3 animate__animated animate__fadeIn">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-white/60">Nueva Deuda Estimada:</span>
            <span className="font-bold text-danger-soft">
              {currency}{(Number(current_debt) + Number(modalFormData.amountInput)).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Nuevo Saldo Estimado:</span>
            <span className="font-bold text-success-soft">
              {currency}{(Number(balance) + Number(modalFormData.amountInput)).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Nota de seguridad */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] py-2 text-center text-xs text-white/45">
        <i className="bi bi-shield-lock-fill me-2 text-white/35"></i>
        Esta operación está sujeta a historial crediticio y aprobación manual.
      </div>
    </div>
  );
};

export default CreditRequestForm;
