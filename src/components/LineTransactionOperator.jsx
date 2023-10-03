import {format} from 'date-fns';

export const LineTransactionOperator = ({ data}) => {
 

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
  }


  return (
    <div className="w-full h-max flex flex-row items-center justify-between border-b border-['#E9E9E9'] py-[8px]">
      <div className="w-1/5 pl-6 pr-6">
        <span>{`${format(new Date(data.requestDate), 'HH:mm:ss dd.MM.yyy') }`}</span>
      </div>
      <div className="w-1/5">
        <div>
          <span
        >
           {data.location}
        </span>
        </div>
      </div>
      <div className="w-1/5 overflow-hidden pl-6 pr-6 text-ellipsis">
        <span className=' whitespace-nowrap '>{getProductName()}</span>
      </div>
      <div className="w-1/5">
        <span>{`${data.litrs} л`}</span>
      </div>
      <div className="w-1/5">
        <span>{`${data.sum} грн`}</span>
      </div>
    </div>
  );
};
