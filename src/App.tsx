import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Clients from "./pages/Clients";
import Employees from "./pages/Employees";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import { AppContext } from "./components/AppProvider";
import { ClientCard } from "./pages/ClientCard";
import ChangeLocation from "./pages/ChangeLocation";
import Operator from "./pages/Operator";
import { ChangeHistory } from "./pages/ChangeHistory";
import Content from "./pages/Content";
import { NotEmployees } from "./pages/NotEmployees";
import { Reports } from "./pages/Reports";

export const getDate = (date: string) => {
  if (date?.length < 25) {
    const year = date.split(' ');
  return `${year[0]} ${year[1].split('.').reverse().join('/')}`
  } else {
    return date;
  }
};

function App() {
  const { user, userRole, location } = useContext(AppContext);

  console.log(user);


  return (
    <>  
        <Header />

        {!user 
        ? <SignIn />
        : (
          <Routes>
            <Route path="notEmployees" element={<NotEmployees />} />
            {userRole === "accountant" && (
              <>
              <Route path="/clients">
                <Route index element={<Clients />} />
                <Route path=":slug" element={<ClientCard isOperator={false} />} />
              </Route>
              <Route path="/employees" element={<Employees />} />
              <Route path="/reports" element={<Reports />} />

              </>
            )} 
            {userRole === "operator" && (
              Object.values(location).length > 0 
              ? (
                  <Route path="/operator"  >
                    <Route index  element={<Operator />}/>
                    <Route path="operator/changeHistory" element={<ChangeHistory />} />
                    <Route path=":slug" element={<ClientCard isOperator={true} />} />
                  </Route>
              ) : (
                <Route path="/changeLocation" element={<ChangeLocation />} />
              )
            )}

            {userRole === "content" && (
              <Route path="/content"  >
                <Route index element={<Content />}/>
                <Route path="content/changeHistory" element={<ChangeHistory />} />
              </Route>
            )}
        </Routes>
        )}
    
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
