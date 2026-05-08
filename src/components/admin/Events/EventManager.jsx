/*
Componente: EventManager.jsx
Descripción: Maneja información básica del evento actual
Autor: Jose Ahias Vargas
*/

import { EVENT, EVENT_PREVIEW } from "../../../constants/eventConstants";
import LoadingButton from "../../common/LoadingButton";
import { useDateFormatter } from "../../../hooks/useDateFormatter";
import { useNavigate } from "react-router-dom";

const EventManager = ({ event, loading, onStart, onFinish, onCancel, showAdminRoundBtn = true }) => {

  const { formatToDisplay } = useDateFormatter();
  const navigate = useNavigate();

  if (!event) {
    return (
      <div className="bg-black/25 p-6 text-center text-white/55">
        No hay evento seleccionado
      </div>
    );
  }

  const statusClasses = {
    [EVENT.LIVE]:      "border-success-soft/30 bg-success-soft/10 text-success-soft",
    [EVENT.FINISHED]:  "border-danger-soft/30 bg-danger-soft/10 text-danger-soft",
    [EVENT.CANCELLED]: "border-white/15 bg-white/[0.06] text-white/55",
    [EVENT.SCHEDULED]: "border-gold-400/30 bg-gold-400/10 text-gold-300",
  };

  return (
    <div className="animate__animated animate__fadeIn space-y-2.5">

      {/* Nombre + badges de tipo y estado */}
      <div className="flex items-start justify-between gap-2 pb-2.5">
        <div className="min-w-0">
          <p className="mb-0 text-[0.58rem] uppercase tracking-[0.14em] text-white/35">Evento activo</p>
          <h5 className="mb-0 truncate text-sm text-white">{event.name}</h5>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          <span className="rounded-full bg-info-soft/10 px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.06em] text-info-soft">
            {event.type}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.06em] ${statusClasses[event.status] || statusClasses[EVENT.SCHEDULED]}`}>
            {EVENT_PREVIEW?.[event.status] || event.status}
          </span>
        </div>
      </div>

      {/* Grid compacto: Fecha + Tipo */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/25 px-2.5 py-2">
          <span className="mb-0.5 block text-[0.58rem] uppercase tracking-[0.1em] text-white/35">Fecha</span>
          <span className="block text-xs font-semibold text-white/80">{formatToDisplay(event.starts_at)}</span>
        </div>
        <div className="bg-black/25 px-2.5 py-2">
          <span className="mb-0.5 block text-[0.58rem] uppercase tracking-[0.1em] text-white/35">Tipo</span>
          <span className="block text-xs font-semibold text-info-soft">{event.type}</span>
        </div>
      </div>

      {/* Stream URL */}
      <div className="bg-black/25 px-2.5 py-2">
        <span className="mb-0.5 block text-[0.58rem] uppercase tracking-[0.1em] text-white/35">Stream URL</span>
        <p className="mb-0 truncate font-mono text-[0.68rem] text-white/50">
          {event.stream_url || "no especificado"}
        </p>
      </div>

      {/* Botón navegación (solo en página standalone) */}
      {showAdminRoundBtn && (
        <button
          className="!inline-flex !w-full !items-center !justify-center !gap-2 ! mb-2 !bg-info-soft/10 !px-3 !py-2 !text-xs !!text-info-soft transition hover:!bg-info-soft/20"
          onClick={() => navigate('/admin/rounds')}
        >
          <i className="bi bi-shield-shaded !text-current"></i>
          Administrar Rondas
        </button>
      )}

      {/* Acciones según estado */}
      {event.status === EVENT.SCHEDULED && (
        <div className="flex gap-2 pt-0.5">
          <LoadingButton
            id="startEventBtn"
            type="button"
            className="!flex !flex-1 !items-center !justify-center !gap-1.5 ! !bg-success-soft !px-3 !py-2 !text-xs !uppercase !tracking-[0.06em] !text-black transition hover:!brightness-110"
            onClick={onStart}
            loadingText="Iniciando..."
            isLoading={loading}
          >
            <i className="bi bi-calendar3-fill !text-current"></i> Iniciar
          </LoadingButton>
          <LoadingButton
            id="cancelEventBtn"
            type="button"
            className="!flex !flex-1 !items-center !justify-center !gap-1.5 ! !bg-white/[0.06] !px-3 !py-2 !text-xs !uppercase !tracking-[0.06em] !text-white/70 transition hover:!bg-danger-soft/12 hover:!text-danger-soft"
            onClick={onCancel}
            loadingText="Cancelando..."
            isLoading={loading}
          >
            <i className="bi bi-calendar2-x-fill !text-current"></i> Cancelar
          </LoadingButton>
        </div>
      )}

      {event.status === EVENT.LIVE && (
        <LoadingButton
          id="finishEventBtn"
          type="button"
          className="!flex !w-full !items-center !justify-center !gap-2 ! !bg-danger-soft !px-4 !py-2.5 !text-sm !!uppercase !tracking-[0.08em] !text-white transition hover:!brightness-110"
          onClick={onFinish}
          loadingText="Finalizando..."
          isLoading={loading}
        >
          <i className="bi bi-calendar2-check-fill !text-current"></i> Finalizar Evento
        </LoadingButton>
      )}

      {(event.status === EVENT.FINISHED || event.status === EVENT.CANCELLED) && (
        <p className="mb-0 bg-black/20 px-3 py-2 text-center text-xs text-white/50">
          El ciclo de este evento ha terminado.
        </p>
      )}

    </div>
  );
};

export default EventManager;
