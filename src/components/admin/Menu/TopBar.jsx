/*
TopBar
Descripcion: Menu de barra ubicada en la parte de arriba de la pagina
Autor: Jose Ahias Vargas Pacheco
*/

import { useMenu } from '../../../hooks/useMenu';
import { useSecurity } from '../../../hooks/useSecurity';

const TopBar = () => {
    const { toggleMenu } = useMenu();
    const { name } = useSecurity();
    const firstName = name ? (name.trim().split(/\s+/)[0]).toUpperCase() : "";

    return (
       <div className="bg-[linear-gradient(90deg,#0b0b0b_0%,#181818_52%,#0b0b0b_100%)] shadow-[0_10px_35px_rgba(0,0,0,0.28)] backdrop-blur border-b-1 border-gold-400/25"> 
        <nav className="w-[92%] mx-auto px-0 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.28)] ">
            <div className="px-3 sm:px-5 flex items-center justify-between">

                <div className="m-0">
                    <div className="flex flex-col leading-none">
                        <div className="flex items-center text-[clamp(1.45rem,4vw,2.55rem)] font-black tracking-[0.08em]">
                            <span className="mr-1.5 text-white">EL</span>
                            <span className="bg-[linear-gradient(180deg,#f4d77c,#b8860b)] bg-clip-text text-transparent">DORADO</span>
                        </div>
                        <div className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/55 sm:text-[0.65rem]">
                            TRADICIÓN, HONOR Y PASIÓN MEXICANA.
                        </div>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2 sm:gap-4">
                    <div className="hidden items-center gap-2 text-sm font-medium text-white/80 md:flex">
                        <i className="bi bi-person-circle text-2xl text-gold-400"></i>
                        <span className="tracking-wide">BIENVENIDO, <b>{firstName}</b></span>
                    </div>

                    <div className="hidden border border-gold-400/25 bg-white/[0.06] px-3 py-2 text-right shadow-inner shadow-black/20 sm:block">
                        <div className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/55">ADMINISTRATIVO</div>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 border border-gold-400/70 bg-transparent px-3 py-2 text-sm font-bold uppercase tracking-[0.08em] text-gold-400 transition hover:bg-gold-400 hover:text-black"
                        onClick={toggleMenu}
                    >
                        <i className="bi bi-list text-base"></i>
                        <span className="hidden sm:inline">Menu</span>
                    </button>
                </div>
            </div>
        </nav>
      </div>
    );
};

export default TopBar;
