/*
roundService
Descripcion: Servicio para manejar lo relacionado a las rondas
Autor: Jose Ahias Vargas Pacheco
*/

import api from './axiosConfig';

class RoundService {



  /**
   *function: fetchRounds
   * Descripción: obtiene todas las rondas
   * n/a
   */
  static async fetchRounds(data, token) {

    const endpoint = '/api/rounds/all';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener rondas:", error);
      return { "code": 500, "message": "Error al obtener rondas" };
    }



  }



  /**
   *function: fetchLiveRoundByEventId
   * Descripción: obtiene la ronda que esta activa actualmente
   * eventId
   */
  static async fetchLiveRoundByEventId(data, token) {

    const endpoint = '/api/rounds/live';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener rondas en vivo:", error);
      return { "code": 500, "message": "Error al obtener rondas en vivo" };
    }



  }




  /**
   *function: fetchRoundsByEvent
   * Descripción: obtiene las rondas de un evento
   * eventId
   */
  static async fetchRoundsByEvent(data, token) {

    const endpoint = '/api/rounds/event';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener rondas por evento:", error);
      return { "code": 500, "message": "Error al obtener rondas por evento" };
    }



  }

 

  /**
   *function: startRound
   * Descripción: inicia la ronda y lo cambia a LIVE
   * eventId, roundId
   */
  static async startRound(data, token) {

    const endpoint = '/api/rounds/start';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al iniciar la ronda:", error);
      return { "code": 500, "message": "Error al iniciar la ronda" };
    }



  }


  /**
   *function: finishRound
   * Descripción: finaliza la ronda
   * eventId, roundId
   */
  static async finishRound(data, token) {

    const endpoint = '/api/rounds/finish';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al finalizar la ronda:", error);
      return { "code": 500, "message": "Error al finalizar la ronda" };
    }



  }


    /**
   *function: cancelRound
   * Descripción: cancela la ronda
   * eventId, roundId
   */
  static async cancelRound(data, token) {

    const endpoint = '/api/rounds/cancel';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al cancelar la ronda:", error);
      return { "code": 500, "message": "Error al cancelar la ronda" };
    }



  }
 

  /**
   *function: createRound
   * Descripción: crea la ronda
    eventId,
    number,
   */
  static async createRound(data, token) {

    const endpoint = '/api/rounds/insert';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al crear la ronda:", error);
      return { "code": 500, "message": "Error al crear la ronda" };
    }



  }



  /**
 *function: updateRound
 * Descripción: actualiza la ronda
 * number
   roundId,
 * 
 */
  static async updateRound(data, token) {

    const endpoint = '/api/rounds/update';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al actualizar la ronda:", error);
      return { "code": 500, "message": "Error al actualizar la ronda" };
    }



  }



 

}

export default RoundService