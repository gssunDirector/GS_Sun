import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppContext } from '../components/AppProvider';
import { BigButton } from '../components/BigButton';
import { ModalMoneyTransfer } from '../components/ModalMoneyTransfer';
import { toast } from "react-toastify";
import { updateFieldInDocumentInCollection } from '../helpers/firebaseControl';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { TransactionTableHeader } from '../components/TransactionTableHeader';
import { db } from '../firebase';
import { LineTransaction } from '../components/LineTransaction';
import { TransactionOperatorTableHeader } from '../components/TransactionOperatorTableHeader';
import { LineTransactionOperator } from '../components/LineTransactionOperator';
import { ModalMoneyWriteOff } from '../components/ModalMoneyWriteOff';
import { getDate } from '../App';
import { format } from 'date-fns';

export const ClientCard = ({ isOperator }) => {
  const [client, setClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOperatorOpen, setIsModalOperatorOpen] = useState(false);
  const [discount, setDiscount] = useState({});
  const [isDiscountChange, setIsDiscountChange] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');

  const [clientRequests, setClientRequests] = useState([]);
  const [clientTransactions, setClientTransaction] = useState([]);
  const [visibleTransactions, setVisibleTransactions] =useState([]);
  
  const { slug } = useParams();
  

  const { clients, setClients } = useContext(AppContext);

  useEffect(() => {
    if(clients.length === 0) {
      db.collection('users').onSnapshot(snapshot => {
        setClients(snapshot.docs.map(doc => ({...doc?.data(), id: doc.id})));
      });
    }
  }, [])

  useEffect(() => {
    const currentClient = clients.find(el => el.clientNumber === +slug);

    setClient(currentClient);
    
  }, [clients, client]);

  

  useEffect(() => {
    if (client) {
      setDiscount(client?.discount);
      db.collection('requests').where('userNumber', '==', client?.clientNumber).onSnapshot(snapshot => {
        setClientRequests(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      })
    
    db.collection('transactions').where('userNumber', '==', client?.clientNumber).onSnapshot(snapshot => {
      setClientTransaction(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
      setVisibleTransactions([...clientTransactions, ...clientRequests]);
    }
    
  }, [client]);

  const openModal = () => {
    setIsModalOpen(true);
  };     

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalOperator = () => {
    setIsModalOperatorOpen(true);
  };     

  const closeModalOperator = () => {
    setIsModalOperatorOpen(false);
  };

  const handleDiscountChange = (e, el) => {
    setDiscount({...discount, [el]: +e.target.value === '-' ? '0' : +e.target.value})
  };

  useEffect(() => {
    const filteredTransactions = [...clientTransactions, ...clientRequests].filter(el => {
      switch(filter) {
        case 'transfer':
        case 'write-off':
          return el.type === filter;
        
        case 'request':
          return Object.values(el).length === 6;

        case 'request-rejected':

          return el.reject;

        default:
          return el;
      }
    });
  
    setVisibleTransactions(filteredTransactions);
  }, [filter]);

  useEffect(() => {
    const searchResult = filter 
    ? [...clientTransactions, ...clientRequests].filter(el => {
      switch(filter) {
        case 'transfer':
        case 'write-off':
          return el.type === filter;
        
        case 'request':
          return Object.values(el).length === 6;

        case 'request-rejected':

          return el.reject;

        default:
          return el;
      }
    }).filter(
      el => `${el.sum}`.includes(searchQuery) 
      || `${format(new Date(el.requestDate), 'HH:mm:ss dd.MM.yyy') }`.includes(searchQuery)
    ) 
    : [...clientTransactions, ...clientRequests]
      .filter(
        el => `${el.sum}`.includes(searchQuery) 
        || `${format(new Date(el.requestDate), 'HH:mm:ss dd.MM.yyy') }`.includes(searchQuery)
      );
    if (searchQuery.length > 0) {
      setVisibleTransactions(searchResult);
    };
  }, [searchQuery, filter]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try { 
      if(isDiscountChange) {
        await updateFieldInDocumentInCollection('users', client.id, 'discount', discount);
        toast.success("Знижка успішно змінена");
        setIsDiscountChange(false);
      }
      
    } catch (error) {
      console.log(error);
      toast.info("Заявку відхилено")
    };
  };

  useEffect(() => {
    const deleteTransactions = clientTransactions.map(el => {
      return {...el, requestDate: `${new Date(el.requestDate)}`}}).filter(el => new Date(el.requestDate) < new Date().setDate(new Date().getDate() - 62));
    const deleteRequest = clientRequests.filter(el => {
      return new Date(el.requestDate) < new Date().setDate(new Date().getDate() - 62);
    });
    
    if(deleteTransactions.length > 0) {
      deleteTransactions.forEach(el => db.collection('transactions').doc(el.idPost).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    }))
    };
    if(deleteRequest.length > 0) {
      deleteRequest.forEach(el => db.collection('requests').doc(el.id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    }))
    };
  }, [clientTransactions, clientRequests]);

  return (
    <div className='px-8 py-10 flex flex-col gap-7'>
      {client ? (
        
         <><div className='flex justify-between'>
          {isOperator
            ? (
              <div className="flex gap-[5px]">
                <Link to="/operator" className="text-[#727272] flex gap-[10px] items-center">
                  <span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825L9.425 14.6L8 16Z" fill="#727272" />
                    </svg>

                  </span>
                  <span className='text-[24px]'>Головна</span>
                </Link>
                <h1 className='font-semibold text-2xl'>
                  {`/ ${client.lastname} ${client.name} #${client.clientNumber}`}
                </h1>
              </div>
            ) : (
              <h1 className='font-semibold text-2xl'>
                {`${client.lastname} ${client.name} #${client.clientNumber}`}
              </h1>
            )}

          {isOperator
            ? (
              <BigButton
                onClick={openModalOperator}
                type="button"
                label="Cписати кошти"
                labelColor="white" />
            ) : (
              <BigButton
                onClick={openModal}
                type="button"
                label="Зарахувати кошти"
                labelColor="white" />
            )}

        </div><div className="flex justify-between">
            <div className='flex flex-col gap-8'>
              <div className='bg-[#E9E9E9] w-max p-2.5 min-w-[120px] text-center font-semibold text-2xl rounded-lg'>
                {`${client?.balance} грн`}
              </div>

              <div>
                <div className="flex justify-between w-[400px]"><span>Номер телефона:</span> <span>{client?.phoneNumber}</span></div>
                <div className="flex justify-between w-[400px]"><span>Дата народження:</span> <span>{client?.birthday}</span> </div>
                <div className="flex justify-between w-[400px]"><span>Email:</span> <span>{client?.email?.length > 0 ? client?.email : 'не заповнено' }</span> </div>
              </div>
            </div>

            <form
              className='w-[400px] shadow-md h-max rounded-lg border-[1px]'
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className='h-[55px] border-b flex items-center p-[15px] text-lg'>
                Знижка
              </div>

              {Object.entries(client.discount).sort().map(el => {
                const getProductName = () => {
                  switch (el[0]) {
                    case '95':
                      return ['A95'];

                    case 'A-95':
                      return ['A95', 'Преміум'];

                    case 'ДПe':
                      return ['ДП', 'Преміум'];

                    case 'ДП':
                      return ['ДП'];

                    default:
                      return [el[0], ''];
                  }
                };
                return (
                  <div key={el[0]} className='h-[75px] border-b px-[40px] py-[15px] flex justify-between items-center'>
                    <div className='flex flex-col items-center gap-[0px] w-[60px]'>
                      <div className='text-lg font-bold '>{getProductName()[0]}</div>
                      <div className='text-xs font-bold text-[#727272]'>{getProductName()[1]}</div>
                    </div>
                    <div className='flex gap-[10px] items-center'>
                      {isOperator
                        ? (
                          <div className="w-[150px] h-[36px] rounded border-[#E9E9E9] border flex items-center px-[10px]">
                            {discount && discount[el[0]]}
                          </div>
                        ) : (
                          <input
                            className="w-[150px] h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                            value={discount && discount[el[0]]}
                            onFocus={() => setIsDiscountChange(true)}
                            onChange={(e) => handleDiscountChange(e, el[0])}
                            type='number'
                            step="0.01"
                            min='0' />
                        )}

                      грн/литр
                    </div>
                  </div>
                );

              })}

              {isDiscountChange && (
                <div className='h-[55px] border-b flex items-center p-[15px] text-lg justify-end'>
                  <BigButton
                    type="submit"
                    label="Змінити знижку"
                    labelColor="white" />
                </div>
              )}

            </form>
          </div>
          <div
            className='w-full shadow-md h-max rounded-lg border-[1px] flex flex-col gap-[20px]'
          >
            <div className='flex justify-between  p-[15px]'>
              <p className='text-[17px]'>Історія транзакцій</p>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Шукати..."
                  className="w-full h-[29px] py-[5.5px] pl-2 pr-2 text-gray-700 focus:outline-none focus:shadow-outline border border-['#FFFFFF'] rounded-l-[3px] text-sm" />
                <div className="relative inset-y-0 h-[29px] right-0 flex items-center justify-center p-2 text-gray-500 pointer-events-none bg-[#FAFAFA] border border-['#E9E9E9'] rounded-r-[3px] right-[1px]">
                  <FontAwesomeIcon icon={faSearch} color="#727272" fontSize={14} />
                </div>
              </div>
            </div>
            {!isOperator && (
              <label className='flex-col relative w-[260px]  p-[15px]'>
                <select
                  type="text"
                  name="role"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-[260px] h-[36px] rounded border-[#E9E9E9] border pl-2 pr-6 mt-2 text-gray-600 appearance-none z-10 relative bg-[transparent]"
                >
                  <option value="" className="text-gray-400">
                    Всі типи транзакцій
                  </option>
                  <option value="transfer">Зарахування</option>
                  <option value="write-off">Списання</option>
                  <option value="request">Заявка</option>
                  <option value="request-rejected">Відхилена заявка</option>
                </select>
                <span className="absolute right-0 bottom-[23px] transform rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400 pointer-events-none"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 7.707a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L10 10.414l-3.293 3.293a1 1 0 1 1-1.414-1.414l4-4z"
                      clipRule="evenodd" />
                  </svg>
                </span>
              </label>
            )}

            {isOperator
              ? (
                <div>
                  <TransactionOperatorTableHeader />
                  {(searchQuery.length === 0)
                    ? (
                      clientTransactions.filter(el => el.type === 'write-off').sort((a, b) => {

                        return new Date(b.requestDate) - new Date(a.requestDate);
                      }).map(el => {
                        return (
                          <LineTransactionOperator data={el} key={el.idPost} />
                        );
                      })

                    ) : (
                      visibleTransactions.filter(el => el.type === 'write-off').sort((a, b) => {

                        return new Date(b.requestDate) - new Date(a.requestDate);
                      }).map(el => {
                        return (
                          <LineTransactionOperator data={el} key={el.idPost} />
                        );
                      })
                    )}

                </div>
              ) : (
                <div>
                  <TransactionTableHeader />

                  {(filter.length === 0 && searchQuery.length === 0)
                    ? (
                      [...clientRequests, ...clientTransactions].sort((a, b) => {

                        return new Date(b.requestDate) - new Date(a.requestDate);
                      }).map(el => {
                        return (
                          <LineTransaction key={el} data={el} isRequest={Object.values(el).length <= 7} />
                        );
                      })

                    ) : (
                      visibleTransactions.sort((a, b) => {

                        return new Date(b.requestDate) - new Date(a.requestDate);
                      }).map(el => {
                        return (
                          <LineTransaction key={el} data={el} isRequest={Object.values(el).length <= 7 } />
                        );
                      })
                    )}
                </div>
              )}
          </div></>
      ) : (
        <div className="flex gap-[5px]">
                <Link to="/operator" className="text-[#727272] flex gap-[10px] items-center">
                  <span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825L9.425 14.6L8 16Z" fill="#727272" />
                    </svg>

                  </span>
                  <span className='text-[24px]'>Головна</span>
                </Link>
                <h1 className='font-semibold text-2xl'>
                 / Клієнта з таким номером не існує
                </h1>
              </div>
      )}
   
   
      <ModalMoneyTransfer
        isOpen={isModalOpen}
        closeModal={closeModal}
        client={client}
      />

      <ModalMoneyWriteOff
        isOpen={isModalOperatorOpen}
        closeModal={closeModalOperator}
        client={client}
      />
    </div>
  );
};
