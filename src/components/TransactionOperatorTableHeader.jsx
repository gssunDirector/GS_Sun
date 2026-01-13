export const TransactionOperatorTableHeader = () => {
  return (
    <div className="w-full h-12 flex flex-row items-center justify-between border-b-2 border-['#E9E9E9'] ">
      <div className="flex-1 pl-6 pr-6 min-w-[120px]">
        <span className=" font-bold text-[#727272]">Час та дата</span>
      </div>
      <div className="flex-1 min-w-[100px]">
        <span className=" font-bold text-[#727272]">AЗС</span>
      </div>
      <div className="flex-1 pl-6 pr-6 min-w-[100px]">
        <span className=" font-bold text-[#727272]">Тип палива</span>
      </div>
      <div className="flex-1 min-w-[80px]">
        <span className=" font-bold text-[#727272]">Літри</span>
      </div>
      <div className="flex-1 min-w-[80px]">
        <span className=" font-bold text-[#727272]">Баланс</span>
      </div>
      <div className="flex-1 min-w-[80px]">
        <span className=" font-bold text-[#727272]">Готівка</span>
      </div>
      <div className="flex-1 min-w-[80px]">
        <span className=" font-bold text-[#727272]">Всього</span>
      </div>
    </div>
  );
};
