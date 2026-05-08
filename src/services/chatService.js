/*
chatService
Descripcion: Servicio para manejar lo relacionado al chat
Autor: Jose Ahias Vargas Pacheco
*/

import api from './axiosConfig';

class ChatService {

  /**
   *function: fetchChatMessagesByEvent
   * Descripción: obtiene los mensajes del chat
   * eventId
   */
  static async fetchChatMessagesByEvent(data, token) {

    const endpoint = '/api/chat/messages';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener los mensajes", error);
      return { "code": 500, "message": "Error al obtener los mensajes" };
    }



  }


  /**
   *function: sendChatMessage
   * Descripción: envia un mensaje
   * data.userId, data.eventId, data.message
   */
  static async sendChatMessage(data, token) {

    const endpoint = '/api/chat/send';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      return { "code": 500, "message": "Error al iniciar el mensaje" };
    }



  }

  /**
   *function: blockChatUser
   * Descripción: bloquea un usuario
   * data.userId
   */
  static async blockChatUser(data, token) {

    const endpoint = '/api/chat/block';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al bloquear el usuario:", error);
      return { "code": 500, "message": "Error al bloquear el usuario" };
    }



  }



}

export default ChatService