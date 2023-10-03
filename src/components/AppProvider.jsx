import React, { useState, useMemo, useEffect } from 'react';
import { auth, getCollection, getCollectionWhereKeyValue } from '../helpers/firebaseControl.js';
import { useNavigate } from 'react-router';
import { db } from '../firebase.js';
import { useLocalStorage } from '../hooks/useLocalStorage.jsx';

export const AppContext = React.createContext({
  user: null,
  setUser: () => {},
  userRole: null,
  clients: [],
  setClients: () => {},
  requests: [],
  setRequests: () => {},
  allRequests: [],
  setAllRequests: () => {},
  location: {},
  setLocation: () => {},
  locations: [],
  setLocations: () => {},
  promotions: [],
  setPromotions: () => {},
  employees: [],
  setEmployees: () => {},
  authUser: null,
  setAuthUser: () => {}
});

export const AppProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [clients, setClients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [location, setLocation] = useState({});
  const [locations, setLocations] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [employees, setEmployees] = useState([]);

  const fetchLocations = async () => {
    try {
      const loadedLocations = await getCollection('locations');
      setLocations(loadedLocations);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const [locationLocalStorage, setlocationLocalStorage] = useLocalStorage('location', {});

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setAuthUser(user || null)});
      if (authUser) {
        getCollectionWhereKeyValue('employees', 'uid', auth.currentUser.uid).then(res => {
          setUser(res[0]);
          setUserRole(res[0].role);
          
          switch (res[0].role) {
            case "accountant":
              console.log('request!!!');
              db.collection('users').onSnapshot(snapshot => {
                setClients(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
              });
              db.collection('requests').where('active', '==', true).onSnapshot(snapshot => {
                setRequests(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
              });
              db.collection('employees').onSnapshot(snapshot => {
                setEmployees(snapshot.docs.map(doc => ({...doc.data(), idPost: doc.id})));
              });
              fetchLocations();
              navigate("/clients");
              return;

            case "operator": 
              fetchLocations();
              if(Object.values(locationLocalStorage).length > 0) {
                setLocation(locationLocalStorage) 
              } else {
                 navigate("/changeLocation");
              }
             
              return;

            case "content": 
            db.collection('promotions').onSnapshot(snapshot => {
              setPromotions(snapshot.docs.map(doc => ({...doc.data()})));
            });
              fetchLocations();
              navigate("/content");
              return;
          
            default: 
              navigate('notEmployees');
              return;
          }
        }).catch(() => {
          navigate('notEmployees')
        });
      }
    
  }, [authUser]);

  const contextValue = useMemo(() => {
    return {
      user,
      setUser,
      userRole,
      setUserRole, 
      clients,
      requests,
      setClients,
      location,
      setLocation,
      locations,
      promotions,
      employees,
    };
  }, [user, userRole, clients, requests, location, setLocation, locations, promotions, employees, setUser]) ;

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};