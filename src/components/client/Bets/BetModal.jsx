/*
Componente: BetModal.jsx
Descripción: Modal para realizar apuestas - estilo unificado con el sistema
Autor: Jose Ahias Vargas
*/

import { useMemo, useState } from "react";
import { SIDE, SIDE_PREVIEW } from "../../../constants/sideConstants";
import LoadingButton from "../../common/LoadingButton";
import { GALLO } from "../../../constants/galloConstants";
import { SYSTEM } from "../../../constants/systemConstants";
import { useSecurity } from "../../../hooks/useSecurity";
import BetHistoryContainer from "../../../containers/client/Bets/BetHistoryContainer";

const BetModal = ({
  isLoading,
  userAmounts,
  bettingParams,
  poolTotals,
  currentFight,
  showHistory,
  setShowHistory,
  onSubmit,
  onClose,
}) => {
  const { currency } = useSecurity();
  const [selectedBet, setSelectedBet] = useState(null);
  const [amount, setAmount] = useState("");

  const favoriteName = poolTotals?.favorite?.name;
  const favoriteSide = poolTotals?.favorite?.side;

  const limits = useMemo(() => ({
    min: bettingParams[SYSTEM.KEY.BET_MIN] ? Number(bettingParams[SYSTEM.KEY.BET_MIN]) : 50,
    max: bettingParams[SYSTEM.KEY.BET_MAX] ? Number(bettingParams[SYSTEM.KEY.BET_MAX]) : 10000,
  }), [bettingParams]);

  const playingTotal = useMemo(() => {
    const red   = (poolTotals?.red   || []).reduce((a, i) => a + i.value, 0);
    const green = (poolTotals?.green || []).reduce((a, i) => a + i.value, 0);
    return red + green;
  }, [poolTotals]);

  const handleAmountClick = (value) => setAmount(value);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === "") { setAmount(""); return; }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num <= limits.max) setAmount(num.toString());
  };

  const blockInvalidChars = (e) => {
    if (['.', ',', 'e', 'E', '-', '+'].includes(e.key)) e.preventDefault();
  };

  const canBet =
    selectedBet &&
    amount &&
    Number(amount) >= limits.min &&
    Number(amount) <= limits.max &&
    Number.isInteger(Number(amount));

  const submitCls = !canBet
    ? 'border-white/10 bg-white/[0.06] text-white/30 cursor-not-allowed'
    : selectedBet?.side === GALLO.A
      ? 'border-red-500/40 bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:brightness-110'
      : 'border-green-500/40 bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:brightness-110';

  const renderSideColumn = (side, mechanics) => {
    const isRed = side === GALLO.A;

    const headerCls = isRed
      ? 'border-red-500/30 bg-red-600/15 text-red-400'
      : 'border-green-500/30 bg-green-600/15 text-green-400';

    const activeCls = isRed
      ? 'border-red-400/60 bg-red-500/15 text-white'
      : 'border-green-400/60 bg-green-500/15 text-white';

    const iconCls = isRed ? 'text-red-400' : 'text-green-400';

    return (
      <div className="flex flex-1 flex-col gap-2">
        {/* Cabecera lado */}
        <div className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-widest ${headerCls}`}>
          <span className={`h-2 w-2 rounded-full ${isRed ? 'bg-red-500' : 'bg-green-500'}`} />
          {isRed ? SIDE_PREVIEW.RED : SIDE_PREVIEW.GREEN}
        </div>

        {/* Opciones */}
        {(!mechanics || mechanics.length === 0) ? (
          <p className="py-6 text-center text-xs text-white/30">Sin datos</p>
        ) : (
          mechanics.map((item) => {
            const isSelected = selectedBet?.side === side && selectedBet?.mechanic === item.id;
            return (
              <button
                key={`${side}-${item.id}`}
                onClick={() => setSelectedBet({ side, mechanic: item.id })}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition active:scale-[0.98] ${
                  isSelected
                    ? activeCls
                    : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={isSelected ? iconCls : 'text-white/40'}>{item.icon}</span>
                  <span className="font-bold">{item.text}</span>
                </div>
                <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-white/35'}`}>
                  {currency}{item.value.toLocaleString()}
                </span>
              </button>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center animate__animated animate__fadeIn">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-brand-900 shadow-[0_-10px_60px_rgba(0,0,0,0.7)] sm:mx-4 sm:rounded-2xl sm:shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate__animated animate__fadeInUp animate__faster max-h-[92vh] sm:max-h-[85vh]">

        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 bg-brand-950 px-5 py-3.5">
          <div>
            <p className="text-[0.58rem] uppercase tracking-[0.2em] text-white/35">
              Pelea #{currentFight?.number}
            </p>
            <h5 className="mb-0 text-sm font-black uppercase tracking-wide text-white">
              {currentFight?.gallo_a}
              <span className="mx-2 text-gold-300">vs</span>
              {currentFight?.gallo_b}
            </h5>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
          >
            <i className="bi bi-x-lg text-xs" />
          </button>
        </div>

        {/* Cuerpo — dos columnas en sm+, una en móvil */}
        <div className="flex flex-1 flex-col divide-y divide-white/10 overflow-y-auto sm:flex-row sm:divide-x sm:divide-y-0 sm:overflow-hidden">

          {/* ── COLUMNA IZQUIERDA: selección de apuesta ── */}
          <div className="flex flex-col gap-3 p-4 sm:w-1/2 sm:overflow-y-auto">
            <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/40">
              1. Seleccione su apuesta
            </p>
            <div className="flex gap-3">
              {renderSideColumn(GALLO.A, poolTotals?.red)}
              {renderSideColumn(GALLO.B, poolTotals?.green)}
            </div>
          </div>

          {/* ── COLUMNA DERECHA: stats + monto + botón ── */}
          <div className="flex flex-col gap-3 p-4 sm:w-1/2 sm:overflow-y-auto">

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-center">
                <p className="text-[0.55rem] uppercase tracking-widest text-white/35">Total jugando</p>
                <p className="text-sm font-black text-gold-300">{currency}{playingTotal.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-center">
                <p className="text-[0.55rem] uppercase tracking-widest text-white/35">Favorito</p>
                <p className={`text-sm font-black ${favoriteSide === GALLO.A ? 'text-red-400' : 'text-green-400'}`}>
                  ⭐ {favoriteName || 'Ninguno'}
                </p>
              </div>
            </div>

            {/* Monto */}
            <div>
              <p className="mb-2 text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/40">
                2. Monto de la apuesta
              </p>

              {/* Montos rápidos */}
              <div className="mb-2 grid grid-cols-3 gap-1.5">
                {userAmounts?.map((data) => {
                  const isActive = Number(amount) === data.amount;
                  return (
                    <button
                      key={data.order_index}
                      onClick={() => handleAmountClick(data.amount)}
                      className={`rounded-lg border py-2 text-xs font-black transition active:scale-95 ${
                        isActive
                          ? 'border-gold-400/60 bg-gold-400/15 text-gold-300'
                          : 'border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:bg-white/[0.08]'
                      }`}
                    >
                      {currency}{data.amount.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              {/* Input manual */}
              <input
                type="number"
                placeholder="DIGITAR MONTO"
                value={amount}
                onKeyDown={blockInvalidChars}
                onChange={handleAmountChange}
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-center text-sm font-black text-white placeholder:text-white/25 focus:border-gold-400/50 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <p className="mt-1 text-center text-[0.58rem] text-white/30">
                Mín. {currency}{limits.min.toLocaleString()} — Máx. {currency}{limits.max.toLocaleString()}
              </p>
            </div>

            {/* Botón apostar (solo visible en sm+, en móvil va al footer) */}
            <div className="hidden sm:block">
              <LoadingButton
                id="betSubmitDesktop"
                type="button"
                className={`w-full rounded-xl border py-3.5 text-sm font-black uppercase tracking-[0.14em] transition active:scale-[0.98] ${submitCls}`}
                loadingText={selectedBet ? `Apostando ${selectedBet.mechanic?.toUpperCase()}…` : ''}
                onClick={() => { if (canBet) onSubmit(amount, selectedBet.side, selectedBet.mechanic.toUpperCase()); }}
                isLoading={isLoading}
                disabled={!canBet}
              >
                {selectedBet ? `APOSTAR ${selectedBet.mechanic.toUpperCase()}` : 'SELECCIONE UNA OPCIÓN'}
              </LoadingButton>
            </div>
          </div>
        </div>

        {/* Footer: botón móvil + historial (span completo) */}
        <div className="flex-shrink-0 space-y-2 border-t border-white/10 bg-brand-950 p-4">

          {/* Botón en móvil */}
          <div className="sm:hidden">
            <LoadingButton
              id="betSubmitMobile"
              type="button"
              className={`w-full rounded-xl border py-3.5 text-sm font-black uppercase tracking-[0.14em] transition active:scale-[0.98] ${submitCls}`}
              loadingText={selectedBet ? `Apostando ${selectedBet.mechanic?.toUpperCase()}…` : ''}
              onClick={() => { if (canBet) onSubmit(amount, selectedBet.side, selectedBet.mechanic.toUpperCase()); }}
              isLoading={isLoading}
              disabled={!canBet}
            >
              {selectedBet ? `APOSTAR ${selectedBet.mechanic.toUpperCase()}` : 'SELECCIONE UNA OPCIÓN'}
            </LoadingButton>
          </div>

          {/* Toggle historial */}
          {currentFight && (
            <div>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-bold text-white/45 transition hover:bg-white/[0.08]"
                onClick={() => setShowHistory(!showHistory)}
              >
                <i className={`bi bi-chevron-${showHistory ? 'up' : 'down'}`} />
                {showHistory ? 'Ocultar mis apuestas' : 'Ver mis apuestas de la pelea'}
              </button>
              {showHistory && (
                <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-black/30">
                  <BetHistoryContainer fightId={currentFight?.id} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetModal;
