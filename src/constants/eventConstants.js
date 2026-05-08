/* File: src/constants/eventConstants.js
  Descripción: Constantes para los eventos
  Autor: Jose Ahias Vargas
  Fecha: 2025-07-08
*/

export const EVENT = {
  SCHEDULED: 'SCHEDULED',
  LIVE: 'LIVE',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED'
}


export const EVENT_PREVIEW = {
  SCHEDULED: 'Programado',
  LIVE: 'En Vivo',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado',
  ALL: 'Todos'
}

export const STREAMING_EVENT = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  M3U8: 'm3u8',
  IFRAME: 'iframe'

}

export const EVENT_FILTERS = {
  ALL: 'ALL'
}

export const EVENT_BANNER = {
  DEFAULT: '/uploads/defaults/event-default.jpg'


}

export const EVENT_GROUP = {
  LIVE: { label: '🟢 EN VIVO', options: [] },
  SCHEDULED: { label: '📅 PROGRAMADOS', options: [] },
  FINISHED: { label: '🏁 FINALIZADOS', options: [] },
  CANCELLED: { label: '🚫 CANCELADOS', options: [] }
}

export const EVENT_TYPE = {
  DERBY: 'DERBY',
  LIBRE: 'LIBRE'
}
