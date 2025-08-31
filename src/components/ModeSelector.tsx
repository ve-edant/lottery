import React from "react";
import { FaClock } from "react-icons/fa";

interface ModeSelectorProps {
  mode: number;
  setMode: (mode: number) => void;
  modeLocked: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode, modeLocked }) => {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 max-w-full">
      {[0.5, 1, 3, 5].map((m) => {
        const isSelected = mode === m;
        const isDisabled = modeLocked && !isSelected;
        return (
          <div
            key={m}
            onClick={() => !isDisabled && setMode(m)}
            className={`relative flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 md:p-4 min-w-0 aspect-square rounded-xl sm:rounded-2xl shadow-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "bg-gradient-to-r from-[#f95959] to-[#ff988d] text-white scale-105"
            : "bg-white/20 text-gray-400 hover:bg-white/30 hover:scale-102"
        }
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
          >
            {/* Optional Gray Overlay for non-selected disabled cards */}
            {!isSelected && isDisabled && (
              <div className="absolute inset-0 bg-gray-500/60 rounded-xl sm:rounded-2xl pointer-events-none"></div>
            )}
            
            {/* Clock Icon */}
            <FaClock
              className={`text-lg sm:text-xl md:text-2xl z-10 flex-shrink-0 ${
                !isSelected ? "text-gray-400" : ""
              }`}
            />
            
            {/* Title */}
            <span
              className={`font-bold text-xs sm:text-sm z-10 text-center leading-tight ${
                !isSelected ? "text-gray-400" : ""
              }`}
            >
              Win-Go
            </span>
            
            {/* Time */}
            <span
              className={`text-[10px] sm:text-xs font-medium z-10 text-center ${
                !isSelected ? "text-gray-400" : ""
              }`}
            >
              {m < 1 ? "30 sec" : `${m} min`}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ModeSelector;