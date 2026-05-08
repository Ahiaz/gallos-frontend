/*
ForgotContainer
Descripción: Contenedor para la recuperacion de credenciales de la aplicacion.
UseMemo: memoriza un valor calculado (de una funcion u objeto) para evitar renderizarlo innecesariamente si no ha cambiado sus dependencias
Util si se usa en objetos que no sean hooks (useState) y tenga un tamaño considerable, de lo contrario lo que hace es consumir memoria sin beneficio
UseCallback: memoriza la funcion para evitar recrearla en cada renderizado si no han cambiado sus dependencias
Util en funciones que se ejecuten en cada renderizado (dentro de un useEffect, timers, o directamente en el cuerpo del componente, y su recalculo es costoso
UseRef guarda la referencia al elemento para evitar re-renderizados, solamente cuando uno lo cambie
Excelente para asignar elementos del DOM a variables y no tener que volver a renderizar el componente
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/
import { useState, useRef} from 'react';
import Forgot from '../../components/Login/Forgot';
import LoginService from '../../services/loginService';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import 
{
TOAST 
} from "../../constants/toastConstants";

import {STATUS} from "../../constants/statusConstants";



const ForgotContainer = () => {

    const {setToastProps} = useToast();

    const [formValidated, setFormValidated] = useState(false);

    const formRef = useRef(null);

    const [forgotSuccess, setForgotSuccess] = useState(false); 

    const [formValues, setFormValues] = useState({
      emailInput: '',
    });

    const navigate = useNavigate();

  
    /*
    Funcion: handleSubmit
    Descripcion: obtiene el submit del formulario de forgot
    Autor: Jose Ahias Vargas
    */

    const handleSubmit = async (e) => {
      e.preventDefault();
      const form = formRef.current;
  
      setFormValidated(true);

      if (!form.checkValidity()) {
      e.stopPropagation();
      return;
      } else {
  
        const json = {
          email: formValues.emailInput
        };
  
        const result = await LoginService.forgot(json);
  
        if(STATUS.OK === result.code) {

          setToastProps({ message: "Credenciales recuperadas con exito", type: TOAST.SUCCESS });
          setForgotSuccess(true);
        }
        else{

        setToastProps({ message: result.message, type: TOAST.DANGER });
      }
  
      }
  
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
          <Forgot 
          forgotSuccess={forgotSuccess}
          formValidated={formValidated}
          formRef={formRef}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleLogin={handleLogin}

          />
    
        </div>
      );

    }
export default ForgotContainer;