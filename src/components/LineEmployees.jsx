import React from "react";
import { Divider } from "./Divider";

export const LineEmployees = ({ data, openModal, setIsChanging, setCurrentData }) => {
  const { id, name, surname, patronymic, birthDate, phoneNumber, role } =
    data;

  const roleStyles = (function getRoleColor() {
    switch (role) {
      case "accountant":
        return "bg-[#BDE3FF]";
      case "operator":
        return "bg-[#E9E9E9]";
      case "content":
        return "bg-[#e3eea0]";
      default:
        break;
    }
  })();

  const getRole = () => {
    switch (role) {
      case "accountant": 
        return 'Бухгалтер';
        
      case "operator": 
        return 'Оператор';

      case "content": 
        return 'Контент-менеджер';


      default:
        return '';
    }
  };

  return (
    <div className=" w-full h-12 flex flex-row items-center justify-between border-b border-l-2 border-r-2 border-['#E9E9E9'] bg-[#FAFAFA] ">
      <div className="w-1/10 pl-6">
        <span>{id}</span>
      </div>
      <div className="w-1/5">
        <span>{`${surname} ${name} ${patronymic}`}</span>
      </div>
      <div className="w-1/5">
        <span>{birthDate}</span>
      </div>
      <div className="w-1/5">
        <span>{phoneNumber}</span>
      </div>
      <div className="w-1/5">
        <div>
          <span
            className={`rounded-lg pl-[6px] pr-[6px] pt-[4px] pb-[4px] text-sm ${roleStyles}`}
          >
            {getRole()}
          </span>
        </div>
      </div>
      <div className="w-1/12 text-2xl pr-6">
        <button
          onClick={() => {
            setIsChanging(true);
            openModal();
            setCurrentData(data)
          }}
        >
          ...
        </button>
      </div>
    </div>
  );
};
