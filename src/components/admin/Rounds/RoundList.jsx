/*
Componente: RoundList.jsx
Descripción: Lista y filtra las rondas de un evento
Autor: Jose Ahias Vargas Pacheco
*/

import { useMemo } from "react";
import Select from "react-select";
import { EVENT, EVENT_GROUP } from "../../../constants/eventConstants";
import { ROUND, ROUND_FILTERS, ROUND_PREVIEW } from "../../../constants/roundConstants";


const RoundList = ({

    rounds = [],
    currentRound,
    onSelected,
    filter,
    setFilter,
    events = [],
    selectedEventId,
    onEventChange,
    selectIsLoading = false,
    showEventBar = true
}) => {


    /*
    Función: groupedOptions
    Descripción: opciones para el filtro del reactSelect
    Autor: Jose Ahias Vargas Pacheco
    */   
    const groupedOptions = useMemo(() => {

    const groups = {
        LIVE: { ...EVENT_GROUP.LIVE, options: [] },
        SCHEDULED: { ...EVENT_GROUP.SCHEDULED, options: [] },
        FINISHED: { ...EVENT_GROUP.FINISHED, options: [] },
        CANCELLED: { ...EVENT_GROUP.CANCELLED, options: [] }
    };
    // Estructura base de los grupos
    events.forEach(evt => {
        const option = { value: evt.id, label: evt.name , status: evt.status};
        

        if (groups[evt.status]) {
            groups[evt.status].options.push(option);
        }
    });

    return Object.values(groups).filter(group => group.options.length > 0);
}, [events]);

    /*
    Función: customFilterOption
    Descripción: filtro customizado de la opcion
    Autor: Jose Ahias Vargas Pacheco
    */   

const customFilterOption = (option, rawInput) => {
    const input = rawInput.toLowerCase();
    const label = option.label.toLowerCase();
    const data = option.data; 

    // Sinónimos para "LIVE"
    if (data.status === EVENT.LIVE && (input.includes('vivo') || input.includes('live'))) {
        return true;
    }
    
    // Sinónimos para "SCHEDULED"
    if (data.status === EVENT.SCHEDULED && ( input.includes('progra') || input.includes('pend') || input.includes('fecha') || input.includes('plan'))) {
        return true;
    }

    // Sinónimos para "FINISHED"
    if (data.status === EVENT.FINISHED && ( input.includes('fin') || input.includes('term') || input.includes('cerr'))) {
        return true;
    }

    // Sinónimos para "CANCELLED"
    if (data.status === EVENT.CANCELLED && ( input.includes('can') || input.includes('abo') || input.includes('eli'))) {
        return true;
    }

    // Búsqueda normal por el nombre del evento
    return label.includes(input);
};


    /*
    Función: currentSelectValue
    Descripción: valor actual del select de eventos
    Autor: Jose Ahias Vargas Pacheco
    */  
    const currentSelectValue = useMemo(() => {
        if (!selectedEventId || events.length === 0) return null;
        const event = events.find(e => e.id === selectedEventId);
        return event ? { value: event.id, label: event.name } : null;
    }, [selectedEventId, events]);

    /*
    Función: filteredRounds
    Descripción: Reordena las rondas por prioridad de estado y número de ronda DESC
    Autor: Jose Ahias Vargas Pacheco
    */


const filteredRounds = useMemo(() => {
    const statusPriority = {
        [ROUND.LIVE]: 1,
        [ROUND.PENDING]: 2,
        [ROUND.FINISHED]: 3,
        [ROUND.CANCELLED]: 4,
    };

    let filtered = rounds;

if (filter !== ROUND_FILTERS.ALL) {
        filtered = rounds.filter(f => f.status === filter);
        
        return [...filtered].sort((a, b) => {
            const diff = (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
            if (diff !== 0) return diff;
            return a.number - b.number;
        });
    }

    

return [...filtered].sort((a, b) => a.number - b.number);

}, [filter, rounds]);

    const filters = [
        { value: ROUND_FILTERS.ALL, label: ROUND_PREVIEW[ROUND_FILTERS.ALL], className: "border-info-soft/30 text-info-soft hover:bg-info-soft/10" },
        { value: ROUND.LIVE, label: ROUND_PREVIEW[ROUND.LIVE], className: "border-success-soft/30 text-success-soft hover:bg-success-soft/10" },
        { value: ROUND.PENDING, label: ROUND_PREVIEW[ROUND.PENDING], className: "border-gold-400/35 text-gold-300 hover:bg-gold-400/10" },
        { value: ROUND.FINISHED, label: ROUND_PREVIEW[ROUND.FINISHED], className: "border-white/15 text-white/60 hover:bg-white/[0.06]" },
    ];

    const getStatusClasses = (status) => {
        switch (status) {
            case ROUND.LIVE:
                return "border-success-soft/25 bg-success-soft/10 text-success-soft";
            case ROUND.FINISHED:
                return "border-danger-soft/25 bg-danger-soft/10 text-danger-soft";
            case ROUND.CANCELLED:
                return "border-white/15 bg-white/[0.05] text-white/55";
            case ROUND.PENDING:
                return "border-gold-400/25 bg-gold-400/10 text-gold-300";
            default:
                return "border-info-soft/25 bg-info-soft/10 text-info-soft";
        }
    };

    return (
        <div className="animate__animated animate__fadeIn">
            {/* ================= ENCABEZADO CON SELECTOR ================= */}
            <div className="mb-3">

                <div className="react-select-wrapper flex-fill">
                    <Select
                        value={currentSelectValue}
                        onChange={(opt) => onEventChange(opt?.value)}
                        options={groupedOptions}
                        filterOption={customFilterOption}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Buscar evento..."
                        noOptionsMessage={({ inputValue }) => 
                            !inputValue 
                                ? "No hay eventos" 
                                : "Sin resultado"
                        }
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        isLoading={selectIsLoading}
                        isDisabled={selectIsLoading || !showEventBar}
                        isSearchable={true}
                    />
                </div>
            </div>


            {selectIsLoading ? (
                <div className="flex flex-col items-center justify-center bg-black/25 p-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
                    <span className="mt-2 text-xs text-white/55">Cargando rondas...</span>
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
                            className={`!rounded-md !border !bg-transparent !px-2 !py-1 !text-[0.62rem]  !uppercase !tracking-[0.05em] transition ${item.className} ${isActive ? "!bg-white/[0.08] ring-1 ring-gold-400/25" : ""}`}
                            onClick={() => setFilter(item.value)}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* ================= LISTADO DE RONDAS ================= */}
            <div className="space-y-1 ">
                {filteredRounds.length > 0 ? (
                    filteredRounds.map((round) => {
                        const isActive = currentRound?.id === round.id;

                        return (
                        <button
                            key={round.id}
                            type="button"
                            onClick={() => onSelected(round)}
                            className={`!flex !w-full !items-center !justify-between !gap-3 ! rounded-0 !border !px-3 !py-2.5 !text-left transition ${
                                isActive
                                    ? "!border-gold-400/45 !bg-gold-400/10 shadow-[0_6px_20px_rgba(212,175,55,0.07)]"
                                    : "!border-white/10 !bg-black/30 hover:!border-white/15 hover:!bg-white/[0.04]"
                            }`}
                        >
                            <span className={`text-xs ${isActive ? "text-gold-300" : "text-white/82"}`}>
                               Ronda #{round.number}
                            </span>

                            <span className={`shrink-0 rounded-full border px-3 py-1 text-[0.58rem] uppercase tracking-[0.06em] ${getStatusClasses(round.status)}`}>
                                {ROUND_PREVIEW[round.status] || round.status}
                            </span>
                        </button>
                        );
                    })
                ) : (
                    <div className="bg-black/25 px-4 py-4 text-center text-xs text-white/50">
                        No hay rondas en este estado.
                    </div>
                )}
            </div>
        </>

        )}
        </div>
    );
};

export default RoundList;
