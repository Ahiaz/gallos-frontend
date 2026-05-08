const NewsCard = ({ item }) => {
  return (
    <div className="group flex gap-4 rounded-xl border border-white/10 bg-[#111111] p-3 transition-all duration-300 hover:border-white/20 animate__animated animate__fadeIn">
      <img
        src={`${import.meta.env.VITE_API_URL}${item.image_url}`}
        alt={item.title}
        className="h-20 w-28 shrink-0 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="min-w-0 space-y-1">
        <h6 className="text-xs font-black text-white leading-snug">{item.title}</h6>
        <p className="line-clamp-3 text-[0.7rem] leading-relaxed text-white/45">{item.description}</p>
      </div>
    </div>
  );
};

export default NewsCard;
