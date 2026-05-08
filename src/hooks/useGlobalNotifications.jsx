/*
Hook: useGlobalNotifications.jsx
Descripción: Hook personalizado para notificar al usuario en toda la pagina
Autor: Jose Ahias Vargas
*/

import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext";

export const useGlobalNotifications = () => useContext(NotificationContext);

 