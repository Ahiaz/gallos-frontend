/*
Componente: MatchMaking.jsx
Descripción: Renderiza la tabla de pareo con soporte para pesos en formato mexicano (L.OZ)
Autor: Jose Ahias Vargas
*/

import LoadingButton from "../../common/LoadingButton";
import matchStyles from './styles/MatchMaking.module.css'

const MatchMaking = ({ addRow, rows, eventGalleries, updateRow, removeRow, onConfirm, loading }) => {

    // Función interna para validar el formato de onzas mientras se escribe
    const handleWeightChange = (index, field, value) => {
        if (value.includes('.')) {
            const parts = value.split('.');
            const oz = parts[1];
            // Si las onzas superan 15, no actualizamos el estado o podrías manejar un error visual
            if (oz && parseInt(oz) > 15) return; 
        }
        updateRow(index, field, value);
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h6 className="mb-0 flex items-center gap-2 font-bold uppercase tracking-[0.1em] text-white">
                    <i className="bi bi-diagram-3-fill !text-gold-300"></i>Configuración de Peleas
                </h6>
                <button type="button" className="!inline-flex !items-center !gap-2 ! !border !border-white/12 !bg-white/[0.06] !px-3 !py-2 !text-xs !font-black !uppercase !tracking-[0.1em] !text-white/72 transition hover:!bg-white/[0.1]" onClick={addRow}>
                    <i className="bi bi-plus-lg !text-current"></i> Agregar Pelea
                </button>
            </div>

            <div className="mb-3 bg-gold-400/10 px-3 py-2 text-center text-sm text-gold-300">
                <i className="bi bi-info-circle-fill me-2 !text-current"></i>
                Pesos en formato <strong>Libras.Onzas</strong> (Máximo .15 onzas)
            </div>

            <div className="max-h-[400px] overflow-auto">
                <table className="min-w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10 bg-brand-850">
                        <tr className="text-center text-[0.68rem] uppercase tracking-[0.12em] text-white/55">
                            <th className="px-3 py-3">Rojo (A)</th>
                            <th className="w-[110px] px-3 py-3">Peso</th>
                            <th className="px-3 py-3">Verde (B)</th>
                            <th className="w-[110px] px-3 py-3 ">Peso</th>
                            <th className="w-[50px] px-3 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {rows.map((row, index) => (
                            <tr key={index} className="transition hover:bg-white/[0.035]">
                                <td className="min-w-[180px] px-3 py-2">
                                    <select
                                        className={`${matchStyles.selectStyle} w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none`}
                                        value={row.gallery1_id}
                                        onChange={(e) => updateRow(index, "gallery1_id", e.target.value)}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {eventGalleries.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-3 py-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={row.weight1}
                                        onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }}
                                        onChange={(e) => handleWeightChange(index, "weight1", e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/[0.08] px-2 py-1.5 text-center text-sm text-white focus:border-gold-400/70 focus:outline-none"
                                    />
                                </td>
                                <td className="min-w-[180px] px-3 py-2">
                                    <select
                                        className={`${matchStyles.selectStyle} w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-2 py-1.5 text-sm text-white focus:border-gold-400/70 focus:outline-none`}
                                        value={row.gallery2_id}
                                        onChange={(e) => updateRow(index, "gallery2_id", e.target.value)}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {eventGalleries.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-3 py-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={row.weight2}
                                        onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }}
                                        onChange={(e) => handleWeightChange(index, "weight2", e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/[0.08] px-2 py-1.5 text-center text-sm text-white focus:border-gold-400/70 focus:outline-none"
                                    />
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <i 
                                        className="bi bi-trash cursor-pointer !text-danger-soft opacity-75 transition hover:opacity-100" 
                                        onClick={() => removeRow(index)}
                                        title="Eliminar pelea"
                                    ></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <LoadingButton 
                    className="!flex !w-full !items-center !justify-center !gap-2 ! !border-0 !bg-info-soft !px-4 !py-3 !text-sm !font-black !uppercase !tracking-[0.08em] !text-white transition hover:!brightness-110"
                    onClick={onConfirm}
                    isLoading={loading}
                    loadingText="Guardando programa..."
                >
                    <i className="bi bi-cloud-upload-fill !text-current"></i>
                    Confirmar Peleas
                </LoadingButton>
                <small className="mt-3 block text-center text-xs text-white/45">
                    Al confirmar, se crearán las peleas en la ronda y se remplazara las anteriores.
                </small>
                <small className="mt-1 block text-center text-xs text-white/45">
                    <strong>Nota:</strong> Si existen apuestas asociadas a la ronda, no se podran realizar cambios.
                </small>
            </div>
        </div>
    );
};

export default MatchMaking;
