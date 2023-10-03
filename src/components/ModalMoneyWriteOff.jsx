import { useState, useContext, useEffect } from 'react';
import Modal from "react-modal";
import { BigButton } from "./BigButton";

import { toast } from "react-toastify";
import { createNewTransaction, updateFieldInDocumentInCollection } from '../helpers/firebaseControl';
import { AppContext } from './AppProvider';
import cn from 'classnames';

export const ModalMoneyWriteOff = ({ isOpen, closeModal, client }) => {
    const [sum, setSum] = useState(0);
    const [info, setInfo] = useState({
      location: '',
      fuelType: '',
      litrs: 0,
    });


    const [operationType, setOperationType] = useState('litrs');

    const { location, user } = useContext(AppContext);

    const handleChange = (e) => {
      setSum(+e.target.value === "-" ? 0 : +e.target.value);
    };

    const handleChangeLitrs = (e) => {

      setInfo({ ...info, litrs: +e.target.value === '-' ? '0' : +e.target.value});
    };

    useEffect(() => {
      if(operationType === "litrs" && info.fuelType.length > 0) {
        setSum(+((info.litrs * (location.prices[info.fuelType] - client?.discount[info.fuelType])).toFixed(2)));
      }
    }, [info.litrs, info.fuelType]);

    useEffect(() => {
      if(operationType !== "litrs") {
        setInfo({...info,
        litrs: +(sum / (location.prices[info.fuelType] - client.discount[info.fuelType])).toFixed(2)});
      }
    }, [sum, info.fuelType]);
    

    const getProductName = (el) => {
      switch (el) {
        case '95':
          return ['A95'];

        case 'A-95':
          return ['A95', 'Преміум'];

        case 'ДПe':
          return ['ДП', 'Преміум'];

        case 'ДП':
          return ['ДП'];

        default:
          return [el, ''] ;
      }
    };

    
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (sum > client.balance) {
        toast.info("Заявку відхилено - недостатньо коштів");
        return;
      };

      if (sum === 0) {
        toast.info("Сума списання не може дорівнювати 0");
        return;
      };

      try {
        await updateFieldInDocumentInCollection('users', client.id, 'previousBalance', (+client.balance));
        await updateFieldInDocumentInCollection('users', client.id, 'balance', (+(+client.balance - sum).toFixed(2)));
        await createNewTransaction('write-off', client.clientNumber, sum, user, location, info);
        
        setSum(0);
        toast.success("Кошти успішно списано")

      } catch (error) {
        console.log(error);
        toast.info("Заявку відхилено")
      }
      setSum(0);
      setInfo({location: '',
      fuelType: '',
      litrs: 0})
      closeModal();
    };


    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] w-[688px] h-max rounded-lg shadow-md p-8"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        autoFocus={false}
      > 
    
        <p className="font-semibold text-2xl">Списання коштів</p>
      <form className="pt-6 flex flex-col gap-10" onSubmit={(e) => handleSubmit(e)}>
      <label className='flex-col relative w-full font-bold'>
        Тип палива
        <select
          type="text"
          value={info.fuelType}
          onChange={(e) => {
            setInfo({...info, fuelType: e.target.value});
           
          }}
          className="w-full font-normal h-[36px] rounded border-[#E9E9E9] border pl-2 pr-6 mt-2 text-gray-600 appearance-none z-10 relative bg-[transparent]"
        >
          <option value="" className="text-gray-400 disabled hidden">
            обрати
          </option>
          {Object.keys(location).length > 0  && Object.keys(location.prices).map(el => {
            return (
                <option key={el}  value={el}>{getProductName(el)}</option>
            )
          })}
        </select>
        <span className="absolute right-[20px] bottom-[10px] transform rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 pointer-events-none"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 7.707a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L10 10.414l-3.293 3.293a1 1 0 1 1-1.414-1.414l4-4z"
                  clipRule="evenodd"
                />
              </svg>
          </span>
          </label>
          <div className='self-center h-[30px] bg-[#E9E9E9] w-4/6 rounded flex items-center px-[4px]'>
            <button 
              className={cn('w-1/2 h-[24px] rounded font-semibold', {'bg-[#fff] shadow-md': operationType === 'litrs'})}  
              onClick={() => setOperationType('litrs')} type='button'>
              Літри
            </button>
            <button
             className={cn('w-1/2 h-[24px] rounded font-semibold', {'bg-[#fff] shadow-md': operationType === 'sum'})}  
             onClick={() => setOperationType('sum')} type='button'>
              Сума
            </button>
          </div>
       <div className="flex flex-col gap-[25px]">

        {operationType === 'litrs' 
        ? (
          <>
          <label className="flex-col">
            <span className="font-bold">Кількість літрів</span>
              <div>
                <input
                  type='number'
                  step="0.01"
                  className="w-full h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                  value={info.litrs}
                  onChange={(e) =>handleChangeLitrs(e)}
                  disabled={info.fuelType.length === 0}
                  min='0'
                />

              </div>
          </label>
          <div className='flex justify-between'>
            <p className='font-semibold text-[20px]'>Сума</p>
            <p className='font-semibold text-[24px]'>{`${sum} грн` }</p>
          </div>
        </>
        ) : (
          <>
          <label className="flex-col">
            <span className="font-bold">Сума</span>
              <div>
                <input
                  type='number'
                  step="0.01"
                  className="w-full h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                  value={sum}
                  onChange={(e) => handleChange(e)}
                  disabled={info.fuelType.length === 0}
                  min='0'
                />

              </div>
          </label>
          <div className='flex justify-between'>
            <p className='font-semibold text-[20px]'>Літри</p>
            <p className='font-semibold text-[24px]'>{`${info.litrs} літрів` }</p>
          </div>
        </>
        )
      }

        </div>
          
        <div className="flex flex-row justify-between">
          <button onClick={closeModal} type='button'>
            <span className="text-[#DC0000] text-sm">Скасувати</span>
          </button>
          <div className="flex justify-end">
            <BigButton type="submit" label="Списати кошти" labelColor="white" />
          </div>
        </div>
        
      </form>
    </Modal>
    )
}
