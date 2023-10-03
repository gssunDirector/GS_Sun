import React, { useState, useEffect, useContext } from "react";
import { SearchLineHeader } from "../components/SearchLineHeader";
import { Pagination } from "../components/Pagination";
import { ClientsTableHeader } from "../components/ClientsTableHeader";
import { db } from "../firebase";
import { LineClient } from "../components/LineClient";
import {format} from 'date-fns';
import { AppContext } from "../components/AppProvider";
import { ModalMoneyTransfer } from "../components/ModalMoneyTransfer";



export default function Clients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryRequest, setSearchQueryRequest] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const { clients, requests } = useContext(AppContext);

  const [requestsArray, setRequestsArray] = useState(requests);
 
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    const searchResult = clients
      .filter(
        el => el.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        || el.lastname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    if (searchQuery.length > 0) {
      setFilteredData(searchResult);
    }
  }, [searchQuery]);

  useEffect(() => {
    const searchResult = requests
      .filter(
        item => clients.find(el => +el.clientNumber === +item.userNumber)?.lastname.toLowerCase().includes(searchQueryRequest.toLowerCase()) 
        || clients.find(el => +el.clientNumber === +item.userNumber)?.name.toLowerCase().includes(searchQueryRequest.toLowerCase())
      );
    if (searchQueryRequest.length > 0) {
      setFilteredRequests(searchResult);
    }
  }, [searchQueryRequest]);

  const handleSortUp = () => {
    if (searchQueryRequest.length > 0) {
      const sortArr = [...filteredRequests].sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate));
      setFilteredRequests(sortArr);
    } else {
      console.log('dfveaf')
      const sortArr = [...requests].sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate))
      setRequestsArray(sortArr);
    }
  };

  const handleSortDown = () => {
    if (searchQueryRequest.length > 0) {
      const sortArr = [...filteredRequests].sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
      setFilteredRequests(sortArr);
    } else {
      const sortArr = [...requests].sort((a, b) =>  new Date(b.requestDate) - new Date(a.requestDate))
      setRequestsArray(sortArr);
    }
  };

 
  return (
    <>
    <div className="px-10">
      <SearchLineHeader
        searchQuery={searchQueryRequest}
        setSearchQuery={setSearchQueryRequest}
        title="Активні заявки"
      />
      <ClientsTableHeader 
        isRequests 
        handleSortUp={handleSortUp}
        handleSortDown={handleSortDown}
      />
      {searchQueryRequest.length > 0
    ? filteredRequests.map((item, i) => {
      return <LineClient data={item} key={item.requestDate} isRequests name={`${clients.find(el => +el.clientNumber === +item.userNumber)?.lastname} ${clients.find(el => +el.clientNumber === +item.userNumber)?.name}`} />;
    })
    : requestsArray.map((item, i) => {
      return <LineClient data={item} key={item.requestDate} isRequests name={`${clients.find(el => +el.clientNumber === +item.userNumber)?.lastname} ${clients.find(el => +el.clientNumber === +item.userNumber)?.name}`} />;
    })}
      <Pagination data={requests} setData={setRequestsArray} />

    </div>
    <div className="px-10">
        <SearchLineHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          title="База клієнтів" />
        <ClientsTableHeader />
        {searchQuery.length > 0
    ? filteredData.map((item) => {
      return <LineClient data={item} key={item.clientNumber}/>;
    })
    : data.map((item) => {
      return <LineClient data={item} key={item.clientNumber}/>;
    })}
        <Pagination data={clients} setData={setData} />

      </div>
    </>
  )
  
 
}
