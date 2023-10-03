import { useState, useEffect } from 'react';
import { BigButton } from './BigButton';
import { deleteImageFromStorage, deleteObjectFromeStorage, removeDocumentFromCollection } from '../helpers/firebaseControl';
import { toast } from "react-toastify";
import { ModalAddPromotion } from './ModalAddPromotion';

export const LinePromotion = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };     

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePromotionDelete = async () => {
    try {
      await removeDocumentFromCollection('promotions', data.idPost);
      await deleteImageFromStorage(data.image);
      toast.success("Акцію успішно видалено");
  
    } catch (error) {
      console.log(error);
      toast.info("Заявку на видалення відхилено");
    }
  };
   
    return (
      <div className='flex px-[24px] gap-[24px]'>
        <div className='w-1/3'>
          <img src={data.image} alt="mainImage" className='w-full h-[130px] object-cover rounded-lg'/>
        </div>
      <div className='w-1/3 flex flex-col gap-[8px]'>
        <p className='text-[18px] font-bold'>{data.title}</p>
        <p className='text-[12px] font-[600] text-[#00B488]'>{`Акція діє до ${data.promotionDate}`}</p>
        <p className='text-[12px] font-[600]'>{data.text}</p>
      </div>
      <div className='w-1/3 flex gap-[16px] justify-end items-start'>
        <button 
          className='text-[#DC0000] h-[36px]'
          onClick={handlePromotionDelete}
        >
          Видалити
        </button>
        <BigButton 
          type="button"
          label="Редагувати"
          labelColor="white"
          onClick={openModal}
        />
      </div>
      <ModalAddPromotion
        isOpen={isModalOpen}
        closeModal={closeModal}
        update={true}
        data={data}
      />
      </div>
     
    );
  };