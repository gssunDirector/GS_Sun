import React from "react";

export const Button = ({ callback, label, labelColor, type }) => {
  return (
    <button
      type={type}
      onClick={callback}
      className="bg-[#00B488] w-[71px] h-[36px] rounded hover:bg-[#01a179] active:bg-[#00B488]"
    >
      <span className={`text-${labelColor}`}>{label}</span>
    </button>
  );
};
