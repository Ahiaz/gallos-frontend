/*
Componente: LiveEvent.jsx
Descripción: Componente que muestra el evento en vivo para los clientes
Autor: Jose Ahias Vargas
*/

import BetButton from "../Bets/BetButton";
import Player from "../../Streaming/Player";
import FightScoreBoard from "../Fight/FightScoreBoard";
import BetModalContainer from "../../../containers/client/Bets/BetModalContainer";
import { FIGHT } from "../../../constants/fightConstants";

const LiveEvent = ({
  componentLoading,
  event,
  fight,
  scoreBoard,
  amountParams,
  setAmountParams,
  bettingParams,
  poolTotals,
  openBet,
  setOpenBet
}) => {

  if (componentLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-black animate__animated animate__fadeIn">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-black animate__animated animate__fadeIn">
        <span style={{ fontSize: '3rem' }}>🐓</span>
        <h4 className="text-lg font-black text-white">No hay eventos en vivo</h4>
        <p className="text-sm text-white/45">Vuelve pronto para ver la próxima transmisión.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[92%] mx-auto flex flex-1 flex-col gap-4 animate__animated animate__fadeIn lg:flex-row py-8">

      {/* ──── IZQUIERDA: Video + Marcador ──── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Sección del video */}
        <div className="relative w-full">
          <Player
            streamUrl={event.stream_url}
            status={event.status}
            bannerUrl={event.banner}
          />
          {fight?.status === FIGHT.OPEN && (
            <BetButton onClick={() => setOpenBet(true)} />
          )}
        </div>

        {/* Marcador */}
        <div className="bg-[#0a0a0a] p-3 sm:p-4">
          {scoreBoard ? (
            <FightScoreBoard
              fightNumber={scoreBoard.fightNumber}
              eventName={scoreBoard.eventName}
              roundNumber={scoreBoard.roundNumber}
              redCorner={scoreBoard.redCorner}
              greenCorner={scoreBoard.greenCorner}
              eventType={scoreBoard.eventType}
              favoriteSide={scoreBoard.favoriteSide}
              totalRounds={event.gallos_amount}
            />
          ) : (
            <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-white/10">
              <p className="text-xs text-white/30">Sin información de marcadores</p>
            </div>
          )}
        </div>
      </div>


      {/* Modal de apuesta */}
      {openBet && fight?.status === FIGHT.OPEN && (
        <BetModalContainer
          currentFight={fight}
          amountParams={amountParams}
          bettingParams={bettingParams}
          poolTotals={poolTotals}
          setAmountParams={setAmountParams}
          onClose={() => setOpenBet(false)}
        />
      )}
    </div>
  );
};

export default LiveEvent;
