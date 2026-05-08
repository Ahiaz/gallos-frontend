/*
Componente: UserAdminContainer.jsx
Descripción: Contenedor para administrar al usuario y sus saldos
Autor: Jose Ahias Vargas
*/

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import UserService from "../../../services/userService";
import { useSecurity } from "../../../hooks/useSecurity";
import { useSocket } from "../../../hooks/useSocket";
import { useToast } from "../../../hooks/useToast";
import { useModal } from "../../../hooks/useModal";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import styles from '../../../styles/General.module.css';
import WalletManagerContainer from "../Wallet/WalletManagerContainer";
import UserAdminList from "../../../components/admin/Users/UserAdminList";
import { MODE } from "../../../constants/modeConstants";
import UserForm from "../../../components/Users/UserForm";
import { SOCKET_EVENTS } from "../../../constants/socketConstants";


const UserAdminContainer = () => {

    const { setToastProps } = useToast();
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUsers, setShowUsers] = useState(true);
    const { token } = useSecurity();
    const { socket } = useSocket();
    const {
        toggleModal,
        setModalComponent,
        setModalProps,
        resetModalFormData,
        setConfirmModalCallback,
        setRequiredFields
    } = useModal();

    /*
     Funcion: fetchUsers
     Descripcion: Carga todos los usuarios
     Autor: Jose Ahias Vargas
    */
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await UserService.findAllUsersWithWallets({}, token);

            if (res.code === STATUS.OK) {
                setAllUsers(res.data || []);
                return res.data;
            }
            else {

                setToastProps({
                    message: res.message || "Error al obtener los datos del usuario",
                    type: TOAST.DANGER
                });
            }

        } catch (error) {
            console.log("Error la cargar los datos del usuario", error)
            setToastProps({ message: "Error al cargar datos del usuario", type: TOAST.DANGER });
        }

        finally {
            setLoading(false);
        }

        return [];
    }, [setToastProps, token]);

    useEffect(() => {


        if (!isMounted.current) {
            fetchUsers();
            isMounted.current = true;
        }


    }, [fetchUsers]);

    /*
     Funcion: filteredUsers
     Descripcion: Carga usuarios por filtro de forma local
     Autor: Jose Ahias Vargas
    */
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return allUsers;

        const lowSearch = searchTerm.toLowerCase();
        return allUsers.filter(user =>
            user?.username?.toLowerCase().includes(lowSearch) ||
            user?.name?.toLowerCase().includes(lowSearch) ||
            user?.email?.toLowerCase().includes(lowSearch) ||
            user?.id?.toString() === searchTerm
        );
    }, [searchTerm, allUsers]);



    /*
     Funcion: syncUserState
     Descripcion: sincroniza los usuarios con los cambios
    */

    const syncUserState = (updatedUser, mode = MODE.UPDATE) => {


        setSelectedUser(updatedUser);

        setAllUsers(prev => {
            if (mode === MODE.CREATE) {
                return [...prev, updatedUser];
            }

            return prev.map(e =>
                e.id === updatedUser.id ? updatedUser : e
            );
        });
    };

    /*
     Funcion: createUser
     Descripcion: crea el usuario
     Autor: Jose Ahias Vargas
    */

    const createUser = async (props) => {

        try {

            const res = await UserService.createUser(
                {
                    username: props["usernameInput"],
                    password: props["passwordInput"],
                    name: props["nameInput"],
                    email: props["emailInput"],
                    phone: props["phoneInput"],
                    role: props["roleInput"]
                },
                token
            );

            if (res.code === STATUS.OK) {

                const newUser = res.data;

                syncUserState(newUser, MODE.CREATE);

                setToastProps({ message: "Usuario creado correctamente!", type: TOAST.SUCCESS });


                return true;

            } else {

                setToastProps({ message: res.message || "No se pudo crear el usuario", type: TOAST.DANGER });
                return false;
            }

        } catch (error) {

            console.error(error);

            setToastProps({
                message: "Error de conexión al crear el usuario",
                type: TOAST.DANGER
            });

            return false;
        }

    };



    /*
     Funcion: updateUser
     Descripcion: actualiza el usuario
     Autor: Jose Ahias Vargas
    */

    const updateUser = async (props) => {

        try {


            const res = await UserService.updateUser(
                {
                    userId: props["id"],
                    username: props["usernameInput"],
                    password: props["passwordInput"],
                    name: props["nameInput"],
                    email: props["emailInput"],
                    phone: props["phoneInput"],
                    role: props["roleInput"],
                    active: props["activeInput"],
                    chatBlocked: props["chatBlockedInput"]
                },
                token
            );


            if (res.code === STATUS.OK) {

                const updateUser = res.data;

                syncUserState(updateUser, MODE.UPDATE);

                socket.emit(SOCKET_EVENTS.EMIT.CHAT_BLOCK, {
                userId: props["id"]
                });


                setToastProps({ message: "Usuario actualizado correctamente!", type: TOAST.SUCCESS });


                return true;

            } else {

                setToastProps({ message: res.message || "No se pudo actualizar el usuario", type: TOAST.DANGER });
                return false;
            }

        } catch (error) {

            console.error(error);

            setToastProps({
                message: "Error de conexión al actualizar el usuario",
                type: TOAST.DANGER
            });

            return false;
        }

    };


    /*
     Funcion: handleOpenWallet
     Descripcion: Abre la billetera del usuario
     Autor: Jose Ahias Vargas
    */
    const handleOpenWallet = (user) => {
        setSelectedUser(user);
        setShowUsers(false);

    };

    /*
    Funcion: handleOpenUserModal
    Descripcion: Abre el modal del usuario
    Autor: Jose Ahias Vargas
   */
    const handleOpenUserModal = (mode, user = null) => {

        let title = "";
        let confirmText = "";
        resetModalFormData();

        if (mode === MODE.CREATE) {

            title = "Crear Nuevo Usuario";
            confirmText = "Crear";
            setRequiredFields(["nameInput", "emailInput", "phoneInput", "activeInput", "roleInput", "passwordInput"]);

        }
        else {

            title = "Editar Usuario";
            confirmText = "Actualizar";
            setRequiredFields(["nameInput", "emailInput", "phoneInput", "activeInput", "roleInput"]);


        }

        setModalComponent(() => () =>
            <UserForm userData={user} />
        );

        setModalProps({
            title,
            cancelText: "Cancelar",
            confirmText: confirmText
        });

        const confirmCallback = mode === MODE.CREATE ? createUser.bind(null) : updateUser.bind(null);

        setConfirmModalCallback(() => confirmCallback);

        toggleModal(true);


    };


    /*
     Funcion: handleBack
     Descripcion: Al hacer clic en "Volver" desde el Wallet Manager
     Autor: Jose Ahias Vargas
    */
    const handleBack = async () => {

        setShowUsers(true);
    };


    /*
     Funcion: handleRefreshUserData
     Descripcion: Refresca los datos del usuario
     Autor: Jose Ahias Vargas
    */
    const handleRefreshUserData = async () => {

        const freshUsers = await fetchUsers(); // Refrescamos la lista para ver los nuevos saldos
        const user = freshUsers.find(user =>
            user.id.toString() === selectedUser?.id?.toString()
        );
        setSelectedUser(user);
    };

    return (
        <>
            {!showUsers ? (

                <div className="animate__animated animate__fadeIn">
                    <div className="container-fluid mt-3">

                        <div className="mb-4 rounded-xl border border-white/10 bg-brand-900 p-4">
                            <button className={`${styles.btnSecondary} mb-2 text-sm`} onClick={handleBack}>
                                <i className="bi bi-arrow-left me-2"></i>Regresar
                            </button>
                            <h5 className="mb-0 text-center font-bold text-white">
                                <i className="bi bi-person-gear me-2"></i>Gestión de Billetera del Usuario:{' '}
                                <span className="font-black uppercase">{selectedUser?.username}</span>
                            </h5>
                        </div>

                        <WalletManagerContainer
                            userData={selectedUser}
                            onRefresh={handleRefreshUserData}
                        />

                    </div>

                </div>


            ) : (
                <UserAdminList
                    users={filteredUsers}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onOpenWallet={handleOpenWallet}
                    onOpenUser={handleOpenUserModal}
                    loading={loading}

                />
            )}
        </>
    );
};

export default UserAdminContainer;