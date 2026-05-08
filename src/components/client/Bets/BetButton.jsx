/*
Componente: BetButton.jsx
Descripción: Overlay de apuestas sobre el video con botón centrado
Autor: Jose Ahias Vargas
*/
import styles from './styles/BetButton.module.css';

const BetButton = ({ onClick }) => {
  return (
    <>
      {/* Overlay oscuro sobre todo el video */}
      <div
        className="absolute inset-0 z-40 cursor-pointer bg-black/90 backdrop-blur-[2px]"
        onClick={onClick}
      />

      {/* Contenido centrado sobre el overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center gap-5">

        {/* Botón principal */}
        <button
          className={`pointer-events-auto flex flex-col items-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#d4af37_0%,#8a6d29_100%)] px-14 py-8 transition-transform duration-200 hover:scale-105 hover:brightness-110 active:scale-95 sm:px-20 sm:py-10 ${styles.pulse}`}
          onClick={onClick}
          title="Realizar Apuesta"
        >
          <i className="bi bi-cash-coin text-5xl text-black sm:text-6xl" />
          <div className="flex flex-col items-center leading-tight">
            <span className="text-2xl font-black uppercase tracking-[0.18em] text-black sm:text-3xl">
              APUESTAS
            </span>
            <span className="text-2xl font-black uppercase tracking-[0.18em] text-black sm:text-3xl">
              ABIERTAS
            </span>
          </div>
        </button>

        {/* Indicador sutil */}
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/50">
          Toca para apostar
        </p>
      </div>
    </>
  );
};

export default BetButton;
