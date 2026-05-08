/*
Componente: RoundForm.jsx
Descripción: Utilizado para crear o editar datos de la ronda
Autor: Jose Ahias Vargas
*/

import { useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import { useNumberValidation } from "../../../hooks/useNumberValidation";

const RoundForm = ({ round = null }) => {
  const {
    modalFormData,
    inputErrors,
    setModalFormData,
    handleInputChange,
    setInputErrors
  } = useModal();

  const { handleKeyDownInteger, validateRange } = useNumberValidation(setInputErrors);

  useEffect(() => {
    if (round) {
      setModalFormData((prevData) => ({
        ...prevData,
        roundNumberInput: round.number || null,
        idRoundInput: round.id || null
      }));
    } else {
      setModalFormData(() => ({
        roundNumberInput: "",
        idRoundInput: null
      }));
    }
  }, [round, setModalFormData]);

  const onRoundNumberChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      handleInputChange(e);
      validateRange(name, value, 1, 100);
    }
  };

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="mb-3">
        <label className="mb-1 block text-xs font-semibold text-white/70" htmlFor="roundNumberInput">
          Número de ronda
        </label>
        <input
          name="roundNumberInput"
          id="roundNumberInput"
          type="number"
          step="1"
          placeholder="Número entero válido"
          value={modalFormData.roundNumberInput || ''}
          onChange={onRoundNumberChange}
          onKeyDown={handleKeyDownInteger}
          required
          className={`w-full rounded-xl border bg-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-0 ${inputErrors.roundNumberInput ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/70'}`}
        />
        {inputErrors.roundNumberInput && (
          <p className="mt-1 text-xs text-danger-soft">{inputErrors.roundNumberInput}</p>
        )}
      </div>
    </div>
  );
};

export default RoundForm;
