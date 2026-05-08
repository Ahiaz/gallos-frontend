/*
Componente: HouseProfit.jsx
Descripción: Historial de ganancias de la casa por pelea adaptado a Tailwind.
Autor: Jose Ahias Vargas
*/
import moment from "moment";
import { useSecurity } from "../../../hooks/useSecurity";
import styles from '../../../styles/General.module.css';

const HouseProfit = ({ profits, componentLoading, dateRange, onDateChange, onApplyFilter, onExportExcel }) => {
    const { currency } = useSecurity();

    // Cálculo de totales rápidos
    const totalVolume = profits.reduce((acc, curr) => acc + Number(curr.total_bet_amount), 0);
    const totalCommission = profits.reduce((acc, curr) => acc + Number(curr.commission_amount), 0);

    if (componentLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center animate__animated animate__fadeIn">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-transparent border-t-gold-400"></div>
            </div>
        );
    }

    return (
        <div className="w-[92%] mx-auto mt-6 space-y-4 animate__animated animate__fadeIn text-white">
            <h4 className="mb-4 text-sm font-black text-white uppercase tracking-wider">
                <i className="bi bi-graph-up-arrow me-2 text-success-soft"></i>
                Ganancias de la Casa
            </h4>

            {/* 1. RESUMEN DE MÉTRICAS */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-black/25 p-4 shadow-sm">
                <div className="border-r border-white/10 text-center">
                    <small className="block text-[0.65rem] font-bold uppercase tracking-widest text-white/55">
                        Volumen Total Apuestas
                    </small>
                    <h4 className="mt-1 text-xl font-black text-info-soft">
                        {currency}{totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h4>
                </div>
                <div className="text-center">
                    <small className="block text-[0.65rem] font-bold uppercase tracking-widest text-white/55">
                        Utilidad Neta (Comisión)
                    </small>
                    <h4 className="mt-1 text-xl font-black text-success-soft">
                        {currency}{totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h4>
                </div>
            </div>

            {/* 2. FILTROS */}
            <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                <div className="grid gap-3 md:grid-cols-[2fr_2fr_1.5fr] md:items-end">
                    <div>
                        <label className="mb-1 block text-xs font-bold text-white/55">Desde</label>
                        <input 
                            type="date" 
                            value={dateRange.from} 
                            onChange={(e) => onDateChange('from', e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold text-white/55">Hasta</label>
                        <input 
                            type="date" 
                            value={dateRange.to} 
                            onChange={(e) => onDateChange('to', e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none" 
                        />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            type="button" 
                            className={`${styles.btnWarning} flex-1 font-bold text-xs uppercase`} 
                            onClick={onApplyFilter}
                        >
                            <i className="bi bi-search me-2"></i>Calcular
                        </button>
                        <button 
                            type="button" 
                            className={`${styles.btnSuccess} px-4`} 
                            onClick={onExportExcel} 
                            disabled={profits.length === 0}
                        >
                            <i className="bi bi-file-earmark-excel text-white"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. LISTADO DE GANANCIAS POR PELEA */}
            <div className="space-y-3">
                {profits.length > 0 ? (
                    profits.map((p) => (
                        <div 
                            key={p.id} 
                            className="group flex items-center justify-between rounded-xl border-l-4 border-l-success-soft border border-white/10 bg-black/40 p-4 transition-all hover:bg-white/[0.04]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft/10">
                                    <i className="bi bi-piggy-bank-fill text-xl text-success-soft"></i>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded bg-white/10 px-2 py-0.5 text-[0.65rem] font-black text-white/90">
                                            R-{p.round_number}
                                        </span>
                                        <span className="text-sm font-bold text-white">Pelea #{p.fight_number}</span>
                                        <span className="text-xs text-white/45">| {p.event_name}</span>
                                    </div>
                                    <small className="mt-1 block text-xs text-white/45">
                                        {moment(p.created_at).format('LLL')}
                                    </small>
                                    <div className="mt-1 text-[0.7rem] font-bold text-info-soft/80">
                                        Volumen: {currency}{Number(p.total_bet_amount).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <small className="block text-[0.6rem] font-bold uppercase tracking-tighter text-white/45">
                                    Utilidad Casa
                                </small>
                                <div className="text-lg font-black text-success-soft">
                                    +{currency}{Number(p.commission_amount).toLocaleString()}
                                </div>
                                <span className="inline-block rounded-full border border-success-soft/30 bg-success-soft/10 px-2 py-0.5 text-[0.6rem] font-bold text-success-soft">
                                    {((p.commission_amount / p.total_bet_amount) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-white/20 py-12 text-center">
                        <i className="bi bi-folder-x mb-2 block text-4xl text-white/20"></i>
                        <p className="text-sm text-white/45">No se encontraron registros de ganancias.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HouseProfit;