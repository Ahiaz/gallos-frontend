/*
Componente: WalletHistory.jsx (Vista Cliente - Final)
Descripción: Historial de movimientos con soporte para exportación y notas de auditoría.
Autor: Jose Ahias Vargas
*/
import moment from "moment";
import { WALLET, WALLET_PREVIEW, WALLET_STATUS } from "../../../constants/walletConstants";
import { useSecurity } from "../../../hooks/useSecurity";
import styles from '../../../styles/General.module.css';

const WalletHistory = ({ transactions, walletDetails, componentLoading, dateRange, onDateChange, onApplyFilter, onExportExcel }) => {
  const { currency } = useSecurity();
  const { balance, bonus_balance, current_debt, withdrawable } = walletDetails;

  const getTransactionUI = (type, status) => {
    if (status === WALLET_STATUS.PENDING) return { icon: 'bi-clock-history', color: 'text-gold-300', label: 'PENDIENTE' };
    if (status === WALLET_STATUS.REJECTED) return { icon: 'bi-x-circle-fill', color: 'text-white/45', label: 'RECHAZADO' };
    switch (type) {
      case WALLET.DEPOSIT:       return { icon: 'bi-arrow-down-circle-fill', color: 'text-success-soft' };
      case WALLET.WITHDRAWAL:    return { icon: 'bi-arrow-up-circle-fill', color: 'text-danger-soft' };
      case WALLET.BET_PLACED:    return { icon: 'bi-play-circle', color: 'text-white/45' };
      case WALLET.BET_WON:
      case WALLET.BET_REFUNDED:  return { icon: 'bi-trophy-fill', color: 'text-success-soft' };
      case WALLET.CREDIT_LOAD:   return { icon: 'bi-bank', color: 'text-info-soft' };
      case WALLET.CREDIT_PAYMENT: return { icon: 'bi-cash-stack', color: 'text-danger-soft' };
      case WALLET.BONUS_LOAD:    return { icon: 'bi-gift-fill', color: 'text-info-soft' };
      default:                   return { icon: 'bi-dot', color: 'text-white/45' };
    }
  };

  if (componentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center animate__animated animate__fadeIn">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-transparent border-t-gold-400"></div>
      </div>
    );
  }

  return (
    <div className="w-[92%] mx-auto mt-6 space-y-4 animate__animated animate__fadeIn">
      <h5 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-white">
        <i className="bi bi-wallet2 me-2"></i>Mi Estado de Cuenta
      </h5>

      {/* 1. RESUMEN DE SALDOS */}
      <div className="mb-4 rounded-xl border border-white/10 bg-black/40 p-3 text-center">
        <div className="grid grid-cols-1 gap-2">
          <div className="mb-1">
            <small className="block text-[0.65rem] uppercase text-white/45">Saldo Total (Real + Bono)</small>
            <h2 className="mb-0 font-bold text-gold-300">
              {currency}{Number((balance || 0) + (bonus_balance || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/10">
            <div className="pr-2">
              <small className="block text-[0.65rem] font-bold uppercase text-danger-soft">Debo</small>
              <span className="font-bold text-white/80">{currency}{Number(current_debt || 0).toLocaleString()}</span>
            </div>
            <div className="px-2">
              <small className="block text-[0.65rem] font-bold uppercase text-info-soft">Bono</small>
              <span className="font-bold text-white/80">{currency}{Number(bonus_balance || 0).toLocaleString()}</span>
            </div>
            <div className="pl-2">
              <small className="block text-[0.65rem] font-bold uppercase text-success-soft">Retirable</small>
              <span className="font-bold text-success-soft">{currency}{Number(withdrawable || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTROS Y EXPORTACIÓN */}
      <div className="mb-4 rounded-xl border border-white/10 bg-black/25 p-3">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:items-end">
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Desde:</label>
            <input type="date" value={dateRange.from} onChange={(e) => onDateChange('from', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.08] px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Hasta:</label>
            <input type="date" value={dateRange.to} onChange={(e) => onDateChange('to', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.08] px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none" />
          </div>
          <div className="col-span-2 flex gap-2 md:col-span-2">
            <button type="button" className={`${styles.btnWarning} flex-1 font-bold`} onClick={onApplyFilter}>
              <i className="bi bi-search me-1 text-black"></i>Filtrar
            </button>
            <button type="button" className={`${styles.btnSuccess}`} onClick={onExportExcel} disabled={transactions.length === 0} title="Descargar Excel">
              <i className="bi bi-file-earmark-excel text-white"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 3. LISTADO */}
      <div className="space-y-2">
        {transactions.length > 0 ? (
          transactions.map((tx) => {
            const ui = getTransactionUI(tx.type, tx.status);
            const isPending = tx.status === WALLET_STATUS.PENDING;
            const isRejected = tx.status === WALLET_STATUS.REJECTED;
            const isApplied = tx.status === WALLET_STATUS.APPLIED;

            const isTypePositive = [
              WALLET.DEPOSIT, WALLET.BET_WON, WALLET.BET_REFUNDED, WALLET.CREDIT_LOAD, WALLET.BONUS_LOAD
            ].includes(tx.type);

            let amountClass = 'text-white/45';
            let prefix = '';
            let lineThrough = false;

            if (isApplied) {
              amountClass = isTypePositive ? 'text-success-soft' : 'text-danger-soft';
              prefix = isTypePositive ? '+' : '-';
            } else if (isRejected) {
              amountClass = 'text-white/35';
              lineThrough = true;
            }

            return (
              <div
                key={`${tx.status}-${tx.id}`}
                className={`rounded-lg border p-3 shadow-sm ${isPending ? 'border-gold-400/40 bg-gold-400/5' : 'border-white/10 bg-black/30'}`}
                style={isPending ? { borderLeft: '4px solid #d4af37' } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <i className={`bi ${ui.icon} ${ui.color} text-2xl`}></i>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 font-bold text-white">
                        <span className="rounded-full border border-white/15 bg-white/10 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase text-white/70">
                          {WALLET_PREVIEW[tx.type] || tx.type}
                        </span>
                        <span className="text-sm">{tx.description || 'Sin descripción'}</span>
                        {ui.label && (
                          <span className={`rounded-full px-1.5 py-0.5 text-[0.6rem] font-black ${isPending ? 'bg-gold-400/20 text-gold-300' : 'bg-danger-soft/15 text-danger-soft'}`}>
                            {ui.label}
                          </span>
                        )}
                      </div>
                      <small className="block text-xs text-white/45">{moment(tx.created_at).format('LLL')}</small>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className={`font-bold ${amountClass}`} style={{ textDecoration: lineThrough ? 'line-through' : 'none' }}>
                      {prefix}{currency}{Math.abs(Number(tx.amount)).toLocaleString()}
                    </div>
                    <small className="block text-[0.65rem] text-white/35">
                      {isApplied ? `Balance: ${currency}${Number(tx.new_balance).toLocaleString()}` : '---'}
                    </small>
                  </div>
                </div>

                {tx.admin_notes && (
                  <div className="mt-2 rounded border-l-4 border-info-soft/40 bg-info-soft/5 p-2 text-xs italic text-white/55">
                    <i className="bi bi-chat-left-dots me-2 text-info-soft"></i>
                    <strong>Nota Admin:</strong> {tx.admin_notes}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/25 py-10 text-center text-sm text-white/45">
            No hay movimientos.
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletHistory;
