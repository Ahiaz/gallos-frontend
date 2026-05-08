/*
Componente: UserForm.jsx
Descripción: Formulario para la creación y edición de usuarios del sistema.
Autor: Jose Ahias Vargas
*/
import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { ADMIN_ROLE, USER_ROLE } from "../../constants/userConstants";
import { useSecurity } from "../../hooks/useSecurity";

const inputCls = (error) =>
  `w-full rounded-xl border bg-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-0 ${error ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/70'}`;

const selectCls = "w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-3 py-2 text-sm text-white focus:border-gold-400/70 focus:outline-none focus:ring-0";
const labelCls = "mb-1 block text-xs font-semibold text-white/70";

const UserForm = ({ userData = null }) => {
  const {
    modalFormData,
    inputErrors,
    setModalFormData,
    handleInputChange
  } = useModal();
  const { role } = useSecurity();
  const isEdit = !!userData;
  const isAdmin = role === ADMIN_ROLE ? true : false;

  useEffect(() => {
    if (isEdit) {
      setModalFormData({
        id: userData.id,
        usernameInput: userData.username || "",
        nameInput: userData.name || "",
        emailInput: userData.email || "",
        phoneInput: userData.phone || "",
        roleInput: userData.role || USER_ROLE,
        activeInput: userData.active ?? false,
        chatBlockedInput: userData.chat_blocked ?? false,
        passwordInput: ""
      });
    } else if (isAdmin && !isEdit) {
      setModalFormData({
        usernameInput: "",
        nameInput: "",
        emailInput: "",
        phoneInput: "",
        passwordInput: "",
        roleInput: USER_ROLE,
        activeInput: false,
        chatBlockedInput: false,

      });
    }
  }, [userData, setModalFormData, isEdit, isAdmin]);

  return (
    <div className="space-y-3">
      {/* Modo badge */}
      <div className="text-center">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${isEdit ? 'bg-info-soft/15 text-info-soft' : 'bg-success-soft/15 text-success-soft'}`}>
          {isEdit ? "MODO: EDICIÓN DE USUARIO" : "MODO: NUEVO USUARIO"}
        </span>
        <p className="mt-1 text-xs text-white/50">
          {isEdit ? "Actualiza la información del perfil del usuario." : "Completa todos los campos para registrar un nuevo usuario."}
        </p>
      </div>

      {/* Usuario + Nombre */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          {isEdit ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <p className="mb-0.5 text-[0.6rem] font-black uppercase tracking-wide text-white/45">ID de Usuario (No editable)</p>
              <p className="mb-0 text-sm font-black text-white">@{modalFormData.usernameInput}</p>
            </div>
          ) : (
            <div>
              <label className={labelCls} htmlFor="usernameInput">Usuario (ID)</label>
              <input name="usernameInput" id="usernameInput" type="text" placeholder="Username"
                value={modalFormData.usernameInput || ''} onChange={handleInputChange} required
                className={inputCls(inputErrors.usernameInput)} />
              {inputErrors.usernameInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.usernameInput}</p>}
            </div>
          )}
        </div>
        <div>
          <label className={labelCls} htmlFor="nameInput">Nombre Completo</label>
          <input name="nameInput" id="nameInput" type="text" placeholder="Nombre Completo"
            value={modalFormData.nameInput || ''} onChange={handleInputChange} required
            className={inputCls(inputErrors.nameInput)} />
          {inputErrors.nameInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.nameInput}</p>}
        </div>
      </div>

      {/* Email + Teléfono */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="emailInput">Correo Electrónico</label>
          <input name="emailInput" id="emailInput" type="email" placeholder="Correo Electrónico"
            value={modalFormData.emailInput || ''} onChange={handleInputChange} required
            className={inputCls(inputErrors.emailInput)} />
          {inputErrors.emailInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.emailInput}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="phoneInput">Teléfono</label>
          <input name="phoneInput" id="phoneInput" type="text" placeholder="Teléfono"
            value={modalFormData.phoneInput || ''} onChange={handleInputChange}
            className={inputCls(inputErrors.phoneInput)} />
          {inputErrors.phoneInput && <p className="mt-1 text-xs text-danger-soft">{inputErrors.phoneInput}</p>}
        </div>
      </div>

      {/* Contraseña */}
      <div>
        <label className={labelCls} htmlFor="passwordInput">
          {isEdit ? "Escriba una nueva clave para cambiarla" : "Contraseña"}
        </label>
        <input name="passwordInput" id="passwordInput" type="password" placeholder="Contraseña"
          value={modalFormData.passwordInput || ''} onChange={handleInputChange}
          className={inputCls(inputErrors.passwordInput)} />
        {isEdit && (
          <p className="mt-1 text-xs text-white/45">
            <i className="bi bi-info-circle me-1"></i>
            Deje este campo vacío para mantener la contraseña actual.
          </p>
        )}
      </div>

      {/* Rol + Estado */}

      {isAdmin && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="roleInput">Rol del Sistema</label>
            <select name="roleInput" id="roleInput" value={modalFormData.roleInput || USER_ROLE} onChange={handleInputChange} className={selectCls}>
              <option value={USER_ROLE}>Usuario Estándar</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="activeInput">Estado del Usuario</label>
            <select name="activeInput" id="activeInput" value={modalFormData.activeInput ?? true} onChange={handleInputChange} className={selectCls}>
              <option value={true}>Activo</option>
              <option value={false}>Inactivo / Suspendido</option>
            </select>
          </div>
        </div>
      )}


      {isAdmin && (
          <div className="grid gap-3 sm:grid-cols-1">

          <div>
            <label className={labelCls} htmlFor="chatBlockedInput">Estado del Chat</label>
            <select name="chatBlockedInput" id="chatBlockedInput" value={modalFormData.chatBlockedInput ?? 0} onChange={handleInputChange} className={selectCls}>
                <option value={0}>Permitido (Puede participar en el chat)</option>
                <option value={1}>Bloqueado (No puede enviar mensajes)</option>
            </select>
          </div>

        </div>
      )}


      {isAdmin && (
        <div className="rounded-xl border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-xs text-gold-300">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Sobre la inactivación:</strong> Si marca la cuenta como <i className="text-danger">Suspendida</i>, el usuario será retirado de los listados activos y no podrá iniciar sesión, pero sus datos y registros financieros se conservarán internamente para auditoría.
        </div>
      )}
    </div>
  );
};

export default UserForm;
