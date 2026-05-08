/*
Componente: Login.jsx
Descripción: Componente que muestra el formulario de Login.
Autor: Jose Ahias Vargas
*/

import LoadingButton from '../common/LoadingButton';

const Login = ({
  formValues,
  errors,
  handleInputChange,
  handleSubmit,
  handleForgot,
  isLoading
}) => {

  const inputCls = (field) =>
    `h-12 w-full rounded-xl border bg-white/[0.08] px-4 text-white shadow-inner shadow-black/20 placeholder:text-white/35 focus:bg-white/[0.11] focus:shadow-none focus:outline-none transition ${errors[field] ? 'border-danger-soft' : 'border-white/10 focus:border-gold-400/80'}`;

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-brand-950 bg-[url('/images/bg-login.jpg')] bg-cover bg-center px-4 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.18),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.58),rgba(0,0,0,0.92))]" />

      <div className="relative w-full max-w-[390px] overflow-hidden border border-white/12 bg-black/62 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.62)] backdrop-blur-md sm:p-7">
        <div className="mb-7 text-center">
          <div className="mb-2 flex justify-center text-[2rem] font-black leading-none tracking-[0.08em]">
            <span className="mr-1.5 text-white">EL</span>
            <span className="bg-[linear-gradient(180deg,#f4d77c,#b8860b)] bg-clip-text text-transparent">DORADO</span>
          </div>
          <p className="mb-0 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/50">
            Tradición, honor y pasión mexicana
          </p>
        </div>

        <div className="mb-5">
          <h4 className="mb-1 text-xl font-bold text-white">Inicio de sesión</h4>
          <p className="mb-0 text-sm text-white/55">Ingresa con tu usuario o correo para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-gold-300/80">
              Usuario o correo
            </label>
            <input
              type="text"
              name="loginInput"
              placeholder="Email o Usuario"
              value={formValues.loginInput}
              onChange={handleInputChange}
              className={inputCls('loginInput')}
            />
            {errors.loginInput && <p className="mt-1 text-sm text-danger-soft">{errors.loginInput}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-gold-300/80">
              Contraseña
            </label>
            <input
              type="password"
              name="passInput"
              placeholder="Contraseña"
              value={formValues.passInput}
              onChange={handleInputChange}
              className={inputCls('passInput')}
            />
            {errors.passInput && <p className="mt-1 text-sm text-danger-soft">{errors.passInput}</p>}
          </div>

          <LoadingButton
            id="loginSubmit"
            type="submit"
            className="!mt-2 !flex !w-full !items-center !justify-center !rounded-xl !border-0 !bg-[linear-gradient(180deg,#f4d77c,#b8860b)] !p-3.5 !font-black !uppercase !tracking-[0.08em] !text-black !shadow-[0_12px_28px_rgba(212,175,55,0.22)] transition hover:!-translate-y-0.5 hover:!bg-[linear-gradient(180deg,#ffe59a,#d4af37)] disabled:!cursor-not-allowed disabled:!opacity-60"
            loadingText=" Verificando"
            isLoading={isLoading}
          >
            Iniciar sesión
          </LoadingButton>
        </form>

        <button
          type="button"
          onClick={handleForgot}
          className="!mt-5 !hidden !w-full !bg-transparent !p-0 !text-center !text-sm !font-semibold !text-gold-300/80 hover:!border-transparent hover:!text-gold-300"
        >
          ¿Olvidó su contraseña?
        </button>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      </div>
    </div>
  );
};

export default Login;
