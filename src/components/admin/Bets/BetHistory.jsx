/*
Componente: BetHistory.jsx
Descripción: Interfaz de auditoría con tabla expandible y filtros integrados.
Autor: Jose Ahias Vargas
*/
import { Fragment, useState } from "react";
import moment from "moment";
import styles from '../../../styles/General.module.css';
import { BETS, BETS_PREVIEW } from "../../../constants/betConstants";
import { EVENT_FILTERS } from "../../../constants/eventConstants";
import { WALLET, WALLET_PREVIEW } from "../../../constants/walletConstants";
import { useSecurity } from "../../../hooks/useSecurity";
import { useSort } from "../../../hooks/useSort";

const BetHistory = ({
  componentLoading, bets, events, usersList, walletDetails, filters, loading,
  loadingTx, onFilterChange, onSearch, onExport, onExpand
}) => {
  const [openId, setOpenId] = useState(null);
  const { currency } = useSecurity();
  const { items: sortedBets, requestSort, renderSortIcon } = useSort(bets, { key: 'created_at', direction: 'desc' }, 'text-gold-400');

  const handleToggle = (id) => {
    const isOpening = openId !== id;
    setOpenId(isOpening ? id : null);
    if (isOpening) onExpand(id);
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
      <h4 className="mb-4 text-sm font-black text-white">
        <i className="bi bi-layout-text-sidebar-reverse me-2 text-gold-300"></i>
        Histórico de Apuestas
      </h4>

      {/* FILTROS */}
      <div className="mb-4 rounded-xl border border-white/10 bg-black/25 p-3">
        <div className="grid gap-3 md:grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr] md:items-end">
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Filtrar por Evento</label>
            <select value={filters.eventId} onChange={(e) => onFilterChange('eventId', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none">
              <option value={EVENT_FILTERS.ALL}>-- Todos los Eventos --</option>
              {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Filtrar por Usuario</label>
            <select value={filters.userId} onChange={(e) => onFilterChange('userId', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none">
              <option value="">-- Todos los Usuarios --</option>
              {usersList.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Desde</label>
            <input type="date" value={filters.fromDate} onChange={(e) => onFilterChange('fromDate', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-white/55">Hasta</label>
            <input type="date" value={filters.toDate} onChange={(e) => onFilterChange('toDate', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button type="button" className={`${styles.btnWarning} flex-1 font-bold`} onClick={onSearch}>
              <i className="bi bi-funnel me-1 text-black"></i>Filtrar
            </button>
            <button type="button" className={`${styles.btnSuccess}`} onClick={onExport}>
              <i className="bi bi-file-earmark-excel text-white"></i>
            </button>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-black/40" style={{ fontSize: '0.85rem' }}>
            <thead className="bg-brand-850 text-[0.68rem] uppercase tracking-[0.12em] text-white/55">
              <tr>
                <th className="w-[40px] px-3 py-3"></th>
                <th className="px-3 py-3 cursor-pointer" onClick={() => requestSort('id')}>
                  ID {renderSortIcon('id')}
                </th>
                <th className="px-3 py-3 cursor-pointer text-left" onClick={() => requestSort('username')}>
                  Usuario {renderSortIcon('username')}
                </th>
                <th className="px-3 py-3 text-left">Pelea / Ronda</th>
                <th className="px-3 py-3 cursor-pointer text-left" onClick={() => requestSort('amount')}>
                  Monto {renderSortIcon('amount')}
                </th>
                <th className="px-3 py-3 text-left">Estado</th>
                <th className="px-3 py-3 cursor-pointer text-left" onClick={() => requestSort('created_at')}>
                  Fecha {renderSortIcon('created_at')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-transparent border-t-gold-400"></div>
                  </td>
                </tr>
              ) : sortedBets.length > 0 ? (
                sortedBets.map(bet => (
                  <Fragment key={`group-${bet.id}`}>
                    {/* Fila Principal */}
                    <tr
                      onClick={() => handleToggle(bet.id)}
                      className={`cursor-pointer transition hover:bg-white/[0.04] ${openId === bet.id ? 'bg-gold-400/5' : ''}`}
                    >
                      <td className="px-3 py-2.5 text-center">
                        <i className={`bi bi-chevron-${openId === bet.id ? 'down' : 'right'} font-bold text-white/45`}></i>
                      </td>
                      <td className="px-3 py-2.5">
                        <small className="font-bold text-white/70">#{bet.id}</small>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-bold text-white">{bet.username}</div>
                        <small className="text-white/45">{bet.email}</small>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-bold text-white">{bet.gallo_a} vs {bet.gallo_b}</div>
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[0.6rem] text-white/60">
                          R#{bet.round_number} - P#{bet.fight_number}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-bold">
                        {bet.paid === BETS.PAID ? (
                          <span className="text-success-soft">+{currency}{Number(bet.amount).toLocaleString()}</span>
                        ) : bet.paid === BETS.LOST ? (
                          <span className="text-danger-soft">-{currency}{Number(bet.amount).toLocaleString()}</span>
                        ) : bet.paid === BETS.REFUNDED ? (
                          <span className="text-white/45">{currency}{Number(bet.amount).toLocaleString()}</span>
                        ) : (
                          <span className="text-info-soft">{currency}{Number(bet.amount).toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-black uppercase ${bet.paid === BETS.PAID ? 'bg-success-soft/15 text-success-soft' :
                          bet.paid === BETS.LOST ? 'bg-danger-soft/15 text-danger-soft' :
                            'bg-white/10 text-white/55'
                          }`}>
                          {BETS_PREVIEW[bet.paid] || bet.paid}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-white/45">
                        {moment(bet.created_at).format('DD/MM/YY HH:mm')}
                      </td>
                    </tr>

                    {/* Detalle Desplegable */}
                    <tr>
                      <td colSpan="7" className="border-0 p-0">
                        <div className={`overflow-hidden transition-all duration-300 ${openId === bet.id ? 'max-h-[500px]' : 'max-h-0'}`}>
                          <div className="border-l-4 border-gold-400/50 bg-gold-400/5 p-3">
                            <h6 className="mb-3 text-xs font-bold text-white/70">
                              <i className="bi bi-bank me-2"></i>MOVIMIENTOS CONTABLES EN BILLETERA
                            </h6>
                            {loadingTx === bet.id ? (
                              <div className="py-2 text-center">
                                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-gold-400"></div>
                              </div>
                            ) : walletDetails[bet.id] ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse rounded-lg border border-white/10 bg-black/30" style={{ fontSize: '0.75rem' }}>
                                  <thead className="bg-white/10 text-[0.65rem] uppercase text-white/55">
                                    <tr>
                                      <th className="px-2 py-2 text-left">Operación</th>
                                      <th className="px-2 py-2 text-left">Monto</th>
                                      <th className="px-2 py-2 text-left">Balance Anterior</th>
                                      <th className="px-2 py-2 text-left">Nuevo Balance</th>
                                      <th className="px-2 py-2 text-left">Hora</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/[0.07]">
                                    {walletDetails[bet.id].map((tx, idx) => (
                                      <tr key={idx}>
                                        <td className="px-2 py-1.5 font-bold text-white/80">{WALLET_PREVIEW[tx.type] || tx.type}</td>
                                        <td className={`px-2 py-1.5 ${tx.type === WALLET.BET_PLACED ? 'text-danger-soft' : 'text-success-soft'}`}>
                                          {tx.type === WALLET.BET_PLACED ? '-' : '+'}{currency}{Number(tx.amount).toLocaleString()}
                                        </td>
                                        <td className="px-2 py-1.5 text-white/60">{currency}{Number(tx.previous_balance).toLocaleString()}</td>
                                        <td className="px-2 py-1.5 font-bold text-white">{currency}{Number(tx.new_balance).toLocaleString()}</td>
                                        <td className="px-2 py-1.5 text-white/45">{moment(tx.created_at).format('HH:mm:ss')}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center text-sm text-white/45">Sin transacciones registradas.</div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-white/45">
                    <i className="bi bi-search mb-2 block text-4xl opacity-50"></i>
                    No se encontraron apuestas para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BetHistory;
