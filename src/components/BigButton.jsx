import React from "react";

export const BigButton = ({ onClick, label, labelColor, type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-[#00B488] w-max h-[36px] rounded hover:bg-[#01a179] active:bg-[#00B488] px-2"
    >
      <span className={`text-${labelColor}`}>{label}</span>
    </button>
  );
};
