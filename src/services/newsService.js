/*
newsService
Descripcion: Servicio para manejar lo relacionado a las noticias
Autor: Jose Ahias Vargas Pacheco
*/

import api from './axiosConfig';

class NewsService {


  /**
   *function: findAllNews
   * Descripción: obtiene todos los eventos
   * eventId
   */
  static async findAllNews(data, token) {

    const endpoint = '/api/news/all';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener las noticias", error);
      return { "code": 500, "message": "Error al obtener las noticias" };
    }



  }


  /**
   *function: findActiveNews
   * Descripción: obtiene todos los eventos activos
   * eventId
   */
  static async findActiveNews(data, token) {

    const endpoint = '/api/news/active';

    try {
      const response = await api.post(endpoint, data, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al obtener las noticias", error);
      return { "code": 500, "message": "Error al obtener las noticias" };
    }



  }


  /**
   *function: createNew
   * Descripción: crea la noticia
   * data.title,
     data.description,
     data.imageUrl,
   */
  static async createNew(formData, token) {

    const endpoint = '/api/news/insert';

    try {
      const response = await api.post(endpoint, formData, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al crear la noticia:", error);
      return { "code": 500, "message": "Error al crear la noticia" };
    }



  }

  /**
   *function: updateNew
   * Descripción: actualiza la noticia
   * data.title,
     data.description,
     data.imageUrl,
   */
  static async updateNew(formData, token) {

    const endpoint = '/api/news/update';

    try {
      const response = await api.post(endpoint, formData, {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      return response;
    } catch (error) {
      console.error("Error al actualizar la noticia:", error);
      return { "code": 500, "message": "Error al actualizar la noticia" };
    }



  }
 

}

export default NewsService