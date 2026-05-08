/*
userService
Descripcion: Servicio para manejar lo relacionado al usuario
Autor: Jose Ahias Vargas Pacheco
*/

import api from './axiosConfig';

class UserService {


  /**
   *function: findUserData
   * Descripción: obtiene los datos del usuario
   * userId
   */
  static async findUserData(data, token) {

    const endpoint = '/api/user/id';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener la info del usuario", error);
      return { "code": 500, "message": "Error al obtener la info del usuario" };
    }



  }



  /**
   *function: findAmountsByUser
   * Descripción: obtiene los montos de apuestas del usuario
   * userId
   */
  static async findAmountsByUser(data, token) {

    const endpoint = '/api/user/amounts';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener los montos de las apuestas del usuario", error);
      return { "code": 500, "message": "Error al obtener los montos" };
    }



  }

    /**
   *function: findAllUsersWithWallets
   * Descripción: obtiene todos los wallets de los usuarios
   * userId
   */
  static async findAllUsersWithWallets(data, token) {

    const endpoint = '/api/user/wallets';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener los wallets de los usuarios", error);
      return { "code": 500, "message": "Error al obtener la informacion de la billetera" };
    }



  }


  
   /**
   *function: createUserAmount
   * Descripción: crea un nuevo monto de apuesta para el usuario
   * userId
   * amount
   */
  static async createUserAmount(data, token) {

    const endpoint = '/api/user/insert-amount';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al ingresar el monto de la apuesta", error);
      return { "code": 500, "message": "Error al ingresa el monto" };
    }



  }


   /**
   *function: updateUser
   * Descripción: actualiza los datos del usuario
   */
  static async updateUser(data, token) {

    const endpoint = '/api/user/update';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al actualizar el usuario", error);
      return { "code": 500, "message": "Error al actualizar el usuario" };
    }



  }

   /**
   *function: createUser
   * Descripción: crea un nuevo usuario
   */
  static async createUser(data, token) {

    const endpoint = '/api/user/insert';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al crear el usuario", error);
      return { "code": 500, "message": "Error al crear el usuario" };
    }



  }




}

export default UserService