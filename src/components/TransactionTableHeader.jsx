export const TransactionTableHeader = () => {
    return (
      <div className="w-full h-12 flex flex-row items-center justify-between border-b-2 border-['#E9E9E9'] ">
        <div className="w-1/6 pl-6 pr-6">
          <span className=" font-bold text-[#727272]">Час та дата</span>
        </div>
        <div className="w-1/6 ">
          <span className=" font-bold text-[#727272]">Тип транзікції</span>
        </div>
        <div className="w-1/6 pl-6 pr-6">
          <span className=" font-bold text-[#727272]">АЗС</span>
        </div>
        <div className="w-1/6">
          <span className=" font-bold text-[#727272]">Тип палива</span>
        </div>
        <div className="w-1/6">
          <span className=" font-bold text-[#727272]">Сума</span>
        </div>
        <div className="w-1/6">
          <span className=" font-bold text-[#727272]">Літри</span>
        </div>
        <div className="w-1/6 pl-6 pr-6">
          <span className=" font-bold text-[#727272]">Квитанція</span>
        </div>
      </div>
    );
  };
  