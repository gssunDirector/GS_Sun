import { format } from "date-fns";

export const LineTransactionOperator = ({ data }) => {
  const getProductName = () => {
    switch (data.fuelType) {
      case "95":
        return ["A95"];

      case "A-95":
        return ["A95", "Преміум"];

      case "ДПe":
        return ["ДП", "Преміум"];

      case "ДП":
        return ["ДП"];

      default:
        return [data.fuelType, ""];
    }
  };

  return (
    <div className="w-full h-max flex flex-row items-center justify-between border-b border-['#E9E9E9'] py-[8px]">
      <div className="flex-1 pl-6 pr-6 min-w-[120px]">
        <span>{`${format(
          new Date(data.requestDate),
          "HH:mm:ss dd.MM.yyy"
        )}`}</span>
      </div>
      <div className="flex-1 min-w-[100px]">
        <div>
          <span>{data.location}</span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden pl-6 pr-6 text-ellipsis min-w-[100px]">
        <span className=" whitespace-nowrap ">{getProductName()}</span>
      </div>
      <div className="flex-1 min-w-[80px]">
        <span>{`${data.litrs} л`}</span>
      </div>
      <div className="flex-1 min-w-[80px]">
        <span>{`${(+data.sum || 0).toFixed(2)} грн`}</span>
      </div>
      <div className="flex-1 min-w-[80px]">
        <span>{`${(+data.additionalPayment || 0).toFixed(2)} грн`}</span>
      </div>
      <div className="flex-1 min-w-[80px]">
        <span>{`${(+data.total || +data.sum || 0).toFixed(2)} грн`}</span>
      </div>
    </div>
  );
};
