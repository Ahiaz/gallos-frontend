/*
Componente: NewsList.jsx
Descripción: Lista y filtra las noticias del sistema
Autor: Jose Ahias Vargas
*/

import { useMemo } from "react";
import styles from '../../../styles/General.module.css';
import { NEWS, NEWS_FILTERS, NEWS_PREVIEW } from "../../../constants/newConstants";
import { useDateFormatter } from "../../../hooks/useDateFormatter";

const NewsList = ({ news, currentNews, onSelect, filter, setFilter }) => {
  const { formatToDisplay } = useDateFormatter();

  const filteredNews = useMemo(() => {
    let filtered = news;
    if (filter !== NEWS_FILTERS.ALL) {
      filtered = news.filter(n => n.status === filter);
    }
    return [...filtered].sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === NEWS.ACTIVE) return -1;
        if (b.status === NEWS.ACTIVE) return 1;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [news, filter]);

  return (
    <div className="animate__animated animate__fadeIn">
      {/* Botones de filtro */}
      <div className="mb-2 flex flex-wrap gap-2">
        <button type="button" className={`${styles.btnInfo} flex-1 py-1 px-2 text-xs font-bold`} onClick={() => setFilter(NEWS_FILTERS.ALL)}>
          {NEWS_PREVIEW.ALL}
        </button>
        <button type="button" className={`${styles.btnSuccess} flex-1 py-1 px-2 text-xs font-bold`} onClick={() => setFilter(NEWS.ACTIVE)}>
          {NEWS_PREVIEW.ACTIVE}
        </button>
        <button type="button" className={`${styles.btnSecondary} flex-1 py-1 px-2 text-xs font-bold`} onClick={() => setFilter(NEWS.INACTIVE)}>
          {NEWS_PREVIEW.INACTIVE}
        </button>
      </div>

      {/* Listado */}
      <div className="space-y-1.5">
        {filteredNews.length > 0 ? (
          filteredNews.map(item => (
            <div
              key={item.id}
              role="button"
              onClick={() => onSelect(item)}
              className={`cursor-pointer rounded-lg border px-3 py-2 transition ${
                currentNews?.id === item.id
                  ? 'border-danger-soft/50 bg-danger-soft/20'
                  : 'border-white/10 bg-black/40 hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm text-white" style={{ maxWidth: '70%' }}>{item.title}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-black uppercase ${
                  item.status === NEWS.ACTIVE ? 'bg-success-soft/15 text-success-soft' :
                  item.status === NEWS.INACTIVE ? 'bg-danger-soft/15 text-danger-soft' :
                  'bg-info-soft/15 text-info-soft'
                }`}>
                  {NEWS_PREVIEW[item.status] || item.status}
                </span>
              </div>
              <small className="mt-0.5 block text-[0.65rem] text-white/45">{formatToDisplay(item.created_at)}</small>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-sm text-white/45">No hay noticias que mostrar</div>
        )}
      </div>
    </div>
  );
};

export default NewsList;
