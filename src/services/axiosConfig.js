/*
axiosConfig
Descripcion: Configura las respuestas de axios en los request (POST, GET, etc..)
Autor: Jose Ahias Vargas Pacheco
*/

import axios from 'axios';
import { showAuthModal } from '../utils/modalUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {},
   validateStatus: () => true // Acepta todas las respuestas de estado, de lo contrario si no devolvemos un 200 se considera error 
                            // y caería en el catch del request
});

api.interceptors.response.use(
  (response) => {

    console.log("Response axios:", response);

   /* if (response.status === 401) {
      showAuthModal();
    }*/

    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`Invalid response type: expected JSON, got ${contentType}`);
    }


    try {
      // Axios ya parsea JSON, pero verificamos que sea un objeto válido
      if (typeof response.data === 'string') {
        JSON.parse(response.data); // Esto lanza error si es inválido
      }
    } catch (err) {
      throw new Error('Response is not valid JSON '+err);
    }


    return response.data; // siempre devuelve response, aunque sea 400, 409, 500...
  },
  (error) => {
    // Errores de red o Axios reales
    return Promise.reject(error);
  }
);

export default api;