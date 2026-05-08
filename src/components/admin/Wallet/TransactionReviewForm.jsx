/*
Componente: TransactionReviewForm.jsx
Descripción: Formulario para que el administrador apruebe, rechace o ajuste solicitudes.
Autor: Jose Ahias Vargas
*/
import { useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import { useSecurity } from "../../../hooks/useSecurity";
import { useNumberValidation } from "../../../hooks/useNumberValidation";
import { WALLET, WALLET_PREVIEW, WALLET_STATUS } from "../../../constants/walletConstants";

const inputCls = (error) =>
  `w-full rounded-xl border bg-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-0 disabled:opacity-40 ${error ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/70'}`;

const TransactionReviewForm = ({ request = {}, walletSummary = {} }) => {
  const { currency } = useSecurity();
  const {
    modalFormData,
    inputErrors,
    setModalFormData,
    handleInputChange,
    setInputErrors
  } = useModal();

  const { handleKeyDownInteger, validateRange } = useNumberValidation(setInputErrors);
  const { balance = 0, current_debt = 0, credit_limit = 0 } = walletSummary || {};

  useEffect(() => {
    if (request.id) {
      setModalFormData({
        requestId: request.id,
        userId: request.user_id,
        amountAppliedInput: request.amount ? String(Math.floor(Number(request.amount))) : "",
        statusInput: request.status === WALLET_STATUS.PENDING ? WALLET_STATUS.APPLIED : request.status,
        adminNotesInput: request.admin_notes || "",
        type: request.type
      });
    }
  }, [request, setModalFormData]);

  const onAmountAppliedChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/[^0-9]/g, '');
    e.target.value = cleanValue;
    handleInputChange(e);
    validateRange(name, cleanValue, 0, 1000000);
  };

  return (
    <div className="animate__animated animate__fadeIn space-y-4">
      {/* Estado de cuenta del usuario */}
      <div className="grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-black/25 py-3 text-center">
        <div className="px-3">
          <p className="mb-0.5 text-[0.6rem] font-black uppercase tracking-wide text-success-soft">Saldo Real</p>
          <p className="mb-0 text-sm font-black text-success-soft">{currency}{Number(balance).toLocaleString()}</p>
        </div>
        <div className="px-3">
          <p className="mb-0.5 text-[0.6rem] font-black uppercase tracking-wide text-danger-soft">Deuda Actual</p>
          <p className="mb-0 text-sm font-black text-danger-soft">{currency}{Number(current_debt).toLocaleString()}</p>
        </div>
        <div className="px-3">
          <p className="mb-0.5 text-[0.6rem] font-black uppercase tracking-wide text-gold-300">Límite Crédito</p>
          <p className="mb-0 text-sm font-black text-gold-300">{currency}{Number(credit_limit).toLocaleString()}</p>
        </div>
      </div>

      {/* Detalles de solicitud */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
        <p className="mb-2 text-[0.6rem] font-black uppercase tracking-wide text-white/45">Detalles de Solicitud</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-white/55">Tipo:</span>
            <span className={`ml-2 rounded-full px-2 py-0.5 text-[0.62rem] font-black ${request.type === WALLET.DEPOSIT ? 'bg-success-soft/15 text-success-soft' : 'bg-info-soft/15 text-info-soft'}`}>
              {WALLET_PREVIEW[request.type] || request.type}
            </span>
          </div>
          <div>
            <span className="text-white/55">Monto Solicitado:</span>
            <span className="ml-1 font-black text-white">{currency}{Number(request.amount).toLocaleString()}</span>
          </div>
          <div className="col-span-2">
            <span className="text-white/55">Referencia:</span>
            <span className="ml-1 text-white/85">{request.doc_ref || 'Sin referencia'}</span>
          </div>
          <div className="col-span-2">
            <span className="text-white/55">Nota del usuario:</span>
            <span className="ml-1 italic text-white/70">"{request.comments || 'Sin comentarios'}"</span>
          </div>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Acciones */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/70">Estado de Resolución</label>
          <select
            name="statusInput"
            value={modalFormData.statusInput || ''}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white focus:border-gold-400/70 focus:outline-none focus:ring-0"
          >
            <option value={WALLET_STATUS.APPLIED}>Aprobar / Aplicar</option>
            <option value={WALLET_STATUS.REJECTED}>Rechazar / Anular</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-white/70">Monto Final a Aplicar ({currency})</label>
          <input
            name="amountAppliedInput"
            type="number"
            placeholder="0"
            value={modalFormData.amountAppliedInput || ''}
            onChange={onAmountAppliedChange}
            onKeyDown={handleKeyDownInteger}
            disabled={modalFormData.statusInput === WALLET_STATUS.REJECTED}
            className={inputCls(inputErrors.amountAppliedInput)}
          />
          {inputErrors.amountAppliedInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.amountAppliedInput}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-white/70" htmlFor="adminNotesInput">
            Notas del Administrador (el usuario lo podrá ver)
          </label>
          <textarea
            name="adminNotesInput"
            id="adminNotesInput"
            style={{ height: '100px' }}
            placeholder="Escribe el motivo..."
            value={modalFormData.adminNotesInput || ''}
            onChange={handleInputChange}
            required={modalFormData.statusInput === WALLET_STATUS.REJECTED}
            className={`${inputCls(false)} resize-none`}
          />
        </div>
      </div>

      {/* Alertas críticas */}
      <div className="animate__animated animate__fadeIn space-y-2">
        {(modalFormData.statusInput === WALLET_STATUS.APPLIED || modalFormData.statusInput === WALLET_STATUS.PENDING) ? (
          <div className="rounded-xl border border-success-soft/30 bg-success-soft/10 px-3 py-2 text-xs text-success-soft">
            <i className="bi bi-check-all me-2 text-base"></i>
            Se sumarán/restarán <strong>{currency}{Number(modalFormData.amountAppliedInput).toLocaleString()}</strong> al balance.
          </div>
        ) : (
          <div className="rounded-xl border border-danger-soft/30 bg-danger-soft/10 px-3 py-2 text-xs text-danger-soft">
            <i className="bi bi-x-circle me-2 text-base"></i>
            La solicitud será marcada como <strong>RECHAZADA</strong> y se aplicará un monto de {currency}0.
          </div>
        )}
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70">
          <i className="bi bi-exclamation-triangle-fill me-2 text-gold-300"></i>
          <strong className="uppercase text-gold-300">Advertencia:</strong> Una vez guardada, <strong>esta acción no se puede reversar</strong>.
        </div>
      </div>
    </div>
  );
};

export default TransactionReviewForm;
