import { useState, useContext } from 'react';

import LogoutIcon from "../assets/images/logout.png";
import { useLocation, useNavigate } from "react-router";
import { logOut } from "../helpers/firebaseControl";
import { AppContext } from './AppProvider';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ReportOperatorModal } from './ReportOperatorModal';
import { format } from 'date-fns';

export default function Header() {
  const locationPath = useLocation();
  const navigate = useNavigate();

  const [endReporOperator, setEndReportOperator] = useState('');

  function pathMatchRoute(route) {
    if (locationPath.pathname.includes(route)) {
      return true;
    }
  };

  const { user, userRole, setUser, setUserRole, location, setLocation } = useContext(AppContext);

  const [changeLocalStorage, setChangeLocalStorage] = useLocalStorage('changeDate', '');


  const [isOpen, setIsOpen] = useState(false)



  const getRole = () => {
    switch (userRole) {
      case "accountant": 
        return 'Бухгалтер';

      case "operator": 
        return 'Оператор';

      case "content": 
        return 'Контент-менеджер';

      default:
        return '';
    }
  };

  const handleLogOut = () => {
    if(userRole === 'operator') {
      if(Object.values(location).length > 0) {
        setIsOpen(true);
        setEndReportOperator(format(new Date(), 'yyyy/MM/dd HH:mm'));
      } else {
        logOut();
        setUserRole(null);
        setUser(null);
        setChangeLocalStorage('');
      }
    } else {
      logOut();
      setUserRole(null);
      setUser(null);
      setChangeLocalStorage('');
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className=" bg-[#00B488] h-[70px] flex border border-[#DEE2E6] sticky top-0 z-10">
        <header className="flex justify-between items-center px-10 w-[100%]">

          {user && (
            <>
              {userRole === "accountant" ? (
                <div className="flex items-center">
                  <div
                    className={`pr-6 cursor-pointer text-white ${pathMatchRoute("/clients") && "font-bold"}`}
                    onClick={() => {
                      navigate("/clients");
                    } }
                  >
                    Клієнти
                  </div>
                  <div
                    className={`pr-6 text-white cursor-pointer ${pathMatchRoute("/employees") && "font-bold"}`}
                    onClick={() => {
                      navigate("/employees");
                    } }
                  >
                    Працівники
                  </div>
                  <div
                    className={`text-white cursor-pointer ${pathMatchRoute("/reports") && "font-bold"}`}
                    onClick={() => {
                      navigate("/reports");
                    } }
                  >
                    Звіти
                  </div>
                </div>
              ) : (
                <div />
              )}

              <div className=" flex items-center">
                <div className="pr-[27px]">
                  <div className="text-white text-lg">{getRole()}</div>
                  <div className="text-[#E9E9E9] text-sm">{user.email}</div>
                </div>
                <button className="pr-4" onClick={handleLogOut}>
                  <img
                    src={LogoutIcon}
                    alt="logout"
                    className=" h-[18px] w-[18px]" />
                </button>
              </div>
            </>
          )}
        </header>
      </div>
      <ReportOperatorModal 
        isOpen={isOpen}
        closeModal={closeModal}
        endReporOperator={endReporOperator}
      />
    </>
  );
}
