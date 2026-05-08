/*
Componente: BetContainer.jsx
Descripción: Contenedor para el historial de apuestas con filtro de eventos y balance
Autor: Jose Ahias Vargas
*/

import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import BetService from "../../../services/betService";
import BetHistory from "../../../components/client/Bets/BetHistory";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { EVENT_FILTERS, EVENT_PREVIEW } from "../../../constants/eventConstants";
import { GALLO } from "../../../constants/galloConstants";
import { SIDE_PREVIEW } from "../../../constants/sideConstants";
import { BETS_PREVIEW } from "../../../constants/betConstants";
import { useRef } from "react";

const BetHistoryContainer = ({ fightId = null }) => {
    const [initialLoading, setInitialLoading] = useState(false);
    const [eventsWithBalance, setEventsWithBalance] = useState([]);
    const [bets, setBets] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(EVENT_PREVIEW.ALL);
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(false);
    const { token, iduser } = useSecurity();
    const { setToastProps } = useToast();
    const { exportToExcel } = useExcelExport();
    /*
     Funcion: loadInitialData
     Descripcion: Carga los eventos con balance y las apuestas iniciales (Todas)
    */
    const loadInitialData = useCallback(async () => {
        setInitialLoading(true);
        try {

            if (fightId) {

                const res = await BetService.fetchFilterBetHistory({ userId: iduser, fightId: fightId, eventId: null }, token);
                if (res.code === STATUS.OK) setBets(res.data || []);

            }
            else {

                const resEvents = await BetService.fetchBetHistory({ userId: iduser }, token);
                if (resEvents.code === STATUS.OK) setEventsWithBalance(resEvents.data || []);


                const resBets = await BetService.fetchFilterBetHistory({ userId: iduser, fightId: null, eventId: EVENT_FILTERS.ALL }, token);
                if (resBets.code === STATUS.OK) setBets(resBets.data || []);

            }


        } catch (error) {
            console.error("error al cargar datos: ", error)
            setToastProps({ message: "Error al cargar datos", type: TOAST.DANGER });
        } finally {
            setInitialLoading(false);
        }
    }, [fightId, iduser, token, setToastProps]);

    useEffect(() => {

        if (!isMounted.current) {
            loadInitialData();
            isMounted.current = true;
        }


    }, [loadInitialData]);

    /*
     Funcion: handleEventChange
     Descripcion: Filtra la lista de apuestas cuando cambia el Select
    */
    const handleEventChange = async (eventId) => {
        setSelectedEventId(eventId);
        setLoading(true);
        try {
            const resBets = await BetService.fetchFilterBetHistory({ userId: iduser, fightId: null, eventId: eventId }, token);
            if (resBets.code === STATUS.OK) {
                setBets(resBets.data || []);
            }
        } catch (error) {
            console.error("error al filtrar apuestas: ", error)
            setToastProps({ message: "Error al filtrar apuestas", type: TOAST.DANGER });
        } finally {
            setLoading(false);
        }
    };

    /*
      Funcion: handleExportExcel
      Descripcion: forrmateamos los datos específicos para este reporte
      Autor: Jose Ahias Vargas
    */
    const handleExportExcel = () => {
        const formattedData = bets.map(bet => ({
            "ID Apuesta": bet.id,
            "Fecha": moment(bet.created_at).format('YYYY-MM-DD HH:mm:ss'),
            "Evento": bet.event_name,
            "Ronda": bet.round_number,
            "Pelea": bet.fight_number,
            "Gallerias": `${bet.gallo_a} vs ${bet.gallo_b}`,
            "Gallo Elegido": bet.picked_gallo,
            "Lado": bet.side === GALLO.A ? SIDE_PREVIEW.RED : SIDE_PREVIEW.GREEN,
            "Mecánica": bet.odd_type,
            "Monto": bet.amount,
            "Estado": BETS_PREVIEW[bet.paid]
        }));

        const columns = [
            { wch: 12 }, { wch: 20 }, { wch: 25 }, { wch: 10 },
            { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 15 },
            { wch: 12 }, { wch: 15 }
        ];

        exportToExcel(
            formattedData,
            `Historial_Apuestas_${moment().format('YYYYMMDD_HHmm')}`,
            "Apuestas",
            columns
        );
    };

    if (initialLoading) {
        return <div className="flex min-h-screen items-center justify-center animate__animated animate__fadeIn">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
        </div>;
    }

    return (
        <BetHistory
            events={eventsWithBalance}
            bets={bets}
            selectedEventId={selectedEventId}
            onEventChange={handleEventChange}
            loading={loading}
            isMiniVersion={!!fightId}
            onExportExcel={handleExportExcel}
        />
    );
};

export default BetHistoryContainer;