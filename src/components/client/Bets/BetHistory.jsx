/*
Componente: BetHistory.jsx
Descripción: Vista de historial con buscador de eventos y balance dinámico
Autor: Jose Ahias Vargas
*/

import { useMemo } from "react";
import Select from "react-select";
import { GALLO } from "../../../constants/galloConstants";
import moment from "moment";
import { EVENT_FILTERS } from "../../../constants/eventConstants";
import { BETS, BETS_PREVIEW } from "../../../constants/betConstants";
import { useSecurity } from "../../../hooks/useSecurity";
import styles from '../../../styles/General.module.css';

const BetHistory = ({ events, bets, selectedEventId, onEventChange, loading, isMiniVersion, onExportExcel }) => {
  const { currency } = useSecurity();

  const groupedOptions = useMemo(() => {
    const allOption = { value: EVENT_FILTERS.ALL, label: '📊 Todos los Eventos', netBalance: null };
    const eventOptions = events.map(e => ({
      value: e.event_id,
      label: `📅 ${e.event_name}`,
      netBalance: e.net_balance
    }));
    return [allOption, ...eventOptions];
  }, [events]);

  const displayBalance = useMemo(() => {
    if (selectedEventId === EVENT_FILTERS.ALL) {
      return events.reduce((acc, curr) => acc + (Number(curr.net_balance) || 0), 0);
    }
    const selected = events.find(e => e.event_id === selectedEventId);
    return selected ? (Number(selected.net_balance) || 0) : 0;
  }, [events, selectedEventId]);

  const currentSelectValue = groupedOptions.find(opt => opt.value === selectedEventId);

  return (
    <div className="w-[92%] mx-auto mt-6 space-y-4 animate__animated animate__fadeIn">
      {!isMiniVersion && (
        <>
          <h5 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-white">
            <i className="bi bi-coin me-2"></i>Historial de Apuestas
          </h5>

          <div className="mb-4 rounded-xl border border-white/10 bg-black/25 p-3">
            <div className="grid gap-3 md:grid-cols-2 md:items-center">
              <div>
                <label className="mb-1 block text-xs text-white/55">Filtrar por Evento:</label>
                <Select
                  value={currentSelectValue}
                  onChange={(opt) => onEventChange(opt?.value)}
                  options={groupedOptions}
                  placeholder="Buscar evento..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isLoading={loading}
                  isSearchable={true}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <div>
                  <small className="block text-[0.65rem] font-bold uppercase text-white/45">Rendimiento Neto:</small>
                  <h3 className={`mb-0 text-center font-bold ${displayBalance >= 0 ? 'text-success-soft' : 'text-danger-soft'}`}>
                    {displayBalance > 0 ? '+' : ''}
                    {currency}{Number(displayBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onExportExcel}
                  disabled={loading || bets.length === 0}
                  className={`${styles.btnSuccess} flex items-center gap-2`}
                  title="Exportar historial a Excel"
                >
                  <i className="bi bi-file-earmark-excel text-white"></i>
                  <span className="hidden lg:inline">Exportar</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div style={isMiniVersion ? { maxHeight: '250px', overflowY: 'auto' } : {}}>
        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400"></div>
          </div>
        ) : bets.length > 0 ? (
          <div className="space-y-2">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className="rounded-lg border border-white/10 bg-black/30 p-2 shadow-sm"
                style={{
                  borderLeft: `6px solid ${bet.side === GALLO.A ? '#ef4444' : '#22c55e'}`,
                  fontSize: isMiniVersion ? '0.85rem' : '1rem'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">
                      <span className={bet.side === GALLO.A ? 'text-danger-soft' : 'text-success-soft'}>
                        {bet.picked_gallo}
                      </span>
                      <span className="mx-1 font-normal text-white/45">({bet.odd_type})</span>
                      <span className="mx-1 text-white/45">en Ronda #{bet.round_number}</span>
                    </div>
                    <small className="block text-white/45">
                      {bet.gallo_a} <span className="mx-1 text-gold-300">vs</span> {bet.gallo_b}
                    </small>
                    <div className="mt-1 text-xs text-white/35">
                      <i className="bi bi-calendar-event me-1"></i>{bet.event_name}
                      <span className="mx-2">|</span>
                      <i className="bi bi-clock me-1"></i>{moment(bet.created_at).format('LLL')}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="mb-1 font-bold text-white">
                      {currency}{Number(bet.amount).toLocaleString()}
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-black uppercase ${
                      bet.paid === BETS.PAID ? 'bg-success-soft/15 text-success-soft' :
                      bet.paid === BETS.LOST ? 'bg-danger-soft/15 text-danger-soft' :
                      bet.paid === BETS.REFUNDED ? 'bg-info-soft/15 text-info-soft' :
                      'bg-white/10 text-white/55'
                    }`}>
                      {BETS_PREVIEW[bet.paid] || bet.paid}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/25 py-10 text-center text-sm text-white/45">
            No se encontraron apuestas
          </div>
        )}
      </div>
    </div>
  );
};

export default BetHistory;
