/*
loginService
Descripcion: Servicio para manejar lo relacionado al login
Autor: Jose Ahias Vargas Pacheco
*/

import api from './axiosConfig';

class LoginService {

/**
 *function: doApplicationLogin
 * Descripción: login en la aplicacion con un usuario creado en el sistema
 */
static async doApplicationLogin(data) {

  const endpoint = '/api/auth/login';

  try {
    const response = await api.post(endpoint, data);

    return response;
  } catch (error) {
    console.error("Error Login:", error);
    return {"code":500, "message": "Error al autentificar el usuario"};
  }    



}

}

export default LoginService