/*
Componente: TransactionRequestContainer.jsx
Descripción: Lógica para que el usuario gestione sus propias solicitudes.
Autor: Jose Ahias Vargas
*/
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { useModal } from "../../../hooks/useModal";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import WalletService from "../../../services/walletService";
import { TOAST } from "../../../constants/toastConstants";
import { STATUS } from "../../../constants/statusConstants";
import moment from "moment";
import { WALLET, WALLET_ACTION, WALLET_STATUS } from "../../../constants/walletConstants";
import TransactionRequestList from "../../../components/client/Wallet/TransactionRequestList";
import TransactionRequestForm from "../../../components/client/Wallet/TransactionRequestForm";
import CreditRequestForm from "../../../components/client/Wallet/CreditRequestForm";

const TransactionRequestContainer = () => {
    const navigate = useNavigate();
    const { iduser, token, setTheBalance, currency } = useSecurity();
    const isMounted = useRef(false);
    const [requests, setRequests] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        fromDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        userId: iduser
    });
    const { setToastProps } = useToast();
    const { showConfirm } = useConfirmModal();
    const {
        toggleModal,
        setModalComponent,
        setModalProps,
        resetModalFormData,
        setConfirmModalCallback,
        setRequiredFields
    } = useModal();



    /*
     Funcion: fetchUserWalletSummary
     Descripcion: obtiene los balances del usuario y cuanto puede retirar
     Autor: Jose Ahias Vargas
     */

    const fetchUserWalletSummary = useCallback(async () => {
        setLoading(true);
        try {

            const res = await WalletService.fetchUserWalletSummary({ userId: iduser }, token);

            if (res.code === STATUS.OK) {
                setSummary(res.data || null);
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
    }, [iduser, token, setToastProps]);



    /*
     Funcion: fetchUserRequests
     Descripcion: obtiene las transacciones solicitadas por el usuario
     Autor: Jose Ahias Vargas
     */

    const fetchUserRequests = useCallback(async () => {
        setLoading(true);
        try {

            const res = await WalletService.fetchWalletRequestsByUser({ filters }, token);

            if (res.code === STATUS.OK) {
                setRequests(res.data || []);
            }
            else {

                setToastProps({ message: "No se pudieron cargar tus solicitudes", type: TOAST.DANGER });

            }

            await fetchUserWalletSummary();

        } catch (error) {
            console.error("Error: ", error)
            setToastProps({ message: "No se pudieron cargar tus solicitudes", type: TOAST.DANGER });
        } finally {
            setLoading(false);
        }
    }, [filters, token, fetchUserWalletSummary, setToastProps]);



    useEffect(() => {


        if (!isMounted.current) {
            fetchUserRequests();
            isMounted.current = true;
        }


    }, [fetchUserRequests]);

    /*
     Funcion: handleCreate
     Descripcion: crea las transacciones solicitadas por el usuario
     Autor: Jose Ahias Vargas
     */

    const handleCreate = async (props) => {
        try {
            setLoading(true);

            const type = (props['typeInput'] === WALLET.DEPOSIT && props['isDebtPayment']) ? WALLET.CREDIT_PAYMENT : props['typeInput'];

            const res = await WalletService.createWalletRequest(
                {
                    amount: props['amountInput'],
                    type: type,
                    docRef: props['docRefInput'],
                    comments: props['commentsInput'],
                    userId: iduser
                }, token);
            if (res.code === STATUS.OK) {
                setToastProps({ message: "Solicitud enviada con éxito", type: TOAST.SUCCESS });
                setTheBalance(res.data.balance);
                await fetchUserRequests();
                return true;
            } else {
                setToastProps({ message: res.message, type: TOAST.DANGER });
                return false;
            }
        } catch (error) {
            console.error("Error: ", error)
            setToastProps({ message: "Error al crear la solicitud", type: TOAST.DANGER });
            return false;
        } finally {
            setLoading(false);
        }
    };


    /*
     Funcion: handleCancel
     Descripcion: cancela las transacciones solicitadas por el usuario
     Autor: Jose Ahias Vargas
     */

    const handleCancel = async (requestId) => {
        try {
            setLoading(true);

            const res = await WalletService.cancelWalletRequest(
                {
                    requestId,
                    userId: iduser
                }, token);
            if (res.code === STATUS.OK) {
                setToastProps({ message: "Se cancelo con éxito", type: TOAST.SUCCESS });
                setTheBalance(res.data.balance);
                await fetchUserRequests();
                return true;
            } else {
                setToastProps({ message: res.message, type: TOAST.DANGER });
                return false;
            }
        } catch (error) {
            console.error("Error: ", error)
            setToastProps({ message: "Error al cancelar la solicitud", type: TOAST.DANGER });
            return false;
        } finally {
            setLoading(false);
        }
    };





    /*
        funcion: handleImmediateDebtPayment
        Descripción: Confirmación rápida
        Autor: Jose Ahias Vargas
        */

    const handleImmediateDebtPayment = async () => {

        let success = false;

        try {
            setLoading(true);
            const res = await WalletService.liquidateDebt({userId: iduser }, token);

            if (res.code === STATUS.OK) {
                setToastProps({ message: "Deuda disminuida con éxito. Redireccionando", type: TOAST.SUCCESS });
                setTheBalance(res.data.balance);
                await fetchUserRequests();
                success = true;

                await new Promise(resolve => setTimeout(resolve, 4000));

                return true;
            }else {
                setToastProps({ message: res.message, type: TOAST.DANGER });
                return false;
            }
        } catch (error) {
            console.error("Error: ", error)
            setToastProps({ message: "Error al liquidar la deuda", type: TOAST.DANGER });
            return false;
        } finally {
            setLoading(false);

            if(success) navigate('/client/statement');
        }
    };


    /*
    funcion: handleOpenRequest
    Descripción: Abre el modal de solicitud
    Autor: Jose Ahias Vargas
    */

    const handleOpenRequest = (type) => {

        const title = type === WALLET_ACTION.DEPOSIT ? "Solicitud de depósito" : "Solicitud de retiro";
        const confirmText = "Enviar";

        resetModalFormData();

        setRequiredFields(["amountInput", "typeInput", "docRefInput"]);

        setModalComponent(() => () =>
            <TransactionRequestForm
                type={type}
                walletSummary={summary}
                onImmediateDebtPayment={handleImmediateDebtConfirmation}

            />
        );

        setModalProps({
            title,
            cancelText: "Cancelar",
            confirmText: confirmText
        });

        const confirmCallback = handleCreate.bind(null);

        setConfirmModalCallback(() => confirmCallback);

        toggleModal(true);


    };


    /*
    funcion: handleCreditRequest
    Descripción: Abre el modal de solicitud de credito
    Autor: Jose Ahias Vargas
    */

    const handleCreditRequest = () => {

        const title = "Solicitud de Crédito";
        const confirmText = "Solicitar";

        resetModalFormData();

        setRequiredFields(["amountInput", "typeInput", "docRefInput"]);

        setModalComponent(() => () =>
            <CreditRequestForm
                walletSummary={summary}
            />
        );

        setModalProps({
            title,
            cancelText: "Cancelar",
            confirmText: confirmText
        });

        const confirmCallback = handleCreate.bind(null);

        setConfirmModalCallback(() => confirmCallback);

        toggleModal(true);


    };


    /*
    funcion: handleCancelRequest
    Descripción: Confirmacion de cancelacion
    Autor: Jose Ahias Vargas
    */

    const handleCancelRequest = (requestId) => {

        if (!requestId) return;

        showConfirm({ title: 'Confirmación', message: `¿Desea cancelar la solicitud ?`, onConfirm: () => handleCancel(requestId) })

    };


    /*
    funcion: handleImmediateDebtConfirmation
    Descripción: Confirmacion de pago de deuda con balance
    Autor: Jose Ahias Vargas
    */

    const handleImmediateDebtConfirmation = (amount, debt) => {

        if (!debt) return;

        resetModalFormData();

        setRequiredFields([]);

        showConfirm({ title: 'Confirmación', message: `¿Deseas abonar ${currency}${debt}, a tu deuda de ${currency}${debt}, usando tu saldo disponible?`, onConfirm: () => handleImmediateDebtPayment() });

    };




    return (
        <TransactionRequestList
            requests={requests}
            filters={filters}
            setFilters={setFilters}
            loading={loading}
            onCancel={handleCancelRequest}
            onRefresh={fetchUserRequests}
            onRequestNew={handleOpenRequest}
            onCreditNew={handleCreditRequest}

        />
    );
};

export default TransactionRequestContainer;