/*
Componente: LoginContainer.jsx
Descripción: Contenedor para hacer logeo en la aplicacion.
UseMemo: memoriza un valor calculado (de una funcion u objeto) para evitar renderizarlo innecesariamente si no ha cambiado sus dependencias
Util si se usa en objetos que no sean hooks (useState) y tenga un tamaño considerable, de lo contrario lo que hace es consumir memoria sin beneficio
UseCallback: memoriza la funcion para evitar recrearla en cada renderizado si no han cambiado sus dependencias
Util en funciones que se ejecuten en cada renderizado (dentro de un useEffect, timers, o directamente en el cuerpo del componente, y su recalculo es costoso
UseRef guarda la referencia al elemento para evitar re-renderizados, solamente cuando uno lo cambie
Excelente para asignar elementos del DOM a variables y no tener que volver a renderizar el componente
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/
import Login from '../../components/Login/Login';
import LoginService from '../../services/loginService';
import { useToast } from '../../hooks/useToast';
import { useSecurity } from '../../hooks/useSecurity';
import { useNavigate } from 'react-router-dom';
import 
{
TOAST 
} from "../../constants/toastConstants";

import {STATUS} from "../../constants/statusConstants";

import useForm from '../../hooks/useForm';
import { useState } from 'react';
import { ADMIN_ROLE } from '../../constants/userConstants';


const LoginContainer = () => {


  const { setToastProps } = useToast();

  const {setInitialParams} = useSecurity();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

    /*
  Función: validate
  Descripcion: validacion de campos para el formulario
  Autor: Jose Ahias Vargas

  */

  const validate = () => {
    const errors = {};
  if (!formValues.loginInput) {
    errors.loginInput = "El campo es obligatorio";
  }

  if (!formValues.passInput) {
    errors.passInput = "La contraseña es obligatoria";
  } else if (formValues.passInput.length < 5) {
    errors.passInput = "Mínimo 5 caracteres";
  }

  return errors;
};


  const {
    formValues,
    errors,
    handleInputChange,
    handleSubmit,
    /*resetForm*/
  } = useForm({
    loginInput: "",
    passInput: ""
  },
  validate

);




  /*
  Función: onLogin
  Descripcion: envia el formulario
  Autor: Jose Ahias Vargas

  */

  const onLogin = async (values) => {

    const json = {
      login: values.loginInput,
      password: values.passInput,
    };

    setLoading(true);

    const result = await LoginService.doApplicationLogin(json);

    if (STATUS.OK === result.code) {

      setToastProps({ message: "Login exitoso", type: TOAST.SUCCESS });
      setInitialParams(result.data);


      if(result.data.user.role === ADMIN_ROLE){

        navigate('/admin/dashboard');
      }
      else{

        navigate('/client/events');

      }

    } else {

      setToastProps({ message: result.message, type: TOAST.DANGER });

    }

    setLoading(false);

  };


 

  /*
  Función: handleForgot
  Descripcion: navega a la pantalla de olvido de clave
  Autor: Jose Ahias Vargas

  */
  const handleForgot = () => {


    navigate(`/forgot`);



  }


  return (
    <div>
      <Login
        formValues={formValues}
        errors={errors}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit(onLogin)}
        handleForgot={handleForgot}
        isLoading={loading}
      />

    </div>
  );

}
export default LoginContainer;