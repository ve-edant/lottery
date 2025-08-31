import React from "react";
import Chip from "./Chip";

interface TimerProps {
  timeLeft?: number;
  numbers?: number[];
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const Timer: React.FC<TimerProps> = ({
  setShowModal,
  timeLeft = 19,
  numbers = [7, 0, 1, 3],
}) => {
  return (
    <div className="flex items-center max-w-xl w-full p-2 sm:p-3 md:p-4 bg-red-400 rounded-xl text-white relative overflow-hidden">
      {/* Left Section */}
      <div className="flex flex-col gap-1 sm:gap-2 w-1/2 min-w-0 pr-1 sm:pr-2">
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center justify-center bg-red-500/50 px-2 sm:px-3 py-1 border border-white rounded-full text-xs sm:text-sm font-medium self-start hover:bg-red-500/70 transition-colors"
        >
          📖 How to play
        </button>
        
        <div className="font-bold text-sm sm:text-base md:text-lg leading-tight">WinGo 30sec</div>
        
        <div className="flex gap-1 sm:gap-1.5 md:gap-2 mt-1 sm:mt-2">
          {numbers.map((num, idx) => (
            <div key={idx} className="flex-shrink-0">
              <Chip 
                label={num} 
                width={40} 
                height={40} 
                borderWidth={3}
                className="w-4 h-4 sm:w-8 sm:h-8 md:w-10 md:h-10"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Middle Divider */}
      <div className="mx-1 sm:mx-2 md:mx-3 lg:mx-4 self-stretch flex items-center">
        <div className="border-l-2 border-white border-dashed opacity-60 h-12 sm:h-16 md:h-20"></div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-center w-1/2 min-w-0 pl-1 sm:pl-2">
        <div className="text-[10px] sm:text-xs font-medium mb-1">Time remaining</div>
        
        {/* Timer Display */}
        <div className="flex gap-0.5 sm:gap-1 items-center justify-center">
          {/* Minutes */}
          {String(Math.floor(timeLeft / 60))
            .padStart(2, "0")
            .split("")
            .map((digit, idx) => (
              <div
                key={`min-${idx}`}
                className="w-5 h-6 sm:w-6 sm:h-8 md:w-8 md:h-10 flex items-center justify-center bg-white text-black font-extrabold rounded text-xs sm:text-sm md:text-base"
              >
                {digit}
              </div>
            ))}

          {/* Colon */}
          <div className="w-2 sm:w-3 md:w-4 flex items-center justify-center text-white font-extrabold text-sm sm:text-base md:text-lg">
            :
          </div>

          {/* Seconds */}
          {String(timeLeft % 60)
            .padStart(2, "0")
            .split("")
            .map((digit, idx) => (
              <div
                key={`sec-${idx}`}
                className="w-5 h-6 sm:w-6 sm:h-8 md:w-8 md:h-10 flex items-center justify-center bg-white text-black font-extrabold rounded text-xs sm:text-sm md:text-base"
              >
                {digit}
              </div>
            ))}
        </div>
        
        {/* Game ID - Responsive text size and line breaking */}
        <div className="text-[8px] sm:text-[10px] md:text-xs mt-1 tracking-wide font-mono text-center leading-tight break-all">
          20250829100050750
        </div>
      </div>
    </div>
  );
};

export default Timer;