/*
Componente: TransactionRequestContainer.jsx
Descripción: Contenedor para las solicitudes de transacciones
Autor: Jose Ahias Vargas
*/

import { useState, useEffect, useCallback, useRef } from "react";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { useModal } from "../../../hooks/useModal";
import { useSocket } from "../../../hooks/useSocket";
import WalletService from "../../../services/walletService";
import { TOAST } from "../../../constants/toastConstants";
import { STATUS } from "../../../constants/statusConstants";
import moment from "moment";
import { WALLET_ACTION, WALLET_STATUS } from "../../../constants/walletConstants";
import TransactionRequestList from "../../../components/admin/Wallet/TransactionRequestList";
import TransactionReviewForm from "../../../components/admin/Wallet/TransactionReviewForm";
import { SOCKET_EVENTS } from "../../../constants/socketConstants";

const TransactionRequestContainer = () => {
    const isMounted = useRef(false);
    const [requests, setRequests] = useState([]);
    const { token, iduser } = useSecurity();
    const [loading, setLoading] = useState(false);
    const [loadingActionId, setLoadingActionId] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        fromDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        userId: ''
    });

    const { setToastProps } = useToast();
    const {
        toggleModal,
        setModalComponent,
        setModalProps,
        resetModalFormData,
        setConfirmModalCallback,
        setRequiredFields
    } = useModal();

    const { socket } = useSocket();


    const TITLES = {
        [WALLET_ACTION.DEPOSIT]: "Solicitud de depósito",
        [WALLET_ACTION.WITHDRAWAL]: "Solicitud de retiro",
        [WALLET_ACTION.CREDIT_LOAD]: "Solicitud de crédito",
        [WALLET_ACTION.CREDIT_PAYMENT]: "Solicitud de pago de crédito"
    };


    /*
     Funcion: fetchUserWalletSummary
     Descripcion: obtiene los balances del usuario y cuanto puede retirar
     Autor: Jose Ahias Vargas
     */

    const fetchUserWalletSummary = useCallback(async (userId) => {
        setLoading(true);
        try {
            const res = await WalletService.fetchUserWalletSummary({ userId: userId }, token);

            if (res.code === STATUS.OK) {
                return res.data
            }
            else {

                setToastProps({ message: "No se pudo cargar los datos del estado de cuenta", type: TOAST.DANGER });

            }
        } catch (error) {
            console.error("Error: ", error)
            setToastProps({ message: "No se pudo cargar los datos del estado de cuenta", type: TOAST.DANGER });
        } finally {
            setLoading(false);
        }

        return {};
    }, [token, setToastProps]);


    /*
    Funcion: fetchRequests
    Descripción: Carga la lista de transacciones pendientes
    Autor: Jose Ahias Vargas
    */

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const res = await WalletService.fetchWalletRequests({ filters }, token);
            if (res.code === STATUS.OK) setRequests(res.data || []);
            else
                setToastProps({ message: res.message || "Error al cargar solicitudes", type: TOAST.DANGER });
        } catch (error) {
            console.error("error", error);
            setToastProps("Error al cargar solicitudes", TOAST.DANGER);
        } finally {
            setLoading(false);
        }
    }, [filters, setToastProps, token]);


    useEffect(() => {

        if (!isMounted.current) {
            fetchRequests();
            isMounted.current = true;
        }

    }, [fetchRequests]);


    /*
    funcion: handleWalletProcess
    Descripción: ejecuta el proceso de la billetera
    Autor: Jose Ahias Vargas
    */

    const handleWalletProcess = async (props) => {
        try {

            const res = await WalletService.processWalletRequest({
                requestId: props["requestId"],
                amountApplied: props["amountAppliedInput"],
                status: props["statusInput"],
                adminNotes: props["adminNotesInput"],
                userId: props["userId"],
                adminId: iduser
            }, token);


            if (res.code === STATUS.OK) {

              const statusText = props["statusInput"] === WALLET_STATUS.APPLIED ? "aprobó" : "rechazó";

               const text = TITLES[props["type"]].toLocaleLowerCase() || "Solicitud de billetera";

                socket.emit(SOCKET_EVENTS.EMIT.WALLET_BALANCE_UPDATE, {
                    userId: props["userId"],
                    message: `Se ${statusText} la ${text} por ${props["amountAppliedInput"]} a tu billetera`
                });

                await fetchRequests();
                setToastProps({ message: "Operación exitosa", type: TOAST.SUCCESS });
                return true;

            } else {
                await fetchRequests();
                setToastProps({ message: res.message, type: TOAST.DANGER });
                return false;

            }
        }
        catch (error) {
            setToastProps({ message: "Error de conexión con el servidor", type: TOAST.DANGER });
            console.error("Error al ejecutar la accion", error)
            return false;

        }



    };


    /*
    funcion: handleAction
    Descripción: configura el modal de solicitud y lo muestra
    Autor: Jose Ahias Vargas
    */

    const handleAction = async (request) => {

        try {
            setLoadingActionId(request.id);


            const title = TITLES[request.type] || "Solicitud de billetera";

            //esconde el boton de confirmar si el status no es PENDING
            const confirmText = request.status !== WALLET_STATUS.PENDING ? "" : "Procesar";

            resetModalFormData();

            setRequiredFields(["amountAppliedInput", "statusInput"]);

            const summary = await fetchUserWalletSummary(request.user_id);


            setModalComponent(() => () =>
                <TransactionReviewForm
                    request={request}
                    walletSummary={summary}
                />
            );

            setModalProps({
                title,
                cancelText: "Cancelar",
                confirmText: confirmText
            });

            const confirmCallback = handleWalletProcess.bind(null);

            setConfirmModalCallback(() => confirmCallback);

            toggleModal(true);
        } catch (error) {
            console.error("error", error);
            setToastProps({ message: "No se pudo cargar los datos del estado de cuenta", type: TOAST.DANGER });
        } finally {
            setLoadingActionId(null);
        }

    };

    return (
        <TransactionRequestList
            requests={requests}
            filters={filters}
            setFilters={setFilters}
            loading={loading}
            onAction={handleAction}
            onRefresh={fetchRequests}
            loadingActionId={loadingActionId}
        />
    );
};

export default TransactionRequestContainer;