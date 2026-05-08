/*
Componente: WalletHistory.jsx
Descripción: Interfaz de auditoría financiera para administradores (Estado de Cuenta Global)
Autor: Jose Ahias Vargas
*/
import moment from "moment";
import { WALLET, WALLET_FILTER, WALLET_PREVIEW, WALLET_STATUS } from "../../../constants/walletConstants";
import styles from '../../../styles/General.module.css';
import { useSecurity } from "../../../hooks/useSecurity";

const WalletHistory = ({ transactions, usersList, loading, filters, onFilterChange, onSearch, onExport }) => {
  const { currency } = useSecurity();

  const getTransactionUI = (type, status) => {
    if (status === WALLET_STATUS.PENDING) return { icon: 'bi-clock-history', color: 'text-gold-300', label: 'PENDIENTE' };
    if (status === WALLET_STATUS.REJECTED) return { icon: 'bi-x-circle-fill', color: 'text-white/45', label: 'RECHAZADO' };
    switch (type) {
      case WALLET.DEPOSIT:        return { icon: 'bi-arrow-down-circle-fill', color: 'text-success-soft' };
      case WALLET.WITHDRAWAL:     return { icon: 'bi-arrow-up-circle-fill', color: 'text-danger-soft' };
      case WALLET.BET_PLACED:     return { icon: 'bi-play-circle', color: 'text-white/45' };
      case WALLET.BET_WON:
      case WALLET.BET_REFUNDED:   return { icon: 'bi-trophy-fill', color: 'text-success-soft' };
      case WALLET.CREDIT_LOAD:    return { icon: 'bi-bank', color: 'text-info-soft' };
      case WALLET.CREDIT_PAYMENT: return { icon: 'bi-cash-stack', color: 'text-success-soft' };
      case WALLET.BONUS_LOAD:     return { icon: 'bi-gift-fill', color: 'text-info-soft' };
      default:                    return { icon: 'bi-dot', color: 'text-white/45' };
    }
  };

  const stats = transactions.reduce((acc, tx) => {
    if (tx.status !== WALLET_STATUS.APPLIED) return acc;
    const val = Number(tx.amount);
    if (tx.type === WALLET.DEPOSIT || tx.type === WALLET.CREDIT_PAYMENT) acc.ingresos += val;
    if (tx.type === WALLET.WITHDRAWAL) acc.egresos += val;
    return acc;
  }, { ingresos: 0, egresos: 0 });

  return (
    <div className="w-[92%] mx-auto mt-6 space-y-4 animate__animated animate__fadeIn">
      <h4 className="mb-4 text-sm font-black uppercase tracking-[0.1em] text-white">
        <i className="bi bi-bank2 me-2"></i>Estado de Cuenta Global
      </h4>

      {/* RESUMEN */}
      <div className="mb-4 grid gap-3 text-center md:grid-cols-2">
        <div className="rounded-xl border border-success-soft/25 bg-success-soft/10 p-4">
          <small className="block text-[0.65rem] uppercase text-white/45">Ingresos de Caja (Filtro)</small>
          <h3 className="mb-0 font-bold text-success-soft">+{currency}{stats.ingresos.toLocaleString()}</h3>
        </div>
        <div className="rounded-xl border border-danger-soft/25 bg-danger-soft/10 p-4">
          <small className="block text-[0.65rem] uppercase text-white/45">Egresos de Caja (Filtro)</small>
          <h3 className="mb-0 font-bold text-danger-soft">-{currency}{stats.egresos.toLocaleString()}</h3>
        </div>
      </div>

      {/* FILTROS */}
      <div className="mb-4 rounded-xl border border-white/10 bg-black/25 p-3">
        <div className="grid gap-3 md:grid-cols-[2fr_2fr_1.5fr_1.5fr_2fr] md:items-end">
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Filtrar por Usuario</label>
            <select value={filters.userId} onChange={(e) => onFilterChange('userId', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none">
              <option value="">-- Todos los Usuarios --</option>
              {usersList.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Tipo de Movimiento</label>
            <select value={filters.type} onChange={(e) => onFilterChange('type', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none">
              <option value={WALLET_FILTER.ALL}>-- Todos --</option>
              <option value={WALLET.DEPOSIT}>Depósitos (Dinero)</option>
              <option value={WALLET.WITHDRAWAL}>Retiros</option>
              <option value={WALLET.CREDIT_LOAD}>Carga de Crédito (Deuda)</option>
              <option value={WALLET.CREDIT_PAYMENT}>Abono a Deuda</option>
              <option value={WALLET.BONUS_LOAD}>Carga Bono (Regalo)</option>
              <option value={WALLET.BET_PLACED}>Apuestas</option>
              <option value={WALLET.BET_WON}>Premios</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Desde</label>
            <input type="date" value={filters.fromDate} onChange={(e) => onFilterChange('fromDate', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.08] px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Hasta</label>
            <input type="date" value={filters.toDate} onChange={(e) => onFilterChange('toDate', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.08] px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button type="button" className={`${styles.btnWarning} flex-1 font-bold`} onClick={onSearch} disabled={loading}>
              {loading
                ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-black align-middle"></span>
                : <><i className="bi bi-funnel me-1 text-black"></i>Filtrar</>}
            </button>
            <button type="button" className={`${styles.btnSuccess}`} onClick={onExport} disabled={transactions.length === 0}>
              <i className="bi bi-file-earmark-excel text-white"></i>
            </button>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse" style={{ fontSize: '0.85rem' }}>
            <thead className="bg-brand-850 text-[0.68rem] uppercase tracking-[0.12em] text-white/55">
              <tr>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-3 py-3 text-left">Usuario</th>
                <th className="px-3 py-3 text-left">Movimiento</th>
                <th className="px-3 py-3 text-left">Concepto / Trazabilidad</th>
                <th className="px-3 py-3 text-left">Monto</th>
                <th className="px-3 py-3 text-left">Balance Post</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {!loading && transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-white/45">No se encontraron movimientos financieros.</td>
                </tr>
              ) : transactions.map(tx => {
                const ui = getTransactionUI(tx.type, tx.status);
                const isPending = tx.status === WALLET_STATUS.PENDING;
                const isApplied = tx.status === WALLET_STATUS.APPLIED;
                const isRejected = tx.status === WALLET_STATUS.REJECTED;

                const isPositive = [WALLET.DEPOSIT, WALLET.CREDIT_PAYMENT, WALLET.BET_WON].includes(tx.type);
                const isNegative = [WALLET.WITHDRAWAL, WALLET.BET_PLACED].includes(tx.type);
                const isVirtual  = [WALLET.CREDIT_LOAD, WALLET.BONUS_LOAD].includes(tx.type);

                let amountClass = 'text-white/45';
                if (isApplied) {
                  if (isPositive) amountClass = 'text-success-soft';
                  else if (isNegative) amountClass = 'text-danger-soft';
                  else if (isVirtual) amountClass = 'text-info-soft';
                } else if (isRejected) {
                  amountClass = 'text-white/30';
                }

                return (
                  <tr
                    key={`${tx.status}-${tx.id}`}
                    className={`transition hover:bg-white/[0.03] ${isPending ? 'bg-gold-400/5' : ''} ${isRejected ? 'opacity-50' : ''}`}
                  >
                    <td className="px-4 py-2.5 text-xs text-white/45">
                      {moment(tx.created_at).format('DD/MM/YY HH:mm')}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="font-bold text-white">{tx.username}</div>
                      <small className="block text-[0.65rem] text-white/45">{tx.email}</small>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <i className={`bi ${ui.icon} ${ui.color} text-xl`}></i>
                        <div>
                          <span className="mb-1 block rounded border border-white/15 bg-white/10 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase text-white/70">
                            {WALLET_PREVIEW[tx.type] || tx.type}
                          </span>
                          {ui.label && (
                            <span className={`rounded px-1.5 py-0.5 text-[0.6rem] font-black ${isPending ? 'bg-gold-400/20 text-gold-300' : 'bg-danger-soft/15 text-danger-soft'}`}>
                              {ui.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="max-w-[220px] text-sm text-white/80">{tx.description || 'Movimiento de billetera'}</div>
                      {tx.event_name && (
                        <small className="mt-1 block text-[0.65rem] text-info-soft">
                          <i className="bi bi-trophy me-1"></i>{tx.event_name}
                        </small>
                      )}
                    </td>
                    <td
                      className={`px-3 py-2.5 font-bold ${amountClass}`}
                      style={{ textDecoration: isRejected ? 'line-through' : 'none' }}
                    >
                      {isApplied && isPositive && '+'}{isApplied && isNegative && '-'}{currency}{Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-white/70">
                      {isApplied ? `${currency}${Number(tx.new_balance).toLocaleString()}` : '---'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletHistory;
