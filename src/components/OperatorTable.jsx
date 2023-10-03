import { useState, useContext, useEffect } from 'react';
import { AppContext } from './AppProvider';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { db } from '../firebase';

export const OperatorTable = ({ endReporOperator }) => {

    const { user, location } = useContext(AppContext);
    const [changeLocalStorage, setChangeLocalStorage] = useLocalStorage('changeDate', '');
    const [transactions, setTransaction] = useState([]);

    useEffect(() => {
        db.collection('transactions').where('uid', '==',  user.uid).where('type', '==', 'write-off').where('location', '==', location.adress).where('requestDate', '>',  Date.parse(new Date(changeLocalStorage))).onSnapshot(snapshot => {
            setTransaction(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
          });
    }, []);

    const getProductName = (el) => {
        switch (el) {
          case '95':
            return ['A95'];

          case 'A-95':
            return ['A95+'];

          case 'ДПe':
            return ['ДП+'];

          case 'ДП':
            return ['ДП'];
         
          default:
            return [el] ;
        }
      };

    return (
        <div>
            <div className="font-bold text-center text-[20px] mb-[10px]">Звіт оператора</div>
            <table id="operator-table" className="w-full border-collapse mb-[20px]">
                <thead>
                    <tr>
                        <th>Адреса</th>
                        <th>Оператор</th>
                        <th>Дата початку зміни</th>
                        <th>Час початку зміни</th>
                        <th>Дата завершення зміни</th>
                        <th>Час завершення зміни</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='mb-[40px]'>
                        <td className='text-center border-b-[20px] border-b-[transparent]'>{location.adress}</td>
                        <td className='text-center border-b-[20px] border-b-[transparent]'>{user?.surname}</td>
                        <td className='text-center border-b-[20px] border-b-[transparent]'>{changeLocalStorage.split(' ')[0]}</td>
                        <td className='text-center border-b-[20px] border-b-[transparent]'>{changeLocalStorage.split(' ')[1]}</td>
                        <td className='text-center border-b-[20px] border-b-[transparent]'>{endReporOperator.split(' ')[0]}</td>
                        <td className='text-center border-b-[20px] border-b-[transparent]'> {endReporOperator.split(' ')[1]}</td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>Вид палива</th>
                        {location.prices && Object.keys(location.prices).sort().map(el => {
                            return (
                                <th key={el}>{getProductName(el)}</th>
                            )
                        }) }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td className='font-bold'>Кількість літрів за зміну</td> 
                    {location.prices && Object.keys(location.prices).sort().map((el, i) => {
                            return (
                                <td key={el} className='text-center'>
                                    {transactions.filter(e => e.fuelType === el).map(e => e.litrs).reduce((a, b) => a + b, 0).toFixed(2)}
                                </td>
                            )
                        }) }
                 </tr>

                 <tr>
                    <td className='font-bold'>Сума за зміну</td> 
                    {location.prices && Object.keys(location.prices).sort().map((el, i) => {
                            return (
                                <td key={el} className='text-center'>
                                    {transactions.filter(e => e.fuelType === el).map(e => e.sum).reduce((a, b) => a + b, 0).toFixed(2)}
                                </td>
                            )
                        }) }
                 </tr>
                </tbody>
                 
            </table>
        </div>
       
    )
}