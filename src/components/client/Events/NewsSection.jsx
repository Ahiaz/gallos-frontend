import NewsCard from "./NewsCard";

const NewsSection = ({ news = [] }) => {
  return (
    <section>
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Actualidad</p>
        <h5 className="text-sm font-black uppercase tracking-widest text-white">Noticias</h5>
      </div>

      {news.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {news.map(item => <NewsCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20">
          <div className="text-center">
            <i className="bi bi-newspaper mb-2 block text-2xl text-white/20" />
            <p className="text-xs text-white/30">No hay noticias recientes</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection;
