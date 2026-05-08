/*
Componente: WalletHistoryContainer.jsx
Descripción: Contenedor para la auditoría de caja global (Estado de Cuenta Admin)
Autor: Jose Ahias Vargas
*/
import { useCallback, useEffect, useState } from "react";
import WalletService from "../../../services/walletService";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { WALLET, WALLET_FILTER, WALLET_PREVIEW } from "../../../constants/walletConstants";
import moment from "moment";
import WalletHistory from "../../../components/admin/Wallet/WalletHistory";
import UserService from "../../../services/userService";
import { useRef } from "react";

const WalletHistoryContainer = () => {

    const isMounted = useRef(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useSecurity();
    const { setToastProps } = useToast();
    const { exportToExcel } = useExcelExport();

    const [filters, setFilters] = useState({
        fromDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        type: WALLET_FILTER.ALL,
        userId: ''
    });



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
    funcion: fetchAudit
    Descripción: obtiene los movimientos del wallet de la casa
    Autor: Jose Ahias Vargas
    */

    const fetchAudit = useCallback(async () => {
        setLoading(true);
        try {
            const res = await WalletService.fetchUserWalletStatement({ filters }, token);
            if (res.code === STATUS.OK) {
                setTransactions(res.data || []);
            } else {
                setToastProps({ message: res.message, type: TOAST.DANGER });
            }
        } catch (error) {
            setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
            console.error("Error al obtener los movimientos del wallet de la casa ", error)

        } finally {
            setLoading(false);
        }
    }, [filters, token, setToastProps]);

    /*
    funcion: handleFilterChange
    Descripción: sete los filtros para los componetnes
    Autor: Jose Ahias Vargas
    */

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    /*
    funcion: handleExportExcel
    Descripción: prepara la estructura del excel
    Autor: Jose Ahias Vargas
    */

    const handleExportExcel = () => {
        const data = transactions.map(tx => {
            // Lógica para determinar el origen del fondo en el Excel
            let origen = "Real";
            if (tx.type === WALLET.CREDIT_LOAD) origen = "Préstamo (Deuda)";
            if (tx.type === WALLET.BONUS_LOAD) origen = "Bono (Cortesía)";

            return {
                "ID": tx.id,
                "Fecha": moment(tx.created_at).format('LLL'),
                "Usuario": tx.username,
                "Concepto": tx.description || WALLET_PREVIEW[tx.type],
                "Tipo": WALLET_PREVIEW[tx.type],
                "Origen Fondo": origen,
                "Monto": tx.amount,
                "Balance Post": tx.new_balance,
                "Evento": tx.event_name || 'N/A'
            };
        });
        exportToExcel(data, `Auditoria_Caja_${moment().format('YYYYMMDD')}`);
    };




    /*
    funcion: loadInitialData
    Descripción: obtiene la informacion inicial
    Autor: Jose Ahias Vargas
    */

    const loadInitialData = useCallback(async () => {
        try {
            setInitialLoading(true);
            await loadUserList();
            await fetchAudit();
        } finally {
            setInitialLoading(false);
        }
    }, [loadUserList, fetchAudit]);


    useEffect(() => {
        if (!isMounted.current) {
            loadInitialData();
            isMounted.current = true;
        }
    }, [loadInitialData]);

    if (initialLoading) {
        return <div className="flex min-h-screen items-center justify-center animate__animated animate__fadeIn">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
        </div>;
    }

    return (
        <WalletHistory
            transactions={transactions}
            usersList={usersList}
            loading={loading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={fetchAudit}
            onExport={handleExportExcel}
        />
    );
};

export default WalletHistoryContainer;