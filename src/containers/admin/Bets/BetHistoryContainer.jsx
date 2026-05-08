/*
Componente: BetHistoryContainer.jsx
Descripción: Lógica para la Auditoría Maestra. Coordina filtros y carga de transacciones.
Autor: Jose Ahias Vargas
*/
import { useState, useEffect, useCallback, useRef } from "react";
import BetService from "../../../services/betService";
import EventService from "../../../services/eventService";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { STATUS } from "../../../constants/statusConstants";
import moment from "moment";
import { EVENT_FILTERS } from "../../../constants/eventConstants";
import { TOAST } from "../../../constants/toastConstants";
import WalletService from "../../../services/walletService";
import { BETS_PREVIEW } from "../../../constants/betConstants";
import BetHistory from "../../../components/admin/Bets/BetHistory";
import UserService from "../../../services/userService";

const BetHistoryContainer = () => {

    const isMounted = useRef(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [bets, setBets] = useState([]);
    const [events, setEvents] = useState([]);
    const [walletDetails, setWalletDetails] = useState({}); // Diccionario: { betId: [txs] }
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingTx, setLoadingTx] = useState(null);

    const { token } = useSecurity();
    const { setToastProps } = useToast();
    const { exportToExcel } = useExcelExport();

    const [filters, setFilters] = useState({
        userId: '',
        eventId: EVENT_FILTERS.ALL,
        fromDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD')
    });






    /*
    Funcion: loadEventsList
    Descripción: Carga la lista de eventos para el selector del filtro
    Autor: Jose Ahias Vargas
    */
    const loadEventsList = useCallback(async () => {
        try {
            const res = await EventService.fetchEvents({}, token);
            if (res.code === STATUS.OK) setEvents(res.data || []);
            else
                setToastProps({ message: res.message || "No se pudieron obtener los eventos", type: TOAST.DANGER });
        } catch (e) {
            setToastProps({ message: "Error al consultar los eventos", type: TOAST.DANGER });

            console.error("Error en eventos:", e);


        }
    }, [setToastProps, token]);


        /*
    Funcion: loadUserList
    Descripción: Carga la lista de usuarios
    Autor: Jose Ahias Vargas
    */
    const loadUserList = useCallback(async () => {
        try {
            const res = await UserService.findAllUsersWithWallets({}, token);
            if (res.code === STATUS.OK) setUsersList(res.data || []);
            else
                setToastProps({ message: res.message || "No se pudieron obtener los datos del los usuarios", type: TOAST.DANGER });
        } catch (e) {
            setToastProps({ message: "Error al consultar los datos de los usuarios", type: TOAST.DANGER });

            console.error("Error en usuarios:", e);


        }
    }, [setToastProps, token]);


    /*
    Funcion: fetchBets
    Descripción: Carga la lista de eventos para el selector del filtro
    Autor: Jose Ahias Vargas
    */

    const fetchBets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await BetService.fetchBetTransactions({ filters }, token);
            if (res.code === STATUS.OK) {
                setBets(res.data || []);
                setWalletDetails({});
            }
            else
                setToastProps({ message: res.message || "No se pudieron obtener las apuestas", type: TOAST.DANGER });
        } catch (error) {
            setToastProps({ message: "Error al consultar las apuestas", type: TOAST.DANGER  });
            console.error("Error en apuestas:", error);

        } finally {
            setLoading(false);
        }
    }, [filters, token, setToastProps]);


    /*
    Funcion: fetchWalletHistory
    Descripción: Carga los movimientos de billetera REALES al expandir una fila
    Autor: Jose Ahias Vargas
    */

    const fetchWalletHistory = async (betId) => {
        if (walletDetails[betId]) return; // Si ya lo tenemos cargado, se evita volver a llamar

        setLoadingTx(betId);
        try {
            const res = await WalletService.fetchWalletTransactionsByBet({betId}, token);
            if (res.code === STATUS.OK) {
                setWalletDetails(prev => ({ ...prev, [betId]: res.data }));
            }
            else{

              setToastProps({ message: res.message || "Error al traer movimientos de dinero", type: TOAST.DANGER });
     
            }
        } catch (error) {
            setToastProps({ message: "Error al traer movimientos de dinero", type: TOAST.DANGER });
            console.error("Error al obtener el historico de la billetera:", error);

        } finally {
            setLoadingTx(null);
        }
    };

    
    /*
    Funcion: handleFilterChange
    Descripción: setea los filtros en el componente
    Autor: Jose Ahias Vargas
    */


    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    /*
    Funcion: handleExportExcel
    Descripción: preparamos los datos que se exportaran a excel
    Autor: Jose Ahias Vargas
    */


    const handleExportExcel = () => {
        const data = bets.map(b => ({
            "ID": b.id, 
            "Usuario": b.username, 
            "Email": b.email,
            "Evento": b.event_name, 
            "Ronda" : b.round_number,
            "Pelea": b.fight_number,
            "Gallerias": `${b.gallo_a} vs ${b.gallo_b}`,
            "Monto": b.amount, 
            "Estado": BETS_PREVIEW[b.paid] || b.paid , 
            "Fecha": moment(b.created_at).format('LLL')
        }));
        exportToExcel(data, `Auditoria_Bets_${moment().format('YYYYMMDD')}`);
    };

    /*
    Funcion: loadInitialData
    Descripción: Carga los datos iniciales
    Autor: Jose Ahias Vargas
    */
    const loadInitialData = useCallback(async () => {
        try{
        setInitialLoading(true);
        await loadEventsList();
        await loadUserList()
        await fetchBets();
        }
        finally{

        setInitialLoading(false);

        }

    }, [fetchBets, loadEventsList, loadUserList]);


    useEffect(() => {
        if (!isMounted.current) {
            loadInitialData();
            isMounted.current = true;
        }
    }, [loadInitialData]);

    return (
        <BetHistory
            componentLoading={initialLoading}
            bets={bets}
            events={events}
            usersList={usersList}
            walletDetails={walletDetails}
            filters={filters}
            loading={loading}
            loadingTx={loadingTx}
            onFilterChange={handleFilterChange}
            onSearch={fetchBets}
            onExport={handleExportExcel}
            onExpand={fetchWalletHistory}
        />
    );
};

export default BetHistoryContainer;