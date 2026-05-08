/*
Componente: EventList.jsx
Descripción: Lista y filtra los eventos
Autor: Jose Ahias Vargas
*/

import { useMemo } from "react";
import { EVENT, EVENT_FILTERS, EVENT_PREVIEW } from "../../../constants/eventConstants";


const EventList = ({ events, currentEvent, onSelect, filter, setFilter }) => {

    const filteredEvents = useMemo(() => {

        const statusPriority = {
            [EVENT.LIVE]: 1,
            [EVENT.SCHEDULED]: 2,
            [EVENT.FINISHED]: 3,
            [EVENT.CANCELLED]: 4
        };

        let filtered = events;

        if (filter !== EVENT_FILTERS.ALL) {
            filtered = events.filter(e => e.status === filter);
        }

        return [...filtered].sort((a, b) => {
            if (filter === EVENT_FILTERS.ALL) {
                const diff = statusPriority[a.status] - statusPriority[b.status];
                if (diff !== 0) return diff;
            }
            return new Date(b.starts_at) - new Date(a.starts_at);
        });

    }, [events, filter]);

    const filters = [
        { value: EVENT_FILTERS.ALL,   label: EVENT_PREVIEW[EVENT_FILTERS.ALL],   className: "border-info-soft/30 text-info-soft hover:bg-info-soft/10" },
        { value: EVENT.LIVE,          label: EVENT_PREVIEW[EVENT.LIVE],           className: "border-success-soft/30 text-success-soft hover:bg-success-soft/10" },
        { value: EVENT.SCHEDULED,     label: EVENT_PREVIEW[EVENT.SCHEDULED],      className: "border-gold-400/35 text-gold-300 hover:bg-gold-400/10" },
        { value: EVENT.FINISHED,      label: EVENT_PREVIEW[EVENT.FINISHED],       className: "border-danger-soft/30 text-danger-soft hover:bg-danger-soft/10" },
        { value: EVENT.CANCELLED,     label: EVENT_PREVIEW[EVENT.CANCELLED],      className: "border-white/15 text-white/60 hover:bg-white/[0.06]" },
    ];

    const getStatusClasses = (status) => {
        switch (status) {
            case EVENT.LIVE:      return "border-success-soft/25 bg-success-soft/10 text-success-soft";
            case EVENT.SCHEDULED: return "border-gold-400/25 bg-gold-400/10 text-gold-300";
            case EVENT.FINISHED:  return "border-danger-soft/25 bg-danger-soft/10 text-danger-soft";
            case EVENT.CANCELLED: return "border-white/15 bg-white/[0.05] text-white/55";
            default:              return "border-info-soft/25 bg-info-soft/10 text-info-soft";
        }
    };

    return (
        <div className="animate__animated animate__fadeIn">
            {/* Filtros compactos en fila */}
            <div className="mb-2.5 flex flex-wrap gap-1.5">
                {filters.map((item) => {
                    const isActive = filter === item.value;
                    return (
                        <button
                            key={item.value}
                            type="button"
                            className={`!border !bg-transparent !px-2 !py-1 !text-[0.62rem] !font-black !uppercase !tracking-[0.05em] transition ${item.className} ${isActive ? "!bg-white/[0.08] ring-1 ring-gold-400/25" : ""}`}
                            onClick={() => setFilter(item.value)}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Lista de eventos */}
            <div className="space-y-1 overflow-x-hidden max-h-[300px]">
                {filteredEvents.length > 0 ? filteredEvents.map(event => {
                    const isActive = currentEvent?.id === event.id;

                    return (
                        <button
                            key={event.id}
                            type="button"
                            onClick={() => onSelect(event)}
                            className={`!flex !w-full !items-center !justify-between !gap-3 ! rounded-0 !px-3 !py-2.5 !text-left transition ${
                                isActive
                                    ? "!border-gold-400/45 !bg-gold-400/10 shadow-[0_6px_20px_rgba(212,175,55,0.07)] "
                                    : "!border-white/10 !bg-black/30 hover:!border-white/15 hover:!bg-white/[0.04]"
                            }`}
                        >
                            <span className="min-w-0">
                                <span className={`block truncate text-xs font-black ${isActive ? "text-gold-300" : "text-white/82"}`}>
                                    {event.name}
                                </span>
                                <span className="mt-0.5 block text-[0.58rem] font-semibold uppercase tracking-wide text-white/32">
                                    {event.type}
                                </span>
                            </span>
                            <span className={`shrink-0 rounded-full px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.06em] ${getStatusClasses(event.status)}`}>
                                {EVENT_PREVIEW[event.status] || event.status}
                            </span>
                        </button>
                    );
                }) : (
                    <div className=" bg-black/25 px-4 py-6 text-center text-xs text-white/50">
                        No hay eventos en este estado.
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventList;
