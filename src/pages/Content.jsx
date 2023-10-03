import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../components/AppProvider";
import { BigButton } from "../components/BigButton";
import { createNewPriceChange, updateFieldInDocumentInCollection } from "../helpers/firebaseControl";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ModalAddPromotion } from "../components/ModalAddPromotion";
import { LinePromotion } from "../components/LinePromotion";
import { getDate } from "date-fns";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function Content() {
  const [prices, setPrices] = useState({});
  const [isPricesChange, setIsPricesChange] = useState(false);
  const { location, user, setLocation, locations, promotions } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if(Object.values(location).length > 0) {
      onSnapshot(doc(db, "locations", location.idPost), (doc) => {
      setLocation({...location, ...doc.data()});
    });
    }
    
  }, []);


  useEffect(() => {
    const findLoc = locations.find(el => el.id === location);
    if(findLoc) {
      setLocation(findLoc);
      setPrices(findLoc?.prices);
    }
  }, [location]);


  
  const openModal = () => {
    setIsModalOpen(true);
  };     

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setPrices(location?.prices);
  }, [location]);


  const handleDiscountChange = (e, el) => {
    setPrices({...prices, [el]: +e.target.value})
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
          <span className=" text-lg mr-5">Акції</span>
        </div>
        <div>
        <button
          onClick={openModal}
          type="button"
          className="text-[#00B488]"
        >
          + Додати акцію
        </button>
      </div>
        </div>
        <div className="py-[24px] border-b-2  border-l-2 border-r-2 border-['#E9E9E9'] rounded-b-[4px] bg-[#FAFAFA] flex flex-col gap-[24px]">
           {promotions.sort((a, b) => {
         
         return new Date(getDate(b.changeDate) ) - new Date(getDate(a.changeDate));
       }).map(el => {
          return (
            <LinePromotion data={el} key={el.id} />
          )
        })}
        </div>
       
         
      </div>
      <div className="w-2/6 flex flex-col gap-[35px]">
          <form 
              className='shadow-md h-max rounded-t-[4px] border-[1px] mt-[40px]'
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className='h-[55px] border-b flex items-center p-[15px] text-lg'>
                Ціни
              </div>
              <div className='h-[55px] border-b flex items-center p-[15px] text-[16px]'>
                <div className="flex justify-between w-full items-center">
                  <div className="text-[18px]">Локація</div>
                  
                  <label className='flex-col relative w-full  p-[15px]'>
                   <select
                    type="text"
                    name="location"
                    value={location}
                    onChange={(e) => {
                    setLocation(e.target.value);
                   }}
                   className="w-full h-[36px] rounded border-[#E9E9E9] border pl-2 pr-6 mt-2 text-gray-600 appearance-none relative bg-[transparent]"
                >
          <option value="" className="text-gray-400 disabled hidden">
            {Object.values(location).length > 0 ? `${location.adress}` : 'обрати'} 
          </option>
          {locations.sort((a, b) => a.id - b.id).map(el => {
            return (
                <option key={el.id}  value={el.id}>{`${el.adress}`}</option>
            )
          })}
        </select>
        <span className="absolute right-[30px] bottom-[23px] transform rotate-180 z-[-1]">
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
                        min="0"
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
        <Link className="flex justify-between items-center" to={'content/changeHistory'}>
        <span className="text-[18px]">Історія змін</span>
        <span>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6.99382e-07L10 8L2 16L0.58 14.58L7.16 8L0.579999 1.42L2 6.99382e-07Z" fill="#727272"/>
          </svg>
        </span>
      </Link>
      )}

      
      </div>
      
      <ModalAddPromotion
        isOpen={isModalOpen}
        closeModal={closeModal}
      />
    </div>
  )
;
}