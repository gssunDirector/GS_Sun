import { useState, useContext, useEffect } from "react";
import Modal from "react-modal";
import { BigButton } from "./BigButton";

import { toast } from "react-toastify";
import {
  createNewTransaction,
  updateFieldInDocumentInCollection,
} from "../helpers/firebaseControl";
import { AppContext } from "./AppProvider";
import cn from "classnames";

export const ModalMoneyWriteOff = ({ isOpen, closeModal, client }) => {
  const [sum, setSum] = useState(0);
  const [info, setInfo] = useState({
    location: "",
    fuelType: "",
    litrs: 0,
  });

  const [operationType, setOperationType] = useState("litrs");
  const [showWarning, setShowWarning] = useState(false); // Флаг для отображения предупреждения с задержкой

  const { location, user } = useContext(AppContext);

  // Сброс состояния модального окна при закрытии
  useEffect(() => {
    if (!isOpen) {
      setSum(0);
      setInfo({ location: "", fuelType: "", litrs: 0 });
      setOperationType("litrs");
      setShowWarning(false);
    }
  }, [isOpen]);

  // Дебаунс для предупреждения - показываем только если действительно недостаточно средств
  useEffect(() => {
    if (!client || sum <= 0) {
      setShowWarning(false);
      return;
    }

    const currentBalance = +client.balance;
    // Используем строгое сравнение с учетом округления до 2 знаков
    // Предупреждение показываем только если сумма СТРОГО больше баланса (с учетом погрешности округления)
    const balanceRounded = Math.round(currentBalance * 100) / 100;
    const sumRounded = Math.round(sum * 100) / 100;
    const insufficientAmount =
      sumRounded > balanceRounded ? sumRounded - balanceRounded : 0;

    // Показываем предупреждение только если действительно недостаточно средств
    // и недостающая сумма больше 0.01 (чтобы избежать ложных срабатываний из-за округления)
    const shouldShowWarning = insufficientAmount > 0.01;

    // Добавляем небольшую задержку, чтобы избежать мигания при быстром вводе
    const timer = setTimeout(() => {
      setShowWarning(shouldShowWarning);
    }, 300); // 300мс задержка

    return () => clearTimeout(timer);
  }, [sum, client]);

  // Обработчик изменения суммы
  // Обрабатывает пустые значения и предотвращает конкатенацию с нулем
  const handleChange = (e) => {
    const value = e.target.value;
    // Если поле пустое, устанавливаем 0
    if (value === "" || value === "-") {
      setSum(0);
    } else {
      // Преобразуем в число, убирая ведущие нули
      const numValue = parseFloat(value);
      setSum(isNaN(numValue) ? 0 : numValue);
    }
  };

  // Обработчик изменения количества литров
  // Обрабатывает пустые значения и предотвращает конкатенацию с нулем
  const handleChangeLitrs = (e) => {
    const value = e.target.value;
    // Если поле пустое, устанавливаем 0
    if (value === "" || value === "-") {
      setInfo({
        ...info,
        litrs: 0,
      });
    } else {
      // Преобразуем в число, убирая ведущие нули
      const numValue = parseFloat(value);
      setInfo({
        ...info,
        litrs: isNaN(numValue) ? 0 : numValue,
      });
    }
  };

  useEffect(() => {
    if (operationType === "litrs" && info.fuelType.length > 0) {
      setSum(
        +(
          info.litrs *
          (location.prices[info.fuelType] - client?.discount[info.fuelType])
        ).toFixed(2)
      );
    }
  }, [info.litrs, info.fuelType]);

  useEffect(() => {
    if (operationType !== "litrs") {
      setInfo({
        ...info,
        litrs: +(
          sum /
          (location.prices[info.fuelType] - client.discount[info.fuelType])
        ).toFixed(2),
      });
    }
  }, [sum, info.fuelType]);

  const getProductName = (el) => {
    switch (el) {
      case "95":
        return ["A95"];

      case "A-95":
        return ["A95", "Преміум"];

      case "ДПe":
        return ["ДП", "Преміум"];

      case "ДП":
        return ["ДП"];

      default:
        return [el, ""];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sum === 0) {
      toast.info("Сума списання не може дорівнювати 0");
      return;
    }

    // Скрываем предупреждения сразу при нажатии кнопки, чтобы они не показывались после обновления баланса
    setShowWarning(false);

    // Объявляем переменные для отслеживания предупреждений
    let hasWarning = false; // Флаг для отслеживания предупреждения о недостатке средств

    try {
      // Сохраняем предыдущий баланс
      await updateFieldInDocumentInCollection(
        "users",
        client.id,
        "previousBalance",
        +client.balance
      );

      // Проверяем, достаточно ли средств на балансе
      const currentBalance = +client.balance;
      let amountToWriteOff = sum; // Сумма, которую нужно списать
      let remainingAmount = 0; // Недостающая сумма

      if (sum > currentBalance && currentBalance > 0) {
        // Если средств недостаточно, но баланс положительный - списываем весь баланс
        // Не устанавливаем hasWarning, чтобы модальное окно закрылось сразу
        // Информация о недостатке средств уже показана в toast-уведомлении
        amountToWriteOff = currentBalance;
        remainingAmount = sum - currentBalance;

        // Обновляем баланс до 0
        await updateFieldInDocumentInCollection(
          "users",
          client.id,
          "balance",
          0
        );

        // Показываем кассиру недостающую сумму
        // Увеличиваем время показа toast до 7 секунд, чтобы пользователь успел прочитать
        toast.warning(
          `Списано з  балансу: ${currentBalance.toFixed(
            2
          )} грн. Доплата: ${remainingAmount.toFixed(2)} грн`,
          { autoClose: 7000 } // 7 секунд вместо стандартных 5
        );
      } else if (sum > currentBalance && currentBalance <= 0) {
        // Если баланс отрицательный или равен нулю - ничего не списываем с баланса
        amountToWriteOff = 0; // С баланса ничего не списывается
        remainingAmount = sum; // Вся сумма недостающая, оплачивается наличными
        // Баланс не обновляется, остается как есть (0 или отрицательный)
        toast.error(
          `На балансі немає коштів! Доплата: ${remainingAmount.toFixed(2)} грн`,
          { autoClose: 7000 } // 7 секунд вместо стандартных 5
        );
      } else {
        // Если средств достаточно - списываем полную сумму
        await updateFieldInDocumentInCollection(
          "users",
          client.id,
          "balance",
          +(currentBalance - sum).toFixed(2)
        );
        toast.success("Кошти успішно списано з балансу");
      }

      // Автоматически вычисляем доплату на основе недостающей суммы
      // Если средств недостаточно - additionalPayment = недостающая сумма
      // Если средств достаточно - additionalPayment = 0
      const additionalPaymentAmount = remainingAmount > 0 ? remainingAmount : 0;

      // Создаем транзакцию с полем additionalPayment
      await createNewTransaction(
        "write-off",
        client.clientNumber,
        amountToWriteOff,
        user,
        location,
        info,
        additionalPaymentAmount
      );

      setSum(0);
    } catch (error) {
      console.log(error);
      toast.info("Заявку відхилено");
    }
    setSum(0);
    setInfo({ location: "", fuelType: "", litrs: 0 });

    // Добавляем небольшую задержку перед закрытием модального окна,
    // чтобы пользователь успел прочитать предупреждение (если оно было показано)
    if (hasWarning) {
      // Если было предупреждение о недостатке средств - даем больше времени на прочтение
      setTimeout(() => {
        closeModal();
      }, 3000); // 3 секунды задержки для прочтения предупреждения
    } else {
      // Если все в порядке - закрываем сразу
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] w-[688px] h-max rounded-lg shadow-md p-8"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      autoFocus={false}
    >
      <p className="font-semibold text-2xl">Списання коштів</p>
      <form
        className="pt-6 flex flex-col gap-10"
        onSubmit={(e) => handleSubmit(e)}
      >
        <label className="flex-col relative w-full font-bold">
          Тип палива
          <select
            type="text"
            value={info.fuelType}
            onChange={(e) => {
              setInfo({ ...info, fuelType: e.target.value });
            }}
            className="w-full font-normal h-[36px] rounded border-[#E9E9E9] border pl-2 pr-6 mt-2 text-gray-600 appearance-none z-10 relative bg-[transparent]"
          >
            <option value="" className="text-gray-400 disabled hidden">
              обрати
            </option>
            {Object.keys(location).length > 0 &&
              Object.keys(location.prices).map((el) => {
                return (
                  <option key={el} value={el}>
                    {getProductName(el)}
                  </option>
                );
              })}
          </select>
          <span className="absolute right-[20px] bottom-[10px] transform rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400 pointer-events-none"
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
        <div className="self-center h-[30px] bg-[#E9E9E9] w-4/6 rounded flex items-center px-[4px]">
          <button
            className={cn("w-1/2 h-[24px] rounded font-semibold", {
              "bg-[#fff] shadow-md": operationType === "litrs",
            })}
            onClick={() => setOperationType("litrs")}
            type="button"
          >
            Літри
          </button>
          <button
            className={cn("w-1/2 h-[24px] rounded font-semibold", {
              "bg-[#fff] shadow-md": operationType === "sum",
            })}
            onClick={() => setOperationType("sum")}
            type="button"
          >
            Сума
          </button>
        </div>
        <div className="flex flex-col gap-[25px]">
          {operationType === "litrs" ? (
            <>
              <label className="flex-col">
                <span className="font-bold">Кількість літрів</span>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                    value={info.litrs === 0 ? "" : info.litrs}
                    onChange={(e) => handleChangeLitrs(e)}
                    disabled={info.fuelType.length === 0}
                    min="0"
                  />
                </div>
              </label>
              <div className="flex justify-between">
                <p className="font-semibold text-[20px]">Сума</p>
                <p className="font-semibold text-[24px]">{`${sum} грн`}</p>
              </div>
            </>
          ) : (
            <>
              <label className="flex-col">
                <span className="font-bold">Сума</span>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full h-[36px] rounded border-[#E9E9E9] border pl-3 mt-2"
                    value={sum === 0 ? "" : sum}
                    onChange={(e) => handleChange(e)}
                    disabled={info.fuelType.length === 0}
                    min="0"
                  />
                </div>
              </label>
              <div className="flex justify-between">
                <p className="font-semibold text-[20px]">Літри</p>
                <p className="font-semibold text-[24px]">{`${info.litrs} літрів`}</p>
              </div>
            </>
          )}
        </div>

        {/* Отображение информации о недостающих средствах */}
        {sum > 0 &&
          client &&
          showWarning &&
          (() => {
            const currentBalance = +client.balance;
            const insufficientAmount =
              sum > currentBalance ? sum - currentBalance : 0;

            if (insufficientAmount > 0 && currentBalance > 0) {
              return (
                <div className="bg-[#FFF3CD] border border-[#FFC107] rounded-lg p-4">
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-[16px] text-[#856404]">
                      ⚠️ Недостатньо коштів на балансі
                    </p>
                    <div className="flex flex-col gap-1 text-[14px] text-[#856404]">
                      <p>
                        Баланс клієнта:{" "}
                        <span className="font-bold">{` ${currentBalance.toFixed(
                          2
                        )} грн`}</span>
                      </p>
                      <p>
                        Сума покупки:{" "}
                        <span className="font-bold">{` ${sum.toFixed(
                          2
                        )} грн`}</span>
                      </p>
                      <p className="font-semibold text-[16px] mt-2">
                        Буде списано з балансу:{" "}
                        <span className="text-[#DC3545]">{`${currentBalance.toFixed(
                          2
                        )} грн`}</span>
                      </p>
                      <p className="font-semibold text-[25px]">
                        Необхідна доплата:{" "}
                        <span className="text-[#DC3545]">{`${insufficientAmount.toFixed(
                          2
                        )} грн`}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            } else if (insufficientAmount > 0 && currentBalance <= 0) {
              return (
                <div className="bg-[#F8D7DA] border border-[#DC3545] rounded-lg p-4">
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-[16px] text-[#721C24]">
                      ❌ На балансі немає коштів
                    </p>
                    <div className="flex flex-col gap-1 text-[14px] text-[#721C24]">
                      <p>
                        Баланс клієнта:{" "}
                        <span className="font-bold">{` ${currentBalance.toFixed(
                          2
                        )} грн`}</span>
                      </p>
                      <p>
                        Сума покупки:{" "}
                        <span className="font-bold">{` ${sum.toFixed(
                          2
                        )} грн`}</span>
                      </p>
                      <p className="font-semibold text-[25px]">
                        Необхідна доплата:{" "}
                        <span className="text-[#DC3545]">{`${insufficientAmount.toFixed(
                          2
                        )} грн`}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

        <div className="flex flex-row justify-between">
          <button onClick={closeModal} type="button">
            <span className="text-[#DC0000] text-sm">Скасувати</span>
          </button>
          <div className="flex justify-end">
            <BigButton type="submit" label="Списати кошти" labelColor="white" />
          </div>
        </div>
      </form>
    </Modal>
  );
};
