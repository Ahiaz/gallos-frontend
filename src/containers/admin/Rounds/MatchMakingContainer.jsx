/*
Componente: MatchMakingContainer.jsx
Descripción: Sub-componente para el armado masivo de peleas de una ronda.
Autor: Jose Ahias Vargas
*/
import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import MatchMaking from "../../../components/admin/Rounds/MatchMaking";
import { TOAST } from "../../../constants/toastConstants";
import { EVENT, EVENT_TYPE } from "../../../constants/eventConstants";

const MatchMakingContainer = ({ eventGalleries, onSave, loading, currentEvent, initialMatches = [] }) => {

    const { setToastProps } = useToast();
    //fila vacia
    const [rows, setRows] = useState([
        { gallery1_id: "", gallery2_id: "", weight1: "", weight2: "" }
    ]);

    /*
    Efecto: Cargar peleas iniciales
    Se ejecuta al montar el componente o si initialMatches cambia.
    */
useEffect(() => {
    if (initialMatches && initialMatches.length > 0) {
        const mappedRows = initialMatches
            .filter(m => m.status !== EVENT.CANCELLED)
            // ORDENAR POR ID ASCENDENTE
            .sort((a, b) => (a.id || 0) - (b.id || 0)) 
            .map(m => ({
                gallery1_id: m.gallery1_id || "",
                gallery2_id: m.gallery2_id || "",
                weight1: m.gallo1_weight ?? "", 
                weight2: m.gallo2_weight ?? "" 
            }));

        if (mappedRows.length > 0) {
            setRows(mappedRows);
        } else {
            setRows([{ gallery1_id: "", gallery2_id: "", weight1: "", weight2: "" }]);
        }
    }
    else {
        setRows([{ gallery1_id: "", gallery2_id: "", weight1: "", weight2: "" }]);
    }
}, [initialMatches]);



    /*
    Efecto: Sincronizar galerías
    Descripción: Si una galería es eliminada del evento, la removemos de las filas del matchmaking
    */
    useEffect(() => {
        // Creamos un Set con los IDs válidos para una búsqueda rápida
        const validIds = new Set(eventGalleries.map(g => String(g.id)));

        setRows(prevRows => {
            const updatedRows = prevRows.map(row => ({
                ...row,
                // Si el ID seleccionado ya no está en los validIds, lo reseteamos a ""
                gallery1_id: validIds.has(String(row.gallery1_id)) ? row.gallery1_id : "",
                gallery2_id: validIds.has(String(row.gallery2_id)) ? row.gallery2_id : ""
            }));

            // Solo actualizamos el estado si realmente hubo un cambio para evitar re-renders infinitos
            if (JSON.stringify(updatedRows) !== JSON.stringify(prevRows)) {
                return updatedRows;
            }
            return prevRows;
        });
    }, [eventGalleries]);


    /*
    funcion: addRow
    Descripción: nueva fila a la tabla
    Autor: Jose Ahias Vargas
    */
    const addRow = () => {
        setRows([...rows, { gallery1_id: "", gallery2_id: "", weight1: "", weight2: "" }]);
    };

    /*
    funcion: removeRow
    Descripción: elimina fila de la tabla
    Autor: Jose Ahias Vargas
    */
    const removeRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows.length > 0 ? newRows : [{ gallery1_id: "", gallery2_id: "", weight1: "", weight2: "" }]);
    };

    /*
    funcion: updateRow
    Descripción: actualiza fila de la tabla
    Autor: Jose Ahias Vargas
    */
    const updateRow = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    /*
    funcion: handleSave
    Descripción: guarda los cambios en la tabla
    Autor: Jose Ahias Vargas
    */
    const handleSave = () => {
        // 1. Validar que no haya galerías vacías

        const hasEmptyGalleries = rows.some(r => !r.gallery1_id || !r.gallery2_id);
        if (hasEmptyGalleries) {
            setToastProps({
                message: "Todas las peleas deben tener ambas galerías seleccionadas.",
                type: TOAST.DANGER
            });
            return false;
        }

        // 2. Validar que los pesos estén presentes y sean válidos (mayor a 0)
        const hasInvalidWeights = rows.some(r =>
            !r.weight1 || parseFloat(r.weight1) <= 0 ||
            !r.weight2 || parseFloat(r.weight2) <= 0
        );

        if (hasInvalidWeights) {
            setToastProps({
                message: "Debes asignar un peso válido a todos los ejemplares.",
                type: TOAST.DANGER
            });
            return false;
        }

        // 3. Validar formato de Onzas (Máximo .15)
        const hasInvalidOz = rows.some(r => {
            const w1 = r.weight1.toString();
            const w2 = r.weight2.toString();

            const checkOz = (val) => {
                if (val.includes('.')) {
                    const parts = val.split('.');
                    const oz = parseInt(parts[1]);
                    // Valida que si hay decimales, no excedan 15
                    // Y opcionalmente que no haya más de 2 dígitos decimales
                    return oz > 15 || parts[1].length > 2;
                }
                return false;
            };

            return checkOz(w1) || checkOz(w2);
        });

        if (hasInvalidOz) {
            setToastProps({
                message: "Formato de peso incorrecto: Las onzas no pueden exceder de .15",
                type: TOAST.DANGER
            });
            return false;
        }

        // 4. Validar que haya al menos una fila
        if (rows.length === 0) {
            setToastProps({
                message: "Debes agregar al menos una pelea al programa.",
                type: TOAST.DANGER
            });
            return false;
        }

        // 5. Verificar que no peleen contra ellos mismos
        const hasSelfFight = rows.some(r => r.gallery1_id === r.gallery2_id);
        if (hasSelfFight) {
            setToastProps({
                message: "Una galería no puede pelear contra sí misma.",
                type: TOAST.DANGER
            });
            return false;
        }

        // 6. Validar duplicados en la ronda (Solo para DERBY)
        if (currentEvent.type === EVENT_TYPE.DERBY) {
            const allSelectedIds = rows.flatMap(r => [r.gallery1_id, r.gallery2_id]);
            const uniqueIds = new Set(allSelectedIds);

            if (uniqueIds.size !== allSelectedIds.length) {
                setToastProps({
                    message: "Hay galerías duplicadas. En un Derby, cada equipo solo puede pelear una vez por ronda.",
                    type: TOAST.DANGER
                });
                return false;
            }
        }

        // Si todo está correcto, enviamos todas las filas
        onSave(rows);
    };

    return (
        <MatchMaking
            addRow={addRow}
            rows={rows}
            eventGalleries={eventGalleries}
            updateRow={updateRow}
            removeRow={removeRow}
            onConfirm={handleSave}
            loading={loading}

        />
    );
};

export default MatchMakingContainer;