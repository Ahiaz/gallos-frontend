/**
 * showAuthModalFn
 * Descripcion: Para utilizar un modal de autentificacion en cualquier parte del proyecto
 * se encarga de asignar una funcion del modalContext para que sea llamada en cualquier parte que se importe modalUtils
 * Autor: Jose Ahias Vargas
 */

let showAuthModalFn = () => {};

export const setShowAuthModal = (fn) => {
  showAuthModalFn = fn;
};

/*muestra la funcion asignada*/
export const showAuthModal = () => {
  if (showAuthModalFn) showAuthModalFn();
};
