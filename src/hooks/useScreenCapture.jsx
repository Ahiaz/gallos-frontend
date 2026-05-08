/* Hook: este hook permite que el contexto del ScreenCapture pueda ser reutilizado con solo importalo en los componentes 
Descripción: mediante useModal podemos acceder a los metodos y states del contexto especificamente a estos:
<ScreenCapture.Provider value={{ generateImageFile, downloadImage etc }}>
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

import { useContext } from 'react';
import { ScreenCaptureContext } from '../contexts/ScreenCaptureContext';

export const useScreenCapture = () => useContext(ScreenCaptureContext);