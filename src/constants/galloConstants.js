/* File: src/constants/galloConstants.js
  Descripción: Constantes relacionadas a los gallos
  Autor: Jose Ahias Vargas
  Fecha: 2025-07-08
*/

export const GALLO = {
  A: 'GALLO_A',
  B: 'GALLO_B',
  DRAW: 'DRAW'
}

export const SELECT_GALLO_WIN =  [
  { value: "", label: "Elige el ganador", isDisabled: true },
  { value: GALLO.A, label: 'Gallo #1' },
  { value: GALLO.B, label: 'Gallo #2' },
  { value: GALLO.DRAW, label: 'Empate' },
];