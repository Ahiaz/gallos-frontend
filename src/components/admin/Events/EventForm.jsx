/*
Componente: EventForm.jsx
Descripción: Utilizado para crear o editar datos del evento, integrado con useModal y lógica de tipos.
Autor: Jose Ahias Vargas
*/

import { useEffect, useRef } from "react";
import { useModal } from "../../../hooks/useModal";
import eventStyles from './styles/EventForm.module.css';
import { STREAMING_EVENT, EVENT_TYPE } from "../../../constants/eventConstants";
import { useToast } from "../../../hooks/useToast";
import { useDateFormatter } from "../../../hooks/useDateFormatter";
import { TOAST } from "../../../constants/toastConstants";

const inputCls = (error) =>
  `w-full rounded-xl border bg-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-0 ${error ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/70'}`;

const selectCls = () =>
  `w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-3 py-2 text-sm text-white focus:border-gold-400/70 focus:outline-none focus:ring-0`;

const labelCls = "mb-1 block text-xs font-semibold text-white/70";

const EventForm = ({ event = null, activity = null }) => {
  const {
    modalFormData,
    inputErrors,
    setModalFormData,
    handleInputChange
  } = useModal();

  const { formatToInput } = useDateFormatter();
  const { setToastProps } = useToast();
  const MAX_SIZE = 2 * 1024 * 1024;
  const fileInputRef = useRef(null);
  const isLocked = activity?.isLocked;

  useEffect(() => {
    if (event) {
      setModalFormData((prev) => ({
        ...prev,
        nameInput: event.name || "",
        typeInput: event.type || EVENT_TYPE.DERBY,
        bannerInput: event.banner || null,
        bannerPreview: event.banner ? `${import.meta.env.VITE_API_URL}${event.banner}` : null,
        startsAtInput: event.starts_at ? formatToInput(event.starts_at) : "",
        streamUrlInput: event.stream_url || "",
        streamTypeInput: event.stream_type || STREAMING_EVENT.M3U8,
        totalRoundsInput: event.gallos_amount || 1,
        idEventInput: event.id || null
      }));
    } else {
      setModalFormData(() => ({
        nameInput: "",
        typeInput: EVENT_TYPE.DERBY,
        bannerInput: null,
        bannerPreview: null,
        startsAtInput: "",
        streamUrlInput: "",
        streamTypeInput: STREAMING_EVENT.M3U8,
        totalRoundsInput: 4,
        idEventInput: null
      }));
    }
  }, [event, formatToInput, setModalFormData]);

  useEffect(() => {
    if (modalFormData.typeInput && modalFormData.typeInput !== EVENT_TYPE.DERBY) {
      setModalFormData(prev => ({ ...prev, totalRoundsInput: 1 }));
    }
  }, [modalFormData.typeInput, setModalFormData]);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setToastProps({ message: "Solo se permiten imágenes", type: TOAST.DANGER });
      return;
    }
    if (file.size > MAX_SIZE) {
      setToastProps({ message: "La imagen no puede superar 2MB", type: TOAST.DANGER });
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setModalFormData(prev => ({ ...prev, bannerInput: file, bannerPreview: previewUrl }));
  };

  return (
    <div className="animate__animated animate__fadeIn space-y-3">
      {/* Banner */}
      <div className="text-center">
        <label className={`${labelCls} mb-2`}>Banner del evento</label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={eventStyles.uploadContainer}
        >
          {modalFormData.bannerPreview ? (
            <img src={modalFormData.bannerPreview} alt="Preview" className={eventStyles.bannerPreviewImg} />
          ) : (
            <div className="text-white/45 border-2 border-dotted border-gray-500 p-4 rounded-md cursor-pointer">
              <div className="font-bold">Arrastra una imagen aquí</div>
              <small>o haz click para seleccionar</small><br />
              <small>(Máximo 2MB)</small>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      {/* Nombre */}
      <div>
        <label className={labelCls}>Nombre del evento</label>
        <input
          name="nameInput"
          type="text"
          placeholder="Nombre del evento"
          value={modalFormData.nameInput || ""}
          onChange={handleInputChange}
          required
          className={inputCls(inputErrors.nameInput)}
        />
        {inputErrors.nameInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.nameInput}</p>}
      </div>

      {/* Tipo + Cantidad */}
      <div className={`grid gap-3 ${modalFormData.typeInput === EVENT_TYPE.LIBRE ? '' : 'sm:grid-cols-2'}`}>
        {!isLocked && (
          <div>
            <label className={labelCls}>Tipo de Evento</label>
            <select name="typeInput" value={modalFormData.typeInput || ""} onChange={handleInputChange} className={selectCls()}>
              {Object.values(EVENT_TYPE).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}
        {modalFormData.typeInput !== EVENT_TYPE.LIBRE && (
          <div>
            <label className={labelCls}>Cant. Gallos (rondas)</label>
            <input
              name="totalRoundsInput"
              type="number"
              step="1"
              min="1"
              placeholder="Cant. Gallos"
              value={modalFormData.totalRoundsInput || ""}
              disabled={modalFormData.typeInput !== EVENT_TYPE.DERBY}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                handleInputChange({ target: { name: 'totalRoundsInput', value: isNaN(val) ? "" : val } });
              }}
              onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault(); }}
              className={`${inputCls(inputErrors.totalRoundsInput)} disabled:opacity-40`}
            />
            {inputErrors.totalRoundsInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.totalRoundsInput}</p>}
          </div>
        )}
      </div>

      {/* Fecha */}
      <div>
        <label className={labelCls}>Fecha de inicio</label>
        <input
          name="startsAtInput"
          type="date"
          value={modalFormData.startsAtInput || ""}
          onChange={handleInputChange}
          required
          className={inputCls(inputErrors.startsAtInput)}
        />
      </div>

      {/* Stream URL */}
      <div>
        <label className={labelCls}>URL del stream</label>
        <input
          name="streamUrlInput"
          type="text"
          value={modalFormData.streamUrlInput || ""}
          onChange={handleInputChange}
          className={inputCls(false)}
        />
      </div>

      {/* Tipo Stream */}
      <div>
        <label className={labelCls}>Tipo de Stream</label>
        <select name="streamTypeInput" value={modalFormData.streamTypeInput || ""} onChange={handleInputChange} className={selectCls()}>
          <option value={STREAMING_EVENT.M3U8}>{STREAMING_EVENT.M3U8}</option>
        </select>
      </div>
    </div>
  );
};

export default EventForm;
