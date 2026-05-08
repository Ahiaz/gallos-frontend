/*
Componente: Reset.jsx
Descripción: Componente que muestra el formulario de reset de contraseña.
UseMemo: memoriza un valor calculado (de una funcion u objeto) para evitar renderizarlo innecesariamente si no ha cambiado sus dependencias
Util si se usa en objetos que no sean hooks (useState) y tenga un tamaño considerable, de lo contrario lo que hace es consumir memoria sin beneficio
UseCallback: memoriza la funcion para evitar recrearla en cada renderizado si no han cambiado sus dependencias
Util en funciones que se ejecuten en cada renderizado (dentro de un useEffect, timers, o directamente en el cuerpo del componente, y su recalculo es costoso
Reset.module.css : se aplica unicamente al componente
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

//import resetStyles from './styles/Reset.module.css';
import styles from '../../styles/general.module.css';

const Reset = ({ resetSuccess, resetLoading, passwordsMatch, formValidated, sendButtonRef, handleSubmit, handleInputChange, handleLogin}) => {
    

  return (

<div className={`${styles.container} ${styles.primaryBgImage}`}>
  <div className={`border p-4 form-content ${styles.centerContent} ${styles.formContent} ${styles.box}`}>

    {resetSuccess ? (

<div className="alert alert-success" role="alert">
  <h5 className="alert-heading">Cambio exitoso!</h5>
  <p className={`form-label ${styles.labelForm}`}>Se cambio la clave del usuario de forma exitosa!!.</p>
  <hr/>
  <button id="btnLogin" type="button" onClick={handleLogin} className={`btn ${styles.btnWarning} w-100 p-3`}>Ir al Login</button>
</div>

    ) : (

  <div className="col-12 col-md-8 col-lg-6 mx-auto d-inline">

<div className="d-flex">
      
<svg role="button" onClick={handleLogin} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
</svg>

    <h4 className="text-center mb-4 ms-3">Cambiar clave de usuario</h4>
</div>

  <form id="resetForm" className={`${formValidated ? 'was-validated' : ''}`} noValidate onSubmit={handleSubmit}>
    
  <div className="form-floating mb-3">
    <input
      name="password"
      id="password"
      type="password"
      className="form-control"
      onChange={handleInputChange}
      required
    />
    <label htmlFor="password" className={`form-label ${styles.labelForm}`}>Contraseña</label>
  </div>

    <div className="form-floating mb-3">
    <input
      name="confirmPassword"
      id="confirmPassword"
      type="password"
      className="form-control"
      onChange={handleInputChange}
      required
    />
    <label htmlFor="confirmPassword" className={`form-label ${styles.labelForm}`}>Confirmar contraseña</label>
    {passwordsMatch === false && (
      <div className="invalid-feedback d-block">
        Las contraseñas no coinciden.
      </div>
    )}
  </div>
    
    
    <button id="resetSubmit" ref={sendButtonRef} type="submit" className={`btn ${styles.btnWarning} w-100 p-3`}>
      {resetLoading ? (
        <>
          <div className="spinner-border spinner-border-sm text-light" role="status"></div>
          <span className="me-4 ps-1">Enviando</span>
        </>
      ) : (
        <span className="me-4 ps-1">Cambiar</span>
      )}
    </button>
    
  </form>
</div>


    )}
  </div>
</div>
  

)



};

 

export default Reset;