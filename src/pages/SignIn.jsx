import React, { useState } from "react";
import {  getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

import { toast } from "react-toastify";

import { Divider } from "../components/Divider";
/* import { Checkbox } from "../components/Checkbox"; */
import { Button } from "../components/Button";
import { auth, getCollectionWhereKeyValue, updateFieldInDocumentInCollection } from "../helpers/firebaseControl";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { format } from "date-fns";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  const [changeLocalStorage, setChangeLocalStorage] = useLocalStorage('changeDate', '');

  const { email, password } = formData;

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    try {
      if(isPasswordChanging) {
        const changindUser = await getCollectionWhereKeyValue('employees', 'email', formData.email);
        
        if(changindUser[0]) {
          
          await updateFieldInDocumentInCollection('employees', changindUser[0].idPost, 'password', formData.password);
          console.log('passwordChang!!');
        }
        setIsPasswordChanging(false);
      };
      
      const auth = getAuth();
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setChangeLocalStorage(format(new Date(), 'yyyy/MM/dd HH:mm') );
    } catch (error) {
      console.log(error);
      toast.error("Bad user credentials");
    }
  };

  const handleResetPassword = () => {
    if (formData.email.length === 0) {
      toast.error("Введіть свій email");
      return;
    } else {
      setIsPasswordChanging(true);
      sendPasswordResetEmail(auth, formData.email)
        .then(() => {
          toast.success('Лист для скидання паролю надіслано. Будьласка, перевірте свою поштову скриньку!');
        })
        .catch(() => {
          toast.error("Щось пішло не так...");
        });
    }
   
  };
  

  return (
    <section className="flex justify-center mt-[211px]">
      <div className="w-[572px] h-[267px] bg-white">
        <div>
          <div className=" mt-3 mb-3 ml-4">
            <span className="text-lg">Вхід</span>
          </div>
          <Divider />
        </div>
        <div className="ml-[19px] mr-[21px] mt-8">
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="flex flex-row items-center justify-between">
              <div>
                <span>Логін</span>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={onChange}
                className="w-[426px] h-[36px] rounded border-[#E9E9E9] border pl-3"
                placeholder="Логін"
              />
            </div>
            <div className="flex flex-row items-center justify-between pt-[18px]">
              <div>
                <span>Пароль</span>
              </div>
              <div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={onChange}
                  className="w-[426px] h-[36px] rounded border-[#E9E9E9] border pl-3"
                  placeholder="Пароль"
                />
              </div>
            </div>
            <div className="pt-[17px] pl-[115px]">
              {/* <Checkbox label="Запам’ятати мене" /> */}
              <button 
                className="font-bold"
                type="button"
                onClick={handleResetPassword}
              >
                Забули пароль?
              </button>
            </div>
            <div className="flex justify-end">
              <Button type="submit" label="Увійти" labelColor="white" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
