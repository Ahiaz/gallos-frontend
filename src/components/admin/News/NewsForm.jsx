/*
Componente: NewsForm.jsx
Descripción: Utilizado para crear o editar datos de noticias, integrado con useModal.
Autor: Jose Ahias Vargas
*/

import { useEffect, useRef } from "react";
import { useModal } from "../../../hooks/useModal";
import newsStyles from './styles/NewsForm.module.css';
import { useToast } from "../../../hooks/useToast";
import { TOAST } from "../../../constants/toastConstants";
import { NEWS, SELECT_NEWS_STATUS } from "../../../constants/newConstants";

const inputCls = (error) =>
  `w-full rounded-xl border bg-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-0 ${error ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/70'}`;

const NewsForm = ({ news = null }) => {
  const {
    modalFormData,
    inputErrors,
    setModalFormData,
    handleInputChange
  } = useModal();

  const { setToastProps } = useToast();
  const MAX_SIZE = 2 * 1024 * 1024;
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (news) {
      setModalFormData((prev) => ({
        ...prev,
        titleInput: news.title || "",
        descriptionInput: news.description || "",
        imageInput: news.image_url || null,
        imagePreview: news.image_url ? `${import.meta.env.VITE_API_URL}${news.image_url}` : null,
        statusInput: news.status ?? NEWS.ACTIVE,
        idNewsInput: news.id || null
      }));
    } else {
      setModalFormData(() => ({
        titleInput: "",
        descriptionInput: "",
        imageInput: null,
        imagePreview: null,
        statusInput: NEWS.ACTIVE,
        idNewsInput: null
      }));
    }
  }, [news, setModalFormData]);

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
    setModalFormData(prev => ({ ...prev, imageInput: file, imagePreview: previewUrl }));
  };

  return (
    <div className="animate__animated animate__fadeIn">
      {/* Imagen */}
      <div className="mb-4 text-center">
        <label className="mb-2 block text-xs font-semibold text-white/70">Imagen de la noticia</label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={newsStyles.uploadContainer}
        >
          {modalFormData.imagePreview ? (
            <img src={modalFormData.imagePreview} alt="Preview" className={newsStyles.bannerPreviewImg} />
          ) : (
            <div className="text-white/45">
              <div className="font-bold">Arrastra una imagen aquí</div>
              <small>o haz click para seleccionar</small><br />
              <small>(Máximo 2MB)</small>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
        {inputErrors.imageInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.imageInput}</p>}
      </div>

      {/* Título */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-semibold text-white/70" htmlFor="titleInput">Título de la noticia</label>
        <input
          name="titleInput"
          id="titleInput"
          type="text"
          placeholder="Título de la noticia"
          value={modalFormData.titleInput || ""}
          maxLength={255}
          onChange={handleInputChange}
          required
          className={inputCls(inputErrors.titleInput)}
        />
        {inputErrors.titleInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.titleInput}</p>}
      </div>

      {/* Descripción */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-semibold text-white/70" htmlFor="descriptionInput">Contenido / Descripción</label>
        <textarea
          name="descriptionInput"
          id="descriptionInput"
          placeholder="Descripción"
          style={{ height: '150px' }}
          value={modalFormData.descriptionInput || ""}
          onChange={handleInputChange}
          className={`${inputCls(inputErrors.descriptionInput)} resize-none`}
        />
        {inputErrors.descriptionInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.descriptionInput}</p>}
      </div>

      {/* Estado */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-semibold text-white/70" htmlFor="statusInput">Estado de la noticia</label>
        <select
          name="statusInput"
          id="statusInput"
          value={modalFormData.statusInput ?? NEWS.ACTIVE}
          onChange={handleInputChange}
          className={`w-full rounded-xl border bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-0 ${inputErrors.statusInput ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/70'}`}
        >
          {SELECT_NEWS_STATUS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {inputErrors.statusInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.statusInput}</p>}
      </div>
    </div>
  );
};

export default NewsForm;
