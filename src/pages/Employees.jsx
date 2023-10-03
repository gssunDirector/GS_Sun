import React, { useState, useEffect, useContext} from "react";
import { db } from "../firebase"; // DON'T DELETE

import Modal from "react-modal";

import { LineEmployees } from "../components/LineEmployees";
import { EmployeeTableHeader } from "../components/EmployeeTableHeader";
import { SearchLineHeader } from "../components/SearchLineHeader";
import ModalAddEmployee from "../components/ModalAddEmployee";
import { Pagination } from "../components/Pagination";
import { AppContext} from "../components/AppProvider";

Modal.setAppElement("#root");

export default function Employees() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataToPaginate, setDataToPaginate] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const { employees } = useContext(AppContext);
  

  useEffect(() => {
    setDataToPaginate(employees);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };     

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const searchResult = dataToPaginate
      .filter(
        el => el.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        || el.surname.toLowerCase().includes(searchQuery.toLowerCase())
        || el.patronymic.toLowerCase().includes(searchQuery.toLowerCase())
      );
    if (searchQuery.length > 0) {
      setFilteredData(searchResult);
    }
  }, [searchQuery]);

  return (
    
    <div id="#root" className="px-10">
   
        <SearchLineHeader 
          onButtonPress={openModal}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          title="Співробітники"
          role="employees"
          setIsChanging={setIsChanging}
          setCurrentData={setCurrentData}
        />
        <EmployeeTableHeader />
      {searchQuery.length > 0 
      ? filteredData.map((item) => {
        return (
          <LineEmployees 
            data={item} 
            key={item.id} 
            openModal={openModal} 
            setIsChanging={setIsChanging}
            setCurrentData={setCurrentData}
          
          />
        )
      })
      : data.map((item) => {
        return (
          <LineEmployees 
            data={item}
            key={item.id} 
            openModal={openModal} 
            setIsChanging={setIsChanging}
            setCurrentData={setCurrentData}
            
          />
        ) 
      })}
      <Pagination data={dataToPaginate} setData={setData}/>
      <ModalAddEmployee
        isOpen={isModalOpen}
        closeModal={closeModal}
        isChanging={isChanging}
        data={currentData}
        dataToPaginate={dataToPaginate}
      />
    </div>
  );
}
