/*
Componente: TransactionRequestList.jsx
Descripción: Listado de solicitudes de transacciones con estados de carga.
Autor: Jose Ahias Vargas
*/
import moment from "moment";
import { useSecurity } from "../../../hooks/useSecurity";
import { WALLET, WALLET_PREVIEW, WALLET_STATUS, WALLET_STATUS_PREVIEW } from "../../../constants/walletConstants";
import styles from '../../../styles/General.module.css';

const TransactionRequestList = ({ requests, filters, setFilters, loading, onAction, onRefresh, loadingActionId = null }) => {
  const { currency } = useSecurity();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-[92%] mx-auto mt-6 space-y-4 animate__animated animate__fadeIn">
      <h5 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-white">
        <i className="bi bi-clock-history me-2"></i>Solicitudes de Usuarios
      </h5>

      {/* FILTROS */}
      <div className="mb-4 rounded-xl border border-white/10 bg-black/25 p-3">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_2fr] md:items-end">
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Desde</label>
            <input type="date" value={filters.fromDate || ''} onChange={(e) => handleFilterChange('fromDate', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.08] px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Hasta</label>
            <input type="date" value={filters.toDate || ''} onChange={(e) => handleFilterChange('toDate', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.08] px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Tipo</label>
            <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none">
              <option value="">-- Todos --</option>
              <option value={WALLET.DEPOSIT}>Depósitos</option>
              <option value={WALLET.WITHDRAWAL}>Retiros</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Estado</label>
            <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none">
              <option value="">-- Todos --</option>
              <option value={WALLET_STATUS.PENDING}>Pendientes</option>
              <option value={WALLET_STATUS.APPLIED}>Aplicados</option>
              <option value={WALLET_STATUS.REJECTED}>Rechazados</option>
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <button type="button" className={`${styles.btnWarning} w-full font-bold`} onClick={onRefresh} disabled={loading}>
              {loading
                ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-black align-middle"></span>
                : <><i className="bi bi-search me-1 text-black"></i>Filtrar</>}
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
                <th className="px-3 py-3 text-left">Tipo / Referencia</th>
                <th className="px-3 py-3 text-left">Solicitado</th>
                <th className="px-3 py-3 text-left">Aplicado</th>
                <th className="px-3 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-end">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {loading && requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-white/45">
                    <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-gold-400 align-middle"></div>
                    Cargando transacciones...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center italic text-white/45">
                    No se encontraron solicitudes.
                  </td>
                </tr>
              ) : (
                requests.map(req => {
                  const isPending = req.status === WALLET_STATUS.PENDING;
                  const isRejected = req.status === WALLET_STATUS.REJECTED;
                  const isApplied = req.status === WALLET_STATUS.APPLIED;

                  return (
                    <tr key={`${req.status}-${req.id}`} className={`transition hover:bg-white/[0.03] ${loading ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-2.5 text-xs text-white/45">
                        {moment(req.created_at).format('DD/MM/YY HH:mm')}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-white/80">
                        {req.username || 'Sistema'}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`mb-1 block rounded-full px-2 py-0.5 text-[0.6rem] font-black uppercase ${
                          req.type === WALLET.DEPOSIT ? 'bg-info-soft/15 text-info-soft' : 'bg-info-soft/15 text-info-soft'
                        }`}>
                          {WALLET_PREVIEW[req.type] || req.type}
                        </span>
                        <div className="max-w-[150px] truncate text-xs text-white/45">Ref: {req.doc_ref || '---'}</div>
                      </td>
                      <td className="px-3 py-2.5 font-bold text-white">
                        {currency}{Number(req.amount).toLocaleString()}
                      </td>
                      <td className="px-3 py-2.5">
                        {isApplied ? (
                          <span className="font-bold text-success-soft">{currency}{Number(req.amount_applied).toLocaleString()}</span>
                        ) : isRejected ? (
                          <span className="text-white/35 line-through">{currency}0</span>
                        ) : (
                          <span className="text-xs text-white/45">---</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-black uppercase ${
                          isPending ? 'bg-gold-400/15 text-gold-300' :
                          isApplied ? 'bg-success-soft/15 text-success-soft' :
                          'bg-danger-soft/15 text-danger-soft'
                        }`}>
                          {WALLET_STATUS_PREVIEW[req.status] || req.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-end">
                        <button
                          type="button"
                          className={`${isPending ? styles.btnWarning : styles.btnInfo} border-0 px-2 py-1 text-xs shadow-sm`}
                          onClick={() => onAction(req)}
                          title={isPending ? "Procesar Solicitud" : "Ver Detalles"}
                          disabled={loadingActionId !== null}
                        >
                          {loadingActionId === req.id ? (
                            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-transparent border-t-black align-middle"></span>
                          ) : (
                            <i className={`bi ${isPending ? 'bi-lightning-charge-fill text-black' : 'bi-eye-fill text-white'}`}></i>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionRequestList;
