/*
Componente: NewsManager.jsx
Descripción: Maneja información básica de la noticia seleccionada
Autor: Jose Ahias Vargas
*/

import { NEWS_PREVIEW, NEWS } from "../../../constants/newConstants";
import { useDateFormatter } from "../../../hooks/useDateFormatter";

const NewsManager = ({ news }) => {
  const { formatToDisplay } = useDateFormatter();

  if (!news) {
    return (
      <div className="p-4 text-center text-white/45">
        <p className="mb-1 text-sm font-bold text-white/60">Noticia</p>
        <p className="text-sm">No hay noticia seleccionada</p>
      </div>
    );
  }

  return (
    <div className="animate__animated animate__fadeIn">
      <h6 className="mb-4 border-b border-white/10 pb-2 text-sm font-bold text-white">
        Información de la Noticia
      </h6>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:divide-x md:divide-white/10">
        <div className="space-y-3">
          <div>
            <p className="mb-0.5 text-xs font-bold text-white/55">Título:</p>
            <p className="text-sm text-white/85">{news.title}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs font-bold text-white/55">Fecha de publicación:</p>
            <p className="text-sm text-white/85">{formatToDisplay(news.created_at)}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs font-bold text-white/55">Descripción:</p>
            <p className="max-h-[150px] overflow-y-auto break-words text-sm text-white/85">
              {news.description || "Sin descripción"}
            </p>
          </div>
        </div>

        <div className="pl-0 text-center md:pl-4">
          <div className="mb-3">
            <p className="mb-2 text-xs font-bold text-white/55">Estado Actual:</p>
            <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-black uppercase ${
              news.status === NEWS.ACTIVE
                ? 'bg-success-soft/15 text-success-soft'
                : 'bg-danger-soft/15 text-danger-soft'
            }`}>
              {NEWS_PREVIEW?.[news.status] || news.status}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs italic text-white/45">
              Última actualización:<br />{formatToDisplay(news.updated_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsManager;
