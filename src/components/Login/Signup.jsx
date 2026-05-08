/*
Componente: Signup.jsx
Descripción: Componente que muestra el formulario de signup.
UseMemo: memoriza un valor calculado (de una funcion u objeto) para evitar renderizarlo innecesariamente si no ha cambiado sus dependencias
Util si se usa en objetos que no sean hooks (useState) y tenga un tamaño considerable, de lo contrario lo que hace es consumir memoria sin beneficio
UseCallback: memoriza la funcion para evitar recrearla en cada renderizado si no han cambiado sus dependencias
Util en funciones que se ejecuten en cada renderizado (dentro de un useEffect, timers, o directamente en el cuerpo del componente, y su recalculo es costoso
Signup.module.css : se aplica unicamente al componente
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/
import signupStyles from './styles/Signup.module.css';
import styles from '../../styles/general.module.css';
import LoadingButton from '../common/LoadingButton';

const Signup = ({ signupSuccess, formValidated, formRef, avatarError, avatarPreview, handleSubmit, handleInputChange, handleLogin, handleAvatarChange }) => {


  return (

    <div className={`${styles.container} ${styles.primaryBgImage}`}>
      <div className={`border p-4 form-content ${styles.centerContent} ${styles.formContent} ${styles.box}`}>

        {signupSuccess ? (

          <div className="alert alert-success" role="alert">
            <h5 className="alert-heading">Le damos la bienvenida!</h5>
            <p>El usuario fue creado de forma exitosa, por favor recuerde guardar sus credenciales en un lugar seguro y luego proceda a iniciar sesión.</p>
            <hr />
            <button id="btnLogin" type="button" onClick={handleLogin} className={`btn ${styles.btnWarning} w-100 p-3`}>Ir al Login</button>
          </div>

        ) : (

          <div className="col-12 col-md-8 col-lg-6 mx-auto d-inline">

            <div className="d-flex">

              <svg role="button" onClick={handleLogin} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
              </svg>

              <h4 className="text-center mb-0 ms-3">Registro de Usuario</h4>
            </div>

            <form
              id="signupForm"
              className={`${formValidated ? 'was-validated' : ''}`}
              noValidate
              ref={formRef}
              >
              <div className="mb-3 text-center">
                <label
                  htmlFor="avatarInput"
                  className={`form-label ${styles.labelForm}`}
                >
                  Avatar (opcional)
                </label>

                <div className={`${signupStyles.avatarUpload} mx-auto`}>
                  <label htmlFor="avatarInput" className={`${signupStyles.avatarPreview}`}>
                    {avatarPreview ? (
                      <img
                        className="object-fit-cover w-100 h-100 rounded-circle"
                        src={avatarPreview}
                        alt="Vista previa del avatar"
                        id="avatarImg"
                      />
                    ) : (
                      <span className={`${signupStyles.avatarPlaceholder}`}>+</span>
                    )}
                  </label>

                  <input
                    type="file"
                    id="avatarInput"
                    name="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="d-none"
                  />
                </div>

                {avatarError && <div className="text-danger mt-1">{avatarError}</div>}
              </div>

              {/* Campos del formulario */}
              <div className="form-floating mb-3 mt-2">
                <input
                  name="userInput"
                  id="userInput"
                  type="text"
                  className="form-control"
                  maxLength={20}
                  onChange={handleInputChange}
                  required
                />
                <label className={styles.labelForm} htmlFor="userInput">
                  Usuario
                </label>
                <div className="valid-feedback mb-1 text-small">
                  *Nombre del jugador
                </div>
              </div>

              <div className="form-floating mb-3 mt-2">
                <input
                  name="nameInput"
                  id="nameInput"
                  type="text"
                  className="form-control"
                  maxLength={100}
                  onChange={handleInputChange}
                  required
                />
                <label className={styles.labelForm} htmlFor="nameInput">
                  Nombre
                </label>
              </div>

              <div className="form-floating mb-3">
                <input
                  name="emailInput"
                  id="emailInput"
                  type="email"
                  className="form-control"
                  onChange={handleInputChange}
                  maxLength={250}
                  required
                />
                <label className={styles.labelForm} htmlFor="emailInput">
                  Correo electrónico
                </label>
              </div>

              <div className="form-floating mb-3">
                <input
                  name="passInput"
                  id="passInput"
                  type="password"
                  className="form-control"
                  onChange={handleInputChange}
                  maxLength={50}
                  required
                />
                <label className={styles.labelForm} htmlFor="passInput">
                  Contraseña
                </label>
              </div>


                  <LoadingButton
                  id="signupSubmit"
                  type="submit"
                  className={`${styles.btnWarning} w-100 p-3`}
                  onClick={handleSubmit}
                  loadingText=" Registrando"
                >
                  Registrarse
                </LoadingButton>

            </form>
          </div>


        )}
      </div>
    </div>


  )



};



export default Signup;