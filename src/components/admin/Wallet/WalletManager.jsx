/*
Componente: WalletManager.jsx
Descripción: Panel administrativo para gestionar saldos, créditos y retiros.
Autor: Jose Ahias Vargas
*/
import styles from '../../../styles/General.module.css';
import { WALLET_ACTION, WALLET_ACTION_PREVIEW } from "../../../constants/walletConstants";
import { useSecurity } from "../../../hooks/useSecurity";

const WalletManager = ({ userData, onOpenModal }) => {
  const { currency } = useSecurity();

  return (
    <div className="w-[92%] mx-auto mt-6 space-y-4 animate__animated animate__fadeIn">
      {userData && (
        <div className="animate__animated animate__fadeIn grid gap-3 md:grid-cols-[5fr_7fr]">
          {/* CARD INFORMATIVA */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="mb-0 font-bold text-gold-300">{userData.name}</h4>
                <h5 className="mb-0 font-bold text-danger-soft">{userData.username}</h5>
                <small className="text-white/55">{userData.email}</small>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-black text-white/60">
                ID: {userData.id}
              </span>
            </div>
            <hr className="my-3 border-white/15" />
            <div className="py-2 text-center">
              <small className="mb-1 block text-[0.65rem] uppercase text-white/45">Saldo Total Disponible</small>
              <h2 className="mb-0 font-bold text-white">
                {currency}{(Number(userData.balance) + Number(userData.bonus_balance)).toLocaleString()}
              </h2>
            </div>
            <div className="mt-2 rounded-lg bg-white/10 p-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Saldo Real:</span>
                <span className="font-bold text-white">{currency}{Number(userData.balance).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-info-soft">
                <span>Bonos:</span>
                <span className="font-bold">{currency}{Number(userData.bonus_balance).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-danger-soft">
                <span>Deuda:</span>
                <span className="font-bold">-{currency}{Number(userData.current_debt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* PANEL DE ACCIONES */}
          <div className="rounded-xl border border-white/10 bg-black/25 p-4 flex flex-col justify-between">
            <div>
              <h6 className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-white/45">Sistema de Depósitos (Entrada)</h6>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className={`${styles.btnSuccess} w-full py-3 font-bold`}
                  onClick={() => onOpenModal(WALLET_ACTION.DEPOSIT, WALLET_ACTION_PREVIEW[WALLET_ACTION.DEPOSIT])}>
                  <i className="bi bi-cash-coin mb-1 block text-xl text-white"></i>DEPÓSITO
                </button>
                <button type="button" className={`${styles.btnWarning} w-full py-3 font-bold`}
                  onClick={() => onOpenModal(WALLET_ACTION.BONUS_LOAD, WALLET_ACTION_PREVIEW[WALLET_ACTION.BONUS_LOAD])}>
                  <i className="bi bi-gift mb-1 block text-xl text-black"></i>BONO
                </button>
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <h6 className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-white/45">Sistema de Crédito (Prestar)</h6>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className={`${styles.btnInfo} w-full py-3 font-bold`}
                  onClick={() => onOpenModal(WALLET_ACTION.CREDIT_LOAD, WALLET_ACTION_PREVIEW[WALLET_ACTION.CREDIT_LOAD])}>
                  <i className="bi bi-bank mb-1 block text-xl text-white"></i>PRESTAR DINERO
                </button>
                <button type="button" className={`${styles.btnWarning} w-full py-3 font-bold`}
                  onClick={() => onOpenModal(WALLET_ACTION.CREDIT_LIMIT, WALLET_ACTION_PREVIEW[WALLET_ACTION.CREDIT_LIMIT])}>
                  <i className="bi bi-gear-fill mb-1 block text-xl text-black"></i>LÍMITE
                </button>
              </div>
              <div className="mt-2 text-center">
                <small className="text-xs text-white/45">
                  Límite permitido: <strong className="text-white/70">{currency}{Number(userData.credit_limit).toLocaleString()}</strong>
                </small>
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <h6 className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-white/45">Sistema de Retiros (Salida)</h6>
              <button type="button" className={`${styles.btnDanger} w-full py-3 font-bold`}
                onClick={() => onOpenModal(WALLET_ACTION.WITHDRAWAL, WALLET_ACTION_PREVIEW[WALLET_ACTION.WITHDRAWAL])}>
                <i className="bi bi-box-arrow-right mb-1 block text-xl text-white"></i>REGISTRAR RETIRO DE EFECTIVO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletManager;
