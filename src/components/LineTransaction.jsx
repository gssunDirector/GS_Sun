import {format} from 'date-fns';

export const LineTransaction = ({ data, isRequest }) => {
 
  const typeStyles = (function getRoleColor() {
    if(isRequest) {
      switch (data.reject) {
        case true:
          return "bg-[#E9E9E9] line-through";
     
      default:
         return "bg-[#E9E9E9]";
    }
    } else {
      switch (data.type) {
        case "transfer":
          return "bg-[#C1E5C9]";

        case "write-off":
          return "bg-[#F8C9C9]";
     
      default:
        break;
    }
    }
  })();

  const getType = () => {
    if(isRequest) {
      switch (data.reject) {
        case true:
          return "Відхилена заявка";
     
      default:
         return "Заявка";
    }
    } else {
      switch (data.type) {
        case "transfer":
          return "Зарахування";

        case "write-off":
          return "Списання";
     
      default:
        break;
    }}
  };

  const getProductName = () => {
    switch (data.fuelType) {
      case '95':
        return ['A95'];

      case 'A-95':
        return ['A95', 'Преміум'];

      case 'ДПe':
        return ['ДП', 'Преміум'];

      case 'ДП':
        return ['ДП'];

      default:
        return [data.fuelType, ''] ;
    }
  };

  return (
    <div className="w-full h-max flex flex-row items-center justify-between border-b border-['#E9E9E9'] py-[8px]">
      <div className="w-1/6 pl-6 pr-6">
        <span>{format(new Date(data.requestDate), 'HH:mm:ss dd.MM.yyyy')}</span>
      </div>
      <div className="w-1/6">
        <div>
          <span
          className={`rounded-lg pl-[6px] pr-[6px] pt-[4px] pb-[4px] text-sm ${typeStyles}`} 
        >
           {getType()}
        </span>
        </div>
      </div>
      <div className="w-1/6 overflow-hidden pl-6 pr-6 text-ellipsis">
        <span className=' whitespace-nowrap '>{isRequest ? '' : data.location}</span>
      </div>
      <div className="w-1/6">
        <span>{isRequest ? '' : `${getProductName()[0]} ${getProductName()[1] || ''}`}</span>
      </div>
      <div className="w-1/6">
        <span>{isRequest ? '' : `${data.sum} грн`}</span>
      </div>
      <div className="w-1/6">
        <span>{isRequest ? '' : data.litrs && `${data.litrs} л`}</span>
      </div>
      <div className="w-1/6 pl-6 pr-6">
        <div>
          {isRequest && data.url?.length > 0
            ? <a 
                href={data.url} 
                className="text-blue-600 underline"
                target="_blank" 
              >
                {`receipt${format(new Date(data.requestDate), 'dd.MM.yyyy')}`}
              </a>
            : ''
          }
        </div>
      </div>
    </div>
  );
};
