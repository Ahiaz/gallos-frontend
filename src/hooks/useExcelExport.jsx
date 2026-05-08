/*
Hook: useExcelExport.js
Descripción: Hook genérico para exportar arreglos de objetos a Excel (XLSX)
Autor: Jose Ahias Vargas
*/
import * as XLSX from 'xlsx';
import { useToast } from '../hooks/useToast';
import { TOAST } from '../constants/toastConstants';

export const useExcelExport = () => {
    const { setToastProps } = useToast();

    const exportToExcel = (data, fileName = "Reporte", sheetName = "Datos", columnWidths = []) => {
        try {
            if (!data || data.length === 0) {
                setToastProps({ message: "No hay datos disponibles para exportar", type: TOAST.WARNING });
                return;
            }

            // 1. Crear el libro y la hoja
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            // 2. Aplicar anchos de columna si se proporcionan
            if (columnWidths.length > 0) {
                worksheet['!cols'] = columnWidths;
            }

            // 3. Generar archivo y descargar
            XLSX.writeFile(workbook, `${fileName}.xlsx`);

            setToastProps({ message: "Archivo generado con éxito", type: TOAST.SUCCESS });
        } catch (error) {
            console.error("Error al exportar Excel:", error);
            setToastProps({ message: "Error crítico al generar el Excel", type: TOAST.DANGER });
        }
    };

    return { exportToExcel };
};