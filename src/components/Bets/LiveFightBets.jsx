/*
Componente: LiveFightBets.jsx
Descripción: Monitor anclado al bottom (Sticky/Fixed) con CSS Modules.
Autor: Jose Ahias Vargas Pacheco
*/
import { useMemo } from "react";
import { useSecurity } from "../../hooks/useSecurity";
import moment from "moment";
import { GALLO } from "../../constants/galloConstants";
import { SIDE, SIDE_PREVIEW } from "../../constants/sideConstants";
import styles from './styles/LiveFightBets.module.css';
import chatStyles from '../Chat/styles/Chat.module.css'
import { useChat } from "../../hooks/useChat";
import ChatSidebar from "../Chat/ChatSidebar";

const LiveFightBets = ({ bets = [], stats = {}, loading = false, open = false, setOpen, isAdmin = false }) => {
  const { currency } = useSecurity();
  const { toggleChat, chatOpen } = useChat();

  const balance = useMemo(() => {
    const a = Number(stats?.money_side_a || 0);
    const b = Number(stats?.money_side_b || 0);
    const total = a + b;
    if (total === 0) return { pA: 50, pB: 50, total: 0 };
    return { pA: (a / total) * 100, pB: (b / total) * 100, total };
  }, [stats]);

  return (
    <div className={`${styles.monitorWrapper} animate__animated animate__fadeIn`}>


      <ChatSidebar
        chatOpen={chatOpen}
        onToggle={() => toggleChat(!chatOpen)}
      />

      <div className="container-fluid">
        <div className={`${styles.monitorCard} overflow-hidden`}>
          {/* CABECERA */}
          <div
            className={`${styles.customHeader} flex cursor-pointer select-none items-center justify-between border-0 p-3`}
            onClick={setOpen}
          >
            <div className="flex items-center">
              <div className={`spinner-grow spinner-grow-sm ${loading ? 'text-warning' : 'text-success'} me-2`}></div>
              <h6 className="mb-0 font-bold uppercase tracking-wider text-white">
                Monitor en Vivo {stats?.active_round_number != null && `- Ronda #${stats.active_round_number}`}
              </h6>
            </div>
            <div className="flex items-center gap-3">


              <div onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={toggleChat}
                  className={`${chatStyles.chatToggleButton} flex items-center px-3 py-1.5`}
                >
                  <i className="bi bi-chat-dots-fill mr-1.5"></i>
                  <span className="hidden md:inline">CHAT</span>
                </button>
              </div>

              <i className={`bi bi-chevron-${open ? 'down' : 'up'} text-white/50`}></i>


            </div>
          </div>

          {/* CUERPO COLAPSABLE */}
          <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[600px]' : 'max-h-0'}`}>
            <div className="border-t border-white/10 bg-black/50 p-3 pb-0">
              {/* PROGRESS BAR */}
              <div className="mb-4">
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span className="text-danger-soft">{SIDE_PREVIEW.RED}: {currency}{Number(stats?.money_side_a || 0).toLocaleString()}</span>
                  <span className="text-success-soft">{SIDE_PREVIEW.GREEN}: {currency}{Number(stats?.money_side_b || 0).toLocaleString()}</span>
                </div>
                <div className="relative h-5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute left-0 top-0 flex h-full items-center justify-center rounded-l-full bg-danger-soft text-xs font-bold text-white"
                    style={{ width: `${balance.pA}%` }}
                  >
                    {balance.pA > 10 && `${balance.pA.toFixed(0)}%`}
                  </div>
                  <div
                    className="absolute right-0 top-0 flex h-full items-center justify-center rounded-r-full bg-success-soft text-xs font-bold text-black"
                    style={{ width: `${balance.pB}%` }}
                  >
                    {balance.pB > 10 && `${balance.pB.toFixed(0)}%`}
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className={`mb-3 grid gap-2 text-center ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <div className="rounded-lg bg-white/10 p-2">
                  <small className="block text-[0.65rem] uppercase text-white/45">En Juego (Ronda)</small>
                  <span className="font-bold text-info-soft">{currency}{Number(balance.total).toLocaleString()}</span>
                </div>
                <div className="rounded-lg bg-white/10 p-2">
                  <small className="block text-[0.65rem] uppercase text-white/45">Volumen Total Pelea</small>
                  <span className="font-bold text-gold-300">{currency}{Number(stats?.totalVolume || 0).toLocaleString()}</span>
                </div>
                {isAdmin && (
                  <div className="rounded-lg border border-success-soft/25 bg-success-soft/10 p-2">
                    <small className="block text-[0.65rem] font-bold uppercase text-success-soft">Profit Est. (10%)</small>
                    <span className="font-bold text-success-soft">{currency}{Number(stats?.houseProfit || 0).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* TABLA */}
            <div className={styles.tableContainer}>
              <table className="min-w-full border-collapse" style={{ fontSize: '0.8rem' }}>
                <thead className="sticky top-0 z-10 border-b border-white/10 bg-black/80 text-[0.7rem] uppercase text-white/45">
                  <tr>
                    <th className="px-3 py-2 text-left">Hora</th>
                    <th className="px-3 py-2 text-left">Usuario</th>
                    <th className="px-3 py-2 text-left">Ronda</th>
                    <th className="px-3 py-2 text-left">Tipo</th>
                    <th className="px-3 py-2 text-left">Lado</th>
                    <th className="px-3 py-2 text-center">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {loading && bets.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center">
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-danger-soft"></div>
                      </td>
                    </tr>
                  ) : bets.length > 0 ? (
                    bets.map(bet => (
                      <tr key={bet.id} className="animate__animated animate__fadeInDown text-white/80 transition hover:bg-white/[0.04]">
                        <td className="px-3 py-1.5 text-white/55">{moment(bet.created_at).format('HH:mm:ss')}</td>
                        <td className="px-3 py-1.5 font-bold">
                          <div className="max-w-[120px] truncate text-white" title={bet.username}>{bet.username}</div>
                        </td>
                        <td className="px-3 py-1.5">
                          <span className="rounded-full border border-info-soft/25 bg-black/60 px-2 py-0.5 text-[0.65rem] text-info-soft">
                            <span className="mr-0.5 text-info-soft/60">R-</span>{bet.round_number}
                          </span>
                        </td>
                        <td className="px-3 py-1.5">
                          <span className="rounded-full border border-info-soft/25 bg-black/60 px-2 py-0.5 text-[0.65rem] text-info-soft">
                            {bet.odd_type}
                          </span>
                        </td>
                        <td className="px-3 py-1.5">
                          <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-black ${bet.side === GALLO.A ? 'bg-danger-soft/15 text-danger-soft' : 'bg-success-soft/15 text-success-soft'
                            }`}>
                            {bet.side === GALLO.A ? SIDE_PREVIEW.RED : SIDE_PREVIEW.GREEN}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-center font-bold text-info-soft">
                          {currency}{Number(bet.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center italic text-white/35">Esperando apuestas...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFightBets;
