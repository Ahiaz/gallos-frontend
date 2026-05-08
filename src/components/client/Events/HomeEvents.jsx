import EventsGrid from "./EventsGrid";
import NewsSection from "./NewsSection";

const HomeEvents = ({ liveEvents = [], monthEvents = [], news = [] }) => {
  return (
    <div className="w-[92%] mx-auto mt-6 space-y-8 animate__animated animate__fadeIn">

      {/* HEADER */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-500">Portal de Eventos</p>
        <h4 className="text-2xl font-black text-white tracking-tight">Cartelera</h4>
      </div>

      {/* EVENTO EN VIVO */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success-soft animate-pulse" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-success-soft">Transmisión Activa</p>
        </div>
        <EventsGrid events={liveEvents} isLive={true} />
      </section>

      {/* EVENTOS DEL MES */}
      <section>
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold-300">Próximos</p>
          <h5 className="text-sm font-black uppercase tracking-widest text-white">Eventos del Mes</h5>
        </div>
        <EventsGrid events={monthEvents} isLive={false} />
      </section>

      {/* NOTICIAS */}
      <NewsSection news={news} />

    </div>
  );
};

export default HomeEvents;
