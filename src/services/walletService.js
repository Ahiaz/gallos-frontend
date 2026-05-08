/*
walletService
Descripcion: Servicio para manejar lo relacionado al usuario
Autor: Jose Ahias Vargas Pacheco
*/

import api from './axiosConfig';

class WalletService {

    /**
   *function: fetchUserWalletStatement
   * Descripción: obtiene los movimientos del wallet del usuario
   * userId
   */
  static async fetchUserWalletStatement(data, token) {

    const endpoint = '/api/wallet/statement';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener la info de movimientos del wallet", error);
      return { "code": 500, "message": "Error al obtener la info de movimientos del wallet" };
    }



  }


    /**
   *function: fetchHouseProfit
   * Descripción: obtiene las ganancias de la casa;
   * filters
   */
  static async fetchHouseProfit(data, token) {

    const endpoint = '/api/wallet/profit';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener el profit de la casa", error);
      return { "code": 500, "message": "Error al obtener la info de ganancias de la casa" };
    }



  }


    /**
   *function: fetchUserWalletStatementByUser
   * Descripción: obtiene los movimientos del wallet del usuario
   * userId
   */
  static async fetchUserWalletStatementByUser(data, token) {

    const endpoint = '/api/wallet/statement-user';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener la info de movimientos del wallet del usuario", error);
      return { "code": 500, "message": "Error al obtener la info de movimientos del wallet del usuario" };
    }



  }


   /**
   *function: fetchUserWalletSummary
   * Descripción: obtiene los saldos del wallet y lo que puede retirar
   * userId
   */
  static async fetchUserWalletSummary(data, token) {

    const endpoint = '/api/wallet/summary';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener la info de saldos del wallet", error);
      return { "code": 500, "message": "Error al obtener la info de saldos del wallet" };
    }



  }

    /**
   *function: fetchWalletTransactionsByBet
   * Descripción: obtiene los movimientos del wallet del usuario por apuesta
   * userId
   */
  static async fetchWalletTransactionsByBet(data, token) {

    const endpoint = '/api/wallet/bet';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener la info de movimientos del wallet por apuesta", error);
      return { "code": 500, "message": "Error al obtener la info de movimientos del wallet por apuesta" };
    }



  }



   /**
   *function: fetchAdminWalletStatement
   * Descripción: obtiene el estado de cuenta de la casa
   * userId
   */
  static async fetchAdminWalletStatement(data, token) {

    const endpoint = '/api/wallet/home-profit';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener el estado de cuenta de la casa", error);
      return { "code": 500, "message": "Error al obtener el estado de cuenta de la casa" };
    }



  }

   /**
   *function: fetchWalletRequests
   * Descripción: obtiene los depositos y retiros realizados por el usuario
   * filter
   */
  static async fetchWalletRequests(data, token) {

    const endpoint = '/api/wallet/requests';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener las solicitudes de transacciones", error);
      return { "code": 500, "message": "Error al obtener las solicitudes de transacciones" };
    }



  }


   /**
   *function: fetchWalletRequestsByUser
   * Descripción: obtiene los depositos y retiros realizados por el usuario
   * filter
   */
  static async fetchWalletRequestsByUser(data, token) {

    const endpoint = '/api/wallet/requests-user';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener las solicitudes de transacciones del usuario", error);
      return { "code": 500, "message": "Error al obtener las solicitudes de transacciones del usuario" };
    }



  }

     /**
   *function: executeAdminWalletAction
   * Descripción: ejecuta una operacion dentro de la billetera
   * userId
   * amount
   * description
   * type
   */
  static async executeAdminWalletAction(data, token) {

    const endpoint = '/api/wallet/action';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al ejecutar la accion en la billetera", error);
      return { "code": 500, "message": "Error al ejecutar la accion en la billetera" };
    }



  }



/**
   *function: createWalletRequest
   * Descripción: ejecuta una operacion dentro de la billetera
    { amount, type, docRef, comments, userId } 
   */
  static async createWalletRequest(data, token) {

    const endpoint = '/api/wallet/create';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al crear la transaccion en la billetera", error);
      return { "code": 500, "message": "Error al crear la transaccion en la billetera" };
    }



  }


  /**
   *function: cancelWalletRequest
   * Descripción: ejecuta una operacion de cancelacion dentro de la billetera
    { requestId, userId } 
   */
  static async cancelWalletRequest(data, token) {

    const endpoint = '/api/wallet/cancel';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al cancelar la transaccion en la billetera", error);
      return { "code": 500, "message": "Error al cancelar la transaccion en la billetera" };
    }



  }



  /**
   *function: processWalletRequest
   * Descripción: ejecuta una operacion dentro de la billetera
    { requestId, amountApplied, status, adminNotes, userId, adminId } 
   */
  static async processWalletRequest(data, token) {

    const endpoint = '/api/wallet/process';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al procesar la transaccion en la billetera", error);
      return { "code": 500, "message": "Error al procesar la transaccion en la billetera" };
    }



  }


  /**
   *function: liquidateDebt
   * Descripción: liquida la deuda pendiente por completo
    { amount, userId } 
   */
  static async liquidateDebt(data, token) {

    const endpoint = '/api/wallet/liquidate';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al liquidar la deuda", error);
      return { "code": 500, "message": "Error al liquidar la deuda" };
    }



  }
  

  

}

export default WalletService