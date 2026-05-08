import { useNavigate } from "react-router-dom";
import { EVENT, EVENT_PREVIEW } from "../../../constants/eventConstants";
import { useDateFormatter } from "../../../hooks/useDateFormatter";

const statusBadge = {
  [EVENT.LIVE]:      "bg-success-soft/15 text-success-soft border-success-soft/30",
  [EVENT.SCHEDULED]: "bg-gold-400/10 text-gold-300 border-gold-400/25",
  [EVENT.FINISHED]:  "bg-danger-soft/10 text-danger-soft border-danger-soft/25",
  [EVENT.CANCELLED]: "bg-white/5 text-white/45 border-white/10",
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { formatToDisplay } = useDateFormatter();
  const isLive = event.status === EVENT.LIVE;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#111111] transition-all duration-300 hover:border-white/25 hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] animate__animated animate__fadeIn">
      {/* Banner */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_URL}${event.banner}`}
          alt={event.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute right-2 top-2">
          <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6rem] font-black uppercase ${statusBadge[event.status]}`}>
            {isLive && <span className="h-1.5 w-1.5 rounded-full bg-success-soft animate-pulse" />}
            {EVENT_PREVIEW[event.status] || event.status}
          </span>
        </div>

        {/* Type badge */}
        <div className="absolute left-2 top-2">
          <span className="rounded-full border border-info-soft/25 bg-info-soft/10 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-info-soft">
            {event.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h6 className="text-sm font-black text-white leading-tight">{event.name}</h6>
        <div className="flex items-center gap-1.5 text-[0.65rem] text-white/45">
          <i className="bi bi-calendar-event text-white/30" />
          <span>{formatToDisplay(event.starts_at)}</span>
        </div>

        {isLive && (
          <button
            onClick={() => navigate('/client/live')}
            className="mt-1 w-full rounded-lg border border-success-soft/25 bg-success-soft/10 py-1.5 text-xs font-black uppercase tracking-widest text-success-soft transition hover:bg-success-soft/20"
          >
            <i className="bi bi-play-fill me-1" />
            Ver en Vivo
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
