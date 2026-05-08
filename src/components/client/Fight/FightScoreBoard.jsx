/*
Componente: FightScoreBoard.jsx
Descripción: Marcador de puntuación con celdas de puntos por ronda
*/
import { EVENT_TYPE } from "../../../constants/eventConstants";
import { GALLO } from "../../../constants/galloConstants";

const FightScoreBoard = ({
  fightNumber,
  eventName,
  roundNumber,
  redCorner,
  greenCorner,
  eventType,
  favoriteSide,
  totalRounds = 0,
}) => {
  const isDerby = eventType === EVENT_TYPE.DERBY;
  const isLibre = eventType === EVENT_TYPE.LIBRE;
  const eventTypeLabel = isDerby ? "Derby" : "Libre";

  const renderScoreGrid = (points = [], side) => {
    if (!isDerby) return null;

    const isRed = side === GALLO.A;

    return (
      <div className={`flex flex-wrap gap-1 ${isRed ? "justify-start sm:justify-end" : "justify-start"}`}>
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`flex h-6 w-7 items-center justify-center border text-[0.65rem] font-black transition-all sm:h-7 sm:w-8 ${
              points[i] !== undefined
                ? isRed
                  ? "border-red-950/70 bg-red-600 text-white shadow-[0_0_14px_rgba(220,38,38,0.28)]"
                  : "border-emerald-950/70 bg-emerald-500 text-white shadow-[0_0_14px_rgba(16,185,129,0.24)]"
                : "border-white/6 bg-zinc-900/55 text-white/20"
            }`}
          >
            {points[i] !== undefined ? points[i] : ""}
          </div>
        ))}
      </div>
    );
  };

  const renderWeight = (weight) => {
    if (!isLibre) return null;

    return (
      <div className="inline-flex items-center gap-1 rounded-md border border-gold-400/25 bg-gold-400/10 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-gold-300">
        <i className="bi bi-scale" /> {weight || "0.00"} Lbs
      </div>
    );
  };

  const renderCornerStatus = (side, weight) => {
    const isFavorite = favoriteSide === side;

    if (!isFavorite && !isLibre) return null;

    return (
      <div className={`mt-2 flex flex-wrap items-center gap-2 ${side === GALLO.A ? "justify-start sm:justify-end" : "justify-start"}`}>
        {isFavorite && (
          <span className="inline-flex items-center gap-1 rounded-full border border-gold-400/30 bg-gold-400/10 px-2 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em] text-gold-300">
            <i className="bi bi-star-fill text-[0.6rem]" />
            Favorito
          </span>
        )}
        {renderWeight(weight)}
      </div>
    );
  };

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="flex flex-wrap items-center gap-1 pb-1 sm:flex-nowrap">
        <div className="flex h-8 items-center bg-zinc-100 px-3 text-[0.65rem] font-black uppercase tracking-[0.18em] text-black [clip-path:polygon(0_0,100%_0,92%_100%,0_100%)] sm:px-4">
          <span className="pr-4">Pelea {fightNumber}</span>
        </div>

        <div className="flex h-8 min-w-0 flex-1 items-center border border-white/10 bg-zinc-800/90 px-4 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/72 [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)] sm:px-6 text-center">
          <span className="truncate w-full">
            {eventName} <span className="mx-2 text-white">|</span> {eventTypeLabel}
          </span>
        </div>

        <div className="flex h-8 items-center bg-emerald-500 px-3 text-[0.65rem] font-black uppercase tracking-[0.18em] text-black [clip-path:polygon(8px_0,100%_0,100%_100%,0_100%)] sm:px-4">
          <span className="pl-2">Ronda {roundNumber}</span>
        </div>
      </div>

      <div className="relative overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(24,24,27,0.96)_0%,rgba(9,9,11,0.99)_100%)] shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(circle_at_left,rgba(220,38,38,0.12),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(16,185,129,0.12),transparent_70%)]" />

        <div className="relative grid min-h-[5.5rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          <div className="flex min-w-0 items-center justify-end gap-3 px-3 py-4 sm:gap-4 sm:px-6">
            <div className="min-w-0 text-right">
              <div className="flex items-center justify-end gap-2">
                <h2 className="truncate text-base font-black uppercase italic leading-none tracking-[-0.04em] text-white sm:text-2xl">
                  {redCorner?.name}
                </h2>
                <span className="h-8 w-1.5 flex-shrink-0 bg-red-600 shadow-[0_0_14px_rgba(220,38,38,0.45)] sm:h-10 sm:w-2" />
              </div>
              {renderCornerStatus(GALLO.A, redCorner?.weight)}
            </div>

            <span
              className="text-4xl font-black leading-none text-white tabular-nums sm:text-6xl"
              style={{ textShadow: "0 0 24px rgba(220,38,38,0.35)" }}
            >
              {redCorner?.score}
            </span>
          </div>

          <div className="flex h-full items-center justify-center self-stretch border-x-4 border-emerald-500 bg-zinc-100 px-2 sm:px-4">
            <span className="text-base font-black uppercase text-black sm:text-2xl">VS</span>
          </div>

          <div className="flex min-w-0 items-center justify-start gap-3 px-3 py-4 sm:gap-4 sm:px-6">
            <span
              className="text-4xl font-black leading-none text-white tabular-nums sm:text-6xl"
              style={{ textShadow: "0 0 24px rgba(16,185,129,0.35)" }}
            >
              {greenCorner?.score}
            </span>

            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <span className="h-8 w-1.5 flex-shrink-0 bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.45)] sm:h-10 sm:w-2" />
                <h2 className="truncate text-base font-black uppercase italic leading-none tracking-[-0.04em] text-white sm:text-2xl">
                  {greenCorner?.name}
                </h2>
              </div>
              {renderCornerStatus(GALLO.B, greenCorner?.weight)}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-zinc-800 to-emerald-500" />
      </div>

      {isDerby && (
        <div className="flex flex-col justify-between gap-3 bg-zinc-950/70 px-2 py-2 sm:flex-row sm:items-center sm:gap-6 sm:px-3">
          <div className="flex items-center justify-between gap-2 sm:flex-1 sm:justify-start">
            <span className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-zinc-500">Puntos</span>
            {renderScoreGrid(redCorner?.roundPoints, GALLO.A)}
          </div>

          <div className="flex items-center justify-between gap-2 sm:flex-1 sm:justify-end">
            {renderScoreGrid(greenCorner?.roundPoints, GALLO.B)}
            <span className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-zinc-500">Puntos</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FightScoreBoard;
