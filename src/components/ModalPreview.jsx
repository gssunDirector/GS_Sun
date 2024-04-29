import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import { createNewPromotion, deleteImageFromStorage, updateDocumentInCollection, uploadFileToStorage, uploadFileToStoragesFolder } from "../helpers/firebaseControl";
import { BigButton } from "./BigButton";
import Editor from "./Editor";
import Mobile from "../assets/images/230x.png";
import ReactMarkdown from 'react-markdown';
import ReactHtmlParser from 'html-react-parser';
const ModalPreview = ({ isModalPreviewOpen,setEditorData, closeModalPreview, update, formData, data, setFile, setFormData, file, editorData,openModalForm }) => {


  const handleSave = update ? (
    async (e) => {
      e.preventDefault();

      const oldData = Object.values({
        title: data.title,
        promotionDate: data.promotionDate,
        text: data.text,
        isTop: data.isTop,
      });

      const newData = Object.values({
        title: formData.title,
        promotionDate: formData.promotionDate,
        text: editorData,
        isTop: formData.isTop,
      });

      if (oldData.some((el, i) => el !== newData[i])) {

        try {
          await updateDocumentInCollection('promotions', {
            ...data,
            title: formData.title,
            promotionDate: formData.promotionDate,
            text: editorData,
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
        setEditorData('');
        closeModalPreview();
        return;
      };
      toast.success("Акцію успішно оновлено")
      setFormData({
        image: '',
        title: '',
        promotionDate: '',
        text: '',
        isTop: false,
      })
      setEditorData('');
      setFile('');
      closeModalPreview();
    })
    : (
      async (e) => {
        e.preventDefault();

        try {
          createNewPromotion({
            ...formData,
            text: editorData
          }, file);

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
        setEditorData('');
        setFile('');
        closeModalPreview();
      }
    );

  return (

    <Modal
      isOpen={isModalPreviewOpen}
      onRequestClose={closeModalPreview}
      shouldCloseOnOverlayClick={false}
      className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] w-[688px] h-[80vh] rounded-lg overflow-y-auto shadow-md p-8 "
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <p className="text-2xl font-bold mb-6">Попередній перегляд</p>
      <div className="w-full h-[650px] flex justify-center w-full mb-6">
        <div className="relative overflow-hidden">
          <img src={Mobile} alt="preview" className=" h-full border-2 border-gray-300 rounded-lg" />
          <div className="absolute w-full top-[130px] left-0 px-4 pb-6">
            <div >
              <img src={formData?.image} alt="mainImage" className='w-full h-[150px] mb-4 object-cover rounded-lg' />
            </div>
            <div className='flex flex-col gap-[8px]'>
              <p className='text-[18px] font-bold'>{formData?.title}</p>

              {typeof editorData === 'string' && editorData.length > 0 ?
                <div dangerouslySetInnerHTML={{ __html: editorData }} />
                :
                <div dangerouslySetInnerHTML={{ __html: formData?.text }} />

              }

            </div>
          </div>

        </div>

      </div>
      <div className="flex flex-row justify-between">
        <button onClick={() => {
          closeModalPreview();
          openModalForm()
        }} type="button">
          <span className="text-[#DC0000] text-sm">Редагувати</span>
        </button>
        <div className="flex justify-end">
          <BigButton type="button" onClick={handleSave} label={update ? "Зберегти зміни" : "Додати"} labelColor="white" />
        </div>
      </div>
    </Modal>
  );
};

export default ModalPreview;
