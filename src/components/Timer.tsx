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
    <div className="flex items-center w-full p-4 bg-red-400 rounded-xl text-white relative overflow-hidden">
      {/* Left Section */}
      <div className="flex flex-col gap-2 w-1/2">
        <button onClick={() => setShowModal(true)} className="flex items-center justify-center bg-red-500/50 px-3 py-1 border border-white rounded-full text-sm font-medium">
          📖 How to play
        </button>

        <div className="font-bold text-lg">WinGo 30sec</div>
        <div className="flex gap-2 mt-2">
          {numbers.map((num, idx) => (
            <div
              key={idx}
            >
              <Chip label={num} width={40} height={40} borderWidth={4} />
            </div>
          ))}
        </div>
      </div>

      {/* Middle Divider */}
      <div className="mx-4 self-center h-30 border-l-2 border-white border-dashed"></div>

      <div className="flex flex-col items-center w-1/2">
        <div className="text-xs font-medium">Time remaining</div>
        <div className="flex gap-1 mt-1">
          {String(Math.floor(timeLeft / 60))
            .padStart(2, "0")
            .split("")
            .map((digit, idx) => (
              <div
                key={`min-${idx}`}
                className="w-8 h-10 flex items-center justify-center bg-white text-black font-extrabold rounded-md"
              >
                {digit}
              </div>
            ))}

          {/* Colon */}
          <div className="w-4 flex items-center justify-center text-white font-extrabold text-lg">
            :
          </div>

          {String(timeLeft % 60)
            .padStart(2, "0")
            .split("")
            .map((digit, idx) => (
              <div
                key={`sec-${idx}`}
                className="w-8 h-10 flex items-center justify-center bg-white text-black font-extrabold rounded-md"
              >
                {digit}
              </div>
            ))}
        </div>
        <div className="text-[15px] mt-1 tracking-wide">20250829100050750</div>
      </div>
    </div>
  );
};

export default Timer;
