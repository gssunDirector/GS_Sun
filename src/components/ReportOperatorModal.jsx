import Modal from "react-modal";
import { BigButton } from "./BigButton";
import { OperatorTable } from "./OperatorTable";

import * as XLSX from 'xlsx';
import { logOut } from "../helpers/firebaseControl";
import { useContext } from "react";
import { AppContext } from "./AppProvider";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const ReportOperatorModal = ({isOpen, closeModal, endReporOperator}) => {

    const { setUserRole, setUser  } = useContext(AppContext);

    const [changeLocalStorage, setChangeLocalStorage] = useLocalStorage('changeDate', '');

    const [locationLocalStorage, setlocationLocalStorage] = useLocalStorage('location', {});

    const exportToExcel = () => {
        const table = document.getElementById("operator-table"); // Замените на ваш ID таблицы
        const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet JS" });
        XLSX.writeFile(wb, `Operator_Report${endReporOperator}.xlsx`);
    };


    const handleLogout = () => {
        exportToExcel();
        
        setUserRole(null);
        setUser(null);
       /*  setAuthUser(null); */
        setChangeLocalStorage('');
        setlocationLocalStorage({});
        closeModal();
        logOut();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            shouldCloseOnOverlayClick={false}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] w-[90%] h-max rounded-lg shadow-md p-8 z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            autoFocus={false}
        > 

            <OperatorTable 
                endReporOperator={endReporOperator}
            />

            <div className="flex flex-row justify-between">
                <button onClick={closeModal} type='button'>
                    <span className="text-[#DC0000] text-sm">Скасувати</span>
                </button>
                <div className="flex justify-end">
                    <BigButton 
                        type="button" 
                        label="Завершити зміну" 
                        labelColor="white" 
                        onClick={handleLogout}
                    />
                </div>
            </div>

      </Modal>
    )
}