/*
Componente: FightManager.jsx
Descripción: Controla apertura, cierre y resolución de peleas
Autor: Jose Ahias Vargas
*/

import { useState, useEffect } from "react";
import LoadingButton from "../../common/LoadingButton";
import { GALLO } from "../../../constants/galloConstants";
import { FIGHT, FIGHT_PREVIEW } from "../../../constants/fightConstants";
import { ROUND } from "../../../constants/roundConstants";

const FightManager = ({ fight, currentRound, loading, onOpen, onProgress, onResolve, onCancel }) => {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);


  /*UseEffect
  setea informacion si viene el round
  esto por si utilizan el componente para visualizar alguna pelea
  Autor: Jose Ahias Vargas Pacheco
  */
  useEffect(() => {
    if (fight) {
      setScoreA(fight.score_a || 0);
      setScoreB(fight.score_b || 0);
    }
  }, [fight]);

  if (!fight) {
    return (
      <div className="bg-black/25 p-6 text-center text-white/55">
        No hay pelea en curso
      </div>
    );
  }


  const handleScoreAChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setScoreA("");
    } else {
      setScoreA(Number(value));
    }
  };

  const handleScoreBChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setScoreB("");
    } else {
      setScoreB(Number(value));
    }
  };

  const statusClasses = {
    [FIGHT.OPEN]: "border-info-soft/30 bg-info-soft/10 text-info-soft",
    [FIGHT.IN_PROGRESS]: "border-success-soft/30 bg-success-soft/10 text-success-soft",
    [FIGHT.RESOLVED]: "border-danger-soft/30 bg-danger-soft/10 text-danger-soft",
    [FIGHT.CANCELLED]: "border-white/15 bg-white/[0.06] text-white/55",
    [FIGHT.PENDING]: "border-gold-400/30 bg-gold-400/10 text-gold-300",
  };


  return (
    <div className="animate__animated animate__fadeIn">
      <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">

        {/* COLUMNA 1: Info de la pelea */}
        <section className="bg-black/25 p-3 text-center">
          <div className="py-1">
            <h5 className="mb-1.5 text-[0.58rem] font-black uppercase tracking-[0.16em] text-white/42">Estado Actual</h5>
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.08em] ${statusClasses[fight.status] || statusClasses[FIGHT.PENDING]}`}>
              {FIGHT_PREVIEW[fight.status] || fight.status}
            </span>
          </div>

          <div className="mt-3 bg-black/25 p-3">
            <h6 className="mb-2 pb-1.5 text-[0.58rem] font-black uppercase tracking-[0.14em] text-white/45">Pelea Actual</h6>
            <p className="mb-0 flex flex-col items-center justify-center gap-1.5 text-xs font-black uppercase text-white sm:flex-row">
              <strong className="text-danger-soft">{fight?.gallo_a || GALLO.A}</strong>
              <span className="text-white/35">VS</span>
              <strong className="text-success-soft">{fight?.gallo_b || GALLO.B}</strong>
            </p>
          </div>

          {fight.status === FIGHT.RESOLVED && (
            <div className="mt-2.5  border border-success-soft/25 bg-success-soft/10 p-2.5 text-success-soft">
              <p className="mb-0 text-[0.58rem] font-black uppercase tracking-[0.14em]">Puntaje Final</p>
              <p className="mb-0 text-xl font-black">{fight.score_a} - {fight.score_b}</p>
            </div>
          )}
        </section>

        {/* COLUMNA 2: Acciones */}
        <section className="bg-white/[0.04] p-3">

          {/* ESTADO PENDING */}
          {fight.status === FIGHT.PENDING && (currentRound.status == ROUND.LIVE || currentRound.status == ROUND.PENDING) && (
            <div>
              <p className="mb-3 text-center text-xs text-white/55">
                Al abrir la pelea, se habilitarán las apuestas de la pelea actual.
              </p>
              <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                <LoadingButton
                  id="openFightBtn"
                  className="! !border-0 !bg-info-soft !px-4 !py-2 !text-xs !font-black !text-white"
                  onClick={onOpen}
                  loadingText=" Abriendo..."
                  isLoading={loading}
                >
                  <i className="bi bi-cash-coin me-1 !text-current"></i> Abrir Pelea #{fight.number}
                </LoadingButton>
                <LoadingButton
                  id="cancelFightBtnPending"
                  className="! !border !border-white/12 !bg-white/[0.08] !px-4 !py-2 !text-xs !font-black !text-white/78"
                  onClick={onCancel}
                  loadingText=" Cancelando..."
                  isLoading={loading}
                >
                  <i className="bi bi-x-octagon me-1 !text-current"></i> Cancelar Pelea
                </LoadingButton>
              </div>
            </div>
          )}

          {/* ESTADO OPEN */}
          {fight.status === FIGHT.OPEN && (
            <div>
              <p className="mb-3 text-center text-xs text-white/55">
                Al iniciar la pelea, se cerrarán las apuestas de la pelea actual.
              </p>
              <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                <LoadingButton
                  id="startFightBtn"
                  className="! !border-0 !bg-success-soft !px-4 !py-2 !text-xs !font-black !text-black"
                  onClick={onProgress}
                  loadingText=" Iniciando..."
                  isLoading={loading}
                >
                  <i className="bi bi-piggy-bank-fill me-1 !text-current"></i> Iniciar Pelea #{fight.number}
                </LoadingButton>
                <LoadingButton
                  id="cancelFightBtnOpen"
                  className="! !border !border-white/12 !bg-white/[0.08] !px-4 !py-2 !text-xs !font-black !text-white/78"
                  onClick={onCancel}
                  loadingText=" Cancelando..."
                  isLoading={loading}
                >
                  <i className="bi bi-x-octagon me-1 !text-current"></i> Cancelar Pelea
                </LoadingButton>
              </div>
            </div>
          )}

          {/* ESTADO IN_PROGRESS */}
          {fight.status === FIGHT.IN_PROGRESS && (
            <div className="py-1">
              <p className="mb-2.5 text-center text-[0.6rem] font-black uppercase tracking-[0.14em] text-white/45">Cierre y Calificación</p>

              <div className="mx-auto max-w-[360px]">
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block truncate text-xs font-black uppercase tracking-[0.08em] text-danger-soft" title={fight?.gallo_a || '#1'}>
                      Puntos {fight?.gallo_a}
                    </label>
                    <input
                      type="number"
                      value={scoreA}
                      min="0"
                      onChange={handleScoreAChange}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-2 py-1.5 text-center text-sm text-white focus:border-gold-400/70 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block truncate text-xs font-black uppercase tracking-[0.08em] text-success-soft" title={fight?.gallo_b || '#2'}>
                      Puntos {fight?.gallo_b}
                    </label>
                    <input
                      type="number"
                      value={scoreB}
                      min="0"
                      onChange={handleScoreBChange}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-2 py-1.5 text-center text-sm text-white focus:border-gold-400/70 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mx-auto flex max-w-[420px] flex-col justify-center gap-2 px-3 sm:flex-row">
                <LoadingButton
                  id="resolveFightBtn"
                  className="!w-full ! !border-0 !bg-[linear-gradient(180deg,#f4d77c,#b8860b)] !px-4 !py-2 !text-xs !font-black !text-black"
                  onClick={() => onResolve(scoreA, scoreB)}
                  loadingText=" Resolviendo..."
                  isLoading={loading}
                >
                  <i className="bi bi-flag-fill me-1 !text-current"></i> Resolver Pelea
                </LoadingButton>
                <LoadingButton
                  id="cancelFightBtn"
                  className="!w-full ! !border !border-white/12 !bg-white/[0.08] !px-4 !py-2 !text-xs !font-black !text-white/78"
                  onClick={onCancel}
                  loadingText=" Cancelando..."
                  isLoading={loading}
                >
                  <i className="bi bi-x-octagon me-1 !text-current"></i> Cancelar Pelea
                </LoadingButton>
              </div>

              <p className="mt-2.5 text-center text-xs text-white/45">
                * Esto cerrará las apuestas de la pelea y distribuirá los premios.
              </p>
            </div>
          )}

          {/* ESTADOS FINALES */}
          {(fight.status === FIGHT.RESOLVED || fight.status === FIGHT.CANCELLED) && (
            <div className="py-4 text-center">
              <p className="mb-0 text-xs text-white/48">
                Esta pelea ya ha sido procesada y no permite más cambios.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FightManager;
