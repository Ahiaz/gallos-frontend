/*
Componente: UserContainer.jsx
Descripción: Contenedor para el usuario y su informacion
Autor: Jose Ahias Vargas
*/

import React, { useState, useEffect, useCallback, useRef } from "react";
import UserService from "../../../services/userService";
import { useSecurity } from "../../../hooks/useSecurity";
import { useToast } from "../../../hooks/useToast";
import { useModal } from "../../../hooks/useModal";
import { STATUS } from "../../../constants/statusConstants";
import { TOAST } from "../../../constants/toastConstants";
import { MODE } from "../../../constants/modeConstants";
import UserForm from "../../../components/Users/UserForm";
import { SYSTEM } from "../../../constants/systemConstants";
import UserList from "../../../components/client/User/UserList";


const UserContainer = () => {

    const { setToastProps } = useToast();
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(false);
    const { token, setUserInfo } = useSecurity();

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
     Descripcion: Carga el usuario logueado y la lista de usuarios
     Autor: Jose Ahias Vargas
    */
    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const user =  await setUserInfo(SYSTEM.KEY.ALL);
            setUserData(user);

        } catch (error) {
            console.error("Error la cargar los datos del usuario", error)
            setToastProps({ message: "Error al cargar datos del usuario", type: TOAST.DANGER });
        }

        finally {
            setLoading(false);
        }

        return null;
    }, [setToastProps, setUserInfo]);

    useEffect(() => {

        if (!isMounted.current) {
            fetchUser();

            isMounted.current = true;
        }

    }, [fetchUser]);


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
                    active: props["activeInput"]
                },
                token
            );

            if (res.code === STATUS.OK) {

                await fetchUser();

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
    Funcion: handleOpenUserModal
    Descripcion: Abre el modal del usuario
    Autor: Jose Ahias Vargas
   */
    const handleOpenUserModal = () => {

        let title = "";
        let confirmText = "";
        resetModalFormData();

        title = "Editar Usuario";
        confirmText = "Actualizar";
        setRequiredFields(["nameInput", "emailInput", "phoneInput", "activeInput", "roleInput"]);

        setModalComponent(() => () =>
            <UserForm userData={userData} />
        );

        setModalProps({
            title,
            cancelText: "Cancelar",
            confirmText: confirmText
        });

        const confirmCallback = updateUser.bind(null);

        setConfirmModalCallback(() => confirmCallback);

        toggleModal(true);


    };


    return (
        <>
            (
            <UserList
                user={userData}
                onOpenUser={handleOpenUserModal}
                loading={loading}
            />
            )
        </>
    );
};

export default UserContainer;