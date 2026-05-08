import EventCard from "./EventCard";

const EventsGrid = ({ events = [], isLive = false }) => {
  if (events.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20">
        <div className="text-center">
          <i className={`bi ${isLive ? 'bi-broadcast' : 'bi-calendar-x'} mb-2 block text-2xl text-white/20`} />
          <p className="text-xs text-white/30">
            {isLive ? "No hay transmisiones activas" : "No hay eventos programados"}
          </p>
        </div>
      </div>
    );
  }

  if (isLive) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gold-400/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
      {events.map(event => (
        <div key={event.id} className="min-w-[260px] max-w-[300px] flex-shrink-0 snap-start">
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
};

export default EventsGrid;
