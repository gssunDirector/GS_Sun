import React, { useEffect, useState } from "react";

export const Pagination = ({ data, setData } ) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [personePerPage] = useState(12);
  const pagination = [];
  const [paginationCount, setPaginationCount] = useState([]);

  useEffect(() => {
    const lastProductIndex = currentPage * personePerPage;
    const firstProductIndex = lastProductIndex - personePerPage;
        
    
      const currentProducts = data.slice(firstProductIndex, lastProductIndex);

      for (let i = 1; i <= Math.ceil(data.length / personePerPage); i++) {
        pagination.push(i);
      }

      setPaginationCount(pagination);

      setData(currentProducts);

  }, [data, currentPage]);
 
  const paginate = pageNumber => setCurrentPage(pageNumber);


  return (
    <div className="drop-shadow-md w-full h-10 flex flex-row items-center  border-b-2 border-l-2 border-r-2 border-['#E9E9E9'] bg-[#FAFAFA]">
      <div className="w-1/3 p-6 flex justify-start">
        {currentPage > 1 && (
            <button 
          className="border px-2 rounded"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Назад
        </button>
        )}
        
      </div>
      <div className="w-1/3 p-6">
        <span className="text-[#303030] flex justify-center">
            {`Сторінка ${currentPage} з ${paginationCount.length}`}
        </span>
      </div>
      <div className="w-1/3 p-6 flex justify-end">
        {currentPage < paginationCount.length && (
          <button 
            className="border px-2 rounded"
            onClick={() => setCurrentPage(currentPage + 1)}
        >
            Наступна
          </button>
        )}
        
      </div>
    </div>
  );
};
