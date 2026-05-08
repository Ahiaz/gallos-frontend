/*
SideMenu
Descripcion: Menu de lado derecho de la pagina para el admin
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
    { path: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/admin/users', icon: 'bi-people', label: 'Usuarios y Billetera' },
    { path: '/admin/events', icon: 'bi-calendar-check', label: 'Eventos' },
    { path: '/admin/rounds', icon: 'bi-shield-shaded', label: 'Rondas' },
    { path: '/admin/profit', icon: 'bi-cash-stack', label: 'Ganancias de Casa' },
    { path: '/admin/statement', icon: 'bi-cash-stack', label: 'Estado de cuenta' },
    { path: '/admin/request', icon: 'bi-cash-coin', label: 'Solicitudes' },
    { path: '/admin/history', icon: 'bi-bar-chart', label: 'Historial de Apuestas' },
    { path: '/admin/news', icon: 'bi-newspaper', label: 'Noticias' },
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
            <span>Administración</span>
            <small>Operación y control</small>
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
