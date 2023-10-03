import {useContext } from 'react';
import Modal from "react-modal";
import { BigButton } from "./BigButton";
import { AppContext } from './AppProvider';
import { InputWithSearch } from './InputWithSearch';
import { Transaction } from 'firebase/firestore';

export const ReportAccountantModal = ({ isOpen, closeModal, filter, setFilter, clientMark, setClientMark, getTransactions}) => {
    const { clients, locations, employees } = useContext(AppContext);


    function handleChange (e, name) {
        setFilter((prevState) => ({
          ...prevState,
          [name]: e.target.value,
        }));
      };

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

    const handleGetTransactions = () => {
        console.log('submit')
        getTransactions();
        closeModal();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            shouldCloseOnOverlayClick={false}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] w-[60%] h-max rounded-lg shadow-md p-8"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            autoFocus={false}
        > 
        <p className="font-bold text-[24px] mb-[30px]">Формування звіту бухгалтера</p>
        <div className="mb-[20px] flex flex-col gap-[20px]" >
            <div className="flex  justify-between gap-[20px]">
                <label className="flex flex-col gap-[5px] w-1/2">
                    <span className="font-bold">Початок періоду</span>
                    <input 
                      type="date"
                      name="startDate"
                      onChange={(e) => handleChange(e, 'startDate')}
                      value={filter.startDate}
                      className="w-full h-[36px] rounded border-[#E9E9E9] border pl-3"
                    />
                </label>
                <label className="flex flex-col gap-[5px] w-1/2">
                    <span className="font-bold">Кінець періоду</span>
                    <input 
                        type="date"
                        name="endDate"
                        onChange={(e) => handleChange(e, 'endDate')}
                        value={filter.endDate}
                        className="w-full h-[36px] rounded border-[#E9E9E9] border pl-3" 
                        min={filter.startDate}
                    />
                </label>
            </div>

           
            <div className="flex  justify-between gap-[20px]">
                <div className="flex gap-[10px] w-1/2 ">
                    <InputWithSearch 
                        handleChange={handleChange} 
                        title='Прізвище клієнта'
                        name="client"
                        value={clientMark === 'name' ? filter.client : ''}
                        disabled={clientMark === 'number'}
                        array={clientMark === 'name' ? clients.filter(el => el.lastname.toLowerCase().includes(filter.client.toLowerCase())).map(el => el.lastname) : []}
                        filter={filter}
                        setFilter={setFilter}
                    />

                    <input 
                        className='self-end mb-[10px]'
                        type="radio"
                        name="clientMark"
                        checked={clientMark === "name"}
                        onChange={() => {
                            setClientMark('name')
                            setFilter({
                                ...filter,
                                client: '',
                            })
                        }}
                    />

                </div>
               
                <div className="flex gap-[10px] w-1/2 ">
                    <InputWithSearch 
                        handleChange={handleChange} 
                        title='№ Картки клієнта'
                        name="client"
                        value={clientMark === 'number' ? filter.client : ''}
                        disabled={clientMark === 'name'}
                        array={clients.filter(el => `${el.clientNumber}`.includes(filter.client)).map(el => el.clientNumber)}
                        filter={filter}
                        setFilter={setFilter}
                    />

                    <input 
                        className='self-end mb-[10px]'
                        type="radio"
                        name="clientMark"
                        checked={clientMark === "number"}
                        onChange={() => {
                            setClientMark('number')
                            setFilter({
                                ...filter,
                                client: '',
                            })
                            }}
                    />
                </div>
            </div>

            <div className="flex  justify-between gap-[20px]">
                <div className="w-1/2">
                    <InputWithSearch 
                        handleChange={handleChange} 
                        title='АЗС'
                        name="location"
                        value={filter.location}
                        array={locations.filter(el => el.adress.toLowerCase().includes(filter.location.toLowerCase())).map(el => el.adress)}
                        filter={filter}
                        setFilter={setFilter}
                    />
                </div>
               
                <div className="w-1/2">
                    <InputWithSearch 
                        handleChange={handleChange} 
                        title='Тип палива'
                        name="fuelType"
                        value={filter.fuelType}
                        array={Object.keys(locations.filter(el => el.id === '1')[0].prices).map(el => getProductName(el)[0])}
                        filter={filter}
                        setFilter={setFilter}
                    />
                </div>
            </div>

            <div>
            <InputWithSearch 
                handleChange={handleChange} 
                title='Прізвище оператора'
                name="operator"
                value={filter.operator}
                array={employees.filter(el => el.role === 'operator').map(el => el.surname).filter(el => el.toLowerCase().includes(filter.operator.toLowerCase()))}
                filter={filter}
                setFilter={setFilter}
                    />
            </div>
            <p className='self-end'>Формування звіту відбувається за заповненими полями.</p>
        </div>

         <div className="flex flex-row justify-between">
                <button onClick={closeModal} type='button'>
                    <span className="text-[#DC0000] text-sm">Скасувати</span>
                </button>
                <div className="flex justify-end">
                    <BigButton 
                        type="button" 
                        label="Сформувати звіт" 
                        labelColor="white" 
                        onClick={() => handleGetTransactions()}
                    />
                </div>
            </div>

     </Modal>
    )
}