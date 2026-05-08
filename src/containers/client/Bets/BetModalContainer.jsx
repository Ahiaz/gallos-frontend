/*
Componente: BetModalContainer.jsx
Descripción: Contenedor principal para manejar el modal de las apuestas
Autor: Jose Ahias Vargas
*/


import { useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { useSecurity } from "../../../hooks/useSecurity";
import {useToast} from "../../../hooks/useToast";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { SOCKET_EVENTS } from "../../../constants/socketConstants";
import BetService from "../../../services/betService";
import UserService from "../../../services/userService";
import BetModal from "../../../components/client/Bets/BetModal";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import { SIDE, SIDE_PREVIEW } from "../../../constants/sideConstants";
import { GALLO } from "../../../constants/galloConstants";

const BetModalContainer = ({currentFight = null, amountParams = null, bettingParams = null, poolTotals = null, setAmountParams, onClose}) => {

  const { socket } = useSocket();
  const { token, iduser, setTheBalance} = useSecurity();
  const {setToastProps} = useToast();
  const { showConfirm } = useConfirmModal();
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

    /*
     function: placeBet
     Descripcion: coloca la apuesta
     Autor: Jose Ahias Vargas
     */
    const placeBet = async (amount, side, oddType) => {

        setLoading(true);

        //ocultamos el historico del modal para que lo vuelva a montar y ejecutar
        setShowHistory(false);

        if(!currentFight?.id){

        setToastProps({ message: "No hay una pelea activa", type: TOAST.DANGER });

        return;
   
        }


        try {

            const res = await BetService.placeBet({userId: iduser, fightId: currentFight.id, amount: amount, side: side, oddType: oddType}, token);

            if (res.code === STATUS.OK) {

                const bet = res.data;

                socket.emit(SOCKET_EVENTS.EMIT.BET_PLACE, {
                    fightId: currentFight.id,
                    betId: bet.id
                });

                setTheBalance(bet.newBalance);

                setToastProps({ message: "Se realizo la apuesta correctamente", type: TOAST.SUCCESS });


                //guarda el monto del usuario en sus favoritos
               const resAmount =  await UserService.createUserAmount({userId: iduser, amount: amount}, token);

               if(resAmount.code === STATUS.OK)
                 setAmountParams(resAmount.data || []);
               else
                console.error(resAmount.message || 'no se pudo guardar los montos en los favoritos del usuario');

                return true;



            }
            else {

                setToastProps({
                    message: res.message || `No se pudo realizar la apuesta`,
                    type: TOAST.DANGER
                });

               return false;

            }




        } catch (error) {

            console.log(error);

            setToastProps({
                message: "Error de conexión al realizar la apuesta",
                type: TOAST.DANGER
            });

            return false;


        }
        finally {

            setLoading(false);
        }




    }
 

    /*
     function: handleBet
     Descripcion: muestra confirmacion
     Autor: Jose Ahias Vargas
     */

    const handleBet = async (amount, side, oddType) => {

        const sideColor = side === GALLO.A ? SIDE.RED : SIDE.GREEN

        showConfirm({ title: 'Confirmación', message: `¿Desea realizar la apuesta al ${SIDE_PREVIEW[sideColor.toLocaleUpperCase()]}`, onConfirm: () => placeBet(amount, side, oddType) })

    };
    
    
        return (
        <BetModal
        loading={loading}
        userAmounts={amountParams}
        bettingParams={bettingParams}
        poolTotals={poolTotals}
        currentFight={currentFight}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        onSubmit={handleBet}
        onClose={onClose}
        />
        );
};

export default BetModalContainer;