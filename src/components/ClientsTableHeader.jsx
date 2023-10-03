import ArrowUp from '../assets/images/arrowUp.svg';
import ArrowDown from '../assets/images/arrowDown.svg';


export const ClientsTableHeader = ({ isRequests, handleSortUp, handleSortDown }) => {

    return (
      <div className=" w-full h-12 flex flex-row items-center justify-between border-b-2 border-l-2 border-r-2 border-['#E9E9E9'] bg-[#FAFAFA]">
        <div className="w-1/10 pl-6 pr-6">
          <span className=" font-bold text-[#727272]">ID</span>
        </div>
        <div className="w-1/5">
          <span className=" font-bold text-[#727272]">Клієнт</span>
        </div>
        <div className="w-1/5 flex items-center gap-2.5">
          <span className=" font-bold text-[#727272]">
            {isRequests 
            ? 'Дата створення заявки' 
            : 'Дата народження'
            }
          </span>
          {isRequests && (
            <div className="flex flex-col gap-2">
              <button 
                className='w-2.5 h-1.5'
                onClick={handleSortUp}
              >
                <img src={ArrowUp} alt='up' />
              </button>
              <button 
                className='w-2.5 h-1.5'
                onClick={handleSortDown}
              >
                <img src={ArrowDown} alt='down' />
              </button>
            </div>
          )}
        </div>
        {!isRequests && (
            <div className="w-1/5">
          <span className=" font-bold text-[#727272]">
            Номер телефону
          </span>
        </div>
        )}
        
        <div className="w-1/5">
          <span className=" font-bold text-[#727272]">
          {isRequests 
            ? 'Квитанція'
            : 'Баланс'
            }
          </span>
        </div>

        {isRequests && (
          <div className="w-1/5" />
        )}
      </div>
    );
  };
  