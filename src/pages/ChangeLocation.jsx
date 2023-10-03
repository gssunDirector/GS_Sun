import React, { useState, useContext,  useEffect } from "react";

import { Divider } from "../components/Divider";
import { Button } from "../components/Button";
import { AppContext } from "../components/AppProvider";
import { useNavigate } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function ChangeLocation() {
  const { setLocation, locations } = useContext(AppContext);

  const [currentLocation, setCurrentLocation] = useState({});
  const navigate = useNavigate();

  const [locationLocalStorage, setlocationLocalStorage] = useLocalStorage('location', {});

  useEffect(() => {
    const findLoc = locations.find(el => el.id === currentLocation);
    if(findLoc) {
      setLocation(findLoc);
      setlocationLocalStorage(findLoc);
      navigate('/operator');
    };
    
  }, [currentLocation]);

  return (
    <section className="flex justify-center mt-[211px]">
      <div className="w-[572px] h-[267px] bg-white">
        <div>
          <div className=" mt-3 mb-3 ml-4">
            <span className=" text-lg">Оберіть АЗС</span>
          </div>
          <Divider />
        </div>
        <div className=" flex flex-col gap-[20px]">
          <label className='flex-col relative w-full  p-[15px]'>
        <select
          type="text"
          name="role"
          value={currentLocation}
          onChange={(e) => {
            setCurrentLocation(e.target.value);
           
          }}
          className="w-full h-[36px] rounded border-[#E9E9E9] border pl-2 pr-6 mt-2 text-gray-600 appearance-none z-9 relative bg-[transparent]"
        >
          <option value="" className="text-gray-400 disabled hidden">
            обрати
          </option>
          {locations.sort((a, b) => a.id - b.id).map(el => {
            return (
                <option key={el.id}  value={el.id}>{`${el.adress}`}</option>
            )
          })}
        </select>
        <span className="absolute right-[30px] bottom-[23px] transform rotate-180 z-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 pointer-events-none "
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 7.707a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L10 10.414l-3.293 3.293a1 1 0 1 1-1.414-1.414l4-4z"
                  clipRule="evenodd"
                />
              </svg>
          </span>
          </label>
            <div className="flex justify-end">
              <Button type="submit" label="Обрати" labelColor="white" />
            </div>
          </div>
      </div>
    </section>
  );
}
