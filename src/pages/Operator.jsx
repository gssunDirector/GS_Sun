import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../components/AppProvider";
import { BigButton } from "../components/BigButton";
import { createNewPriceChange, updateFieldInDocumentInCollection } from "../helpers/firebaseControl";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { QrReader } from 'react-qr-reader';

import { doc, onSnapshot } from 'firebase/firestore';
import { db } from "../firebase";

export default function Operator() {
  const [searchQuery, setSearchQuery] = useState('');
  const [prices, setPrices] = useState({});
  const [isPricesChange, setIsPricesChange] = useState(false);
  const [isCamera, setIsCamera] = useState(false);
  const [data, setData] = useState('No result');

  const { location, user, setLocation } = useContext(AppContext);

  useEffect(() => {
    if(Object.values(location).length > 0) {
      onSnapshot(doc(db, "locations", location.idPost), (doc) => {
      setLocation({...location, ...doc.data()});
    });
    }
    
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    setPrices(location?.prices);
  }, [location]);

  useEffect(() => {
    if(isCamera) {
      setSearchQuery(data);
      setIsCamera(false);
    }
  }, [data]);

  const handleDiscountChange = (e, el) => {
    setPrices({...prices, [el]: +e.target.value})
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      navigate(`/operator/${searchQuery}`);
    }
  };

  const handleClick = () => {
    navigate(`/operator/${searchQuery}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      if(isPricesChange) {
        await createNewPriceChange(location, location.prices, prices, user.uid);
        await updateFieldInDocumentInCollection('locations', location.idPost, 'prices', prices);
        toast.success("Ціна успішно змінена");
        setIsPricesChange(false);
      }
      
    } catch (error) {
      console.log(error);
      toast.info("Заявку відхилено")
    };
  };

  return (
    <div className="p-10 flex gap-[24px]">
      <div className="w-4/6">
        <div className="w-full h-12 px-4 py-0 flex flex-row items-center justify-between border-b-2 border-t-2 border-l-2 border-r-2 border-['#E9E9E9'] rounded-t-[4px] mt-[43px] bg-[#FAFAFA]">
      
        <div className="pt-[14px] pb-[14px] pl-6">
          <span className=" text-lg mr-5">База клієнтів</span>
        </div>
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            disabled
            className="w-full h-[29px] py-[5.5px] pl-2 pr-2 text-gray-700 focus:outline-none focus:shadow-outline border border-['#FFFFFF'] rounded-l-[3px] text-sm"
          />
          <button 
            className="relative inset-y-0 h-[29px] right-0 flex items-center justify-center p-2   text-gray-500 bg-[#FAFAFA] border border-['#E9E9E9'] rounded-r-[3px] right-[1px]"
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={faSearch} color="#727272" fontSize={14} />
          </button>
          <button 
            className="relative inset-y-0 h-[29px] right-0 flex items-center justify-center p-2   text-gray-500 bg-[#FAFAFA] border border-['#E9E9E9'] rounded-r-[3px] right-[1px]"
            onClick={() => {
              setSearchQuery('');
              setIsCamera(false);
              setData('No result');
            }}
          >
            <FontAwesomeIcon icon={faXmark} color="#727272" fontSize={14} />
          </button>
      </div>
      
        </div>
        {isCamera 
        ? (
          <div className="w-full h-[450px] overflow-hidden">
          <QrReader
              onResult={(result, error) => {
                if (!!result) {
                  setData(result?.text);
                }

                if (!!error) {
                  console.info(error);
                }
              } }
              style={{ width: '100%' }} />
              </div>
        ) : (
        <div 
          className="h-[450px] bg-[#FAFAFA] border border-['#E9E9E9'] rounded-r-[3px] flex flex-col justify-center items-center text-[18px] font-semibold px-[200px] text-center gap-[10px]"
        >
          <p>Для початку роботи проскануйте штриф-код або введіть дані паливної картки в поле пошуку</p>
          <BigButton 
            onClick={() => setIsCamera(true)}
            type="button"
            label="Ввімкнути камеру"
            labelColor="white" />
        </div>
        )}
       
      </div>
      <div className="w-2/6 flex flex-col gap-[35px]">
          <form 
              className='shadow-md h-max rounded-t-[4px] border-[1px] mt-[40px]'
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className='h-[55px] border-b flex items-center p-[15px] text-lg'>
                Ціни
              </div>
              <div className='h-[55px] border-b flex items-center p-[15px] text-lg'>
                <div className="flex justify-between w-full">
                  <div>Локація</div>
                  <div className="text-[14px] flex gap-[10px]">
                    <span>{location.adress}</span>
                  </div>
                  
                </div>
              </div>

              {location.prices && Object.entries(location.prices).sort().map(el => {
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
                      return [el[0], ''] ;
                  }
                };
                return (
                  <div className='h-[75px] border-b px-[40px] py-[15px] flex justify-between items-center' key={el[0]}>
                    <div className='flex flex-col items-center gap-[0px] w-[60px]'>
                      <div className='text-lg font-bold '>{getProductName()[0]}</div>
                      <div className='text-xs font-bold text-[#727272]'>{getProductName()[1]}</div>
                    </div>
                    <div className='flex gap-[10px] items-center'>
                      <input 
                        className="w-[150px] h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                        value={prices && prices[el[0]]}
                        onFocus={() => setIsPricesChange(true)}
                        onChange={(e) => handleDiscountChange(e, el[0])}
                        type='number'
                        step="0.01"
                        min='0'
                      />
                      грн/литр
                    </div>
                  </div>
                );

              })}

              {isPricesChange && (
                 <div className='h-[55px] border-b flex items-center p-[15px] text-lg justify-end' >
                <BigButton
                  type="submit"
                  label="Змінити ціну"
                  labelColor="white"
                />
                </div>
              )}
             
      </form>

      {Object.entries(location).length > 0 && (
        <Link className="flex justify-between items-center" to={'operator/changeHistory'}>
        <span className="text-[18px]">Історія змін</span>
        <span>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6.99382e-07L10 8L2 16L0.58 14.58L7.16 8L0.579999 1.42L2 6.99382e-07Z" fill="#727272"/>
          </svg>
        </span>
      </Link>
      )}

      
      </div>
      
        
    </div>
  )
;
}
