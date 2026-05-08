/* File: src/constants/socketConstants.js
  Descripción: Constantes para los sockets
  Autor: Jose Ahias Vargas
  Fecha: 2025-07-08
*/

export const ROOMS = {
  NOTIFICATION_GLOBAL_ROOM: 'notification_global_room', //para notificaciones globales
  LIVE_ROOM: 'live_room', //para jugadores y eventos en vivo
  ADMIN_ROOM: 'admin_room', //para eventos administrativos
}

export const SOCKET_EVENTS = {
  GLOBAL: {
    NEW_LIVE_EVENT: 'event:started',
    NEW_SCHEDULED_EVENT: 'event:created',
    EVENT_FINISHED: 'event:finished',
    EVENT_CANCELLED: 'event:cancelled',
    ROUND_STARTED: 'round:started',
    ROUND_CANCELLED: 'round:cancelled',
    ROUND_FINISHED: 'round:finished',
    NEWS_CREATED: 'new:created',
    FIGHT_OPENED: 'fight:opened',
    FIGHT_PROGRESSED: 'fight:progressed',
    FIGHT_RESOLVED: 'fight:resolved',
    FIGHT_CANCELLED: 'fight:cancelled',
    FIGHT_UPDATED: 'fight:updated',
    SCORE_BOARD: 'score:board',
    BET_PLACED : 'bet:placed',
    WALLET_BALANCE_UPDATED: 'wallet:balance:updated',
    LIVE_MONITOR_UPDATED: 'live:monitor:updated',
    POOL_UPDATED: 'pool:updated',
    CHAT_NEW: 'chat:new',
    CHAT_BLOCKED: 'chat:blocked'

  },
  EMIT : {
  EVENT_START: 'event:start',
  EVENT_SCHEDULE: 'event:create',
  EVENT_UPDATE: 'event:update',
  EVENT_FINISH: 'event:finish',
  EVENT_CANCEL: 'event:cancel',
  NEWS_CREATE: 'new:create',
  ROUND_START: 'round:start',
  ROUND_CREATE: 'round:create',
  ROUND_UPDATE: 'round:update',
  ROUND_FINISH: 'round:finish',
  ROUND_CANCEL: 'round:cancel',
  FIGHT_OPEN: 'fight:open',
  FIGHT_PROGRESS: 'fight:progress',
  FIGHT_CREATE: 'fight:create',
  FIGHT_UPDATE: 'fight:update',
  FIGHT_RESOLVE: 'fight:resolve',
  FIGHT_CANCEL: 'fight:cancel',
  SCORE_BOARD: 'score:board',
  BET_PLACE : 'bet:place',
  WALLET_BALANCE_UPDATE: 'wallet:balance:update',
  LIVE_MONITOR_UPDATE: 'live:monitor:update',
  POOL_UPDATED: 'pool:update',
  CHAT_MESSAGE: 'chat:message',
  CHAT_BLOCK: 'chat:block'


  }
};