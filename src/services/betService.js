/*
betService
Descripcion: Servicio para manejar lo relacionado a las apuestas
Autor: Jose Ahias Vargas Pacheco
*/

import api from './axiosConfig';

class BetService {


  /**
   *function: fetchBetTransactions
   * Descripción: obtiene las apuestas de los usuarios
   * filters
   */
  static async fetchBetTransactions(data, token) {

    const endpoint = '/api/bets/transactions';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener los movimientos de la apuesta", error);
      return { "code": 500, "message": "Error al obtener los movimientos de la apuesta" };
    }



  }


  /**
   *function: fetchBetByRoundId
   * Descripción: obtiene las apuestas por ronda
   * roundId
   */
  static async fetchBetByRoundId(data, token) {

    const endpoint = '/api/bets/bets-round';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener las apuestas por ronda", error);
      return { "code": 500, "message": "Error al obtener las apuestas por ronda" };
    }



  }



    /**
   *function: fetchBetAmountByRoundId
   * Descripción: obtiene la cant de apuestas por ronda
   * roundId
   */
  static async fetchBetAmountByRoundId(data, token) {

    const endpoint = '/api/bets/bets-round-amount';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener la cantidad de apuestas por ronda", error);
      return { "code": 500, "message": "Error al obtener la cantidad de apuestas por ronda" };
    }



  }
 

  /**
   *function: findLiveBetDataByFightLive
   * Descripción: obtiene las apuestas en vivo por pelea en vivo
   * fightId
   */
  static async findLiveBetDataByFightLive(data, token) {

    const endpoint = '/api/bets/live';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener las apuestas en vivo por pelea", error);
      return { "code": 500, "message": "Error al obtener las apuestas en vivo por pelea" };
    }



  }


  /**
   *function: fetchBetHistory
   * Descripción: obtiene el historico de las apuestas del usuario
   * userId
   */
  static async fetchBetHistory(data, token) {

    const endpoint = '/api/bets/history-user';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener el historico de las apuestas", error);
      return { "code": 500, "message": "Error al obtener el historico de apuestas" };
    }



  }


  /**
   *function: fetchFilterBetHistory
   * Descripción: filtra el historial de apuestas por usuario y evento
   * userId
   * eventId
   * fightId
   */
  static async fetchFilterBetHistory(data, token) {

    const endpoint = '/api/bets/filter-history';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener el filtro historico de las apuestas", error);
      return { "code": 500, "message": "Error al obtener el filtro historico de apuestas" };
    }



  }



  /**
   *function: fetchPools
   * Descripción: obtiene los pools de la pelea
   * fightId
   */
  static async fetchPools(data, token) {

    const endpoint = '/api/bets/pool';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener el fondo de las apuestas:", error);
      return { "code": 500, "message": "Error al obtener el fondo de las apuestas" };
    }



  }


  /**
   *function: placeBet
   * Descripción: coloca una apuesta
   * { userId, fightId, amount, side, oddType }
   */
  static async placeBet(data, token) {

    const endpoint = '/api/bets/place';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al iniciar el evento:", error);
      return { "code": 500, "message": "Error al iniciar el evento" };
    }



  }


}

export default BetService