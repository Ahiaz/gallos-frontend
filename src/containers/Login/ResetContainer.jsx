/*
ResetContainer
Descripción: Contenedor para cambiar la contraseña del usuario.
UseMemo: memoriza un valor calculado (de una funcion u objeto) para evitar renderizarlo innecesariamente si no ha cambiado sus dependencias
Util si se usa en objetos que no sean hooks (useState) y tenga un tamaño considerable, de lo contrario lo que hace es consumir memoria sin beneficio
UseCallback: memoriza la funcion para evitar recrearla en cada renderizado si no han cambiado sus dependencias
Util en funciones que se ejecuten en cada renderizado (dentro de un useEffect, timers, o directamente en el cuerpo del componente, y su recalculo es costoso
UseRef guarda la referencia al elemento para evitar re-renderizados, solamente cuando uno lo cambie
Excelente para asignar elementos del DOM a variables y no tener que volver a renderizar el componente
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/
import { useState, useRef } from 'react';
import Reset from '../../components/Login/Reset';
import LoginService from '../../services/loginService';
import { useToast } from '../../hooks/useToast';
import { useNavigate, useParams } from 'react-router-dom';
import {
TOAST
} from "../../constants/toastConstants";

import { STATUS } from "../../constants/statusConstants";



const ResetContainer = () => {

  const { setToastProps } = useToast();

  const [formValidated, setFormValidated] = useState(false);

  const sendButtonRef = useRef(null);

  const [resetSuccess, setResetSuccess] = useState(false);

  const [resetLoading, setResetLoading] = useState(false);

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const { token} = useParams();

  const [formValues, setFormValues] = useState({
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();


  /*
  Funcion: handleSubmit
  Descripcion: obtiene el submit del formulario de reset
  Autor: Jose Ahias Vargas
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity() || !passwordsMatch) {
      e.stopPropagation();
    } else {
      sendButtonRef.current.disabled = true;
      setResetLoading(true);

      const json = {
        pass: formValues.password,
        token: token
      };

      const result = await LoginService.reset(json);

      if (STATUS.OK === result.code) {

        setToastProps({ message: "Se cambio la clave con exito", type: TOAST.SUCCESS });
        setResetSuccess(true);
      }
      else {

        setToastProps({ message: result.message, type: TOAST.DANGER });
      }

      sendButtonRef.current.disabled = false;
      setResetSuccess(false);
    }

    setFormValidated(true);
  };

  /*
  Función: handleInputChange
  Descripcion: Se encarga de guardar los datos del formulario
  Autor: Jose Ahias Vargas

  */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (name === 'confirmPassword' || name === 'password') {
      setPasswordsMatch(
        name === 'password'
          ? value === formValues.confirmPassword
          : value === formValues.password
      );
    }


  };

  /*
  Función: handleLogin
  Descripcion: navega a la pantalla de login
  Autor: Jose Ahias Vargas

  */
  const handleLogin = () => {
    navigate(`/login`);
  };


  return (
    <div>
      <Reset
        resetSuccess={resetSuccess}
        resetLoading={resetLoading}
        passwordsMatch={passwordsMatch}
        formValidated={formValidated}
        sendButtonRef={sendButtonRef}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleLogin={handleLogin}

      />

    </div>
  );

}
export default ResetContainer;