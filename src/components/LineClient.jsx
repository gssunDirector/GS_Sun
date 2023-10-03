import { useState, useContext } from 'react';
import Download from '../assets/images/download.svg';
import Cross from '../assets/images/cross.svg';
import {format, set} from 'date-fns';
import { deleteImageFromStorage, downloadReciept, updateFieldInDocumentInCollection } from '../helpers/firebaseControl';
import { Link } from 'react-router-dom';
import { BigButton } from './BigButton';
import { AppContext } from './AppProvider';
import { ModalMoneyTransfer } from './ModalMoneyTransfer';
import { toast } from "react-toastify";
import Modal from "react-modal";

export const LineClient = ({ data, isRequests, name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [currentClient, setCurrentClient] = useState({});
  const [clientIsWarning, setClientIsWarning] = useState(false);


  const { clients } = useContext(AppContext);

  const openModal = (client) => {
    setIsModalOpen(true);
    setCurrentClient(client);
  };     

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeWarning = () => {
    setIsWarning(false);
    setClientIsWarning(true);
  };


  const handleReject = async () => {
    if(!clientIsWarning){
      setIsWarning(true);
      return;
    };

    try {
      await updateFieldInDocumentInCollection('requests', data.id, 'reject', true);
      await updateFieldInDocumentInCollection('requests', data.id, 'active', false);
      
      if(data.url) {
        await deleteImageFromStorage(data.url);
        await updateFieldInDocumentInCollection('requests', data.id, 'url', '');
      };
      
      toast.success("Заявку успішно відхилено");
    } catch (error) {
      console.log(error);
      toast.info("Не вдалося відхилити заявку");
    }
  };


    return (
      <div
        className=" w-full h-12 flex flex-row items-center justify-between border-b border-l-2 border-r-2 border-['#E9E9E9'] bg-[#FAFAFA]"
       
      >
        <div className="w-1/10 pl-6">
          <span>{isRequests ? data.userNumber : data.clientNumber}</span>
        </div>
        <Link 
          className="w-1/5 hover:bg-[#E9E9E9] h-full flex items-center pl-1.5" 
          to={ isRequests ? `${data.userNumber}` : `${data.clientNumber}`}
          
        >
          <span>{isRequests ? name : `${data.lastname} ${data.name} `}</span>
        </Link>
        <div className="w-1/5">
          <span>{isRequests ? format(new Date(data.requestDate), 'HH:mm:ss dd.MM.yyyy') : data.birthday}</span>
        </div>
        {!isRequests && (
        <div className="w-1/5">
          <span>{data.phoneNumber}</span>
        </div>
            )}
        
        <div className="w-1/5">
          <div>
            <span
              className={`rounded-lg pl-[6px] pr-[6px] pt-[4px] pb-[4px] text-sm`}
            >
              {isRequests 
              ? <div className="flex">
                <div className="w-3/5">
                  {data.url && (
                    <a 
                    href={data.url} 
                    target="_blank" 
                    className="text-blue-600 underline"
                  >
                    {`receipt${format(new Date(data.requestDate), 'dd.MM.yyyy')}`}
                  </a>
                  )}
                </div>

                {data.url ? (
                  <button 
                    className="w-1/5"
                    onClick={() => downloadReciept(data.url, format(new Date(data.requestDate), 'dd.MM.yyyy'))}
                  >
                    <div className='w-8 h-8 bg-[#F7FDFC] rounded-full flex justify-center items-center'>
                      <img src={Download} alt='download' className='w-4 h-4' />
                    </div>  
                </button>
                ) : (
                  <div className="w-1/5"/>
                )}
               
                <button 
                  className="w-1/5"
                  onClick={handleReject}
                >
                    <div className='w-8 h-8 bg-[#F7FDFC] rounded-full flex justify-center items-center'>
                      <img src={Cross} alt='delete' className='w-3.5 h-3.5' />
                    </div>  
                </button>
                </div>
              : `${data.balance} грн`}
            </span>
          </div>
        </div>

        { isRequests && (
          <div className='w-1/5'>
            <BigButton
              onClick={() => openModal(clients.find(el => +el.clientNumber === +data.userNumber))}
              type="button"
              label="Зарахувати кошти"
              labelColor="white"
            />
          </div>
        )}
        <ModalMoneyTransfer
          data={isRequests ? data : null}
          isOpen={isModalOpen}
          closeModal={closeModal}
          client={currentClient}
          isGeneralPage
      />

      <Modal
        isOpen={isWarning}
        onRequestClose={closeWarning}
        shouldCloseOnOverlayClick={true}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] w-[688px] h-max rounded-lg shadow-md p-8"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        autoFocus={false}
    > 
    <div>
      <p>При відхиленні заявки квітанцію буде видалено!</p>
    </div>
    </Modal>
      </div>
      
    );
  };
  