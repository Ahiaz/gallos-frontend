import moment from 'moment';
import 'moment/locale/es';
import 'moment-timezone';

// Configurar moment para trabajar en español
moment.locale('es-CR');

// Establecer la zona horaria a Costa Rica (América/Costa_Rica)
moment.tz.setDefault('America/Costa_Rica');

// Formato de 12 horas
moment.updateLocale('es-CR', {
    longDateFormat: {
      LT: 'h:mm A', 
    },
  });