/*
Componente: AdminDashboard.jsx
Descripción: Gestiona los modulos del apartado administrativo
Autor: Jose Ahias Vargas
*/

import { useState, useEffect } from 'react';
import FightContainer from "../../../containers/admin/Fight/FightContainer";
import EventContainer from "../../../containers/admin/Events/EventContainer";
import RoundContainer from "../../../containers/admin/Rounds/RoundContainer";
import { ROUND_PREVIEW, ROUND } from "../../../constants/roundConstants";

const AdminDashboard = ({
  componentLoading,
  currentEvent,
  currentRound,
  handleSetCurrentEvent,
  handleSetCurrentRound
}) => {
  const [step, setStep] = useState(1);

  // Flujo automático: Al detectar cambios en el store/props, expande el siguiente paso
  useEffect(() => {
    if (currentRound) {
      setStep(3);
    } else if (currentEvent) {
      setStep(2);
    }
  }, [currentEvent?.id, currentRound?.id]);

  if (componentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <svg className="h-12 w-12 animate-spin text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-xs uppercase tracking-widest text-yellow-500/50">Cargando Panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-slate-200 font-sans antialiased pb-10">
      
      {/* HEADER */}
      <header className="bg-[#121212]/95 backdrop-blur-md   p-4 shadow-2xl">
        <div className="w-[92%] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-500">Panel Operativo</p>
            </div>
            <h4 className="text-2xl text-white tracking-tight">Administración en Vivo</h4>
          </div>

          {/* Status Quick-View */}
          <div className="flex gap-3">
            <div className="bg-black/60  px-4 py-2  flex items-center gap-3">
              <div className="text-right">
                <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Evento Seleccionado</span>
                <span className="text-sm font-bold text-yellow-500">
                  {currentEvent?.name || "NINGUNO"}
                </span>
              </div>
              <div className={`w-2 h-2 rounded-full ${currentEvent ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`}></div>
            </div>

            <div className="bg-black/60  px-4 py-2  flex items-center gap-3">
              <div className="text-right">
                <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Ronda Actual</span>
                <span className="text-sm font-bold text-white">
                  {currentRound ? `#${currentRound.number}` : "---"}
                </span>
              </div>
              <div className={`w-2 h-2 rounded-full ${currentRound ? 'bg-red-500 animate-pulse' : 'bg-zinc-700'}`}></div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT: w-[92%] para máximo aprovechamiento de espacio */}
      <main className="w-[92%] mx-auto mt-6 space-y-4">
        
        {/* PASO 1: EVENTO */}
        <section className={`group transition-all duration-300 overflow-hidden ${step === 1 ? 'border-yellow-600/40 bg-[#111111] shadow-[0_0_40px_rgba(0,0,0,0.5)]' : ' bg-[#0f0f0f] opacity-80'}`}>
          <div 
            onClick={() => setStep(1)}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 flex items-center justify-center font-bold transition-colors ${step === 1 ? 'bg-[linear-gradient(180deg,#f4d77c,#b8860b)] text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-zinc-800 text-slate-500'}`}>
                01
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest mb-0">Eventos</h4>
                <p className="text-[10px] text-slate-500 uppercase">Selección y creación de la cartelera principal</p>
              </div>
            </div>
            {step !== 1 && currentEvent && (
              <div className="flex items-center gap-2 bg-[linear-gradient(180deg,#f4d77c,#b8860b)] px-3 py-1 rounded-full border-yellow-500/20">
                <span className="text-[10px] font-bold text-black uppercase">{currentEvent.name}</span>
              </div>
            )}
          </div>
          
          <div className={`${step === 1 ? 'max-h-[1500px] p-4 ' : 'max-h-0'} overflow-hidden transition-all duration-500 ease-in-out bg-black/40`}>
            <EventContainer 
              currentEventSelected={currentEvent} 
              setCurrentEventSelected={handleSetCurrentEvent} 
            />
          </div>
        </section>

        {/* PASO 2: RONDAS */}
        <section className={`group transition-all duration-300  overflow-hidden ${!currentEvent ? 'opacity-40 grayscale pointer-events-none' : ''} ${step === 2 ? 'border-yellow-600/40 bg-[#111111] shadow-[0_0_40px_rgba(0,0,0,0.5)]' : ' bg-[#0f0f0f] opacity-80'}`}>
          <div 
            onClick={() => currentEvent && setStep(2)}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 flex items-center justify-center font-bold transition-colors ${step === 2 ? 'bg-[linear-gradient(180deg,#f4d77c,#b8860b)] text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-zinc-800 text-slate-500'}`}>
                02
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest">Rondas</h4>
                <p className="text-[10px] text-slate-500 uppercase">Configuración de turnos e inscripciones</p>
              </div>
            </div>
            {step !== 2 && currentRound && (
              <div className="flex items-center gap-2">
                <span className="rounded-full  bg-white/[0.08] px-3 py-1 text-[10px] font-bold uppercase text-white">
                  Ronda #{currentRound.number}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.08em] ${
                  currentRound.status === ROUND.LIVE     ? 'border-success-soft/30 bg-success-soft/10 text-success-soft' :
                  currentRound.status === ROUND.PENDING  ? 'border-gold-400/30 bg-gold-400/10 text-gold-300' :
                  currentRound.status === ROUND.FINISHED ? 'border-danger-soft/30 bg-danger-soft/10 text-danger-soft' :
                                                           'border-white/15 bg-white/[0.06] text-white/55'
                }`}>
                  {ROUND_PREVIEW[currentRound.status]}
                </span>
              </div>
            )}
          </div>

          <div className={`${step === 2 ? 'max-h-[1500px] p-4  ' : 'max-h-0'} overflow-hidden transition-all duration-500 ease-in-out bg-black/40`}>
            {currentEvent && (
              <RoundContainer
                currentEventSelected={currentEvent}
                currentRoundSelected={currentRound}
                onRoundChange={handleSetCurrentRound}
              />
            )}
          </div>
        </section>

        {/* PASO 3: PELEAS */}
        <section className={`group transition-all duration-300  overflow-hidden ${!currentRound ? 'opacity-40 grayscale pointer-events-none' : ''} ${step === 3 ? 'border-yellow-600/40 bg-[#111111] shadow-[0_0_40px_rgba(0,0,0,0.5)]' : ' bg-[#0f0f0f] opacity-80'}`}>
          <div 
            onClick={() => currentRound && setStep(3)}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 flex items-center justify-center font-bold transition-colors ${step === 3 ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-zinc-800 text-slate-500'}`}>
                03
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest">Control de Peleas</h4>
                <p className="text-[10px] text-slate-500 uppercase">Marcadores en tiempo real y resultados finales</p>
              </div>
            </div>
          </div>

          <div className={`${step === 3 ? 'max-h-[3000px] p-4' : 'max-h-0'} overflow-hidden transition-all duration-500 ease-in-out bg-black/40`}>
            {currentRound && (
              <FightContainer currentRoundSelected={currentRound} />
            )}
          </div>
        </section>

      </main>

    </div>
  );
};

export default AdminDashboard;