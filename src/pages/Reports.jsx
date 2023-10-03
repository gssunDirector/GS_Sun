import { useState, useContext } from 'react';
import { SearchLineHeader } from "../components/SearchLineHeader"
import { ReportAccountantModal } from '../components/ReportAccountantModal';
import { db } from '../firebase';
import { AppContext } from '../components/AppProvider';
import { format, startOfDay } from 'date-fns';

import * as XLSX from 'xlsx';


export const Reports = () => {
    const [isModal, setIsModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [clientMark, setClientMark] = useState('name');

    const [other, setOther] = useState(false);

    const { clients, employees } = useContext(AppContext);

    const [filter, setFilter] = useState({
        startDate: '',
        endDate: '',
        client: '',
        location: '',
        fuelType: '',
        operator: '',
    });

    const [transactions, setTransactions] = useState([]);

    const openModal = () => {
        setIsModal(true);
    };

    const closeModal = () => {
        setIsModal(false);
    };

    const getProductName = (el) => {
        switch (el) {
          case 'A95':
            return '95';

          case 'A95+':
            return 'A-95';

          case 'ДП+':
            return 'ДПe';

          case 'ДП':
            return 'ДП';
         
          default:
            return el;
        }
      };

      
      const getProductNameReverce = (el) => {
        switch (el) {
          case '95':
            return 'A95';

          case 'A-95':
            return 'A95+';

          case 'ДПe':
            return 'ДП+';

          case 'ДП':
            return 'ДП';
         
          default:
            return el;
        }
      };



    const getTransactions = async() => {
        let query = db.collection("transactions").where('type', '==', 'write-off');
        const currentClient = clientMark === 'number' ? filter.client : clients.filter(el => el.lastname === filter.client)[0]?.clientNumber;
        const currentOperator = employees.filter(el => el.surname === filter.operator)[0]?.uid;
        const currentFuelType = getProductName(filter.fuelType);

        console.log(currentClient);
        console.log(currentFuelType);

      
            if (filter.startDate.length > 0) {
                 query = query.where('requestDate', '>', Date.parse(new Date(filter.startDate)));
            };
               
            
            if (filter.client.length > 0 || filter.client > 0) {
                  query = query.where('userNumber', '==', currentClient);
            };
              

            if (filter.location.length > 0) {
                query = query.where('location', '==', filter.location);
            };

            if (filter.fuelType.length > 0) {
                query = query.where('fuelType', '==', currentFuelType);
            };
            
            if (filter.operator.length > 0) {
                query = query.where('uid', '==', currentOperator);
            };
           

        try {
            const transactionsArray = [];
             await query/* .where('requestDate', '<', Date.parse(new Date(filter.endDate))) */.get().then(snapshot => {
                snapshot.forEach(doc => {
                    transactionsArray.push(doc.data());
                });
            });

            setTransactions(transactionsArray.filter(el => filter.endDate.length > 0 ? startOfDay(el.requestDate) <= Date.parse((new Date(filter.endDate))) : el));
            setOther(true);
        } catch(error) {
            console.log(error);
        }
        
    }


    const exportToExcel = () => {
        const table = document.getElementById("accountant-table"); // Замените на ваш ID таблицы
        const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet JS" });
        XLSX.writeFile(wb, `Accountant_Report${filter.startDate}_${filter.endDate}.xlsx`);
    };

    console.log(transactions);

    return (
        <>
            <div className="px-10">
                <SearchLineHeader
                    exportToExcel={exportToExcel}
                    otherReport={other}
                    noSearch
                    onButtonPress={() => {
                        setFilter({
                            startDate: '',
                            endDate: '',
                            client: '',
                            location: '',
                            fuelType: '',
                            operator: '', 
                        });
                        openModal()
                    }}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    title={`Звіт бухгалтера з ${filter.startDate} - по ${filter.endDate}`}
                    role="reports" 
                />

                <table id="accountant-table" className="w-full border-collapse mb-[20px]">

                    <thead>
                        <tr className='text-[#727272] border-b border-r border-l border-[#E9E9E9]'>
                            <th className='py-[10px]'>Дата</th>
                            <th className='py-[10px]'>Прізвище клієнта</th>
                            <th className='py-[10px]'>№ клієнта</th>
                            <th className='py-[10px]'>АЗС</th>
                            <th className='py-[10px]'>Тип палива</th>
                            <th className='py-[10px]'>Ціна, грн<br/>(з урахуванням знижки)</th>
                            <th className='py-[10px]'>Сумма, грн</th>
                            <th className='py-[10px]'>Літри</th>
                            <th className='py-[10px]'>Оператор</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)).map(el => {
                            
                            return (
                                <tr className='text-[#727272] border-b border-r border-l border-[#E9E9E9]' key={el.idPost}>
                                    <td className='p-[10px]'>
                                        {format(new Date(el.requestDate), 'HH:mm:ss dd.MM.yyyy')}
                                    </td>
                                    <td className='p-[10px]'>
                                        {clients.find(e => e.clientNumber === el.userNumber)?.lastname}
                                    </td>
                                    <td className='p-[10px]'>{el.userNumber}</td>
                                    <td className='p-[10px]'>{el.location}</td>
                                    <td className='p-[10px]'>{getProductNameReverce(el.fuelType)}</td>
                                    <td className='p-[10px]'>{(el.sum / el.litrs).toFixed(2)}</td>
                                    <td className='p-[10px]'>{el.sum.toFixed(2)}</td>
                                    <td className='p-[10px]'>{el.litrs}</td>
                                    <td className='p-[10px]'>
                                        {employees.find(e => e.uid === el.uid)?.surname}
                                    </td>       
                                </tr>
                            )
                        })}
                        <tr className='text-[#727272] border-b border-r border-l border-[#E9E9E9]'>
                            <td className='p-[10px] font-bold text-center'>Всього</td>
                            <td className='p-[10px]'></td>
                            <td className='p-[10px]'></td>
                            <td className='p-[10px]'></td>
                            <td className='p-[10px]'></td>
                            <td className='p-[10px]'>
                                
                            </td>
                            <td className='p-[10px]'>
                                {transactions.map(el => el.sum).reduce((a, b) => a + b, 0).toFixed(2)}
                            </td>
                            <td className='p-[10px]'></td>
                           
                        </tr>
                        
                    </tbody>

                </table>

            </div>
            <ReportAccountantModal 
                isOpen={isModal}
                closeModal={closeModal}
                filter={filter}
                setFilter={setFilter}
                clientMark={clientMark}
                setClientMark={setClientMark}
                getTransactions={getTransactions}
            />
        
        </>
    )    
        
}