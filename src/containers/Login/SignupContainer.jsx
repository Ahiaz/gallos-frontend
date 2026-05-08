/*
Componente: SignupContainer.jsx
Descripción: Contenedor para hacer un nuevo usuario en la aplicacion.
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
import Signup from '../../components/Login/Signup';
import UserService from '../../services/userService';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import {
  TOAST
} from "../../constants/toastConstants";

import { STATUS } from "../../constants/statusConstants";


const SignupContainer = () => {

  const { setToastProps } = useToast();

  const [formValidated, setFormValidated] = useState(false);

  const formRef = useRef(null);

  const [signupSuccess, setSignupSuccess] = useState(false);


  const [formValues, setFormValues] = useState({
    userInput: '',
    nameInput: '',
    emailInput: '',
    passInput: '',
  });


  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState('');
  const [imageFile, setImageFile] = useState(null);


  const navigate = useNavigate();


  /*
  Función: handleAvatarChange
  Descripcion: Utilizado para manejar el cambio de imagen de avatar
  Autor: Jose Ahias Vargas

  */

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 1024 * 1024) { // 1MB
        setAvatarError('La imagen no puede superar 1MB.');
        setAvatarPreview(null);
        setImageFile(null);
        return;
      }

      setAvatarError('');
      setImageFile(file); // Guardas el archivo directamente

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /*
  Función: handleSubmit
  obtiene el submit del formulario de signup
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
        username: formValues.userInput,
        name: formValues.nameInput,
        email: formValues.emailInput,
        pass: formValues.passInput,
      };

      const result = await UserService.insertNewUser(json, imageFile);


      if (STATUS.OK === result.code) {

        setToastProps({ message: "Usuario creado correctamente", type: TOAST.SUCCESS });
        setSignupSuccess(true);

      }
      else{

        setToastProps({ message: result.message, type: TOAST.DANGER });
        setSignupSuccess(false);

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

    setFormValues((prev) => ({
      ...prev,
      [name]: value
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
      <Signup
        signupSuccess={signupSuccess}
        formValidated={formValidated}
        formRef={formRef}
        avatarError={avatarError}
        avatarPreview={avatarPreview}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleLogin={handleLogin}
        handleAvatarChange={handleAvatarChange}

      />

    </div>
  );

}
export default SignupContainer;