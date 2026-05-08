/*
ClientLayout
Descripcion: Layout principal que integra el menu
Autor: Jose Ahias Vargas Pacheco
*/

import TopBar from '../components/client/Menu/TopBar';
import SideMenu from '../components/client/Menu/SideMenu';
import { useGlobalNotifications } from '../hooks/useGlobalNotifications';

const alertConfig = {
  success: {
    bar:  'border-success-soft/25 bg-success-soft/10 text-success-soft',
    icon: 'bi-check-circle-fill',
    dot:  'bg-success-soft',
  },
  danger: {
    bar:  'border-danger-soft/25 bg-danger-soft/10 text-danger-soft',
    icon: 'bi-exclamation-circle-fill',
    dot:  'bg-danger-soft',
  },
  warning: {
    bar:  'border-gold-400/25 bg-gold-400/10 text-gold-300',
    icon: 'bi-exclamation-triangle-fill',
    dot:  'bg-gold-400',
  },
  info: {
    bar:  'border-info-soft/25 bg-info-soft/10 text-info-soft',
    icon: 'bi-info-circle-fill',
    dot:  'bg-info-soft',
  },
};

const ClientLayout = ({ children }) => {
  const { notification, closeNotification } = useGlobalNotifications();

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <SideMenu />

      <main className="flex flex-1 flex-col pb-24">
        {/* Notificación global */}
        <div style={{
          minHeight: notification.show ? '64px' : '0px',
          transition: 'all 0.35s ease-in-out',
          overflow: 'hidden',
        }}>
          {notification.show && (() => {
            const cfg = alertConfig[notification.type] || alertConfig.info;
            return (
              <div className="flex justify-center px-3 pt-3 animate__animated animate__fadeInDown animate__faster">
                <div className={`flex w-full max-w-lg items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.35)] ${cfg.bar}`}>

                  {/* Ícono */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-current/10">
                    <i className={`bi ${cfg.icon} text-base`} />
                  </div>

                  {/* Mensaje */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <span className="text-xs font-bold uppercase tracking-[0.1em] opacity-60">
                      {notification.type === 'success' ? 'Éxito' :
                       notification.type === 'danger'  ? 'Alerta' :
                       notification.type === 'warning' ? 'Aviso' : 'Info'}
                    </span>
                    <span className="truncate text-sm font-semibold">{notification.message}</span>
                  </div>

                  {/* Indicador persistente */}
                  {notification.persistent && (
                    <span className={`h-2 w-2 shrink-0 rounded-full animate-pulse ${cfg.dot}`} />
                  )}

                  {/* Cerrar */}
                  <button
                    type="button"
                    onClick={closeNotification}
                    className="shrink-0 rounded-lg p-1 opacity-50 transition hover:opacity-100 hover:bg-current/10"
                  >
                    <i className="bi bi-x-lg text-sm" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Contenido principal */}
        <div className="flex-1" style={{ transition: '0.3s' }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-5">
        <div className="w-[92%] mx-auto flex flex-col items-center gap-1 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.18em]">
            <span className="text-white">EL</span>
            <span className="bg-[linear-gradient(180deg,#f4d77c,#b8860b)] bg-clip-text text-transparent">DORADO</span>
          </div>
          <p className="text-[0.6rem] text-white/30 uppercase tracking-widest">
            © {new Date().getFullYear()} &nbsp;·&nbsp; Tradición, Honor y Pasión Mexicana
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
