import { useState, useEffect, useCallback } from "react";
import BetService from "../../services/betService";
import { useSocket } from "../../hooks/useSocket";
import { useLiveBetSockets } from "../../hooks/socketEvents/useLiveBetSockets";
import { useToast } from "../../hooks/useToast";
import { useSecurity } from "../../hooks/useSecurity";
import { STATUS } from "../../constants/statusConstants";
import { TOAST } from "../../constants/toastConstants";
import LiveFightBets from "../../components/Bets/LiveFightBets";
import { ADMIN_ROLE } from "../../constants/userConstants";

const LiveFightBetsContainer = ({open = false, setOpen = null, refresh = false, setRefresh = null}) => {
    const [bets, setBets] = useState([]);
    const [stats, setStats] = useState({ totalVolume: 0, houseProfit: 0 });
    const [loading, setLoading] = useState(true);
    const { socket} = useSocket();
    const { token, role } = useSecurity();
    const { setToastProps } = useToast();
    const isAdmin = (role === ADMIN_ROLE ? true : false);


    /*
    Funcion: loadLiveBets
    Descripción: Datos iniciales de apuestas por pelea en vivo
    Autor: Jose Ahias Vargas
    */  const loadLiveBets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await BetService.findLiveBetDataByFightLive({}, token);

            console.log('live bets monitor',res);

            if (res.code === STATUS.OK) {
                setBets(res.data.bets || []);
                setStats(res.data.stats || {});
            }
            else {

                setToastProps({ message: res.message || "Error al consultar las apuestas de la pelea", type: TOAST.DANGER });

            }

        }catch (error) {
            setToastProps({ message: "Error al consultar las apuestas de la pelea", type: TOAST.DANGER });
            console.error("Error al consultar las apuestas de la pelea", error);

        } 
        
        finally {
            setLoading(false);
        }
    }, [setToastProps, token]);

    /*
    useLiveBetSockets
    Descripcion: Maneja la conexión a sockets para las apuestas en vivo y actualiza el estado en tiempo real
    Autor: Jose Ahias Vargas
    */

    useLiveBetSockets(socket, {
        setBets,
        setStats,
        loadLiveBets
    });


    useEffect(() => {
        if(refresh){
        loadLiveBets();
        setRefresh(false);
        }
    }, [loadLiveBets, refresh, setRefresh]);





    return (
        <LiveFightBets
            bets={bets}
            stats={stats}
            loading={loading}
            open={open}
            setOpen={setOpen}
            isAdmin={isAdmin}
        />
    );
};

export default LiveFightBetsContainer;