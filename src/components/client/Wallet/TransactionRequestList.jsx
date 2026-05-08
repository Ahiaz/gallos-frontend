/*
Componente: TransactionRequestList.jsx
Descripción: Listado de solicitudes con filtros de Tipo, Estado y Rango de Fechas.
Autor: Jose Ahias Vargas
*/
import { Fragment, useState } from "react";
import moment from "moment";
import { WALLET, WALLET_PREVIEW, WALLET_STATUS, WALLET_STATUS_PREVIEW } from "../../../constants/walletConstants";
import { useSecurity } from "../../../hooks/useSecurity";
import styles from '../../../styles/General.module.css';

const TransactionRequestList = ({ requests, filters, setFilters, loading, onCancel, onRefresh, onRequestNew, onCreditNew }) => {
  const { currency } = useSecurity();
  const [notesOpenId, setNotesOpenId] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-[92%] mx-auto mt-6 space-y-4 animate__animated animate__fadeIn">
      <h5 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-white">
        <i className="bi bi-clock-history me-2"></i>Mis Solicitudes
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
          <div className="col-span-2 flex flex-wrap gap-2 md:col-span-1">
            <button type="button" className={`${styles.btnWarning} flex-1 font-bold`} onClick={onRefresh} disabled={loading}>
              {loading
                ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-black align-middle"></span>
                : <><i className="bi bi-search me-1 text-black"></i>Filtrar</>}
            </button>
            <button type="button" className={`${styles.btnWarning} font-bold text-xs`} onClick={() => onCreditNew(WALLET.CREDIT_LOAD)}>
              <i className="bi bi-bank me-1 text-black"></i>CRÉDITO
            </button>
            <button type="button" className={`${styles.btnSuccess} font-bold text-xs`} onClick={() => onRequestNew(WALLET.DEPOSIT)}>
              <i className="bi bi-plus-lg me-1 text-white"></i>DEPÓSITO
            </button>
            <button type="button" className={`${styles.btnDanger} font-bold text-xs`} onClick={() => onRequestNew(WALLET.WITHDRAWAL)}>
              <i className="bi bi-dash-lg me-1 text-white"></i>RETIRO
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
                <th className="px-3 py-3 text-left">Tipo / Referencia</th>
                <th className="px-3 py-3 text-left">Solicitado</th>
                <th className="px-3 py-3 text-left">Aplicado</th>
                <th className="px-3 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-end">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {requests.length === 0 && !loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center italic text-white/45">
                    No se encontraron solicitudes.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const isPending = req.status === WALLET_STATUS.PENDING;
                  const isRejected = req.status === WALLET_STATUS.REJECTED;
                  const isApplied = req.status === WALLET_STATUS.APPLIED;
                  const isNotesOpen = notesOpenId === req.id;

                  return (
                    <Fragment key={req.id}>
                      <tr key={`${req.id}-${req.status}`} className={`transition hover:bg-white/[0.03] ${loading ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-2.5 text-xs text-white/45">
                          {moment(req.created_at).format('DD/MM/YY HH:mm')}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="mb-1 block rounded-full bg-info-soft/15 px-2 py-0.5 text-[0.6rem] font-black uppercase text-info-soft">
                            {WALLET_PREVIEW[req.type] || req.type}
                          </span>
                          <div className="text-xs text-white/45">Ref: {req.doc_ref || '---'}</div>
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
                            <span className="text-xs italic text-white/45">En revisión</span>
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
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <button type="button"
                                className={`${styles.btnDanger} border-0 px-2 py-1 text-xs shadow-sm`}
                                onClick={() => onCancel(req.id)}
                                title="Anular Solicitud">
                                <i className="bi bi-trash3 text-white"></i>
                              </button>
                            )}
                            {(isRejected || (isApplied && req.admin_notes)) && (
                              <button type="button"
                                className={`${isRejected ? styles.btnDanger : styles.btnSuccess} border-0 px-2 py-1 text-xs shadow-sm`}
                                onClick={() => setNotesOpenId(isNotesOpen ? null : req.id)}
                                title={isRejected ? "Ver motivo de rechazo" : "Ver notas del administrador"}>
                                <i className={`bi ${isRejected ? 'bi-exclamation-circle-fill' : 'bi-chat-left-text-fill'} text-white`}></i>
                              </button>
                            )}
                            {isApplied && !req.admin_notes && (
                              <i className="bi bi-check-circle-fill text-lg text-success-soft animate__animated animate__fadeIn"></i>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isNotesOpen && (
                        <tr key={`notes-${req.id}`}>
                          <td colSpan="6" className="border-0 p-0">
                            <div className={`border-l-4 px-4 py-2 text-sm animate__animated animate__fadeIn ${
                              isRejected ? 'border-danger-soft/50 bg-danger-soft/5 text-danger-soft' : 'border-success-soft/50 bg-success-soft/5 text-success-soft'
                            }`}>
                              <strong>{isRejected ? 'Motivo del Rechazo:' : 'Notas del Administrador:'}</strong>{' '}
                              {req.admin_notes || 'Sin observaciones adicionales.'}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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
