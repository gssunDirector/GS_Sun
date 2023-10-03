import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import { createNewPromotion, deleteImageFromStorage, updateDocumentInCollection, uploadFileToStorage, uploadFileToStoragesFolder } from "../helpers/firebaseControl";
import { BigButton } from "./BigButton";

export const ModalAddPromotion = ({ isOpen, closeModal, update, data }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    promotionDate: '',
    text: '',
    isTop: false,
  });


  useEffect(() => {
    if(data){
      setFormData(data);
    }
  }, [isOpen]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const soldCheckbox = ({ target: { checked } }) => {
   
    setFormData({...formData, isTop:  checked} );
  };

  const handleChangePhoto = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData({...formData, image: reader.result });
      };
    
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDeletePhoto = () => {
    setFile(null);
    setFormData({...formData,  image: ''});
  };

  const validateDate = (data) => {
    const arr = data.split('.');
    if(+arr[0] > 31 || +arr[1] > 12 || new Date(arr.reverse().join('/')) < new Date()) {
      return false;
    };

    return true;
  };
  

  const handleSubmit = update ? (
    async (e) => {
      e.preventDefault();    

      if(!validateDate(formData.promotionDate)) {
        toast.error("Неприпустима дата закінчення акції")
        return;
      };
      if(!file && formData.image.length === 0) {
        toast.error("Додайте картинку")
        return;
      };
   
      const oldData = Object.values({
        title: data.title,
        promotionDate: data.promotionDate,
        text: data.text,
        isTop: data.isTop,
      });

      const newData = Object.values({
        title: formData.title,
        promotionDate: formData.promotionDate,
        text: formData.text,
        isTop: formData.isTop,
      });

      if (oldData.some((el, i) => el !== newData[i])) {
    
        try {
        
          await updateDocumentInCollection('promotions', {
            ...data, 
            title: formData.title,
            promotionDate: formData.promotionDate,
            text: formData.text,
            isTop: formData.isTop,
            
          }, data.idPost);
          

        } catch (error) {
          console.log(error);
          toast.info("Заявку відхилено")
        }
      } else {
        setFormData({
          image: '',
          title: '',
          promotionDate: '',
          text: '',
          isTop: false,
        });
        closeModal();
        return;
      };
      if (file) {
        try {
          uploadFileToStorage(file, data.id, data.idPost);

        } catch (error) {
          console.log(error);
          toast.info("Заявку відхилено")
        }
      };

      toast.success("Акцію успішно оновлено")
      setFormData({
        image: '',
        title: '',
        promotionDate: '',
        text: '',
        isTop: false,
      })
      setFile('');
      closeModal();
    })
    : (
      async (e) => {
        e.preventDefault(); 
        if(!validateDate(formData.promotionDate)) {
          toast.error("Неприпустима дата закінчення акції")
          return;
        };
        if(!file) {
          toast.error("Додайте картинку")
          return;
        };

        try {
         
          createNewPromotion(formData, file);
      
          toast.success("Акцію успішно додано")
        } catch (error) {
          console.log(error);
          toast.info("Заявку відхилено")
        }
        setFormData({
          image: '',
          title: '',
          promotionDate: '',
          text: '',
          isTop: false,
        })
        setFile('');
        closeModal();
      }
    );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] w-[688px] h-max rounded-lg shadow-md p-8 "
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <p className="text-2xl font-bold">
        {update 
        ? 'Редагувати акцію'
        : 'Нова акція'
      }</p>
      <form onSubmit={(e) => handleSubmit(e)} className="pt-6 flex flex-col gap-[20px] mb-[20px]">
        <div className="flex gap-[16px]">
          {formData.image?.length > 0 
          ? (
            <>
              <div className="w-[250px] h-[120px] rounded-lg">
                <img src={formData.image} alt="promotionImage" className="w-full h-full rounded-lg object-cover"/>
              </div>
              <div className="flex flex-col gap-[10px]">
                <p className="font-bold">Редагувати фото</p>
                <div className="flex gap-[16px]">
                  <button 
                    className="text-[14px] text-[#E50404]"
                    onClick={handleDeletePhoto}
                    type="button"
                  >
                    Видалити
                  </button>
                  <label 
                    className="text-[14px] text-[#369FFF] relative cursor-pointer"
                    type="button"
                  >
                    Змінити
                    <input
                  type="file"
                  className=" opacity-0 h-[36px] w-[50px] absolute"
                  onChange={(e) => handleChangePhoto(e)} 
                />
                  </label>
                </div>
              </div>
            </>
            
          ) : (
           <div className="bg-[#E9E9E9] w-[250px] h-[120px] rounded-lg relative">
         
            
             <div
                className="text-[30px] text-[#727272] h-[36px] w-[36px] bg-[#fff] relative rounded-full absolute top-[45px] left-[110px] cursor-pointer"
              >
                <p className="absolute top-[-7px] left-[8px]">+</p>
              </div>
              <input
                  type="file"
                  className="cursor-pointer opacity-0 h-[36px] w-[36px] absolute top-[45px] left-[110px] "
                  onChange={(e) => handleChangePhoto(e)} 
                />
          </div>
          )}
          
        </div>
        

        <label className="flex flex-col gap-[8px]">
            <span className="font-bold">Заголовок</span>
            <div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Введіть заголовок"
                className="w-full h-[36px] rounded border-[#E9E9E9] border py-[5px] px-3"
              />
    
            </div>
          </label>

        <label className="flex flex-col gap-[8px]">
            <span className="font-bold">Основний текст</span>
            <div>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="Введіть текст акції"
                className="w-full h-[108px] rounded border-[#E9E9E9] border py-[5px] px-3 resize-none"
              />
    
            </div>
          </label>

          <label className="flex flex-col gap-[8px]">
            <span className="font-bold">Дійсна до</span>
            <div>
              <ReactInputMask
                type="text"
                name="promotionDate"
                mask="99.99.9999"
                maskChar="_"
                value={formData.promotionDate}
                onChange={handleChange}
                placeholder="_ _. _ _. _ _ _ _ "
                className="w-full h-[36px] rounded border-[#E9E9E9] border py-[5px] px-3"
              />
            </div>
          </label>

          <label className="w-full flex items-center gap-[10px]">
            
            <div>
              <input
                type="checkbox"
                name="isTop"
                value={formData.promotionDate}
                onChange={soldCheckbox}
                className=" rounded border-[#E9E9E9] border py-[5px] px-3"
              />
            </div>
            <span className="font-bold">Показувати на головному екрані</span>
          </label>
        

       
        <div className="flex flex-row justify-between">
          <button onClick={closeModal} type="button">
            <span className="text-[#DC0000] text-sm">Скасувати</span>
          </button>
          <div className="flex justify-end">
            <BigButton type="submit" label={update ? "Зберегти зміни": "Додати"}  labelColor="white" />
          </div>
        </div>
      </form>
    </Modal>
  );
};

