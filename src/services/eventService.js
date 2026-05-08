/*
eventService
Descripcion: Servicio para manejar lo relacionado al event
Autor: Jose Ahias Vargas Pacheco
*/

import api from './axiosConfig';

class EventService {




  /**
   *function: fetchLiveEvent
   * Descripción: obtiene el evento que esta activo actualmente
   */
  static async fetchLiveEvent(data, token) {

    const endpoint = '/api/events/live';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener el evento en vivo:", error);
      return { "code": 500, "message": "Error al obtener el evento en vivo" };
    }



  }


  /**
   *function: fetchEvents
   * Descripción: obtiene todos los eventos
   */
  static async fetchEvents(data, token) {

    const endpoint = '/api/events/all';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener los eventos", error);
      return { "code": 500, "message": "Error al obtener los eventos" };
    }



  }



    /**
   *function: fetchGalleriesByEvent
   * Descripción: obtiene las gallerias de un evento
   * eventId
   */
  static async fetchGalleriesByEvent(data, token) {

    const endpoint = '/api/events/galleries-event';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener gallerias por evento:", error);
      return { "code": 500, "message": "Error al obtener gallerias por evento" };
    }



  }




    /**
   *function: fetchActivityEvent
   * Descripción: obtiene la actividad de un evento para ver si se puede modificar los pareos
   * eventId
   */
  static async fetchActivityEvent(data, token) {

    const endpoint = '/api/events/activity';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener la actividad por evento:", error);
      return { "code": 500, "message": "Error al obtener actividad por evento" };
    }



  }



  /**
   *function: startEvent
   * Descripción: inicia el evento y lo cambia a LIVE
   */
  static async startEvent(data, token) {

    const endpoint = '/api/events/start';

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


  /**
   *function: finishEvent
   * Descripción: finaliza el evento
   */
  static async finishEvent(data, token) {

    const endpoint = '/api/events/finish';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al finalizar el evento:", error);
      return { "code": 500, "message": "Error al finalizar el evento" };
    }



  }

 
  /**
   *function: cancelEvent
   * Descripción: cancela el evento
   */
  static async cancelEvent(data, token) {

    const endpoint = '/api/events/cancel';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al cancelar el evento:", error);
      return { "code": 500, "message": "Error al cancelar el evento" };
    }



  }



  /**
   *function: createEvent
   * Descripción: crea la pelea
   * data.name,
     data.banner,
     data.startsAt,
     data.streamUrl
   */
  static async createEvent(formData, token) {

    const endpoint = '/api/events/insert';

    try {
      const response = await api.post(endpoint, formData, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al crear el evento:", error);
      return { "code": 500, "message": "Error al crear el evento" };
    }



  }



  /**
 *function: updateEvent
 * Descripción: actualiza el evento
 * data.eventId
  data.name 
  data.banner
  data.startsAt
  data.streamUrl
  data.type
  data.gallos_amount
 * 
 */
  static async updateEvent(formData, token) {

    const endpoint = '/api/events/update';

    try {
      const response = await api.post(endpoint, formData, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      return { "code": 500, "message": "Error al actualizar el evento" };
    }



  }


  
    /**
 *function: insertGallery
 * Descripción: guarda una nueva galleria
 * data.name,
 */
  static async insertGallery(data, token) {

    const endpoint = '/api/events/insert-gallery';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al insertar la gallera:", error);
      return { "code": 500, "message": "Error al insertar gallera" };
    }



  }


    /**
 *function: insertGalleryEvent
 * Descripción: inserta una galleria a un evento
 * eventId, name,
 */
  static async insertGalleryEvent(data, token) {

    const endpoint = '/api/events/insert-event-gallery';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al insertar la gallera al evento:", error);
      return { "code": 500, "message": "Error al insertar gallera al evento" };
    }



  }


  /**
 *function: removeGalleryEvent
 * Descripción: borra una galleria a un evento
 * eventId, galleryId,
 */
  static async removeGalleryEvent(data, token) {

    const endpoint = '/api/events/delete-event-gallery';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al borrar la gallera al evento:", error);
      return { "code": 500, "message": "Error al borrar gallera al evento" };
    }



  }
 

}

export default EventService