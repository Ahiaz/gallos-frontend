/*
Componente: WalletManagerContainer.jsx
Descripción: Contenedor para aumentar o disminuir el balance del jugador
Autor: Jose Ahias Vargas
*/

import WalletService from "../../../services/walletService";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import { useModal } from "../../../hooks/useModal";
import { useSocket } from "../../../hooks/useSocket";
import WalletManager from "../../../components/admin/Wallet/WalletManager";
import WalletForm from "../../../components/admin/Wallet/WalletForm";
import { WALLET_CONFIRMATION } from "../../../constants/walletConstants";
import { SOCKET_EVENTS } from "../../../constants/socketConstants";


const WalletManagerContainer = ({userData = null, onRefresh = null}) => {
    const { showConfirm } = useConfirmModal();
    const { token } = useSecurity();
    const { setToastProps } = useToast();
    const { socket } = useSocket();
    const {
        toggleModal,
        setModalComponent,
        setModalProps,
        resetModalFormData,
        setConfirmModalCallback,
        setRequiredFields,
    } = useModal();


    /*
    funcion: handleOpenModalAction
    Descripción: Abre el modal para Depósito, Bono , Retiro
    Autor: Jose Ahias Vargas
    */

    const handleOpenModalAction = (actionType, typeKey) => {

        const title = `${typeKey}`;
        const confirmText = 'Confirmar';

         resetModalFormData();

        setRequiredFields([
            "amountInput",
            "descriptionInput"
         ]);

         setModalComponent(() => () =>
            <WalletForm
            type={actionType}
            currentBalance={userData.balance}
            currentLimit={userData.credit_limit}

            />);

        setModalProps(
            {
                title: title,
                cancelText: "Cancelar",
                confirmText: confirmText,
            });

        const confirmCallback = executeAction.bind(actionType);

        setConfirmModalCallback(() => confirmCallback);

        toggleModal(true);

    };

    /*
    funcion: executeAction
    Descripción: Abre el modal de confirmacion
    Autor: Jose Ahias Vargas
    */

    const executeAction = (props) => {

        showConfirm({ title: 'Confirmación', message: `¿Desea realizar el ${WALLET_CONFIRMATION[props["operationType"]]} ?`, onConfirm: () => handleWalletAction(props) })

    };

    /*
    funcion: handleWalletAction
    Descripción: ejecuta la accion de la billetera
    Autor: Jose Ahias Vargas
    */

    const handleWalletAction = async (props) => {
        try {

            const res = await WalletService.executeAdminWalletAction({
                userId: userData.id,
                type: props["operationType"], 
                amount: props["amountInput"],
                description : props["descriptionInput"]

            }, token);

            if (res.code === STATUS.OK) {

                socket.emit(SOCKET_EVENTS.EMIT.WALLET_BALANCE_UPDATE, {
                    userId: userData.id,
                    message: `Se realizo un ${WALLET_CONFIRMATION[props["operationType"]]} por ${props["amountInput"]} a tu billetera`
                });

                await onRefresh(); // Recargamos datos para ver el nuevo saldo
                setToastProps({ message: "Operación exitosa", type: TOAST.SUCCESS });
                return true;
            } else {
                await onRefresh();
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
    return (
        <WalletManager 
            userData={userData}
            onOpenModal={handleOpenModalAction}
        />
    );
};

export default WalletManagerContainer;