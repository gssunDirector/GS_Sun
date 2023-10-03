import React from "react";

export const EmployeeTableHeader = () => {
  return (
    <div className=" w-full h-12 flex flex-row items-center justify-between border-b-2 border-l-2 border-r-2 border-['#E9E9E9'] bg-[#FAFAFA]">
      <div className="w-1/10 pl-6 pr-6">
        <span className=" font-bold text-[#727272]">ID</span>
      </div>
      <div className="w-1/5">
        <span className=" font-bold text-[#727272]">ПІБ</span>
      </div>
      <div className="w-1/5">
        <span className=" font-bold text-[#727272]">Дата народження</span>
      </div>
      <div className="w-1/5">
        <span className=" font-bold text-[#727272]">Номер телефону</span>
      </div>
      <div className="w-1/5">
        <span className=" font-bold text-[#727272]">Роль</span>
      </div>
      <div className="w-1/12 pr-6 ">
        <span className=" font-bold text-[#727272]"></span>
      </div>
    </div>
  );
};
