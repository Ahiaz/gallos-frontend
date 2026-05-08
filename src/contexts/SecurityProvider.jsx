/*Componente: SecurityProvider.jsx
Descripción: 
Provider para manejar la seguridad de forma global con el context
Autor: Jose Ahias Vargas
*/


import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import moment from "moment";
import { SecurityContext } from './SecurityContext';
import UserService from '../services/userService';
import { SYSTEM } from '../constants/systemConstants';
import { STATUS } from '../constants/statusConstants';


export const SecurityProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwt") || null);
  const [expiration, setExpiration] = useState(localStorage.getItem("jwtExpDate") || null);
  const [iduser, setIdUser] = useState(localStorage.getItem("iduser") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [name, setName] = useState(localStorage.getItem("name") || null);
  const [email, setEmail] = useState(localStorage.getItem("email") || null);
  const [phone, setPhone] = useState(localStorage.getItem("phone") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [balance, setBalance] = useState(localStorage.getItem("balance") || null);
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || null);
  const [chatBlocked, setChatBlocked] = useState(localStorage.getItem("chatBlocked") || null);
  const isMounted = useRef(false);

  /*
  Función: setUserID
  Descripción: setter del ID del usuario
  */

  const setUserID = useCallback((id) => {
    localStorage.setItem("iduser", id);
    setIdUser(id);

  }, []);

  /*
  Función: setUserToken
  Descripción: setter del token de acceso
  */

  const setUserToken = useCallback((newToken) => {
    localStorage.setItem("jwt", newToken);
    setToken(newToken);

  }, []);

  /*
  Función: setUserTokenExpiration
  Descripción: setter de la expiracion del token
  */

  const setUserTokenExpiration = useCallback((exp) => {
    if (exp) {
      const tokenExpirationTimeInSeconds = exp;
      const expirationDate = moment().add(tokenExpirationTimeInSeconds, "seconds");
      const expDateString = expirationDate.format("YYYY-MM-DD HH:mm:ss");
      localStorage.setItem("jwtExpDate", expDateString);
      setExpiration(expDateString);
    }
  }, []);


  /*
  Función: setTheUsername
  Descripción: setter del usuario
  */

  const setTheUsername = useCallback((username) => {
    localStorage.setItem("username", username);
    setUsername(username);

  }, []);


  /*
  Función: setTheName
  Descripción: setter del nombre
  */

  const setTheName = useCallback((name) => {
    localStorage.setItem("name", name);
    setName(name);

  }, []);

  /*
  Función: setTheRole
  Descripción: setter del rol del usuario
  */

  const setTheRole = useCallback((role) => {
    localStorage.setItem("role", role);
    setRole(role);
  }, []);


  /*
Función: setTheEmail
Descripción: setter del token de acceso
*/

  const setTheEmail = useCallback((email) => {
    localStorage.setItem("email", email);
    setEmail(email);

  }, []);



  /*
  Función: setTheCurrency
  Descripción: setter de la moneda
  */
 
  const setTheCurrency = useCallback((currency) => {
    localStorage.setItem("currency", currency);
    setCurrency(currency);
  }, []);

  /*
  Función: setThePhone
  Descripción: setter del telefono
  */

  const setThePhone = useCallback((phone) => {
    localStorage.setItem("phone", phone);
    setPhone(phone);

  }, []);


  /*
  Función: setChatBlock
  Descripción: setter del telefono
  */

  const setChatBlock = useCallback((block) => {
    localStorage.setItem("chatBlocked", block);
    setChatBlocked(block);

  }, []);


  /*
  Función: setTheBalance
  Descripción: setter de la redireccion a una url despues del login
  */

  const setTheBalance = useCallback((amount) => {

    const cleanAmount = Math.floor(Number(amount));
    localStorage.setItem("balance", cleanAmount);
    setBalance(cleanAmount);

  }, []);

  /*
  Función: validateToken
  Descripción: valida el token y la expiracion
  */

  const validateToken = useCallback(() => {

    if (!token || !expiration) return false;

    const expirationMoment = moment(expiration, "YYYY-MM-DD HH:mm:ss");
    return moment().isBefore(expirationMoment);
  }, [expiration, token]);


  /*
  Función: setUserInfo
  Descripción: setea la info del usuario
  */

  const setUserInfo = useCallback(async (param) => {

    const res = await UserService.findUserData({ userId: iduser }, token);

    if (res.code === STATUS.OK && res.data) {
        
      const totalBalance = (Number(res.data.balance)) + (Number(res.data.bonus_balance));

      if (param === SYSTEM.KEY.BALANCE)
        setTheBalance(totalBalance);
      else if (param === SYSTEM.KEY.ALL) {
        setTheUsername(res.data.username);
        setTheName(res.data.name);
        setTheBalance(totalBalance);
        setTheRole(res.data.role);
        setTheEmail(res.data.email);
        setThePhone(res.data.phone);
        setChatBlock(res.data.chat_blocked);
      }

      return res.data;

    }
      return null;
  }, [iduser, setChatBlock, setTheBalance, setTheEmail, setTheName, setThePhone, setTheRole, setTheUsername, token]);


  
  /*
  Función: getUserInfo
  Descripción: devuelve un objeto con la informacion del usuario
  */

  const getUserInfo = useCallback(() => {

      const userInfo = {
        id: iduser,
        username: username,
        name: name,
        balance: balance,
        role: role,
        email: email,
        phone: phone,
        chat_blocked: chatBlocked, 
        active : true
      };

      return userInfo;


  }, [balance, chatBlocked, email, iduser, name, phone, role, username]);


  /*
  Función: setInitialParams
  Descripción: setea los datos iniciales de seguridad de la aplicacion
  */

  const setInitialParams = useCallback((data) => {
    setUserToken(data.token);
    setUserTokenExpiration(data.exp);
    setUserID(data.user.id);
    setTheUsername(data.user.username);
    setTheName(data.user.name);
    setTheBalance(data.user.balance);
    setTheRole(data.user.role);
    setTheEmail(data.user.email);
    setThePhone(data.user.phone);
    setTheCurrency(data.systemSettings.currency);
    setChatBlock(data.user.chat_blocked);
    
  }, [setUserToken, setUserTokenExpiration, setUserID, setTheUsername, setTheName, setTheBalance, setTheRole, setTheEmail, setThePhone, setTheCurrency, setChatBlock])

  /*
  Función: clearUserSession
  Descripción: remueve las variables de sesion
  */

  const clearUserSession = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    localStorage.removeItem("iduser");
    localStorage.removeItem("balance");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    localStorage.removeItem("chatBlocked");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("jwtExpDate");
    setToken(null);
    setIdUser(null);
    setUsername(null);
    setBalance(null);
    setEmail(null);
    setPhone(null);
    setChatBlocked(null);
    setRole(null);
    setName(null);
    setCurrency(null);
    setExpiration(null);
  }

  const contextValue = useMemo(() => ({
    token,
    iduser,
    username,
    name,
    role,
    email,
    phone,
    balance,
    currency,
    chatBlocked,
    setInitialParams,
    setTheBalance,
    setTheCurrency,
    setChatBlock,
    setUserInfo,
    getUserInfo,
    clearUserSession,
    validateToken,
  }), [token, iduser, username, name, role, email, phone, balance, currency, chatBlocked, setInitialParams, setTheBalance, setTheCurrency, setChatBlock, setUserInfo, getUserInfo, validateToken]);


  /*
  useEffect: Auto-refresh de datos al cargar la página y desmontar el componente
  Descripción: intentamos setear los datos del usuario actualizado
  */
  useEffect(() => {
    if (!isMounted.current) {
      if (iduser && token) {
        setUserInfo(SYSTEM.KEY.ALL);
        isMounted.current = true;
      }
    }
    
  }, [iduser, setUserInfo, token]);


  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
