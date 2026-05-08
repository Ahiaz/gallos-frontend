/*
systemService
Descripcion: Servicio para manejar lo relacionado al sistema
Autor: Jose Ahias Vargas Pacheco
*/

import api from './axiosConfig';

class SystemService {


  /**
   *function: findParamsByGroup
   * Descripción: obtiene los parametros por grupo
   * eventId
   */
  static async findParamsByGroup(data, token) {

    const endpoint = '/api/system/params';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener los parametros del grupo", error);
      return { "code": 500, "message": "Error al obtener los parametros" };
    }



  }


   
}

export default SystemService