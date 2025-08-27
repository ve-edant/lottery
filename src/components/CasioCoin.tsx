import React from "react";

type CasinoCoinProps = {
  label: number; // required (0-9)
};

const getColorsForLabel = (label: number) => {
  switch (label) {
    case 0:
      return {
        rim: "bg-[linear-gradient(to_right,theme(colors.red.600)_50%,theme(colors.purple.600)_50%)]",
        bg: "bg-[linear-gradient(to_right,theme(colors.red.300)_50%,theme(colors.purple.300)_50%)]",
      };
    case 5:
      return {
        rim: "bg-[linear-gradient(to_right,theme(colors.purple.600)_50%,theme(colors.green.600)_50%)]",
        bg: "bg-[linear-gradient(to_right,theme(colors.purple.300)_50%,theme(colors.green.300)_50%)]",
      };
    case 1:
    case 3:
    case 7:
    case 9:
      return { rim: "bg-green-600", bg: "bg-green-300" };
    case 2:
    case 4:
    case 6:
    case 8:
      return { rim: "bg-red-600", bg: "bg-red-300" };
    default:
      return { rim: "bg-gray-600", bg: "bg-gray-300" };
  }
};

const CasinoCoin: React.FC<CasinoCoinProps> = ({ label }) => {
  const { rim, bg } = getColorsForLabel(label);

  return (
    <div
      className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl ${rim}`}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center relative ${bg}`}
      >
        <span className="text-white font-bold text-lg">{label}</span>

        {/* Shine effect */}
        <div className="absolute top-2 left-2 w-6 h-6 bg-white opacity-10 rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default CasinoCoin;
