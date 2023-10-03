export const ChangeTableHeader = () => {
    return (
      <div className=" w-full h-12 flex flex-row items-center justify-between border-b-2 border-l-2 border-r-2 border-['#E9E9E9'] bg-[#FAFAFA]">
        <div className="w-1/4 pl-6 pr-6">
          <span className=" font-bold text-[#727272]">Дата</span>
        </div>
        <div className="w-1/4">
          <span className=" font-bold text-[#727272]">Вид палива</span>
        </div>
        <div className="w-1/4">
          <span className=" font-bold text-[#727272]">Змінено з</span>
        </div>
        <div className="w-1/4">
          <span className=" font-bold text-[#727272]">Змінено на</span>
        </div>
      </div>
    );
  };
  