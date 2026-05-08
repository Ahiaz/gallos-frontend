/*
Componente: FightForm.jsx
Descripción: Edición de pesos en formato estándar mexicano (Libras.Onzas).
Autor: Jose Ahias Vargas
*/

import { useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import { useNumberValidation } from "../../../hooks/useNumberValidation";

const inputCls = (error) =>
  `w-full rounded-xl border bg-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-0 ${error ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/70'}`;

const FightForm = ({ fight = null }) => {
  const {
    modalFormData,
    inputErrors,
    setModalFormData,
    handleInputChange,
    setInputErrors
  } = useModal();

  const { handleKeyDownInteger } = useNumberValidation(setInputErrors);

  useEffect(() => {
    if (fight) {
      setModalFormData((prevData) => ({
        ...prevData,
        idFightInput: fight.id || null,
        fightNumberInput: fight.number || "",
        weight1Input: fight.gallo1_weight ?? "",
        weight2Input: fight.gallo2_weight ?? "",
        redName: fight.gallo_a || "Gallo Rojo",
        greenName: fight.gallo_b || "Gallo Verde"
      }));
    }
  }, [fight, setModalFormData]);

  const onWeightChange = (e) => {
    const { name, value } = e.target;
    if (value === "") { handleInputChange(e); return; }
    if (value.includes('.')) {
      const oz = value.split('.')[1];
      if (oz && parseInt(oz) > 15) {
        setInputErrors(prev => ({ ...prev, [name]: "Las onzas no pueden ser mayores a 15" }));
        return;
      }
    }
    setInputErrors(prev => ({ ...prev, [name]: null }));
    handleInputChange(e);
  };

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="mb-4 rounded-xl border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-center text-sm text-gold-300">
        <i className="bi bi-info-circle-fill me-2"></i>
        Formato: <strong>Libras.Onzas</strong> (Máx .15 onzas)
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-semibold text-white/70">Número de Pelea</label>
        <input
          name="fightNumberInput"
          type="number"
          step="1"
          value={modalFormData.fightNumberInput || ''}
          onChange={(e) => { if (/^\d*$/.test(e.target.value)) handleInputChange(e); }}
          onKeyDown={handleKeyDownInteger}
          required
          className={inputCls(inputErrors.fightNumberInput)}
        />
        {inputErrors.fightNumberInput && (
          <p className="mt-1 text-xs text-danger-soft">{inputErrors.fightNumberInput}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-danger-soft">Peso Rojo (L.OZ)</label>
          <input
            name="weight1Input"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={modalFormData.weight1Input ?? ''}
            onChange={onWeightChange}
            onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }}
            className={inputCls(inputErrors.weight1Input)}
          />
          {inputErrors.weight1Input && (
            <p className="mt-1 text-xs text-danger-soft">{inputErrors.weight1Input}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-success-soft">Peso Verde (L.OZ)</label>
          <input
            name="weight2Input"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={modalFormData.weight2Input ?? ''}
            onChange={onWeightChange}
            onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }}
            className={inputCls(inputErrors.weight2Input)}
          />
          {inputErrors.weight2Input && (
            <p className="mt-1 text-xs text-danger-soft">{inputErrors.weight2Input}</p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center text-xs text-white/55">
        <p className="mb-0"><strong className="text-white/75">Info:</strong> Las gallerías se gestionan en el panel de rondas.</p>
        <p className="mb-0"><strong className="text-white/75">Ejemplo:</strong> 4.08 equivale a 4 libras con 8 onzas.</p>
      </div>
    </div>
  );
};

export default FightForm;
