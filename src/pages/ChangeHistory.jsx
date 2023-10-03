import { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom"
import { ChangeTableHeader } from "../components/ChangeTableHeader"
import { AppContext } from '../components/AppProvider';
import { LineChange } from '../components/LineChange';
import { getDate } from '../App';

export const ChangeHistory = () => {
  const [changes, setChanges] = useState([]);

  const { location, userRole } = useContext(AppContext);

  useEffect(() => {
    setChanges(location.priceChanges);
  }, []);


    return (
        <div className="py-[40px] px-10 text-[18px] flex flex-col gap-[20px]">
            <div className="flex gap-[5px]">
              <Link to={userRole === 'operator' ?"/operator" : "/content"}  className="text-[#727272] flex gap-[10px] items-center">
                <span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825L9.425 14.6L8 16Z" fill="#727272"/>
                  </svg>
  
                </span>
                <span>Головна</span>
              </Link>
              <p> / Історія змін</p>
            </div>
            <div>
                <div className="w-full h-12 px-4 py-0 flex items-center border-b-2 border-t-2 border-l-2 border-r-2 border-['#E9E9E9'] rounded-t-[4px] mt-[43px] bg-[#FAFAFA]">
                  Історія змін
                </div>
            <ChangeTableHeader />
            {changes.sort((a, b) => {
         
              return new Date(getDate(b.changeDate)) - new Date(getDate(a.changeDate));
            }).map(el => {
                return (
                    <LineChange data={el} key={el.uid}/>
                )
            })}
            </div>
           
        </div>
    )
}