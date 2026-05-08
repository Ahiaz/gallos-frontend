/*
fightService
Descripcion: Servicio para manejar lo relacionado a las rondas
Autor: Jose Ahias Vargas Pacheco
*/

import api from './axiosConfig';

class fightService {

  /**
 *function: fetchLiveFightByRoundId
 * Descripción: obtiene la pelea activa
 * roundId
 */
  static async fetchLiveFightByRoundId(data, token) {

    const endpoint = '/api/fights/live';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener la pelea:", error);
      return { "code": 500, "message": "Error al obtener la pelea" };
    }



  }


  /**
 *function: fetchFightsByRoundId
 * Descripción: obtiene todas las peleas de una ronda
 * roundId
 */
  static async fetchFightsByRoundId(data, token) {

    const endpoint = '/api/fights/roundId';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener las peleas:", error);
      return { "code": 500, "message": "Error al obtener las peleas" };
    }



  }


  /**
   *function: fetchScoreBoardByFightId
   * Descripción: obtiene el scoreBoard de la pelea
   * fightId
   */
  static async fetchScoreBoardByFightId(data, token) {

    const endpoint = '/api/fights/scoreBoard';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener el scoreBoard:", error);
      return { "code": 500, "message": "Error al obtener el scoreBoard" };
    }



  }


  /**
 *function: createFight
 * Descripción: crea la pelea
 * data.roundId, data.number, data.weight1, data.weight2 data.gallery1Id, data.gallery2Id
 */
  static async createFight(data, token) {

    const endpoint = '/api/fights/insert';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al crear la pelea:", error);
      return { "code": 500, "message": "Error al crear la pelea" };
    }



  }


  /**
 *function: updateFight
 * Descripción: actualiza la pelea
    data.number,
    data.weight1,
    data.weight2,
    data.gallery1Id, //si no ha iniciado la pelea
    data.gallery2Id, // si no ha iniciado la pelea
    data.fightId
 */
  static async updateFight(data, token) {

    const endpoint = '/api/fights/update';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al actualizar la pelea:", error);
      return { "code": 500, "message": "Error al actualizar la pelea" };
    }



  }



  /**
 *function: openFight
 * Descripción: abre la pelea
 * data.roundId,
   data.fightId,
 */
  static async openFight(data, token) {

    const endpoint = '/api/fights/open';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al abrir la pelea:", error);
      return { "code": 500, "message": "Error al abrir la pelea" };
    }



  }


  /**
 *function: inProgressFight
 * Descripción: coloca la pelea en progreso
   data.fightId,
 */
  static async inProgressFight(data, token) {

    const endpoint = '/api/fights/progress';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al colocar en progreso la pelea:", error);
      return { "code": 500, "message": "Error al colocar en progreso la pelea" };
    }



  }


  /**
 *function: cancelFight
 * Descripción: cancela la pelea
 * data.fightId,
 */
  static async cancelFight(data, token) {

    const endpoint = '/api/fights/cancel';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al cancelar la pelea:", error);
      return { "code": 500, "message": "Error al cancelar la pelea" };
    }



  }




  /**
 *function: resolveFight
 * Descripción: resuelve la pelea
 * data.fightId,
 * data.scoreA,
 * data.scoreB,
 */
  static async resolveFight(data, token) {

    const endpoint = '/api/fights/resolve';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al resolver la pelea:", error);
      return { "code": 500, "message": "Error al resolver la pelea" };
    }



  }


  /**
 *function: saveMatchMaking
 * Descripción: guarda los pareos de galleros
 * data.roundId,
   data.matches,
 */
  static async saveMatchMaking(data, token) {

    const endpoint = '/api/fights/match-making';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al realizar los pareos:", error);
      return { "code": 500, "message": "Error al parear la pelea" };
    }



  }



}

export default fightService