/*
Componente: FightList.jsx
Descripción: Lista y filtra las peleas de una ronda específica
Autor: Jose Ahias Vargas Pacheco
*/

import { useMemo } from "react";
import { FIGHT, FIGHT_FILTERS, FIGHT_PREVIEW } from "../../../constants/fightConstants";

const FightList = ({ 
    round = {},
    fights = [], 
    currentFight, 
    onSelected, 
    filter, 
    setFilter, 
    isLoading = false 
}) => {

    /*
    Función: filteredFights
    Descripción: Filtra y ordena las peleas. 
    Prioriza estado en filtros específicos, pero en ALL ordena por número correlativo.
    */
    const filteredFights = useMemo(() => {
        const statusPriority = {
            [FIGHT.IN_PROGRESS]: 1,
            [FIGHT.OPEN]: 2,
            [FIGHT.PENDING]: 3,
            [FIGHT.RESOLVED]: 4,
            [FIGHT.CANCELLED]: 5,
        };

        let filtered = fights;

        if (filter !== FIGHT_FILTERS.ALL) {
            filtered = fights.filter(r => r.status === filter);
            
            return [...filtered].sort((a, b) => {
                const diff = (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
                if (diff !== 0) return diff;
                return a.number - b.number;
            });
        }

        // Si es ALL, orden cronológico por número de pelea ASC
        return [...filtered].sort((a, b) => a.number - b.number);
    }, [fights, filter]);

    const filters = [
        { value: FIGHT_FILTERS.ALL, label: FIGHT_PREVIEW[FIGHT_FILTERS.ALL], className: "border-info-soft/30 text-info-soft hover:bg-info-soft/10" },
        { value: FIGHT.IN_PROGRESS, label: FIGHT_PREVIEW[FIGHT.IN_PROGRESS], className: "border-success-soft/30 text-success-soft hover:bg-success-soft/10" },
        { value: FIGHT.OPEN, label: FIGHT_PREVIEW[FIGHT.OPEN], className: "border-info-soft/30 text-info-soft hover:bg-info-soft/10" },
        { value: FIGHT.PENDING, label: FIGHT_PREVIEW[FIGHT.PENDING], className: "border-gold-400/35 text-gold-300 hover:bg-gold-400/10" },
        { value: FIGHT.RESOLVED, label: FIGHT_PREVIEW[FIGHT.RESOLVED], className: "border-white/15 text-white/60 hover:bg-white/[0.06]" },
    ];

    const getStatusClasses = (status) => {
        switch (status) {
            case FIGHT.IN_PROGRESS:
                return "border-success-soft/25 bg-success-soft/10 text-success-soft";
            case FIGHT.OPEN:
                return "border-info-soft/25 bg-info-soft/10 text-info-soft";
            case FIGHT.RESOLVED:
                return "border-danger-soft/25 bg-danger-soft/10 text-danger-soft";
            case FIGHT.CANCELLED:
                return "border-white/15 bg-white/[0.05] text-white/55";
            case FIGHT.PENDING:
                return "border-gold-400/25 bg-gold-400/10 text-gold-300";
            default:
                return "border-info-soft/25 bg-info-soft/10 text-info-soft";
        }
    };

    return (
        <div className="fight-list-container animate__animated animate__fadeIn">

            {isLoading ? (
                <div className="flex flex-col items-center justify-center bg-black/25 p-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
                    <span className="mt-2 text-xs text-white/55">Cargando peleas...</span>
                </div>
            ) : (
                <>
                    {/* ================= BOTONES DE FILTRO ================= */}
                    <div className="mb-2.5 flex flex-wrap gap-1.5">
                        {filters.map((item) => {
                            const isActive = filter === item.value;

                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    className={`!rounded-md !border !bg-transparent !px-2 !py-1 !text-[0.62rem] !font-black !uppercase !tracking-[0.05em] transition ${item.className} ${isActive ? "!bg-white/[0.08] ring-1 ring-gold-400/25" : ""}`}
                                    onClick={() => setFilter(item.value)}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* ================= LISTADO DE PELEAS ================= */}
                    <div className="space-y-1">
                        {filteredFights.length > 0 ? (
                            filteredFights.map((fight) => {
                                const isActive = currentFight?.id === fight.id;

                                return (
                                <button
                                    key={fight.id}
                                    type="button"
                                    onClick={() => onSelected(fight)}
                                    className={`!flex !w-full !items-center !justify-between !gap-3 ! !border !px-3 !py-2.5 !text-left transition ${
                                        isActive
                                            ? "!border-gold-400/45 !bg-gold-400/10 shadow-[0_6px_20px_rgba(212,175,55,0.07)]"
                                            : "!border-white/10 !bg-black/30 hover:!border-white/15 hover:!bg-white/[0.04]"
                                    }`}
                                >
                                    <span className="min-w-0">
                                        <span className={`block truncate text-xs font-black ${isActive ? "text-gold-300" : "text-white/82"}`}>Pelea #{fight.number}</span>
                                        {fight.status === FIGHT.RESOLVED && (
                                            <small className="mt-0.5 block text-[0.58rem] text-white/48">
                                                Puntaje: {fight.score_a} - {fight.score_b}
                                            </small>
                                        )}
                                    </span>

                                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-[0.06em] ${getStatusClasses(fight.status)}`}>
                                        {FIGHT_PREVIEW[fight.status] || fight.status}
                                    </span>
                                </button>
                                );
                            })
                        ) : (
                            <div className="bg-black/25 px-4 py-4 text-center text-xs text-white/50">
                                No hay peleas registradas para esta ronda.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default FightList;
