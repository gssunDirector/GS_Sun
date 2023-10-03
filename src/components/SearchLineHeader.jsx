import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BigButton } from "../components/BigButton";

import Exel from '../assets/images/exel.svg';

export const SearchLineHeader = ({ 
  onButtonPress, 
  searchQuery, 
  setSearchQuery,
  title,
  role,
  setIsChanging,
  setCurrentData,
  noSearch,
  otherReport,
  exportToExcel
 }) => {

  return (
    <div className="w-full h-12 px-4 py-0 flex flex-row items-center justify-between border-b-2 border-t-2 border-l-2 border-r-2 border-['#E9E9E9'] rounded-t-[4px] mt-[43px] bg-[#FAFAFA]">
      <div className="flex flex-row">
        <div className="pt-[14px] pb-[14px] pl-6">
          <span className=" text-lg mr-5">{title}</span>
        </div>
        {!noSearch && (
           <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Шукати..."
            className="w-full h-[29px] py-[5.5px] pl-2 pr-2 text-gray-700 focus:outline-none focus:shadow-outline border border-['#FFFFFF'] rounded-l-[3px] text-sm"
          />
          <div className="relative inset-y-0 h-[29px] right-0 flex items-center justify-center p-2 text-gray-500 pointer-events-none bg-[#FAFAFA] border border-['#E9E9E9'] rounded-r-[3px] right-[1px]">
            <FontAwesomeIcon icon={faSearch} color="#727272" fontSize={14} />
          </div>
        </div>
        )}
       
      </div>
      {role === "employees" && (
        <div>
        <BigButton
          onClick={() => {
            setIsChanging(false);
            setCurrentData(null);
            onButtonPress();
          }}
          type="button"
          label="+ Додати"
          labelColor="white"
        />
      </div>
      )}

      {role === "reports" && (
        <div className="flex gap-[40px]">
          {otherReport && (
            <button 
              type="button"
              onClick={exportToExcel}
            >
              <img src={Exel} alt="exel" />
            </button>
          )}
        <BigButton
          onClick={onButtonPress}
          type="button"
          label={otherReport ? 'Сформувати інший звіт' : "Сформувати звіт"} 
          labelColor="white"
        />
      </div>
      )}
      
    </div>
  );
};
