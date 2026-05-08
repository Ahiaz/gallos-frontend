/* File: src/constants/roundConstants.js
  Descripción: Constantes para los status de las peleas
  Autor: Jose Ahias Vargas
  Fecha: 2025-07-08
*/

export const ROUND = {
  PENDING: 'PENDING',
  LIVE: 'LIVE',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED'
}

export const ROUND_PREVIEW = {
  PENDING: 'Pendiente',
  LIVE: 'En vivo',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado',
  ALL : 'Todos'
}

export const ROUND_RESULT = {
  NORMAL: 'NORMAL',
  KO: 'KO',
  DRAW: 'DRAW',
  CANCELLED: 'CANCELLED'
}


export const ROUND_RESULT_PREVIEW = {
  NORMAL: 'Normal',
  KO: 'Knockout',
  DRAW: 'Empate',
  CANCELLED: 'Cancelado'
}

export const ROUND_FILTERS = {
ALL: 'ALL'
}

export const SELECT_ROUND_RESULT =  [
  { value: "", label: "Elige el resultado", isDisabled: true },
  { value: ROUND_RESULT.NORMAL, label: 'Normal' },
  { value: ROUND_RESULT.KO, label: 'Knockout' },
  { value: ROUND_RESULT.DRAW, label: 'Empate' },
  { value: ROUND_RESULT.CANCELLED, label: 'Cancelada' },

];

export const SELECT_FIGHT =  [
  { value: ROUND_FILTERS.ALL, label: "Todas", isSelected: true },
  { value: ROUND.PENDING, label: 'Pendientes' },
  { value: ROUND.LIVE, label: 'En Vivo' },
  { value: ROUND.FINISHED, label: 'Finalizadas' },
  { value: ROUND.CANCELLED, label: 'Canceladas' },

];



