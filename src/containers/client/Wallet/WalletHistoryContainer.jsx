/*
Componente: WalletHistoryContainer.jsx
Descripción: Contenedor para el historial de transacciones global (Estado de Cuenta)
Autor: Jose Ahias Vargas
*/
import { useCallback, useEffect, useState } from "react";
import WalletService from "../../../services/walletService";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { useExcelExport } from '../../../hooks/useExcelExport';
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import moment from "moment";
import WalletHistory from "../../../components/client/Wallet/WalletHistory";
import { WALLET, WALLET_PREVIEW } from "../../../constants/walletConstants";
import { useRef } from "react";

const WalletHistoryContainer = () => {
    const isMounted = useRef(false);
    const [transactions, setTransactions] = useState([]);
    const [walletDetails, setWalletDetails] = useState([]);
    const [initialLoading, setInitialLoading] = useState(false);
    const { token, iduser } = useSecurity();
    const { setToastProps } = useToast();
    const { exportToExcel } = useExcelExport();

    // Por defecto: desde hace 7 días hasta hoy
    const [dateRange, setDateRange] = useState({
        from: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    });

    /*
     Funcion: loadWalletData
     Descripcion: obtiene los movimientos del wallet y el saldo
     Autor: Jose Ahias Vargas
     */

    const loadWalletData = useCallback(async () => {
        setInitialLoading(true);
        try {

            const res = await WalletService.fetchUserWalletStatementByUser({filters: {userId: iduser, fromDate: dateRange.from, toDate: dateRange.to}}, token);
            if (res.code === STATUS.OK) {
                setTransactions(res.data || []);
            }
            else {

                setToastProps({
                    message: res.message || "Error al obtener movimientos",
                    type: TOAST.DANGER
                });
            }

            const wallet = await WalletService.fetchUserWalletSummary({ userId: iduser }, token);

            if (wallet.code === STATUS.OK) {
                setWalletDetails(wallet.data || []);
            }
            else {

                setToastProps({
                    message: wallet.message || "Error al obtener los saldos",
                    type: TOAST.DANGER
                });
            }

        } catch (error) {
            console.log("Error la cargar los datos de la billetera", error)
            setToastProps({ message: "Error al cargar datos de la billetera", type: TOAST.DANGER });
        } finally {
            setInitialLoading(false);
        }
    }, [iduser, dateRange.from, dateRange.to, token, setToastProps]);


    /*
     Funcion: handleFilterDateChange
     Descripcion: evento cuando cambia la fecha
     Autor: Jose Ahias Vargas
     */

    const handleFilterDateChange = (field, value) => {
        setDateRange(prev => ({ ...prev, [field]: value }));
    };


    /*
      Funcion: handleApplyFilter
      Descripcion: Dispara la búsqueda manualmente al hacer click en el botón
      Autor: Jose Ahias Vargas
    */
    const handleApplyFilter = () => {
        if (moment(dateRange.from).isAfter(dateRange.to)) {
            setToastProps({
                message: "La fecha inicial no puede ser mayor a la final",
                type: TOAST.DANGER
            });
            return;
        }
        loadWalletData();
    };

    /*
      Funcion: handleExportExcel
      Descripcion: formateamos los datos específicos para este reporte
      Autor: Jose Ahias Vargas
    */
    const handleExportExcel = () => {
        const formattedData = transactions.map(tx => ({
            "Fecha": moment(tx.created_at).format('YYYY-MM-DD HH:mm:ss'),
            "Descripción": tx.description || WALLET_PREVIEW[tx.type],
            "Tipo": tx.type,
            "Monto": tx.type === WALLET.BET_PLACED || tx.type === WALLET.WITHDRAWAL ? -tx.amount : tx.amount,
            "Saldo Resultante": tx.new_balance,
            "Evento": tx.event_name || 'N/A',
            "Pelea": tx.round_number ? `#${tx.round_number}` : 'N/A'
        }));

        // Configuramos anchos de columna específicos
        const columns = [
            { wch: 20 }, { wch: 30 }, { wch: 15 },
            { wch: 12 }, { wch: 15 }, { wch: 25 }, { wch: 10 }
        ];

        const name = `Estado_Cuenta_${moment().format('YYYYMMDD_HHmm')}`;

        exportToExcel(formattedData, name, "Movimientos", columns);
    };



    useEffect(() => {

        if (!isMounted.current) {
            loadWalletData();
            isMounted.current = true;
        }


    }, [loadWalletData]);

    return (
        <WalletHistory
            transactions={transactions}
            walletDetails={walletDetails}
            componentLoading={initialLoading}
            dateRange={dateRange}
            onDateChange={handleFilterDateChange}
            onApplyFilter={handleApplyFilter}
            onExportExcel={handleExportExcel}
        />
    );
};

export default WalletHistoryContainer;