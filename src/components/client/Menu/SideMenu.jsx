/*
SideMenu
Descripcion: Menu de lado derecho de la pagina para el client
Autor: Jose Ahias Vargas Pacheco
*/

import { useMenu } from '../../../hooks/useMenu';
import styles from './styles/SideMenu.module.css';
import { useSecurity } from '../../../hooks/useSecurity';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SideMenu = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const { clearUserSession } = useSecurity();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/client/events', icon: 'bi-calendar-check', label: 'Página Principal' },
    { path: '/client/live', icon: 'bi-camera-reels', label: 'Peleas En Vivo' },
    { path: '/client/user', icon: 'bi-person-circle', label: 'Datos de usuario' },
    { path: '/client/history', icon: 'bi-bar-chart', label: 'Historial de Apuestas' },
    { path: '/client/statement', icon: 'bi-layout-text-sidebar-reverse', label: 'Estado de Cuenta' },
    { path: '/client/request', icon: 'bi-cash-coin', label: 'Créditos, Depósitos y Retiros' },
  ];

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [menuOpen]);

  const handleLinkClick = (path) => {
    toggleMenu();
    navigate(path);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    clearUserSession();
    navigate('/login');
  };

  return (
    <>
      {menuOpen && (
        <div className={styles.overlay} onClick={toggleMenu} />
      )}

      <div className={`${styles.sideMenu} ${menuOpen ? styles.open : styles.closed}`}>
        <div className={styles.navList}>
          <div className={styles.closeBtnContainer}>
            <button type="button" className={styles.closeBtn} onClick={toggleMenu}>✕</button>
          </div>

          <div className={styles.menuHeader}>
            <span>Usuario</span>
            <small>Panel principal</small>
          </div>

          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleLinkClick(item.path)}
                className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className={`${styles.navLink} ${styles.logoutLink}`}
          >
            <i className="bi bi-box-arrow-in-left"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
