/*
Componente: RoundManager.jsx
Descripción: Panel de control estilizado para gestión de rondas y emparejamientos.
*/

import { useState } from "react";
import LoadingButton from "../../common/LoadingButton";
import { useNavigate } from "react-router-dom";
import { EVENT, EVENT_PREVIEW, EVENT_TYPE } from "../../../constants/eventConstants";
import { ROUND, ROUND_PREVIEW } from "../../../constants/roundConstants";
import MatchMakingContainer from "../../../containers/admin/Rounds/MatchMakingContainer";

const RoundManager = ({
    round,
    currentEvent,
    loading,
    eventGalleries = [],
    fightsInRound = [],
    activity = null,
    onAddGallery,
    onRemoveGallery,
    onSaveMatchmaking,
    onStart,
    onFinish,
    onCancel,
    showEventBtn = false
}) => {
    const navigate = useNavigate();
    const [newGalleryName, setNewGalleryName] = useState("");
    const isLocked = activity?.isLocked;
    const hasBets = activity?.roundHasBets;

    const canEnroll = (!isLocked && currentEvent.type === EVENT_TYPE.DERBY || !hasBets && currentEvent.type === EVENT_TYPE.LIBRE);

    if (!round) {
        return (
            <div className="bg-black/25 p-8 text-center text-white/55">
                <i className="bi bi-layers mb-3 block text-4xl !text-white/35"></i>
                <h5 className="mb-1 font-bold text-white/75">Gestión de Ronda</h5>
                <p className="mb-0 text-sm">Seleccione una ronda del listado para comenzar el pareo.</p>
            </div>
        );
    }

    const roundStatusClasses = {
        [ROUND.LIVE]:      "border-success-soft/30 bg-success-soft/10 text-success-soft",
        [ROUND.FINISHED]:  "border-danger-soft/30 bg-danger-soft/10 text-danger-soft",
        [ROUND.CANCELLED]: "border-white/15 bg-white/[0.06] text-white/55",
        [ROUND.PENDING]:   "border-gold-400/30 bg-gold-400/10 text-gold-300",
    };

    return (
        <div className="animate__animated animate__fadeIn space-y-2.5">

            {/* Header: event name + type + round status */}
            <div className="flex items-start justify-between gap-2  border-white/10 pb-2.5">
                <div className="min-w-0">
                    <p className="mb-0 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white/35">Evento {EVENT_PREVIEW[currentEvent.status]}</p>
                    <h5 className="mb-0 truncate text-sm font-bold text-white">{currentEvent.name}</h5>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                    <span className="rounded-full border border-gold-400/25 bg-gold-400/10 px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-[0.06em] text-gold-300">
                        {currentEvent.type}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-[0.06em] ${roundStatusClasses[round.status] || roundStatusClasses[ROUND.PENDING]}`}>
                        {ROUND_PREVIEW[round.status]}
                    </span>
                </div>
            </div>

            {/* Body: galleries + matchmaking/live/finished */}
            <div className="grid gap-3 lg:grid-cols-[0.78fr_1.22fr]">

                {/* LEFT: Gallerías Inscritas */}
                <aside className="bg-black/40 p-3">
                    <h6 className="mb-2 flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white/70">
                        <i className="bi bi-people-fill !text-info-soft"></i>
                        Gallerías Inscritas
                    </h6>

                    {canEnroll && (currentEvent.status !== EVENT.FINISHED) && (round.status !== ROUND.FINISHED) && (round.status !== ROUND.CANCELLED) ? (
                        <div className="mb-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nueva Gallería..."
                                    value={newGalleryName}
                                    onChange={(e) => setNewGalleryName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (onAddGallery(newGalleryName), setNewGalleryName(""))}
                                    className="flex-1 rounded-lg border border-white/10 bg-white/[0.08] px-3 py-1.5 text-sm text-white placeholder:text-white/35 focus:border-gold-400/70 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    className="!border-0 !bg-info-soft !px-3 !text-white transition hover:!brightness-110 disabled:!opacity-45"
                                    onClick={() => { onAddGallery(newGalleryName); setNewGalleryName(""); }}
                                    disabled={!newGalleryName.trim()}
                                >
                                    <i className="bi bi-plus-lg !text-current"></i>
                                </button>
                            </div>
                            <small className="mt-1 block text-[0.6rem] text-white/42">Presione Enter para agregar</small>
                        </div>
                    ) : (
                        <div className="mb-2  border border-info-soft/25 bg-info-soft/10 px-2.5 py-1.5 text-xs text-info-soft">
                            <i className="bi bi-info-circle-fill me-2 !text-current"></i>
                            Inscripciones cerradas para esta ronda.
                        </div>
                    )}

                    <div className="max-h-[200px] overflow-auto bg-black/25">
                        {eventGalleries.length > 0 ? (
                            eventGalleries.map(g => (
                                <div key={g.id} className="flex items-center justify-between gap-3  border-b border-white/10 px-2.5 py-1.5 text-xs text-white/78 last:-0">
                                    <span className="truncate">{g.name}</span>
                                    {canEnroll && (
                                        <i role="button" className="bi bi-x-circle cursor-pointer !text-danger-soft opacity-65 transition hover:opacity-100" onClick={() => onRemoveGallery(g.id)}></i>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-center text-xs text-white/45">
                                No hay galerías en este evento.
                            </div>
                        )}
                    </div>
                    <div className="mt-2 text-center">
                        <small className="text-[0.6rem] font-black uppercase tracking-[0.14em] text-white/42">Total: {eventGalleries.length}</small>
                    </div>
                </aside>

                {/* RIGHT: Matchmaking / Live / Finished */}
                <section>

                    {/* CASO: CONFIGURACIÓN (Matchmaking) */}
                    {(round.status === ROUND.PENDING || canEnroll) && (round.status !== ROUND.FINISHED) && (round.status !== ROUND.CANCELLED) && (
                        <div className="animate__animated animate__fadeIn">
                            <MatchMakingContainer
                                eventGalleries={eventGalleries}
                                onSave={onSaveMatchmaking}
                                loading={loading}
                                currentEvent={currentEvent}
                                initialMatches={fightsInRound}
                            />

                            {round.status === ROUND.PENDING && fightsInRound.length > 0 && (
                                <div className="mt-3">
                                    <LoadingButton
                                        className="!flex !w-full !items-center !justify-center !gap-2 ! !border-0 !bg-success-soft !px-4 !py-2 !text-xs !font-black !uppercase !tracking-[0.08em] !text-black transition hover:!brightness-110"
                                        onClick={onStart}
                                        loadingText=" Iniciando..."
                                        isLoading={loading}
                                    >
                                        <i className="bi bi-rocket-takeoff !text-current"></i> INICIAR TRANSMISIÓN DE RONDA
                                    </LoadingButton>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CASO: LIVE CONTROL */}
                    {round.status === ROUND.LIVE && (
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="mb-3 text-center">
                                <div className="mb-2">
                                    <i className="bi bi-record-circle text-4xl !text-danger-soft"></i>
                                </div>
                                <h4 className="mb-1 text-sm font-black text-white">Ronda en Vivo</h4>
                                <p className="mx-auto max-w-[420px] text-xs text-white/55">
                                    Recuerde crear las peleas y cambiarlas al estado <strong>abierto</strong>. Para finalizar la ronda, todas las peleas deben tener un resultado registrado.
                                </p>
                            </div>

                            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
                                <LoadingButton
                                    className="! !border-0 !bg-danger-soft !px-4 !py-2 !text-xs !font-black !text-white"
                                    onClick={onFinish}
                                    loadingText=" Finalizando..."
                                    isLoading={loading}
                                >
                                    <i className="bi bi-flag-fill !text-current me-2"></i> Finalizar Ronda
                                </LoadingButton>

                                <LoadingButton
                                    className="! !border !border-white/12 !bg-white/[0.08] !px-4 !py-2 !text-xs !font-black !text-white/78"
                                    onClick={onCancel}
                                    loadingText=" Cancelando..."
                                    isLoading={loading}
                                >
                                    <i className="bi bi-x-octagon !text-current me-2"></i> Cancelar Ronda
                                </LoadingButton>
                            </div>
                        </div>
                    )}

                    {/* CASO: FINALIZADO / CANCELADO */}
                    {(round.status === ROUND.FINISHED || round.status === ROUND.CANCELLED) && (
                        <div className="flex flex-col items-center justify-center py-4 text-center">
                            <i className="bi bi-check-all mb-2 text-4xl !text-success-soft"></i>
                            <h5 className="mb-1 text-sm font-black text-white/75">Ronda Concluida</h5>
                            <p className="mb-2 text-xs text-white/48">Los datos han sido archivados y los puntos repartidos.</p>
                            {showEventBtn && (
                                <button type="button" className="! !border !border-white/12 !bg-white/[0.06] !px-4 !py-2 !text-xs !font-black !text-white/70" onClick={() => navigate('/admin/rounds')}>
                                    Volver al listado
                                </button>
                            )}
                        </div>
                    )}

                    {/* CASO: EVENTO NO INICIADO */}
                    {currentEvent.status === EVENT.SCHEDULED && (
                        <div className="mt-2  border border-gold-400/25 bg-gold-400/10 px-3 py-2 text-center text-xs font-semibold text-gold-300">
                            <i className="bi bi-exclamation-triangle me-2 !text-current"></i>
                            Debe iniciar el evento para poder gestionar las rondas.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default RoundManager;
