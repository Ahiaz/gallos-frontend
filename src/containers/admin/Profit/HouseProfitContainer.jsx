/*
Container: HouseProfitContainer.jsx
Descripción: Orquestador de lógica para el historial de ganancias de la casa.
Autor: Jose Ahias Vargas
*/
import React, { useState, useEffect, useCallback, useRef } from 'react';
import WalletService from '../../../services/walletService';
import { useSecurity } from '../../../hooks/useSecurity';
import { useToast } from '../../../hooks/useToast';
import { STATUS } from '../../../constants/statusConstants';
import { TOAST } from '../../../constants/toastConstants';
import moment from 'moment';
import { useExcelExport } from "../../../hooks/useExcelExport";
import HouseProfit from '../../../components/admin/Profit/HouseProfit';

const HouseProfitContainer = () => {
    const { token } = useSecurity();
    const { setToastProps } = useToast();
    const { exportToExcel } = useExcelExport();
    const isMounted = useRef(false);
    const [profits, setProfits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        from: moment().startOf('month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    });

    /*
     Funcion: fetchProfits
     Descripcion: carga los profits
     Autor: Jose Ahias Vargas
     */
    const fetchProfits = useCallback(async () => {
        try {
            setLoading(true);
            const res = await WalletService.fetchHouseProfit({filters: dateRange}, token);

            if (res.code === STATUS.OK) {
                setProfits(res.data || []);
            } else {
                setToastProps({ message: res.message, type: TOAST.DANGER });
            }
        } catch (error) {
            setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [dateRange, token, setToastProps]);


    /*
     Funcion: useEffect
     Descripcion: carga inicial de los profits
     Autor: Jose Ahias Vargas
     */
    useEffect(() => {

        if (!isMounted.current) {
            fetchProfits();
            isMounted.current = true;
        }

    }, [fetchProfits]);

    /*
     Funcion: handleDateChange
     Descripcion: setea el rango de fechas
     Autor: Jose Ahias Vargas
     */
    const handleDateChange = (field, value) => {
        setDateRange(prev => ({ ...prev, [field]: value }));
    };

    /*
     Funcion: handleApplyFilter
     Descripcion: busca en base a los filtros
     Autor: Jose Ahias Vargas
     */
    const handleApplyFilter = () => {
        fetchProfits();
    };



const handleExportExcel = () => {
        const formattedData = profits.map(p => ({
            'Fecha': moment(p.created_at).format('DD/MM/YYYY HH:mm'),
            'Evento': p.event_name,
            'Ronda': p.round_number,
            'Pelea': p.fight_number,
            'Volumen Total': p.total_bet_amount,
            'Utilidad Casa': p.commission_amount,
            '% Real': ((p.commission_amount / p.total_bet_amount) * 100).toFixed(2) + '%'
        }));

        // Configuramos anchos de columna específicos
        const columns = [
            { wch: 20 }, { wch: 40 }, { wch: 15 },
            { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 10 }
        ];

        // FIX: Este nombre es para la PESTAÑA interna de Excel.
        // Debe ser menor a 31 caracteres y sin caracteres especiales (/ \ ? * [ ])
        const sheetName = `Reporte de Ganancias`; 

        // Nombre del ARCHIVO (Este sí puede llevar las fechas sin problema)
        const fileName = `Ganancias_Casa`;

        exportToExcel(formattedData, sheetName, fileName, columns);
    };


    return (
        <HouseProfit
            profits={profits}
            componentLoading={loading}
            dateRange={dateRange}
            onDateChange={handleDateChange}
            onApplyFilter={handleApplyFilter}
            onExportExcel={handleExportExcel}
        />
    );
};

export default HouseProfitContainer;