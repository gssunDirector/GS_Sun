import { useState, useEffect } from 'react';

export const LineChange = ({ data }) => {
   const [currentFuel, setCurrentFuel] = useState(null);
   console.log(data);

   console.log(currentFuel);

   useEffect(() => {
      const findedValue = Object.entries(data.oldData).filter((el) => el[1] !== Object.entries(data.newData).find(e => e[0] === el[0])[1]);
      
      setCurrentFuel(findedValue.map(el => el[0]));
   }, [data]);

   const getProductName = (el) => {
    switch (el) {
      case '95':
        return ['A95'];

      case 'A-95':
        return ['A95', 'Преміум'];

      case 'ДПe':
        return ['ДП', 'Преміум'];

      case 'ДП':
        return ['ДП'];
     
      default:
        return [el, ''] ;
    }
}

    return (
      <>
        {currentFuel?.map(el => {
          return (
            <div className=" w-full h-12 flex flex-row items-center justify-between border-b border-l-2 border-r-2 border-['#E9E9E9'] bg-[#FAFAFA]" key={el}>
          <div className="w-1/4 pl-6">
            <span>{data.changeDate}</span>
          </div>
          <div className="w-1/4">
            <div className='text-lg font-bold '>{getProductName(el)[0]}</div>
            <div className='text-xs font-bold text-[#727272]'>{getProductName(el)[1]}</div>
          </div>
          <div className="w-1/4">
            <span>{data.oldData[el]}</span>
          </div>
          <div className="w-1/4">
            <span>{data.newData[el]}</span>
          </div>
        </div>
          )
        })}
       
      </>
      
    );
  };